import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap nf">
      <p className="d nf__n" aria-hidden="true">404</p>
      <h1 className="d d-l">Такой страницы нет</h1>
      <p className="lead">Возможно, ссылка устарела. Каталог и проверка на месте.</p>
      <div className="nf__act">
        <Link className="btn btn--lg" href="/">На главную</Link>
        <Link className="btn btn--lg btn--ghost" href="/catalog/">Каталог проверок</Link>
      </div>
    </div>
  );
}
