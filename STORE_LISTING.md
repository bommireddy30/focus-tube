# Chrome Web Store listing — draft copy

Reference doc for the Developer Dashboard fields. Not part of the
extension package itself.

## ASO strategy (India, USA, Germany, Japan)

Chrome Web Store has no hidden keywords field. What feeds search is the
**name** and **summary** (both come from `manifest.json` via
`_locales/<lang>/messages.json`, so changing them needs a new package
upload), the per-language **Description** typed into the dashboard, the
**Category**, and behavioral signals: weekly users, rating count/average,
and update recency. CWS serves the listing in the viewer's Chrome UI
language, so each market is won by its own locale:

| Market  | Chrome UI language most users have | Locale that serves them | Primary search phrases targeted |
|---------|------------------------------------|-------------------------|---------------------------------|
| USA     | English (US)                       | `en`                    | block / hide / remove YouTube Shorts, Shorts blocker, YouTube distraction blocker, focus |
| India   | English (US/UK), some Hindi        | `en`, `hi`              | same English phrases (most Indian searches are English/Hinglish), plus Hindi for Hindi-UI users |
| Germany | German                             | `de`                    | YouTube Shorts ausblenden / entfernen / deaktivieren / blockieren, ablenkungsfrei |
| Japan   | Japanese                           | `ja`                    | YouTube ショート 非表示 / 消す / ブロック, ショート動画, 集中 |

Rules of thumb applied below:
- **Exact search phrase first, in the name.** The name ranks highest. The
  English name now leads with the two biggest verbs ("Hide & Block"); the
  German one uses *ausblenden* (what German users actually type for hiding
  UI elements) ahead of *blockieren*; the Japanese one uses *非表示*
  (the dominant Japanese query term for this) and *ショート動画*.
- **Synonyms go in the summary/description, once each, in real sentences.**
  CWS treats keyword repetition as spam (policy "Keyword spam") and can
  reject or delist — never list keywords, never repeat the same phrase
  more than ~2–3 times in a description.
- **First two lines of the description are the pitch.** Only they show
  before "Read more", and they're weighted for relevance.
- **No competitor names** anywhere — that's an impersonation/keyword-spam
  violation.

### Dashboard checklist per language

In the Developer Dashboard → Store listing, use the language dropdown to
add **English**, **German**, **Japanese**, and **Hindi** and paste the
matching description below into each. Name/summary fill in automatically
from the uploaded package's locales. Optionally upload localized
screenshots and promo tiles per language (see "Localized assets" below) —
a screenshot in the viewer's language noticeably lifts install
conversion, which feeds back into ranking.

---

## English — `en` (USA, India, default for everyone else)

**Name** (manifest, 40 chars): `Focus Tube – Hide & Block YouTube Shorts`

**Summary** (manifest, 129 chars):
```
Shorts blocker: remove YouTube Shorts, Mixes & autoplay. Block channels and keywords, see your watch time. Private and 100% free.
```

**Category:** Productivity (Workflow & Planning, if the dashboard asks
for a sub-category).

**Description:**
```
Hide YouTube Shorts everywhere and get a distraction-free YouTube. Focus Tube is a free Shorts blocker that also removes Mixes, autoplay, and other engagement hooks, so you watch what you came for and leave.

Unofficial and independent — not affiliated with, endorsed by, or sponsored by YouTube or Google.

WHAT IT BLOCKS
• The Shorts player — opening a /shorts/ link redirects to the normal watch page or straight home, your choice.
• Shorts shelves — the carousel on Home and Subscriptions.
• Shorts in search — the shelf and filter chip on search results.
• Loose Shorts — individual Shorts cards in feeds, History, channel pages, and up-next.
• Shorts links — the sidebar entry, filter chip, and channel tab.
• Mixes — YouTube's auto-generated "Mixes for you" playlists.
• Autoplay — switches autoplay off and removes the toggle.
• "Explore more topics" and "Continue watching" shelves — optional.
• Calm Mode — mutes YouTube's red urgency accents and notification badge, softly blurs clickbait thumbnails (hover to reveal), and stops hover-preview autoplay.
• Keywords — hide any video by words in its title, channel, or description, with optional whole-word matching and 7-day auto-delete.
• Blocked Channels — hide every video from a channel you pick, everywhere, including Search (unlike YouTube's own "Don't recommend channel").

WATCH STATS
See where your YouTube time goes: minutes per category (Education, Entertainment, Music…), time spent by day, week, and month compared with the previous periods, and how much of your last video you actually watched. Stored only on your device.

WHY
Shorts, autoplay, and red badges are engagement mechanics, not neutral defaults. Focus Tube turns them off so YouTube works like a tool you use on purpose — great for studying, working, and digital wellbeing.

PRIVATE BY DESIGN
No account, no analytics, no servers. Nothing is ever sent to a third party. Watch Stats stays in your browser's local storage; settings sync only through Chrome's own extension sync. Privacy policy: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

FREE AND OPEN SOURCE
Every feature is free — no tiers, no daily cap, no license key.
https://github.com/bommireddy30/focus-tube

Available in English, Deutsch, 日本語, and हिन्दी.
```

