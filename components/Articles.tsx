import { ARTICLES, LINKS, legitImage } from "@/lib/data";
import { RemoteImage } from "./RemoteImage";
import styles from "./Articles.module.css";

export function Articles() {
  return (
    <section className={styles.section} id="articles" aria-labelledby="articles-title">
      <div className="container">
        <div className={styles.head} data-reveal>
          <h2 id="articles-title" className="display">
            Статьи
          </h2>
          <a className="text-link" href={LINKS.articles} target="_blank" rel="noopener noreferrer">
            Все статьи
          </a>
        </div>

        <ul className={styles.grid}>
          {ARTICLES.map((a, i) => (
            <li key={a.slug} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <a
                className={styles.card}
                href={`${LINKS.site}articles/${a.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.cover}>
                  <RemoteImage src={legitImage(a.imageKey, 1080)} alt="" />
                  <span className={styles.brand}>{a.brand}</span>
                </span>
                <span className={styles.meta}>{a.date}</span>
                <span className={styles.title}>{a.title}</span>
                <span className={styles.lead}>{a.lead}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
