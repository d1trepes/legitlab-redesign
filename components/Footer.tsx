import { LINKS } from "@/lib/data";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

const SERVICE = [
  { href: "#categories", label: "Что мы проверяем" },
  { href: "#examples", label: "Примеры проверок" },
  { href: "#how-it-works", label: "Как мы проверяем" },
  { href: "#pricing", label: "Стоимость" },
  { href: "#articles", label: "Статьи" },
];

const CHANNELS = [
  { href: LINKS.telegramChannel, label: "Telegram-канал" },
  { href: LINKS.telegramBot, label: "Telegram-бот" },
  { href: LINKS.tiktok, label: "TikTok" },
  { href: LINKS.site, label: "legit-lab.com" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size={32} />
            <p className={styles.tagline}>Проверка подлинности брендовых вещей по фотографиям.</p>
          </div>
          <nav className={styles.col} aria-label="Сервис">
            <p className={styles.colTitle}>Сервис</p>
            {SERVICE.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <nav className={styles.col} aria-label="Каналы">
            <p className={styles.colTitle}>Каналы</p>
            {CHANNELS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.word} aria-hidden="true">
          Legit Lab
        </p>
        <div className={styles.bottom}>
          <span>© 2026 Legit Lab</span>
          <span>Концептуальная демоверсия редизайна. Не является рабочим сайтом сервиса.</span>
        </div>
      </div>
    </footer>
  );
}
