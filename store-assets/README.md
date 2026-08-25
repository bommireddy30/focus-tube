# Store assets

Assets for the Chrome Web Store listing — see the repo README's
"Publishing to the Chrome Web Store" section for context. All files
below are 24-bit PNG (no alpha channel) at the exact pixel dimensions
the dashboard requires.

## Screenshots (1280x800, up to 5, at least 1 required)

- `popup.png` — branded feature screenshot: the real popup (captured
  live from the loaded extension) composed on a card next to headline
  copy and feature pills.
- `youtube-search.png` — live search results for "news", signed out —
  0 visible `/shorts/` links.
- `youtube-watch.png` — live watch page, signed out — 0 visible
  `/shorts/` links in up-next, Autoplay toggle fully hidden.
- `youtube-home.png` — signed-in home feed, dark theme — no Shorts
  shelf, no Mixes shelf anywhere in the grid or filter chips.

## Small promo tile (440x280)

- `promo-small.png` — icon + wordmark + tagline on the popup's brand
  gradient. Optional in the dashboard but included since it was easy
  to generate from the same template as the marquee tile.

## Marquee promo tile (1400x560)

- `promo-marquee.png` — icon + wordmark + one-line pitch + feature
  pills (Free / Private / No account / No ads), brand gradient
  background.

All six are ready to upload for submission as-is.

## Regenerating

The promo tiles and the branded popup screenshot are generated from
HTML templates (inline SVG-free, brand colors pulled from `popup.css`)
rendered with Playwright at the exact target pixel size, so there's no
manual cropping/resizing step. Re-run the same approach if the popup
UI or brand palette changes later — capture the real popup via the
loaded extension, then composite it into the HTML template rather than
hand-editing these PNGs directly.
