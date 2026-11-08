"use client";

import { useEffect, useRef } from "react";
import { useDemo } from "./DemoProvider";
import styles from "./Hero.module.css";

export function Hero() {
  const { openCheck } = useDemo();
  const ref = useRef<HTMLElement>(null);

  // 2.5D depth: pointer parallax + scroll lift, written to CSS variables.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const r = el.getBoundingClientRect();
      const sy = Math.min(Math.max(-r.top / r.height, 0), 1);
      el.style.setProperty("--px", cx.toFixed(4));
      el.style.setProperty("--py", cy.toFixed(4));
      el.style.setProperty("--sy", sy.toFixed(4));
      raf = requestAnimationFrame(loop);
    };

    if (fine) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.stage}>
        <p className={styles.word} aria-hidden="true">
          <span className={styles.wordLine}>
            <span>Legit</span>
          </span>{" "}
          <span className={styles.wordLine}>
            <span>Lab</span>
          </span>
        </p>

        <div className={styles.art}>
          <div className={styles.artDepth}>
            <div className={styles.artSway}>
              <div className={styles.artEnter}>
                <picture className={styles.light}>
                  <source media="(max-width: 760px)" srcSet="/img/hero-black-640.webp" />
                  <img
                    src="/img/hero-black.webp"
                    width={771}
                    height={1024}
                    alt="Рука держит чёрное худи с бирками"
                    fetchPriority="high"
                  />
                </picture>
                <picture className={styles.dark}>
                  <source media="(max-width: 760px)" srcSet="/img/hero-white-640.webp" />
                  <img
                    src="/img/hero-white.webp"
                    width={765}
                    height={1024}
                    alt="Рука держит белое худи с бирками"
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h1 id="hero-title" className={styles.title}>
          Проверка подлинности брендовых вещей
        </h1>
        <p className={styles.lead}>
          Помогаем понять, стоит ли покупать вещь и что именно ты держишь в руках.
        </p>
        <div className={styles.buttons}>
          <button className="btn" onClick={() => openCheck()}>
            Начать проверку
          </button>
          <a className="btn btn--ghost" href="#how-it-works">
            Как это работает
          </a>
        </div>
      </div>

      <ul className={styles.aside} aria-label="Что можно проверить">
        <li>Одежда</li>
        <li>Обувь</li>
        <li>Сумки</li>
        <li>Аксессуары</li>
      </ul>
    </section>
  );
}