---

## German — `de` (Germany, Austria, Switzerland)

**Name** (51 chars): `Focus Tube – YouTube Shorts ausblenden & blockieren`

**Summary** (132 chars):
```
Entfernt YouTube Shorts, Mixe & Autoplay. Sperrt Kanäle und Stichwörter, zeigt deine Wiedergabezeit. Ablenkungsfrei, privat, gratis.
```

**Description:**
```
YouTube Shorts überall ausblenden und YouTube endlich ablenkungsfrei nutzen. Focus Tube ist ein kostenloser Shorts-Blocker, der außerdem Mixe, Autoplay und andere Aufmerksamkeitsfallen entfernt – du schaust, wofür du gekommen bist, und gehst wieder.

Inoffiziell und unabhängig – nicht mit YouTube oder Google verbunden, von ihnen unterstützt oder gesponsert.

WAS BLOCKIERT WIRD
• Der Shorts-Player – ein /shorts/-Link öffnet sich als normales Video oder führt direkt zur Startseite, ganz wie du willst.
• Shorts-Regale – das Karussell auf der Startseite und unter Abos.
• Shorts in der Suche – Regal und Filter-Chip in den Suchergebnissen.
• Einzelne Shorts – Shorts-Karten in Feeds, Verlauf, Kanalseiten und „Nächstes Video“.
• Shorts-Links – Seitenleisten-Eintrag, Filter-Chip und Kanal-Tab.
• Mixe – YouTubes automatisch erstellte „Mixe für dich“-Playlists.
• Autoplay – schaltet die automatische Wiedergabe ab und entfernt den Schalter.
• „Weitere Themen entdecken“ und „Weiterschauen“ – optional ausblendbar.
• Ruhemodus – dämpft YouTubes rote Dringlichkeitsakzente und das Benachrichtigungs-Badge, zeichnet Clickbait-Thumbnails weich (Maus darüber zum Anzeigen) und stoppt die Vorschau-Wiedergabe beim Hovern.
• Stichwörter – Videos nach Wörtern in Titel, Kanal oder Beschreibung ausblenden, optional nur ganze Wörter und mit automatischem Löschen nach 7 Tagen.
• Gesperrte Kanäle – alle Videos eines Kanals überall ausblenden, auch in der Suche (anders als YouTubes „Kanal nicht empfehlen“).

STATISTIK
Sieh, wohin deine YouTube-Zeit geht: Minuten pro Kategorie (Bildung, Unterhaltung, Musik …), Wiedergabezeit nach Tag, Woche und Monat im Vergleich zu den Vorperioden und wie viel deines letzten Videos du wirklich gesehen hast. Alles bleibt auf deinem Gerät.

WARUM
Shorts, Autoplay und rote Badges sind gezielte Mechaniken, um dich festzuhalten. Focus Tube schaltet sie ab, damit YouTube wieder ein Werkzeug ist, das du bewusst nutzt – ideal zum Lernen, Arbeiten und für digitales Wohlbefinden.

DATENSCHUTZ
Kein Konto, keine Analyse-Tools, keine Server. Es werden keinerlei Daten an Dritte gesendet. Die Statistik liegt nur im lokalen Speicher deines Browsers; Einstellungen werden ausschließlich über Chromes eigene Erweiterungs-Synchronisierung abgeglichen. Datenschutzerklärung: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

KOSTENLOS UND OPEN SOURCE
Alle Funktionen sind kostenlos – keine Abo-Stufen, kein Tageslimit, kein Lizenzschlüssel.
https://github.com/bommireddy30/focus-tube
```

