import type { Metadata } from "next";
import Link from "next/link";
import { CREDIT_TO_BYN, MAX_PRICE, MIN_PRICE, PACKAGES, PRICE_GROUPS, RATE_IS_DEMO, byn, checksFor, credits } from "@/lib/site";

export const metadata: Metadata = {
  title: "Цены и кредиты",
  description: "Проверка стоит 50 или 70 кредитов в зависимости от бренда. Кредиты покупаются пакетами в белорусских рублях.",
};

export default function Pricing() {
  return (
    <>
      <div className="wrap">
        <header className="pagehead pagehead--split">
          <h1 className="d d-xxl">Цены</h1>
          <p className="lead">Одна проверка — одна вещь. Цена зависит только от бренда: {MIN_PRICE} или {MAX_PRICE} кредитов. Досъёмка по просьбе эксперта бесплатна.</p>
        </header>

        <section aria-labelledby="brands-h" className="tariff">
          <h2 id="brands-h" className="vh">Цена по брендам</h2>
          {PRICE_GROUPS.map((g) => (
            <div key={g.credits} className="tariff__row">
              <p className="tariff__price"><span className="d d-xxl num">{g.credits}</span><span>кредитов<br /><b className="num">{byn(g.credits)}</b>{RATE_IS_DEMO ? <><br />демо-курс</> : null}</span></p>
              <ul className="d d-l">{g.brands.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}
          <div className="tariff__row tariff__row--other">
            <p className="tariff__price"><span className="d d-l">Другой бренд</span></p>
            <p className="muted">Заявку можно отправить на любой бренд. Цена для брендов вне списка ещё не утверждена — в демо она считается по верхней ставке, {credits(MAX_PRICE)}.</p>
          </div>
        </section>
      </div>

      <section className="section night" aria-labelledby="credits-h">
        <div className="wrap split">
          <h2 id="credits-h" className="d d-xl">Что такое кредиты</h2>
          <div className="prose lead">
            <p>Кредиты — внутренняя единица сервиса. Ты покупаешь пакет за белорусские рубли, а проверки оплачиваешь кредитами с баланса.</p>
            <p>Так не нужно доставать карту ради каждой вещи, а в больших пакетах часть кредитов идёт бонусом.</p>
            <p className="small muted">
              1 кредит = {CREDIT_TO_BYN.toLocaleString("ru-RU")} BYN.{" "}
              {RATE_IS_DEMO ? "Это демо-курс: настоящий ещё не утверждён, все цены в рублях на сайте посчитаны из него и изменятся." : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="packs-h">
        <div className="wrap">
          <h2 id="packs-h" className="d d-xl">Пакеты</h2>
          <div className="packs rows" role="list">
            {PACKAGES.map((p, i) => {
              const total = p.credits + p.bonus;
              return (
                <div key={p.credits} className="pack" role="listitem">
                  <p className="pack__n"><span className="d d-xl num">{p.credits}</span>{p.bonus ? <span className="d d-m num">+{p.bonus}</span> : null}</p>
                  <p className="pack__info">
                    {p.bonus ? <>На баланс придёт {credits(total)}: {p.bonus} — бонус.</> : <>На баланс придёт {credits(total)}.</>}
                    <br />
                    Хватит на {checksFor(Math.floor(total / MIN_PRICE))} по {MIN_PRICE}{total >= MAX_PRICE ? ` или ${checksFor(Math.floor(total / MAX_PRICE))} по ${MAX_PRICE}` : ""}.
                    {p.tag ? <><br /><b>Берут чаще всего.</b></> : null}
                  </p>
                  <p className="pack__price"><b className="num">{byn(p.credits)}</b>{RATE_IS_DEMO ? <span>демо-курс</span> : null}</p>
                  <Link className={`btn ${p.tag ? "" : "btn--ghost"}`} href={`/wallet/?pack=${i}`}>Выбрать</Link>
                </div>
              );
            })}
          </div>
          <p className="note" style={{ marginTop: 24, maxWidth: "44em" }}>Демо: оплата не настоящая. Кнопка ведёт в кошелёк, где пакет зачисляется без списания денег.</p>
        </div>
      </section>

      <section className="section limits" aria-labelledby="urg-h">
        <div className="wrap split">
          <h2 id="urg-h" className="d d-xl">Срочность</h2>
          <dl className="shoot rows">
            <div><dt className="d d-m">Стандартная</dt><dd>Заявка встаёт в общую очередь.</dd></div>
            <div><dt className="d d-m">Срочная</dt><dd>Заявка поднимается в начало очереди.</dd></div>
            <div><dt className="d d-m">Что ещё не решено</dt><dd>Наценка за срочность и сроки обеих проверок не утверждены. В демо срочность не меняет цену, а цифр по срокам мы не называем.</dd></div>
          </dl>
        </div>
      </section>

      <section className="cta cta--plain">
        <div className="wrap cta__text">
          <h2 className="d d-xl">Первая проверка — от {credits(MIN_PRICE)}</h2>
          <Link className="btn btn--lg" href="/new/">Начать проверку</Link>
        </div>
      </section>
    </>
  );
}
