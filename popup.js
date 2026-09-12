const SETTINGS_KEY = "focusTubeSettings";
const STATS_KEY = "focusTubeStats";
const CATEGORY_STATS_KEY = "focusTubeCategoryStats";

const DEFAULT_SETTINGS = {
  enabled: true,
  blockShortsPlayer: true,
  shortsPlayerAction: "home",
  blockShelves: true,
  blockSearchShorts: true,
  blockLooseShorts: true,
  blockShortsLinks: true,
  blockMixes: true,
  disableAutoplay: true,
  calmMode: true,
  keywords: [],
  matchWholeWord: false,
  blockedChannels: [], // [{ id, name }] — id is the stable @handle/UCxxxx/legacy-slug when resolvable
  autoBlockAfterWatch: false, // once 60% of a video has been watched, block its channel AND its name everywhere else (see blockedNames)
  blockedNames: [], // [{ name, expiresAt }] — auto-added only; matches any video mentioning that name, any channel
  theme: "system", // "system" | "light" | "dark" — see applyTheme() in popup.js and the dark-theme comment in popup.css
};

function defaultStats() {
  return { blockedCount: 0 };
}

function defaultCategoryStats() {
  return { totals: {}, recencyTotals: {}, dailyTotals: {}, lastVideo: null };
}

// content.js now classifies purely from YouTube's own official video
// category metadata, an open-ended set (~15 names) rather than a fixed 7 —
// so colors are assigned by a fixed name->slot lookup for the categories
// people actually see most, with a deterministic hash fallback for any
// other official category name YouTube ever returns. Either way a given
// category name always maps to the same slot (never reassigned by current
// rank), and "Uncategorized" — plus anything folded into "Other" past the
// pie's top 6 — always renders in the neutral gray, never a hue slot.
// Colors validated as a set via the dataviz skill's validate_palette.js
// (fixed hue order is the CVD-safety mechanism; do not reorder).
const CATEGORY_COLOR_SLOTS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
];
const CATEGORY_COLOR_TABLE = {
  Entertainment: "var(--series-1)",
  Education: "var(--series-2)",
  "Howto & Style": "var(--series-3)",
  Gaming: "var(--series-4)",
  Music: "var(--series-5)",
  Comedy: "var(--series-6)",
  "People & Blogs": "var(--series-7)",
  "Science & Technology": "var(--series-8)",
};
const OTHER_COLOR = "var(--series-other)";
const OTHER_CATEGORY_LABEL = "Other";
const PIE_MAX_SLICES = 6; // beyond this, the smallest remainder folds into "Other" (dataviz: pie is legible only to ~6 segments)

// "Shorts" gets a dedicated 9th slot rather than a hash fallback, since
// it's the one category this whole extension is about. Deliberately
// NOT var(--accent): validating the current brand accent (#B81103) as a
// 9th categorical color via the dataviz skill's validate_palette.js
// --pairs all came back FAIL — it collides with series-4 (green,
// "Gaming") under deuteranopia, ΔE 5.4, well below even the floor band.
// var(--series-shorts) in popup.css is the closest red-family shade that
// actually clears the check, kept as a separate token specifically so
// this chart color and the UI accent color can diverge safely if the
// brand accent ever changes again.
const SHORTS_COLOR = "var(--series-shorts)";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function colorForCategory(category) {
  if (!category || category === "Uncategorized" || category === OTHER_CATEGORY_LABEL) return OTHER_COLOR;
  if (category === "Shorts") return SHORTS_COLOR;
  if (CATEGORY_COLOR_TABLE[category]) return CATEGORY_COLOR_TABLE[category];
  return CATEGORY_COLOR_SLOTS[hashString(category) % CATEGORY_COLOR_SLOTS.length];
}

// Upload-recency buckets (content.js's bucketForPublishDate) are ordinal —
// order carries meaning (fresher uploads first) — so unlike the categorical
// pie above, this uses a single-hue ramp with monotone lightness rather
// than the 8-hue categorical set. Validated via the dataviz skill's
// validate_palette.js --ordinal (light end still clears 2:1 contrast on
// this popup's own --card surface). "Unknown" (no publish date available)
// is the same neutral gray used elsewhere for "we don't know", not part of
// the ramp.
const RECENCY_ORDER = ["Recent", "This year", "Older", "Unknown"];
const RECENCY_COLOR_TABLE = {
  Recent: "var(--seq-600)",
  "This year": "var(--seq-450)",
  Older: "var(--seq-300)",
  Unknown: "var(--series-other)",
};

