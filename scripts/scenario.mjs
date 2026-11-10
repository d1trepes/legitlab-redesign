// Сквозной сценарий по собранному сайту: регистрация → заявка → не хватает кредитов → пополнение → заявка → статусы → итог → 2FA.
// node scripts/scenario.mjs [base]
import puppeteer from "puppeteer-core";
import { authenticator } from "./totp.mjs";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:4173/legitlab-redesign";
const shots = process.env.SCEN_SHOTS;
if (shots) await mkdir(shots, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text()));
page.on("response", (r) => r.status() >= 400 && errors.push(`http ${r.status()} ${r.url()}`));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0;
const step = async (name) => { n++; console.log(`✓ ${n}. ${name}`); if (shots) await page.screenshot({ path: `${shots}/${String(n).padStart(2, "0")}.png` }); };
const clickText = async (text, sel = "button, a, label") => {
  const ok = await page.evaluate((text, sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.trim().startsWith(text) && !e.disabled);
    if (!el) return false;
    el.click();
    return true;
  }, text, sel);
  if (!ok) throw new Error(`нет элемента «${text}»`);
  await wait(450);
};
const has = (text) => page.evaluate((t) => document.body.textContent.includes(t), text);
const must = async (text) => {
  for (let i = 0; i < 25; i++) { if (await has(text)) return; await wait(200); }
  if (shots) await page.screenshot({ path: `${shots}/fail.png` });
  console.log((await page.evaluate(() => document.querySelector("main").innerText)).slice(0, 600));
  throw new Error(`на странице нет «${text}» (${page.url()})`);
};
const type = async (sel, v) => {
  await page.focus(sel);
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type(sel, v);
};
const demoCode = () => page.evaluate(() => document.querySelector(".note b")?.textContent ?? "");

// 1. гость идёт в мастер → его уводит на вход с возвратом
await page.goto(`${base}/new/?category=sneakers`, { waitUntil: "networkidle0" });
await page.waitForFunction(() => location.pathname.includes("/login"));
await step("гость перенаправлен на вход");

// 2. регистрация с нуля
await clickText("Создать аккаунт");
await page.waitForFunction(() => location.pathname.includes("/register"));
await wait(400);
await type('input[autocomplete="given-name"]', "Алеся");
await type('input[type="email"]', "alesya@example.by");
await type('input[type="password"]', "minsk2026pass");
await page.click('input[type="checkbox"]');
await clickText("Создать аккаунт", "button");
await must("Подтверди почту");
await type(".code", await demoCode());
await clickText("Подтвердить", "button");
await page.waitForFunction(() => location.pathname.includes("/new"));
await wait(600);
await step("регистрация, код из письма, возврат в мастер");

// 3. мастер: категория из ссылки уже выбрана
if (!(await page.$('.pick__cat[aria-checked="true"]'))) throw new Error("категория из ссылки не выбрана");
await clickText("Balenciaga", ".brands button");
await clickText("Дальше", "button");
await must("Обязательных загружено 0");
// плохой файл отклоняется
const bad = await page.$("#f-side");
await bad.uploadFile(new URL("../package.json", import.meta.url).pathname);
await wait(600);
await must("Это не фото");
// настоящий JPEG с EXIF-подобным размером
const jpg = "/tmp/legit-test.jpg";
await sharp({ create: { width: 1400, height: 1000, channels: 3, background: "#777" } }).jpeg().toFile(jpg);
await bad.uploadFile(jpg);
await wait(900);
await must("Обязательных загружено 1");
// маленькое фото отклоняется
const small = "/tmp/legit-small.jpg";
await sharp({ create: { width: 300, height: 300, channels: 3, background: "#777" } }).jpeg().toFile(small);
await (await page.$("#f-top")).uploadFile(small);
await wait(600);
await must("слишком маленькое");
await step("загрузка фото: проверка формата и размера");
await clickText("Подставить кадры-примеры", "button");
await page.waitForFunction(() => document.body.textContent.includes("Обязательных загружено 6 из 6"), { timeout: 15000 });
await clickText("Дальше", "button");
await clickText("Срочная", "button");
await type('input[autocapitalize="characters"]', "DEMO10");
await must("Код принят");
await clickText("Дальше", "button");
await must("Не хватает 60 кредитов");
await step("подтверждение: не хватает кредитов");

// 4. пополнение и возврат без потери данных
await clickText("Пополнить кошелёк", "a");
await page.waitForFunction(() => location.pathname.includes("/wallet"));
await wait(600);
await must("Для заявки не хватает");
await clickText("Оплатить", "button");
await wait(1200);
await must("Зачислено");
await step("демо-оплата пакета");
await clickText("Вернуться к заявке", "a");
await page.waitForFunction(() => location.pathname.includes("/new"));
await wait(600);
await must("К списанию");
await must("Balenciaga, обувь");
await step("возврат в заявку: данные на месте");
await clickText("Списать 60 кредитов", "button");
await must("Заявка отправлена");
await step("заявка создана");

