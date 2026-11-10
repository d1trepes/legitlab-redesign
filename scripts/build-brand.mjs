// Собирает lockup логотипа: знак C2 + вордмарк в кривых (Alumni Sans 800), иконки сайта.
// Запуск: npm run brand
import * as fontkit from "fontkit";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/brand");
await mkdir(outDir, { recursive: true });

// Знак: полигоны из assets/logo/selected/C2-compact-selected.svg без изменений
const POLYS = [
  [[178, 76], [289, 76], [219, 344], [427, 344], [390, 442], [100, 442]],
  [[324, 76], [430, 76], [390, 203], [268, 258]],
];
const B = { x: 100, y: 76, w: 330, h: 366 }; // реальные границы знака
const markPath = POLYS.map((p) => "M" + p.map(([x, y]) => `${x - B.x} ${y - B.y}`).join("L") + "Z").join("");

// Центр масс знака — для оптического выравнивания над вордмарком
let A = 0, CX = 0;
for (const p of POLYS) {
  let a = 0, cx = 0;
  for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length];
    const k = x0 * y1 - x1 * y0;
    a += k; cx += (x0 + x1) * k;
  }
  a /= 2; cx /= 6 * a;
  A += Math.abs(a); CX += cx * Math.abs(a);
}
const centroidX = CX / A - B.x; // в координатах обрезанного знака
const opticalX = (B.w / 2 + centroidX) / 2; // середина между геометрическим центром и центром масс

// Вордмарк в кривых
const font = fontkit.openSync(path.join(import.meta.dirname, "alumni-sans-800-latin.ttf")) // статичный экземпляр wght 800 из public/fonts (fontTools instancer);
function outline(text, capPx, trackingEm) {
  const s = capPx / font.capHeight;
  const run = font.layout(text);
  let x = 0, d = "";
  run.glyphs.forEach((g, i) => {
    const cmds = g.path.commands.map((c) => {
      const a = c.args.map((v, j) => (j % 2 === 0 ? (x + v * s) : (capPx - v * s)).toFixed(2));
      return ({ moveTo: "M", lineTo: "L", quadraticCurveTo: "Q", bezierCurveTo: "C", closePath: "Z" })[c.command] + a.join(" ");
    });
    d += cmds.join("");
    x += run.positions[i].xAdvance * s + (i < run.glyphs.length - 1 ? trackingEm * font.unitsPerEm * s : 0);
  });
  return { d, width: x, height: capPx };
}

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="LEGIT LAB"><g fill="currentColor">${body}</g></svg>\n`;

// Вертикальный lockup: знак сверху, вордмарк под ним по оптическому центру
const cap = 74, gap = 54;
const word = outline("LEGIT LAB", cap, 0.085);
const W = Math.max(word.width, B.w);
const markX = W / 2 - opticalX;
const vertical = { w: W, h: B.h + gap + cap, markX, wordX: (W - word.width) / 2, wordY: B.h + gap };
await writeFile(path.join(outDir, "lockup.svg"), svg(vertical.w, vertical.h,
  `<path transform="translate(${markX.toFixed(2)} 0)" d="${markPath}"/><path transform="translate(${vertical.wordX.toFixed(2)} ${vertical.wordY})" d="${word.d}"/>`));
await writeFile(path.join(outDir, "mark.svg"), svg(B.w, B.h, `<path d="${markPath}"/>`));

// Строчный вордмарк для футера
const line = outline("LEGIT LAB", 300, 0.012);
await writeFile(path.join(outDir, "wordmark.svg"), svg(line.width, line.height, `<path d="${line.d}"/>`));

// Иконки: знак на чёрном поле
const pad = 96;
const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${B.h + pad * 2} ${B.h + pad * 2}"><rect width="100%" height="100%" fill="#0b0b0b"/><path fill="#f1f1ee" transform="translate(${pad + (B.h - B.w) / 2 + (B.w / 2 - opticalX)} ${pad})" d="${markPath}"/></svg>`;
await writeFile(path.join(root, "app/icon.svg"), icon(64));
await sharp(Buffer.from(icon(180))).png().toFile(path.join(root, "app/apple-icon.png"));
await sharp(Buffer.from(icon(192))).png().toFile(path.join(root, "public/icon-192.png"));
await sharp(Buffer.from(icon(512))).png().toFile(path.join(root, "public/icon-512.png"));

await writeFile(path.join(root, "lib/brand.gen.ts"),
  `// Сгенерировано scripts/build-brand.mjs — не править руками.\nexport const BRAND = ${JSON.stringify({
    mark: { w: B.w, h: B.h, d: markPath },
    vertical: { ...vertical, wordD: word.d },
    line: { w: line.width, h: line.height, d: line.d },
    optical: { centroidX, opticalX, shift: B.w / 2 - opticalX },
  })} as const;\n`);
console.log("brand ok", { centroidX: centroidX.toFixed(1), opticalX: opticalX.toFixed(1), wordW: word.width.toFixed(0) });
