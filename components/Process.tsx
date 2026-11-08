import { CATALOG, legitImage } from "@/lib/data";
import { RemoteImage } from "./RemoteImage";
import styles from "./Process.module.css";

const HOTSPOTS = [
  { x: 42, y: 44, label: "Бирка и маркировка" },
  { x: 78, y: 60, label: "Строчка и швы" },
  { x: 55, y: 90, label: "Навесной ярлык" },
];

export function Process() {
  const sample = CATALOG.find((c) => c.id === "817FVB") ?? CATALOG[0];

  return (
    <section className={styles.section} id="how-it-works" aria-labelledby="process-title">
      <div className="container">
        <div className={styles.head} data-reveal>
          <h2 id="process-title" className="display">
            Как мы
            <br />
            проверяем
          </h2>
          <p className={styles.lead}>
            Проверка идёт по фотографиям. Ты снимаешь вещь по подсказкам, эксперт изучает детали и выносит
            итог.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={`${styles.scene} ${styles.a}`} data-reveal>
            <div className={`${styles.media} ${styles.portrait} frame`}>
              <img
                src="/img/step-photo-640.webp"
                srcSet="/img/step-photo-640.webp 640w, /img/step-photo.webp 1122w"
                sizes="(max-width: 900px) 100vw, 36vw"
                width={1122}
                height={1402}
                alt="Человек фотографирует бирку худи на телефон"
                loading="lazy"
              />
            </div>
            <h3 className={styles.sceneTitle}>Ты снимаешь вещь</h3>
            <p className={styles.text}>
              Выбираешь бренд и категорию, затем делаешь фото по подсказкам: общий вид, бирки, швы,
              фурнитура. Чем чётче снимки, тем увереннее оценка.
            </p>
          </article>

          <article className={`${styles.scene} ${styles.b}`} data-reveal>
            <div className={`${styles.media} ${styles.square} frame`}>
              <img
                src="/img/step-detail-640.webp"
                srcSet="/img/step-detail-640.webp 640w, /img/step-detail.webp 1254w"
                sizes="(max-width: 900px) 100vw, 40vw"
                width={1254}
                height={1254}
                alt="Крупный план бирки и строчки на горловине чёрного худи"
                loading="lazy"
              />
              {HOTSPOTS.map((h) => (
                <button
                  key={h.label}
                  type="button"
                  className={styles.spot}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  aria-label={h.label}
                >
                  <span className={styles.spotLabel}>{h.label}</span>
                </button>
              ))}
            </div>
            <h3 className={styles.sceneTitle}>Эксперт изучает детали</h3>
            <p className={styles.text}>
              Специалист сравнивает видимые признаки: маркировку, материалы, качество пошива и фурнитуру. Если
              снимков не хватает, он может попросить дополнительные.
            </p>
          </article>

          <article className={`${styles.scene} ${styles.c}`} data-reveal>
            <div className={styles.result}>
              <div className={styles.resultPhoto}>
                <RemoteImage src={legitImage(sample.imageKey, 640)} alt={`${sample.brand} — фото из публичной проверки`} />
              </div>
              <dl className={styles.resultData}>
                <div>
                  <dt>Итог</dt>
                  <dd className={styles.resultVerdict}>{sample.verdict}</dd>
                </div>
                <div>
                  <dt>Бренд</dt>
                  <dd>{sample.brand}</dd>
                </div>
                <div>
                  <dt>Категория</dt>
                  <dd>{sample.category}</dd>
                </div>
                <div>
                  <dt>Номер</dt>
                  <dd>#{sample.id}</dd>
                </div>
              </dl>
            </div>
            <h3 className={styles.sceneTitle}>Ты получаешь итог</h3>
            <p className={styles.text}>
              Оригинал, реплика или запрос дополнительных фото. Заключение эксперта видишь только ты.
            </p>
          </article>

          <aside className={`${styles.limits} ${styles.d}`} data-reveal>
            <p className={styles.limitsTitle}>Важно знать</p>
            <p>
              Оценка по фотографиям — это мнение эксперта, а не юридическое заключение. Её точность зависит от
              качества и полноты снимков.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