// 5. статусы
await clickText("Открыть заявку", "a");
await page.waitForFunction(() => location.pathname.includes("/orders/view"));
await wait(600);
await must("В ожидании");
await clickText("Симулировать ответ эксперта", "button");
await must("В работе");
await page.select(".expert select", "ask");
await clickText("Симулировать ответ эксперта", "button");
await must("Эксперт просит доснять");
await (await page.$("#extra")).uploadFile(jpg);
await wait(900);
await clickText("Отправить эксперту", "button");
await wait(300);
await step("досъёмка отправлена");
await page.select(".expert select", "original");
await clickText("Симулировать ответ эксперта", "button");
await must("Сертификат проверки");
await must("Пример заключения");
await step("итог: оригинал, сертификат с QR");

// 6. обновление страницы на маршруте кабинета
await page.reload({ waitUntil: "networkidle0" });
await wait(500);
await must("Сертификат проверки");
await step("обновление страницы заявки");

// 7. двухфакторная защита: настоящий TOTP
await page.goto(`${base}/profile/`, { waitUntil: "networkidle0" });
await wait(400);
await clickText("Подключить приложение", "button");
const secret = await page.evaluate(() => document.querySelector(".tf__key").textContent.replace(/\s/g, ""));
await type(".tf .code", authenticator(secret));
await clickText("Включить", "button");
await must("Резервные коды");
const backup = await page.evaluate(() => document.querySelector(".tf__backup li").textContent);
await step("2FA включена, резервные коды выданы");
await clickText("Выйти из аккаунта", "button");
await wait(600);
await page.goto(`${base}/login/`, { waitUntil: "networkidle0" });
await wait(400);
await type('input[type="email"]', "alesya@example.by");
await type('input[type="password"]', "wrong-password1");
await clickText("Получить код", "button");
await must("Неверная почта или пароль");
await type('input[type="password"]', "minsk2026pass");
await clickText("Получить код", "button");
await must("приложения-аутентификатора");
await type(".code", "000000");
await clickText("Войти", "button");
await must("Код не подошёл");
await type(".code", authenticator(secret));
await clickText("Войти", "button");
await page.waitForFunction(() => location.pathname.includes("/orders"));
await step("вход с кодом приложения");
// резервный код
await page.goto(`${base}/profile/`, { waitUntil: "networkidle0" });
await wait(300);
await clickText("Выйти из аккаунта", "button");
await page.goto(`${base}/login/`, { waitUntil: "networkidle0" });
await wait(300);
await type('input[type="email"]', "alesya@example.by");
await type('input[type="password"]', "minsk2026pass");
await clickText("Получить код", "button");
await type(".code", backup);
await clickText("Войти", "button");
await page.waitForFunction(() => location.pathname.includes("/orders"));
await step("вход по резервному коду");

// 8. демо-аккаунт и публичные маршруты
await page.goto(`${base}/profile/`, { waitUntil: "networkidle0" });
await wait(300);
await clickText("Выйти из аккаунта", "button");
await page.goto(`${base}/login/`, { waitUntil: "networkidle0" });
await wait(300);
await clickText("Открыть демо-аккаунт", "button");
await page.waitForFunction(() => location.pathname.includes("/orders"));
await wait(400);
await must("Stone Island");
await step("демо-аккаунт с заявками");
for (const r of ["/", "/catalog/", "/catalog/W47H8W/", "/catalog/?verdict=Реплика", "/how-it-works/", "/pricing/", "/articles/", "/articles/moncler-puffer-legitcheck/", "/security/", "/brand/", "/verify/?id=AXNH7B", "/wallet/", "/nope/"]) {
  const res = await page.goto(base + r, { waitUntil: "networkidle0" });
  if (r !== "/nope/" && res.status() !== 200) throw new Error(`${r}: ${res.status()}`);
}
await step("все маршруты открываются напрямую");
await page.goto(`${base}/catalog/?verdict=Реплика`, { waitUntil: "networkidle0" });
await wait(300);
await must("7 проверок");
await type('input[type="search"]', "zzzz");
await wait(200);
await must("Ничего не нашлось");
await step("каталог: фильтр и пустое состояние");

const real = errors.filter((e) => !e.includes("/nope/") && !e.includes("404"));
console.log(real.length ? "ОШИБКИ:\n" + real.join("\n") : "Ошибок в консоли нет");
await browser.close();
process.exit(real.length ? 1 : 0);
