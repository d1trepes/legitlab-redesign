# LEGIT LAB — демо

Демоверсия сервиса проверки подлинности брендовых вещей по фото (Беларусь).
Сайт: https://d1trepes.github.io/legitlab-redesign/

- [BRIEF.md](BRIEF.md) — бриф.
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — шрифты, цвет, сетка, движение, логотип.
- [docs/SITEMAP.md](docs/SITEMAP.md) — страницы и главный путь пользователя.
- `docs/screens/` — скриншоты ключевых экранов (1440 и 390, светлая и тёмная тема).

## Запуск

```bash
npm ci
npm run dev        # http://localhost:3000/legitlab-redesign/
npm run lint && npm run typecheck && npm run build   # статический сайт в out/
```

Демо-аккаунт: `demo@legitlab.by` / `demo2026` (или кнопка «Открыть демо-аккаунт» на странице входа).
3D можно принудительно включить или выключить: `?3d=on`, `?3d=off`.

## Устройство

- Next.js (App Router) + TypeScript, статический экспорт под `/legitlab-redesign`.
- `lib/store.ts` — единственный слой данных поверх `localStorage`; фото — в IndexedDB (`lib/photos.ts`).
- `lib/security.ts` — PBKDF2 для паролей и TOTP для двухфакторной защиты (Web Crypto).
- `components/home/ringScene.ts`, `inspectScene.ts` — две сцены Three.js, грузятся лениво.
- `content/` — данные каталога, цены, статьи, ссылки. Курс кредита: `content/pricing.json → creditToBYN`.

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run images` | Сжимает `assets/` и `content/` в AVIF/WebP (`public/img`) и пишет манифест |
| `npm run brand` | Собирает lockup логотипа и иконки |
| `node scripts/scenario.mjs` | Сквозной сценарий по собранному сайту (регистрация → заявка → оплата → статусы → 2FA) |
| `npm run screens` | Снимает экраны в `docs/screens/` |

Для двух последних нужен Chrome и раздача `out/` по адресу `http://localhost:4173/legitlab-redesign/`.
