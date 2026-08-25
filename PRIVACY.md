# Privacy Policy — Focus Tube

**Last updated:** 2026-08-25

Focus Tube is a browser extension that hides YouTube Shorts and
keyword-matched videos. This policy covers what data it does and does not
handle.

## Data collection

Focus Tube collects **no data**. It does not:

- Send any information to a server (it makes no network requests at all)
- Track your browsing history or viewing activity
- Use analytics, telemetry, or crash reporting
- Contain ads or third-party scripts
- Share, sell, or transmit anything to anyone

## What is stored, and where

Focus Tube stores two small pieces of state, entirely on your own device
(or synced only through your own signed-in browser account — never through
Focus Tube's own servers, because it has none):

- **Your settings** (which categories to block, your keyword list) —
  stored via the browser's `storage.sync` API, which is the same
  mechanism the browser itself uses to sync your other extension settings
  across your signed-in devices.
- **A daily blocked-video count** — stored via `storage.local` (this
  device only), used solely to show the "blocked today" number in the
  popup and the toolbar badge. It resets automatically at local midnight
  and is never read by anything outside the extension.

Nothing above ever leaves your browser.

## Permissions

- **`storage`** — required to save your settings and the local block
  count described above.
- **Host access to `*://*.youtube.com/*`** — required so the extension's
  content script can run on YouTube pages to find and hide Shorts,
  Mixes, and keyword-matched videos. This access is used only to read
  and modify the page's DOM in your own browser tab; it is never used to
  read page content elsewhere or send it anywhere.

## Changes to this policy

If this policy changes, the "Last updated" date above will change and the
update will be reflected in the extension's Chrome Web Store listing.

## Contact

Questions about this policy or the extension can be filed as an issue on
the project's GitHub repository:
https://github.com/bommireddy30/focus-tube
