"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Pic } from "@/components/Pic";
import { CodeInput } from "./parts";
import { safeNext, useQuery } from "./hooks";
import {
  DEMO_EMAIL, DEMO_PASSWORD, confirmLogin, confirmRegister, confirmReset, loginDemo, loginTelegram, resendCode,
  startLogin, startRegister, startReset, useAppState, userOf,
} from "@/lib/store";
import { passwordIssues } from "@/lib/security";
import type { ImageName } from "@/lib/images.gen";

function Shell({ title, image, children }: { title: string; image: ImageName; children: ReactNode }) {
  return (
    <div className="wrap auth">
      <div className="auth__form">
        <h1 className="d d-xl">{title}</h1>
        {children}
      </div>
      <Pic name={image} alt="" sizes="(min-width: 900px) 40vw, 0px" className="auth__pic" />
    </div>
  );
}

function DemoCode({ code, onUse }: { code: string | undefined; onUse: (c: string) => void }) {
  if (!code) return null;
  return (
    <p className="note">
      Демо: письмо не отправляется. Твой код — <b className="num">{code}</b>.{" "}
      <button type="button" className="link" onClick={() => onUse(code)}>Подставить</button>
    </p>
  );
}

function Resend({ onCode }: { onCode: (c: string) => void }) {
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return left > 0 ? (
    <p className="small muted">Отправить код ещё раз можно через {left} с</p>
  ) : (
    <button type="button" className="textbtn" onClick={() => { const c = resendCode(); if (c) onCode(c); setLeft(30); }}>Отправить код ещё раз</button>
  );
}

/** Уже вошёл — сразу дальше. */
function useRedirectIfAuthed(fallback: string) {
  const state = useAppState();
  const user = userOf(state);
  const router = useRouter();
  const q = useQuery();
  const next = safeNext(q?.get("next"), fallback);
  useEffect(() => {
    if (user && q) router.replace(next);
  }, [user, q, next, router]);
  return { next, nextQuery: q?.get("next") ? `?next=${encodeURIComponent(next)}` : "" };
}

export function Login() {
  const { nextQuery } = useRedirectIfAuthed("/orders/");
  const [step, setStep] = useState<"creds" | "email" | "totp">("creds");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (step === "creds") {
      const r = await startLogin(email, password);
      if (r.ok) {
        setStep(r.method);
        setDemoCode(r.demoCode);
        setCode("");
      } else setError(r.error);
    } else {
      const r = await confirmLogin(code);
      if (!r.ok) setError(r.error);
    }
    setBusy(false);
  }

  return (
    <Shell title={step === "creds" ? "Вход" : "Код"} image="ring-man-coat">
      {step === "creds" ? (
        <>
          <form className="form" onSubmit={submit} noValidate>
            <label className="field"><span>Почта</span><input className="input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="field"><span>Пароль</span><input className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn btn--lg btn--wide" disabled={busy || !email || !password}>Получить код</button>
          </form>
          <div className="auth__links">
            <Link className="textbtn" href={`/register/${nextQuery}`}>Создать аккаунт</Link>
            <Link className="textbtn" href="/forgot/">Забыл пароль</Link>
          </div>
          <div className="auth__alt">
            <button type="button" className="btn btn--ghost btn--wide" onClick={loginTelegram}>Войти через Telegram</button>
            <p className="note">Демо: в жизни вход подтверждается в боте. Здесь кнопка сразу открывает гостевой аккаунт.</p>
            <button type="button" className="btn btn--ghost btn--wide" onClick={loginDemo}>Открыть демо-аккаунт</button>
            <p className="note">
              В демо-аккаунте уже есть заявки во всех статусах и история кошелька. Войти обычным путём: {DEMO_EMAIL}, пароль {DEMO_PASSWORD}.{" "}
              <button type="button" className="link" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); }}>Подставить</button>
            </p>
          </div>
        </>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <p className="lead">
            {step === "email" ? <>Мы отправили шестизначный код на {email}. Он действует 10 минут.</> : <>Введи код из приложения-аутентификатора. Нет телефона под рукой — подойдёт резервный код.</>}
          </p>
          <CodeInput value={code} onChange={setCode} long={step === "totp"} />
          {step === "email" && <DemoCode code={demoCode} onUse={setCode} />}
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--lg btn--wide" disabled={busy || code.length < 6}>Войти</button>
          <div className="auth__links">
            {step === "email" && <Resend onCode={setDemoCode} />}
            <button type="button" className="textbtn" onClick={() => { setStep("creds"); setError(""); }}>Назад</button>
          </div>
        </form>
      )}
    </Shell>
  );
}

