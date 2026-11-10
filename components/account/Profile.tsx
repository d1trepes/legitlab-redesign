"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AccountShell, CodeInput, Loading, QR } from "./parts";
import { useAuth } from "./hooks";
import { setTheme, useTheme } from "@/components/Theme";
import { LINKS, fmtDateTime } from "@/lib/site";
import { passwordIssues, totpUri } from "@/lib/security";
import {
  balanceOf, begin2FA, cancel2FA, changePassword, confirm2FA, disable2FA, logout, resetDemo, setNotify, setTelegram, updateProfile,
  type User,
} from "@/lib/store";

function TwoFactor({ user }: { user: User }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [backup, setBackup] = useState<string[] | null>(null);
  const [off, setOff] = useState(false);
  const tf = user.twoFactor;
  const account = user.email || user.name;

  async function confirm(e: FormEvent) {
    e.preventDefault();
    const r = await confirm2FA(user.id, code);
    if (r.ok) {
      setBackup(r.backup);
      setCode("");
      setError("");
    } else setError(r.error);
  }
  async function disable(e: FormEvent) {
    e.preventDefault();
    const r = await disable2FA(user.id, code);
    if (r.ok) {
      setOff(false);
      setCode("");
      setError("");
      setBackup(null);
    } else setError(r.error);
  }

  if (tf.enabled) {
    return (
      <div className="tf">
        <p><b>Включена.</b> При входе после пароля нужен код из приложения.</p>
        {backup && (
          <div className="tf__backup">
            <p>Резервные коды. Каждый работает один раз. Сохрани их там, где не потеряешь: показываем только сейчас.</p>
            <ul className="num">{backup.map((b) => <li key={b}>{b}</li>)}</ul>
            <button type="button" className="textbtn" onClick={() => navigator.clipboard?.writeText(backup.join("\n"))}>Скопировать</button>
          </div>
        )}
        {!backup && <p className="small muted">Осталось резервных кодов: {tf.backup.length}.</p>}
        {off ? (
          <form className="form form--narrow" onSubmit={disable}>
            <p className="small">Чтобы отключить, введи код из приложения или резервный код.</p>
            <CodeInput value={code} onChange={setCode} long />
            {error && <p className="error" role="alert">{error}</p>}
            <div className="row"><button className="btn" disabled={code.length < 6}>Отключить</button><button type="button" className="textbtn" onClick={() => { setOff(false); setError(""); }}>Отмена</button></div>
          </form>
        ) : <button type="button" className="btn btn--ghost" onClick={() => setOff(true)}>Отключить защиту</button>}
      </div>
    );
  }
  if (tf.secret) {
    return (
      <form className="tf tf--setup" onSubmit={confirm}>
        <QR text={totpUri(tf.secret, account)} size={168} />
        <div className="form">
          <p>Отсканируй код приложением-аутентификатором и введи шесть цифр, которые оно покажет.</p>
          <p className="small muted">Не сканируется? Введи ключ вручную: <span className="tf__key num">{tf.secret.match(/.{4}/g)?.join(" ")}</span></p>
          <CodeInput value={code} onChange={setCode} />
          {error && <p className="error" role="alert">{error}</p>}
          <div className="row"><button className="btn" disabled={code.length < 6}>Включить</button><button type="button" className="textbtn" onClick={() => { cancel2FA(user.id); setError(""); setCode(""); }}>Отмена</button></div>
          <p className="note">Это настоящий TOTP: коды из Google Authenticator, Aegis или 1Password подойдут и при следующем входе в демо.</p>
        </div>
      </form>
    );
  }
  return (
    <div className="tf">
      <p><b>Выключена.</b> Сейчас вход подтверждается кодом из письма. С приложением-аутентификатором аккаунт не откроют, даже узнав пароль и получив доступ к почте.</p>
      <button type="button" className="btn" onClick={() => begin2FA(user.id)}>Подключить приложение</button>
    </div>
  );
}

function Password({ user }: { user: User }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const issues = passwordIssues(next);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await changePassword(user.id, cur, next);
    setMsg(r.ok ? { ok: true, text: "Пароль изменён." } : { ok: false, text: r.error });
    if (r.ok) {
      setCur("");
      setNext("");
    }
  }
  return (
    <form className="form form--narrow" onSubmit={submit}>
      {user.passHash ? <label className="field"><span>Текущий пароль</span><input className="input" type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></label> : <p className="small muted">Ты вошёл через Telegram, пароля у аккаунта ещё нет. Задай его, чтобы входить и по почте.</p>}
      <label className="field"><span>Новый пароль</span><input className="input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} /><span className="small">{next && !issues.length ? "Пароль подходит" : `Нужно: ${(next ? issues : passwordIssues("")).join(", ")}`}</span></label>
      {msg && <p className={msg.ok ? "small" : "error"} role="status">{msg.text}</p>}
      <button className="btn btn--ghost" disabled={issues.length > 0 || (!!user.passHash && !cur)}>Сменить пароль</button>
    </form>
  );
}

