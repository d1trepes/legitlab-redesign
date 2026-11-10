import { BRAND } from "@/lib/brand.gen";

/** Вертикальный lockup: знак, под ним вордмарк по оптическому центру. */
export function Lockup({ height = 40, className }: { height?: number; className?: string }) {
  const v = BRAND.vertical;
  return (
    <svg className={className} viewBox={`0 0 ${v.w} ${v.h}`} height={height} width={(height * v.w) / v.h} role="img" aria-label="LEGIT LAB" fill="currentColor">
      <path transform={`translate(${v.markX} 0)`} d={BRAND.mark.d} />
      <path transform={`translate(${v.wordX} ${v.wordY})`} d={v.wordD} />
    </svg>
  );
}

export function Mark({ height = 28, className }: { height?: number; className?: string }) {
  const m = BRAND.mark;
  return (
    <svg className={className} viewBox={`0 0 ${m.w} ${m.h}`} height={height} width={(height * m.w) / m.h} aria-hidden="true" fill="currentColor">
      <path d={m.d} />
    </svg>
  );
}

/** Строчный вордмарк во всю ширину контейнера. */
export function Wordmark({ className }: { className?: string }) {
  const l = BRAND.line;
  return (
    <svg className={className} viewBox={`0 0 ${l.w} ${l.h}`} width="100%" role="img" aria-label="LEGIT LAB" fill="currentColor" preserveAspectRatio="xMidYMid meet">
      <path d={l.d} />
    </svg>
  );
}
