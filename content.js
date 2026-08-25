// Focus Tube — content script
//
// Blocking categories: Shorts player, Shorts shelves, Shorts in search,
// Loose Shorts (feeds/history/channels/up-next), Shorts links
// (nav/chip/tab), and free-text Keywords.
//
// FREE_LIMIT below is a placeholder 100/day gate tracked entirely in
// chrome.storage.local (this device only). Once dailyCount reaches it,
// effectivelyEnabled() forces blocking off for the rest of the day
// regardless of the user's own `enabled` toggle — flipping the popup
// switch back on, or writing `enabled: true` into focusTubeSettings
// directly, has no effect, because the quota check is a separate,
// independent gate rather than something the toggle can override. That's
// the intended "locked until you upgrade" behavior.
//
// Caveat this DOESN'T cover: someone editing focusTubeStats itself in
// DevTools (e.g. setting dailyCount back to 0) to reset the quota early —
// there's no way to close that off with only chrome.storage.local as the
// source of truth, since the extension has no way to tell a legitimate
// midnight rollover apart from a manually edited one. TODO: once a
// backend exists, replace this local dailyCount with a server-verified
// count (keyed off the account/subscription, not something the client can
// just overwrite) — see popup.js's PLANS for the tier ladder this is
// meant to grow into. Silver/Gold/Platinum aren't functional yet; only
// Free's cap is actually enforced, and only as well as local storage can
// enforce anything.
//
// Shadow DOM note: YouTube's newer components render inside shadow roots,
// invisible to plain querySelectorAll/.closest(). deepQueryAll() and
// closestAcrossShadow()/climbToCard() below account for that.

(function () {
  const SETTINGS_KEY = "focusTubeSettings";
  const STATS_KEY = "focusTubeStats";
  const FREE_LIMIT = 100;

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
  };

  function defaultStats() {
    return { dailyCount: 0, dailyDate: getLocalDateString() };
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

  // Only Free's cap is real right now (see FREE_LIMIT note above) — this
  // is where a future tier lookup would replace the flat 100 comparison.
  function quotaExceeded() {
    return stats.dailyCount >= FREE_LIMIT;
  }

  // Single source of truth for "should blocking actually be happening right
  // now" — combines the user's own toggle with the daily quota, so every
  // call site (hiding passes, the player redirect, the CSS class) agrees
  // on when to act like the extension is off.
  function effectivelyEnabled() {
    return !!settings.enabled && !quotaExceeded();
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

  function getLocalDateString(d) {
    d = d || new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // ---- Surfaces --------------------------------------------------------

  function getSurface() {
    const path = window.location.pathname;
    if (path.startsWith("/feed/history")) return "history";
    if (path.startsWith("/feed/subscriptions")) return "subscriptions";
    if (path.startsWith("/results")) return "search";
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

  function hideEl(el) {
    if (!el || !el.style) return false;
    if (el.getAttribute && el.getAttribute("data-focustube-hidden")) return false;
    el.style.setProperty("display", "none", "important");
    if (el.setAttribute) el.setAttribute("data-focustube-hidden", "true");
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

  // Unmetered — this is a preference/UI-chrome removal (like the nav/chip
  // passes), not a piece of content being blocked, so it doesn't count
  // toward the daily quota.
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

  // Scans every video card found on the page once, and reports whether
  // each one matches the active keyword list.
  //
  // Enumerates VIDEO_ITEM_SELECTORS directly rather than anchoring on a
  // "#video-title" sub-element first — that anchor approach silently
  // found zero cards on layouts where the title element uses a different
  // id (confirmed on the Home feed's newer card components), which meant
  // keyword filtering did nothing at all on those pages despite matching
  // fine elsewhere. Enumerating the card containers themselves has no
  // such dependency.
  function scanCardsAgainstKeywords(lowerKeywords, wholeWord) {
    const results = [];
    const candidates = deepQueryAll(VIDEO_ITEM_SELECTORS);
    const candidateSet = new Set(candidates);

    // Keep only the OUTERMOST match per card — some of these tags nest
    // inside each other (e.g. ytd-rich-item-renderer wrapping a
    // ytd-video-renderer), and without this we'd treat one visual card
    // as two separate entries.
    const outer = candidates.filter((el) => {
      let parent = el.parentElement;
      while (parent) {
        if (candidateSet.has(parent)) return false;
        parent = parent.parentElement;
      }
      return true;
    });

    for (const container of outer) {
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

  // ---- Orchestration -------------------------------------------------------

  function runAllPasses() {
    syncActiveClass();
    syncAutoplayHideClass();
    syncCalmModeClass();

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

  // ---- Stats (local, per device — drives the badge AND the 100/day gate) --

  function ensureDailyRollover() {
    const today = getLocalDateString();
    if (stats.dailyDate !== today) {
      stats.dailyDate = today;
      stats.dailyCount = 0;
      persistStats();
    }
  }

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
          ensureDailyRollover();
          callback();
        });
      });
    } catch (e) {
      callback();
    }
  }

  function runAndPersist() {
    ensureDailyRollover();
    const newlyHidden = runAllPasses();
    if (newlyHidden > 0) {
      stats.dailyCount += newlyHidden;
      persistStats();
    }
    // The batch that pushes dailyCount past FREE_LIMIT is hidden *during*
    // runAllPasses(), before it can know the count is about to cross the
    // line — so without this, those just-hidden elements would stay
    // hidden until some later DOM mutation happened to trigger another
    // pass. Re-checking here, right after the count updates, makes the
    // reveal immediate instead of dependent on further page activity.
    if (quotaExceeded()) {
      revealAll();
      syncActiveClass();
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
      runAndPersist();
    }
  });
})();
