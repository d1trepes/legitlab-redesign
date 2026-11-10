// Сжимает исходники из assets/ и content/ в AVIF + WebP нужных размеров (public/img)
// и пишет манифест lib/images.gen.ts. Запуск: npm run images
import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public/img");
await mkdir(out, { recursive: true });

const catalog = JSON.parse(await readFile(path.join(root, "content/catalog.json"), "utf8")).items;
const articles = JSON.parse(await readFile(path.join(root, "content/articles.json"), "utf8")).items;

/** name, src, widths, optional crop {left,top,width,height} in source px, ratio "w/h" to cover-crop */
const jobs = [
  { name: "hero-doubt", src: "assets/v2/hero-doubt.png", widths: [640, 1024, 1536] },
  // вертикальный кадр для кольца: лицо и бирки
  { name: "ring-doubt", src: "assets/v2/hero-doubt.png", widths: [384, 640], crop: { left: 560, top: 60, width: 723, height: 964 } },
  ...["ring-hands-tags", "ring-man-coat", "ring-woman-puffer"].map((n) => ({
    name: n, src: `assets/v2/${n}.png`, widths: [384, 640],
  })),
  ...["outerwear", "clothing", "sneakers", "bags", "accessories"].flatMap((n) => [
    { name: `cat-${n}`, src: `assets/v2/cat-${n}.png`, widths: [400, 720, 1122] },
    { name: `ring-cat-${n}`, src: `assets/v2/cat-${n}.png`, widths: [384, 640], crop: { left: 35, top: 0, width: 1052, height: 1402 } },
  ]),
  ...catalog.map((c) => ({ name: `check-${c.id}`, src: c.photo, widths: [240, 406] })),
  ...articles.map((a) => ({ name: `article-${a.slug}`, src: a.cover, widths: [240, 406] })),
];

const manifest = {};
for (const job of jobs) {
  const base = sharp(path.join(root, job.src));
  const meta = await base.metadata();
  const region = job.crop ?? { left: 0, top: 0, width: meta.width, height: meta.height };
  const ratio = region.height / region.width;
  const widths = job.widths.filter((w) => w <= region.width);
  if (!widths.length) widths.push(region.width);
  for (const w of widths) {
    const pipe = sharp(path.join(root, job.src)).extract(region).resize({ width: w });
    await pipe.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(out, `${job.name}-${w}.avif`));
    await pipe.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(out, `${job.name}-${w}.webp`));
  }
  const { data } = await sharp(path.join(root, job.src)).extract(region).resize(1, 1).raw().toBuffer({ resolveWithObject: true });
  const tone = "#" + [data[0], data[1], data[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
  manifest[job.name] = { widths, ratio: Number(ratio.toFixed(4)), tone };
}

// Open Graph
await sharp(path.join(root, "assets/v2/hero-doubt.png"))
  .resize(1200, 630, { fit: "cover", position: "top" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(root, "public/og.jpg"));

await writeFile(
  path.join(root, "lib/images.gen.ts"),
  `// Сгенерировано scripts/build-images.mjs — не править руками.\nexport const IMAGES = ${JSON.stringify(manifest, null, 2)} as const;\nexport type ImageName = keyof typeof IMAGES;\n`,
);
console.log(`images: ${Object.keys(manifest).length}`);
