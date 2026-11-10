import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCard } from "@/components/CheckCard";
import { Pic } from "@/components/Pic";
import { Verdict } from "@/components/Verdict";
import { CHECKS, checkById } from "@/lib/content";
import { credits, priceOf } from "@/lib/site";
import type { ImageName } from "@/lib/images.gen";

export const dynamicParams = false;
export const generateStaticParams = () => CHECKS.map((c) => ({ id: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = checkById((await params).id);
  return c ? { title: `${c.brand}: ${c.verdict.toLowerCase()} — проверка ${c.id}`, description: `Публичный отчёт о проверке ${c.brand}, ${c.category.toLowerCase()}. Итог: ${c.verdict.toLowerCase()}.` } : {};
}

export default async function Report({ params }: { params: Promise<{ id: string }> }) {
  const c = checkById((await params).id);
  if (!c) notFound();
  const more = [...CHECKS.filter((x) => x.id !== c.id && x.brand === c.brand), ...CHECKS.filter((x) => x.id !== c.id && x.brand !== c.brand && x.category === c.category), ...CHECKS.filter((x) => x.id !== c.id)]
    .filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Навигация"><Link href="/catalog/" className="textbtn">Каталог проверок</Link></nav>
      <article className="report">
        <div className="report__photo">
          <Pic name={`check-${c.id}` as ImageName} alt={`${c.brand}, ${c.category.toLowerCase()}: фото из проверки`} sizes="(min-width: 900px) 40vw, 100vw" ratio="4 / 5" priority />
          <p className="small muted">Фото прислал владелец вещи. В публичном отчёте показан один кадр.</p>
        </div>
        <div className="report__body">
          <h1 className="d d-xxl">{c.brand}</h1>
          <Verdict value={c.verdict} large />
          <dl className="kv rows">
            <div><dt>Категория</dt><dd>{c.category}</dd></div>
            <div><dt>Итог</dt><dd>{c.verdict}</dd></div>
            <div><dt>Номер проверки</dt><dd className="num">{c.id}</dd></div>
            <div><dt>Дата</dt><dd className="muted">нет в демо-выгрузке</dd></div>
          </dl>
          <div className="report__owner">
            <h2 className="d d-m">Видит только владелец</h2>
            <p className="muted">Заключение эксперта и сертификат с QR-кодом открываются в кабинете того, кто заказал проверку. В публичном отчёте их нет.</p>
          </div>
          <div className="report__cta">
            <Link className="btn btn--lg" href="/new/">Проверить свою вещь</Link>
            <p className="small muted">Проверка {c.brand} — {credits(priceOf(c.brand))}.</p>
          </div>
        </div>
      </article>
      <section className="section section--tight" aria-labelledby="more-h">
        <h2 id="more-h" className="d d-l">Другие проверки</h2>
        <ul className="grid grid--flat">
          {more.map((m) => <li key={m.id}><CheckCard check={m} sizes="(min-width: 900px) 23vw, 46vw" /></li>)}
        </ul>
      </section>
    </div>
  );
}
