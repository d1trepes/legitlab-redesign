"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { OrderBadge, Verdict } from "@/components/Verdict";
import { AccountShell, Loading, PhotoThumb, QR } from "./parts";
import { useAuth, useQuery } from "./hooks";
import { categoryById } from "@/lib/slots";
import { MAX_ROUNDS } from "@/lib/rules";
import { SITE_URL, credits, fmtDate, fmtDateTime } from "@/lib/site";
import { preparePhoto, putPhoto } from "@/lib/photos";
import { randomHex } from "@/lib/security";
import {
  RESULT_TITLE, STATUS_TITLE, balanceOf, ordersOf, sendExtraPhotos, simulateExpert, useAppState,
  type ExpertAction, type Order, type Photo,
} from "@/lib/store";

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "open", label: "В процессе" },
  { id: "done", label: "Проверено" },
];

export function Orders() {
  const { state, user } = useAuth();
  const [filter, setFilter] = useState("all");
  if (!state || !user) return <Loading />;
  const all = ordersOf(state, user.id);
  const list = all.filter((o) => filter === "all" || (filter === "done" ? o.status === "done" : o.status !== "done"));
  return (
    <AccountShell title="Заявки" balance={balanceOf(state, user.id)} aside={<Link className="btn" href="/new/">Новая заявка</Link>}>
      {all.length === 0 ? (
        <div className="empty">
          <p className="d d-l">Заявок пока нет</p>
          <p className="muted">Выбери вещь, сними её по списку ракурсов — и первая заявка появится здесь.</p>
          <Link className="btn btn--lg" href="/new/">Начать проверку</Link>
        </div>
      ) : (
        <>
          <div className="tabs" role="group" aria-label="Фильтр заявок">
            {FILTERS.map((f) => <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>)}
          </div>
          {list.length === 0 ? <p className="muted empty">В этом разделе пусто.</p> : (
            <ul className="orders rows">
              {list.map((o) => (
                <li key={o.id}>
                  <Link href={`/orders/view/?id=${o.id}`} className="order">
                    <PhotoThumb photo={o.photos[0]} sizes="96px" />
                    <span className="order__main"><span className="d d-m">{o.brand}</span><span className="small muted">{categoryById(o.category)?.title} · {fmtDate(o.createdAt)} · {o.id}</span></span>
                    <OrderBadge order={o} />
                    <span className="order__price num">{credits(o.price - o.discount)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AccountShell>
  );
}

const FLOW: Order["status"][] = ["pending", "in_work", "done"];

function Timeline({ order }: { order: Order }) {
  const future = order.status === "done" ? [] : FLOW.slice(FLOW.indexOf(order.status === "need_photos" ? "in_work" : order.status) + 1);
  return (
    <ol className="tl">
      {order.timeline.map((t, i) => (
        <li key={i} className={i === order.timeline.length - 1 ? "is-now" : "is-past"}>
          <b>{t.status === "done" && order.result ? `${STATUS_TITLE.done}: ${RESULT_TITLE[order.result].toLowerCase()}` : STATUS_TITLE[t.status]}</b>
          <time dateTime={t.at}>{fmtDateTime(t.at)}</time>
        </li>
      ))}
      {future.map((s) => <li key={s} className="is-next"><b>{STATUS_TITLE[s]}</b><span>впереди</span></li>)}
    </ol>
  );
}

function ExtraUpload({ order }: { order: Order }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function add(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    setError("");
    const next = [...photos];
    for (const f of Array.from(files).slice(0, 5 - next.length)) {
      const r = await preparePhoto(f);
      if (!r.ok) {
        setError(r.error);
        continue;
      }
      const id = randomHex(8);
      await putPhoto(id, r.blob);
      next.push({ slot: `extra-${id}`, title: `Досъёмка, раунд ${order.rounds}`, photoId: id });
    }
    setPhotos(next);
    setBusy(false);
    if (input.current) input.current.value = "";
  }
  return (
    <section className="ask" aria-labelledby="ask-h">
      <h2 id="ask-h" className="d d-l">Эксперт просит доснять</h2>
      <p className="lead">{order.request}</p>
      <p className="small muted">Пример запроса. Раунд {order.rounds} из {MAX_ROUNDS}, доплата не нужна.</p>
      {photos.length > 0 && <ul className="photos">{photos.map((p) => <li key={p.slot}><PhotoThumb photo={p} /></li>)}</ul>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="ask__act">
        <input ref={input} id="extra" className="vh" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => void add(e.target.files)} />
        <label htmlFor="extra" className="btn btn--ghost" aria-busy={busy}>{busy ? "Проверяем фото" : photos.length ? "Добавить ещё" : "Выбрать фото"}</label>
        <button type="button" className="btn" disabled={!photos.length} onClick={() => sendExtraPhotos(order.id, photos)}>Отправить эксперту</button>
      </div>
    </section>
  );
}

function Certificate({ order }: { order: Order }) {
  const url = `${SITE_URL}/verify/?id=${order.id}`;
  return (
    <section className="cert" aria-labelledby="cert-h">
      <div className="cert__paper">
        <header><span className="d d-m">LEGIT LAB</span><span>Сертификат проверки</span></header>
        <p className="d cert__verdict">{RESULT_TITLE[order.result!]}</p>
        <dl>
          <div><dt>Бренд</dt><dd>{order.brand}</dd></div>
          <div><dt>Категория</dt><dd>{categoryById(order.category)?.title}</dd></div>
          <div><dt>Номер</dt><dd className="num">{order.id}</dd></div>
          <div><dt>Дата</dt><dd>{fmtDate(order.timeline[order.timeline.length - 1].at)}</dd></div>
        </dl>
        <footer><QR text={url} /><p>Наведи камеру, чтобы сверить сертификат с записью сервиса. Итог — мнение эксперта по фотографиям.</p></footer>
      </div>
      <div className="cert__side">
        <h2 id="cert-h" className="d d-l">Сертификат</h2>
        <p className="muted">Его можно показать покупателю или продавцу: по QR-коду открывается страница сверки.</p>
        <p className="note">Пример сертификата. В демо запись хранится только в этом браузере, поэтому на другом устройстве страница сверки её не найдёт.</p>
        <button type="button" className="btn btn--ghost" onClick={() => window.print()}>Распечатать или сохранить PDF</button>
      </div>
    </section>
  );
}

function ExpertPanel({ order }: { order: Order }) {
  const options: { id: ExpertAction; label: string }[] = [
    ...(order.status === "pending" ? [{ id: "take" as const, label: "Взять в работу" }] : []),
    ...(order.rounds < MAX_ROUNDS && order.status !== "need_photos" ? [{ id: "ask" as const, label: "Запросить доп. фото" }] : []),
    ...(order.status !== "need_photos" ? [
      { id: "original" as const, label: "Итог: оригинал" }, { id: "replica" as const, label: "Итог: реплика" }, { id: "unknown" as const, label: "Итог: невозможно определить" },
    ] : []),
  ];
  const [action, setAction] = useState<ExpertAction>(options[0]?.id ?? "take");
  const valid = options.some((o) => o.id === action) ? action : options[0]?.id;
  if (order.status === "done") return null;
  return (
    <aside className="expert" aria-labelledby="exp-h">
      <h2 id="exp-h">Демо: ответ эксперта</h2>
      <p className="small">В жизни статус меняет эксперт. Здесь это делаешь ты, чтобы увидеть весь путь заявки.</p>
      {options.length ? (
        <div className="expert__act">
          <select className="input input--box" aria-label="Действие эксперта" value={valid} onChange={(e) => setAction(e.target.value as ExpertAction)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <button type="button" className="btn" onClick={() => valid && simulateExpert(order.id, valid)}>Симулировать ответ эксперта</button>
        </div>
      ) : <p className="small">Сейчас ход за тобой: отправь досъёмку выше.</p>}
    </aside>
  );
}

export function OrderView() {
  const { state, user } = useAuth();
  const q = useQuery();
  if (!state || !user || !q) return <Loading />;
  const order = state.orders.find((o) => o.id === q.get("id") && o.userId === user.id);
  if (!order) {
    return (
      <AccountShell title="Заявка не найдена" balance={balanceOf(state, user.id)}>
        <div className="empty"><p className="muted">Такой заявки в этом аккаунте нет. Возможно, она была в другом браузере или демо сбросили.</p><Link className="btn" href="/orders/">Все заявки</Link></div>
      </AccountShell>
    );
  }
  const cat = categoryById(order.category);
  return (
    <AccountShell title={order.brand} balance={balanceOf(state, user.id)} aside={<OrderBadge order={order} large />}>
      <div className="ov">
        <div className="ov__main">
          {order.status === "need_photos" && <ExtraUpload order={order} />}
          {order.status === "done" && order.result && (
            <section className="res" aria-labelledby="res-h">
              <h2 id="res-h" className="d d-xl">{RESULT_TITLE[order.result]}</h2>
              <p className="lead">{order.conclusion}</p>
              <p className="note">Пример заключения. Настоящие тексты экспертов в демо не показываются.</p>
            </section>
          )}
          {order.status === "done" && order.result && order.result !== "unknown" && <Certificate order={order} />}
          <section aria-labelledby="ph-h">
            <h2 id="ph-h" className="d d-l">Фото</h2>
            <ul className="photos">
              {[...order.photos, ...order.extra].map((p, i) => <li key={p.slot + i}><PhotoThumb photo={p} sizes="200px" /><span className="small muted">{p.title}</span></li>)}
            </ul>
            {order.photos.some((p) => p.demo) && <p className="small muted">В демо-аккаунте вместо настоящих фото стоят иллюстрации.</p>}
          </section>
        </div>
        <div className="ov__side">
          <h2 className="d d-m">Статус</h2>
          <Timeline order={order} />
          <dl className="kv rows">
            <div><dt>Номер</dt><dd className="num">{order.id}</dd></div>
            <div><dt>Категория</dt><dd>{cat?.title}</dd></div>
            <div><dt>Срочность</dt><dd>{order.urgency === "fast" ? "Срочная" : "Стандартная"}</dd></div>
            <div><dt>Списано</dt><dd className="num">{credits(order.price - order.discount)}</dd></div>
            {order.rounds > 0 && <div><dt>Досъёмка</dt><dd>{order.rounds} из {MAX_ROUNDS}</dd></div>}
          </dl>
          <ExpertPanel order={order} />
          <Link className="textbtn" href="/orders/">Все заявки</Link>
        </div>
      </div>
    </AccountShell>
  );
}

/** Сверка сертификата по QR. */
export function VerifyView({ catalogIds }: { catalogIds: string[] }) {
  const state = useAppState();
  const q = useQuery();
  if (!q || !state) return <div className="wrap acc acc--loading"><p className="muted">Ищем запись</p></div>;
  const id = (q.get("id") ?? "").toUpperCase();
  const order = state.orders.find((o) => o.id === id && o.status === "done" && o.result);
  return (
    <div className="wrap nf">
      <h1 className="d d-xl">Сверка сертификата</h1>
      {catalogIds.includes(id) ? (
        <><p className="lead">Запись {id} есть в каталоге проверок.</p><Link className="btn btn--lg" href={`/catalog/${id}/`}>Открыть отчёт</Link></>
      ) : order ? (
        <>
          <Verdict value={RESULT_TITLE[order.result!]} large />
          <p className="lead">Запись {id} найдена: {order.brand}, {categoryById(order.category)?.title.toLowerCase()}. Проверено {fmtDate(order.timeline[order.timeline.length - 1].at)}.</p>
          <p className="note">Демо: запись лежит в этом браузере.</p>
        </>
      ) : (
        <>
          <p className="lead">{id ? `Записи ${id} здесь нет.` : "В ссылке нет номера сертификата."}</p>
          <p className="note">Демо: сертификаты хранятся только в браузере владельца, поэтому на другом устройстве запись не находится. В рабочей версии сверка идёт по базе сервиса.</p>
          <Link className="btn btn--lg btn--ghost" href="/catalog/">Каталог проверок</Link>
        </>
      )}
    </div>
  );
}
