"use client";
// Единственный слой данных демо поверх localStorage.
// Экраны знают только эти функции — при переходе на API меняется этот файл, а не интерфейс.

import { useSyncExternalStore } from "react";
import type { CategoryId } from "./slots";
import type { ImageName } from "./images.gen";
import { PACKAGES, PROMOS, priceOf } from "./site";
import {
  deviceLabel, hashPassword, newBackupCodes, newTotpSecret, randomDigits, randomHex, safeEqual, totpVerify,
} from "./security";
import { clearPhotos, deletePhoto } from "./photos";

const KEY = "legitlab:v1";
const CHALLENGE_KEY = "legitlab:challenge";
const MAX_TRIES = 5;
const LOCK_MS = 60_000;
const CODE_TTL = 10 * 60_000;
const SESSION_TTL = 12 * 3600_000;
export { MAX_ROUNDS } from "./rules";
import { MAX_ROUNDS } from "./rules";

export type Status = "pending" | "in_work" | "need_photos" | "done";
export type Result = "original" | "replica" | "unknown";
export const STATUS_TITLE: Record<Status, string> = {
  pending: "В ожидании", in_work: "В работе", need_photos: "Нужны доп. фото", done: "Проверено",
};
export const RESULT_TITLE: Record<Result, string> = {
  original: "Оригинал", replica: "Реплика", unknown: "Невозможно определить",
};

/** Фото: либо загруженное пользователем (лежит в IndexedDB), либо иллюстрация демо-аккаунта. */
export type Photo = { slot: string; title: string; photoId?: string; demo?: ImageName };
export type TimelineItem = { at: string; status: Status; note?: string };
export type Order = {
  id: string; userId: string; category: CategoryId; brand: string; price: number;
  urgency: "standard" | "fast"; promo?: string; discount: number;
  status: Status; result?: Result; rounds: number;
  photos: Photo[]; extra: Photo[]; request?: string; conclusion?: string;
  timeline: TimelineItem[]; createdAt: string;
};
export type Tx = { id: string; userId: string; at: string; kind: "topup" | "bonus" | "charge"; amount: number; title: string; orderId?: string };
export type User = {
  id: string; email: string; name: string; salt: string; passHash: string; createdAt: string;
  telegram: string | null;
  twoFactor: { enabled: boolean; secret?: string; backup: string[] };
  notify: { status: boolean; photos: boolean; news: boolean };
  via?: "telegram";
};
export type LoginEvent = { at: string; userId: string; ok: boolean; method: string; device: string };
export type Draft = {
  step: number; category: CategoryId | null; brand: string; otherBrand: string;
  photos: Record<string, string>; urgency: "standard" | "fast"; promo: string;
};
export type State = {
  users: User[];
  session: { userId: string; at: string; device: string; id: string } | null;
  orders: Order[]; txs: Tx[]; log: LoginEvent[];
  draft: Draft;
  fails: Record<string, { n: number; until: number }>;
};

export const emptyDraft = (): Draft => ({ step: 0, category: null, brand: "", otherBrand: "", photos: {}, urgency: "standard", promo: "" });

export const DEMO_EMAIL = "demo@legitlab.by";
export const DEMO_PASSWORD = "demo2026";

const ago = (days: number, hours = 0) => new Date(Date.now() - days * 86400_000 - hours * 3600_000).toISOString();
const demoPhotos = (imgs: ImageName[]): Photo[] =>
  imgs.map((demo, i) => ({ slot: `demo${i}`, title: ["Общий вид", "Бирки", "Деталь"][i] ?? "Деталь", demo }));

