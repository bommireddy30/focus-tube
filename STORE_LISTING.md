# Chrome Web Store listing — draft copy

Reference doc for the Developer Dashboard fields. Not part of the
extension package itself.

## ASO strategy (India, USA, Germany, Japan, Southeast Asia, Romania)

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
| Indonesia | Indonesian                       | `id`                    | sembunyikan / blokir / hapus YouTube Shorts, pemblokir Shorts |
| Malaysia | English, Malay                    | `en`, `ms`              | English phrases, plus sembunyi / sekat YouTube Shorts |
| Philippines | English, some Filipino         | `en`, `fil`             | English phrases (Taglish), plus itago / i-block ang YouTube Shorts |
| Vietnam | Vietnamese                         | `vi`                    | ẩn / chặn / xóa YouTube Shorts |
| Thailand | Thai                              | `th`                    | ซ่อน / บล็อก / ปิด YouTube Shorts |
| Singapore | English                          | `en`                    | same English phrases |
| Romania | Romanian                           | `ro`                    | ascunde / blochează / elimină YouTube Shorts |

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
**Malay**, **Filipino**, **Vietnamese**, **Thai**, and **Romanian** and paste the
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

Available in English, Deutsch, 日本語, हिन्दी, Bahasa Indonesia, Bahasa Melayu, Filipino, Tiếng Việt, ไทย, and Română.
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

## Localized assets (per language)

Ready: `store-assets/<lang>/` for `ja`, `de`, `id`, `ms`, `fil`, `vi`,
`th`, and `ro` each hold `popup-blocking.png` and `popup-stats.png`
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
localized ones. If a language arrives pre-filled with the English
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
