import { IMAGES, type ImageName } from "@/lib/images.gen";
import { asset } from "@/lib/site";

type Props = {
  name: ImageName; alt: string; sizes: string; className?: string; priority?: boolean;
  /** Кадрирование: фокус (доли кадра) и увеличение — для примеров ракурсов. */
  focus?: { x: number; y: number; zoom: number };
  ratio?: string;
};

export const imgUrl = (name: ImageName, w: number, ext: "avif" | "webp" = "webp") => asset(`/img/${name}-${w}.${ext}`);
const srcset = (name: ImageName, ext: "avif" | "webp") => IMAGES[name].widths.map((w) => `${imgUrl(name, w, ext)} ${w}w`).join(", ");

export function Pic({ name, alt, sizes, className, priority, focus, ratio }: Props) {
  const m = IMAGES[name];
  const widths = m.widths as readonly number[];
  const w = widths[widths.length - 1];
  const style = focus
    ? { transform: `scale(${focus.zoom})`, transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`, objectPosition: `${focus.x * 100}% ${focus.y * 100}%` }
    : undefined;
  return (
    <picture className={`pic ${className ?? ""}`} style={{ ["--tone" as string]: m.tone, aspectRatio: ratio ?? `1 / ${m.ratio}` }}>
      <source type="image/avif" srcSet={srcset(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(name, "webp")} sizes={sizes} />
      <img
        src={imgUrl(name, w)} alt={alt} width={w} height={Math.round(w * m.ratio)} style={style}
        loading={priority ? "eager" : "lazy"} decoding={priority ? "sync" : "async"} fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
