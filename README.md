# Focus Tube — YouTube Shorts & Keyword Blocker

Removes YouTube Shorts everywhere — Home, Search, Subscriptions, History,
channel pages, and up-next — plus lets you block any video by keyword.
Runs entirely client-side, with no account, no tiers, and no daily caps.
Everything is free. Talks to no third party and no server it controls —
the one exception is Watch Stats, which occasionally makes a same-origin
request back to youtube.com itself to read a video's category; see
`PRIVACY.md` for details.

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
  match — confirmed via live testing (Playwright driving the real
  unpacked extension) that the recoloring and progress-bar override work.
  The subscribe-button recolor was confirmed live too, and turned out to
  be broken on channel pages: YouTube's newer channel-header component
  doesn't use `ytd-subscribe-button-renderer` at all, so that selector
  only ever matched on watch pages. Fixed with an added aria-label-based
  selector (`button[aria-label^="Subscribe"]`), which is also more
  resilient than the class-based approach since it doesn't depend on
  YouTube's frequently-churning generated class names. The
  notification-badge selectors are still unconfirmed as of this writing —
  untestable signed-out, since the unread-count badge only renders for a
  signed-in session this repo doesn't have. The most aggressive
  rule in Calm Mode targets **thumbnail images themselves**, not just UI
  chrome — `filter: saturate(0.3) contrast(0.85) brightness(0.96)
  hue-rotate(-12deg)` on every `ytd-thumbnail`/`yt-image`/`#thumbnail`
  image, since thumbnails lean on the exact same hyper-saturated,
  high-contrast "clickbait" visual design as a deliberate attention hook,
  and muting the chrome while leaving the thumbnail grid at full
  intensity would miss the single densest concentration of
  attention-engineered pixels in the whole UI.
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

- **Blocked Channels** — a hard, deterministic block by channel identity,
  everywhere a video card can appear (Home, Search, Subscriptions,
  up-next/related). Unlike YouTube's own "Don't recommend this channel" —
  which is only a soft signal to the recommendation algorithm, doesn't
  touch Search results at all, and can fade or get overridden by other
  signals — this is unconditional: any video card whose channel matches
  a blocked entry gets hidden, full stop. Type a channel's display name,
  or paste its URL/bare `@handle`/bare channel ID for a more precise
  match; `parseChannelInput` in `popup.js` normalizes whichever form you
  give it into `{ id, name }`. Matching (`applyChannelBlock` in
  `content.js`) tries `id` first — the stable part of a channel's URL,
  extracted from a card's channel link via `parseChannelIdFromHref` —
  since names alone aren't unique (two different channels can share one)
  and a channel renaming itself doesn't change its handle/id, then falls
  back to a substring match of the name against the card's full text via
  `getDeepText` for entries added by name (or whenever the link-based
  lookup comes up empty). That fallback deliberately mirrors Keywords'
  own matching rather than isolating a narrow "channel name" sub-element
  — an earlier version tried the narrow-selector approach and it silently
  matched nothing on card layouts where that selector didn't line up, the
  same failure mode the Keywords section above already called out.
  Shares the same per-card scanning (`getOuterVideoItemContainers`)
  Keywords uses, so both passes see "one entry per visual card"
  consistently rather than duplicating that dedup logic.

