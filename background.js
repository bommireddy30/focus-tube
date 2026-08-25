// Focus Tube — background service worker
//
// Content scripts cannot call chrome.action.setBadgeText themselves —
// that API is only available to extension pages (background, popup), not
// content scripts. This worker's only job is to watch the stats content
// scripts write to chrome.storage.local and mirror dailyCount onto the
// toolbar icon badge whenever it changes, regardless of which YouTube tab
// caused the change.

const STATS_KEY = "focusTubeStats";

function formatBadgeText(count) {
  if (!count) return "";
  if (count > 999) return "999+";
  return String(count);
}

function updateBadge(stats) {
  const count = (stats && stats.dailyCount) || 0;
  chrome.action.setBadgeText({ text: formatBadgeText(count) });
  chrome.action.setBadgeBackgroundColor({ color: "#ff8a5c" });
  chrome.action.setBadgeTextColor
    ? chrome.action.setBadgeTextColor({ color: "#ffffff" })
    : null; // older Chrome versions don't support this call — harmless no-op
}

// Set the badge immediately on worker startup (covers browser restart).
chrome.storage.local.get(STATS_KEY, (result) => {
  updateBadge(result && result[STATS_KEY]);
});

// Keep it live as counts change from any tab.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[STATS_KEY]) {
    updateBadge(changes[STATS_KEY].newValue);
  }
});
