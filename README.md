# LEGIT LAB — демоверсия редизайна

**Отдельная концептуальная демоверсия, не production.** Действующий `legit-lab.com` не меняется.

Сейчас собрана **главная страница** (9 блоков, светлая и тёмная тема, desktop и mobile). Решения и ограничения — в [docs/IMPLEMENTATION_NOTES.md](docs/IMPLEMENTATION_NOTES.md) и [docs/DECISIONS.md](docs/DECISIONS.md) (D-031—D-039).

## Запуск
```bash
npm install
npm run dev        # http://localhost:3000
```

## Проверки и сборка
```bash
npm run typecheck
npm run lint
npm run build      # статический сайт в папке out/
```
Папку `out/` можно выложить на любой статический хостинг (Vercel, Netlify, GitHub Pages) для просмотра.

## Стек
Next.js 16 (App Router) + TypeScript, CSS Modules, шрифты Sofia Sans Extra Condensed и Golos Text (OFL) локально.

## Структура
- `app/` — layout, страница, глобальные токены (`globals.css`).
- `components/` — блоки главной, по файлу на блок.
- `lib/data.ts` — контент: каталог, цены, статьи, ссылки.
- `public/img/` — оптимизированные копии ассетов. Оригиналы — в `assets/`, не изменяются.
- `docs/` — спецификации и журнал решений.
