"use client";

import { LINKS } from "@/lib/data";
import { useDemo } from "./DemoProvider";
import styles from "./FinalCta.module.css";

function Pill({ src, alt }: { src: string; alt: string }) {
  return (
    <span className={styles.pill}>
      <img src={src} alt={alt} loading="lazy" />
    </span>
  );
}

export function FinalCta() {
  const { openCheck } = useDemo();

  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <h2 id="cta-title" className={styles.statement} data-reveal>
          Сомневаешься <Pill src="/img/step-detail-640.webp" alt="" /> в вещи?{" "}
          <span className={styles.muted}>Проверь её</span>{" "}
          <Pill src="/img/category-sneakers-640.webp" alt="" />{" "}
          <span className={styles.muted}>до покупки</span>
        </h2>
        <div className={styles.actions} data-reveal>
          <button className="btn" onClick={() => openCheck()}>
            Начать проверку
          </button>
          <a className="text-link" href={LINKS.telegramBot} target="_blank" rel="noopener noreferrer">
            Или в Telegram-боте
          </a>
        </div>
      </div>
    </section>
  );
}
