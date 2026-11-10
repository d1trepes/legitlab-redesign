// Снимает ключевые экраны собранного сайта: 1440 и 390, светлая и тёмная тема → docs/screens/
// Перед запуском: npm run build и раздать out/ под /legitlab-redesign (см. README).
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:4173/legitlab-redesign";
const out = path.resolve(import.meta.dirname, "../docs/screens");
await mkdir(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"] });

const click = (page, text, sel = "button, a") => page.evaluate((text, sel) => [...document.querySelectorAll(sel)].find((e) => e.textContent.trim().startsWith(text))?.click(), text, sel);

const SCREENS = [
  { name: "home", route: "/?3d=on", full: true, wait: 3500 },
  { name: "catalog", route: "/catalog/", full: true },
  { name: "report", route: "/catalog/W47H8W/" },
  { name: "how-it-works", route: "/how-it-works/", full: true },
  { name: "pricing", route: "/pricing/", full: true },
  { name: "login", route: "/login/", guest: true },
  { name: "new-photos", route: "/new/?category=outerwear", prep: async (p) => { await click(p, "Stone Island", ".brands button"); await wait(200); await click(p, "Дальше"); await wait(300); await click(p, "Подставить кадры-примеры"); await wait(2500); await p.evaluate(() => window.scrollTo(0, 0)); }, tall: true },
  { name: "new-confirm", route: "/new/", prep: async (p) => { await click(p, "Дальше"); await wait(200); await click(p, "Дальше"); await wait(400); }, tall: true },
  { name: "orders", route: "/orders/" },
  { name: "order-result", route: "/orders/view/?id=7K2MZR", full: true },
  { name: "order-need-photos", route: "/orders/view/?id=2HF6QA", full: true },
  { name: "wallet", route: "/wallet/", full: true },
  { name: "profile", route: "/profile/", full: true },
  { name: "brand", route: "/brand/", full: true },
];

for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
    await page.evaluateOnNewDocument((t) => localStorage.setItem("legitlab:theme", t), theme);
    let authed = false;
    for (const s of SCREENS) {
      if (!s.guest && !authed && /new|orders|wallet|profile/.test(s.route)) {
        await page.goto(base + "/login/", { waitUntil: "networkidle0" });
        await wait(300);
        await click(page, "Открыть демо-аккаунт");
        await wait(800);
        authed = true;
      }
      await page.goto(base + s.route, { waitUntil: "load" });
      await wait(s.wait ?? 900);
      if (s.prep) await s.prep(page);
      if (s.full) {
        // прокрутка, чтобы появились блоки и догрузились картинки
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); });
        await wait(700);
      }
      // длинные страницы снимаются высоким окном, а не fullPage: так липкие панели стоят на своих местах
      if (s.tall) {
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewport({ width: w, height: Math.min(height, 12000), deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
        await wait(500);
      }
      await page.screenshot({ path: path.join(out, `${s.name}-${w}-${theme}.jpg`), type: "jpeg", quality: 78, fullPage: !!s.full });
      if (s.tall) await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
      console.log(`${s.name}-${w}-${theme}`);
    }
    await ctx.close();
  }
}
await browser.close();
