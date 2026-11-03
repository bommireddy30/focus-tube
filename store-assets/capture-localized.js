// Regenerates store-assets/<lang>/popup-{blocking,stats}.png (see README).
// Usage: npm i playwright-core (anywhere), then
//   node capture-localized.js <extensionDir> <outDir> [lang,lang,...]
// (omit the language list to regenerate every language in COPY)
// Writes *.rgba.png composites; convert to 24-bit no-alpha before upload.
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const os = require("os");

const EXT = path.resolve(process.argv[2]);
const OUT = path.resolve(process.argv[3]);
const LANGS = process.argv[4] ? process.argv[4].split(",") : null;
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const COPY = {
  ja: {
    font: `"Yu Gothic UI", "Meiryo", "Segoe UI", sans-serif`,
    blocking: {
      headline: "ショートもミックスも、<br>選んだチャンネルもブロック",
      sub: "おすすめを控えるだけではない、本物のブロック。ショート、ミックス、指定したチャンネルを YouTube のあらゆる場所から非表示にします。",
      pills: ["無料", "プライバシー保護", "登録不要", "広告なし"],
    },
    stats: {
      headline: "視聴時間の使い道が、<br>ひと目でわかる",
      sub: "YouTube 公式のカテゴリで内訳を表示。日・週・月の推移も確認できます。記録は端末内だけ、外部には送信しません。",
      pills: ["無料", "プライバシー保護", "端末内のみ", "登録不要"],
    },
    footer: "無料 · プライバシー保護 · 登録不要",
  },
  de: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Shorts, Mixe & Kanäle deiner Wahl blockieren",
      sub: "Echtes Blockieren statt sanfter Hinweis – blendet Shorts, Mixe und jeden gewählten Kanal überall auf YouTube aus.",
      pills: ["Kostenlos", "Privat", "Kein Konto", "Keine Werbung"],
    },
    stats: {
      headline: "Sieh, wohin deine Zeit auf YouTube geht",
      sub: "Aufschlüsselung nach YouTubes eigenen Kategorien, dazu Verläufe nach Tag, Woche und Monat – lokal erfasst, nie gesendet.",
      pills: ["Kostenlos", "Privat", "Nur lokal", "Kein Konto"],
    },
    footer: "Kostenlos · Privat · Kein Konto",
  },
  id: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Blokir Shorts, Mix & channel pilihan Anda",
      sub: "Pemblokiran sungguhan, bukan sekadar saran – sembunyikan Shorts, Mix, dan channel mana pun di seluruh YouTube.",
      pills: ["Gratis", "Privat", "Tanpa akun", "Tanpa iklan"],
    },
    stats: {
      headline: "Lihat ke mana waktu YouTube Anda pergi",
      sub: "Rincian per kategori YouTube, plus tren harian, mingguan, dan bulanan – hanya disimpan di perangkat Anda.",
      pills: ["Gratis", "Privat", "Hanya lokal", "Tanpa akun"],
    },
    footer: "Gratis · Privat · Tanpa akun",
  },
  ms: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Sekat Shorts, Mix & saluran pilihan anda",
      sub: "Penyekatan sebenar, bukan sekadar cadangan – sembunyikan Shorts, Mix dan mana-mana saluran di seluruh YouTube.",
      pills: ["Percuma", "Peribadi", "Tiada akaun", "Tiada iklan"],
    },
    stats: {
      headline: "Lihat ke mana masa YouTube anda pergi",
      sub: "Pecahan mengikut kategori YouTube, serta trend harian, mingguan dan bulanan – disimpan pada peranti anda sahaja.",
      pills: ["Percuma", "Peribadi", "Setempat sahaja", "Tiada akaun"],
    },
    footer: "Percuma · Peribadi · Tiada akaun",
  },
  fil: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "I-block ang Shorts, Mix at mga channel na pipiliin mo",
      sub: "Tunay na pag-block, hindi lang mungkahi – itago ang Shorts, Mix at kahit anong channel sa buong YouTube.",
      pills: ["Libre", "Pribado", "Walang account", "Walang ads"],
    },
    stats: {
      headline: "Alamin kung saan napupunta ang oras mo sa YouTube",
      sub: "Hati-hati ayon sa sariling kategorya ng YouTube, kasama ang trend bawat araw, linggo at buwan – nasa device mo lang.",
      pills: ["Libre", "Pribado", "Sa device lang", "Walang account"],
    },
    footer: "Libre · Pribado · Walang account",
  },
  vi: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Chặn Shorts, Mix và kênh bạn chọn",
      sub: "Chặn thật sự, không chỉ là gợi ý – ẩn Shorts, Mix và bất kỳ kênh nào trên toàn bộ YouTube.",
      pills: ["Miễn phí", "Riêng tư", "Không quảng cáo"],
    },
    stats: {
      headline: "Biết thời gian YouTube của bạn đi đâu",
      sub: "Phân tích theo danh mục của YouTube, kèm xu hướng theo ngày, tuần, tháng – chỉ lưu trên thiết bị của bạn.",
      pills: ["Miễn phí", "Riêng tư", "Trên máy", "Không tài khoản"],
    },
    footer: "Miễn phí · Riêng tư · Không cần tài khoản",
  },
  th: {
    font: `"Leelawadee UI", "Segoe UI", sans-serif`,
    blocking: {
      headline: "บล็อก Shorts มิกซ์<br>และช่องที่คุณเลือก",
      sub: "บล็อกจริง ไม่ใช่แค่คำแนะนำ<br>ซ่อน Shorts มิกซ์ และช่องใดก็ได้ทั่วทั้ง YouTube",
      pills: ["ฟรี", "เป็นส่วนตัว", "ไม่ต้องมีบัญชี", "ไม่มีโฆษณา"],
    },
    stats: {
      headline: "รู้ว่าเวลาบน YouTube<br>ของคุณหมดไปกับอะไร",
      sub: "แยกตามหมวดหมู่ของ YouTube<br>พร้อมแนวโน้มรายวัน รายสัปดาห์ และรายเดือน<br>บันทึกในอุปกรณ์ ไม่ส่งไปที่ใด",
      pills: ["ฟรี", "เป็นส่วนตัว", "เก็บในเครื่อง", "ไม่ต้องมีบัญชี"],
    },
    footer: "ฟรี · เป็นส่วนตัว · ไม่ต้องมีบัญชี",
  },
  ro: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Blochează Shorts, Mixuri și canalele alese de tine",
      sub: "Blocare reală, nu doar o sugestie – ascunde Shorts, Mixurile și orice canal ales, peste tot pe YouTube.",
      pills: ["Gratuit", "Privat", "Fără cont", "Fără reclame"],
    },
    stats: {
      headline: "Vezi unde se duce timpul tău pe YouTube",
      sub: "Defalcare pe categoriile oficiale YouTube, plus evoluția pe zile, săptămâni și luni – înregistrat local, nu este trimis nicăieri.",
      pills: ["Gratuit", "Privat", "Doar local", "Fără cont"],
    },
    footer: "Gratuit · Privat · Fără cont",
  },
  hi: {
    font: `"Nirmala UI", "Segoe UI", sans-serif`,
    blocking: {
      headline: "Shorts, Mixes और आपके चुने चैनल ब्लॉक करें",
      sub: "सिर्फ़ सुझाव नहीं, असली ब्लॉकिंग – पूरे YouTube पर Shorts, Mixes और कोई भी चैनल छिपाएं।",
      pills: ["मुफ़्त", "प्राइवेट", "अकाउंट नहीं", "विज्ञापन नहीं"],
    },
    stats: {
      headline: "देखें आपका YouTube का समय कहां जाता है",
      sub: "YouTube की अपनी कैटेगरी के हिसाब से ब्योरा, साथ में दिन, हफ़्ते और महीने का ट्रेंड – सब सिर्फ़ आपके डिवाइस पर।",
      pills: ["मुफ़्त", "प्राइवेट", "सिर्फ़ डिवाइस पर", "अकाउंट नहीं"],
    },
    footer: "मुफ़्त · प्राइवेट · अकाउंट नहीं",
  },
  pt_BR: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Bloqueie Shorts, Mixes e os canais que você escolher",
      sub: "Bloqueio de verdade, não só uma sugestão – oculte Shorts, Mixes e qualquer canal em todo o YouTube.",
      pills: ["Grátis", "Privado", "Sem conta", "Sem anúncios"],
    },
    stats: {
      headline: "Veja para onde vai seu tempo no YouTube",
      sub: "Divisão pelas categorias do próprio YouTube, mais tendências por dia, semana e mês – só no seu dispositivo.",
      pills: ["Grátis", "Privado", "Só local", "Sem conta"],
    },
    footer: "Grátis · Privado · Sem conta",
  },
  pt_PT: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Bloqueie Shorts, Misturas e os canais que escolher",
      sub: "Bloqueio a sério, não apenas uma sugestão – oculte Shorts, Misturas e qualquer canal em todo o YouTube.",
      pills: ["Grátis", "Privado", "Sem conta", "Sem anúncios"],
    },
    stats: {
      headline: "Veja para onde vai o seu tempo no YouTube",
      sub: "Divisão pelas categorias do próprio YouTube, mais tendências por dia, semana e mês – apenas no seu dispositivo.",
      pills: ["Grátis", "Privado", "Só local", "Sem conta"],
    },
    footer: "Grátis · Privado · Sem conta",
  },
  es: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Bloquea Shorts, Mixes y los canales que elijas",
      sub: "Bloqueo real, no solo una sugerencia – oculta Shorts, Mixes y cualquier canal en todo YouTube.",
      pills: ["Gratis", "Privado", "Sin cuenta", "Sin anuncios"],
    },
    stats: {
      headline: "Descubre a dónde se va tu tiempo en YouTube",
      sub: "Desglose por las categorías de YouTube, más tendencias por día, semana y mes – solo en tu dispositivo.",
      pills: ["Gratis", "Privado", "Solo local", "Sin cuenta"],
    },
    footer: "Gratis · Privado · Sin cuenta",
  },
  fr: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Bloquez les Shorts, les Mix et les chaînes de votre choix",
      sub: "Un vrai blocage, pas une simple suggestion – masquez les Shorts, les Mix et n’importe quelle chaîne partout sur YouTube.",
      pills: ["Gratuit", "Privé", "Sans compte", "Sans pub"],
    },
    stats: {
      headline: "Voyez où passe votre temps sur YouTube",
      sub: "Répartition par catégories YouTube, plus l’évolution par jour, semaine et mois – enregistré localement, jamais envoyé.",
      pills: ["Gratuit", "Privé", "100 % local", "Sans compte"],
    },
    footer: "Gratuit · Privé · Sans compte",
  },
  ru: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Блокируйте Shorts, миксы и любые каналы",
      sub: "Настоящая блокировка, а не мягкая подсказка – скрывает Shorts, миксы и выбранные каналы во всём YouTube.",
      pills: ["Бесплатно", "Приватно", "Без аккаунта", "Без рекламы"],
    },
    stats: {
      headline: "Узнайте, куда уходит ваше время на YouTube",
      sub: "Разбивка по категориям YouTube и динамика по дням, неделям и месяцам – хранится только на вашем устройстве.",
      pills: ["Бесплатно", "Приватно", "Только локально", "Без аккаунта"],
    },
    footer: "Бесплатно · Приватно · Без аккаунта",
  },
  it: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Blocca Shorts, Mix e i canali che scegli tu",
      sub: "Un vero blocco, non un semplice suggerimento – nascondi Shorts, Mix e qualsiasi canale ovunque su YouTube.",
      pills: ["Gratis", "Privato", "Senza account", "Senza pubblicità"],
    },
    stats: {
      headline: "Scopri dove va il tuo tempo su YouTube",
      sub: "Suddivisione per categorie di YouTube, più andamento per giorno, settimana e mese – solo sul tuo dispositivo.",
      pills: ["Gratis", "Privato", "Solo locale", "Senza account"],
    },
    footer: "Gratis · Privato · Senza account",
  },
  ko: {
    font: `"Malgun Gothic", "Segoe UI", sans-serif`,
    blocking: {
      headline: "Shorts, 믹스, 원하는 채널까지<br>모두 차단",
      sub: "추천 줄이기가 아닌 진짜 차단. Shorts, 믹스, 지정한 채널을 YouTube 어디서나 숨깁니다.",
      pills: ["무료", "개인정보 보호", "계정 불필요", "광고 없음"],
    },
    stats: {
      headline: "YouTube 시간이 어디에 쓰이는지<br>한눈에",
      sub: "YouTube 공식 카테고리별 분석과 일·주·월별 추이. 기록은 기기에만 저장되며 외부로 전송되지 않습니다.",
      pills: ["무료", "개인정보 보호", "기기에만 저장", "계정 불필요"],
    },
    footer: "무료 · 개인정보 보호 · 계정 불필요",
  },
  zh_CN: {
    font: `"Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", sans-serif`,
    blocking: {
      headline: "屏蔽 Shorts、合辑<br>和你指定的频道",
      sub: "真正的屏蔽，而不只是“少推荐”。在 YouTube 各处隐藏 Shorts、合辑和任何指定频道。",
      pills: ["免费", "注重隐私", "无需账号", "无广告"],
    },
    stats: {
      headline: "看清你的 YouTube<br>时间都去哪儿了",
      sub: "按 YouTube 官方类别细分，并显示每日、每周、每月趋势。仅保存在本设备，绝不上传。",
      pills: ["免费", "注重隐私", "仅存本地", "无需账号"],
    },
    footer: "免费 · 注重隐私 · 无需账号",
  },
  zh_TW: {
    font: `"Microsoft JhengHei UI", "Microsoft JhengHei", "Segoe UI", sans-serif`,
    blocking: {
      headline: "封鎖 Shorts、合輯<br>和你指定的頻道",
      sub: "真正的封鎖，而不只是「少推薦」。在 YouTube 各處隱藏 Shorts、合輯和任何指定頻道。",
      pills: ["免費", "注重隱私", "無需帳號", "無廣告"],
    },
    stats: {
      headline: "看清你的 YouTube<br>時間都花在哪裡",
      sub: "依 YouTube 官方類別細分，並顯示每日、每週、每月趨勢。只存在這部裝置，絕不上傳。",
      pills: ["免費", "注重隱私", "僅存本機", "無需帳號"],
    },
    footer: "免費 · 注重隱私 · 無需帳號",
  },
  tr: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Shorts, Mix'ler ve seçtiğin kanalları engelle",
      sub: "Yumuşak bir öneri değil, gerçek engelleme – Shorts, Mix'ler ve seçtiğin her kanal YouTube'un her yerinde gizlenir.",
      pills: ["Ücretsiz", "Gizli", "Hesap yok", "Reklam yok"],
    },
    stats: {
      headline: "YouTube'da zamanının nereye gittiğini gör",
      sub: "YouTube'un kendi kategorilerine göre döküm, ayrıca günlük, haftalık ve aylık eğilimler – yalnızca cihazında.",
      pills: ["Ücretsiz", "Gizli", "Yalnızca yerel", "Hesap yok"],
    },
    footer: "Ücretsiz · Gizli · Hesap yok",
  },
  pl: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Blokuj Shorts, składanki i wybrane kanały",
      sub: "Prawdziwa blokada, a nie delikatna sugestia – ukrywa Shorts, składanki i dowolne kanały w całym YouTube.",
      pills: ["Za darmo", "Prywatnie", "Bez konta", "Bez reklam"],
    },
    stats: {
      headline: "Zobacz, na co idzie Twój czas w YouTube",
      sub: "Podział według kategorii YouTube oraz trendy dzienne, tygodniowe i miesięczne – tylko na Twoim urządzeniu.",
      pills: ["Za darmo", "Prywatnie", "Tylko lokalnie", "Bez konta"],
    },
    footer: "Za darmo · Prywatnie · Bez konta",
  },
  nl: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Blokkeer Shorts, mixen en kanalen naar keuze",
      sub: "Echt blokkeren, geen zachte hint – verbergt Shorts, mixen en elk gekozen kanaal overal op YouTube.",
      pills: ["Gratis", "Privé", "Geen account", "Geen reclame"],
    },
    stats: {
      headline: "Zie waar je tijd op YouTube naartoe gaat",
      sub: "Uitsplitsing per YouTube-categorie, plus trends per dag, week en maand – alleen op je eigen apparaat.",
      pills: ["Gratis", "Privé", "Alleen lokaal", "Geen account"],
    },
    footer: "Gratis · Privé · Geen account",
  },
  uk: {
    font: `"Segoe UI", sans-serif`,
    blocking: {
      headline: "Блокуйте Shorts, мікси й будь-які канали",
      sub: "Справжнє блокування, а не м'яка підказка – приховує Shorts, мікси й вибрані канали в усьому YouTube.",
      pills: ["Безкоштовно", "Приватно", "Без акаунта", "Без реклами"],
    },
    stats: {
      headline: "Дізнайтеся, куди йде ваш час на YouTube",
      sub: "Розподіл за категоріями YouTube і динаміка за днями, тижнями та місяцями – зберігається лише на вашому пристрої.",
      pills: ["Безкоштовно", "Приватно", "Лише локально", "Без акаунта"],
    },
    footer: "Безкоштовно · Приватно · Без акаунта",
  },
};

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function seedData() {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  // Spread watch time across this month and the two before it.
  const daily = {};
  const add = (monthOffset, days, secondsEach) => {
    for (let i = 0; i < days; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - monthOffset, Math.max(1, (monthOffset === 0 ? now.getDate() : 28) - i * 2));
      daily[dayKey(d)] = (daily[dayKey(d)] || 0) + secondsEach;
    }
  };
  add(0, 6, 1500); // 9000s this month
  add(1, 6, 600); // 3600s last month
  add(2, 3, 500); // 1500s two months ago
  return {
    settings: {
      theme: "light",
      keywords: [],
      blockedChannels: [
        { id: "@democlickbait", name: "@democlickbait" },
        { id: "@prankcentral", name: "Prank Central" },
        { id: "@democreator", name: "Demo Creator", expiresAt: endOfToday },
      ],
      autoBlockAfterWatch: true,
      blockedNames: [{ name: "Demo Creator", expiresAt: endOfToday }],
    },
    stats: { blockedCount: 58 },
    catStats: {
      totals: {
        Education: 5400,
        Entertainment: 2700,
        Gaming: 1800,
        Shorts: 1500,
        "Science & Technology": 1200,
        Music: 900,
        Comedy: 600,
      },
      recencyTotals: { Recent: 8000, "This year": 4000, Older: 2100 },
      dailyTotals: daily,
      lastVideo: {
        videoId: "demo0000001",
        title: "How Neural Networks Actually Learn",
        category: "Education",
        seconds: 900,
        lengthSeconds: 1260,
        tags: [],
        lastWatchedAt: Date.now(),
      },
    },
  };
}

