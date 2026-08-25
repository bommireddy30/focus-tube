# Focus Tube — YouTube Shorts & Keyword Blocker

Removes YouTube Shorts everywhere — Home, Search, Subscriptions, History,
channel pages, and up-next — plus lets you block any video by keyword.
Runs entirely client-side — no data collection, no network calls, no
accounts, no tiers, no daily caps. Everything is free.

## Categories (mirrors the popup UI)

- **The Shorts player** — redirects any `/shorts/VIDEO_ID` you open, either
  back to the normal watch player or straight to the YouTube home page
  (your choice, via the two pill buttons under this toggle).
- **Shorts shelves** — the horizontal "Shorts" carousel on Home and
  Subscriptions.
- **Shorts in search** — the "Shorts" shelf and filter chip on the search
  results page.
- **Loose Shorts** — individual Shorts cards wherever they show up: feeds,
  History, channel pages, and the up-next sidebar on a watch page. This is
  a single generic pass (any card linking to `/shorts/`) so it naturally
  covers surfaces we don't otherwise special-case.
- **Shorts links** — the sidebar nav entry, the search filter chip, and the
  "Shorts" tab on a channel page.
- **Mixes** — YouTube's auto-generated "Mixes for you" / "Your Mix" radio
  playlists. Shelf heading text for these varies too much to exact-match
  (unlike "Shorts"), so this uses a heading substring/word check plus a
  link-pattern fallback (`list=RD`, the id prefix YouTube uses for every
  Mix/radio playlist) that catches Mix cards regardless of heading wording
  — the same "structural signal over exact text" approach Loose Shorts
  uses. Scoped specifically to Mixes rather than "personalized content" in
  general, since there's no DOM signal that distinguishes a personalized
  recommendation from an ordinary video — nearly everything a signed-in
  user sees is personalized to some degree, so a broader rule would risk
  hiding the entire Home feed.
- **Autoplay** — finds the Autoplay toggle on a watch page, clicks it off
  if it's currently on, then hides the control so it can't be flipped back
  on from the UI. Unmetered, like the nav/chip passes, since it's removing
  a UI control rather than blocking content.
- **Calm Mode** — recolors YouTube's own persistent red UI accents
  (subscribe button, video progress bar, brand CSS custom properties) to
  a muted slate blue, hides the notification bell's unread-count badge
  (the bell itself still works), and disables the thumbnail hover-autoplay
  preview on Home/search. This targets YouTube's own engagement-hook
  design, not content — red-for-urgency and unread-count badges are
  deliberate attention triggers, and the hover preview is designed to
  pull you into a video before you've clicked anything. Deliberately
  leaves the Live badge red, since that color is informational there
  (recorded vs. live), not just decorative. Also disables animation on
  the Live badge and notification bell (kills the blinking/shake urgency
  cues) and dims — doesn't hide — view-count/metadata numbers, since
  large bold view counts are a social-proof signal but the number itself
  is still useful info. "New"/trending badges are deliberately left
  alone: they'd likely be matched by the same renderer used for
  verified-channel checkmarks, and getting that wrong would dim something
  people rely on rather than a hook. Tunable via `--focustube-calm-accent`
  at the top of `content.css`. Like the Autoplay/Shorts selectors, some of
  the class-name guesses here (the notification badge and hover-preview
  elements especially) may need adjustment if YouTube's markup doesn't
  match — confirmed via live DevTools testing that the recoloring and
  progress-bar override work; the notification-badge/subscribe-button
  selectors are still unconfirmed as of this writing.
- **Keywords** — hides any video whose **title, channel name, or visible
  description snippet** matches a word or phrase you've added.
  Case-insensitive, comma-separated for several at once. A "Match whole
  words only" toggle switches from substring matching (fast to set up,
  but "war" also catches "software") to exact word-boundary matching
  (fewer accidental hits, needs more precise keywords). Scans video-item
  containers directly (`ytd-rich-item-renderer`, `yt-lockup-view-model`,
  etc.) rather than anchoring on a `#video-title` sub-element — an
  earlier version anchored there and silently matched zero cards on
  layouts where that id didn't exist (confirmed on the Home feed's newer
  card components), so keyword blocking did nothing at all on those
  pages despite working fine elsewhere. The Keywords card also shows a
  curated **Suggested** list (`SUGGESTED_KEYWORDS` in `popup.js`, grouped
  "Rage bait & hostility" / "Clickbait & hype") — tapping a chip adds or
  removes it from the same `keywords` array as anything typed manually,
  it's purely a UI shortcut. Nothing on that list is applied
  automatically; every word is an explicit per-word choice. Picked
  deliberately specific phrasing (e.g. "you won't believe" rather than
  "reaction" or "prank") to keep false-positive risk low — a broad single
  word could silently hide videos from channels someone actually wants.

The master on/off toggle at the top of the popup actually **restores**
everything the moment you switch it off — it doesn't just pause future
hiding, it walks the page and un-hides everything already blocked. Flip it
back on and the next pass re-hides normally.

A toolbar badge shows today's running block count on the extension icon
itself, updated live by a background service worker (`background.js`)
that watches the same stats content scripts write to — content scripts
can't set the badge directly, only extension pages can. This is purely
informational (no cap tied to it) and resets automatically at local
midnight.

## Design — Claymorphism

