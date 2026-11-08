"use client";

import { CATEGORIES } from "@/lib/data";
import { useDemo } from "./DemoProvider";
import { LogoMark } from "./Logo";
import styles from "./Categories.module.css";

export function Categories() {
  const { openCheck } = useDemo();

  return (
    <section className={styles.sheet} id="categories" aria-labelledby="categories-title">
      <div className="container">
        <div className={styles.head} data-reveal>
          <h2 id="categories-title" className="display">
            Что мы
            <br />
            проверяем
          </h2>
          <p className={styles.lead}>
            Одежду, обувь, сумки и аксессуары известных брендов. Выбери категорию — дальше подскажем, какие
            фотографии нужны для проверки.
          </p>
        </div>

        <ul className={styles.row}>
          {CATEGORIES.map((c, i) => (
            <li key={c.name} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <button
                className={`${styles.card} ${c.image ? "" : styles.cardText}`}
                onClick={() => openCheck(c.name)}
              >
                {c.image ? (
                  <span className={styles.photo}>
                    <img
                      src={`${c.image}-640.webp`}
                      srcSet={`${c.image}-640.webp 640w, ${c.image}.webp 1122w`}
                      sizes="(max-width: 760px) 70vw, 20vw"
                      width={640}
                      height={800}
                      alt={c.alt ?? ""}
                      loading="lazy"
                    />
                  </span>
                ) : (
                  <span className={styles.textFill}>
                    <LogoMark size={56} />
                    <span className={styles.textNote}>Полный список категорий и брендов — при оформлении заявки</span>
                  </span>
                )}
                <span className={styles.name}>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
