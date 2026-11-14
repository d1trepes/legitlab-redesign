# site/

Код главной страницы LEGIT LAB. Всё, что лежит в этой папке, публикуется на https://d1trepes.github.io/legitlab-redesign/

- `index.html` — разметка: шапка, 6 блоков, футер. Заголовок и кнопки первого экрана видны без JS.
- `styles.css` — система C «Студия» (`decisions/20-visual-system.md`).
- `main.js` — облако из 7 кадров, iPhone, фильтр проверок, появление блоков, окно «Страница в разработке». Данные — из `content/catalog.json`, `articles.json`, `links.json` по raw-ссылкам (есть запасные данные).

Фото грузятся по raw-ссылкам из `assets/` и `content/`. Без сборщиков. Эталон — `decisions/25-prototype.html`.
