// Focus Tube — content script
//
// Blocking categories: Shorts player, Shorts shelves, Shorts in search,
// Loose Shorts (feeds/history/channels/up-next), Shorts links
// (nav/chip/tab), Mixes, Autoplay, Calm Mode, free-text Keywords, and
// Blocked Channels (a hard, deterministic block by channel identity).
// Everything is free — no daily cap, no tiers, no license keys.
//
// Also tracks watch time per YouTube video category (Education, Autos &
// Vehicles, Entertainment, etc. — YouTube's own official metadata) — see
// the "Watch time & category tracking" section below. Stored only in
// chrome.storage.local, never transmitted anywhere; the one exception to
// "no network calls" elsewhere in this file is a same-origin fetch back to
// youtube.com itself (never a third party) to read a video's own category
// after an in-app navigation — see that section for exactly when and why.
//
// Shadow DOM note: YouTube's newer components render inside shadow roots,
// invisible to plain querySelectorAll/.closest(). deepQueryAll() and
// closestAcrossShadow()/climbToCard() below account for that.

(function () {
  const SETTINGS_KEY = "focusTubeSettings";
  const STATS_KEY = "focusTubeStats";
  const CATEGORY_STATS_KEY = "focusTubeCategoryStats";

  const DEFAULT_SETTINGS = {
    enabled: true,
    blockShortsPlayer: true,
    shortsPlayerAction: "home", // "home" | "video"
    blockShelves: true,
    blockSearchShorts: true,
    blockLooseShorts: true,
    blockShortsLinks: true,
    blockMixes: true,
    disableAutoplay: true,
    calmMode: true,
    keywords: [],
    matchWholeWord: false, // false = substring match, true = whole-word only
    blockedChannels: [], // [{ id, name }] — id is the stable @handle/UCxxxx/legacy-slug when resolvable
  };

  function defaultStats() {
    return { blockedCount: 0 };
  }

  let settings = { ...DEFAULT_SETTINGS };
  let stats = defaultStats();

  // content.css has a static belt-and-braces rule (covers Shorts containers
  // present in the initial HTML before this script's first pass) scoped to
  // this class, so it can be switched off in step with the enabled setting
  // instead of always applying regardless of the toggle. Default to "on"
  // synchronously, before settings have even loaded from storage — this
  // runs at document_start, so guessing enabled=true (the default) here is
  // what prevents a flash of Shorts while the async storage read resolves;
  // syncActiveClass() below corrects it once the real stored value is in.
  document.documentElement.classList.add("focustube-active");
  // Same reasoning, for the Autoplay toggle's CSS rule — default it hidden
  // before settings load; syncAutoplayHideClass() corrects it afterward.
  document.documentElement.classList.add("focustube-hide-autoplay-toggle");
  // Same reasoning again, for Calm Mode's recoloring/badge-hiding rules.
  document.documentElement.classList.add("focustube-calm-mode");

  // Single source of truth for "should blocking actually be happening right
  // now" — every call site (hiding passes, the player redirect, the CSS
  // class) reads this instead of settings.enabled directly.
  function effectivelyEnabled() {
    return !!settings.enabled;
  }

  function syncActiveClass() {
    document.documentElement.classList.toggle("focustube-active", effectivelyEnabled());
  }

  // The in-player Autoplay toggle (.ytp-autonav-toggle-button-container)
  // is owned by the raw video-player chrome, which re-renders its own
  // inline styles on click/state-change — clobbering a one-time
  // el.style.setProperty("display", "none") almost immediately, and our
  // MutationObserver (childList/subtree only) never notices since that's
  // an attribute change, not a node being added/removed, so it never gets
  // re-hidden. A persistent CSS rule (content.css) isn't subject to that
  // churn, so visibility is enforced there instead; this class is just the
  // on/off switch content.css's rule is scoped behind.
  function syncAutoplayHideClass() {
    document.documentElement.classList.toggle(
      "focustube-hide-autoplay-toggle",
      effectivelyEnabled() && !!settings.disableAutoplay
    );
  }

  // Calm Mode's recoloring and notification-badge rules are pure CSS
  // (content.css) scoped behind this class, for the same reason as
  // Autoplay above — nothing here needs a one-time inline style write.
  function syncCalmModeClass() {
    document.documentElement.classList.toggle(
      "focustube-calm-mode",
      effectivelyEnabled() && !!settings.calmMode
    );
  }

  // ---- Surfaces --------------------------------------------------------

  function getSurface() {
    const path = window.location.pathname;
    if (path.startsWith("/feed/history")) return "history";
    if (path.startsWith("/feed/subscriptions")) return "subscriptions";
    if (path.startsWith("/results")) return "search";
    if (path.startsWith("/shorts/")) return "shorts";
    if (path.startsWith("/watch")) return "watch";
    if (path === "/" || path.startsWith("/feed")) return "home";
    if (path.startsWith("/@") || path.startsWith("/channel/") || path.startsWith("/c/")) return "channel";
    return "other";
  }

  // ---- Selectors ---------------------------------------------------------

  const GENERIC_SHORTS_LINK = "a[href^='/shorts/']";

  const CONTAINER_TAG_GUESSES =
    "ytd-reel-shelf-renderer, ytd-shelf-renderer, ytd-rich-shelf-renderer, " +
    "ytd-item-section-renderer, grid-shelf-view-model, yt-shelf-view-model, " +
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, " +
    "ytd-grid-video-renderer, ytd-reel-item-renderer, yt-lockup-view-model, " +
    "ytm-shorts-lockup-view-model";

  // Item-level only (no shelves/sections) — this is what keyword scanning
  // enumerates directly as "one video card" each. Deliberately narrower
  // than CONTAINER_TAG_GUESSES above, which mixes in shelf/section wrapper
  // tags used for a different purpose (climbing UP from some matched
  // sub-element to find the right ancestor to hide). Enumerating those
  // wholesale here would treat an entire shelf of many videos as a single
  // blob of text, which is wrong for per-video keyword matching.
  const VIDEO_ITEM_SELECTORS =
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, " +
    "ytd-grid-video-renderer, ytd-reel-item-renderer, yt-lockup-view-model, " +
    "ytm-shorts-lockup-view-model";

  const CHIP_SELECTOR =
    "yt-chip-cloud-chip-renderer, tp-yt-paper-tab, ytd-search-filter-renderer, " +
    "yt-chip-cloud-chip-view-model, yt-tab-shape, [role='tab'], a[role='tab'], " +
    "tp-yt-paper-tabs a, yt-tab-group-shape a";

  const NAV_SELECTORS = [
    "ytd-guide-entry-renderer:has(a[title='Shorts'])",
    "ytd-mini-guide-entry-renderer:has(a[title='Shorts'])",
  ];

  // Mixes are YouTube's auto-generated "personalized" radio playlists
  // ("Mixes for you", "Your Mix", "Mix" cards inside ordinary shelves).
  // Their shelf headings vary too much to exact-match like "Shorts" does,
  // so MIX_HEADING_PATTERN does a substring/word check instead. The link
  // fallback below is the more reliable signal though — every Mix links to
  // a playlist whose id is prefixed "RD" (YouTube's own convention for
  // radio/mix playlists), so it catches Mix cards regardless of whatever
  // heading text a given layout uses, the same way GENERIC_SHORTS_LINK
  // catches Shorts cards regardless of shelf structure.
  const MIX_HEADING_PATTERN = /\bmix(es)?\b/i;
  const MIX_LINK_SELECTOR = "a[href*='list=RD']";

  // The live Autoplay toggle lives INSIDE the HTML5 video player's own
  // control bar (the .ytp-* prefixed chrome rendered by the player itself,
  // e.g. alongside .ytp-settings-button/.ytp-fullscreen-button) — not
  // among the surrounding ytd-* Polymer page elements. The ytd-*/aria-label
  // guesses are kept as a fallback for whatever layout doesn't use the
  // .ytp-autonav-toggle-button-container structure. Same "expect
  // occasional maintenance" caveat as the Shorts selectors (see README).
  const AUTOPLAY_TOGGLE_SELECTOR =
    ".ytp-autonav-toggle-button-container, ytd-autoplay-mode-toggle, " +
    "ytd-autonav-toggle-button-renderer, [aria-label='Autoplay'], [aria-label*='utoplay' i]";

  // ---- Shadow-DOM aware helpers -----------------------------------------

  function deepQueryAll(selector, root) {
    root = root || document;
    const results = [];
    try {
      root.querySelectorAll(selector).forEach((el) => results.push(el));
    } catch (e) {
      // selector unsupported on this engine — skip
    }
    const all = root.querySelectorAll("*");
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      if (el.shadowRoot) {
        results.push(...deepQueryAll(selector, el.shadowRoot));
      }
    }
    return results;
  }

  function closestAcrossShadow(el, selector) {
    let node = el;
    let hops = 0;
    while (node && hops < 12) {
      if (node.closest) {
        const match = node.closest(selector);
        if (match) return match;
      }
      const root = node.getRootNode ? node.getRootNode() : null;
      if (root && root instanceof ShadowRoot) {
        node = root.host;
      } else {
        break;
      }
      hops++;
    }
    return null;
  }

  function climbToCard(el, maxHops) {
    let node = el;
    let hops = 0;
    let best = el;
    while (node && hops < maxHops) {
      const parent = node.parentElement
        ? node.parentElement
        : node.getRootNode && node.getRootNode() instanceof ShadowRoot
        ? node.getRootNode().host
        : null;
      if (!parent) break;
      node = parent;
      hops++;
      if (node.tagName && /^(YTD-APP|YTD-PAGE-MANAGER|BODY|HTML)$/i.test(node.tagName)) {
        break;
      }
      best = node;
    }
    return best;
  }

  function alreadyHandled(el) {
    return !!(el && el.closest && el.closest("[data-focustube-hidden]"));
  }

  // Concatenates textContent from `root` AND every shadow root nested
  // inside it — a plain .textContent stops at a shadow boundary, so a
  // card's channel name or description (often rendered in a separate
  // shadow-DOM component from the title) would otherwise be invisible
  // to keyword matching.
  function getDeepText(root) {
    let text = root.textContent || "";
    const all = root.querySelectorAll("*");
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      if (el.shadowRoot) {
        text += " " + getDeepText(el.shadowRoot);
      }
    }
    return text;
  }

  function matchesKeyword(haystackLower, keywordLower, wholeWord) {
    if (!wholeWord) return haystackLower.includes(keywordLower);
    const escaped = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      return new RegExp(`\\b${escaped}\\b`, "i").test(haystackLower);
    } catch (e) {
      return haystackLower.includes(keywordLower);
    }
  }

  // `reason` (optional) is stored as the attribute's value instead of a
  // plain "true" flag, so a specific category can later reveal just its
  // own hides via revealByReason() below without disturbing anything
  // hidden for a different reason. alreadyHandled()/revealAll() only ever
  // check for the attribute's presence, not its value, so this is a
  // backward-compatible addition — every existing hideEl(el) call site
  // (no reason passed) keeps behaving exactly as before.
  function hideEl(el, reason) {
    if (!el || !el.style) return false;
    if (el.getAttribute && el.getAttribute("data-focustube-hidden")) return false;
    el.style.setProperty("display", "none", "important");
    if (el.setAttribute) el.setAttribute("data-focustube-hidden", reason || "true");
    return true;
  }

  function findAndHideContainer(el) {
    if (alreadyHandled(el)) return false;
    let container = closestAcrossShadow(el, CONTAINER_TAG_GUESSES);
    if (!container) container = climbToCard(el, 8);
    return hideEl(container || el);
  }

  // Undoes every hide on the page — used when the master toggle is switched
  // off, so flipping it actually restores Shorts/keyword-matched videos
  // instead of just pausing future hides.
  function revealAll() {
    for (const el of deepQueryAll("[data-focustube-hidden]")) {
      el.style.removeProperty("display");
      el.removeAttribute("data-focustube-hidden");
    }
  }

  // Undoes only the hides tagged with a specific reason (see hideEl above)
  // — used when a specific block list shrinks, so removing one entry
  // reveals what it hid without touching anything hidden for an unrelated
  // reason (Shorts, a different keyword, a different blocked channel).
  // Whatever it reveals that's still legitimately blocked for that same
  // reason gets re-hidden within the same tick by the pass that runs right
  // after — this only ever un-hides things that are actually no longer
  // supposed to be hidden.
  function revealByReason(reason) {
    for (const el of deepQueryAll(`[data-focustube-hidden="${reason}"]`)) {
      el.style.removeProperty("display");
      el.removeAttribute("data-focustube-hidden");
    }
  }

  // ---- Category passes ---------------------------------------------------

  function hideShelvesByHeading(headingText) {
    let count = 0;
    const headingSelectors = "#title, [id='title'], span.title, yt-formatted-string#title, h2";
    for (const el of deepQueryAll(headingSelectors)) {
      const txt = el.textContent && el.textContent.trim();
      if (txt !== headingText) continue;
      if (findAndHideContainer(el)) count++;
    }
    return count;
  }

  function hideChipsAndTabsByText(text) {
    let count = 0;
    const wanted = text.trim().toLowerCase();
    deepQueryAll(CHIP_SELECTOR).forEach((el) => {
      const txt = el.textContent && el.textContent.trim().toLowerCase();
      if (txt === wanted && hideEl(el)) count++;
    });
    return count;
  }

  function hideNavEntries() {
    let count = 0;
    NAV_SELECTORS.forEach((selector) => {
      deepQueryAll(selector).forEach((el) => {
        if (hideEl(el)) count++;
      });
    });
    return count;
  }

  function hideLooseShorts() {
    let count = 0;
    for (const link of deepQueryAll(GENERIC_SHORTS_LINK)) {
      if (findAndHideContainer(link)) count++;
    }
    return count;
  }

  // Hides Mixes shelves/cards — see MIX_HEADING_PATTERN/MIX_LINK_SELECTOR
  // above for why this needs two passes (heading text is unreliable,
  // link pattern is the sturdier signal).
  function hideMixes() {
    let count = 0;
    const headingSelectors = "#title, [id='title'], span.title, yt-formatted-string#title, h2";
    for (const el of deepQueryAll(headingSelectors)) {
      const txt = el.textContent && el.textContent.trim();
      if (!txt || !MIX_HEADING_PATTERN.test(txt)) continue;
      if (findAndHideContainer(el)) count++;
    }
    for (const link of deepQueryAll(MIX_LINK_SELECTOR)) {
      if (findAndHideContainer(link)) count++;
    }
    return count;
  }

  function findToggleSwitch(container) {
    if (
      container.hasAttribute &&
      (container.hasAttribute("aria-pressed") || container.hasAttribute("aria-checked"))
    ) {
      return container;
    }
    const nested = deepQueryAll(
      ".ytp-autonav-toggle-button, tp-yt-paper-toggle-button, [role='switch'], [aria-pressed], [aria-checked]",
      container
    );
    return nested[0] || null;
  }

  function isSwitchOn(toggle) {
    const pressed = toggle.getAttribute("aria-pressed");
    if (pressed != null) return pressed === "true";
    const checked = toggle.getAttribute("aria-checked");
    if (checked != null) return checked === "true";
    return toggle.hasAttribute("checked");
  }

  function disableAndHideAutoplay() {
    let count = 0;
    for (const container of deepQueryAll(AUTOPLAY_TOGGLE_SELECTOR)) {
      if (alreadyHandled(container)) continue;
      const toggle = findToggleSwitch(container);
      if (toggle && isSwitchOn(toggle)) {
        toggle.click();
      }
      // Every player control-bar icon (CC, settings, fullscreen, ...) is
      // wrapped in YouTube's own .ytp-button — the element that actually
      // owns the padding/hover hit-area and receives the click. Hiding
      // only the inner container we matched above (its state-holding
      // child) left that outer button rendered empty but still fully
      // clickable — confirmed: an invisible-but-functional toggle. Climb
      // to the real button so we hide/mark the thing users actually see
      // and interact with, not just its contents.
      const target = closestAcrossShadow(container, "button, .ytp-button") || container;
      if (target.classList) target.classList.add("focustube-autoplay-target");
      if (hideEl(target)) count++;
    }
    return count;
  }

  // Part of Calm Mode: the muted mini-video that starts playing when you
  // hover a thumbnail on Home/search is designed to pull you into a video
  // before you've even clicked — content.css hides ytd-video-preview
  // visually, but display:none doesn't pause a <video> element on its
  // own, so this stops it from actually playing (and burning bandwidth)
  // as a belt-and-braces on top of the CSS hide.
  function pauseHoverPreviews() {
    for (const video of deepQueryAll("ytd-video-preview video")) {
      if (!video.paused) {
        try {
          video.pause();
        } catch (e) {
          // no-op — next pass tries again
        }
      }
    }
  }

  // Enumerates VIDEO_ITEM_SELECTORS directly rather than anchoring on a
  // "#video-title" sub-element first — that anchor approach silently
  // found zero cards on layouts where the title element uses a different
  // id (confirmed on the Home feed's newer card components), which meant
  // keyword filtering did nothing at all on those pages despite matching
  // fine elsewhere. Enumerating the card containers themselves has no
  // such dependency. Shared by keyword and channel-block scanning below —
  // both need "one entry per visual video card," not per matched tag.
  function getOuterVideoItemContainers() {
    const candidates = deepQueryAll(VIDEO_ITEM_SELECTORS);
    const candidateSet = new Set(candidates);

    // Keep only the OUTERMOST match per card — some of these tags nest
    // inside each other (e.g. ytd-rich-item-renderer wrapping a
    // ytd-video-renderer), and without this we'd treat one visual card
    // as two separate entries.
    return candidates.filter((el) => {
      let parent = el.parentElement;
      while (parent) {
        if (candidateSet.has(parent)) return false;
        parent = parent.parentElement;
      }
      return true;
    });
  }

  // Scans every video card found on the page once, and reports whether
  // each one matches the active keyword list.
  function scanCardsAgainstKeywords(lowerKeywords, wholeWord) {
    const results = [];
    for (const container of getOuterVideoItemContainers()) {
      if (alreadyHandled(container)) continue;
      const cardText = getDeepText(container).toLowerCase().trim();
      if (!cardText) continue;
      const matched = lowerKeywords.some((kw) => matchesKeyword(cardText, kw, wholeWord));
      results.push({ container, matched });
    }
    return results;
  }

  // Hides any video (Shorts or not) whose title, channel name, or visible
  // description snippet matches a keyword you've added.
  function applyKeywordFilter() {
    if (!settings.keywords || settings.keywords.length === 0) return 0;
    const lowerKeywords = settings.keywords.map((k) => k.toLowerCase()).filter(Boolean);
    if (lowerKeywords.length === 0) return 0;
    const wholeWord = !!settings.matchWholeWord;

    const scanned = scanCardsAgainstKeywords(lowerKeywords, wholeWord);
    let count = 0;
    for (const { container, matched } of scanned) {
      if (matched && hideEl(container)) count++;
    }
    return count;
  }

  // ---- Blocked channels ---------------------------------------------------
  //
  // A hard, deterministic block by channel identity — unlike YouTube's own
  // "Don't recommend this channel," which is only a soft signal to the
  // recommendation algorithm (doesn't touch Search at all, and can fade or
  // get overridden by other signals). This hides every video from a listed
  // channel, on every surface a video card can appear on, the same
  // VIDEO_ITEM_SELECTORS scan Keywords uses.
  //
  // Matches on the channel's id (the stable part of its URL — "@handle",
  // a "UCxxxx" channel id, or a legacy /c//user/ slug) when a card's
  // channel link is found, since display names alone aren't unique (two
  // different channels can share a name). Falls back to a substring match
  // of the channel name against the card's full text — deliberately the
  // same technique (and the same `getDeepText`) Keywords already uses,
  // not an isolated "channel name" sub-element: an earlier version of this
  // feature tried to isolate that element with a narrow selector, and it
  // silently matched nothing on card layouts where that selector didn't
  // line up — the exact failure mode the Keywords section comment above
  // already warns about, now confirmed to bite here too. Scanning the
  // whole card's text is more robust for the same reason it is there.

  const CHANNEL_LINK_SELECTOR =
    "ytd-channel-name a[href], #channel-name a[href], #text.ytd-channel-name a[href], " +
    "yt-formatted-string#text a[href], ytd-video-owner-renderer a[href], " +
    "#byline a[href], ytd-video-meta-block a[href]";

  // Pulls the stable identifier out of a channel URL/path — the part that
  // survives a channel renaming itself, unlike its display name.
  function parseChannelIdFromHref(href) {
    if (!href) return null;
    let path = href;
    try {
      path = href.startsWith("http") ? new URL(href).pathname : href;
    } catch (e) {
      return null;
    }
    const handleMatch = path.match(/\/(@[\w.-]+)/);
    if (handleMatch) return handleMatch[1].toLowerCase();
    const idMatch = path.match(/\/channel\/(UC[\w-]{10,})/i);
    if (idMatch) return idMatch[1];
    const legacyMatch = path.match(/\/(?:c|user)\/([\w-]+)/i);
    if (legacyMatch) return legacyMatch[1].toLowerCase();
    return null;
  }

  function findChannelIdInCard(container) {
    for (const link of deepQueryAll(CHANNEL_LINK_SELECTOR, container)) {
      const id = parseChannelIdFromHref(link.getAttribute("href"));
      if (id) return id;
    }
    return null;
  }

  // Hides every video card whose channel matches an entry in
  // settings.blockedChannels — see the section comment above for why this
  // is id-first (unique, stable, via the card's channel link) with a
  // whole-card text substring fallback (for entries added by typed name,
  // or whenever the link-based lookup above comes up empty).
  function applyChannelBlock() {
    if (!settings.blockedChannels || settings.blockedChannels.length === 0) return 0;

    const blockedIds = new Set();
    const blockedNames = [];
    settings.blockedChannels.forEach((entry) => {
      if (entry.id) blockedIds.add(entry.id.toLowerCase());
      if (entry.name) blockedNames.push(entry.name.trim().toLowerCase());
    });

    let count = 0;
    for (const container of getOuterVideoItemContainers()) {
      if (alreadyHandled(container)) continue;
      const id = findChannelIdInCard(container);
      if (id && blockedIds.has(id.toLowerCase())) {
        if (hideEl(container, "channel")) count++;
        continue;
      }
      const cardText = getDeepText(container).toLowerCase();
      if (!cardText) continue;
      const matched = blockedNames.some((name) => name && cardText.includes(name));
      if (matched && hideEl(container, "channel")) count++;
    }
    return count;
  }

  // ---- Orchestration -------------------------------------------------------

  function runAllPasses() {
    syncActiveClass();
    syncAutoplayHideClass();
    syncCalmModeClass();
    // Independent of the blocking master toggle below — watch-time
    // tracking is an analytics feature, not a hiding pass, and stays live
    // even while blocking itself is switched off.
    maintainWatchTracking();

    if (!effectivelyEnabled()) {
      revealAll();
      return 0;
    }

    const surface = getSurface();
    let hiddenCount = 0;

    if (settings.blockShortsLinks) {
      hideNavEntries();
      hideChipsAndTabsByText("Shorts");
    }

    if (settings.disableAutoplay) {
      disableAndHideAutoplay();
    }

    if (settings.calmMode) {
      pauseHoverPreviews();
    }

    if (settings.blockShelves && (surface === "home" || surface === "subscriptions")) {
      hiddenCount += hideShelvesByHeading("Shorts");
    }

    if (settings.blockSearchShorts && surface === "search") {
      hiddenCount += hideShelvesByHeading("Shorts");
    }

    if (settings.blockLooseShorts) {
      hiddenCount += hideLooseShorts();
    }

    if (settings.blockMixes) {
      hideChipsAndTabsByText("Mixes");
      hiddenCount += hideMixes();
    }

    hiddenCount += applyKeywordFilter();
    hiddenCount += applyChannelBlock();

    return hiddenCount;
  }

  function redirectIfShortsPage() {
    if (!effectivelyEnabled() || !settings.blockShortsPlayer) return;
    const match = window.location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
    if (!match) return;
    if (settings.shortsPlayerAction === "home") {
      window.location.replace("https://www.youtube.com/");
    } else {
      window.location.replace(`https://www.youtube.com/watch?v=${match[1]}`);
    }
  }

  // ---- Watch time & category tracking (local only, never transmitted) ----
  //
  // Classifies whichever video is currently open using YouTube's own
  // official category metadata (the same field YouTube Studio shows
  // creators — "Education", "Autos & Vehicles", "Entertainment", etc.,
  // with a "Live" override for anything that originated as a live
  // broadcast), plus a few more fields pulled from the same source: the
  // creator's own tags (for the "last watched" card — finer-grained than
  // the one broad official category), video length (to show % watched),
  // and an upload-recency bucket derived from publishDate. All read from
  // the video's embedded ytInitialPlayerResponse data. Watch time itself
  // accumulates how many seconds of that video's actual footage played
  // (via <video> timeupdate deltas, not wall-clock time — so scrubbing
  // past a section doesn't count, pausing doesn't lose already-accumulated
  // time, and 2x playback correctly counts as consuming content twice as
  // fast). Totals persist in chrome.storage.local until the user resets
  // them from the popup's Watch Stats tab (no daily rollover, unlike the
  // block-count badge).
  //
  // ytInitialPlayerResponse lives in the page's own JS context (window),
  // which an isolated-world content script can't see — but it's also
  // embedded as plain JSON text inside an inline <script> tag, which IS
  // visible to a content script without executing any page JS. That covers
  // the common case (a fresh page load) at zero extra network cost. YouTube
  // is a single-page app though, so navigating from one video to the next
  // without a full reload leaves that inline script tag stale; the only
  // way to get the new video's official category then is to ask YouTube
  // for it — same-origin fetch() of that video's own watch page (no
  // third party involved, just the site already being browsed), scraping
  // the same ytInitialPlayerResponse field out of the response.

  const UNCATEGORIZED_CATEGORY = "Uncategorized";
  const WATCH_FLUSH_INTERVAL_MS = 8000;
  // Guards against a seek/scrub or a stall-then-jump being misread as
  // continuous playback — a real timeupdate tick lands well under this.
  const MAX_TIMEUPDATE_DELTA_SEC = 1.5;

  // Scans forward from `startIndex` (which must point at an opening `{`)
  // tracking brace depth and string state, so a `}` inside a quoted string
  // (e.g. a video description containing literal braces) doesn't end the
  // match early — a plain non-greedy regex can't do this reliably.
  function extractBalancedJson(text, startIndex) {
    let depth = 0;
    let inString = false;
    let stringChar = "";
    let escaped = false;
    for (let i = startIndex; i < text.length; i++) {
      const ch = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) return text.slice(startIndex, i + 1);
      }
    }
    return null;
  }

  function extractPlayerResponseFromText(text) {
    const markerIdx = text.indexOf("ytInitialPlayerResponse");
    if (markerIdx === -1) return null;
    const braceIdx = text.indexOf("{", markerIdx);
    if (braceIdx === -1) return null;
    const jsonText = extractBalancedJson(text, braceIdx);
    if (!jsonText) return null;
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      return null;
    }
  }

  // Videos that originated as a live broadcast keep videoDetails.isLiveContent
  // true forever (even long after the stream ends and it's just a VOD
  // replay) — this is YouTube's own flag, not something we infer, and past-
  // live content behaves differently enough (unedited, often long-form) to
  // warrant its own bucket rather than whatever official category it
  // happens to carry.
  const LIVE_CATEGORY = "Live";
  // Overrides whatever official category a video carries whenever it's
  // being watched through the Shorts swipe-feed surface itself (see
  // getSurface()'s "shorts" branch) — this reflects the short-form
  // consumption pattern, not an inherent property of the video, so a
  // video watched normally at /watch still gets its real category even
  // if it happens to also exist as a Short elsewhere. Only reachable at
  // all when Shorts aren't being redirected away (blocking off, or
  // blockShortsPlayer off) — see maintainWatchTracking().
  const SHORTS_CATEGORY = "Shorts";
  const MAX_TAGS = 5;

  function bucketForPublishDate(publishDate) {
    if (!publishDate) return "Unknown";
    const published = new Date(publishDate);
    if (isNaN(published.getTime())) return "Unknown";
    const days = (Date.now() - published.getTime()) / 86400000;
    if (days < 0) return "Unknown"; // clock skew / bad data guard
    if (days <= 30) return "Recent";
    if (days <= 365) return "This year";
    return "Older";
  }

  // Pulls everything Watch Stats uses out of a player response in one
  // place: category (YouTube's own, with the Live override above),
  // length, the creator's own tags (for the "last watched" card — a
  // finer-grained signal than the one broad official category), and the
  // upload-recency bucket derived from publishDate.
  function metaFromPlayerResponse(pr) {
    const vd = (pr && pr.videoDetails) || {};
    const mf = (pr && pr.microformat && pr.microformat.playerMicroformatRenderer) || {};
    const isLive = !!vd.isLiveContent;
    const category = isLive ? LIVE_CATEGORY : mf.category || UNCATEGORIZED_CATEGORY;
    const lengthSeconds = parseInt(vd.lengthSeconds || mf.lengthSeconds || "0", 10) || 0;
    const tags = Array.isArray(vd.keywords) ? vd.keywords.slice(0, MAX_TAGS) : [];
    const publishDate = mf.publishDate || mf.uploadDate || "";
    return {
      category,
      title: vd.title || "",
      lengthSeconds,
      tags,
      recencyBucket: bucketForPublishDate(publishDate),
    };
  }

  function tryReadEmbeddedPlayerResponse(videoId) {
    for (const s of document.querySelectorAll("script")) {
      const text = s.textContent;
      if (!text || text.indexOf("ytInitialPlayerResponse") === -1) continue;
      const pr = extractPlayerResponseFromText(text);
      if (pr && pr.videoDetails && pr.videoDetails.videoId === videoId) return pr;
    }
    return null;
  }

  async function fetchPlayerResponseFromWatchPage(videoId) {
    const res = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
      credentials: "include",
    });
    const html = await res.text();
    return extractPlayerResponseFromText(html);
  }

  const videoMetaCache = new Map(); // videoId -> { category, title, lengthSeconds, tags, recencyBucket }
  const videoMetaFetchPromises = new Map(); // videoId -> in-flight Promise

  // Resolves watch-stats metadata for a video, preferring data already
  // embedded in the current page (covers a fresh page load for free) and
  // falling back to fetching the video's own watch page only when the SPA
  // has navigated to a different video without a full reload.
  function resolveVideoMeta(videoId) {
    if (videoMetaCache.has(videoId)) return Promise.resolve(videoMetaCache.get(videoId));
    if (videoMetaFetchPromises.has(videoId)) return videoMetaFetchPromises.get(videoId);

    const promise = (async () => {
      let pr = tryReadEmbeddedPlayerResponse(videoId);
      if (!pr) {
        try {
          pr = await fetchPlayerResponseFromWatchPage(videoId);
        } catch (e) {
          pr = null;
        }
      }
      const result = metaFromPlayerResponse(pr);
      videoMetaCache.set(videoId, result);
      return result;
    })();

    videoMetaFetchPromises.set(videoId, promise);
    promise.finally(() => videoMetaFetchPromises.delete(videoId));
    return promise;
  }

  // A Shorts URL carries its video id in the path (/shorts/<id>), not the
  // ?v= query param /watch pages use — Watch Stats needs both forms to
  // track Shorts consumption at all.
  function getVideoIdFromUrl() {
    const shortsMatch = window.location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return shortsMatch[1];
    return new URLSearchParams(window.location.search).get("v") || "";
  }

  // On Shorts, several <video> elements can coexist in the DOM at once —
  // adjacent items in the vertical swipe feed, kept mounted for smooth
  // scrolling — so grabbing the first DOM match (fine on a normal /watch
  // page, which only ever has one) can silently pick a paused/inactive
  // neighbor whose currentTime never advances. That would look like
  // tracking "started" (a tracker object exists) while never actually
  // accumulating anything, since its timeupdate events never fire.
  function findWatchVideoEl() {
    const candidates = Array.from(
      document.querySelectorAll(
        "video.html5-main-video, #movie_player video, #shorts-player video, " +
          "ytd-shorts video, ytd-reel-video-renderer video"
      )
    );
    if (candidates.length === 0) {
      // Last-resort generic fallback, same philosophy as the Shorts-card
      // hiding passes elsewhere in this file: better to find *a* video
      // than silently track nothing if a future YouTube layout change
      // breaks every guess above.
      return document.querySelector("video");
    }
    if (candidates.length === 1) return candidates[0];
    return (
      candidates.find((v) => !v.paused && v.currentTime > 0) ||
      candidates.find((v) => !v.paused) ||
      candidates[0]
    );
  }

  function defaultCategoryStats() {
    return { totals: {}, recencyTotals: {}, lastVideo: null };
  }

  // Read-modify-write against fresh storage (rather than an in-memory
  // running total) so two YouTube tabs open at once don't clobber each
  // other's accumulated seconds — each flush only ever adds its own delta
  // on top of whatever is currently persisted. `lastVideo` deliberately
  // holds only the single most-recently-watched video, not a history list —
  // it resets to a fresh { seconds } count whenever tracking moves to a
  // different videoId, and keeps accumulating while you stay on the same one.
  function persistWatchedSeconds(videoId, meta, seconds) {
    if (seconds <= 0) return;
    try {
      chrome.storage.local.get(CATEGORY_STATS_KEY, (result) => {
        const catStats = { ...defaultCategoryStats(), ...(result && result[CATEGORY_STATS_KEY]) };
        catStats.totals = { ...catStats.totals };
        catStats.totals[meta.category] = (catStats.totals[meta.category] || 0) + seconds;

        catStats.recencyTotals = { ...catStats.recencyTotals };
        catStats.recencyTotals[meta.recencyBucket] = (catStats.recencyTotals[meta.recencyBucket] || 0) + seconds;

        const last = catStats.lastVideo;
        catStats.lastVideo =
          last && last.videoId === videoId
            ? {
                ...last,
                seconds: last.seconds + seconds,
                category: meta.category,
                title: meta.title || last.title,
                lengthSeconds: meta.lengthSeconds || last.lengthSeconds,
                tags: meta.tags && meta.tags.length ? meta.tags : last.tags,
                lastWatchedAt: Date.now(),
              }
            : {
                videoId,
                title: meta.title || "(untitled)",
                category: meta.category,
                seconds,
                lengthSeconds: meta.lengthSeconds || 0,
                tags: meta.tags || [],
                lastWatchedAt: Date.now(),
              };

        chrome.storage.local.set({ [CATEGORY_STATS_KEY]: catStats });
      });
    } catch (e) {
      // non-critical
    }
  }

  let watchTracker = null; // { videoId, videoEl, category, title, lengthSeconds, tags, recencyBucket, accumulatedSec, lastTime, onTimeUpdate, flushTimer }

  function flushWatchTracker() {
    if (!watchTracker) return;
    const seconds = Math.round(watchTracker.accumulatedSec);
    watchTracker.accumulatedSec -= seconds;
    if (seconds > 0) {
      persistWatchedSeconds(
        watchTracker.videoId,
        {
          title: watchTracker.title,
          category: watchTracker.category,
          lengthSeconds: watchTracker.lengthSeconds,
          tags: watchTracker.tags,
          recencyBucket: watchTracker.recencyBucket,
        },
        seconds
      );
    }
  }

  function stopWatchTracking() {
    if (!watchTracker) return;
    flushWatchTracker();
    if (watchTracker.videoEl) {
      watchTracker.videoEl.removeEventListener("timeupdate", watchTracker.onTimeUpdate);
    }
    if (watchTracker.flushTimer) clearInterval(watchTracker.flushTimer);
    watchTracker = null;
  }

  function startWatchTracking(videoId, videoEl) {
    const fallbackTitle = (document.title || "").replace(/ - YouTube$/, "").trim();
    const isShorts = getSurface() === "shorts";

    watchTracker = {
      videoId,
      videoEl,
      category: isShorts ? SHORTS_CATEGORY : UNCATEGORIZED_CATEGORY,
      title: fallbackTitle,
      lengthSeconds: 0,
      tags: [],
      recencyBucket: "Unknown",
      accumulatedSec: 0,
      lastTime: videoEl.currentTime || 0,
    };

    // Metadata resolves asynchronously — the tracker starts accumulating
    // immediately under placeholder values so a slow lookup never loses
    // watch time, then gets corrected in place the moment it resolves, as
    // long as the video hasn't changed again since. The Shorts override
    // stays pinned regardless of what the resolved official category
    // turns out to be — see the SHORTS_CATEGORY comment above for why.
    resolveVideoMeta(videoId).then((meta) => {
      if (watchTracker && watchTracker.videoId === videoId) {
        watchTracker.category = isShorts ? SHORTS_CATEGORY : meta.category;
        watchTracker.lengthSeconds = meta.lengthSeconds;
        watchTracker.tags = meta.tags;
        watchTracker.recencyBucket = meta.recencyBucket;
        if (meta.title) watchTracker.title = meta.title;
      }
    });

    watchTracker.onTimeUpdate = () => {
      if (!watchTracker) return;
      if (videoEl.paused || videoEl.seeking) {
        watchTracker.lastTime = videoEl.currentTime;
        return;
      }
      const delta = videoEl.currentTime - watchTracker.lastTime;
      watchTracker.lastTime = videoEl.currentTime;
      if (delta > 0 && delta < MAX_TIMEUPDATE_DELTA_SEC) {
        watchTracker.accumulatedSec += delta;
      }
    };
    videoEl.addEventListener("timeupdate", watchTracker.onTimeUpdate);
    watchTracker.flushTimer = setInterval(flushWatchTracker, WATCH_FLUSH_INTERVAL_MS);
  }

  // Cheap no-op unless the watch page's video actually changed — safe to
  // call on every debounced pass alongside the blocking passes. Always on:
  // there is no setting to disable Watch Stats and no reset control —
  // it tracks continuously, independent of the blocking master toggle, on
  // both /watch pages and the Shorts surface. Shorts only stay reachable
  // here when they're not being redirected away — i.e. whenever blocking
  // is off, or blockShortsPlayer specifically is off — since
  // redirectIfShortsPage() swaps the URL before this ever sees "shorts"
  // as the surface otherwise.
  function maintainWatchTracking() {
    const surface = getSurface();
    if (surface !== "watch" && surface !== "shorts") {
      if (watchTracker) stopWatchTracking();
      return;
    }

    const videoId = getVideoIdFromUrl();
    if (!videoId) return;

    if (watchTracker && watchTracker.videoId !== videoId) {
      stopWatchTracking();
    }
    if (watchTracker) return; // already tracking this video

    const videoEl = findWatchVideoEl();
    if (!videoEl) return; // player not mounted yet — retry next pass

    startWatchTracking(videoId, videoEl);
  }

  // ---- Stats (local, per device — badge only, informational, no cap) ------

  function persistStats() {
    try {
      chrome.storage.local.set({ [STATS_KEY]: stats });
    } catch (e) {
      // non-critical
    }
  }

  function loadSettings(callback) {
    try {
      chrome.storage.sync.get(SETTINGS_KEY, (result) => {
        if (result && result[SETTINGS_KEY]) {
          settings = { ...DEFAULT_SETTINGS, ...result[SETTINGS_KEY] };
        }
        chrome.storage.local.get(STATS_KEY, (statsResult) => {
          stats = { ...defaultStats(), ...(statsResult && statsResult[STATS_KEY]) };
          callback();
        });
      });
    } catch (e) {
      callback();
    }
  }

  function runAndPersist() {
    const newlyHidden = runAllPasses();
    if (newlyHidden > 0) {
      stats.blockedCount += newlyHidden;
      persistStats();
    }
  }

  // ---- Lifecycle -------------------------------------------------------------

  let debounceTimer = null;
  function scheduleRun() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runAndPersist, 150);
  }

  function init() {
    redirectIfShortsPage();
    runAndPersist();

    const observer = new MutationObserver(() => scheduleRun());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("yt-navigate-finish", () => {
      redirectIfShortsPage();
      scheduleRun();
    });

    // Best-effort flush of whatever watch time has accumulated but not yet
    // hit storage (up to WATCH_FLUSH_INTERVAL_MS worth) before the tab
    // closes or navigates away from youtube.com entirely.
    window.addEventListener("pagehide", () => stopWatchTracking());
  }

  loadSettings(init);

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[SETTINGS_KEY]) {
      settings = { ...DEFAULT_SETTINGS, ...changes[SETTINGS_KEY].newValue };
      // Covers re-enabling (or turning blockShortsPlayer on) while already
      // sitting on a /shorts/ URL — e.g. disabled -> opened a Short -> it's
      // playing -> re-enabled mid-playback. Without this, the toggle only
      // affected hiding passes; the redirect check ran only on page load
      // and SPA navigation, so a Short already open would keep playing
      // uninterrupted until you navigated somewhere else yourself.
      redirectIfShortsPage();
      // Un-hide whatever the channel-block pass hid, so removing a channel
      // from the list actually brings its videos back instead of leaving
      // them hidden until a reload. Anything that's still blocked (a
      // different channel entry, or this same one if it wasn't actually
      // removed) gets re-hidden immediately below by runAndPersist() — the
      // reveal only ever sticks for entries that are genuinely gone now.
      revealByReason("channel");
      runAndPersist();
    }
  });
})();
