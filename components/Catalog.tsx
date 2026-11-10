"use client";
import { useEffect, useMemo, useState } from "react";
import { CheckCard } from "./CheckCard";
import { CHECKS } from "@/lib/content";
import { checks } from "@/lib/site";

const uniq = (a: string[]) => [...new Set(a)].sort((x, y) => x.localeCompare(y, "ru"));
const CATS = uniq(CHECKS.map((c) => c.category));
const BRANDS = uniq(CHECKS.map((c) => c.brand));
const SORTS = [
  { id: "new", label: "Сначала новые" },
  { id: "brand", label: "Бренд, А–Я" },
  { id: "original", label: "Сначала оригиналы" },
  { id: "replica", label: "Сначала реплики" },
];
type Filters = { q: string; cat: string; brand: string; verdict: string; sort: string };
const EMPTY: Filters = { q: "", cat: "", brand: "", verdict: "", sort: "new" };

export function Catalog() {
  const [f, setF] = useState<Filters>(EMPTY);
  const [ready, setReady] = useState(false);

  // фильтры живут в адресе: ссылкой на выборку можно поделиться
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setF({ q: p.get("q") ?? "", cat: p.get("cat") ?? "", brand: p.get("brand") ?? "", verdict: p.get("verdict") ?? "", sort: p.get("sort") ?? "new" });
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    (Object.keys(f) as (keyof Filters)[]).forEach((k) => f[k] && f[k] !== EMPTY[k] && p.set(k, f[k]));
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }, [f, ready]);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const r = CHECKS.filter(
      (c) =>
        (!q || `${c.brand} ${c.category} ${c.id} ${c.verdict}`.toLowerCase().includes(q)) &&
        (!f.cat || c.category === f.cat) && (!f.brand || c.brand === f.brand) && (!f.verdict || c.verdict === f.verdict),
    );
    if (f.sort === "brand") r.sort((a, b) => a.brand.localeCompare(b.brand));
    if (f.sort === "original") r.sort((a, b) => Number(b.verdict === "Оригинал") - Number(a.verdict === "Оригинал"));
    if (f.sort === "replica") r.sort((a, b) => Number(b.verdict === "Реплика") - Number(a.verdict === "Реплика"));
    return r;
  }, [f]);

  const set = (patch: Partial<Filters>) => setF((p) => ({ ...p, ...patch }));
  const dirty = f.q || f.cat || f.brand || f.verdict;

  return (
    <>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="field filters__q">
          <span>Поиск</span>
          <input className="input" type="search" placeholder="Бренд, категория или номер" value={f.q} onChange={(e) => set({ q: e.target.value })} />
        </label>
        <label className="field">
          <span>Категория</span>
          <select className="input" value={f.cat} onChange={(e) => set({ cat: e.target.value })}>
            <option value="">Все</option>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Бренд</span>
          <select className="input" value={f.brand} onChange={(e) => set({ brand: e.target.value })}>
            <option value="">Все</option>
            {BRANDS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Сортировка</span>
          <select className="input" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <fieldset className="filters__verdict">
          <legend className="vh">Итог</legend>
          {["", "Оригинал", "Реплика"].map((v) => (
            <button key={v} type="button" aria-pressed={f.verdict === v} onClick={() => set({ verdict: v })}>{v || "Все итоги"}</button>
          ))}
        </fieldset>
        <p className="filters__count" aria-live="polite">
          {checks(list.length)}
          {dirty ? <button type="button" className="textbtn" onClick={() => setF({ ...EMPTY, sort: f.sort })}>Сбросить фильтры</button> : null}
        </p>
      </form>

      {list.length ? (
        <ul className="grid">
          {list.map((c, i) => (
            <li key={c.id}><CheckCard check={c} sizes="(min-width: 1100px) 23vw, (min-width: 700px) 31vw, 46vw" priority={i < 4} /></li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p className="d d-l">Ничего не нашлось</p>
          <p className="muted">Таких проверок в каталоге пока нет. Убери часть фильтров или проверь свою вещь — она может стать первой.</p>
          <button type="button" className="btn btn--ghost" onClick={() => setF(EMPTY)}>Показать все проверки</button>
        </div>
      )}
    </>
  );
}