function seed(): State {
  const u = "demo";
  const orders: Order[] = [
    {
      id: "5NC8WT", userId: u, category: "sneakers", brand: "Air Jordan", price: 50, urgency: "standard", discount: 0,
      status: "pending", rounds: 0, photos: demoPhotos(["cat-sneakers", "ring-hands-tags"]), extra: [],
      timeline: [{ at: ago(0, 2), status: "pending" }], createdAt: ago(0, 2),
    },
    {
      id: "9TB3KD", userId: u, category: "outerwear", brand: "Stone Island", price: 70, urgency: "fast", discount: 0,
      status: "in_work", rounds: 0, photos: demoPhotos(["cat-outerwear", "ring-hands-tags", "ring-man-coat"]), extra: [],
      timeline: [{ at: ago(1, 3), status: "pending" }, { at: ago(1), status: "in_work" }], createdAt: ago(1, 3),
    },
    {
      id: "2HF6QA", userId: u, category: "accessories", brand: "Supreme", price: 70, urgency: "standard", discount: 0,
      status: "need_photos", rounds: 1, photos: demoPhotos(["cat-accessories", "ring-hands-tags"]), extra: [],
      request: "Нужен крупный кадр маркировки на внутренней стороне при дневном свете, без вспышки.",
      timeline: [{ at: ago(3), status: "pending" }, { at: ago(2, 20), status: "in_work" }, { at: ago(2), status: "need_photos" }],
      createdAt: ago(3),
    },
    {
      id: "7K2MZR", userId: u, category: "clothing", brand: "Balenciaga", price: 70, urgency: "standard", discount: 0,
      status: "done", result: "original", rounds: 0, photos: demoPhotos(["cat-clothing", "ring-hands-tags"]), extra: [],
      conclusion: CONCLUSION.original,
      timeline: [{ at: ago(9), status: "pending" }, { at: ago(8, 20), status: "in_work" }, { at: ago(8), status: "done" }],
      createdAt: ago(9),
    },
    {
      id: "4QX9LB", userId: u, category: "bags", brand: "Balenciaga", price: 70, urgency: "standard", discount: 0,
      status: "done", result: "replica", rounds: 1, photos: demoPhotos(["cat-bags", "ring-hands-tags"]), extra: demoPhotos(["cat-bags"]),
      conclusion: CONCLUSION.replica,
      timeline: [
        { at: ago(16), status: "pending" }, { at: ago(15, 20), status: "in_work" }, { at: ago(15), status: "need_photos" },
        { at: ago(14, 12), status: "in_work" }, { at: ago(14), status: "done" },
      ],
      createdAt: ago(16),
    },
  ];
  const txs: Tx[] = [
    { id: "t1", userId: u, at: ago(17), kind: "topup", amount: 300, title: "Пакет 300 кредитов" },
    { id: "t2", userId: u, at: ago(17), kind: "bonus", amount: 50, title: "Бонус к пакету" },
    { id: "t3", userId: u, at: ago(16), kind: "charge", amount: -70, title: "Проверка Balenciaga", orderId: "4QX9LB" },
    { id: "t4", userId: u, at: ago(9), kind: "charge", amount: -70, title: "Проверка Balenciaga", orderId: "7K2MZR" },
    { id: "t5", userId: u, at: ago(3), kind: "charge", amount: -70, title: "Проверка Supreme", orderId: "2HF6QA" },
    { id: "t6", userId: u, at: ago(1, 3), kind: "charge", amount: -70, title: "Срочная проверка Stone Island", orderId: "9TB3KD" },
    { id: "t7", userId: u, at: ago(0, 2), kind: "charge", amount: -50, title: "Проверка Air Jordan", orderId: "5NC8WT" },
  ];
  return {
    users: [{
      id: u, email: DEMO_EMAIL, name: "Демо-аккаунт", createdAt: ago(30),
      // PBKDF2-SHA256 от демо-пароля, посчитан заранее тем же алгоритмом, что и для новых аккаунтов
      salt: "6c656769746c61622d64656d6f", passHash: "adfd59664dec0374283cd73ad5cb3f4ddffc098455200cb8b0670baea4e25c74",
      telegram: null, twoFactor: { enabled: false, backup: [] }, notify: { status: true, photos: true, news: false },
    }],
    session: null, orders, txs, log: [], draft: emptyDraft(), fails: {},
  };
}

