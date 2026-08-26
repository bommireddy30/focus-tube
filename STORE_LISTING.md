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
• Watch Stats — a pie chart of how many minutes you watch per YouTube
  category (Education, Entertainment, Autos & Vehicles, Howto & Style,
  and so on — YouTube's own official metadata), plus a "last watched"
  card. Runs continuously and stays on your device; there's no in-app
  toggle to disable it or reset the data.

WHY
Shorts, autoplay, and red urgency badges are deliberate engagement
mechanics, not neutral defaults. Focus Tube turns them off so YouTube
behaves like a tool you use on purpose instead of a feed that pulls you
back in.

PRIVATE BY DESIGN
Focus Tube talks to no third party and no server it controls — nothing
is ever sent anywhere, and there's no account or analytics. Watch Stats
reads each video's official YouTube category and tracks watch time
entirely on-device (chrome.storage.local); it's never transmitted.
Reading that category occasionally involves a same-origin request back
to youtube.com itself — never a third party — to pick up a newly-opened
video's metadata; see the privacy policy for details. Your settings sync
only through your browser's own built-in extension sync — the same
mechanism it uses for your other extensions — never through any server
Focus Tube controls, because it doesn't have one. Full privacy policy:
https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

FREE
Every feature above is free, with no daily cap, no tiers, and no
license key.

OPEN SOURCE
https://github.com/bommireddy30/focus-tube
```

## Single purpose description (Privacy practices tab)

```
Focus Tube's single purpose is to help users have a more focused,
distraction-free YouTube experience: hiding Shorts and other distracting
elements (Mixes, autoplay, keyword-matched videos) from YouTube's own web
pages via a content script, and showing users, locally on their own
device, how their YouTube watch time breaks down by content category so
they can self-monitor their viewing habits.
```

Worth a second look before publishing: Chrome Web Store policy requires
a genuinely *narrow* single purpose. Watch Stats is framed above as part
of the same "focus / digital wellbeing" purpose as blocking, which is
probably defensible, but if a review ever pushes back, the fallback is
splitting Watch Stats into its own listing rather than broadening this
one's stated purpose further. Also worth flagging: Watch Stats has no
user-facing on/off toggle or reset control (by design, per the current
build) — reviewers evaluating "user control over collected data" may
expect one, even though the data never leaves the device.

## Permission justifications (Privacy practices tab)

**`storage`**
```
Used to save the user's own toggle settings and keyword list
(chrome.storage.sync); a local daily blocked-count used only for the
in-popup/badge counter (chrome.storage.local); and, for Watch Stats,
each video's YouTube category and watch-time totals
(chrome.storage.local). No data leaves the browser.
```

**Host permission: `*://*.youtube.com/*`**
```
Required so the extension's content script can run on YouTube pages to
find and hide Shorts, Mixes, and keyword-matched video elements in the
DOM, and (for Watch Stats) to read a video's official YouTube category
from the page, occasionally via a same-origin fetch() to that video's
own youtube.com watch page when YouTube's in-app navigation has left the
previously-loaded copy stale. This never reaches beyond youtube.com and
nothing read is transmitted elsewhere — matching and category extraction
happen entirely in the user's own tab.
```

## Remote code justification (Privacy practices tab)

Answer: **No, this item does not use remote code.**

```
Focus Tube does not execute any remote code. All JavaScript
(content.js, popup.js, background.js) ships packaged inside the
extension — there is no eval(), no Function() constructor use, and no
dynamically injected <script> tags. Watch Stats does make same-origin
fetch() requests back to youtube.com (never a third party) to read a
video's official category after an in-app
navigation, but that response is only ever parsed for a plain-text
metadata field — never executed, evaluated, or treated as code.
```

## Data usage disclosures (Privacy practices tab checkboxes)

As of the Watch Stats feature, this needs to change from the previous
version's answer:

- Does this item collect or use user data? **Yes** — check
  **"Web history"** and/or **"User activity"** (whichever label the
  dashboard currently uses for watch-history-style data). Watch Stats
  reads a video's official YouTube category and how long you watched
  it, and stores that in `chrome.storage.local`.
- In the follow-up questions: this data **is not sold to third parties**,
  **is not used for purposes unrelated to the item's core functionality**,
  and **is not used to determine creditworthiness or for lending
  purposes**. It is also **never transmitted off the device** — everything
  above is stored via `chrome.storage.local`/`chrome.storage.sync` only,
  the browser's own extension-storage APIs, with no network requests of
  any kind.
- Certify compliance with the Developer Program Policies: **Yes**

This checkbox change needs to be made by hand in the Developer Dashboard
before publishing the version that ships Watch Stats — it isn't something
this repo can update on your behalf.

## Privacy policy URL

```
https://raw.githubusercontent.com/bommireddy30/focus-tube/main/PRIVACY.md
```
Use the **raw** URL, not the `github.com/.../blob/...` one — the
Developer Dashboard's link checker has repeatedly reported the blob
URL as "not reachable" because that page is a JS-rendered app shell.
The raw URL is a plain-text response with no rendering involved, which
the checker can actually fetch.

If the raw URL also gets flagged, the fallback is `docs/privacy-policy.html`
in this repo, already written and pushed — it needs GitHub Pages
enabled (repo Settings → Pages → Deploy from branch → `main` → `/docs`)
to go live at a `bommireddy30.github.io` URL, a plain static page with
no app-shell rendering at all.

## Screenshots (1280x800, at least 1, up to 5)

Ready in `store-assets/` as 24-bit PNG, no alpha — see that folder's
README for details on each. Already at the dashboard's 5-screenshot
maximum:
- `popup-blocking.png` — Blocking tab, Keywords and Blocked Channels
  populated with example entries
- `popup-stats.png` — Watch Stats tab, real category donut + upload-age
  breakdown + last-watched card
- `youtube-search.png`
- `youtube-watch.png`
- `youtube-home.png`

## Small promo tile (440x280)

Ready: `store-assets/promo-small.png`.

## Marquee promo tile (1400x560)

Ready: `store-assets/promo-marquee.png`.
