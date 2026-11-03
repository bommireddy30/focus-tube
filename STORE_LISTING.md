# Chrome Web Store listing — draft copy

Reference doc for the Developer Dashboard fields. Not part of the
extension package itself.

## ASO strategy (India, USA, Europe, Japan, Korea, Latin America, Southeast Asia, Middle East)

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
| India   | English (US/UK), some Hindi        | `en`, `hi`              | same English phrases (most Indian searches are English/Hinglish), plus Hindi for Hindi-UI users (full Hindi popup + screenshots as of 3.8.13) |
| Germany | German                             | `de`                    | YouTube Shorts ausblenden / entfernen / deaktivieren / blockieren, ablenkungsfrei |
| Japan   | Japanese                           | `ja`                    | YouTube ショート 非表示 / 消す / ブロック, ショート動画, 集中 |
| Indonesia | Indonesian                       | `id`                    | sembunyikan / blokir / hapus YouTube Shorts, pemblokir Shorts |
| Malaysia | English, Malay                    | `en`, `ms`              | English phrases, plus sembunyi / sekat YouTube Shorts |
| Philippines | English, some Filipino         | `en`, `fil`             | English phrases (Taglish), plus itago / i-block ang YouTube Shorts |
| Vietnam | Vietnamese                         | `vi`                    | ẩn / chặn / xóa YouTube Shorts |
| Thailand | Thai                              | `th`                    | ซ่อน / บล็อก / ปิด YouTube Shorts |
| Singapore | English                          | `en`                    | same English phrases |
| Romania | Romanian                           | `ro`                    | ascunde / blochează / elimină YouTube Shorts |
| Brazil  | Portuguese (Brazil)                | `pt_BR`                 | ocultar / bloquear / remover / tirar YouTube Shorts, bloqueador de Shorts |
| Portugal | Portuguese (Portugal)             | `pt_PT`                 | ocultar / bloquear / remover YouTube Shorts |
| Spain, Mexico, Latin America | Spanish       | `es` (Chrome falls back `es-419`/`es-MX` → `es`) | ocultar / bloquear / quitar / eliminar Shorts de YouTube |
| France, Belgium, Canada | French             | `fr`                    | masquer / bloquer / supprimer les Shorts YouTube |
| Russia, CIS | Russian                        | `ru`                    | скрыть / убрать / заблокировать Shorts на YouTube, блокировщик Shorts |
| Ukraine | Ukrainian                          | `uk`                    | приховати / заблокувати / прибрати Shorts на YouTube |
| Italy   | Italian                            | `it`                    | nascondere / bloccare / rimuovere gli Shorts di YouTube |
| South Korea | Korean                         | `ko`                    | 쇼츠 숨기기 / 차단 / 끄기, YouTube Shorts 차단 |
| Taiwan, Hong Kong | Chinese (Traditional)    | `zh_TW`                 | 封鎖 / 隱藏 / 關閉 YouTube Shorts, 短片 |
| Chinese diaspora | Chinese (Simplified)      | `zh_CN`                 | 屏蔽 / 隐藏 / 关闭 YouTube Shorts, 短视频 |
| Turkey  | Turkish                            | `tr`                    | YouTube Shorts gizle / engelle / kaldır / kapat |
| Poland  | Polish                             | `pl`                    | ukryj / zablokuj / usuń / wyłącz Shorts YouTube |
| Netherlands | Dutch, often English           | `nl`, `en`              | YouTube Shorts verbergen / blokkeren / uitzetten |
| Saudi Arabia, Egypt, UAE, Gulf | Arabic, much English | `ar` (listing only), `en` | إخفاء / حظر / إزالة YouTube Shorts، مانع Shorts |

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
add **English**, **German**, **Japanese**, **Hindi**, **Indonesian**,
**Malay**, **Filipino**, **Vietnamese**, **Thai**, **Romanian**,
**Portuguese (Brazil)**, **Portuguese (Portugal)**, **Spanish**,
**French**, **Russian**, **Italian**, **Korean**, **Chinese (Simplified)**,
**Chinese (Traditional)**, **Turkish**, **Polish**, **Dutch**,
**Ukrainian**, and **Arabic** and paste the matching description below into each.
(Spanish: add plain **Spanish**; there's no need for a separate "Spanish
(Latin America)" listing, since Latin-American users fall back to it.) Name/summary fill in automatically
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

Available in English, Español, Português, Français, Deutsch, Italiano, Nederlands, Polski, Română, Türkçe, Русский, Українська, 日本語, 한국어, 简体中文, 繁體中文, हिन्दी, Bahasa Indonesia, Bahasa Melayu, Filipino, Tiếng Việt, and ไทย.
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

The popup is fully in Hindi as of 3.8.13 (it used to fall back to
English), and `store-assets/hi/` has Hindi screenshots, so Hindi-UI
users now see their language from listing to popup. The copy is
deliberately Hinglish where Indian YouTube itself is: "YouTube Shorts",
"Mixes", "Calm Mode" and several suggested keywords (*roast*, *exposed*,
*must watch*) stay in Latin script, because that's how Indian users
search and how those titles are written. Keep it that way.

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

## Indonesian — `id` (Indonesia)

Indonesian searches mix English loanwords freely ("blokir Shorts",
"hapus Shorts YouTube"); *sembunyikan* and *blokir* are the two verbs in
the name. "Channel" stays English — that's what YouTube's own Indonesian
UI calls it.

**Name** (48 chars): `Focus Tube – Sembunyikan & Blokir YouTube Shorts`

**Summary** (129 chars):
```
Pemblokir Shorts: hapus YouTube Shorts, Mix & putar otomatis. Blokir channel dan kata kunci, lihat waktu tonton. Privat & gratis.
```

**Description:**
```
Sembunyikan YouTube Shorts di mana saja dan nikmati YouTube tanpa gangguan. Focus Tube adalah pemblokir Shorts gratis yang juga menghapus Mix, putar otomatis, dan pemancing perhatian lainnya — tonton yang Anda cari, lalu selesai.

Tidak resmi dan independen — tidak berafiliasi dengan, didukung, atau disponsori oleh YouTube atau Google.

YANG DIBLOKIR
• Pemutar Shorts — link /shorts/ dibuka sebagai video biasa atau langsung ke Beranda, sesuai pilihan Anda.
• Rak Shorts — carousel di Beranda dan Subscription.
• Shorts di penelusuran — rak dan chip filter di hasil penelusuran.
• Shorts lepas — kartu Shorts di feed, Histori, halaman channel, dan video berikutnya.
• Link Shorts — entri sidebar, chip filter, dan tab channel.
• Mix — playlist "Mix untuk Anda" yang dibuat otomatis oleh YouTube.
• Putar otomatis — dimatikan dan tombolnya dihapus.
• Rak "Jelajahi topik lainnya" dan "Lanjutkan menonton" — opsional.
• Mode Tenang — meredam aksen merah dan badge notifikasi YouTube, memburamkan thumbnail clickbait (arahkan kursor untuk melihat), dan menghentikan pratinjau otomatis saat kursor di atas video.
• Kata kunci — sembunyikan video berdasarkan kata di judul, channel, atau deskripsi, dengan opsi kata utuh dan hapus otomatis setelah 7 hari.
• Channel yang Diblokir — sembunyikan semua video dari channel pilihan Anda, di mana saja, termasuk Penelusuran (berbeda dengan "Jangan rekomendasikan channel" milik YouTube).

STATISTIK TONTON
Lihat ke mana waktu YouTube Anda pergi: menit per kategori (Pendidikan, Hiburan, Musik…), waktu tonton per hari, minggu, dan bulan dibandingkan periode sebelumnya, dan berapa banyak video terakhir yang benar-benar Anda tonton. Disimpan hanya di perangkat Anda.

KENAPA
Shorts, putar otomatis, dan badge merah adalah mekanisme untuk membuat Anda terus menonton. Focus Tube mematikannya agar YouTube kembali jadi alat yang Anda gunakan dengan sengaja — cocok untuk belajar, bekerja, dan kesejahteraan digital.

PRIVASI
Tanpa akun, tanpa analitik, tanpa server. Tidak ada data yang dikirim ke pihak ketiga. Statistik tonton tersimpan di penyimpanan lokal browser; pengaturan hanya disinkronkan lewat sinkronisasi ekstensi Chrome. Kebijakan privasi: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATIS DAN OPEN SOURCE
Semua fitur gratis — tanpa paket berbayar, tanpa batas harian, tanpa kunci lisensi.
https://github.com/bommireddy30/focus-tube
```

---

## Malay — `ms` (Malaysia, Brunei)

Many Malaysian Chrome users run an English UI and get the `en` listing;
this one catches the Malay-UI share. *Sekat* is the standard Malay verb
for block (YouTube's own Malay UI uses it); *saluran* for channel.

**Name** (44 chars): `Focus Tube – Sembunyi & Sekat YouTube Shorts`

**Summary** (130 chars):
```
Penyekat Shorts: buang YouTube Shorts, Mix & automain. Sekat saluran dan kata kunci, lihat masa tontonan anda. Peribadi & percuma.
```

**Description:**
```
Sembunyikan YouTube Shorts di mana-mana dan gunakan YouTube tanpa gangguan. Focus Tube ialah penyekat Shorts percuma yang turut membuang Mix, automain dan umpan perhatian lain — tonton apa yang anda cari, kemudian beredar.

Tidak rasmi dan bebas — tidak bergabung dengan, disokong atau ditaja oleh YouTube atau Google.

APA YANG DISEKAT
• Pemain Shorts — pautan /shorts/ dibuka sebagai video biasa atau terus ke Laman Utama, ikut pilihan anda.
• Rak Shorts — karusel di Laman Utama dan Langganan.
• Shorts dalam carian — rak dan cip penapis dalam hasil carian.
• Shorts berselerak — kad Shorts dalam suapan, Sejarah, halaman saluran dan video seterusnya.
• Pautan Shorts — entri bar sisi, cip penapis dan tab saluran.
• Mix — senarai main "Mix untuk anda" yang dijana automatik oleh YouTube.
• Automain — dimatikan dan togolnya dibuang.
• Rak "Teroka lebih banyak topik" dan "Teruskan menonton" — pilihan.
• Mod Tenang — meredupkan aksen merah dan lencana pemberitahuan YouTube, mengaburkan lakaran kecil clickbait (tuding untuk melihat) dan menghentikan pratonton automatik apabila dituding.
• Kata kunci — sembunyikan video mengikut perkataan dalam tajuk, saluran atau penerangan, dengan pilihan perkataan penuh dan padam automatik selepas 7 hari.
• Saluran Disekat — sembunyikan setiap video daripada saluran pilihan anda, di mana-mana, termasuk Carian (tidak seperti "Jangan syorkan saluran" YouTube).

STATISTIK TONTONAN
Lihat ke mana masa YouTube anda pergi: minit mengikut kategori (Pendidikan, Hiburan, Muzik…), masa tontonan mengikut hari, minggu dan bulan berbanding tempoh sebelumnya, dan berapa banyak video terakhir yang benar-benar anda tonton. Disimpan pada peranti anda sahaja.

KENAPA
Shorts, automain dan lencana merah ialah mekanisme untuk memastikan anda terus menonton. Focus Tube mematikannya supaya YouTube kembali menjadi alat yang anda gunakan dengan sengaja — sesuai untuk belajar, bekerja dan kesejahteraan digital.

PRIVASI
Tiada akaun, tiada analitik, tiada pelayan. Tiada data dihantar kepada pihak ketiga. Statistik tontonan kekal dalam storan setempat pelayar anda; tetapan hanya disegerakkan melalui penyegerakan sambungan Chrome sendiri. Dasar privasi: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

PERCUMA DAN SUMBER TERBUKA
Semua ciri percuma — tiada pelan berbayar, tiada had harian, tiada kunci lesen.
https://github.com/bommireddy30/focus-tube
```

---

## Filipino — `fil` (Philippines)

Most Filipino Chrome users run an English UI, so the `en` listing is
still the main one for the Philippines; this serves the Filipino-UI
share. Kept in the Taglish register Filipino YouTube actually uses
("I-block", "channel", "watch time") — pure Tagalog terms read as stiff
and aren't what people search for.

**Name** (48 chars): `Focus Tube – Itago at I-block ang YouTube Shorts`

**Summary** (131 chars):
```
Shorts blocker: alisin ang YouTube Shorts, Mix at autoplay. I-block ang channel at keyword, tingnan ang watch time. Pribado, libre.
```

**Description:**
```
Itago ang YouTube Shorts kahit saan at mag-YouTube nang walang abala. Ang Focus Tube ay libreng Shorts blocker na nag-aalis din ng Mix, autoplay, at iba pang pang-akit ng atensyon — panoorin ang talagang pinunta mo, tapos umalis na.

Hindi opisyal at independiyente — walang kaugnayan, endorso, o sponsor mula sa YouTube o Google.

ANO ANG BINA-BLOCK
• Shorts player — ang /shorts/ link ay bubukas bilang normal na video o diretso sa Home, ikaw ang pipili.
• Mga Shorts shelf — ang carousel sa Home at Subscriptions.
• Shorts sa search — ang shelf at filter chip sa search results.
• Mga hiwalay na Shorts — Shorts card sa mga feed, History, channel page, at up-next.
• Mga Shorts link — entry sa sidebar, filter chip, at tab ng channel.
• Mix — ang awtomatikong "Mix para sa iyo" na playlist ng YouTube.
• Autoplay — pinapatay at inaalis ang toggle.
• "Mag-explore ng iba pang paksa" at "Ituloy ang panonood" — opsyonal.
• Calm Mode — pinalalamlam ang pulang accent at notification badge ng YouTube, pinalalabo ang clickbait na thumbnail (i-hover para makita), at pinipigilan ang hover-preview autoplay.
• Mga keyword — itago ang video ayon sa salita sa pamagat, channel, o paglalarawan, may opsyong buong salita lang at awtomatikong pagbura pagkalipas ng 7 araw.
• Mga naka-block na channel — itago ang bawat video ng napili mong channel, kahit saan, pati sa Search (hindi tulad ng "Huwag irekomenda ang channel" ng YouTube).

WATCH STATS
Tingnan kung saan napupunta ang oras mo sa YouTube: minuto bawat kategorya (Edukasyon, Entertainment, Musika…), watch time bawat araw, linggo, at buwan kumpara sa mga nakaraang period, at gaano karami ng huling video ang talagang napanood mo. Sa device mo lang naka-save.

BAKIT
Ang Shorts, autoplay, at pulang badge ay mga mekanismo para hindi ka umalis. Pinapatay ito ng Focus Tube para maging tool ulit ang YouTube na sadyang ginagamit mo — mainam sa pag-aaral, trabaho, at digital wellbeing.

PRIBADO
Walang account, walang analytics, walang server. Walang data na ipinapadala sa third party. Nasa local storage ng browser mo ang Watch Stats; ang mga setting ay naka-sync lang sa sariling extension sync ng Chrome. Privacy policy: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

LIBRE AT OPEN SOURCE
Libre ang bawat feature — walang tier, walang daily limit, walang license key.
https://github.com/bommireddy30/focus-tube
```

---

## Vietnamese — `vi` (Vietnam)

*Ẩn* (hide) and *chặn* (block) are the two dominant query verbs
("ẩn Shorts YouTube", "chặn YouTube Shorts"). Vietnamese is
syllable-spaced, so whole-word keyword matching works as in English.

**Name** (37 chars): `Focus Tube – Ẩn & chặn YouTube Shorts`

**Summary** (119 chars):
```
Chặn Shorts: xóa YouTube Shorts, Mix và tự động phát. Chặn kênh, từ khóa, xem thời gian xem. Riêng tư và miễn phí 100%.
```

**Description:**
```
Ẩn YouTube Shorts ở mọi nơi và dùng YouTube không bị phân tâm. Focus Tube là tiện ích chặn Shorts miễn phí, đồng thời xóa Mix, tự động phát và các mồi câu tương tác khác — bạn xem đúng thứ mình cần rồi rời đi.

Không chính thức và độc lập — không liên kết, không được YouTube hay Google xác nhận hoặc tài trợ.

NHỮNG GÌ BỊ CHẶN
• Trình phát Shorts — liên kết /shorts/ mở như video thường hoặc về thẳng Trang chủ, tùy bạn chọn.
• Kệ Shorts — băng chuyền trên Trang chủ và Kênh đăng ký.
• Shorts trong tìm kiếm — kệ và thẻ lọc trong kết quả tìm kiếm.
• Shorts lẻ — thẻ Shorts trong nguồn cấp, Lịch sử, trang kênh và video tiếp theo.
• Liên kết Shorts — mục thanh bên, thẻ lọc và tab kênh.
• Mix — danh sách phát "Mix dành cho bạn" do YouTube tự tạo.
• Tự động phát — tắt và xóa nút bật/tắt.
• Kệ "Khám phá thêm chủ đề" và "Tiếp tục xem" — tùy chọn.
• Chế độ yên tĩnh — làm dịu màu đỏ và huy hiệu thông báo của YouTube, làm mờ hình thu nhỏ câu view (di chuột để xem) và dừng xem trước tự động khi di chuột.
• Từ khóa — ẩn video theo từ trong tiêu đề, tên kênh hoặc mô tả, có tùy chọn khớp nguyên từ và tự động xóa sau 7 ngày.
• Kênh bị chặn — ẩn mọi video của kênh bạn chọn ở mọi nơi, kể cả Tìm kiếm (khác với "Không đề xuất kênh này" của YouTube).

THỐNG KÊ XEM
Biết thời gian YouTube của bạn đi đâu: số phút theo danh mục (Giáo dục, Giải trí, Âm nhạc…), thời gian xem theo ngày, tuần, tháng so với các kỳ trước, và bạn thực sự đã xem bao nhiêu phần video gần nhất. Chỉ lưu trên thiết bị của bạn.

VÌ SAO
Shorts, tự động phát và huy hiệu đỏ là cơ chế giữ chân người xem. Focus Tube tắt chúng để YouTube trở lại là công cụ bạn dùng có chủ đích — phù hợp để học tập, làm việc và cân bằng kỹ thuật số.

RIÊNG TƯ
Không tài khoản, không phân tích, không máy chủ. Không dữ liệu nào được gửi cho bên thứ ba. Thống kê xem nằm trong bộ nhớ cục bộ của trình duyệt; cài đặt chỉ đồng bộ qua tính năng đồng bộ tiện ích của chính Chrome. Chính sách quyền riêng tư: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

MIỄN PHÍ VÀ MÃ NGUỒN MỞ
Mọi tính năng đều miễn phí — không gói trả phí, không giới hạn hằng ngày, không khóa bản quyền.
https://github.com/bommireddy30/focus-tube
```

---

## Thai — `th` (Thailand)

*ซ่อน* (hide) and *บล็อก* (block) are the common query terms; Thai users
search the brand as "YouTube Shorts" in Latin script. Thai is written
without spaces between words, so whole-word keyword matching falls back
to substring for Thai keywords (see `matchesKeyword` in `content.js`).

**Name** (40 chars): `Focus Tube – ซ่อนและบล็อก YouTube Shorts`

**Summary** (122 chars):
```
ตัวบล็อก Shorts: ลบ YouTube Shorts, มิกซ์ และการเล่นอัตโนมัติ บล็อกช่องและคีย์เวิร์ด ดูเวลาดูของคุณ เป็นส่วนตัวและฟรี 100%
```

**Description:**
```
ซ่อน YouTube Shorts ทุกที่ และใช้ YouTube ได้โดยไม่ถูกรบกวน Focus Tube คือตัวบล็อก Shorts ฟรีที่ช่วยลบมิกซ์ การเล่นอัตโนมัติ และตัวล่อความสนใจอื่นๆ — ดูสิ่งที่ตั้งใจมาดู แล้วก็ไป

ไม่เป็นทางการและเป็นอิสระ — ไม่มีส่วนเกี่ยวข้อง ไม่ได้รับการรับรองหรือสนับสนุนจาก YouTube หรือ Google

สิ่งที่บล็อก
• เพลเยอร์ Shorts — ลิงก์ /shorts/ จะเปิดเป็นวิดีโอปกติหรือกลับหน้าแรกทันที ตามที่คุณเลือก
• ชั้นวาง Shorts — แถบเลื่อนในหน้าแรกและการติดตาม
• Shorts ในการค้นหา — ชั้นวางและชิปตัวกรองในผลการค้นหา
• Shorts ที่กระจายอยู่ — การ์ด Shorts ในฟีด ประวัติ หน้าช่อง และวิดีโอถัดไป
• ลิงก์ Shorts — รายการในแถบด้านข้าง ชิปตัวกรอง และแท็บของช่อง
• มิกซ์ — เพลย์ลิสต์ "มิกซ์สำหรับคุณ" ที่ YouTube สร้างอัตโนมัติ
• เล่นอัตโนมัติ — ปิดและนำปุ่มเปิด/ปิดออก
• ชั้นวาง "สำรวจหัวข้ออื่นๆ" และ "ดูต่อ" — เลือกได้
• โหมดสงบ — ลดสีแดงและป้ายแจ้งเตือนของ YouTube เบลอภาพขนาดย่อแบบคลิกเบต (วางเมาส์เพื่อดู) และหยุดการเล่นตัวอย่างเมื่อวางเมาส์
• คีย์เวิร์ด — ซ่อนวิดีโอตามคำในชื่อ ช่อง หรือคำอธิบาย พร้อมตัวเลือกลบอัตโนมัติหลัง 7 วัน
• ช่องที่บล็อก — ซ่อนทุกวิดีโอจากช่องที่คุณเลือก ทุกที่ รวมถึงการค้นหา (ต่างจาก "ไม่ต้องแนะนำช่องนี้" ของ YouTube)

สถิติการดู
ดูว่าเวลาบน YouTube ของคุณหมดไปกับอะไร: นาทีต่อหมวดหมู่ (การศึกษา บันเทิง เพลง…) เวลาดูรายวัน รายสัปดาห์ และรายเดือนเทียบกับช่วงก่อนหน้า และคุณดูวิดีโอล่าสุดไปจริงๆ เท่าไร เก็บไว้ในอุปกรณ์ของคุณเท่านั้น

ทำไม
Shorts การเล่นอัตโนมัติ และป้ายสีแดง คือกลไกที่ออกแบบมาให้คุณดูต่อไปเรื่อยๆ Focus Tube ปิดสิ่งเหล่านี้เพื่อให้ YouTube กลับมาเป็นเครื่องมือที่คุณใช้อย่างตั้งใจ — เหมาะกับการเรียน การทำงาน และสุขภาวะดิจิทัล

ความเป็นส่วนตัว
ไม่ต้องมีบัญชี ไม่มีระบบวิเคราะห์ ไม่มีเซิร์ฟเวอร์ ไม่มีข้อมูลใดถูกส่งให้บุคคลที่สาม สถิติการดูเก็บอยู่ในพื้นที่จัดเก็บในเบราว์เซอร์ของคุณ การตั้งค่าซิงค์ผ่านระบบซิงค์ส่วนขยายของ Chrome เท่านั้น นโยบายความเป็นส่วนตัว: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

ฟรีและโอเพนซอร์ส
ทุกฟีเจอร์ฟรี — ไม่มีแพ็กเกจเสียเงิน ไม่จำกัดรายวัน ไม่ต้องใช้คีย์ใบอนุญาต
https://github.com/bommireddy30/focus-tube
```

---

## Romanian — `ro` (Romania, Moldova)

Romanian queries use *ascunde* / *blochează* / *elimină* plus the
English brand terms ("YouTube Shorts" isn't translated). Written with
proper comma-below diacritics (ș, ț), which is what Romanian Chrome
users type and what CWS search normalizes to.

**Name** (48 chars): `Focus Tube – Ascunde și blochează YouTube Shorts`

**Summary** (131 chars):
```
Elimină YouTube Shorts, Mixurile și redarea automată. Blochează canale și cuvinte cheie, vezi timpul de vizionare. Privat, gratuit.
```

**Description:**
```
Ascunde YouTube Shorts peste tot și folosește YouTube fără distrageri. Focus Tube este un blocant gratuit pentru Shorts care elimină și Mixurile, redarea automată și alte momeli de atenție — vezi ce ai venit să vezi și pleci.

Neoficial și independent — neafiliat cu, nesusținut și nesponsorizat de YouTube sau Google.

CE BLOCHEAZĂ
• Playerul Shorts — un link /shorts/ se deschide ca videoclip normal sau te duce direct pe Pagina principală, cum alegi tu.
• Rafturi Shorts — caruselul de pe Pagina principală și Abonamente.
• Shorts în căutare — raftul și filtrul din rezultatele căutării.
• Shorts răzlețe — carduri Shorts în fluxuri, Istoric, pagini de canal și „Urmează”.
• Linkuri Shorts — intrarea din bara laterală, filtrul și fila canalului.
• Mixuri — playlisturile „Mixuri pentru tine” generate automat de YouTube.
• Redare automată — o oprește și elimină comutatorul.
• „Explorează mai multe subiecte” și „Continuă vizionarea” — opțional.
• Modul calm — estompează accentele roșii și insigna de notificări YouTube, încețoșează miniaturile clickbait (treci cu mouse-ul ca să le vezi) și oprește previzualizarea automată la hover.
• Cuvinte cheie — ascunde videoclipuri după cuvinte din titlu, canal sau descriere, cu opțiune de potrivire pe cuvinte întregi și ștergere automată după 7 zile.
• Canale blocate — ascunde toate videoclipurile unui canal ales de tine, peste tot, inclusiv în Căutare (spre deosebire de „Nu recomanda canalul” al YouTube).

STATISTICI DE VIZIONARE
Vezi unde se duce timpul tău pe YouTube: minute pe categorie (Educație, Divertisment, Muzică…), timp de vizionare pe zi, săptămână și lună comparat cu perioadele anterioare și cât din ultimul videoclip ai vizionat de fapt. Totul rămâne pe dispozitivul tău.

DE CE
Shorts, redarea automată și insignele roșii sunt mecanisme făcute să te țină pe platformă. Focus Tube le oprește ca YouTube să redevină un instrument pe care îl folosești intenționat — ideal pentru studiu, muncă și echilibru digital.

CONFIDENȚIALITATE
Fără cont, fără analiză, fără servere. Nicio dată nu este trimisă către terți. Statisticile rămân în stocarea locală a browserului; setările se sincronizează doar prin sincronizarea extensiilor din Chrome. Politica de confidențialitate: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATUIT ȘI OPEN SOURCE
Toate funcțiile sunt gratuite — fără abonamente, fără limită zilnică, fără cheie de licență.
https://github.com/bommireddy30/focus-tube
```

---

## Portuguese (Brazil) — `pt_BR` (Brazil)

Brazil is one of YouTube's biggest markets and Shorts usage there is
huge. Brazilians search *ocultar*, *bloquear*, *remover* and *tirar os
Shorts*; the name carries the first two. "Mix" is what YouTube's pt-BR
UI calls Mixes. `pt_BR` is its own CWS listing, separate from `pt_PT`,
and Chrome won't serve a `pt_PT` file to a `pt-BR` browser, so both exist.

**Name** (46 chars): `Focus Tube – Ocultar e Bloquear YouTube Shorts`

**Summary** (127 chars):
```
Bloqueador de Shorts: remova YouTube Shorts, Mixes e reprodução automática. Bloqueie canais e palavras, veja seu tempo. Grátis.
```

**Description:**
```
Oculte os YouTube Shorts em todo lugar e use o YouTube sem distrações. O Focus Tube é um bloqueador de Shorts gratuito que também remove Mixes, a reprodução automática e outras iscas de atenção — você assiste ao que veio ver e pronto.

Não oficial e independente — sem vínculo, apoio ou patrocínio do YouTube ou do Google.

O QUE ELE BLOQUEIA
• O player de Shorts — um link /shorts/ abre como vídeo normal ou leva direto ao Início, você escolhe.
• Prateleiras de Shorts — o carrossel no Início e em Inscrições.
• Shorts na busca — a prateleira e o filtro nos resultados de busca.
• Shorts avulsos — cards de Shorts em feeds, Histórico, páginas de canal e próximos vídeos.
• Links de Shorts — o item da barra lateral, o filtro e a aba do canal.
• Mixes — as playlists "Mixes para você" geradas automaticamente pelo YouTube.
• Reprodução automática — desativada, e o botão some.
• Prateleiras "Explorar mais assuntos" e "Continuar assistindo" — opcionais.
• Modo Calmo — suaviza os destaques vermelhos e o selo de notificações do YouTube, desfoca miniaturas caça-clique (passe o mouse para ver) e impede a prévia automática ao passar o mouse.
• Palavras-chave — oculte vídeos por palavras no título, canal ou descrição, com opção de palavra inteira e exclusão automática após 7 dias.
• Canais bloqueados — oculte todos os vídeos de um canal, em todo lugar, inclusive na Busca (diferente do "Não recomendar canal" do YouTube).

ESTATÍSTICAS
Veja para onde vai seu tempo no YouTube: minutos por categoria (Educação, Entretenimento, Música…), tempo por dia, semana e mês comparado aos períodos anteriores, e quanto do último vídeo você realmente assistiu. Tudo fica só no seu dispositivo.

POR QUÊ
Shorts, reprodução automática e selos vermelhos são mecanismos para prender você. O Focus Tube desliga tudo isso para o YouTube voltar a ser uma ferramenta que você usa de propósito — ótimo para estudar, trabalhar e cuidar do bem-estar digital.

PRIVACIDADE
Sem conta, sem analytics, sem servidores. Nada é enviado a terceiros. As estatísticas ficam no armazenamento local do navegador; as configurações sincronizam apenas pela sincronização de extensões do próprio Chrome. Política de privacidade: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRÁTIS E DE CÓDIGO ABERTO
Todos os recursos são gratuitos — sem planos, sem limite diário, sem chave de licença.
https://github.com/bommireddy30/focus-tube
```

---

## Portuguese (Portugal) — `pt_PT` (Portugal, Angola, Mozambique)

European Portuguese differs enough to matter in a listing: *ecrã*,
*definições*, *desporto*, *Misturas* (YouTube's pt-PT name for Mixes),
*em direto*. Same name as pt-BR, since *ocultar* and *bloquear* are
shared.

**Name** (46 chars): `Focus Tube – Ocultar e Bloquear YouTube Shorts`

**Summary** (124 chars):
```
Bloqueador de Shorts: remova YouTube Shorts, Misturas e reprodução automática. Bloqueie canais e palavras, veja o seu tempo.
```

**Description:**
```
Oculte os YouTube Shorts em todo o lado e use o YouTube sem distrações. O Focus Tube é um bloqueador de Shorts gratuito que também remove Misturas, a reprodução automática e outros iscos de atenção — vê o que procurava e sai.

Não oficial e independente — sem ligação, apoio ou patrocínio do YouTube ou da Google.

O QUE BLOQUEIA
• O leitor de Shorts — um link /shorts/ abre como vídeo normal ou leva diretamente ao Início, à sua escolha.
• Prateleiras de Shorts — o carrossel no Início e nas Subscrições.
• Shorts na pesquisa — a prateleira e o filtro nos resultados de pesquisa.
• Shorts soltos — cartões de Shorts em feeds, Histórico, páginas de canal e a seguir.
• Links de Shorts — a entrada da barra lateral, o filtro e o separador do canal.
• Misturas — as playlists "Misturas para si" geradas automaticamente pelo YouTube.
• Reprodução automática — desativada, e o interruptor desaparece.
• Prateleiras "Explorar mais temas" e "Continuar a ver" — opcionais.
• Modo Calmo — atenua os destaques vermelhos e o selo de notificações do YouTube, desfoca miniaturas sensacionalistas (passe o rato para ver) e impede a pré-visualização automática ao passar o rato.
• Palavras-chave — oculte vídeos por palavras no título, canal ou descrição, com opção de palavra inteira e eliminação automática após 7 dias.
• Canais bloqueados — oculte todos os vídeos de um canal, em todo o lado, incluindo a Pesquisa (ao contrário do "Não recomendar canal" do YouTube).

ESTATÍSTICAS
Veja para onde vai o seu tempo no YouTube: minutos por categoria (Educação, Entretenimento, Música…), tempo por dia, semana e mês comparado com os períodos anteriores, e quanto do último vídeo viu realmente. Tudo fica apenas no seu dispositivo.

PORQUÊ
Shorts, reprodução automática e selos vermelhos são mecanismos para o manter a ver. O Focus Tube desliga-os para que o YouTube volte a ser uma ferramenta que usa de propósito — ideal para estudar, trabalhar e para o bem-estar digital.

PRIVACIDADE
Sem conta, sem analytics, sem servidores. Nada é enviado a terceiros. As estatísticas ficam no armazenamento local do navegador; as definições sincronizam apenas através da sincronização de extensões do próprio Chrome. Política de privacidade: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATUITO E DE CÓDIGO ABERTO
Todas as funcionalidades são gratuitas — sem planos, sem limite diário, sem chave de licença.
https://github.com/bommireddy30/focus-tube
```

---

## Spanish — `es` (Spain, Mexico, all of Latin America)

One neutral-Spanish locale covers both sides of the Atlantic: Chrome
falls back from `es-419` (and `es-MX`, `es-AR`…) to `es`, so a separate
`es_419` isn't needed unless the copy ever has to diverge. It uses *tú*
and *video* (no accent), which reads naturally in Latin America (the
bigger audience) and is fine in Spain. Searches: *ocultar*, *bloquear*,
*quitar*, *eliminar Shorts de YouTube*.

**Name** (46 chars): `Focus Tube – Ocultar y Bloquear YouTube Shorts`

**Summary** (128 chars):
```
Bloqueador de Shorts: quita YouTube Shorts, Mixes y reproducción automática. Bloquea canales y palabras, mira tu tiempo. Gratis.
```

**Description:**
```
Oculta los YouTube Shorts en todas partes y disfruta de YouTube sin distracciones. Focus Tube es un bloqueador de Shorts gratuito que también quita los Mixes, la reproducción automática y otros ganchos de atención: ves lo que buscabas y listo.

No oficial e independiente: sin relación, respaldo ni patrocinio de YouTube ni de Google.

QUÉ BLOQUEA
• El reproductor de Shorts: un enlace /shorts/ se abre como video normal o te lleva directo al inicio, tú eliges.
• Estantes de Shorts: el carrusel de Inicio y Suscripciones.
• Shorts en la búsqueda: el estante y el filtro en los resultados.
• Shorts sueltos: tarjetas de Shorts en feeds, Historial, páginas de canal y a continuación.
• Enlaces a Shorts: la entrada lateral, el filtro y la pestaña del canal.
• Mixes: las listas "Mixes para ti" que YouTube genera automáticamente.
• Reproducción automática: se desactiva y el interruptor desaparece.
• Estantes "Explorar más temas" y "Seguir viendo": opcionales.
• Modo Calma: atenúa los acentos rojos y el contador de notificaciones de YouTube, desenfoca las miniaturas clickbait (pasa el cursor para verlas) y detiene la vista previa automática al pasar el cursor.
• Palabras clave: oculta videos por palabras en el título, el canal o la descripción, con opción de palabra completa y borrado automático a los 7 días.
• Canales bloqueados: oculta todos los videos de un canal, en todas partes, incluida la Búsqueda (a diferencia del "No recomendar el canal" de YouTube).

ESTADÍSTICAS
Mira a dónde se va tu tiempo en YouTube: minutos por categoría (Educación, Entretenimiento, Música…), tiempo por día, semana y mes comparado con los periodos anteriores, y cuánto viste realmente de tu último video. Todo se guarda solo en tu dispositivo.

POR QUÉ
Los Shorts, la reproducción automática y los avisos rojos son mecanismos para retenerte. Focus Tube los apaga para que YouTube vuelva a ser una herramienta que usas a propósito: ideal para estudiar, trabajar y cuidar tu bienestar digital.

PRIVACIDAD
Sin cuenta, sin analíticas, sin servidores. Nunca se envía nada a terceros. Las estadísticas se quedan en el almacenamiento local del navegador; los ajustes solo se sincronizan mediante la sincronización de extensiones del propio Chrome. Política de privacidad: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATIS Y DE CÓDIGO ABIERTO
Todas las funciones son gratis: sin planes, sin límite diario, sin clave de licencia.
https://github.com/bommireddy30/focus-tube
```

---

## French — `fr` (France, Belgium, Switzerland, Canada, Francophone Africa)

French users search *masquer*, *bloquer*, *supprimer les Shorts YouTube*.
The name uses *masquer* (YouTube's own French UI verb for hiding) ahead
of *bloquer*, and uses *vous* throughout.
"Mix" is invariable in YouTube’s French UI.

**Name** (50 chars): `Focus Tube – Masquer et Bloquer les YouTube Shorts`

**Summary** (126 chars):
```
Bloqueur de Shorts : supprime les YouTube Shorts, Mix et lecture auto. Bloque chaînes et mots-clés, suit votre temps. Gratuit.
```

**Description:**
```
Masquez les YouTube Shorts partout et profitez d’un YouTube sans distractions. Focus Tube est un bloqueur de Shorts gratuit qui supprime aussi les Mix, la lecture automatique et les autres pièges à attention : vous regardez ce que vous étiez venu chercher, puis vous partez.

Non officiel et indépendant — sans lien, soutien ni parrainage de YouTube ou de Google.

CE QUI EST BLOQUÉ
• Le lecteur Shorts — un lien /shorts/ s’ouvre comme une vidéo normale ou renvoie directement à l’accueil, au choix.
• Étagères de Shorts — le carrousel de l’Accueil et des Abonnements.
• Shorts dans la recherche — l’étagère et le filtre dans les résultats.
• Shorts isolés — les cartes Shorts dans les flux, l’historique, les pages de chaîne et « À suivre ».
• Liens vers les Shorts — l’entrée du menu latéral, le filtre et l’onglet de chaîne.
• Mix — les playlists « Mix pour vous » générées automatiquement par YouTube.
• Lecture automatique — désactivée, et le bouton disparaît.
• Étagères « Explorer d’autres sujets » et « Reprendre la lecture » — en option.
• Mode Calme — atténue les accents rouges et le badge de notifications de YouTube, floute les miniatures racoleuses (survolez pour voir) et coupe l’aperçu automatique au survol.
• Mots-clés — masquez les vidéos selon les mots du titre, de la chaîne ou de la description, avec option mot entier et suppression automatique après 7 jours.
• Chaînes bloquées — masquez toutes les vidéos d’une chaîne, partout, y compris dans la Recherche (contrairement à « Ne pas recommander cette chaîne » de YouTube).

STATISTIQUES
Voyez où passe votre temps sur YouTube : minutes par catégorie (Éducation, Divertissement, Musique…), temps par jour, semaine et mois comparé aux périodes précédentes, et quelle part de votre dernière vidéo vous avez vraiment regardée. Tout reste sur votre appareil.

POURQUOI
Les Shorts, la lecture automatique et les badges rouges sont des mécanismes conçus pour vous retenir. Focus Tube les désactive pour que YouTube redevienne un outil que vous utilisez volontairement — idéal pour étudier, travailler et préserver votre bien-être numérique.

CONFIDENTIALITÉ
Aucun compte, aucune statistique d’usage, aucun serveur. Rien n’est jamais envoyé à un tiers. Les statistiques restent dans le stockage local du navigateur ; les paramètres se synchronisent uniquement via la synchronisation des extensions de Chrome. Politique de confidentialité : https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATUIT ET OPEN SOURCE
Toutes les fonctionnalités sont gratuites — pas d’abonnement, pas de limite quotidienne, pas de clé de licence.
https://github.com/bommireddy30/focus-tube
```

---

## Russian — `ru` (Russia, Kazakhstan, Belarus, Russian-speaking users elsewhere)

Russian searches: *скрыть / убрать / заблокировать Shorts на YouTube*,
*блокировщик Shorts*. "Shorts" stays in Latin script — that's what
YouTube's Russian UI shows. YouTube calls Mixes *миксы*.

**Name** (50 chars): `Focus Tube – Скрыть и заблокировать YouTube Shorts`

**Summary** (126 chars):
```
Блокировщик Shorts: убирает YouTube Shorts, миксы и автовоспроизведение. Блок каналов и слов, статистика просмотра. Бесплатно.
```

**Description:**
```
Скройте YouTube Shorts везде и пользуйтесь YouTube без отвлечений. Focus Tube — бесплатный блокировщик Shorts, который также убирает миксы, автовоспроизведение и другие приманки для внимания: вы смотрите то, за чем пришли, и уходите.

Неофициальное и независимое расширение — не связано с YouTube или Google, не одобрено и не спонсируется ими.

ЧТО БЛОКИРУЕТСЯ
• Плеер Shorts — ссылка /shorts/ открывается как обычное видео или сразу ведёт на главную, на ваш выбор.
• Полки Shorts — карусель на Главной и в Подписках.
• Shorts в поиске — полка и фильтр в результатах поиска.
• Отдельные Shorts — карточки Shorts в лентах, Истории, на страницах каналов и в «Далее».
• Ссылки на Shorts — пункт бокового меню, фильтр и вкладка канала.
• Миксы — автоматические плейлисты YouTube «Миксы для вас».
• Автовоспроизведение — выключается, а переключатель исчезает.
• Полки «Другие темы» и «Продолжить просмотр» — по желанию.
• Спокойный режим — приглушает красные акценты и значок уведомлений YouTube, размывает кликбейтные обложки (наведите, чтобы увидеть) и отключает автопревью при наведении.
• Ключевые слова — скрывайте видео по словам в названии, канале или описании, с режимом целых слов и автоудалением через 7 дней.
• Заблокированные каналы — скрывайте все видео выбранного канала везде, включая Поиск (в отличие от «Не рекомендовать канал» в YouTube).

СТАТИСТИКА
Узнайте, куда уходит ваше время на YouTube: минуты по категориям (Образование, Развлечения, Музыка…), время по дням, неделям и месяцам в сравнении с прошлыми периодами и какую часть последнего видео вы действительно посмотрели. Всё хранится только на вашем устройстве.

ЗАЧЕМ
Shorts, автовоспроизведение и красные значки — механизмы удержания внимания. Focus Tube отключает их, чтобы YouTube снова стал инструментом, которым вы пользуетесь осознанно, — для учёбы, работы и цифрового благополучия.

КОНФИДЕНЦИАЛЬНОСТЬ
Без аккаунта, без аналитики, без серверов. Никакие данные не передаются третьим лицам. Статистика хранится в локальном хранилище браузера; настройки синхронизируются только через встроенную синхронизацию расширений Chrome. Политика конфиденциальности: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

БЕСПЛАТНО И С ОТКРЫТЫМ КОДОМ
Все функции бесплатны — без тарифов, без дневных лимитов, без лицензионных ключей.
https://github.com/bommireddy30/focus-tube
```

---

## Italian — `it` (Italy, Switzerland)

Italian searches: *nascondere / bloccare / rimuovere gli Shorts di
YouTube*. The name uses the imperative (*Nascondi e Blocca*), as Italian
store titles usually do.

**Name** (49 chars): `Focus Tube – Nascondi e Blocca gli YouTube Shorts`

**Summary** (120 chars):
```
Blocco Shorts: rimuovi YouTube Shorts, Mix e riproduzione automatica. Blocca canali e parole, vedi il tuo tempo. Gratis.
```

**Description:**
```
Nascondi gli YouTube Shorts ovunque e usa YouTube senza distrazioni. Focus Tube è un blocco Shorts gratuito che rimuove anche i Mix, la riproduzione automatica e le altre esche per l’attenzione: guardi quello che cercavi e chiudi.

Non ufficiale e indipendente — non affiliato, approvato o sponsorizzato da YouTube o Google.

COSA BLOCCA
• Il player degli Shorts — un link /shorts/ si apre come video normale o porta direttamente alla Home, a tua scelta.
• Scaffali di Shorts — il carosello in Home e Iscrizioni.
• Shorts nella ricerca — lo scaffale e il filtro nei risultati.
• Shorts sparsi — le schede Shorts nei feed, nella Cronologia, nelle pagine dei canali e nei video successivi.
• Link agli Shorts — la voce laterale, il filtro e la scheda del canale.
• Mix — le playlist "Mix per te" generate automaticamente da YouTube.
• Riproduzione automatica — disattivata, e l’interruttore sparisce.
• Scaffali "Esplora altri argomenti" e "Continua a guardare" — facoltativi.
• Modalità Calma — attenua gli accenti rossi e il badge delle notifiche di YouTube, sfoca le miniature acchiappaclic (passa il mouse per vederle) e blocca l’anteprima automatica al passaggio del mouse.
• Parole chiave — nascondi i video in base alle parole nel titolo, nel canale o nella descrizione, con opzione parola intera ed eliminazione automatica dopo 7 giorni.
• Canali bloccati — nascondi ogni video di un canale, ovunque, anche nella Ricerca (a differenza del "Non consigliare il canale" di YouTube).

STATISTICHE
Scopri dove va il tuo tempo su YouTube: minuti per categoria (Istruzione, Intrattenimento, Musica…), tempo per giorno, settimana e mese a confronto con i periodi precedenti, e quanto dell’ultimo video hai guardato davvero. Tutto resta sul tuo dispositivo.

PERCHÉ
Shorts, riproduzione automatica e badge rossi sono meccanismi pensati per trattenerti. Focus Tube li spegne perché YouTube torni a essere uno strumento che usi di proposito — ideale per studiare, lavorare e per il benessere digitale.

PRIVACY
Nessun account, nessuna analisi, nessun server. Nulla viene mai inviato a terzi. Le statistiche restano nella memoria locale del browser; le impostazioni si sincronizzano solo tramite la sincronizzazione delle estensioni di Chrome. Informativa sulla privacy: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATUITO E OPEN SOURCE
Tutte le funzioni sono gratuite — niente piani, niente limiti giornalieri, niente chiavi di licenza.
https://github.com/bommireddy30/focus-tube
```

---

## Korean — `ko` (South Korea)

Korean users search both 쇼츠 (the Hangul transliteration) and "Shorts".
The summary uses 쇼츠 차단기 and the name keeps the Latin "YouTube Shorts"
so both forms are covered. 숨기기 (hide) and 차단 (block) are the two verbs.

**Name** (36 chars): `Focus Tube – YouTube Shorts 숨기기 및 차단`

**Summary** (73 chars):
```
쇼츠 차단기: YouTube Shorts, 믹스, 자동재생을 없애고 채널과 키워드를 차단하며 시청 시간을 보여줍니다. 무료·비공개.
```

**Description:**
```
YouTube Shorts를 어디서나 숨기고 방해 없는 YouTube를 즐기세요. Focus Tube는 믹스, 자동재생 등 시선을 붙잡는 요소까지 없애 주는 무료 쇼츠 차단기입니다. 보려던 것만 보고 나가세요.

비공식·독립 프로젝트이며 YouTube 또는 Google과 제휴, 보증, 후원 관계가 없습니다.

차단하는 항목
• Shorts 플레이어 — /shorts/ 링크를 일반 동영상으로 열거나 바로 홈으로 이동(선택 가능).
• Shorts 선반 — 홈과 구독 탭의 캐러셀.
• 검색 속 Shorts — 검색 결과의 선반과 필터 칩.
• 개별 Shorts — 피드, 기록, 채널 페이지, 다음 동영상의 Shorts 카드.
• Shorts 링크 — 사이드바 항목, 필터 칩, 채널 탭.
• 믹스 — YouTube가 자동 생성하는 '나를 위한 믹스' 재생목록.
• 자동재생 — 끄고 토글을 제거.
• '다른 주제 탐색', '이어서 시청' 선반 — 선택 사항.
• 차분 모드 — YouTube의 빨간 강조색과 알림 배지를 차분하게 바꾸고, 낚시성 썸네일을 흐리게 하며(마우스를 올리면 보임), 마우스 오버 미리보기 자동재생을 막습니다.
• 키워드 — 제목, 채널, 설명의 단어로 동영상을 숨김. 단어 전체 일치와 7일 후 자동 삭제 옵션 제공.
• 차단한 채널 — 선택한 채널의 모든 동영상을 검색을 포함해 어디서나 숨김(YouTube의 '채널 추천 안함'과 다름).

시청 통계
YouTube 시간이 어디에 쓰이는지 확인하세요. 카테고리별 시청 시간(교육, 엔터테인먼트, 음악…), 이전 기간과 비교한 일·주·월별 시청 시간, 마지막 동영상을 실제로 얼마나 봤는지까지. 모든 데이터는 기기에만 저장됩니다.

왜 필요한가
Shorts, 자동재생, 빨간 배지는 계속 보게 만드는 장치입니다. Focus Tube는 이를 꺼서 YouTube를 의도적으로 사용하는 도구로 되돌려 줍니다 — 공부, 업무, 디지털 웰빙에 제격입니다.

개인정보 보호
계정, 분석 도구, 서버가 없습니다. 어떤 데이터도 제3자에게 전송되지 않습니다. 시청 통계는 브라우저 로컬 저장소에만 있고, 설정은 Chrome 자체 확장 프로그램 동기화로만 동기화됩니다. 개인정보처리방침: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

무료 오픈소스
모든 기능이 무료입니다 — 유료 등급, 일일 제한, 라이선스 키 없음.
https://github.com/bommireddy30/focus-tube
```

---

## Chinese (Simplified) — `zh_CN` (Chinese-UI users in mainland China, Singapore, Malaysia, and worldwide)

YouTube is blocked in mainland China, so this audience is mostly people
using it via VPN plus the diaspora; still worthwhile because the
Simplified-Chinese Chrome UI is large. Searches: 屏蔽 / 隐藏 / 关闭 YouTube
Shorts, 短视频. The name adds 短视频 so the Chinese word for "short
video" is indexed. YouTube's zh-CN UI calls Mixes 合辑.

**Name** (37 chars): `Focus Tube – 隐藏和屏蔽 YouTube Shorts 短视频`

**Summary** (61 chars):
```
Shorts 屏蔽器：移除 YouTube Shorts、合辑和自动播放。屏蔽频道和关键词，查看观看时长。私密，完全免费。
```

**Description:**
```
在任何地方隐藏 YouTube Shorts，享受无干扰的 YouTube。Focus Tube 是一款免费的 Shorts 屏蔽器，同时移除合辑、自动播放和其他吸引注意力的设计——看完想看的内容就离开。

非官方独立项目——与 YouTube 或 Google 无任何关联，也未获其认可或赞助。

屏蔽内容
• Shorts 播放器——打开 /shorts/ 链接时，可选择以普通视频打开或直接返回首页。
• Shorts 内容架——首页和订阅内容中的轮播。
• 搜索中的 Shorts——搜索结果中的内容架和筛选标签。
• 零散的 Shorts——信息流、历史记录、频道页面和接下来播放中的 Shorts 卡片。
• Shorts 链接——侧边栏入口、筛选标签和频道标签页。
• 合辑——YouTube 自动生成的“为你推荐的合辑”播放列表。
• 自动播放——关闭并移除开关。
• “探索更多主题”和“继续观看”内容架——可选。
• 平静模式——淡化 YouTube 的红色强调色和通知角标，模糊标题党缩略图（悬停可查看），并停止悬停时的自动预览。
• 关键词——按标题、频道或说明中的词语隐藏视频，可选完整单词匹配和 7 天后自动删除。
• 屏蔽频道——在所有位置（包括搜索）隐藏所选频道的全部视频（不同于 YouTube 的“不推荐此频道”）。

观看统计
看看你的 YouTube 时间花在了哪里：各类别的观看分钟数（教育、娱乐、音乐…）、按日/周/月统计并与之前对比的观看时长，以及你上一个视频实际看了多少。所有数据只保存在你的设备上。

为什么
Shorts、自动播放和红色角标都是为了留住你而设计的机制。Focus Tube 把它们关掉，让 YouTube 重新成为你有意使用的工具——适合学习、工作和数字健康。

隐私
无需账号，无数据分析，无服务器。绝不向第三方发送任何数据。观看统计只存储在浏览器本地；设置仅通过 Chrome 自带的扩展同步功能同步。隐私政策：https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

免费开源
所有功能免费——没有付费等级，没有每日限制，没有许可证密钥。
https://github.com/bommireddy30/focus-tube
```

---

## Chinese (Traditional) — `zh_TW` (Taiwan, Hong Kong)

Taiwan is a strong YouTube market with high Shorts usage. Taiwanese
wording differs from mainland Chinese: 封鎖 (not 屏蔽), 影片 (not 视频),
短片 (not 短视频), 頻道, 設定. YouTube's zh-TW UI calls Mixes 合輯.

**Name** (36 chars): `Focus Tube – 隱藏和封鎖 YouTube Shorts 短片`

**Summary** (63 chars):
```
Shorts 封鎖器：移除 YouTube Shorts、合輯和自動播放。封鎖頻道和關鍵字，查看觀看時間。注重隱私，完全免費。
```

**Description:**
```
在任何地方隱藏 YouTube Shorts，享受不受干擾的 YouTube。Focus Tube 是一款免費的 Shorts 封鎖器，同時移除合輯、自動播放和其他吸引注意力的設計——看完想看的內容就離開。

非官方獨立專案——與 YouTube 或 Google 無任何關聯，也未獲其認可或贊助。

封鎖項目
• Shorts 播放器——開啟 /shorts/ 連結時，可選擇以一般影片開啟或直接回到首頁。
• Shorts 內容架——首頁和訂閱內容中的輪播。
• 搜尋中的 Shorts——搜尋結果中的內容架和篩選標籤。
• 零散的 Shorts——動態、觀看記錄、頻道頁面和接下來播放中的 Shorts 卡片。
• Shorts 連結——側邊欄項目、篩選標籤和頻道分頁。
• 合輯——YouTube 自動產生的「為你推薦的合輯」播放清單。
• 自動播放——關閉並移除開關。
• 「探索更多主題」和「繼續觀看」內容架——可選。
• 平靜模式——淡化 YouTube 的紅色強調色和通知標記，模糊標題黨縮圖（滑鼠移上即可查看），並停止滑鼠懸停時的自動預覽。
• 關鍵字——依標題、頻道或說明中的字詞隱藏影片，可選完整單字比對和 7 天後自動刪除。
• 已封鎖的頻道——在所有位置（包括搜尋）隱藏所選頻道的全部影片（不同於 YouTube 的「不要推薦這個頻道」）。

觀看統計
看看你的 YouTube 時間花在哪裡：各類別的觀看分鐘數（教育、娛樂、音樂…）、依日/週/月統計並與之前比較的觀看時間，以及你上一部影片實際看了多少。所有資料只儲存在你的裝置上。

為什麼
Shorts、自動播放和紅色標記都是為了留住你而設計的機制。Focus Tube 把它們關掉，讓 YouTube 重新成為你有意使用的工具——適合學習、工作和數位健康。

隱私
不需帳號，沒有數據分析，沒有伺服器。絕不向第三方傳送任何資料。觀看統計只儲存在瀏覽器本機；設定僅透過 Chrome 內建的擴充功能同步功能同步。隱私權政策：https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

免費開源
所有功能免費——沒有付費等級，沒有每日限制，沒有授權金鑰。
https://github.com/bommireddy30/focus-tube
```

---

## Turkish — `tr` (Turkey)

Turkey has one of the highest YouTube usage rates in Europe. Searches:
*YouTube Shorts gizle / engelle / kaldır / kapat*. The name carries
*gizle* and *engelle*; *kaldır* is in the summary.

**Name** (44 chars): `Focus Tube – YouTube Shorts Gizle ve Engelle`

**Summary** (131 chars):
```
Shorts engelleyici: YouTube Shorts, Mix ve otomatik oynatmayı kaldırır. Kanal ve kelime engeller, izleme süreni gösterir. Ücretsiz.
```

**Description:**
```
YouTube Shorts'u her yerde gizle, YouTube'u dikkat dağıtıcılar olmadan kullan. Focus Tube; Mix'leri, otomatik oynatmayı ve diğer dikkat tuzaklarını da kaldıran ücretsiz bir Shorts engelleyicidir — ne için geldiysen onu izle ve çık.

Resmi değildir ve bağımsızdır — YouTube veya Google ile bağlantılı değildir, onlar tarafından onaylanmamış veya desteklenmemiştir.

NELERİ ENGELLER
• Shorts oynatıcısı — /shorts/ bağlantısı normal video olarak açılır ya da doğrudan ana sayfaya gider, seçim senin.
• Shorts rafları — Ana Sayfa ve Abonelikler'deki karusel.
• Aramada Shorts — arama sonuçlarındaki raf ve filtre çipi.
• Tekil Shorts — akışlarda, Geçmiş'te, kanal sayfalarında ve sıradakilerde görünen Shorts kartları.
• Shorts bağlantıları — kenar çubuğu girişi, filtre çipi ve kanal sekmesi.
• Mix'ler — YouTube'un otomatik oluşturduğu "Sana özel Mix'ler" oynatma listeleri.
• Otomatik oynatma — kapatılır ve düğmesi kaldırılır.
• "Daha fazla konu keşfet" ve "İzlemeye devam et" rafları — isteğe bağlı.
• Sakin Mod — YouTube'un kırmızı vurgularını ve bildirim rozetini yumuşatır, tık tuzağı küçük resimleri bulanıklaştırır (görmek için üzerine gel) ve üzerine gelince başlayan önizlemeyi durdurur.
• Anahtar kelimeler — başlık, kanal veya açıklamadaki kelimelere göre videoları gizle; tam kelime eşleşmesi ve 7 gün sonra otomatik silme seçenekleriyle.
• Engellenen Kanallar — seçtiğin bir kanalın tüm videolarını Arama dahil her yerde gizle (YouTube'un "Kanalı önerme" seçeneğinin aksine).

İZLEME İSTATİSTİKLERİ
YouTube'da zamanının nereye gittiğini gör: kategori başına dakika (Eğitim, Eğlence, Müzik…), önceki dönemlerle karşılaştırmalı günlük, haftalık ve aylık izleme süresi ve son videonun gerçekten ne kadarını izlediğin. Hepsi yalnızca cihazında saklanır.

NEDEN
Shorts, otomatik oynatma ve kırmızı rozetler seni ekranda tutmak için tasarlanmış mekanizmalardır. Focus Tube bunları kapatır; YouTube yeniden bilinçli olarak kullandığın bir araca dönüşür — ders çalışmak, çalışmak ve dijital iyi oluş için ideal.

GİZLİLİK
Hesap yok, analiz yok, sunucu yok. Hiçbir veri üçüncü taraflara gönderilmez. İzleme istatistikleri tarayıcının yerel depolamasında kalır; ayarlar yalnızca Chrome'un kendi uzantı senkronizasyonuyla eşitlenir. Gizlilik politikası: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

ÜCRETSİZ VE AÇIK KAYNAK
Tüm özellikler ücretsiz — paket yok, günlük sınır yok, lisans anahtarı yok.
https://github.com/bommireddy30/focus-tube
```

---

## Polish — `pl` (Poland)

Polish searches: *ukryj / zablokuj / usuń Shorts YouTube*, *wyłącz
Shorts*. YouTube's Polish UI calls Mixes *składanki*, so the listing
does too.

**Name** (44 chars): `Focus Tube – Ukryj i Zablokuj YouTube Shorts`

**Summary** (124 chars):
```
Bloker Shorts: usuwa YouTube Shorts, składanki i autoodtwarzanie. Blokuje kanały i słowa, pokazuje czas oglądania. Za darmo.
```

**Description:**
```
Ukryj YouTube Shorts wszędzie i korzystaj z YouTube bez rozpraszaczy. Focus Tube to darmowy bloker Shorts, który usuwa też składanki, autoodtwarzanie i inne pułapki na uwagę — oglądasz to, po co przyszedłeś, i wychodzisz.

Nieoficjalne i niezależne — niepowiązane z YouTube ani Google, nieaprobowane ani niesponsorowane przez nie.

CO BLOKUJE
• Odtwarzacz Shorts — link /shorts/ otwiera się jako zwykły film albo prowadzi prosto na stronę główną, do wyboru.
• Półki Shorts — karuzela na stronie głównej i w Subskrypcjach.
• Shorts w wyszukiwaniu — półka i filtr w wynikach wyszukiwania.
• Pojedyncze Shorts — karty Shorts w kanałach informacyjnych, Historii, na stronach kanałów i w „Następne”.
• Linki do Shorts — pozycja w menu bocznym, filtr i karta kanału.
• Składanki — automatyczne playlisty YouTube „Składanki dla Ciebie”.
• Autoodtwarzanie — wyłączone, a przełącznik znika.
• Półki „Odkryj więcej tematów” i „Oglądaj dalej” — opcjonalnie.
• Tryb spokoju — wycisza czerwone akcenty i plakietkę powiadomień YouTube, rozmywa clickbaitowe miniatury (najedź, by zobaczyć) i zatrzymuje autopodgląd po najechaniu.
• Słowa kluczowe — ukrywaj filmy według słów w tytule, nazwie kanału lub opisie, z opcją całych słów i automatycznym usuwaniem po 7 dniach.
• Zablokowane kanały — ukrywaj wszystkie filmy z wybranego kanału, wszędzie, także w Wyszukiwaniu (w przeciwieństwie do „Nie polecaj kanału” w YouTube).

STATYSTYKI
Zobacz, na co idzie Twój czas w YouTube: minuty według kategorii (Edukacja, Rozrywka, Muzyka…), czas według dnia, tygodnia i miesiąca w porównaniu z poprzednimi okresami oraz ile ostatniego filmu naprawdę obejrzałeś. Wszystko zostaje na Twoim urządzeniu.

DLACZEGO
Shorts, autoodtwarzanie i czerwone plakietki to mechanizmy, które mają Cię zatrzymać. Focus Tube je wyłącza, żeby YouTube znów był narzędziem, którego używasz świadomie — idealne do nauki, pracy i dbania o cyfrowy dobrostan.

PRYWATNOŚĆ
Bez konta, bez analityki, bez serwerów. Żadne dane nie trafiają do osób trzecich. Statystyki zostają w lokalnej pamięci przeglądarki; ustawienia synchronizują się wyłącznie przez wbudowaną synchronizację rozszerzeń Chrome. Polityka prywatności: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

ZA DARMO I OPEN SOURCE
Wszystkie funkcje są darmowe — bez planów, bez dziennych limitów, bez kluczy licencyjnych.
https://github.com/bommireddy30/focus-tube
```

---

## Dutch — `nl` (Netherlands, Belgium)

Dutch searches: *YouTube Shorts verbergen / blokkeren / uitzetten /
verwijderen*. Many Dutch users run an English Chrome UI, so `en` covers
part of this market too.

**Name** (50 chars): `Focus Tube – YouTube Shorts verbergen en blokkeren`

**Summary** (128 chars):
```
Shorts-blocker: verwijdert YouTube Shorts, mixen en autoplay. Blokkeer kanalen en zoekwoorden, zie je kijktijd. Privé en gratis.
```

**Description:**
```
Verberg YouTube Shorts overal en gebruik YouTube zonder afleiding. Focus Tube is een gratis Shorts-blocker die ook mixen, autoplay en andere aandachtstrekkers weghaalt — je kijkt waarvoor je kwam en gaat weer.

Onofficieel en onafhankelijk — niet verbonden aan, goedgekeurd of gesponsord door YouTube of Google.

WAT HET BLOKKEERT
• De Shorts-speler — een /shorts/-link opent als gewone video of gaat meteen naar Home, jij kiest.
• Shorts-planken — de carrousel op Home en Abonnementen.
• Shorts in zoekresultaten — de plank en filterchip bij zoekresultaten.
• Losse Shorts — Shorts-kaarten in feeds, Geschiedenis, kanaalpagina's en ‘Volgende’.
• Shorts-links — het zijbalkitem, de filterchip en het kanaaltabblad.
• Mixen — YouTube's automatisch gemaakte afspeellijsten ‘Mixen voor jou’.
• Autoplay — staat uit en de schakelaar verdwijnt.
• Planken ‘Meer onderwerpen ontdekken’ en ‘Verder kijken’ — optioneel.
• Rustmodus — dempt YouTube's rode accenten en meldingsbadge, vervaagt clickbait-thumbnails (beweeg erover om ze te zien) en stopt de automatische preview bij hoveren.
• Zoekwoorden — verberg video's op woorden in titel, kanaal of beschrijving, met optie voor hele woorden en automatisch verwijderen na 7 dagen.
• Geblokkeerde kanalen — verberg elke video van een gekozen kanaal, overal, ook in Zoeken (anders dan YouTube's ‘Kanaal niet aanbevelen’).

KIJKSTATISTIEKEN
Zie waar je YouTube-tijd naartoe gaat: minuten per categorie (Onderwijs, Entertainment, Muziek…), kijktijd per dag, week en maand vergeleken met eerdere periodes, en hoeveel van je laatste video je echt hebt gezien. Alles blijft op je eigen apparaat.

WAAROM
Shorts, autoplay en rode badges zijn mechanismen om je vast te houden. Focus Tube zet ze uit, zodat YouTube weer een hulpmiddel is dat je bewust gebruikt — ideaal voor studeren, werken en digitaal welzijn.

PRIVACY
Geen account, geen analytics, geen servers. Er wordt nooit iets naar derden gestuurd. Kijkstatistieken blijven in de lokale opslag van je browser; instellingen synchroniseren alleen via Chromes eigen extensiesynchronisatie. Privacybeleid: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

GRATIS EN OPEN SOURCE
Alle functies zijn gratis — geen abonnementen, geen daglimiet, geen licentiesleutel.
https://github.com/bommireddy30/focus-tube
```

---

## Ukrainian — `uk` (Ukraine)

Ukrainian searches: *приховати / заблокувати / прибрати Shorts на
YouTube*. Ukrainian-UI users should get Ukrainian, not the Russian
listing, so this locale matters even though some Ukrainians also search
in Russian.

**Name** (51 chars): `Focus Tube – Приховати й заблокувати YouTube Shorts`

**Summary** (129 chars):
```
Блокувальник Shorts: прибирає YouTube Shorts, мікси й автовідтворення. Блокує канали й слова, показує час перегляду. Безкоштовно.
```

**Description:**
```
Приховайте YouTube Shorts усюди й користуйтеся YouTube без відволікань. Focus Tube — безкоштовний блокувальник Shorts, який також прибирає мікси, автовідтворення та інші приманки для уваги: ви дивитеся те, по що прийшли, і йдете.

Неофіційне й незалежне розширення — не пов'язане з YouTube чи Google, не схвалене й не спонсороване ними.

ЩО БЛОКУЄТЬСЯ
• Плеєр Shorts — посилання /shorts/ відкривається як звичайне відео або одразу веде на головну, на ваш вибір.
• Полиці Shorts — карусель на Головній і в Підписках.
• Shorts у пошуку — полиця й фільтр у результатах пошуку.
• Окремі Shorts — картки Shorts у стрічках, Історії, на сторінках каналів і в «Далі».
• Посилання на Shorts — пункт бічного меню, фільтр і вкладка каналу.
• Мікси — автоматичні плейлисти YouTube «Мікси для вас».
• Автовідтворення — вимикається, а перемикач зникає.
• Полиці «Інші теми» та «Продовжити перегляд» — за бажанням.
• Спокійний режим — приглушує червоні акценти й значок сповіщень YouTube, розмиває клікбейтні обкладинки (наведіть, щоб побачити) і вимикає автопрев'ю під час наведення.
• Ключові слова — приховуйте відео за словами в назві, каналі чи описі, з режимом цілих слів і автовидаленням через 7 днів.
• Заблоковані канали — приховуйте всі відео вибраного каналу всюди, зокрема в Пошуку (на відміну від «Не рекомендувати канал» у YouTube).

СТАТИСТИКА
Дізнайтеся, куди йде ваш час на YouTube: хвилини за категоріями (Освіта, Розваги, Музика…), час за днями, тижнями й місяцями порівняно з попередніми періодами та яку частину останнього відео ви справді переглянули. Усе зберігається лише на вашому пристрої.

НАВІЩО
Shorts, автовідтворення й червоні значки — механізми утримання уваги. Focus Tube вимикає їх, щоб YouTube знову став інструментом, яким ви користуєтеся свідомо, — для навчання, роботи й цифрового добробуту.

КОНФІДЕНЦІЙНІСТЬ
Без акаунта, без аналітики, без серверів. Жодні дані не передаються третім особам. Статистика зберігається в локальному сховищі браузера; налаштування синхронізуються лише через вбудовану синхронізацію розширень Chrome. Політика конфіденційності: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

БЕЗКОШТОВНО Й З ВІДКРИТИМ КОДОМ
Усі функції безкоштовні — без тарифів, без денних лімітів, без ліцензійних ключів.
https://github.com/bommireddy30/focus-tube
```

---

## Arabic — `ar` (Saudi Arabia, Egypt, UAE, the Gulf, North Africa)

**Listing only.** `_locales/ar` localizes just the name, summary, and
toolbar tooltip; the popup falls back to English (same approach `hi`
used to take). A full Arabic popup needs right-to-left layout work
first. This is still worth having: Saudi Arabia and the Gulf have some
of the highest YouTube watch time per person in the world, and the
store indexes this Arabic copy for Arabic-UI users. Searches:
*إخفاء / حظر / إزالة شورتس يوتيوب*, *مانع Shorts*. "YouTube Shorts" stays in
Latin script in the name; the description also uses شورتس, the
Arabic spelling people type.

**Name** (38 chars): `Focus Tube – إخفاء وحظر YouTube Shorts`

**Summary** (124 chars):
```
مانع Shorts: أزل YouTube Shorts وقوائم Mix والتشغيل التلقائي. احظر القنوات والكلمات، وتابع وقت المشاهدة. خاص ومجاني بالكامل.
```

**Description:**
```
أخفِ YouTube Shorts (شورتس يوتيوب) في كل مكان واستمتع بيوتيوب بلا تشتيت. Focus Tube مانع Shorts مجاني يزيل أيضًا قوائم Mix والتشغيل التلقائي وغيرها من عناصر جذب الانتباه — شاهد ما جئت من أجله ثم غادر.

غير رسمي ومستقل — لا يتبع YouTube أو Google ولا يحظى بتأييدهما أو رعايتهما.

ما الذي يحظره
• مشغّل Shorts — يُفتح رابط ‎/shorts/‎ كفيديو عادي أو يعيدك مباشرة إلى الصفحة الرئيسية، حسب اختيارك.
• رفوف Shorts — الشريط الدوّار في الصفحة الرئيسية والاشتراكات.
• Shorts في البحث — الرف وشريحة التصفية في نتائج البحث.
• مقاطع Shorts المتفرقة — بطاقات Shorts في الخلاصات والسجل وصفحات القنوات والفيديو التالي.
• روابط Shorts — عنصر الشريط الجانبي وشريحة التصفية وتبويب القناة.
• قوائم Mix — قوائم "Mix مقترحة لك" التي ينشئها YouTube تلقائيًا.
• التشغيل التلقائي — يُوقَف ويُزال زرّه.
• رفوف "استكشاف مزيد من المواضيع" و"متابعة المشاهدة" — اختيارية.
• الوضع الهادئ — يخفّف اللون الأحمر وشارة الإشعارات، ويموّه الصور المصغّرة المضلِّلة (مرّر المؤشر لرؤيتها)، ويوقف المعاينة التلقائية عند التمرير.
• الكلمات المفتاحية — أخفِ الفيديوهات حسب كلمات في العنوان أو القناة أو الوصف، مع خيار مطابقة الكلمة كاملة والحذف التلقائي بعد 7 أيام.
• القنوات المحظورة — أخفِ كل فيديوهات قناة تختارها في كل مكان، بما في ذلك البحث (بخلاف خيار "عدم اقتراح القناة" في YouTube).

إحصاءات المشاهدة
اعرف أين يذهب وقتك على يوتيوب: الدقائق لكل فئة (التعليم، الترفيه، الموسيقى…)، ووقت المشاهدة يوميًا وأسبوعيًا وشهريًا مقارنةً بالفترات السابقة، وكم شاهدت فعلًا من آخر فيديو. كل ذلك محفوظ على جهازك فقط.

لماذا
Shorts والتشغيل التلقائي والشارات الحمراء آليات صُمّمت لإبقائك تشاهد. يوقفها Focus Tube ليعود يوتيوب أداة تستخدمها عن قصد — مثالي للدراسة والعمل والصحة الرقمية.

الخصوصية
بلا حساب، بلا تحليلات، بلا خوادم. لا تُرسل أي بيانات إلى أي طرف ثالث. تبقى الإحصاءات في التخزين المحلي للمتصفح، وتُزامَن الإعدادات فقط عبر مزامنة الإضافات المدمجة في Chrome. سياسة الخصوصية: https://github.com/bommireddy30/focus-tube/blob/main/PRIVACY.md

مجاني ومفتوح المصدر
كل الميزات مجانية — بلا باقات، بلا حد يومي، بلا مفتاح ترخيص. واجهة الإضافة باللغة الإنجليزية حاليًا.
https://github.com/bommireddy30/focus-tube
```

---

## Localized assets (per language)

Ready: `store-assets/<lang>/` for `ja`, `de`, `hi`, `id`, `ms`, `fil`, `vi`,
`th`, `ro`, `pt_BR`, `pt_PT`, `es`, `fr`, `ru`, `it`, `ko`, `zh_CN`,
`zh_TW`, `tr`, `pl`, `nl`, and `uk` each hold `popup-blocking.png` and `popup-stats.png`
(1280x800, 24-bit, no alpha): the real popup rendered in that language
with the same demo data as the English shots, plus translated
headline/pill copy. Regenerate with `store-assets/capture-localized.js`.

CWS allows **5 screenshots per language**, and each language has its own
set. In the dashboard, switch the listing language and upload exactly
these 5, in this order:

1. `store-assets/<lang>/popup-blocking.png`
2. `store-assets/<lang>/popup-stats.png`
3. `store-assets/youtube-home.png`
4. `store-assets/youtube-search.png`
5. `store-assets/youtube-watch.png`

That is the English set with the two popup shots swapped for the
localized ones. **Arabic** has no localized popup shots (its popup is
English), so it uses the plain English set of 5. If a language arrives pre-filled with the English
screenshots, delete the two English popup shots before adding these.
The promo tiles are the same for every language.

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
  installs by country — compare 4 weeks before/after each listing change
  before iterating on wording. For 3.8.13 watch BR, MX, ES, FR, RU, KR,
  TW, TR, SA and IN (Hindi). A market with impressions but few installs
  needs better copy or screenshots; one with no impressions needs better
  name/summary keywords.
- **Outside traffic in new markets:** a short post where each audience
  already talks about digital wellbeing does more than any wording change:
  TabNews (Brazil), Habr (Russia), Clien/GeekNews (Korea), PTT (Taiwan),
  Wykop (Poland), Tweakers (Netherlands), Ekşi Sözlük (Turkey).
- **Reviews in new languages:** reply in the reviewer's language. A
  handful of reviews in Portuguese or Spanish noticeably lifts
  conversion in those listings.

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
