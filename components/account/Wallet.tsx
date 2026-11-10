"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountShell, Loading } from "./parts";
import { useAuth, useQuery } from "./hooks";
import { MAX_PRICE, MIN_PRICE, PACKAGES, RATE_IS_DEMO, byn, checksFor, credits, fmtDateTime } from "@/lib/site";
import { balanceOf, topUp, txsOf } from "@/lib/store";

export function Wallet() {
  const { state, user } = useAuth();
  const q = useQuery();
  const [pick, setPick] = useState<number | null>(null);
  const [paid, setPaid] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const need = Number(q?.get("need") ?? 0);
  const back = q?.get("return") === "new";

  useEffect(() => {
    if (!q) return;
    const p = q.get("pack");
    if (p !== null && PACKAGES[+p]) setPick(+p);
    else if (need > 0) setPick(Math.max(0, PACKAGES.findIndex((x) => x.credits + x.bonus >= need)));
  }, [q, need]);

  if (!state || !user) return <Loading />;
  const balance = balanceOf(state, user.id);
  const txs = txsOf(state, user.id);
  const chosen = pick === null ? null : PACKAGES[pick];

  function pay() {
    if (pick === null) return;
    setBusy(true);
    setTimeout(() => {
      topUp(user!.id, pick);
      setPaid(pick);
      setPick(null);
      setBusy(false);
    }, 700);
  }

  return (
    <AccountShell title="Кошелёк">
      <section className="bal" aria-label="Баланс">
        <p className="bal__n"><span className="d num">{balance}</span><span>{credits(balance).replace(/^\S+\s/, "")}<br />на балансе</span></p>
        <p className="lead">
          {balance >= MIN_PRICE
            ? <>Хватит на {checksFor(Math.floor(balance / MIN_PRICE))} по {MIN_PRICE} кредитов{balance >= MAX_PRICE ? <> или {checksFor(Math.floor(balance / MAX_PRICE))} по {MAX_PRICE}</> : null}.</>
            : <>На проверку пока не хватает: самая доступная стоит {credits(MIN_PRICE)}.</>}
        </p>
      </section>

      {back && paid === null && need > 0 && balance < need + 0 && (
        <p className="banner" role="status">Для заявки не хватает {credits(need)}. Выбери пакет — после оплаты вернёшься к подтверждению, данные заявки сохранены.</p>
      )}
      {paid !== null && (
        <div className="banner banner--ok" role="status">
          <p><b>Зачислено {credits(PACKAGES[paid].credits + PACKAGES[paid].bonus)}.</b> Демо-оплата: деньги не списывались.</p>
          {back ? <Link className="btn" href="/new/">Вернуться к заявке</Link> : <Link className="btn" href="/new/">Начать проверку</Link>}
        </div>
      )}

      <section aria-labelledby="pk-h" className="section--tight">
        <h2 id="pk-h" className="d d-l">Пополнить</h2>
        <div className="wpacks" role="radiogroup" aria-label="Пакет кредитов">
          {PACKAGES.map((p, i) => (
            <button key={p.credits} type="button" role="radio" aria-checked={pick === i} onClick={() => { setPick(i); setPaid(null); }}>
              <span className="wpacks__n"><span className="d d-l num">{p.credits}</span>{p.bonus ? <span className="d d-s num">+{p.bonus}</span> : null}</span>
              <span className="small">{p.bonus ? `${credits(p.credits + p.bonus)} с бонусом` : "без бонуса"}{p.tag ? ". Берут чаще всего" : ""}</span>
              <span className="wpacks__p num">{byn(p.credits)}</span>
            </button>
          ))}
        </div>
        {RATE_IS_DEMO && <p className="small muted">Цены в BYN посчитаны по демо-курсу: настоящий курс кредита ещё не утверждён.</p>}
        {chosen && (
          <div className="pay">
            <dl className="kv rows">
              <div><dt>Пакет</dt><dd className="num">{credits(chosen.credits)}{chosen.bonus ? ` + ${chosen.bonus} бонусом` : ""}</dd></div>
              <div><dt>К оплате</dt><dd className="num">{byn(chosen.credits)}</dd></div>
              <div><dt>Баланс после</dt><dd className="num">{credits(balance + chosen.credits + chosen.bonus)}</dd></div>
            </dl>
            <div className="pay__act">
              <button type="button" className="btn btn--lg" disabled={busy} onClick={pay}>{busy ? "Проводим оплату" : `Оплатить ${byn(chosen.credits)}`}</button>
              <p className="note">Демо-оплата. Карта не нужна, деньги не списываются — кредиты просто появятся на балансе. В рабочей версии здесь будет форма платёжного сервиса.</p>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="tx-h" className="section--tight">
        <h2 id="tx-h" className="d d-l">История</h2>
        {txs.length === 0 ? <p className="muted" style={{ marginTop: 16 }}>Операций пока нет. Первое пополнение появится здесь.</p> : (
          <ul className="txs rows">
            {txs.map((t) => (
              <li key={t.id}>
                <span>{t.orderId ? <Link className="link" href={`/orders/view/?id=${t.orderId}`}>{t.title}</Link> : t.title}</span>
                <time dateTime={t.at} className="small muted">{fmtDateTime(t.at)}</time>
                <b className="num">{t.amount > 0 ? "+" : "−"}{Math.abs(t.amount)}</b>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AccountShell>
  );
}
