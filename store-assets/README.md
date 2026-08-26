# Store assets

Assets for the Chrome Web Store listing — see the repo README's
"Publishing to the Chrome Web Store" section for context. All files
below are 24-bit PNG (no alpha channel) at the exact pixel dimensions
the dashboard requires.

## Screenshots (1280x800, up to 5, at least 1 required)

- `popup-blocking.png` — branded feature screenshot of the popup's
  Blocking tab: real extension, real seeded demo data (Keywords and
  Blocked Channels both populated and auto-expanded, since those
  sections only expand by default when they hold something), composed
  on a card next to headline copy and feature pills.
- `popup-stats.png` — same treatment for the Watch Stats tab: real
  donut chart, category legend (including the "Shorts" and folded
  "Other" buckets), upload-age bar, and a "Last watched" card, all
  driven by seeded `chrome.storage` data rather than hand-drawn mockups.
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

All seven are ready to upload for submission as-is.

**A known inconsistency, left as-is deliberately**: the app icon
(`icons/icon*.png`, embedded in both promo tiles) is still the original
purple/blue design — recoloring a raster icon safely (without producing
ugly artifacts on its gradients/anti-aliased edges) isn't something to
attempt without real image-editing tools, so it was left untouched
while everything else moved to the new brand pair. It reads fine as a
complementary accent against the new warm background rather than
looking broken, but a from-scratch icon redesign in the new colors
would be the actual fix if full brand consistency matters.

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