/** Текст-пример. Настоящие заключения экспертов публично не показываются. */
export const CONCLUSION: Record<Result, string> = {
  original: "Бирки, маркировка, фурнитура и пошив соответствуют оригинальному изделию. Расхождений по присланным фото не найдено.",
  replica: "Шрифт на вшивной бирке и строчка отличаются от оригинальных. По совокупности признаков вещь не является оригиналом.",
  unknown: "По присланным фото нельзя сделать однозначный вывод: ключевые детали не видны или вещь слишком изношена.",
};

// ---------- хранилище ----------

let state: State | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as State;
      if (s.session && Date.now() - new Date(s.session.at).getTime() > SESSION_TTL) s.session = null;
      state = s;
      return s;
    }
  } catch {}
  state = seed();
  return state;
}
function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}
const update = (fn: (s: State) => State) => commit(fn(read()));
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
/** null — пока страница не ожила в браузере (на сервере данных нет). */
export function useAppState(): State | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

// ---------- выборки ----------

export const userOf = (s: State | null) => (s?.session ? s.users.find((u) => u.id === s.session!.userId) ?? null : null);
export const balanceOf = (s: State, userId: string) => s.txs.filter((t) => t.userId === userId).reduce((a, t) => a + t.amount, 0);
export const ordersOf = (s: State, userId: string) =>
  s.orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const txsOf = (s: State, userId: string) => s.txs.filter((t) => t.userId === userId).sort((a, b) => b.at.localeCompare(a.at));

export function draftPrice(d: Draft) {
  const brand = d.brand === "other" ? d.otherBrand : d.brand;
  const base = brand ? priceOf(brand) : 0;
  const discount = Math.min(base, PROMOS[d.promo.trim().toUpperCase()] ?? 0);
  return { brand, base, discount, total: base - discount };
}

// ---------- вход ----------

type Challenge = {
  kind: "login" | "register" | "reset"; userId?: string; method: "email" | "totp";
  code: string; expires: number; tries: number;
  reg?: { name: string; email: string; salt: string; passHash: string };
};
const getCh = (): Challenge | null => {
  try {
    return JSON.parse(sessionStorage.getItem(CHALLENGE_KEY) ?? "null");
  } catch {
    return null;
  }
};
const setCh = (c: Challenge | null) =>
  c ? sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(c)) : sessionStorage.removeItem(CHALLENGE_KEY);

export type Fail = { ok: false; error: string };
const fail = (error: string): Fail => ({ ok: false, error });
const norm = (email: string) => email.trim().toLowerCase();
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function logEvent(userId: string, ok: boolean, method: string) {
  update((s) => ({ ...s, log: [{ at: new Date().toISOString(), userId, ok, method, device: deviceLabel() }, ...s.log].slice(0, 40) }));
}
function openSession(userId: string, method: string) {
  update((s) => ({ ...s, session: { userId, at: new Date().toISOString(), device: deviceLabel(), id: randomHex(8) } }));
  logEvent(userId, true, method);
  setCh(null);
}
function lockedFor(email: string) {
  const f = read().fails[email];
  return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 1000) : 0;
}
function noteFail(email: string) {
  update((s) => {
    const n = (s.fails[email]?.n ?? 0) + 1;
    return { ...s, fails: { ...s.fails, [email]: n >= MAX_TRIES ? { n: 0, until: Date.now() + LOCK_MS } : { n, until: 0 } } };
  });
}

