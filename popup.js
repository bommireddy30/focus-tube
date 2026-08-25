const SETTINGS_KEY = "focusTubeSettings";
const STATS_KEY = "focusTubeStats";

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
};

function defaultStats() {
  return { dailyCount: 0, dailyDate: "" };
}

// Must match content.js's FREE_LIMIT — there's no backend yet, so this is
// the only tier that's actually enforced. See content.js's top-of-file
// comment for the plan to make Silver/Gold/Platinum real later.
const FREE_LIMIT = 100;

// Showpiece only — clicking these doesn't do anything real yet, and no
// checkout exists. Prices are INR.
const PLANS = [
  { key: "free", name: "Free", limit: FREE_LIMIT, price: 0 },
  { key: "silver", name: "Silver", limit: 500, price: 30 },
  { key: "gold", name: "Gold", limit: 1000, price: 50 },
  { key: "platinum", name: "Platinum", limit: Infinity, price: 200 },
];

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
];

let currentSettings = { ...DEFAULT_SETTINGS };
let currentStats = defaultStats();

const el = {
  settings: document.getElementById("settings"),
  keywordsCard: document.getElementById("keywordsCard"),
  enabledInput: document.getElementById("enabled"),
  statusLabel: document.getElementById("statusLabel"),
  countNumber: document.getElementById("countNumber"),
  countLimit: document.getElementById("countLimit"),
  quotaBarFill: document.getElementById("quotaBarFill"),
  statNote: document.getElementById("statNote"),
  limitBanner: document.getElementById("limitBanner"),
  playerActionChoice: document.getElementById("playerActionChoice"),
  pillVideo: document.getElementById("pillVideo"),
  pillHome: document.getElementById("pillHome"),
  keywordInput: document.getElementById("keywordInput"),
  addKeyword: document.getElementById("addKeyword"),
  keywordList: document.getElementById("keywordList"),
  suggestedKeywordList: document.getElementById("suggestedKeywordList"),
  planList: document.getElementById("planList"),
};

// True once today's free quota is used up. content.js enforces the actual
// blocking-stops-regardless-of-the-toggle behavior on its own (it doesn't
// trust this popup) — this is purely about making the popup UI honest and
// physically un-clickable while locked, so there's no control here that
// *looks* like it re-enables blocking but silently does nothing. Note this
// is still just a client-side read of chrome.storage.local: someone could
// edit focusTubeStats directly in DevTools to reset dailyCount and get
// around it. That's expected until there's a backend verifying the count
// server-side instead of trusting local storage — see the TODO in
// content.js next to FREE_LIMIT.
function isLocked() {
  return (currentStats.dailyCount || 0) >= FREE_LIMIT;
}

function renderToggles() {
  const locked = isLocked();

  TOGGLE_FIELDS.forEach((field) => {
    const input = document.getElementById(field);
    if (input) input.checked = !!currentSettings[field];
  });

  el.enabledInput.disabled = locked;

  el.settings.classList.toggle("disabled", !currentSettings.enabled);
  el.settings.classList.toggle("locked", locked);
  el.keywordsCard.classList.toggle("locked", locked);

  el.statusLabel.textContent = locked
    ? "Locked — daily limit reached"
    : currentSettings.enabled
    ? "Blocking is on"
    : "Blocking is off";

  el.playerActionChoice.classList.toggle("disabled", !currentSettings.blockShortsPlayer);
  el.pillVideo.classList.toggle("selected", currentSettings.shortsPlayerAction === "video");
  el.pillHome.classList.toggle("selected", currentSettings.shortsPlayerAction === "home");
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

function renderQuota() {
  const count = currentStats.dailyCount || 0;
  const exceeded = isLocked();

  el.countNumber.textContent = count.toString();
  el.countLimit.textContent = `/ ${FREE_LIMIT} today`;

  const pct = Math.min(100, Math.round((count / FREE_LIMIT) * 100));
  el.quotaBarFill.style.width = `${pct}%`;
  el.quotaBarFill.className = "quota-bar-fill" + (pct >= 100 ? " full" : pct >= 80 ? " warn" : "");

  el.statNote.textContent = exceeded
    ? "Free plan — limit reached, resets at midnight"
    : "Free plan — resets at midnight";

  el.limitBanner.hidden = !exceeded;

  // Lock state depends on currentStats, which loads/updates on its own
  // timeline separate from currentSettings — re-render the toggle side too
  // so the master switch's disabled state never lags behind the count.
  renderToggles();
}

function renderPlans() {
  el.planList.innerHTML = "";
  PLANS.forEach((plan) => {
    const tile = document.createElement("div");
    tile.className = "plan-tile plan-" + plan.key;

    const name = document.createElement("span");
    name.className = "plan-name";
    name.textContent = plan.name;

    const limit = document.createElement("span");
    limit.className = "plan-limit";
    limit.textContent = plan.limit === Infinity ? "Unlimited" : `${plan.limit}/day`;

    const price = document.createElement("span");
    price.className = "plan-price";
    price.textContent = `₹${plan.price}`;

    const action = document.createElement(plan.key === "free" ? "span" : "button");
    if (plan.key === "free") {
      action.className = "plan-current";
      action.textContent = "Current plan";
    } else {
      action.type = "button";
      action.className = "plan-btn";
      action.textContent = "Coming soon";
      action.disabled = true;
    }

    tile.append(name, limit, price, action);
    el.planList.appendChild(tile);
  });
}

function saveSettings() {
  chrome.storage.sync.set({ [SETTINGS_KEY]: currentSettings });
}

function loadSettings() {
  chrome.storage.sync.get(SETTINGS_KEY, (result) => {
    currentSettings = { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) };
    renderToggles();
    renderKeywords();
  });
}

function loadStats() {
  chrome.storage.local.get(STATS_KEY, (result) => {
    currentStats = { ...defaultStats(), ...(result[STATS_KEY] || {}) };
    renderQuota();
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
  }
  if (changes[STATS_KEY]) {
    currentStats = { ...defaultStats(), ...changes[STATS_KEY].newValue };
    renderQuota();
  }
});

loadSettings();
loadStats();
renderPlans();
