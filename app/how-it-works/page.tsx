import type { Metadata } from "next";
import Link from "next/link";
import { Pic } from "@/components/Pic";
import { CATEGORIES } from "@/lib/slots";
import { BRANDS, LINKS, MAX_PRICE, MIN_PRICE } from "@/lib/site";
import { MAX_ROUNDS } from "@/lib/rules";

export const metadata: Metadata = {
  title: "Как проходит проверка",
  description: "Какие фото нужны, что смотрит эксперт, как снимать и где пределы оценки по фото.",
};

const STEPS = [
  { t: "Выбираешь вещь", d: "Категория и бренд. От бренда зависит цена, от категории — список кадров." },
  { t: "Снимаешь по списку", d: "Шесть-семь ракурсов. К каждому есть подсказка и пример кадра. Фото можно заменить до отправки." },
  { t: "Эксперт изучает детали", d: "Сверяет бирки, шрифты, швы, фурнитуру и маркировку с оригинальным изделием. Если чего-то не видно — попросит доснять." },
  { t: "Получаешь итог", d: "Оригинал, реплика или честное «невозможно определить». Заключение и сертификат лежат в кабинете." },
];
const SHOOT = [
  ["Дневной свет", "Сними у окна. Вспышка даёт блики на бирках и съедает фактуру ткани."],
  ["Резкость", "Дождись фокуса. Если текст на бирке не читается на твоём экране, эксперт его тоже не прочтёт."],
  ["Прямой угол", "Камера параллельно детали. Наклон искажает пропорции букв и логотипов."],
  ["Ровный фон", "Стол, пол или покрывало одного цвета. Вещь расправь."],
  ["Целиком и крупно", "Сначала вся деталь в кадре, потом самое важное крупным планом."],
  ["Без фильтров", "Не обрабатывай фото и не обрезай края: цвет и края кадра тоже важны."],
];
const FAQ = [
  ["Сколько стоит проверка?", `${MIN_PRICE} или ${MAX_PRICE} кредитов — зависит от бренда. ${MIN_PRICE}: ${BRANDS.filter((b) => b.credits === MIN_PRICE).map((b) => b.brand).join(", ")}. ${MAX_PRICE}: ${BRANDS.filter((b) => b.credits === MAX_PRICE).map((b) => b.brand).join(", ")}. Кредиты покупаются пакетами в белорусских рублях.`],
  ["Сколько ждать ответа?", "Статус заявки всегда виден в кабинете: «В ожидании», «В работе», «Проверено». Точные сроки стандартной и срочной проверки появятся здесь, когда их утвердят, — придумывать цифры мы не будем."],
  ["Что, если фото окажется мало?", `Эксперт напишет, что именно доснять, и заявка получит статус «Нужны доп. фото». Таких раундов может быть до ${MAX_ROUNDS}, доплачивать за них не нужно.`],
  ["Это гарантия подлинности?", "Нет. Это мнение эксперта по фотографиям. Оно основано на деталях, которые видно на снимках, и не заменяет экспертизу самой вещи."],
  ["Кто увидит мои фото?", "В каталог попадают бренд, категория, итог, дата и фото вещи. Заключение эксперта и сертификат видишь только ты. С фото при загрузке удаляются геометки и данные о телефоне."],
  ["Можно проверить вещь в Telegram?", "Да, у нас есть бот с мини-приложением. Это отдельный продукт: сайт туда не перенаправляет, пользуйся тем, что удобнее."],
  ["Моего бренда нет в списке цен", "Отправить заявку всё равно можно: выбери «Другой бренд» и напиши название. Цена для брендов вне списка ещё не утверждена, в демо она считается по верхней ставке."],
];

export default function HowItWorks() {
  return (
    <>
      <div className="wrap">
        <header className="pagehead pagehead--split">
          <h1 className="d d-xxl">Как проходит проверка</h1>
          <p className="lead">Ты снимаешь вещь на телефон, эксперт изучает детали и отвечает, оригинал это или реплика. Ниже — всё, что стоит знать до заявки.</p>
        </header>
        <ol className="steps rows">
          {STEPS.map((s, i) => (
            <li key={s.t}><span className="d d-xl num">{i + 1}</span><h2 className="d d-l">{s.t}</h2><p>{s.d}</p></li>
          ))}
        </ol>
      </div>

      <section className="section night" aria-labelledby="slots-h">
        <div className="wrap">
          <div className="pagehead--split" style={{ marginBottom: 40 }}>
            <h2 id="slots-h" className="d d-xl">Какие фото нужны</h2>
            <p className="lead">Список кадров зависит от категории. Необязательные кадры помогают, но без них заявку тоже примут.</p>
          </div>
          <div className="slotlist rows">
            {CATEGORIES.map((c, i) => (
              <details key={c.id} open={i === 0}>
                <summary><span className="d d-l">{c.title}</span><span className="num">{c.slots.length} фото</span></summary>
                <div className="slotlist__body">
                  <Pic name={c.image} alt="" sizes="(min-width: 900px) 20vw, 60vw" />
                  <ol>
                    {c.slots.map((s) => (
                      <li key={s.id}><b>{s.title}</b><span>{s.hint}{s.required ? "" : " Необязательно."}</span></li>
                    ))}
                  </ol>
                  <Link className="btn btn--ghost" href={`/new/?category=${c.id}`}>Проверить: {c.title.toLowerCase()}</Link>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="shoot-h">
        <div className="wrap split">
          <div>
            <h2 id="shoot-h" className="d d-xl">Как снять</h2>
            <Pic name="ring-hands-tags" alt="Руки держат навесную бирку крупным планом" sizes="(min-width: 900px) 30vw, 100vw" className="shoot__pic" />
          </div>
          <dl className="shoot rows">
            {SHOOT.map(([t, d]) => <div key={t}><dt className="d d-m">{t}</dt><dd>{d}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section limits" aria-labelledby="lim-h">
        <div className="wrap split">
          <h2 id="lim-h" className="d d-xl">Пределы оценки по фото</h2>
          <div className="prose lead">
            <p>По снимкам видно многое: шрифты, строчку, фурнитуру, маркировку, пропорции. Но вес вещи, запах материала и то, как она ощущается в руках, фотография не передаёт.</p>
            <p>Поэтому итог — это мнение эксперта по присланным кадрам, а не юридическое заключение. Если снимков мало, эксперт попросит доснять. Если уверенного вывода сделать нельзя, он так и напишет: «невозможно определить».</p>
            <p>Мы не обещаем стопроцентную точность и не называем сроки, которых ещё не утвердили.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-h">
        <div className="wrap split">
          <h2 id="faq-h" className="d d-xl">Вопросы</h2>
          <div className="faq rows">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
            <p className="faq__more">Не нашёл ответ — напиши в <a className="link" href={LINKS.telegramBot} target="_blank" rel="noopener noreferrer">Telegram-бот</a>.</p>
          </div>
        </div>
      </section>

      <section className="cta cta--plain">
        <div className="wrap cta__text">
          <h2 className="d d-xl">Готов? Начни с первого кадра</h2>
          <Link className="btn btn--lg" href="/new/">Начать проверку</Link>
        </div>
      </section>
    </>
  );
}
