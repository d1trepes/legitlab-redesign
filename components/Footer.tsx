import Link from "next/link";
import { Lockup, Wordmark } from "./Logo";
import { ThemeToggle } from "./Theme";
import { LINKS } from "@/lib/site";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  return (
    <footer className="ftr night">
      <div className="wrap">
        <div className="ftr__top">
          <Link href="/" className="ftr__logo" aria-label="LEGIT LAB — на главную">
            <Lockup height={104} />
          </Link>
          <p className="ftr__claim d d-m">Оригинал или реплика. Ответ эксперта по фото.</p>
          <nav className="ftr__cols" aria-label="Карта сайта">
            <ul>
              <li><Link href="/catalog/">Каталог проверок</Link></li>
              <li><Link href="/how-it-works/">Как это работает</Link></li>
              <li><Link href="/pricing/">Цены и кредиты</Link></li>
              <li><Link href="/articles/">Статьи</Link></li>
              <li><Link href="/security/">Безопасность</Link></li>
            </ul>
            <ul>
              <li><Link href="/new/">Начать проверку</Link></li>
              <li><Link href="/orders/">Заявки</Link></li>
              <li><Link href="/wallet/">Кошелёк</Link></li>
              <li><Link href="/profile/">Профиль</Link></li>
            </ul>
            <ul>
              <li><a href={LINKS.telegramBot} {...ext}>Telegram-бот</a></li>
              <li><a href={LINKS.telegramChannel} {...ext}>Telegram-канал</a></li>
              <li><a href={LINKS.tiktok} {...ext}>TikTok</a></li>
              <li><a href={LINKS.site} {...ext}>legit-lab.com</a></li>
            </ul>
          </nav>
        </div>
        <div className="ftr__meta">
          <p>Демоверсия. Оплата, письма с кодом и вход через Telegram показаны как пример и ничего не списывают.</p>
          <div className="ftr__tools">
            <Link href="/brand/" className="textbtn">Логотип</Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="ftr__word" aria-hidden="true">
        <Wordmark />
      </div>
    </footer>
  );
}