function PasswordField({ value, onChange, label = "Пароль" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const issues = passwordIssues(value);
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input" type="password" autoComplete="new-password" required value={value} onChange={(e) => onChange(e.target.value)} aria-describedby="pw-hint" />
      <span id="pw-hint" className="small">{value && !issues.length ? "Пароль подходит" : `Нужно: ${(value ? issues : passwordIssues("")).join(", ")}`}</span>
    </label>
  );
}

export function Register() {
  const { nextQuery } = useRedirectIfAuthed("/new/");
  const [step, setStep] = useState<"form" | "code">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (step === "form") {
      const r = await startRegister(name, email, password);
      if (r.ok) {
        setDemoCode(r.demoCode);
        setStep("code");
      } else setError(r.error);
    } else {
      const r = await confirmRegister(code);
      if (!r.ok) setError(r.error);
    }
    setBusy(false);
  }

  return (
    <Shell title={step === "form" ? "Регистрация" : "Код"} image="ring-woman-puffer">
      {step === "form" ? (
        <>
          <form className="form" onSubmit={submit} noValidate>
            <label className="field"><span>Имя</span><input className="input" autoComplete="given-name" required value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="field"><span>Почта</span><input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <PasswordField value={password} onChange={setPassword} />
            <label className="check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>Согласен на обработку данных для проверки вещи. В демо данные не покидают браузер.</span></label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn btn--lg btn--wide" disabled={busy || !agree || !name || !email || passwordIssues(password).length > 0}>Создать аккаунт</button>
          </form>
          <div className="auth__links"><Link className="textbtn" href={`/login/${nextQuery}`}>Уже есть аккаунт</Link></div>
        </>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <p className="lead">Подтверди почту {email}: мы отправили на неё шестизначный код.</p>
          <CodeInput value={code} onChange={setCode} />
          <DemoCode code={demoCode} onUse={setCode} />
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--lg btn--wide" disabled={busy || code.length < 6}>Подтвердить</button>
          <div className="auth__links">
            <Resend onCode={setDemoCode} />
            <button type="button" className="textbtn" onClick={() => setStep("form")}>Назад</button>
          </div>
        </form>
      )}
    </Shell>
  );
}

export function Forgot() {
  useRedirectIfAuthed("/orders/");
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [demoCode, setDemoCode] = useState<string>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (step === "email") {
      const r = startReset(email);
      if (r.ok) {
        setDemoCode(r.demoCode);
        setStep("code");
      } else setError(r.error);
    } else {
      const r = await confirmReset(code, password);
      if (!r.ok) setError(r.error);
    }
    setBusy(false);
  }

  return (
    <Shell title="Новый пароль" image="ring-hands-tags">
      {step === "email" ? (
        <form className="form" onSubmit={submit} noValidate>
          <p className="lead">Напиши почту аккаунта. Пришлём код, с которым можно задать новый пароль.</p>
          <label className="field"><span>Почта</span><input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--lg btn--wide" disabled={busy || !email}>Получить код</button>
        </form>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <p className="lead">Если аккаунт с почтой {email} существует, код уже отправлен.</p>
          {demoCode ? <DemoCode code={demoCode} onUse={setCode} /> : <p className="note">Демо: аккаунта с такой почтой в этом браузере нет, поэтому кода не будет. Так сайт не подсказывает, чья почта зарегистрирована.</p>}
          <CodeInput value={code} onChange={setCode} />
          <PasswordField value={password} onChange={setPassword} label="Новый пароль" />
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--lg btn--wide" disabled={busy || code.length < 6 || passwordIssues(password).length > 0}>Сохранить и войти</button>
          <div className="auth__links"><button type="button" className="textbtn" onClick={() => setStep("email")}>Назад</button></div>
        </form>
      )}
      <div className="auth__links"><Link className="textbtn" href="/login/">Вспомнил пароль</Link></div>
    </Shell>
  );
}