/** Шаг 1: почта и пароль. Дальше — код из письма или из приложения, если включена двухфакторная защита. */
export async function startLogin(email: string, password: string): Promise<Fail | { ok: true; method: "email" | "totp"; demoCode?: string }> {
  const e = norm(email);
  const wait = lockedFor(e);
  if (wait) return fail(`Слишком много попыток. Попробуй через ${wait} с.`);
  const user = read().users.find((u) => u.email === e);
  // одинаковый ответ для «нет аккаунта» и «неверный пароль» — чтобы нельзя было перебирать почты
  const hash = await hashPassword(password, user?.salt ?? "00");
  if (!user || !user.passHash || !safeEqual(hash, user.passHash)) {
    noteFail(e);
    if (user) logEvent(user.id, false, "Пароль");
    return fail("Неверная почта или пароль.");
  }
  update((s) => ({ ...s, fails: { ...s.fails, [e]: { n: 0, until: 0 } } }));
  if (user.twoFactor.enabled) {
    setCh({ kind: "login", userId: user.id, method: "totp", code: "", expires: Date.now() + CODE_TTL, tries: 0 });
    return { ok: true, method: "totp" };
  }
  const code = randomDigits(6);
  setCh({ kind: "login", userId: user.id, method: "email", code, expires: Date.now() + CODE_TTL, tries: 0 });
  return { ok: true, method: "email", demoCode: code };
}

export function resendCode(): string | null {
  const c = getCh();
  if (!c || c.method !== "email") return null;
  const code = randomDigits(6);
  setCh({ ...c, code, expires: Date.now() + CODE_TTL, tries: 0 });
  return code;
}

async function checkCode(input: string): Promise<Fail | { ok: true; ch: Challenge }> {
  const c = getCh();
  if (!c) return fail("Сеанс входа истёк. Начни заново.");
  if (Date.now() > c.expires) {
    setCh(null);
    return fail("Код устарел. Запроси новый.");
  }
  if (c.tries >= MAX_TRIES) {
    setCh(null);
    return fail("Слишком много попыток. Начни вход заново.");
  }
  const code = input.replace(/\s/g, "").toUpperCase();
  let ok = false;
  if (c.method === "email") ok = safeEqual(code, c.code);
  else {
    const user = read().users.find((u) => u.id === c.userId);
    if (user?.twoFactor.secret) {
      ok = /^\d{6}$/.test(code) && (await totpVerify(user.twoFactor.secret, code));
      if (!ok && user.twoFactor.backup.includes(code)) {
        ok = true; // резервный код одноразовый
        update((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === user.id ? { ...u, twoFactor: { ...u.twoFactor, backup: u.twoFactor.backup.filter((b) => b !== code) } } : u)),
        }));
      }
    }
  }
  if (!ok) {
    setCh({ ...c, tries: c.tries + 1 });
    if (c.userId) logEvent(c.userId, false, c.method === "totp" ? "Код приложения" : "Код из письма");
    return fail(`Код не подошёл. Осталось попыток: ${MAX_TRIES - c.tries - 1}.`);
  }
  return { ok: true, ch: c };
}

export async function confirmLogin(code: string): Promise<Fail | { ok: true }> {
  const r = await checkCode(code);
  if (!r.ok) return r;
  openSession(r.ch.userId!, r.ch.method === "totp" ? "Пароль и код приложения" : "Пароль и код из письма");
  return { ok: true };
}

export async function startRegister(name: string, email: string, password: string): Promise<Fail | { ok: true; demoCode: string }> {
  const e = norm(email);
  if (name.trim().length < 2) return fail("Напиши имя — так к тебе обратится эксперт.");
  if (!emailOk(e)) return fail("Проверь адрес почты.");
  if (read().users.some((u) => u.email === e)) return fail("Аккаунт с такой почтой уже есть. Войди или восстанови пароль.");
  const salt = randomHex(16);
  const passHash = await hashPassword(password, salt);
  const code = randomDigits(6);
  setCh({ kind: "register", method: "email", code, expires: Date.now() + CODE_TTL, tries: 0, reg: { name: name.trim(), email: e, salt, passHash } });
  return { ok: true, demoCode: code };
}

export async function confirmRegister(code: string): Promise<Fail | { ok: true }> {
  const r = await checkCode(code);
  if (!r.ok) return r;
  const reg = r.ch.reg!;
  const id = randomHex(6);
  update((s) => ({
    ...s,
    users: [...s.users, {
      id, ...reg, createdAt: new Date().toISOString(), telegram: null,
      twoFactor: { enabled: false, backup: [] }, notify: { status: true, photos: true, news: false },
    }],
  }));
  openSession(id, "Регистрация");
  return { ok: true };
}

