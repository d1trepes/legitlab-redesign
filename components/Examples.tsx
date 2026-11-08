"use client";

import { CATALOG, LINKS, legitImage, type CatalogItem } from "@/lib/data";
import { useDemo } from "./DemoProvider";
import { RemoteImage } from "./RemoteImage";
import styles from "./Examples.module.css";

function CatalogPhoto({ item, width = 640 }: { item: CatalogItem; width?: 384 | 640 }) {
  return (
    <RemoteImage
      src={legitImage(item.imageKey, width)}
      alt={`${item.brand}, ${item.category.toLowerCase()} — фото из публичной проверки`}
    />
  );
}

export function Examples() {
  const { openItem } = useDemo();
  const inset = CATALOG[0];

  return (
    <section className={styles.section} id="examples" aria-labelledby="examples-title">
      <div className="container">
        <div className={styles.split}>
          <div className={`${styles.hero} frame`} data-reveal>
            <img
              src="/img/catalog-man-640.webp"
              srcSet="/img/catalog-man-640.webp 640w, /img/catalog-man.webp 1122w"
              sizes="(max-width: 900px) 100vw, 46vw"
              width={1122}
              height={1402}
              alt="Мужчина распахивает джинсовую куртку и рассматривает бирки"
              loading="lazy"
            />
          </div>

          <div className={styles.intro} data-reveal>
            <h2 id="examples-title" className={`display ${styles.title}`}>
              Примеры
              <br />
              проверок
            </h2>
            <button className={styles.inset} onClick={() => openItem(inset)} aria-label={`${inset.brand}: ${inset.verdict}`}>
              <CatalogPhoto item={inset} width={384} />
            </button>
            <p className={styles.lead}>
              Настоящие проверки из истории LEGIT LAB: вещь, категория и итог эксперта. Комментарии и полные
              заключения видит только владелец проверки.
            </p>
            <a className="btn" href={LINKS.history} target="_blank" rel="noopener noreferrer">
              Вся история проверок
            </a>
          </div>
        </div>

        <ul className={styles.grid}>
          {CATALOG.map((item, i) => (
            <li key={item.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              <button className={styles.card} onClick={() => openItem(item)}>
                <span className={styles.photo}>
                  <CatalogPhoto item={item} />
                  <span className={item.verdict === "Оригинал" ? styles.on : styles.off}>{item.verdict}</span>
                </span>
                <span className={styles.row}>
                  <span className={styles.brand}>{item.brand}</span>
                  <span className={styles.id}>#{item.id}</span>
                </span>
                <span className={styles.category}>{item.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
