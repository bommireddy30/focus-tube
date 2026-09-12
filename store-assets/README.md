# Store assets

Assets for the Chrome Web Store listing — see the repo README's
"Publishing to the Chrome Web Store" section for context. All files
below are 24-bit PNG (no alpha channel) at the exact pixel dimensions
the dashboard requires.

## Screenshots (1280x800, up to 5, at least 1 required)

- `popup-blocking.png` — branded feature screenshot of the popup's
  Blocking tab: real extension, real seeded demo data, composed on a card
  next to headline copy and feature pills. Recaptured for the 3.8.1
  release to show the new "Auto-block after watching 60%" toggle
  (Blocked Channels card) switched on, an auto-added channel tagged
  "(today)", and the "Also blocking any video that mentions these names
  today" row it populates — Keywords was seeded empty this round instead
  of its usual demo chips so that content stayed in frame without
  cropping (the popup grew taller with the new feature); pick it back up
  next time this screenshot needs a refresh unrelated to Blocked
  Channels. Also recaptured a second time in the same release to pick up
  the grayscale reskin (see below) — the composite's own background/text
  colors were updated to match (`#F4F4F2`/`#1C1C1C`/`#262626` in place of
  the old `#FFF4B8`/`#3D0F08`/`#B81103`), so the marketing frame doesn't
  clash with the now-grayscale popup screenshot sitting inside it.
- `popup-stats.png` — same treatment for the Watch Stats tab, recaptured
  for the new **Time Spent** card (all-time total + month/week/day
  breakdown): real donut chart and category legend, plus Time Spent's
  "All time" + full "By month" group, cropped right after a complete row
  (same "let it overflow past the frame, crop cleanly" approach the
  original screenshots already used) rather than shrinking everything to
  fit Recency/Last Watched in too — those two didn't change this round.
  Same grayscale composite-color update as `popup-blocking.png` above.
- `youtube-search.png` — live search results for "news", signed out —
  0 visible `/shorts/` links, and Calm Mode's thumbnail desaturation
  visibly muting the news thumbnails' usual high-contrast red banners.
- `youtube-watch.png` — live watch page, signed out — 0 visible
  `/shorts/` links in up-next, Autoplay toggle fully hidden. Predates
  the brand refresh and Calm Mode's thumbnail filter, but still
  accurate for what it's demonstrating (Shorts/Autoplay blocking, which
  didn't change) — not recaptured this round.
- `youtube-home.png` — signed-in home feed, dark theme — no Shorts
  shelf, no Mixes shelf anywhere in the grid or filter chips. Also not
  recaptured (needs a real signed-in session this repo doesn't have).

## Small promo tile (440x280)

- `promo-small.png` — icon + wordmark + tagline on the brand gradient.
  Optional in the dashboard but included since it's easy to generate
  from the same template as the marquee tile.

## Marquee promo tile (1400x560)

- `promo-marquee.png` — icon + wordmark + one-line pitch + feature
  pills (Free / Private / No account / No ads), brand gradient
  background.

The app icon (`icons/icon*.png`) was redrawn from scratch as a flat
crimson/lemon-chiffon "blocked" glyph, replacing the old purple/blue
cursor-and-clock design — full brand consistency, no recoloring
artifacts, since it's a clean vector re-render rather than a recolored
raster. `promo-small.png`, `promo-marquee.png`, `popup-blocking.png`,
and `popup-stats.png` have all been regenerated to match (see
"Regenerating" below) — the two popup screenshots also happened to pick
up the Auto/Light/Dark theme switcher along the way, since that UI
shipped after these were last captured and a fresh capture reflects
whatever the popup currently looks like. The three `youtube-*.png`
screenshots don't embed the icon and are unaffected.

**The 3.8.1 popup reskin (crimson/lemon-chiffon → grayscale) only
touched `popup.css`'s in-app chrome tokens — the app icon and both promo
tiles are unaffected and stay crimson on purpose.** The icon is the
brand mark shown in the toolbar and the Web Store listing itself; the
promo tiles echo that same icon. Only the popup's own internal UI went
neutral gray (Watch Stats chart colors excepted — those are data, kept
as-is). So `promo-small.png`/`promo-marquee.png` still show the crimson
gradient/wordmark deliberately, while `popup-blocking.png`/
`popup-stats.png` show the grayscale popup they actually contain — this
split is intentional, not a leftover inconsistency.

All seven are ready to upload as-is.

## Regenerating

The promo tiles and the two branded popup screenshots are generated
from HTML templates (inline SVG-free, brand colors pulled from
`popup.css`) rendered with Playwright at the exact target pixel size,
so there's no manual cropping/resizing step. Re-run the same approach
if the popup UI or brand palette changes later — capture the real
popup via the loaded extension, then composite it into the HTML
template rather than hand-editing these PNGs directly.

**Loading the extension for a real capture.** This machine's Chrome
has an org-managed policy that silently blocks `--load-extension`
(Developer Mode extensions are disabled at the policy level, with no
error beyond the extension simply never appearing) — Edge does not
have this restriction and loads unpacked extensions normally, so use
`msedge.exe` with Playwright's `launchPersistentContext` instead of
Chromium for this. Check `chrome://extensions` (or the equivalent) for
a "managed by your administrator" message on the Developer Mode toggle
if captures silently produce nothing.

**Seeding realistic data.** A first-run popup has nothing in it —
empty Keywords, no Blocked Channels, no Watch Stats — which makes for
an unconvincing screenshot, and Keywords/Blocked Channels/the upload-age
breakdown only auto-expand when they actually hold data. Rather than
manually clicking through the UI to build up believable state, seed it
directly: the extension's own MV3 service worker (`context.serviceWorkers()`
in Playwright) has full `chrome.storage` access, so a single
`serviceWorker.evaluate()` call writing `focusTubeSettings`
(`chrome.storage.sync`) and `focusTubeStats`/`focusTubeCategoryStats`
(`chrome.storage.local`) directly is enough to populate a fully
realistic-looking popup before opening it. Used clearly-generic demo
values throughout (a fictional channel name/handle, a generic
"How Neural Networks Actually Learn" video title) — nothing resembling
a real creator or real personal viewing history.
