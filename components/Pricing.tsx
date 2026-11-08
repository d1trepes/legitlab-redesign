"use client";

import { BRAND_PRICES, PACKAGES } from "@/lib/data";
import { useDemo } from "./DemoProvider";
import styles from "./Pricing.module.css";

export function Pricing() {
  const { openCheck, openLogin } = useDemo();

  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <div className={styles.head} data-reveal>
          <h2 id="pricing-title" className="display">
            Стоимость
          </h2>
          <p className={styles.lead}>
            Проверка оплачивается кредитами. Сколько кредитов спишется, зависит от бренда вещи — сумму видно до
            подтверждения заявки.
          </p>
        </div>

        {/* ATHLETE SHOWCASE counter tiles: one price per brand group. */}
        <div className={styles.prices}>
          {BRAND_PRICES.map((p, i) => (
            <div key={p.credits} className={styles.priceTile} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <p className={styles.priceNumber}>{p.credits}</p>
              <p className={styles.priceUnit}>кредитов за одну проверку</p>
              <p className={styles.priceBrands}>{p.brands.join(" · ")}</p>
            </div>
          ))}
          <div className={styles.ctaTile} data-reveal style={{ transitionDelay: "180ms" }}>
            <p className={styles.ctaText}>Цену для своего бренда увидишь на первом шаге заявки.</p>
            <button className="btn btn--invert" onClick={() => openCheck()}>
              Начать проверку
            </button>
          </div>
        </div>

        <div className={styles.wallet} id="wallet">
          <div className={styles.walletHead} data-reveal>
            <h3 className={styles.walletTitle}>Кошелёк</h3>
            <p className={styles.walletText}>
              Кредиты покупаются пакетами в белорусских рублях. Чем больше пакет, тем больше бонус. Цены в BYN
              появятся вместе с оплатой.
            </p>
          </div>
          <ul className={styles.packages}>
            {PACKAGES.map((p, i) => (
              <li key={p.credits} className={styles.pack} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className={styles.packNumber}>{p.credits}</span>
                <span className={styles.packUnit}>кредитов</span>
                <span className={styles.packBonus}>{p.bonus ? `+${p.bonus} бонусом` : "Без бонуса"}</span>
                <span className={styles.packPrice}>Цена в BYN уточняется</span>
              </li>
            ))}
          </ul>
          <button className={`btn btn--invert-ghost ${styles.walletBtn}`} onClick={openLogin}>
            Открыть кошелёк
          </button>
        </div>
      </div>
    </section>
  );
}
