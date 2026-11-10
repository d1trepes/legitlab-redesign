import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Inspect } from "@/components/home/Inspect";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { CheckCard } from "@/components/CheckCard";
import { ARTICLES, CHECKS, checkById } from "@/lib/content";
import { CATEGORIES } from "@/lib/slots";
import { PRICE_GROUPS, RATE_IS_DEMO, byn, checks, fmtDate } from "@/lib/site";
import type { ImageName } from "@/lib/images.gen";

const SHOWCASE = ["AXNH7B", "EJW8RV", "817FVB", "W47H8W", "N59BDU"].map((id) => checkById(id)!);

const VERDICTS = [
  { title: "Оригинал", text: "Детали совпадают с оригинальным изделием. В кабинете появится заключение и сертификат с QR-кодом." },
  { title: "Реплика", text: "Найдены расхождения с оригиналом. Эксперт перечислит, какие именно признаки не сошлись." },
  { title: "Нужны доп. фото", text: "Каких-то деталей не видно. Эксперт напишет, что доснять. Таких раундов может быть до трёх, доплачивать не нужно." },
  { title: "Невозможно определить", text: "Редкий случай: вещь слишком изношена или ключевых деталей нет. Мы скажем об этом прямо, а не будем гадать." },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="what night sheet" aria-labelledby="what-h">
        <div className="wrap">
          <div className="what__head">
            <h2 id="what-h" className="d d-xl">Что мы проверяем</h2>
            <p className="lead">Выбери категорию — мастер заявки сразу покажет, какие кадры нужны эксперту.</p>
          </div>
          <ul className="what__grid">
            {CATEGORIES.map((c, i) => (
              <Reveal as="li" key={c.id} delay={(i % 3) * 80}>
                <Link href={`/new/?category=${c.id}`} className="cat">
                  <Pic name={c.image} alt="" sizes={i < 2 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 33vw, 100vw"} />
                  <span className="cat__title d d-l">{c.title}</span>
                  <span className="cat__meta">
                    <span>{c.items}</span>
                    <span className="num">{c.slots.length} фото</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section show" aria-labelledby="show-h">
        <div className="wrap">
          <div className="show__head">
            <h2 id="show-h" className="d d-xl">Настоящие проверки</h2>
            <div>
              <p className="lead">Это вещи, которые люди прислали нам на проверку. Фото сняты на телефон — такими же будут и твои.</p>
              <Link className="btn btn--ghost" href="/catalog/">Весь каталог: {checks(CHECKS.length)}</Link>
            </div>
          </div>
          <ul className="show__row">
            {SHOWCASE.map((c, i) => (
              <Reveal as="li" key={c.id} delay={i * 70}>
                <CheckCard check={c} sizes="(min-width: 900px) 25vw, 50vw" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section how" aria-labelledby="how-h">
        <div className="wrap">
          <h2 id="how-h" className="d d-xl">Куда смотрит эксперт</h2>
          <Inspect />
          <ol className="how__steps">
            <li><span className="d d-l num">1</span><h3>Снимаешь вещь</h3><p>Шесть-семь кадров по списку: общий вид, бирки, швы, фурнитура. Для каждого есть подсказка и пример.</p></li>
            <li><span className="d d-l num">2</span><h3>Эксперт сравнивает</h3><p>Человек, а не алгоритм, сверяет детали с оригинальным изделием. Если чего-то не видно — попросит доснять.</p></li>
            <li><span className="d d-l num">3</span><h3>Получаешь итог</h3><p>Оригинал или реплика, с заключением и сертификатом в кабинете.</p></li>
          </ol>
          <div className="how__limits">
            <p className="d d-m">Честно про ограничения</p>
            <div className="prose">
              <p>Мы оцениваем вещь по фотографиям. Этого хватает для большинства случаев, но запах, вес и тактильные признаки по фото не проверить. Если снимков недостаточно для уверенного вывода, эксперт так и напишет.</p>
              <p><Link href="/how-it-works/">Как проходит проверка и какие фото нужны</Link></p>
            </div>
          </div>
        </div>
      </section>

      <section className="section results" aria-labelledby="res-h">
        <div className="wrap">
          <h2 id="res-h" className="d d-xl">Что ты получишь</h2>
          <dl className="results__list rows">
            {VERDICTS.map((v) => (
              <Reveal key={v.title} className="results__row">
                <dt className="d d-l">{v.title}</dt>
                <dd>{v.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section price night" aria-labelledby="price-h">
        <div className="wrap">
          <div className="price__head">
            <h2 id="price-h" className="d d-xl">Бренды и цены</h2>
            <p className="lead">Проверка оплачивается кредитами. Цена зависит только от бренда.</p>
          </div>
          <div className="price__groups">
            {PRICE_GROUPS.map((g) => (
              <div key={g.credits} className="price__group">
                <p className="price__sum"><span className="d d-xl num">{g.credits}</span><span>кредитов за проверку<br />{byn(g.credits)}{RATE_IS_DEMO ? ", демо-курс" : ""}</span></p>
                <ul className="d d-m">{g.brands.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
          <Link className="btn btn--ghost" href="/pricing/">Все цены и пакеты кредитов</Link>
        </div>
      </section>

      <section className="section arts" aria-labelledby="arts-h">
        <div className="wrap">
          <div className="arts__head">
            <h2 id="arts-h" className="d d-xl">Статьи</h2>
            <Link className="textbtn" href="/articles/">Все материалы</Link>
          </div>
          <ul className="arts__list rows">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}/`} className="art">
                  <Pic name={`article-${a.slug}` as ImageName} alt="" sizes="(min-width: 900px) 14vw, 30vw" ratio="4 / 5" />
                  <span className="art__title d d-l">{a.title}</span>
                  <span className="art__lead">{a.lead}</span>
                  <time dateTime={a.date} className="art__date">{fmtDate(a.date)}</time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta" aria-labelledby="cta-h">
        <div className="wrap cta__in">
          <div className="cta__text">
            <h2 id="cta-h" className="d d-xl">Сомневаешься в вещи? Проверь её до покупки</h2>
            <Link className="btn btn--lg" href="/new/">Начать проверку</Link>
          </div>
          <Pic name="hero-doubt" alt="Парень рассматривает бирки на пуховике" sizes="(min-width: 900px) 50vw, 100vw" className="cta__pic" />
        </div>
      </section>
    </>
  );
}
