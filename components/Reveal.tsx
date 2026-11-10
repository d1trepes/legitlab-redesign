"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Появление блока при входе в экран. Без JS и при reduced-motion блок просто виден. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: { children: ReactNode; as?: ElementType; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { ["--delay" as string]: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