// CJK copy runs a step smaller with no negative tracking, like Japanese did.
const CJK = ["ja", "ko", "zh_CN", "zh_TW"];

function template(lang, kind, popupFile) {
  const c = COPY[lang];
  const k = c[kind];
  const cjk = CJK.includes(lang);
  return `<!doctype html><html lang="${lang.replace("_", "-")}"><head><meta charset="utf-8"><style>
  html,body{margin:0;width:1280px;height:800px;overflow:hidden}
  body{background:linear-gradient(135deg,#F4F4F2 0%,#ECECEA 55%,#E2E2E0 100%);font-family:${c.font};color:#1C1C1C;position:relative}
  .left{position:absolute;left:64px;top:0;bottom:0;width:500px;display:flex;flex-direction:column;justify-content:center}
  .eyebrow{font:700 14px/1 "Segoe UI",sans-serif;letter-spacing:.12em;display:flex;align-items:center;gap:8px;margin-bottom:22px}
  .dot{width:8px;height:8px;border-radius:2px;background:#1C1C1C}
  h1{font-weight:800;font-size:${cjk ? 40 : 44}px;line-height:${lang === "th" || lang === "hi" ? 1.4 : 1.22};margin:0 0 14px;letter-spacing:${cjk ? "0" : "-.01em"}}
  p{font-size:${cjk ? 17 : 18}px;line-height:1.6;color:#585858;margin:0 0 26px}
  .pills{display:flex;flex-wrap:wrap;gap:12px}
  .pill{background:#fff;border-radius:999px;padding:10px 20px;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,.07)}
  .foot{position:absolute;left:64px;bottom:64px;font:600 14px ${c.font};color:#585858;display:flex;align-items:center;gap:8px}
  .card{position:absolute;left:865px;top:40px;width:265px;height:800px;border-radius:22px;overflow:hidden;
        box-shadow:0 18px 50px rgba(0,0,0,.14),0 2px 6px rgba(0,0,0,.06);background:#F7F7F5}
  .card img{width:265px;display:block}
  </style></head><body>
  <div class="left">
    <div class="eyebrow"><span class="dot"></span>FOCUS TUBE</div>
    <h1>${k.headline}</h1>
    <p>${k.sub}</p>
    <div class="pills">${k.pills.map((x) => `<span class="pill">${x}</span>`).join("")}</div>
  </div>
  <div class="foot"><span class="dot"></span>${c.footer}</div>
  <div class="card"><img src="${popupFile}"></div>
  </body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "ft-shots-"));
  const ctx = await chromium.launchPersistentContext(userDir, {
    executablePath: EDGE,
    headless: false,
    args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, "--window-position=-2400,0"],
  });
  let sw = ctx.serviceWorkers()[0] || (await ctx.waitForEvent("serviceworker", { timeout: 20000 }));
  const extId = sw.url().split("/")[2];
  const data = seedData();
  await sw.evaluate(async (d) => {
    const cur = (await chrome.storage.sync.get("focusTubeSettings")).focusTubeSettings || {};
    await chrome.storage.sync.set({ focusTubeSettings: { ...cur, ...d.settings } });
    await chrome.storage.local.set({ focusTubeStats: d.stats, focusTubeCategoryStats: d.catStats });
  }, data);

  for (const lang of LANGS || Object.keys(COPY)) {
    for (const kind of ["blocking", "stats"]) {
      const page = await ctx.newPage();
      await page.setViewportSize({ width: 350, height: 1500 });
      await page.goto(`chrome-extension://${extId}/popup.html?lang=${lang}`);
      await page.waitForTimeout(1200);
      await page.evaluate((kind) => {
        // Same state as the English screenshots: only the card being showcased open.
        ["settingsToggle", "keywordsToggle", "channelsToggle", "timeSpentToggle", "recencyToggle"].forEach((id) =>
          setDisclosureExpanded(id, kind === "blocking" ? id === "channelsToggle" : id === "timeSpentToggle")
        );
        document.documentElement.style.scrollbarWidth = "none";
      }, kind);
      if (kind === "stats") {
        const tab = page.locator("#tabStats, [data-tab='stats'], .tab:nth-child(2)").first();
        await tab.click();
      }
      await page.waitForTimeout(800);
      const popupPng = path.join(OUT, `raw-${lang}-${kind}.png`);
      await page.screenshot({ path: popupPng, fullPage: true });
      await page.close();

      const htmlFile = path.join(OUT, `tpl-${lang}-${kind}.html`);
      fs.writeFileSync(htmlFile, template(lang, kind, path.basename(popupPng)));
      const tp = await ctx.newPage();
      await tp.setViewportSize({ width: 1280, height: 800 });
      await tp.goto("file:///" + htmlFile.replace(/\\/g, "/"));
      await tp.waitForTimeout(500);
      await tp.screenshot({ path: path.join(OUT, `popup-${kind}-${lang}.rgba.png`) });
      await tp.close();
      console.log("done", lang, kind);
    }
  }
  await ctx.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
