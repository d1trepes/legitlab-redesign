"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { CloseIcon, GearIcon, MenuIcon, TelegramIcon, TikTokIcon } from "./Icons";
import { useDemo } from "./DemoProvider";
import { LINKS } from "@/lib/data";
import styles from "./Header.module.css";

type Theme = "light" | "dark";

const NAV = [
  { href: "#pricing", label: "Стоимость" },
  { href: "#wallet", label: "Кошелёк" },
  { href: "#articles", label: "Статьи" },
];

function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    // Sync React state with the theme already applied by the inline script.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(current);
  }, []);
  const setTheme = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("ll-theme", t);
    } catch {
      /* storage may be blocked; theme still applies for this visit */
    }
    setThemeState(t);
  };
  return [theme, setTheme];
}

function Settings({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className={styles.settingsBody}>
      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>Тема</legend>
        <div className={styles.segment}>
          {(["light", "dark"] as const).map((t) => (
            <label key={t} className={styles.segmentItem}>
              <input
                type="radio"
                name="theme"
                value={t}
                checked={theme === t}
                onChange={() => setTheme(t)}
              />
              <span>{t === "light" ? "Светлая" : "Тёмная"}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.group}>
        <p className={styles.groupTitle}>Страна</p>
        <p className={styles.groupValue}>Беларусь · кредиты покупаются в BYN</p>
      </div>
      <div className={styles.group}>
        <p className={styles.groupTitle}>Язык</p>
        <p className={styles.groupValue}>Русский</p>
      </div>
    </div>
  );
}

export function Header() {
  const { openCheck, openLogin } = useDemo();
  const [theme, setTheme] = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSettingsOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [settingsOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.frame}>
        <a href="#top" className={styles.brand} aria-label="LEGIT LAB, на главную">
          <Logo size={24} />
        </a>

        <nav className={styles.nav} aria-label="Основная навигация">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.icon} href={LINKS.telegramChannel} target="_blank" rel="noopener noreferrer" aria-label="Telegram-канал LEGIT LAB">
            <TelegramIcon />
          </a>
          <a className={styles.icon} href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok LEGIT LAB">
            <TikTokIcon />
          </a>
          <div className={styles.settings} ref={settingsRef}>
            <button
              className={styles.icon}
              aria-label="Настройки"
              aria-expanded={settingsOpen}
              aria-controls="settings-panel"
              onClick={() => setSettingsOpen((v) => !v)}
            >
              <GearIcon />
            </button>
            {settingsOpen && (
              <div id="settings-panel" className={styles.panel} role="dialog" aria-label="Настройки">
                <Settings theme={theme} setTheme={setTheme} />
              </div>
            )}
          </div>
          <button className="btn btn--ghost btn--small" onClick={openLogin}>
            Войти
          </button>
          <button className="btn btn--small" onClick={() => openCheck()}>
            Начать проверку
          </button>
        </div>

        <button
          className={`${styles.icon} ${styles.menuBtn}`}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className={styles.mobile}>
          <nav className={styles.mobileNav} aria-label="Мобильная навигация">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
                {n.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                openLogin();
              }}
            >
              Войти
            </button>
          </nav>
          <div className={styles.mobileSettings}>
            <Settings theme={theme} setTheme={setTheme} />
          </div>
          <div className={styles.mobileSocial}>
            <a href={LINKS.telegramChannel} target="_blank" rel="noopener noreferrer">
              <TelegramIcon /> Telegram
            </a>
            <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer">
              <TikTokIcon /> TikTok
            </a>
          </div>
          <button
            className="btn"
            onClick={() => {
              setMenuOpen(false);
              openCheck();
            }}
          >
            Начать проверку
          </button>
        </div>
      )}
    </header>
  );
}
