// Regenerates store-assets/<lang>/popup-{blocking,stats}.png (see README).
// Usage: npm i playwright-core (anywhere), then
//   node capture-localized.js <extensionDir> <outDir>
// Writes *.rgba.png composites; convert to 24-bit no-alpha before upload.
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const os = require("os");

const EXT = path.resolve(process.argv[2]);
const OUT = path.resolve(process.argv[3]);
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

function template(lang, kind, popupFile) {
  const c = COPY[lang];
  const k = c[kind];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  html,body{margin:0;width:1280px;height:800px;overflow:hidden}
  body{background:linear-gradient(135deg,#F4F4F2 0%,#ECECEA 55%,#E2E2E0 100%);font-family:${c.font};color:#1C1C1C;position:relative}
  .left{position:absolute;left:64px;top:0;bottom:0;width:500px;display:flex;flex-direction:column;justify-content:center}
  .eyebrow{font:700 14px/1 "Segoe UI",sans-serif;letter-spacing:.12em;display:flex;align-items:center;gap:8px;margin-bottom:22px}
  .dot{width:8px;height:8px;border-radius:2px;background:#1C1C1C}
  h1{font-weight:800;font-size:${lang === "ja" ? 40 : 44}px;line-height:1.22;margin:0 0 14px;letter-spacing:${lang === "ja" ? "0" : "-.01em"}}
  p{font-size:${lang === "ja" ? 17 : 18}px;line-height:1.6;color:#585858;margin:0 0 26px}
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

  for (const lang of Object.keys(COPY)) {
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
