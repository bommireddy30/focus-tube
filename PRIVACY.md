# Privacy Policy — Focus Tube

**Last updated:** 2026-08-27

Focus Tube is a browser extension that hides YouTube Shorts and
keyword-matched videos, and tracks how much time you spend watching
different categories of content on YouTube. This policy covers what data
it does and does not handle.

## Data collection

Focus Tube sends **nothing** to a server it controls, and talks to no
third party at all. It does not:

- Use analytics, telemetry, or crash reporting
- Contain ads or third-party scripts
- Share, sell, or transmit anything to anyone

The one exception to "no network requests": Watch Stats occasionally
fetches a video's own `youtube.com` watch page — the same site you're
already on, never a third party — to read that video's official
category. See that section below for exactly when this happens. Watch
Stats also locally tracks your YouTube watch activity on-device — see
that section for what this means in practice.

## What is stored, and where

Focus Tube stores three small pieces of state, entirely on your own device
(or synced only through your own signed-in browser account — never through
Focus Tube's own servers, because it has none):

- **Your settings** (which categories to block, your keyword list) —
  stored via the browser's `storage.sync` API, which is the same
  mechanism the browser itself uses to sync your other extension settings
  across your signed-in devices.
- **A lifetime blocked-video count** — stored via `storage.local` (this
  device only), used solely to show the "blocked total" number in the
  popup and the toolbar badge. It never resets on its own and is never
  read by anything outside the extension.
- **Watch Stats** (see below) — stored via `storage.local` (this device
  only).

Nothing above ever leaves your browser.

## Watch Stats (watch time by content category)

Watch Stats runs continuously whenever you have a YouTube video open —
there is no setting to turn it off. It reads a handful of fields from
**YouTube's own metadata** for whichever video you're watching — never
anything it infers or asks a third party about:

- The **official category** (Education, Entertainment, Autos &
  Vehicles, Howto & Style, and so on — the same field YouTube Studio
  shows creators), with a "Live" override for anything YouTube flags as
  having originated from a live broadcast.
- The video's **length**, to show what percentage of it you actually
  watched.
- The **creator's own tags** (the first handful only), shown as plain
  text under the category badge — a finer-grained signal than the one
  broad official category.
- The **publish date**, bucketed into Recent / This year / Older, to
  show whether you tend to watch newer uploads or older ones.

Focus Tube also measures how many seconds of actual video playback you
watch (not wall-clock tab-open time; pausing doesn't lose
already-accumulated time, it just stops the count while paused). All of
this is stored locally, entirely on your device, to power the category
pie chart, the upload-age bar, and the "last watched" card shown in the
popup.

**How this metadata is read.** It's embedded directly in YouTube's own
watch page as plain page data. Most of the time Focus Tube reads it
straight out of the current page for free, at no extra network cost.
Because YouTube is a single-page app, though, clicking from one video to
the next without a full page reload leaves that embedded data pointing
at the *previous* video — the only way to get the new video's metadata
in that case is to ask YouTube for it directly, so Focus Tube makes a
same-origin request back to that video's own `youtube.com` watch page
(never a third party, never an ad or analytics domain) and reads the
same fields out of the response. No video data, title, tags, or anything
else is ever sent to a server Focus Tube controls, an AI model, or
anyone else — this request only ever goes to YouTube itself, for a video
you already chose to open.

This data accumulates for as long as the extension is installed — there
is no in-popup way to pause tracking or reset the totals. The only way to
stop tracking or clear this data is to remove the extension, which
deletes its locally stored data as part of the browser's normal extension
uninstall behavior.

## Permissions

- **`storage`** — required to save your settings, the local block count,
  and the local Watch Stats data described above.
- **Host access to `*://*.youtube.com/*`** — required so the extension's
  content script can run on YouTube pages to find and hide Shorts,
  Mixes, and keyword-matched videos, and (for Watch Stats) to read a
  video's official category from the page and, when needed after an
  in-app navigation, from a same-origin request to that video's own
  `youtube.com` watch page. This access never reaches beyond
  `youtube.com` itself and nothing it reads is ever sent anywhere else.

## Changes to this policy

If this policy changes, the "Last updated" date above will change and the
update will be reflected in the extension's Chrome Web Store listing.

## Contact

Questions about this policy or the extension can be filed as an issue on
the project's GitHub repository:
https://github.com/bommireddy30/focus-tube
