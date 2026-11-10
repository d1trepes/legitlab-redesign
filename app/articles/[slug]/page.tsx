import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pic } from "@/components/Pic";
import { ARTICLES } from "@/lib/content";
import { credits, fmtDate, priceOf } from "@/lib/site";
import type { ImageName } from "@/lib/images.gen";

export const dynamicParams = false;
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.lead } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Навигация"><Link href="/articles/" className="textbtn">Все статьи</Link></nav>
      <article className="article">
        <header className="article__head">
          <h1 className="d d-xxl">{a.title}</h1>
          <p className="lead">{a.lead}</p>
          <time dateTime={a.date} className="small muted">{fmtDate(a.date)}</time>
        </header>
        <div className="article__grid">
          <Pic name={`article-${a.slug}` as ImageName} alt="" sizes="(min-width: 900px) 30vw, 100vw" ratio="4 / 5" priority className="article__cover" />
          <div className="article__body rows">
            {a.body.map((b) => (
              <section key={b.heading}><h2 className="d d-l">{b.heading}</h2><p>{b.text}</p></section>
            ))}
            <p className="note">
              Это краткий конспект для демо. Полный разбор с примерами —{" "}
              <a className="link" href={a.url} target="_blank" rel="noopener noreferrer">на legit-lab.com</a>.
            </p>
          </div>
        </div>
      </article>
      <section className="cta cta--plain">
        <div className="cta__text">
          <h2 className="d d-xl">Не уверен в своей {a.brand}? Покажи её эксперту</h2>
          <div>
            <Link className="btn btn--lg" href="/new/">Начать проверку</Link>
            <p className="small muted" style={{ marginTop: 12 }}>Проверка {a.brand} — {credits(priceOf(a.brand))}.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
