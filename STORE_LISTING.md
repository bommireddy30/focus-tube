# Chrome Web Store listing — draft copy

Reference doc for the Developer Dashboard fields. Not part of the
extension package itself.

## ASO notes

Chrome Web Store has no hidden keywords field — the only text that
feeds search/ranking is the **Title**, **Summary**, and **Description**
below, plus the **Category**. Keywords worked in below: *Shorts
blocker, block YouTube Shorts, distraction-free, focus, digital
wellbeing, productivity, autoplay*. All are woven into sentences that
describe what the extension actually does — CWS policy treats
unnatural keyword repetition/stuffing as spam and can get a listing
rejected or delisted, so resist the urge to pile on more synonyms than
what's below.

## Title (max 45 chars)

```
Focus Tube – Block YouTube Shorts
```
(44 chars — matches `manifest.json` name, keep them in sync)

## Summary (max 132 chars)

```
Shorts blocker for a distraction-free YouTube. Removes Shorts, Mixes & autoplay for focus and digital wellbeing. Free & private.
```
(128 chars)

## Category

Productivity

## Language

English (United States)

## Description

```
Focus Tube is a YouTube Shorts blocker built for focus and digital
wellbeing. It removes Shorts, Mixes, autoplay, and other engagement
hooks from every surface of YouTube — Home, Search, Subscriptions,
History, and channel pages — for a distraction-free, productivity-
friendly viewing experience. Watch what you came to watch, then leave.

Unofficial and independent — not affiliated with, endorsed by, or
sponsored by YouTube or Google.

WHAT IT BLOCKS
• The Shorts player — opening a /shorts/ link redirects to the normal
  watch page or straight home, your choice.
• Shorts shelves — the horizontal carousel on Home and Subscriptions.
• Shorts in search — the shelf and filter chip on search results.
• Loose Shorts — individual Shorts cards anywhere they appear: feeds,
  History, channel pages, up-next.
• Shorts links — the sidebar entry, filter chip, and channel tab.
• Mixes — YouTube's auto-generated "Mixes for you" radio playlists.
• Autoplay — turns off the autoplay toggle on watch pages and removes
  it from the player controls.
• Calm Mode — mutes YouTube's red urgency accents to a neutral color,
  hides the unread-notification badge, and stops thumbnail
  hover-preview autoplay.
• Keywords — hide any video by title, channel name, or description
  text you choose, with an optional whole-word-only match mode.

WHY
Shorts, autoplay, and red urgency badges are deliberate engagement
mechanics, not neutral defaults. Focus Tube turns them off so YouTube
behaves like a tool you use on purpose instead of a feed that pulls you
back in.

PRIVATE BY DESIGN
Focus Tube makes zero network requests. There is no account, no
tracking, no analytics, and nothing is ever sent anywhere. Your
settings sync only through your browser's own built-in extension sync
— the same mechanism it uses for your other extensions — never through
any server Focus Tube controls, because it doesn't have one. Full
privacy policy: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

FREE
Every feature above is free, with no daily cap, no tiers, and no
license key.

OPEN SOURCE
https://github.com/bommireddy30/focus-tube
```

## Single purpose description (Privacy practices tab)

```
Focus Tube's single purpose is to let users hide YouTube Shorts and
other distracting elements (Mixes, autoplay, keyword-matched videos)
from YouTube's own web pages, via a content script that hides matching
elements client-side.
```

## Permission justifications (Privacy practices tab)

**`storage`**
```
Used to save the user's own toggle settings and keyword list
(chrome.storage.sync) and a local daily blocked-count used only for
the in-popup/badge counter (chrome.storage.local). No data leaves the
browser.
```

**Host permission: `*://*.youtube.com/*`**
```
Required so the extension's content script can run on YouTube pages to
find and hide Shorts, Mixes, and keyword-matched video elements in the
DOM. The extension does not read, store, or transmit page content —
matching happens entirely in-memory in the user's own tab.
```

## Data usage disclosures (Privacy practices tab checkboxes)

- Does this item collect or use user data? **No** (all state is stored
  locally/synced via the browser's own extension-storage APIs, never
  transmitted to any server the developer controls)
- Certify compliance with the Developer Program Policies: **Yes**

## Privacy policy URL

```
https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md
```
(Or a GitHub Pages URL if you'd rather it render as a plain webpage
instead of a GitHub markdown file — see README for the one-time setup.)

## Screenshots (1280x800 or 640x400, at least 1, up to 5)

Ready in `store-assets/` — see that folder's README for details on
each:
- `popup.png`
- `youtube-search.png`
- `youtube-watch.png`
- `youtube-home.png`

Optional extras if you want more than the required minimum of 1: the
Keywords card with example keywords added, or Calm Mode's recolored UI
on a watch page (neither captured yet).

## Promo tile (optional, 440x280)

Not included — simple version: extension icon + "Focus Tube" wordmark
on the popup's pastel gradient background (see `--bg` in `popup.css`).