---

## Japanese — `ja` (Japan)

**Name** (36 chars): `Focus Tube – YouTube ショート動画を非表示・ブロック`

**Summary** (77 chars):
```
YouTubeのショート動画を非表示に。ミックス・自動再生・指定したチャンネルやキーワードもブロックし、視聴時間を記録。無料・登録不要・プライバシー重視。
```

**Description:**
```
YouTubeのショート動画をすべて非表示にして、集中できるYouTubeに。Focus Tube は無料のショートブロッカーです。ミックスや自動再生など、ついダラダラ見てしまう仕掛けもまとめて消せるので、見たい動画だけ見て終われます。

非公式・独立したツールです。YouTube および Google とは提携・承認・後援の関係にありません。

ブロックできるもの
・ショートのプレーヤー — /shorts/ のリンクを通常の動画ページで開くか、ホームに戻すかを選べます。
・ショートの棚 — ホームと登録チャンネルに出るショートのカルーセル。
・検索結果のショート — 検索ページのショート棚とフィルタチップ。
・単体のショート — フィード、履歴、チャンネルページ、次の動画に混ざるショート。
・ショートへのリンク — サイドバーの項目、フィルタチップ、チャンネルのタブ。
・ミックス — 自動生成される「ミックス」プレイリスト。
・自動再生 — 自動再生をオフにし、切り替えボタンも非表示に。
・「他のトピックを探す」「続きから再生」 — 任意で非表示にできます。
・カームモード — 赤い強調色や通知バッジを落ち着いた色にし、釣りサムネイルをぼかし(マウスを乗せると表示)、ホバー時のプレビュー再生を止めます。
・キーワード — タイトル・チャンネル名・説明文に含まれる言葉で動画を非表示。単語単位の一致や7日後の自動削除にも対応。
・チャンネルのブロック — 指定したチャンネルの動画を検索結果も含めてどこでも非表示(YouTube標準の「チャンネルをおすすめに表示しない」と違い、検索にも効きます)。

視聴統計
カテゴリ別(教育、エンターテイメント、音楽など)の視聴時間、日・週・月ごとの視聴時間と前の期間との比較、直前に見た動画を何%見たかを確認できます。データは端末内にのみ保存されます。

なぜ必要?
ショート、自動再生、赤いバッジは、見続けさせるための仕組みです。Focus Tube はそれらをオフにして、YouTube を「目的を持って使う道具」に戻します。勉強や仕事、デジタルウェルビーイングに。

プライバシー
アカウント登録・解析ツール・サーバーは一切なし。第三者にデータを送信することはありません。視聴統計はブラウザのローカルストレージにのみ保存され、設定は Chrome 標準の拡張機能同期だけで同期されます。プライバシーポリシー:https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

完全無料・オープンソース
すべての機能が無料。有料プラン・利用制限・ライセンスキーはありません。
https://github.com/bommireddy30/focus-tube
```

---

## Hindi — `hi` (India, Hindi Chrome UI)

Only the name/summary/action title are localized in the package
(`_locales/hi`); the popup itself falls back to English per key, which is
fine for this audience. Keep "YouTube Shorts" in Latin script — Indian
users overwhelmingly search the brand terms that way, even in Hindi.

**Name** (47 chars): `Focus Tube – YouTube Shorts हटाएं और ब्लॉक करें`

**Summary** (130 chars):
```
YouTube Shorts, Mixes और ऑटोप्ले हटाएं। चैनल और कीवर्ड ब्लॉक करें, अपना वॉच टाइम देखें। बिना ध्यान भटकाए, निजी और पूरी तरह मुफ़्त।
```