export function startReset(email: string): Fail | { ok: true; demoCode?: string } {
  const e = norm(email);
  if (!emailOk(e)) return fail("Проверь адрес почты.");
  const user = read().users.find((u) => u.email === e);
  // не раскрываем, есть ли аккаунт: ответ одинаковый, код показываем только если адрес найден
  if (!user) {
    setCh(null);
    return { ok: true };
  }
  const code = randomDigits(6);
  setCh({ kind: "reset", userId: user.id, method: "email", code, expires: Date.now() + CODE_TTL, tries: 0 });
  return { ok: true, demoCode: code };
}

export async function confirmReset(code: string, password: string): Promise<Fail | { ok: true }> {
  const r = await checkCode(code);
  if (!r.ok) return r;
  const salt = randomHex(16);
  const passHash = await hashPassword(password, salt);
  update((s) => ({ ...s, users: s.users.map((u) => (u.id === r.ch.userId ? { ...u, salt, passHash } : u)) }));
  openSession(r.ch.userId!, "Восстановление пароля");
  return { ok: true };
}

export function loginDemo() {
  openSession("demo", "Демо-вход");
}

/** В жизни подтверждение приходит от Telegram-бота. В демо создаём отдельный аккаунт без пароля. */
export function loginTelegram() {
  const id = "tg";
  if (!read().users.some((u) => u.id === id)) {
    update((s) => ({
      ...s,
      users: [...s.users, {
        id, email: "", name: "Гость из Telegram", salt: "", passHash: "", createdAt: new Date().toISOString(),
        telegram: "@demo_user", twoFactor: { enabled: false, backup: [] }, notify: { status: true, photos: true, news: false }, via: "telegram",
      }],
    }));
  }
  openSession(id, "Telegram");
}

export const logout = () => update((s) => ({ ...s, session: null }));

// ---------- профиль и безопасность ----------

const patchUser = (id: string, fn: (u: User) => User) => update((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? fn(u) : u)) }));

export function updateProfile(userId: string, name: string): Fail | { ok: true } {
  if (name.trim().length < 2) return fail("Имя слишком короткое.");
  patchUser(userId, (u) => ({ ...u, name: name.trim() }));
  return { ok: true };
}
export async function changePassword(userId: string, current: string, next: string): Promise<Fail | { ok: true }> {
  const user = read().users.find((u) => u.id === userId)!;
  if (user.passHash && !safeEqual(await hashPassword(current, user.salt), user.passHash)) return fail("Текущий пароль неверный.");
  const salt = randomHex(16);
  const passHash = await hashPassword(next, salt);
  patchUser(userId, (u) => ({ ...u, salt, passHash }));
  return { ok: true };
}
export function begin2FA(userId: string) {
  const secret = newTotpSecret();
  patchUser(userId, (u) => ({ ...u, twoFactor: { enabled: false, secret, backup: [] } }));
  return secret;
}
export async function confirm2FA(userId: string, code: string): Promise<Fail | { ok: true; backup: string[] }> {
  const user = read().users.find((u) => u.id === userId)!;
  if (!user.twoFactor.secret || !(await totpVerify(user.twoFactor.secret, code.replace(/\s/g, "")))) return fail("Код не подошёл. Проверь время на телефоне и попробуй следующий код.");
  const backup = newBackupCodes();
  patchUser(userId, (u) => ({ ...u, twoFactor: { ...u.twoFactor, enabled: true, backup } }));
  return { ok: true, backup };
}
export async function disable2FA(userId: string, code: string): Promise<Fail | { ok: true }> {
  const user = read().users.find((u) => u.id === userId)!;
  const c = code.replace(/\s/g, "").toUpperCase();
  const ok = (user.twoFactor.secret && (await totpVerify(user.twoFactor.secret, c))) || user.twoFactor.backup.includes(c);
  if (!ok) return fail("Код не подошёл.");
  patchUser(userId, (u) => ({ ...u, twoFactor: { enabled: false, backup: [] } }));
  return { ok: true };
}
export const cancel2FA = (userId: string) => patchUser(userId, (u) => (u.twoFactor.enabled ? u : { ...u, twoFactor: { enabled: false, backup: [] } }));
export const setTelegram = (userId: string, handle: string | null) => patchUser(userId, (u) => ({ ...u, telegram: handle }));
export const setNotify = (userId: string, notify: User["notify"]) => patchUser(userId, (u) => ({ ...u, notify }));

