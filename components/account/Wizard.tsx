"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pic, imgUrl } from "@/components/Pic";
import { Loading } from "./parts";
import { IMAGES } from "@/lib/images.gen";
import { useAuth, usePhotoUrl, useQuery } from "./hooks";
import { CATEGORIES, categoryById, requiredCount, type Category, type Slot } from "@/lib/slots";
import { BRANDS, OTHER_BRAND_PRICE, PROMOS, RATE_IS_DEMO, byn, credits } from "@/lib/site";
import { deletePhoto, preparePhoto, putPhoto } from "@/lib/photos";
import { randomHex } from "@/lib/security";
import { balanceOf, clearDraft, createOrder, draftPrice, saveDraft, type Draft, type Photo } from "@/lib/store";

const STEPS = ["Вещь", "Фото", "Условия", "Подтверждение"];

function SlotCard({ slot, photoId, onFile, onRemove }: { slot: Slot; photoId?: string; onFile: (f: File) => Promise<string | null>; onRemove: () => void }) {
  const url = usePhotoUrl(photoId);
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  async function take(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError((await onFile(file)) ?? "");
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <li
      className={`slot ${photoId ? "is-done" : ""} ${over ? "is-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); void take(e.dataTransfer.files[0]); }}
    >
      <div className="slot__view">
        {photoId ? (
          <span className="pic" style={{ aspectRatio: "4 / 5" }}>{url ? <img src={url} alt={`Твоё фото: ${slot.title}`} /> : null}</span>
        ) : (
          <>
            <Pic name={slot.example.img} alt="" sizes="(min-width: 900px) 20vw, 45vw" ratio="4 / 5" focus={slot.example} />
            <span className="slot__ex">Пример кадра</span>
          </>
        )}
      </div>
      <div className="slot__body">
        <h3>{slot.title}</h3>
        <p className="small muted">{slot.hint}</p>
        <p className="small slot__req">{slot.required ? "Обязательно" : "По желанию"}</p>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="slot__act">
          <input ref={input} id={`f-${slot.id}`} className="vh" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void take(e.target.files?.[0])} />
          <label htmlFor={`f-${slot.id}`} className={`btn btn--sm ${photoId ? "btn--ghost" : ""}`} aria-busy={busy}>
            {busy ? "Проверяем фото" : photoId ? "Заменить" : "Загрузить"}
          </label>
          {photoId && <button type="button" className="textbtn" onClick={onRemove}>Убрать</button>}
        </div>
      </div>
    </li>
  );
}

function Thumb({ id, title }: { id: string; title: string }) {
  const url = usePhotoUrl(id);
  return <span className="pic thumb" style={{ aspectRatio: "4 / 5" }}>{url ? <img src={url} alt={title} /> : null}</span>;
}

export function Wizard() {
  const { state, user } = useAuth();
  const q = useQuery();
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filling, setFilling] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const applied = useRef(false);

  // категория из ссылки (карточки на главной)
  useEffect(() => {
    if (!state || !q || applied.current) return;
    applied.current = true;
    const c = categoryById(q.get("category"));
    if (c && state.draft.category !== c.id) pickCategory(c, state.draft);
  }, [state, q]);

  if (!state || !user) return <Loading />;
  const d = state.draft;
  const cat = categoryById(d.category);
  const balance = balanceOf(state, user.id);
  const price = draftPrice(d);
  const done = cat ? cat.slots.filter((s) => d.photos[s.id]).length : 0;
  const reqDone = cat ? cat.slots.filter((s) => s.required && d.photos[s.id]).length : 0;
  const reqAll = cat ? requiredCount(cat) : 0;
  const promoCode = d.promo.trim().toUpperCase();
  const promoState = !promoCode ? "" : PROMOS[promoCode] ? "ok" : "bad";
  const lack = Math.max(0, price.total - balance);

  const canNext = [!!cat && !!price.brand.trim(), reqDone === reqAll && reqAll > 0, promoState !== "bad", true][d.step];
  const go = (step: number) => {
    saveDraft({ step });
    setError("");
    top.current?.scrollIntoView({ block: "start" });
  };

  function pickCategory(c: Category, draft: Draft) {
    const keep: Record<string, string> = {};
    Object.entries(draft.photos).forEach(([slot, id]) => {
      if (c.slots.some((s) => s.id === slot)) keep[slot] = id;
      else void deletePhoto(id).catch(() => {});
    });
    saveDraft({ category: c.id, photos: keep });
  }

  async function addPhoto(slot: Slot, file: File) {
    const r = await preparePhoto(file);
    if (!r.ok) return r.error;
    const id = randomHex(8);
    try {
      await putPhoto(id, r.blob);
    } catch {
      return "Браузер не дал сохранить фото. Проверь, не включён ли приватный режим.";
    }
    const old = d.photos[slot.id];
    if (old) void deletePhoto(old).catch(() => {});
    saveDraft({ photos: { ...state!.draft.photos, [slot.id]: id } });
    return null;
  }
  function removePhoto(slot: Slot) {
    const id = d.photos[slot.id];
    if (!id) return;
    void deletePhoto(id).catch(() => {});
    const next = { ...d.photos };
    delete next[slot.id];
    saveDraft({ photos: next });
  }
  /** Демо: чтобы пройти путь без своих фото, слоты заполняются иллюстрациями-примерами. */
  async function fillExamples() {
    if (!cat) return;
    setFilling(true);
    const next = { ...d.photos };
    for (const s of cat.slots.filter((x) => x.required && !next[x.id])) {
      try {
        const blob = new Blob([await (await fetch(imgUrl(s.example.img, IMAGES[s.example.img].widths[1] ?? IMAGES[s.example.img].widths[0]))).arrayBuffer()], { type: "image/webp" });
        const id = randomHex(8);
        await putPhoto(id, blob);
        next[s.id] = id;
      } catch {}
    }
    saveDraft({ photos: next });
    setFilling(false);
  }

  function submit() {
    if (!cat) return;
    const photos: Photo[] = cat.slots.filter((s) => d.photos[s.id]).map((s) => ({ slot: s.id, title: s.title, photoId: d.photos[s.id] }));
    const r = createOrder(user!.id, photos);
    if (r.ok) {
      setDoneId(r.id);
      top.current?.scrollIntoView({ block: "start" });
    } else setError(r.error);
  }

  if (doneId) {
    return (
      <div className="wrap wiz wiz--done" ref={top}>
        <h1 className="d d-xxl">Заявка отправлена</h1>
        <p className="lead">Номер {doneId}. Сейчас она ждёт эксперта. Статус меняется в кабинете — заглядывай в раздел «Заявки».</p>
        <p className="note">Демо: эксперт не ответит сам. На странице заявки есть панель «Ответ эксперта» — с ней можно пройти все статусы до итога.</p>
        <div className="wiz__nav">
          <Link className="btn btn--lg" href={`/orders/view/?id=${doneId}`}>Открыть заявку</Link>
          <button type="button" className="btn btn--lg btn--ghost" onClick={() => setDoneId(null)}>Проверить ещё вещь</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap wiz" ref={top}>
      <header className="wiz__head">
        <h1 className="d d-xl">Новая заявка</h1>
        <ol className="wiz__steps" aria-label="Шаги заявки">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === d.step ? "step" : undefined} className={i < d.step ? "is-past" : ""}>
              {i < d.step ? <button type="button" onClick={() => go(i)}><span className="num">{i + 1}</span>{s}</button> : <span><span className="num">{i + 1}</span>{s}</span>}
            </li>
          ))}
        </ol>
      </header>

      {d.step === 0 && (
        <section className="wiz__body" aria-labelledby="s0">
          <h2 id="s0" className="d d-l">Что проверяем</h2>
          <div className="pick" role="radiogroup" aria-label="Категория">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" role="radio" aria-checked={d.category === c.id} className="pick__cat" onClick={() => pickCategory(c, d)}>
                <Pic name={c.image} alt="" sizes="(min-width: 900px) 18vw, 45vw" />
                <span className="d d-s">{c.title}</span>
                <span className="small">{c.items}</span>
              </button>
            ))}
          </div>
          <h2 className="d d-l">Бренд</h2>
          <div className="brands" role="radiogroup" aria-label="Бренд">
            {BRANDS.map((b) => (
              <button key={b.brand} type="button" role="radio" aria-checked={d.brand === b.brand} onClick={() => saveDraft({ brand: b.brand })}>
                <span className="d d-m">{b.brand}</span><span className="num">{b.credits} кр.</span>
              </button>
            ))}
            <button type="button" role="radio" aria-checked={d.brand === "other"} onClick={() => saveDraft({ brand: "other" })}>
              <span className="d d-m">Другой бренд</span><span className="num">{OTHER_BRAND_PRICE} кр.</span>
            </button>
          </div>
          {d.brand === "other" && (
            <label className="field wiz__other">
              <span>Название бренда</span>
              <input className="input" value={d.otherBrand} maxLength={40} onChange={(e) => saveDraft({ otherBrand: e.target.value })} placeholder="Например, Moncler" />
              <span className="small">Цена для брендов вне списка ещё не утверждена. В демо — {credits(OTHER_BRAND_PRICE)}.</span>
            </label>
          )}
        </section>
      )}

      {d.step === 1 && cat && (
        <section className="wiz__body" aria-labelledby="s1">
          <div className="wiz__row">
            <h2 id="s1" className="d d-l">Фото: {cat.title.toLowerCase()}</h2>
            <p className="muted" aria-live="polite">Обязательных загружено {reqDone} из {reqAll}{done > reqDone ? `, всего ${done}` : ""}</p>
          </div>
          <p className="lead">Снимай при дневном свете, без вспышки. JPG, PNG или WebP до 15 МБ, от 600 px по короткой стороне. Геометки и данные телефона с фото удаляются.</p>
          <ul className="slots">
            {cat.slots.map((s) => (
              <SlotCard key={s.id} slot={s} photoId={d.photos[s.id]} onFile={(f) => addPhoto(s, f)} onRemove={() => removePhoto(s)} />
            ))}
          </ul>
          {reqDone < reqAll && (
            <p className="note">
              Демо: нет вещи под рукой?{" "}
              <button type="button" className="link" disabled={filling} onClick={fillExamples}>{filling ? "Подставляем" : "Подставить кадры-примеры"}</button> — иллюстрации займут обязательные слоты.
            </p>
          )}
        </section>
      )}

      {d.step === 2 && (
        <section className="wiz__body" aria-labelledby="s2">
          <h2 id="s2" className="d d-l">Срочность</h2>
          <div className="brands brands--two" role="radiogroup" aria-label="Срочность">
            <button type="button" role="radio" aria-checked={d.urgency === "standard"} onClick={() => saveDraft({ urgency: "standard" })}>
              <span className="d d-m">Стандартная</span><span>Общая очередь</span>
            </button>
            <button type="button" role="radio" aria-checked={d.urgency === "fast"} onClick={() => saveDraft({ urgency: "fast" })}>
              <span className="d d-m">Срочная</span><span>В начало очереди</span>
            </button>
          </div>
          <p className="note">Наценка за срочность и сроки ещё не утверждены. В демо срочность не меняет цену.</p>
          <h2 className="d d-l">Промокод</h2>
          <label className="field wiz__other">
            <span>Если есть</span>
            <input className="input" value={d.promo} maxLength={20} autoCapitalize="characters" onChange={(e) => saveDraft({ promo: e.target.value })} aria-describedby="promo-hint" />
            <span id="promo-hint" className={`small ${promoState === "bad" ? "error" : ""}`} aria-live="polite">
              {promoState === "ok" ? `Код принят: минус ${credits(PROMOS[promoCode])}.` : promoState === "bad" ? "Такого кода нет. Исправь или очисти поле." : "Демо-промокод: DEMO10."}
            </span>
          </label>
        </section>
      )}

      {d.step === 3 && cat && (
        <section className="wiz__body" aria-labelledby="s3">
          <h2 id="s3" className="d d-l">Проверь и отправь</h2>
          <div className="sum">
            <dl className="kv rows">
              <div><dt>Вещь</dt><dd>{price.brand}, {cat.title.toLowerCase()}</dd></div>
              <div><dt>Фото</dt><dd>{done}</dd></div>
              <div><dt>Срочность</dt><dd>{d.urgency === "fast" ? "Срочная" : "Стандартная"}</dd></div>
              <div><dt>Проверка</dt><dd className="num">{credits(price.base)}</dd></div>
              {price.discount > 0 && <div><dt>Промокод {promoCode}</dt><dd className="num">−{credits(price.discount)}</dd></div>}
              <div className="sum__total"><dt>К списанию</dt><dd className="num"><span className="d d-l">{price.total}</span> кр.</dd></div>
              <div><dt>На балансе</dt><dd className="num">{credits(balance)}</dd></div>
              <div><dt>Останется</dt><dd className="num">{lack ? "—" : credits(balance - price.total)}</dd></div>
            </dl>
            <ul className="sum__photos">
              {cat.slots.filter((s) => d.photos[s.id]).map((s) => <li key={s.id}><Thumb id={d.photos[s.id]} title={s.title} /></li>)}
            </ul>
          </div>
          {lack > 0 && (
            <div className="lack" role="status">
              <p className="d d-m">Не хватает {credits(lack)}</p>
              <p className="muted">Пополни кошелёк — заявка никуда не денется: вещь, фото и условия сохранены.</p>
              <Link className="btn btn--lg" href={`/wallet/?return=new&need=${lack}`}>Пополнить кошелёк</Link>
              <p className="small muted">{credits(lack)} — это {byn(lack)}{RATE_IS_DEMO ? " по демо-курсу" : ""}. Кредиты продаются пакетами.</p>
            </div>
          )}
          {error && <p className="error" role="alert">{error}</p>}
        </section>
      )}

      <footer className="wiz__nav">
        {d.step > 0 ? <button type="button" className="btn btn--lg btn--ghost" onClick={() => go(d.step - 1)}>Назад</button> : <button type="button" className="textbtn" onClick={() => clearDraft(true)}>Очистить заявку</button>}
        {d.step < 3 && price.base > 0 && <p className="wiz__price num">Проверка {price.brand}: {credits(price.total)}</p>}
        {d.step < 3 ? (
          <button type="button" className="btn btn--lg" disabled={!canNext} onClick={() => go(d.step + 1)}>Дальше</button>
        ) : (
          <button type="button" className="btn btn--lg" disabled={lack > 0} onClick={submit}>Списать {credits(price.total)} и отправить</button>
        )}
      </footer>
    </div>
  );
}