function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${sec}s`;
}

// Suggestions only — nothing here is applied automatically. Picked to be
// fairly specific clickbait/outrage phrasing rather than generic single
// words (e.g. "prank" or "reaction"), since a broad word risks silently
// hiding videos from channels someone actually wants to watch — the whole
// point is these read as a deliberate, informed choice per word.
const SUGGESTED_KEYWORDS = [
  {
    category: "Rage bait & hostility",
    words: ["exposed", "slams", "destroys", "obliterates", "meltdown", "outrage", "backlash", "controversy"],
  },
  {
    category: "Clickbait & hype",
    words: ["you won't believe", "shocking", "gone wrong", "clickbait", "must watch", "game changer"],
  },
];

const TOGGLE_FIELDS = [
  "enabled",
  "blockShortsPlayer",
  "blockShelves",
  "blockSearchShorts",
  "blockLooseShorts",
  "blockShortsLinks",
  "blockMixes",
  "disableAutoplay",
  "calmMode",
  "matchWholeWord",
  "autoBlockAfterWatch",
];

// The fields inside the "What to block" disclosure specifically (a subset
// of TOGGLE_FIELDS — excludes "enabled", which lives in the header as the
// master toggle, and "matchWholeWord", which belongs to the Keywords
// card). Every one of these defaults to true, so "nothing customized"
// really does mean "nothing worth showing by default."
const BLOCK_SETTING_FIELDS = [
  "blockShortsPlayer",
  "blockShelves",
  "blockSearchShorts",
  "blockLooseShorts",
  "blockShortsLinks",
  "blockMixes",
  "disableAutoplay",
  "calmMode",
];

let currentSettings = { ...DEFAULT_SETTINGS };
let currentStats = defaultStats();
let currentCategoryStats = defaultCategoryStats();

const el = {
  settings: document.getElementById("settings"),
  statusLabel: document.getElementById("statusLabel"),
  countNumber: document.getElementById("countNumber"),
  playerActionChoice: document.getElementById("playerActionChoice"),
  pillVideo: document.getElementById("pillVideo"),
  pillHome: document.getElementById("pillHome"),
  themeSystem: document.getElementById("themeSystem"),
  themeLight: document.getElementById("themeLight"),
  themeDark: document.getElementById("themeDark"),
  keywordInput: document.getElementById("keywordInput"),
  addKeyword: document.getElementById("addKeyword"),
  keywordList: document.getElementById("keywordList"),
  suggestedKeywordList: document.getElementById("suggestedKeywordList"),
  channelInput: document.getElementById("channelInput"),
  addChannel: document.getElementById("addChannel"),
  channelList: document.getElementById("channelList"),
  blockedNamesRow: document.getElementById("blockedNamesRow"),
  blockedNamesList: document.getElementById("blockedNamesList"),
  tabBar: document.getElementById("tabBar"),
  tabPanelBlocking: document.getElementById("tabPanelBlocking"),
  tabPanelStats: document.getElementById("tabPanelStats"),
  totalWatchTime: document.getElementById("totalWatchTime"),
  categoryPie: document.getElementById("categoryPie"),
  categoryLegend: document.getElementById("categoryLegend"),
  recentVideosCard: document.getElementById("recentVideosCard"),
  lastVideoCard: document.getElementById("lastVideoCard"),
  recencyBar: document.getElementById("recencyBar"),
  recencyLegend: document.getElementById("recencyLegend"),
  timeAllTotal: document.getElementById("timeAllTotal"),
  timeByMonth: document.getElementById("timeByMonth"),
  timeByWeek: document.getElementById("timeByWeek"),
  timeByDay: document.getElementById("timeByDay"),
};

// ---- Disclosures (collapsible sections) -------------------------------
//
// Every collapsible section is a `.disclosure` button (id + data-target)
// paired with a body element of that target id. Sections auto-expand once
// on load if they already hold something worth seeing (your keywords,
// your blocked channels, a setting you've changed from its default, watch
// time that's actually been recorded) — otherwise they start collapsed,
// so the popup isn't front-loading data nobody asked to see. Once you've
// manually opened or closed a section yourself, that choice sticks for
// the rest of this popup session; auto-expand never fights you over it.

const manuallyToggledDisclosures = new Set();

function setDisclosureExpanded(toggleId, expanded) {
  const btn = document.getElementById(toggleId);
  if (!btn) return;
  const body = document.getElementById(btn.dataset.target);
  btn.setAttribute("aria-expanded", String(expanded));
  if (body) body.hidden = !expanded;
}

function expandIfNeeded(toggleId, shouldExpand) {
  if (!shouldExpand || manuallyToggledDisclosures.has(toggleId)) return;
  setDisclosureExpanded(toggleId, true);
}

document.querySelectorAll(".disclosure[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    manuallyToggledDisclosures.add(btn.id);
    setDisclosureExpanded(btn.id, btn.getAttribute("aria-expanded") !== "true");
  });
});

// "system" removes the override entirely so the CSS @media query (zero JS,
// zero flash) drives it; "light"/"dark" set data-theme so the always-on
// :root[data-theme="..."] rule in popup.css forces that theme regardless
// of what the OS prefers. See the dark-theme comment in popup.css for why
// there's no separate "light" override rule — the plain :root defaults
// already are the light theme.
function applyTheme() {
  const mode = currentSettings.theme || "system";
  if (mode === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }
  el.themeSystem.classList.toggle("selected", mode === "system");
  el.themeLight.classList.toggle("selected", mode === "light");
  el.themeDark.classList.toggle("selected", mode === "dark");
}

function renderToggles() {
  TOGGLE_FIELDS.forEach((field) => {
    const input = document.getElementById(field);
    if (input) input.checked = !!currentSettings[field];
  });

  el.settings.classList.toggle("disabled", !currentSettings.enabled);
  el.statusLabel.textContent = currentSettings.enabled ? "Blocking is on" : "Blocking is off";

  el.playerActionChoice.classList.toggle("disabled", !currentSettings.blockShortsPlayer);
  el.pillVideo.classList.toggle("selected", currentSettings.shortsPlayerAction === "video");
  el.pillHome.classList.toggle("selected", currentSettings.shortsPlayerAction === "home");

  applyTheme();

  const hasCustomizedBlocking = BLOCK_SETTING_FIELDS.some(
    (field) => currentSettings[field] !== DEFAULT_SETTINGS[field]
  );
  expandIfNeeded("settingsToggle", hasCustomizedBlocking);
}

function renderKeywords() {
  el.keywordList.innerHTML = "";
  (currentSettings.keywords || []).forEach((word) => {
    const chip = document.createElement("span");
    chip.className = "keyword-chip";
    chip.textContent = word;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      currentSettings.keywords = currentSettings.keywords.filter((w) => w !== word);
      saveSettings();
      renderKeywords();
    });

    chip.appendChild(removeBtn);
    el.keywordList.appendChild(chip);
  });

  expandIfNeeded("keywordsToggle", (currentSettings.keywords || []).length > 0);

  // Suggested chips need to reflect "already added" state, which changes
  // whenever the underlying keyword list does (including removals via the
  // × button above) — simplest to just re-render both together here
  // rather than trying to keep two render paths in sync separately.
  renderSuggestedKeywords();
}

function toggleSuggestedKeyword(word) {
  const lower = word.toLowerCase();
  const existing = new Set((currentSettings.keywords || []).map((w) => w.toLowerCase()));
  if (existing.has(lower)) {
    currentSettings.keywords = currentSettings.keywords.filter((w) => w.toLowerCase() !== lower);
  } else {
    currentSettings.keywords = [...(currentSettings.keywords || []), word];
  }
  saveSettings();
  renderKeywords();
}

function renderSuggestedKeywords() {
  el.suggestedKeywordList.innerHTML = "";
  const existing = new Set((currentSettings.keywords || []).map((w) => w.toLowerCase()));

  SUGGESTED_KEYWORDS.forEach((group) => {
    const groupLabel = document.createElement("p");
    groupLabel.className = "suggested-group-label";
    groupLabel.textContent = group.category;
    el.suggestedKeywordList.appendChild(groupLabel);

    const row = document.createElement("div");
    row.className = "suggested-row";
    group.words.forEach((word) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "suggested-chip" + (existing.has(word.toLowerCase()) ? " added" : "");
      chip.textContent = word;
      chip.addEventListener("click", () => toggleSuggestedKeyword(word));
      row.appendChild(chip);
    });
    el.suggestedKeywordList.appendChild(row);
  });
}

// ---- Blocked channels --------------------------------------------------

// Two entries are "the same channel" by id when both resolved one (ids are
// unique and stable — a channel renaming its display name doesn't change
// its @handle/UCxxxx), falling back to name comparison only when at least
// one side has no id (e.g. typed in by hand rather than pasted as a URL).
function isSameChannel(a, b) {
  if (a.id && b.id) return a.id.toLowerCase() === b.id.toLowerCase();
  return (a.name || "").trim().toLowerCase() === (b.name || "").trim().toLowerCase();
}

// Accepts a full channel URL, a bare @handle, a bare channel ID, or a
// plain display name typed by hand — same flexibility as pasting a link
// into a browser address bar. Falls back to treating the whole input as a
// display name (id: null) when nothing URL-shaped is recognized, which
// content.js then matches by rendered channel-name text instead of a link.
function parseChannelInput(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let path = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      path = new URL(trimmed).pathname;
    } catch (e) {
      path = trimmed;
    }
  }

  const handleMatch = path.match(/\/?(@[\w.-]+)/);
  if (handleMatch) {
    const id = handleMatch[1].toLowerCase();
    return { id, name: handleMatch[1] };
  }
  const idMatch = path.match(/\/channel\/(UC[\w-]{10,})/i);
  if (idMatch) {
    return { id: idMatch[1], name: idMatch[1] };
  }
  const legacyMatch = path.match(/\/(?:c|user)\/([\w-]+)/i);
  if (legacyMatch) {
    return { id: legacyMatch[1].toLowerCase(), name: legacyMatch[1] };
  }
  // A bare channel ID pasted without a URL around it (e.g. copied straight
  // out of a "Copy channel ID" button) — same shape /channel/ matches
  // above, just without the path prefix.
  if (/^UC[\w-]{10,}$/i.test(trimmed)) {
    return { id: trimmed, name: trimmed };
  }

  // No URL-shaped identifier found — treat the raw input as a display name.
  return { id: null, name: trimmed };
}

function renderChannelList() {
  el.channelList.innerHTML = "";
  (currentSettings.blockedChannels || []).forEach((channel) => {
    const chip = document.createElement("span");
    chip.className = "keyword-chip channel-chip";
    // expiresAt only ever appears on entries this feature added itself
    // (see triggerAutoBlock in content.js) — anything typed in by hand has
    // none, so this label only ever shows up on the ones that'll expire.
    chip.textContent = channel.name + (channel.expiresAt ? " (today)" : "");

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      currentSettings.blockedChannels = currentSettings.blockedChannels.filter(
        (c) => !isSameChannel(c, channel)
      );
      saveSettings();
      renderChannelList();
    });

    chip.appendChild(removeBtn);
    el.channelList.appendChild(chip);
  });

  expandIfNeeded("channelsToggle", (currentSettings.blockedChannels || []).length > 0);
}

// blockedNames is auto-added only (see triggerAutoBlock in content.js) —
// there's no input row here, just chips you can remove early if you want
// a name back before it expires on its own at midnight.
function renderBlockedNamesList() {
  const names = currentSettings.blockedNames || [];
  el.blockedNamesList.innerHTML = "";
  names.forEach((entry) => {
    const chip = document.createElement("span");
    chip.className = "keyword-chip channel-chip";
    chip.textContent = entry.name + " (today)";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      currentSettings.blockedNames = currentSettings.blockedNames.filter((n) => n.name !== entry.name);
      saveSettings();
      renderBlockedNamesList();
    });

    chip.appendChild(removeBtn);
    el.blockedNamesList.appendChild(chip);
  });

  if (el.blockedNamesRow) el.blockedNamesRow.hidden = names.length === 0;
}

function addChannelFromInput() {
  const parsed = parseChannelInput(el.channelInput.value);
  if (!parsed) return;

  const existing = currentSettings.blockedChannels || [];
  if (!existing.some((c) => isSameChannel(c, parsed))) {
    currentSettings.blockedChannels = [...existing, parsed];
    saveSettings();
    renderChannelList();
  }
  el.channelInput.value = "";
}

el.addChannel.addEventListener("click", addChannelFromInput);
el.channelInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addChannelFromInput();
  }
});

function renderStats() {
  el.countNumber.textContent = (currentStats.blockedCount || 0).toString();
}

// ---- Tabs ------------------------------------------------------------------

function selectTab(tab) {
  const isStats = tab === "stats";
  el.tabPanelBlocking.classList.toggle("hidden", isStats);
  el.tabPanelStats.classList.toggle("hidden", !isStats);
  el.tabBar.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.tab === tab);
  });
}

el.tabBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  selectTab(btn.dataset.tab);
});

// ---- Watch stats (category breakdown + recently watched) -------------------

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// Ranks categories by watch time and folds anything past the top 6 into a
// single "Other" slice — a pie stays legible only to ~6 segments (dataviz
// skill), past that adjacent slices blur together regardless of color.
// "Other" is always placed last, never competing on rank with real
// categories, since it's a display fold rather than an identity of its own.
function rankCategoriesForPie(totals) {
  const entries = Object.entries(totals).filter(([, seconds]) => seconds > 0);
  entries.sort((a, b) => b[1] - a[1]);

  const top = entries.slice(0, PIE_MAX_SLICES);
  const rest = entries.slice(PIE_MAX_SLICES);
  const otherSeconds = rest.reduce((sum, [, seconds]) => sum + seconds, 0);

  const slices = top.map(([name, seconds]) => ({ name, seconds, color: colorForCategory(name) }));
  if (otherSeconds > 0) {
    slices.push({ name: OTHER_CATEGORY_LABEL, seconds: otherSeconds, color: OTHER_COLOR });
  }
  return slices;
}

const PIE_CENTER = 75;
const PIE_OUTER_R = 65;
const PIE_INNER_R = 38;
const PIE_GAP_PX = 2; // surface-color gap between slices, not a stroke border (dataviz: never draw a border to separate marks)

function polarPoint(cx, cy, r, angle) {
  return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
}

// A donut slice is an annular sector: outer arc, straight edge in, inner
// arc back, straight edge out to close.
function donutSlicePath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const o1 = polarPoint(cx, cy, outerR, startAngle);
  const o2 = polarPoint(cx, cy, outerR, endAngle);
  const i1 = polarPoint(cx, cy, innerR, startAngle);
  const i2 = polarPoint(cx, cy, innerR, endAngle);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function renderCategoryPie() {
  const totals = currentCategoryStats.totals || {};
  const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);
  el.totalWatchTime.textContent = formatDuration(grandTotal);

  if (grandTotal <= 0) {
    // Empty state: an unfilled track, same idiom as a meter with nothing in it.
    const midR = (PIE_OUTER_R + PIE_INNER_R) / 2;
    el.categoryPie.innerHTML = `<circle cx="${PIE_CENTER}" cy="${PIE_CENTER}" r="${midR}" fill="none" stroke="var(--bg)" stroke-width="${PIE_OUTER_R - PIE_INNER_R}" />`;
    return;
  }

  const slices = rankCategoriesForPie(totals);
  const midR = (PIE_OUTER_R + PIE_INNER_R) / 2;
  const gapAngle = slices.length > 1 ? PIE_GAP_PX / midR : 0;

  let angle = 0;
  const paths = slices
    .map((slice) => {
      const span = (slice.seconds / grandTotal) * Math.PI * 2;
      const start = angle + gapAngle / 2;
      const end = angle + span - gapAngle / 2;
      angle += span;
      if (end <= start) return ""; // slice too thin to render once the gap is subtracted
      const d = donutSlicePath(PIE_CENTER, PIE_CENTER, PIE_OUTER_R, PIE_INNER_R, start, end);
      return `<path d="${d}" fill="${slice.color}"><title>${escapeHtml(slice.name)} — ${formatDuration(slice.seconds)}</title></path>`;
    })
    .join("");

  el.categoryPie.innerHTML = paths;
}

function renderCategoryLegend() {
  const totals = currentCategoryStats.totals || {};
  const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);
  const slices = grandTotal > 0 ? rankCategoriesForPie(totals) : [];

  el.categoryLegend.innerHTML = "";
  if (slices.length === 0) {
    const empty = document.createElement("p");
    empty.className = "section-sub";
    empty.style.margin = "0";
    empty.textContent = "No watch time recorded yet.";
    el.categoryLegend.appendChild(empty);
    return;
  }

  slices.forEach((slice) => {
    const pct = Math.round((slice.seconds / grandTotal) * 100);
    const row = document.createElement("div");
    row.className = "category-legend-row";
    row.innerHTML = `
      <span class="category-legend-swatch" style="background:${slice.color}"></span>
      <span class="category-legend-name">${escapeHtml(slice.name)}</span>
      <span class="category-legend-pct">${pct}%</span>
      <span class="category-legend-time">${formatDuration(slice.seconds)}</span>
    `;
    el.categoryLegend.appendChild(row);
  });
}

// "Recently watched" deliberately shows only the single most-recently
// tracked video (content.js's lastVideo, not a history list) — its
// category, how many minutes of it were actually watched (plus % of the
// video's own length, when known), and the creator's own top tags as a
// finer-grained signal than the one broad official category.
function renderLastVideo() {
  const last = currentCategoryStats.lastVideo;
  el.recentVideosCard.classList.toggle("empty", !last);
  if (!last) {
    el.lastVideoCard.innerHTML = "";
    return;
  }
  const color = colorForCategory(last.category);

  let timeText = formatDuration(last.seconds);
  if (last.lengthSeconds > 0) {
    const pct = Math.min(100, Math.round((last.seconds / last.lengthSeconds) * 100));
    timeText += ` of ${formatDuration(last.lengthSeconds)} (${pct}%)`;
  }

  const tagsHtml =
    last.tags && last.tags.length
      ? `<span class="last-video-tags">${escapeHtml(last.tags.join(", "))}</span>`
      : "";

  el.lastVideoCard.innerHTML = `
    <div class="last-video-info">
      <span class="last-video-title" title="${escapeHtml(last.title)}">${escapeHtml(last.title)}</span>
      <span class="last-video-meta">
        <span class="last-video-category" style="background:${color}">${escapeHtml(last.category)}</span>
        <span>${timeText}</span>
      </span>
      ${tagsHtml}
    </div>
  `;
}

// Upload recency: a single-hue ordinal bar (Recent -> This year -> Older,
// darkest-to-lightest) rather than a second pie — order carries meaning
// here, and a second donut right next to the category one would compete
// for attention over a chart form that's already the right shape for an
// ordered breakdown (dataviz: ordinal ramp for ordered categories).
function renderRecencyBar() {
  const totals = currentCategoryStats.recencyTotals || {};
  const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);
  const buckets = RECENCY_ORDER.map((name) => ({ name, seconds: totals[name] || 0 })).filter(
    (b) => b.seconds > 0
  );

  el.recencyBar.innerHTML = "";
  el.recencyLegend.innerHTML = "";
  expandIfNeeded("recencyToggle", grandTotal > 0);

  if (grandTotal <= 0) {
    const track = document.createElement("div");
    track.className = "recency-segment recency-segment-empty";
    el.recencyBar.appendChild(track);
    const empty = document.createElement("p");
    empty.className = "section-sub";
    empty.style.margin = "0";
    empty.textContent = "No watch time recorded yet.";
    el.recencyLegend.appendChild(empty);
    return;
  }

  buckets.forEach((bucket) => {
    const pct = (bucket.seconds / grandTotal) * 100;
    const seg = document.createElement("div");
    seg.className = "recency-segment";
    seg.style.flex = `${pct} 0 0`;
    seg.style.background = RECENCY_COLOR_TABLE[bucket.name] || RECENCY_COLOR_TABLE.Unknown;
    seg.title = `${bucket.name} — ${formatDuration(bucket.seconds)}`;
    el.recencyBar.appendChild(seg);

    const row = document.createElement("div");
    row.className = "category-legend-row";
    row.innerHTML = `
      <span class="category-legend-swatch" style="background:${RECENCY_COLOR_TABLE[bucket.name] || RECENCY_COLOR_TABLE.Unknown}"></span>
      <span class="category-legend-name">${escapeHtml(bucket.name)}</span>
      <span class="category-legend-pct">${Math.round(pct)}%</span>
      <span class="category-legend-time">${formatDuration(bucket.seconds)}</span>
    `;
    el.recencyLegend.appendChild(row);
  });
}

// ---- Watch stats (time spent: all-time, month/week/day breakdowns) --------

// Local calendar-day key, matching content.js's localDateKey() — the key
// dailyTotals is bucketed on, so this has to compute identically.
function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Sums whole calendar days in [startDate, endDateExclusive) — a handful of
// iterations at most (a week or a month), so a plain day-by-day walk over
// dailyTotals is simpler than pre-indexing by week/month.
function sumDailyTotalsInRange(dailyTotals, startDate, endDateExclusive) {
  let sum = 0;
  const cursor = new Date(startDate);
  while (cursor < endDateExclusive) {
    sum += dailyTotals[localDateKey(cursor)] || 0;
    cursor.setDate(cursor.getDate() + 1);
  }
  return sum;
}

// Monday of the week containing `date` — weeks are Mon-Sun throughout the
// day/week breakdown below.
function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatShortDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function renderTimeSpent() {
  const dailyTotals = currentCategoryStats.dailyTotals || {};
  const totals = currentCategoryStats.totals || {};
  const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);
  el.timeAllTotal.textContent = formatDuration(grandTotal);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Today, yesterday, the day before — each its own row, current day first.
  const dayRows = [0, 1, 2].map((offset) => {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - offset);
    const seconds = dailyTotals[localDateKey(d)] || 0;
    const label = offset === 0 ? "Today" : offset === 1 ? "Yesterday" : formatShortDate(d);
    return { label, seconds, current: offset === 0 };
  });

  // This week, last week, the week before — Mon-Sun, current week first.
  const thisWeekStart = startOfWeek(todayStart);
  const weekRows = [0, 1, 2].map((offset) => {
    const start = new Date(thisWeekStart);
    start.setDate(start.getDate() - offset * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const seconds = sumDailyTotalsInRange(dailyTotals, start, end);
    const endInclusive = new Date(end);
    endInclusive.setDate(endInclusive.getDate() - 1);
    const label = offset === 0 ? "This week" : offset === 1 ? "Last week" : "2 weeks ago";
    const sub = `${formatShortDate(start)} – ${formatShortDate(endInclusive)}`;
    return { label, sub, seconds, current: offset === 0 };
  });

  // This month, last month, the month before — calendar months, current first.
  const monthRows = [0, 1, 2].map((offset) => {
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
    const seconds = sumDailyTotalsInRange(dailyTotals, start, end);
    const monthName = start.toLocaleDateString(undefined, { month: "long" });
    const label = offset === 0 ? "This month" : start.getFullYear() !== now.getFullYear() ? `${monthName} ${start.getFullYear()}` : monthName;
    return { label, seconds, current: offset === 0 };
  });

  renderTimeStatGroup(el.timeByDay, dayRows);
  renderTimeStatGroup(el.timeByWeek, weekRows);
  renderTimeStatGroup(el.timeByMonth, monthRows);

  expandIfNeeded("timeSpentToggle", grandTotal > 0);
}

function renderTimeStatGroup(container, rows) {
  container.innerHTML = "";
  rows.forEach((row) => {
    const div = document.createElement("div");
    div.className = "time-stat-row" + (row.current ? " current" : "");
    const subHtml = row.sub ? `<span class="time-stat-sub">${escapeHtml(row.sub)}</span>` : "";
    div.innerHTML = `
      <span class="time-stat-label">${escapeHtml(row.label)}${subHtml}</span>
      <span class="time-stat-value">${formatDuration(row.seconds)}</span>
    `;
    container.appendChild(div);
  });
}

function renderCategorySection() {
  renderCategoryPie();
  renderCategoryLegend();
  renderLastVideo();
  renderRecencyBar();
  renderTimeSpent();
}

function saveSettings() {
  chrome.storage.sync.set({ [SETTINGS_KEY]: currentSettings });
}

// Mirrors content.js's own purge (see isExpiredEntry/purgeExpiredAutoBlocks
// there) so the popup never shows a chip for a channel or name that's
// already expired — content.js only re-checks this when a YouTube tab
// actually runs a pass, which the popup can't assume has happened yet today.
function isExpiredEntry(entry) {
  return typeof entry.expiresAt === "number" && Date.now() >= entry.expiresAt;
}

function loadSettings() {
  chrome.storage.sync.get(SETTINGS_KEY, (result) => {
    currentSettings = { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) };
    const keptChannels = (currentSettings.blockedChannels || []).filter((c) => !isExpiredEntry(c));
    const keptNames = (currentSettings.blockedNames || []).filter((n) => !isExpiredEntry(n));
    if (
      keptChannels.length !== (currentSettings.blockedChannels || []).length ||
      keptNames.length !== (currentSettings.blockedNames || []).length
    ) {
      currentSettings.blockedChannels = keptChannels;
      currentSettings.blockedNames = keptNames;
      saveSettings();
    }
    renderToggles();
    renderKeywords();
    renderChannelList();
    renderBlockedNamesList();
  });
}

function loadStats() {
  chrome.storage.local.get(STATS_KEY, (result) => {
    currentStats = { ...defaultStats(), ...(result[STATS_KEY] || {}) };
    renderStats();
  });
}

function loadCategoryStats() {
  chrome.storage.local.get(CATEGORY_STATS_KEY, (result) => {
    currentCategoryStats = { ...defaultCategoryStats(), ...(result[CATEGORY_STATS_KEY] || {}) };
    renderCategorySection();
  });
}

// Toggle wiring
TOGGLE_FIELDS.forEach((field) => {
  const input = document.getElementById(field);
  if (!input) return;
  input.addEventListener("change", () => {
    currentSettings[field] = input.checked;
    saveSettings();
    renderToggles();
  });
});

// Player action pills
[el.pillVideo, el.pillHome].forEach((pill) => {
  pill.addEventListener("click", () => {
    currentSettings.shortsPlayerAction = pill.dataset.value;
    saveSettings();
    renderToggles();
  });
});

// Theme pills
[el.themeSystem, el.themeLight, el.themeDark].forEach((pill) => {
  pill.addEventListener("click", () => {
    currentSettings.theme = pill.dataset.value;
    saveSettings();
    renderToggles();
  });
});

// Keywords
function addKeywordFromInput() {
  const raw = el.keywordInput.value.trim();
  if (!raw) return;
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const existing = new Set((currentSettings.keywords || []).map((w) => w.toLowerCase()));
  parts.forEach((p) => {
    if (!existing.has(p.toLowerCase())) {
      currentSettings.keywords.push(p);
      existing.add(p.toLowerCase());
    }
  });
  el.keywordInput.value = "";
  saveSettings();
  renderKeywords();
}

el.addKeyword.addEventListener("click", addKeywordFromInput);
el.keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addKeywordFromInput();
  }
});

// Keep popup live if settings/stats change elsewhere while open
chrome.storage.onChanged.addListener((changes) => {
  if (changes[SETTINGS_KEY]) {
    currentSettings = { ...DEFAULT_SETTINGS, ...changes[SETTINGS_KEY].newValue };
    renderToggles();
    renderKeywords();
    renderChannelList();
    renderBlockedNamesList();
  }
  if (changes[STATS_KEY]) {
    currentStats = { ...defaultStats(), ...changes[STATS_KEY].newValue };
    renderStats();
  }
  if (changes[CATEGORY_STATS_KEY]) {
    currentCategoryStats = { ...defaultCategoryStats(), ...changes[CATEGORY_STATS_KEY].newValue };
    renderCategorySection();
  }
});

loadSettings();
loadStats();
loadCategoryStats();