The popup uses a claymorphism style: puffy, rounded "clay" shapes carved
out of a soft pastel gradient surface. Each card/button gets a soft dark
drop-shadow (lift) paired with a soft light highlight on the opposite
corner, plus a faint inset pair along the same diagonal for the rounded,
inflated edge — this is what makes controls read as squeezable blobs
rather than flat panels. One vivid coral accent (with a mint accent for
keyword chips) marks anything "on" or active against the otherwise pastel
surface. All of this lives in `:root` CSS variables at the top of
`popup.css` (`--bg`, `--card`, `--shadow-dark`, `--shadow-light`,
`--accent`, `--mint`) if the palette needs adjusting later.

## How it works

- `content.js` runs on every youtube.com page and uses a debounced
  `MutationObserver` to continuously re-scan as YouTube's single-page app
  streams in new content.
- **Shadow DOM aware**: YouTube's newer components render inside shadow
  roots, which a plain `querySelectorAll` cannot see into and a plain
  `.closest()` cannot climb out of. `deepQueryAll()` recurses into shadow
  roots to find matches; `closestAcrossShadow()` and `climbToCard()` climb
  back OUT of a shadow root to find the right whole-card container to hide
  (this is what prevents leftover metadata — view counts, menus — being
  left behind when only the thumbnail gets matched). Keyword matching uses
  a related helper, `getDeepText()`, to read a card's full rendered text
  — title, channel name, description — even when those pieces live in
  separate shadow roots from each other.
- Feature toggles and your keyword list live in `chrome.storage.sync` (they
  follow you across signed-in Chrome installs). The badge's daily block
  count lives in `chrome.storage.local` (device-specific) since it's just
  a local stat, not a preference.

## Load it locally to test (Chrome / Edge)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Open youtube.com — Shorts should disappear. Click the extension icon to
   toggle individual surfaces on/off.

**After editing any file**, you have to reload the extension for changes
to take effect — Chrome does not hot-reload content scripts into tabs that
were already open:
1. `chrome://extensions` → click the reload icon on Focus Tube's card.
2. Fully close and reopen the YouTube tab (a plain refresh sometimes isn't
   enough to drop a stale content-script instance).
If something seems stuck even after that, check for a red "Errors" button
on the extension's card first — that's usually the real story.

## Load it locally to test (Firefox)

Firefox supports Manifest V3 but is stricter about a couple of fields.
Two options:
1. Try loading as-is via `about:debugging` → **This Firefox** → **Load
   Temporary Add-on** → select `manifest.json`. Most of this manifest works
   unchanged.
2. If you hit manifest errors, the usual fix is adding a
   `browser_specific_settings` block with a Firefox extension ID, and
   double-checking `action` vs `browser_action` depending on your target
   Firefox version.

## Porting to Safari (iOS + macOS)

Safari doesn't load extensions directly like Chrome — they must be bundled
inside a native app and distributed through the App Store / Mac App Store.
The path:

1. Install Xcode on a Mac.
2. Run Apple's conversion tool from this folder:
   ```
   xcrun safari-web-extension-converter .
   ```
   This generates an Xcode project that wraps this extension in a minimal
   native app shell.
3. Build and run — Safari will let you enable the extension under
   **Settings → Extensions** (macOS) or in the Safari settings on iOS.
4. From there it follows the normal App Store submission process for the
   wrapper app.

This is the only legitimate way to get Shorts-level (not just whole-app)
blocking on iOS — see the earlier discussion on why native-app-level
blocking isn't possible on iOS.

## Known limitations

- YouTube changes its DOM structure periodically, which can silently break
  a selector. The generic fallback pass (matching any `/shorts/` link and
  hiding its containing card) exists specifically to reduce how often this
  happens, but expect occasional maintenance. The Autoplay toggle in
  particular has shipped under several different tag names across past
  redesigns — `AUTOPLAY_TOGGLE_SELECTOR` in `content.js` falls back to an
  `aria-label` match for this reason, but a future redesign could still
  need a selector update.
- `:has()` CSS selectors require a reasonably modern browser (Chrome 105+,
  Firefox 121+, Safari 15.4+). All are well past general availability as of
  2026, so this should be safe for the vast majority of users.
- Turning an individual category toggle off (e.g. "Shorts shelves") only
  stops *future* hiding for that category — it doesn't retroactively
  un-hide cards that category already hid. The master on/off toggle at the
  top is the one that does a full un-hide; per-category toggles are
  scoped that way deliberately to keep the reveal logic simple for now.

## Publishing to the Chrome Web Store

- `PRIVACY.md` — privacy policy (no data collection; covers the
  `storage` and host permissions). Link to this file's raw GitHub URL
  (or a GitHub Pages URL) in the dashboard's "Privacy policy" field.
- `STORE_LISTING.md` — draft title, summary, description, single-purpose
  statement, and permission justifications for the Developer Dashboard's
  listing and Privacy Practices tabs.
- `focus-tube-v3.0.0.zip` — packaged build (manifest + scripts + icons
  only) ready to upload as a new item/version. Regenerate after any
  further code change — it's gitignored, not tracked.
- A popup footer disclaimer ("Unofficial · not affiliated with YouTube
  or Google") was added to reduce trademark-policy rejection risk.

Still needs a human before submitting:
- A paid ($5, one-time) Chrome Web Store developer account, if not
  already set up.
- Real screenshots (see the list in `STORE_LISTING.md`) — these need a
  signed-in Chrome session and can't be generated from this repo alone.
- A quick manual check that Calm Mode's notification-badge/subscribe-
  button selectors still match current YouTube markup (see "Known
  limitations" above) before flipping it on by default for real users.
