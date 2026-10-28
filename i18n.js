// Focus Tube — popup localization
//
// By default every string comes from chrome.i18n, which picks
// _locales/<lang>/messages.json from the browser's UI language (falling
// back to _locales/en via manifest.json's default_locale). That's the
// shipping behavior: nothing to configure, it just follows the browser.
//
// For testing a translation without changing the browser's language,
// a locale override can be forced two ways — both bypass chrome.i18n and
// read the messages.json files directly (English filling any missing key):
//   1. Open the popup as a tab with ?lang=xx, e.g.
//      chrome-extension://<extension-id>/popup.html?lang=ja
//   2. In the popup's DevTools console (right-click popup → Inspect):
//      chrome.storage.local.set({ focusTubeLocaleOverride: "de" })
//      …then reopen the popup. Undo with
//      chrome.storage.local.remove("focusTubeLocaleOverride")
//
// Markup opts in with data-i18n (textContent), data-i18n-placeholder and
// data-i18n-aria-label; the English text left inline in popup.html is only
// what shows if a key were ever missing.

const I18N = (() => {
  const LOCALE_OVERRIDE_KEY = "focusTubeLocaleOverride";
  const SUPPORTED_LOCALES = ["en", "ja", "de"];

  let overrideMessages = null; // set only while an override is active
  let fallbackMessages = null; // English, for keys an override locale lacks
  let locale = chrome.i18n.getUILanguage();

  // Same substitution rules as chrome.i18n.getMessage: named $NAME$
  // placeholders resolve to their "content" ($1, $2, …), which resolve to
  // the substitutions passed in.
  function format(entry, subs) {
    const placeholders = entry.placeholders || {};
    return entry.message
      .replace(/\$([A-Za-z0-9_@]+)\$/g, (match, name) => {
        const p = placeholders[name.toLowerCase()];
        return p ? p.content : match;
      })
      .replace(/\$(\d)/g, (match, i) => (subs[i - 1] !== undefined ? subs[i - 1] : ""));
  }

  // Returns "" for an unknown key (same as chrome.i18n.getMessage), so
  // callers like category() can tell "untranslated" from a real string.
  function lookup(key, subs = []) {
    const strSubs = subs.map(String);
    if (overrideMessages) {
      const entry = overrideMessages[key] || fallbackMessages[key];
      return entry ? format(entry, strSubs) : "";
    }
    return chrome.i18n.getMessage(key, strSubs);
  }

  function t(key, subs) {
    return lookup(key, subs) || key;
  }

  // Category/recency names are stored in English (they're storage keys in
  // content.js's stats), so they're translated only at display time; any
  // name YouTube returns that has no message shows as-is.
  function category(name) {
    return lookup("cat_" + String(name).replace(/[^A-Za-z0-9]/g, "")) || name;
  }

  function recency(name) {
    return lookup("recency_" + String(name).replace(/[^A-Za-z0-9]/g, "")) || name;
  }

  function translateDom(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      const text = lookup(node.dataset.i18n);
      if (text) node.textContent = text;
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const text = lookup(node.dataset.i18nPlaceholder);
      if (text) node.placeholder = text;
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      const text = lookup(node.dataset.i18nAriaLabel);
      if (text) node.setAttribute("aria-label", text);
    });
    document.documentElement.lang = locale;
  }

  async function loadMessages(lang) {
    const res = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
    return res.json();
  }

  async function resolveOverride() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl) return fromUrl;
    try {
      const result = await chrome.storage.local.get(LOCALE_OVERRIDE_KEY);
      return result[LOCALE_OVERRIDE_KEY] || null;
    } catch (e) {
      return null;
    }
  }

  const ready = (async () => {
    const override = await resolveOverride();
    if (!override || !SUPPORTED_LOCALES.includes(override)) return;
    try {
      [overrideMessages, fallbackMessages] = await Promise.all([loadMessages(override), loadMessages("en")]);
      locale = override;
    } catch (e) {
      overrideMessages = fallbackMessages = null; // fall back to chrome.i18n
    }
  })();

  return {
    ready,
    t,
    category,
    recency,
    translateDom,
    get locale() {
      return locale;
    },
  };
})();
