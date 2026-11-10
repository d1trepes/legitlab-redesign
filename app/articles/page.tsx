import type { Metadata } from "next";
import Link from "next/link";
import { Pic } from "@/components/Pic";
import { ARTICLES } from "@/lib/content";
import { fmtDate } from "@/lib/site";
import type { ImageName } from "@/lib/images.gen";

export const metadata: Metadata = { title: "Статьи", description: "Разборы: как отличить оригинал от подделки по биркам, швам и фурнитуре." };

export default function Articles() {
  return (
    <div className="wrap">
      <header className="pagehead pagehead--split">
        <h1 className="d d-xxl">Статьи</h1>
        <p className="lead">Разборы конкретных вещей: на что смотреть самому, пока не отправил фото эксперту.</p>
      </header>
      <ul className="artgrid">
        {ARTICLES.map((a, i) => (
          <li key={a.slug}>
            <Link href={`/articles/${a.slug}/`} className="artcard">
              <Pic name={`article-${a.slug}` as ImageName} alt="" sizes="(min-width: 900px) 30vw, 100vw" ratio="4 / 5" priority={i === 0} />
              <span className="d d-l">{a.title}</span>
              <span className="muted">{a.lead}</span>
              <time dateTime={a.date} className="small muted">{fmtDate(a.date)}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
