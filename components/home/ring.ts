import type { ImageName } from "@/lib/images.gen";

/** Общая геометрия кольца: её используют и статичная CSS-версия, и сцена Three.js. */
export const RING_FRAMES: ImageName[] = [
  "ring-doubt", "ring-cat-outerwear", "ring-hands-tags", "ring-cat-sneakers", "ring-woman-puffer",
  "ring-cat-bags", "ring-man-coat", "ring-cat-accessories", "ring-cat-clothing",
];
export const RING_START = -14; // градусы: главный кадр чуть развёрнут, а не стоит анфас
export const RING_TILT_X = -8;
export const RING_TILT_Z = -4;
export const RING_STEP = 360 / RING_FRAMES.length;

export function ringMetrics(width: number, height: number) {
  const mobile = width < 700;
  const fw = Math.min(260, Math.max(132, width * 0.16));
  return { fw, fh: (fw * 4) / 3, r: fw * 1.62, perspective: mobile ? 900 : 1400, cy: height * (mobile ? 0.44 : 0.39), cx: width * (mobile ? 0.5 : 0.6) };
}
/** Затемнение кадра по глубине: 1 — ближний, 0.42 — дальний. */
export const depthTone = (cos: number) => 0.42 + 0.58 * ((cos + 1) / 2);
