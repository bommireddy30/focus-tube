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
  statusLabel: document.getElementById("statusLabel"),
  countNumber: document.getElementById("countNumber"),
  playerActionChoice: document.getElementById("playerActionChoice"),
  pillVideo: document.getElementById("pillVideo"),
  pillHome: document.getElementById("pillHome"),
  keywordInput: document.getElementById("keywordInput"),
  addKeyword: document.getElementById("addKeyword"),
  keywordList: document.getElementById("keywordList"),
  suggestedKeywordList: document.getElementById("suggestedKeywordList"),
};

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

function renderStats() {
  el.countNumber.textContent = (currentStats.dailyCount || 0).toString();
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
    renderStats();
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
    renderStats();
  }
});

loadSettings();
loadStats();