export function Profile() {
  const { state, user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [saved, setSaved] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  if (!state || !user) return <Loading />;
  const log = state.log.filter((l) => l.userId === user.id).slice(0, 6);
  const n = user.notify;

  return (
    <AccountShell title="Профиль" balance={balanceOf(state, user.id)}>
      <div className="prof">
        <section className="split" aria-labelledby="p-data">
          <h2 id="p-data" className="d d-l">Данные</h2>
          <form className="form form--narrow" onSubmit={(e) => { e.preventDefault(); const r = updateProfile(user.id, name ?? user.name); setSaved(r.ok ? "Сохранено." : r.error); }}>
            <label className="field"><span>Имя</span><input className="input" value={name ?? user.name} onChange={(e) => { setName(e.target.value); setSaved(""); }} /></label>
            <label className="field"><span>Почта</span><input className="input" value={user.email || "не указана"} readOnly aria-readonly="true" /><span className="small">Почта — это логин. Сменить её можно через поддержку.</span></label>
            {saved && <p className="small" role="status">{saved}</p>}
            <button className="btn btn--ghost" disabled={name === null || name.trim() === user.name}>Сохранить</button>
          </form>
        </section>

        <section className="split" aria-labelledby="p-2fa">
          <div><h2 id="p-2fa" className="d d-l">Двухфакторная защита</h2></div>
          <TwoFactor user={user} />
        </section>

        <section className="split" aria-labelledby="p-pass">
          <h2 id="p-pass" className="d d-l">Пароль</h2>
          <Password user={user} />
        </section>

        <section className="split" aria-labelledby="p-sess">
          <h2 id="p-sess" className="d d-l">Сеансы и входы</h2>
          <div>
            <dl className="kv rows">
              <div><dt>Этот браузер</dt><dd>{state.session?.device}</dd></div>
              <div><dt>Вход выполнен</dt><dd>{state.session ? fmtDateTime(state.session.at) : ""}</dd></div>
              <div><dt>Сеанс истекает</dt><dd>через 12 часов после входа</dd></div>
            </dl>
            <h3 className="prof__sub">Журнал входов</h3>
            <ul className="log rows">
              {log.map((l, i) => <li key={i}><span>{l.ok ? l.method : `Неудачная попытка: ${l.method.toLowerCase()}`}</span><span className="small muted">{l.device} · {fmtDateTime(l.at)}</span></li>)}
            </ul>
            <p className="small muted" style={{ marginTop: 12 }}>Демо: журнал ведётся в этом браузере. В рабочей версии здесь будут все устройства и кнопка «Выйти везде».</p>
          </div>
        </section>

        <section className="split" aria-labelledby="p-tg">
          <h2 id="p-tg" className="d d-l">Telegram</h2>
          <div className="form form--narrow">
            {user.telegram ? (
              <><p><b>Привязан {user.telegram}.</b> Статусы заявок будут приходить в бот.</p><button type="button" className="btn btn--ghost" onClick={() => setTelegram(user.id, null)}>Отвязать</button></>
            ) : (
              <><p>Привяжи Telegram, чтобы получать статусы в <a className="link" href={LINKS.telegramBot} target="_blank" rel="noopener noreferrer">боте</a> и входить без пароля.</p><button type="button" className="btn btn--ghost" onClick={() => setTelegram(user.id, "@demo_user")}>Привязать Telegram</button></>
            )}
            <p className="note">Демо: в жизни привязка подтверждается в боте. Здесь подставляется условный @demo_user.</p>
          </div>
        </section>

        <section className="split" aria-labelledby="p-not">
          <h2 id="p-not" className="d d-l">Уведомления</h2>
          <ul className="sw rows">
            <li><label><span><b>Статус заявки</b><span className="small muted">Взяли в работу, вынесли итог</span></span><input type="checkbox" className="switch" checked={n.status} onChange={(e) => setNotify(user.id, { ...n, status: e.target.checked })} /></label></li>
            <li><label><span><b>Запрос доп. фото</b><span className="small muted">Эксперт просит доснять вещь</span></span><input type="checkbox" className="switch" checked={n.photos} onChange={(e) => setNotify(user.id, { ...n, photos: e.target.checked })} /></label></li>
            <li><label><span><b>Новые статьи</b><span className="small muted">Не чаще раза в месяц</span></span><input type="checkbox" className="switch" checked={n.news} onChange={(e) => setNotify(user.id, { ...n, news: e.target.checked })} /></label></li>
          </ul>
        </section>

        <section className="split" aria-labelledby="p-theme">
          <h2 id="p-theme" className="d d-l">Тема</h2>
          <div className="brands brands--two" role="radiogroup" aria-label="Тема оформления">
            <button type="button" role="radio" aria-checked={theme === "light"} onClick={() => setTheme("light")}><span className="d d-m">Светлая</span></button>
            <button type="button" role="radio" aria-checked={theme === "dark"} onClick={() => setTheme("dark")}><span className="d d-m">Тёмная</span></button>
          </div>
        </section>

        <section className="split" aria-labelledby="p-demo">
          <h2 id="p-demo" className="d d-l">Демо</h2>
          <div className="form form--narrow">
            <p>Сброс удалит созданные аккаунты, заявки, фото и операции в этом браузере и вернёт демо-аккаунт к исходному виду.</p>
            {confirmReset ? (
              <div className="row"><button type="button" className="btn" onClick={async () => { await resetDemo(); router.replace("/"); }}>Да, сбросить всё</button><button type="button" className="textbtn" onClick={() => setConfirmReset(false)}>Отмена</button></div>
            ) : <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(true)}>Сбросить демо</button>}
          </div>
        </section>

        <section className="prof__out">
          <button type="button" className="btn btn--lg btn--ghost" onClick={() => { logout(); router.replace("/"); }}>Выйти из аккаунта</button>
        </section>
      </div>
    </AccountShell>
  );
}
