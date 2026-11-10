// Независимая реализация TOTP (RFC 6238) на node:crypto — для проверки, что коды сайта совместимы со стандартом.
import { createHmac } from "node:crypto";
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function authenticator(secret, t = Date.now()) {
  let bits = "";
  for (const c of secret) bits += B32.indexOf(c).toString(2).padStart(5, "0");
  const key = Buffer.from(bits.match(/.{8}/g).map((b) => parseInt(b, 2)));
  const msg = Buffer.alloc(8);
  msg.writeUInt32BE(Math.floor(t / 30000), 4);
  const h = createHmac("sha1", key).update(msg).digest();
  const o = h[19] & 15;
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1e6).padStart(6, "0");
}