- **Watch Stats** — a separate tab in the popup, unrelated to blocking,
  and tracked independent of it too: there's no setting that turns
  tracking off, and it covers both `/watch` pages and the Shorts
  swipe-feed surface (`/shorts/<id>`, whose video id lives in the path,
  not a `?v=` query param the way `/watch` does — `getVideoIdFromUrl`
  handles both). In practice this means Shorts watch time is only ever
  actually recorded while blocking (or specifically `blockShortsPlayer`)
  is off, since otherwise `redirectIfShortsPage()` swaps the URL away
  before Watch Stats ever sees the Shorts surface. Tracks how many
  seconds of actual video playback you consume per **YouTube's own
  official video category** (Education, Entertainment, Autos & Vehicles,
  Howto & Style, and so on — the same field YouTube Studio shows
  creators), overridden by two synthetic buckets that take priority over
  whatever official category a video carries: **"Shorts"** for anything
  watched through that swipe-feed surface (a consumption pattern, not a
  property of the video itself — the same video watched normally at
  `/watch` still gets its real category), and **"Live"** for anything
  `videoDetails.isLiveContent` flags (YouTube keeps that flag true
  forever for past-live VODs too, and that content behaves differently
  enough to call out separately). Rendered as a donut/pie chart plus a
  legend (top 6 categories by watch time; anything past that folds into
  "Other" — a pie stays legible only to ~6 segments). Category/length/tags
  data comes from `ytInitialPlayerResponse`
  (`resolveVideoMeta`/`metaFromPlayerResponse` in `content.js`): read
  directly out of an inline `<script>` tag already on the page when
  possible (free, no network call), falling back to a same-origin
  `fetch()` of that video's own `youtube.com` watch page — never a third
  party — only when YouTube's in-app SPA navigation has left the embedded
  copy stale (i.e. you clicked to a new video without a full page
  reload). `extractBalancedJson`/`extractPlayerResponseFromText` do the
  actual parsing, tracking brace depth and string state so a `}` inside a
  video description doesn't truncate the match early. Watch time is
  measured from the `<video>` element's own `timeupdate` deltas (actual
  footage consumed — correctly handles skipped/scrubbed sections,
  faster-than-1x playback, and any number of pause/resume cycles without
  losing already-accumulated time) rather than wall-clock time the tab
  was open. Totals persist in `chrome.storage.local` indefinitely — there
  is deliberately no popup toggle to disable tracking and no reset
  button, so it runs continuously for as long as the extension is
  installed, independent of the blocking master toggle (`maintainWatchTracking`
  in `content.js` isn't gated by any setting). The only way to stop it or
  clear the accumulated data is to remove the extension. Category colors
  come from a fixed, CVD-validated
  8-hue palette (`CATEGORY_COLOR_TABLE`/`CATEGORY_COLOR_SLOTS` in
  `popup.js`) — common categories map to a curated slot, anything else
  (including "Live") gets a deterministic hash-based slot, and
  "Uncategorized"/"Other" are always a neutral gray rather than a hue, so
  a given category always reads as the same color and identity never
  depends on color alone (every slice is also named in the legend).
  "Shorts" is the one exception to the hue-slot/hash scheme: it's
  hard-coded to the app's own coral accent (`SHORTS_COLOR` in
  `popup.js`) rather than a categorical slot or a hash fallback, since
  it's the one category this whole extension is about and the same
  coral already means "this is what Focus Tube blocks" everywhere else
  in the popup. Re-validated as a 9th color via the dataviz skill's
  `validate_palette.js --pairs all` (pie slice adjacency is rank-sorted
  by watch time, not fixed order, so any two categories can end up
  neighboring) — it doesn't worsen the palette's existing worst-case CVD
  pair.

  The "Last watched" card (deliberately a single item, not a history
  list) also shows: **% of the video actually watched**, using
  `videoDetails.lengthSeconds` (e.g. "12m of 20m (60%)", capped at 100%
  for repeat views so a rewatch doesn't show 240%); and the **creator's
  own tags** (`videoDetails.keywords`, first 5) as a finer-grained signal
  than the one broad official category — e.g. distinguishing "cooking"
  from "travel" within People & Blogs, shown as plain text under the
  category badge, not fed into the pie's bucketing.

  A separate **"Watch time by upload age"** card breaks watch time down
  by how recently each video was published — **Recent** (≤30 days),
  **This year** (≤365 days), or **Older** — bucketed from
  `microformat.publishDate`/`uploadDate` (`bucketForPublishDate` in
  `content.js`) into `recencyTotals`, alongside `totals` in the same
  `chrome.storage.local` record. Rendered as a single stacked bar rather
  than a second pie, since these buckets are **ordinal** (order carries
  meaning — fresher first) rather than nominal categories: a one-hue
  ramp with monotone lightness (`--seq-600`/`--seq-450`/`--seq-300` in
  `popup.css`, darkest = most recent), validated via the dataviz skill's
  `validate_palette.js --ordinal`, distinct from the 8-hue categorical
  set used for the pie. A video with no usable publish date falls into
  "Unknown" (the same neutral gray used for "Uncategorized"/"Other"
  elsewhere) rather than being silently folded into a real bucket.

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
out of a soft gradient surface. Each card/button gets a soft dark
drop-shadow (lift) paired with a soft light highlight on the opposite
corner, plus a faint inset pair along the same diagonal for the rounded,
inflated edge — this is what makes controls read as squeezable blobs
rather than flat panels. One vivid crimson accent (with a gold accent for
Keywords chips, distinct from Blocked Channels' crimson ones) marks
anything "on" or active against the otherwise soft surface. Brand pair:
`#B81103` (crimson) + `#FFFACD` (lemon chiffon) — everything else (surfaces,
ink, shadow tints, the Watch Stats chart colors) is derived from those
two. All of it lives in `:root` CSS variables at the top of `popup.css`
(`--bg`, `--card`, `--shadow-dark`, `--shadow-light`, `--accent`, `--gold`)
if the palette needs adjusting later — shadow/glow tints specifically are
RGB-triple variables (`--shadow-dark-rgb` etc.) consumed via
`rgba(var(--x-rgb), alpha)`, so every rule sharing a tint at different
alphas stays in sync from one source instead of needing hand-updated
copies.

**Dark theme** defaults to the browser/OS's `prefers-color-scheme`
setting, with a three-way **Auto / Light / Dark** pill switcher
(`#themeSwitch` in the popup, right below the header) to override it —
`theme` in settings (`"system" | "light" | "dark"`, synced). "Auto" is
pure CSS: a `@media (prefers-color-scheme: dark)` block, zero JS
involvement, zero flash-of-wrong-theme, since it renders correctly before
`popup.js` even runs. Picking Light or Dark makes `applyTheme()` in
`popup.js` set (or remove) a `data-theme` attribute on `<html>`; a
`:root[data-theme="dark"]` rule — identical values to the `@media` block,
kept in sync by hand since CSS can't share a custom-property block across
an `@media` boundary without a preprocessor — forces dark regardless of
what the OS prefers. The `@media` block itself is gated on
`:root:not([data-theme])` so an explicit override always wins; forcing
*light* needs no rule of its own, since the plain `:root` at the top of
the file already is the light theme and the mere presence of
`data-theme="light"` is what blocks the `@media` block from applying.

Neither theme is simply the other darkened: every token, and every Watch
Stats chart color, was independently re-validated (WCAG contrast for UI
tokens; the dataviz skill's `validate_palette.js --pairs all`/`--ordinal`
for the categorical and ordinal chart colors) against dark mode's own
`--card`, since a palette validated on one surface doesn't transfer for
free. That distinction mattered in practice twice over: the dataviz
skill's own documented dark-mode steps for this exact 8-hue categorical
set — reused as-is, without re-validating — turned out to fail
`--pairs all` against this specific dark surface (a violet/blue collision
at ΔE 2.5 under protanopia, well below the floor), despite being
"pre-validated" elsewhere; and the scrollbar thumb color originally
reused `--shadow-dark-rgb`, which goes to pure black in dark mode
(correct for a clay drop-shadow's recessed side) but made the scrollbar
nearly invisible against the near-black page — caught only once dark mode
was actually checked, not assumed safe because the light version worked.
Fixed with its own `--scrollbar-thumb-rgb` token, kept deliberately
separate from the shadow tint. The dark 9-color categorical set actually
shipped here (`--series-1` through `--series-8` plus `--series-shorts`)
was generated from scratch — 8 hues spread via HSL, iteratively adjusted
against `validate_palette.js --pairs all` until it passed, the same way
the light-mode "Shorts" 9th slot was found. Also worth knowing: `--gold`
is a light hue even brightened for dark mode, so `--gold-ink` (the text
color used *on* gold chips) flips to a dark ink in dark mode instead of
staying white — reusing `.keyword-chip`'s color for `.channel-chip` (a
different, always-crimson chip that shares the same markup) would have
silently inherited that flip, so `.channel-chip` sets its own explicit
`color: #ffffff` rather than relying on inheritance.

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
- Turning an individual category toggle off (e.g. "Shorts shelves"), or
  removing a Keyword, only stops *future* hiding for that category — it
  doesn't retroactively un-hide cards already hidden. The master on/off
  toggle at the top is the one that does a full un-hide; per-category
  toggles are scoped that way deliberately to keep the reveal logic
  simple for now. **Blocked Channels is the one exception**: `hideEl()`
  tags each hide with a reason (`"channel"` for this feature, a plain
  flag for everything else), so removing a channel entry can call
  `revealByReason("channel")` to un-hide exactly what that entry hid,
  without disturbing anything hidden for an unrelated reason — see the
  `revealByReason` comment in `content.js`. The same mechanism could
  extend to Keywords later; it just hasn't been wired up there yet.

## Publishing to the Chrome Web Store

- `PRIVACY.md` — privacy policy, covering the `storage`/host permissions
  and what Watch Stats reads, stores, and (occasionally, same-origin
  only) fetches. Link to this file's raw GitHub URL (or a GitHub Pages
  URL) in the dashboard's "Privacy policy" field.
- `STORE_LISTING.md` — draft title, summary, description, single-purpose
  statement, and permission justifications for the Developer Dashboard's
  listing and Privacy Practices tabs. **Also flags a checkbox that must
  be changed by hand in the dashboard** — "Does this item collect or use
  user data?" needs to go from No to Yes as of Watch Stats, since that's
  a dashboard-only setting this repo can't change for you.
- `focus-tube-v<manifest version>.zip` — packaged build (manifest +
  scripts + icons only) ready to upload as a new item/version.
  Regenerate after any further code change — it's gitignored, not
  tracked. Keep the version in the filename in sync with
  `manifest.json`'s `version` field.
- A popup footer disclaimer ("Unofficial · not affiliated with YouTube
  or Google") was added to reduce trademark-policy rejection risk.

Still needs a human before submitting:
- A paid ($5, one-time) Chrome Web Store developer account, if not
  already set up.
- The dashboard's data-usage checkbox change described above.
- Confirm GitHub Pages is actually live for the privacy policy URL
  (repo Settings → Pages → Deploy from branch → `main` → `/docs`), if
  using that fallback instead of the raw GitHub URL.
- ~~Fresh screenshots~~ Done — `store-assets/popup-blocking.png` and
  `popup-stats.png` replace the old single `popup.png`, captured live
  from the real extension with seeded demo data (see
  `store-assets/README.md`'s "Regenerating" section for how, including
  the Chrome-vs-Edge `--load-extension` policy gotcha on a managed
  machine). The three `youtube-*.png` screenshots were left as-is —
  the Shorts/Mixes/Autoplay blocking behavior they show didn't change
  this round, only the popup did.
- A quick manual check that Calm Mode's notification-badge/subscribe-
  button selectors still match current YouTube markup (see "Known
  limitations" above) before flipping it on by default for real users.
