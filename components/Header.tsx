"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Lockup } from "./Logo";
import { ThemeToggle } from "./Theme";
import { balanceOf, useAppState, userOf } from "@/lib/store";
import { LINKS } from "@/lib/site";

const NAV = [
  { href: "/catalog/", label: "Каталог" },
  { href: "/how-it-works/", label: "Как это работает" },
  { href: "/pricing/", label: "Цены" },
  { href: "/articles/", label: "Статьи" },
];
const ACCOUNT = [
  { href: "/orders/", label: "Заявки" },
  { href: "/wallet/", label: "Кошелёк" },
  { href: "/profile/", label: "Профиль" },
];

export function Header() {
  const path = usePathname();
  const state = useAppState();
  const user = userOf(state);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(path);
  if (seen !== path) {
    setSeen(path);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const cur = (href: string) => (path.startsWith(href) ? "page" : undefined);

  return (
    <header className={`hdr ${open ? "is-open" : ""}`}>
      <div className="wrap hdr__in">
        <Link className="hdr__logo" href="/" aria-label="LEGIT LAB — на главную">
          <Lockup height={40} />
        </Link>
        <nav className="hdr__nav" aria-label="Разделы">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</Link>
          ))}
        </nav>
        <div className="hdr__act">
          {user ? (
            <Link className="hdr__acc" href="/orders/" aria-current={ACCOUNT.some((a) => path.startsWith(a.href)) ? "page" : undefined}>
              Кабинет<span className="num">{balanceOf(state!, user.id)} кр.</span>
            </Link>
          ) : (
            <Link className="hdr__acc" href="/login/" aria-current={cur("/login/")}>Войти</Link>
          )}
          <Link className="btn btn--sm" href="/new/">Начать проверку</Link>
          <button type="button" className="hdr__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            {open ? "Закрыть" : "Меню"}
          </button>
        </div>
      </div>
      <div className="menu" id="menu" hidden={!open}>
        <div className="wrap menu__in">
          <nav aria-label="Меню" className="menu__main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="d d-l" aria-current={cur(n.href)}>{n.label}</Link>
            ))}
          </nav>
          <div className="menu__side">
            {user ? (
              ACCOUNT.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)
            ) : (
              <>
                <Link href="/login/">Войти</Link>
                <Link href="/register/">Регистрация</Link>
              </>
            )}
            <Link href="/security/">Безопасность</Link>
            <a href={LINKS.telegramBot} target="_blank" rel="noopener noreferrer">Telegram-бот</a>
            <ThemeToggle className="menu__theme" />
          </div>
          <Link className="btn btn--lg btn--wide" href="/new/">Начать проверку</Link>
        </div>
      </div>
    </header>
  );
}
