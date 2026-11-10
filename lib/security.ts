// Криптография демо: всё считается в браузере через Web Crypto.
// Пароли не хранятся в открытом виде, двухфакторные коды — настоящий TOTP (RFC 6238).

const enc = new TextEncoder();
const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
const unhex = (s: string) => new Uint8Array(s.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

export const randomHex = (bytes: number) => hex(crypto.getRandomValues(new Uint8Array(bytes)).buffer);

export function randomDigits(n: number) {
  const a = crypto.getRandomValues(new Uint32Array(n));
  return Array.from(a, (v) => v % 10).join("");
}

export async function hashPassword(password: string, saltHex: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unhex(saltHex), iterations: 120_000 }, key, 256);
  return hex(bits);
}

/** Сравнение без раннего выхода. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function passwordIssues(p: string) {
  const issues: string[] = [];
  if (p.length < 8) issues.push("не короче 8 символов");
  if (!/[a-zа-яё]/i.test(p)) issues.push("хотя бы одна буква");
  if (!/\d/.test(p)) issues.push("хотя бы одна цифра");
  return issues;
}

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function newTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  let bits = "";
  bytes.forEach((b) => (bits += b.toString(2).padStart(8, "0")));
  return bits.match(/.{5}/g)!.map((c) => B32[parseInt(c, 2)]).join("");
}
function b32decode(s: string) {
  let bits = "";
  for (const ch of s.replace(/=+$/, "").toUpperCase()) bits += B32.indexOf(ch).toString(2).padStart(5, "0");
  return new Uint8Array((bits.match(/.{8}/g) ?? []).map((b) => parseInt(b, 2)));
}
async function hotp(secret: string, counter: number) {
  const key = await crypto.subtle.importKey("raw", b32decode(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new ArrayBuffer(8);
  new DataView(msg).setUint32(4, counter);
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const o = h[h.length - 1] & 0xf;
  const n = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return (n % 1_000_000).toString().padStart(6, "0");
}
export const totpNow = (secret: string) => hotp(secret, Math.floor(Date.now() / 30_000));
export async function totpVerify(secret: string, code: string) {
  const c = Math.floor(Date.now() / 30_000);
  for (const d of [0, -1, 1]) if (safeEqual(await hotp(secret, c + d), code)) return true;
  return false;
}
export const totpUri = (secret: string, account: string) =>
  `otpauth://totp/${encodeURIComponent("LEGIT LAB:" + account)}?secret=${secret}&issuer=${encodeURIComponent("LEGIT LAB")}&digits=6&period=30`;

export const newBackupCodes = () => Array.from({ length: 8 }, () => randomHex(4).toUpperCase().replace(/(.{4})/, "$1-"));

export function deviceLabel() {
  if (typeof navigator === "undefined") return "Браузер";
  const ua = navigator.userAgent;
  const b = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /YaBrowser/.test(ua) ? "Яндекс Браузер" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Браузер";
  const o = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "";
  return o ? `${b}, ${o}` : b;
}