**Description:**
```
YouTube Shorts को हर जगह से हटाएं और बिना ध्यान भटकाए YouTube देखें। Focus Tube एक मुफ़्त Shorts blocker है जो Mixes, ऑटोप्ले और दूसरी ध्यान खींचने वाली चीज़ों को भी हटा देता है — जो देखने आए थे वही देखें, और निकल जाएं।

यह अनौपचारिक और स्वतंत्र है — YouTube या Google से जुड़ा, समर्थित या प्रायोजित नहीं।

क्या-क्या ब्लॉक होता है
• Shorts प्लेयर — /shorts/ लिंक सामान्य वीडियो पेज पर खुलता है या सीधे होम पर, आपकी पसंद।
• Home और Subscriptions पर Shorts की पट्टी।
• सर्च रिज़ल्ट में Shorts और उसका फ़िल्टर।
• फ़ीड, History, चैनल पेज और up-next में अलग-अलग Shorts।
• साइडबार, फ़िल्टर और चैनल टैब में Shorts के लिंक।
• Mixes — YouTube की अपने-आप बनी प्लेलिस्ट।
• ऑटोप्ले — बंद करता है और उसका बटन भी हटाता है।
• "Explore more topics" और "Continue watching" — वैकल्पिक।
• Calm Mode — लाल रंग और नोटिफ़िकेशन बैज को शांत करता है, clickbait थंबनेल धुंधले करता है।
• कीवर्ड — टाइटल, चैनल या विवरण के शब्दों से वीडियो छिपाएं।
• चैनल ब्लॉक — किसी चैनल के सभी वीडियो हर जगह छिपाएं, सर्च में भी।

वॉच स्टैट्स
किस कैटेगरी में कितना समय गया, दिन/हफ़्ते/महीने के हिसाब से वॉच टाइम — सब कुछ सिर्फ़ आपके डिवाइस पर।

प्राइवेसी
कोई अकाउंट नहीं, कोई एनालिटिक्स नहीं, कोई सर्वर नहीं। कोई भी डेटा किसी तीसरे पक्ष को नहीं भेजा जाता। प्राइवेसी पॉलिसी: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

पूरी तरह मुफ़्त और ओपन सोर्स
https://github.com/bommireddy30/focus-tube
```

---

## Localized assets (per language)

Ready: `store-assets/ja/` and `store-assets/de/` each hold
`popup-blocking.png` and `popup-stats.png` (1280x800, 24-bit, no
alpha): the real popup rendered in that language with the same demo data
as the English shots, plus translated headline/pill copy. In the
dashboard, switch the listing language to Japanese/German and upload
those two in place of the English popup screenshots. The three
`youtube-*.png` screenshots and the promo tiles stay shared across
languages. Regenerate with `store-assets/capture-localized.js`.

## Off-listing signals (they move ranking as much as copy does)

- **Ratings:** the in-popup rate-us button is the main lever. Reply to
  every review in the reviewer's language — replies are public and help
  conversion.
- **Update cadence:** CWS favors recently-updated items; ship at least
  one meaningful update a month.
- **Outside traffic:** installs from outside the store (README, a GitHub
  Pages site, posts on r/productivity / r/nosurf, Qiita or Zenn for
  Japan, German tech blogs/forums) raise weekly users, the strongest
  ranking input.
- **Measure:** Developer Dashboard → Analytics shows impressions and
  installs by country — compare 4 weeks before/after this change for IN,
  US, DE, JP before iterating on wording.

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
(chrome.storage.sync); a local lifetime blocked-count used only for the
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
- `popup-blocking.png` — Blocking tab, Blocked Channels populated with
  example entries, including the auto-block-after-60%-watched toggle
- `popup-stats.png` — Watch Stats tab, real category donut + the new
  Time Spent card (all-time total + By month breakdown)
- `youtube-search.png`
- `youtube-watch.png`
- `youtube-home.png`

## Small promo tile (440x280)

Ready: `store-assets/promo-small.png`.

## Marquee promo tile (1400x560)

Ready: `store-assets/promo-marquee.png`.
