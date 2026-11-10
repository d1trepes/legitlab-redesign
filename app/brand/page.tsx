import type { Metadata } from "next";
import { Lockup, Mark, Wordmark } from "@/components/Logo";
import { BRAND } from "@/lib/brand.gen";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Логотип", description: "Доработка lockup LEGIT LAB: знак, вордмарк, версии." };

export default function BrandPage() {
  const m = BRAND.mark;
  const shift = ((BRAND.optical.shift / m.w) * 100).toFixed(1);
  return (
    <div className="wrap brand">
      <header className="pagehead pagehead--split">
        <h1 className="d d-xxl">Логотип</h1>
        <p className="lead">Знак остался прежним. Изменилось то, как рядом с ним стоит название: теперь оно под знаком и выровнено по оптическому центру.</p>
      </header>

      <section className="brand__cmp" aria-label="Сравнение">
        <figure>
          <div className="brand__box">
            <div className="brand__old">
              <svg viewBox="64 58 408 408" height="72" aria-hidden="true" fill="currentColor"><polygon points="178,76 289,76 219,344 427,344 390,442 100,442" /><polygon points="324,76 430,76 390,203 268,258" /></svg>
              <span>LEGIT LAB</span>
            </div>
          </div>
          <figcaption><b>Было.</b> Надпись сбоку и на глаз: знак висит в пустом поле своего квадрата, базовая линия букв не привязана ни к низу знака, ни к его середине, пара разваливается.</figcaption>
        </figure>
        <figure>
          <div className="brand__box"><Lockup height={200} /></div>
          <figcaption><b>Стало.</b> Знак обрезан по реальным границам. Вордмарк набран Alumni Sans 800 в кривых, стоит под знаком; отступ равен 0,73 высоты букв. Знак сдвинут на {shift} % ширины, чтобы уравновесить тяжёлый левый низ.</figcaption>
        </figure>
      </section>

      <section className="section section--tight" aria-labelledby="ver-h">
        <h2 id="ver-h" className="d d-xl">Версии</h2>
        <div className="brand__ver">
          <figure><div className="brand__box"><Lockup height={40} /></div><figcaption>Шапка: 40 px</figcaption></figure>
          <figure><div className="brand__box night"><Lockup height={104} /></div><figcaption>Футер: 104 px, на тёмном</figcaption></figure>
          <figure><div className="brand__box"><img src={asset("/icon-192.png")} alt="Иконка сайта" width={96} height={96} /><img src={asset("/icon-192.png")} alt="" width={32} height={32} /><img src={asset("/icon-192.png")} alt="" width={16} height={16} /></div><figcaption>Иконка: знак на чёрном поле, 96 / 32 / 16 px</figcaption></figure>
          <figure><div className="brand__box"><Mark height={96} /></div><figcaption>Знак отдельно: там, где название уже есть рядом</figcaption></figure>
        </div>
        <figure className="brand__line"><div className="brand__box night"><Wordmark /></div><figcaption>Строчный вордмарк: во всю ширину, для футера и обложек</figcaption></figure>
      </section>

      <section className="section section--tight split" aria-labelledby="rules-h">
        <h2 id="rules-h" className="d d-xl">Правила</h2>
        <dl className="shoot rows">
          <div><dt className="d d-m">Поле</dt><dd>Свободное место вокруг — не меньше высоты букв вордмарка.</dd></div>
          <div><dt className="d d-m">Цвет</dt><dd>Только чёрный на светлом и белый на тёмном. Без контуров, теней и градиентов.</dd></div>
          <div><dt className="d d-m">Размер</dt><dd>Вертикальный lockup — от 36 px по высоте. Меньше — только знак.</dd></div>
          <div><dt className="d d-m">Файлы</dt><dd><a className="link" href={asset("/brand/lockup.svg")} download>lockup.svg</a>, <a className="link" href={asset("/brand/mark.svg")} download>mark.svg</a>, <a className="link" href={asset("/brand/wordmark.svg")} download>wordmark.svg</a></dd></div>
        </dl>
      </section>
    </div>
  );
}