// ---------- черновик, заявки, кошелёк ----------

export const saveDraft = (patch: Partial<Draft>) => update((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
export function clearDraft(removePhotos: boolean) {
  const d = read().draft;
  if (removePhotos) Object.values(d.photos).forEach((id) => void deletePhoto(id).catch(() => {}));
  update((s) => ({ ...s, draft: emptyDraft() }));
}

const newId = () => {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => abc[b % abc.length]).join("");
};

export function createOrder(userId: string, photos: Photo[]): Fail | { ok: true; id: string } {
  const s = read();
  const d = s.draft;
  const { brand, base, discount, total } = draftPrice(d);
  if (!d.category || !brand) return fail("Не выбрана вещь.");
  if (balanceOf(s, userId) < total) return fail("Не хватает кредитов.");
  const id = newId();
  const at = new Date().toISOString();
  const promo = discount ? d.promo.trim().toUpperCase() : undefined;
  commit({
    ...s,
    orders: [...s.orders, {
      id, userId, category: d.category, brand, price: base, urgency: d.urgency, promo, discount,
      status: "pending", rounds: 0, photos, extra: [], timeline: [{ at, status: "pending" }], createdAt: at,
    }],
    txs: [...s.txs, { id: randomHex(6), userId, at, kind: "charge", amount: -total, title: `${d.urgency === "fast" ? "Срочная проверка" : "Проверка"} ${brand}`, orderId: id }],
    draft: emptyDraft(),
  });
  return { ok: true, id };
}

const patchOrder = (id: string, fn: (o: Order) => Order) => update((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) }));
const step = (o: Order, status: Status, extra: Partial<Order> = {}): Order => ({
  ...o, ...extra, status, timeline: [...o.timeline, { at: new Date().toISOString(), status }],
});

export function sendExtraPhotos(orderId: string, photos: Photo[]) {
  patchOrder(orderId, (o) => step(o, "in_work", { extra: [...o.extra, ...photos], request: undefined }));
}

export type ExpertAction = "take" | "ask" | Result;
/** Демо: ответ эксперта. В жизни статусы приходят с сервера. */
export function simulateExpert(orderId: string, action: ExpertAction) {
  patchOrder(orderId, (o) => {
    if (o.status === "done") return o;
    if (action === "take") return o.status === "pending" ? step(o, "in_work") : o;
    const o2 = o.status === "pending" ? step(o, "in_work") : o;
    if (action === "ask") {
      if (o2.status !== "in_work" || o2.rounds >= MAX_ROUNDS) return o2;
      return step(o2, "need_photos", { rounds: o2.rounds + 1, request: "Нужен ещё один кадр внутреннего ярлыка: крупно, при дневном свете, без вспышки." });
    }
    return step(o2, "done", { result: action, conclusion: CONCLUSION[action], request: undefined });
  });
}

export function topUp(userId: string, index: number) {
  const p = PACKAGES[index];
  if (!p) return;
  const at = new Date().toISOString();
  update((s) => ({
    ...s,
    txs: [
      ...s.txs,
      { id: randomHex(6), userId, at, kind: "topup", amount: p.credits, title: `Пакет ${p.credits} кредитов` },
      ...(p.bonus ? [{ id: randomHex(6), userId, at, kind: "bonus" as const, amount: p.bonus, title: "Бонус к пакету" }] : []),
    ],
  }));
}

export async function resetDemo() {
  try {
    await clearPhotos();
  } catch {}
  sessionStorage.removeItem(CHALLENGE_KEY);
  commit(seed());
}
