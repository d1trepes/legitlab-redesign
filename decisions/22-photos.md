# Итог чата 2 — фото главной

Все новые фото сделаны и лежат в `assets/v3/`. Сгенерированные иллюстрации — только в первом экране, категориях, iPhone и финале. В ленте проверок — только настоящие фото из `content/catalog-photos/`.

Raw-ссылка: `https://raw.githubusercontent.com/d1trepes/legitlab-redesign/main/<путь>`.

## Файл → блок → кадрирование

| Файл | Блок | Кадрирование |
|---|---|---|
| `assets/v3/hero-puffer.png` (1122×1402, прозрачный фон) | Первый экран, вещь в центре 3D-сцены | Целиком, высота = min(88% высоты сцены, 540 px); тень `drop-shadow(0 30px 30px rgba(0,0,0,.18))` |
| `assets/v3/detail-1-overall.png` | Кадр «Общий вид»: облако, iPhone (экран 2 и 3) | 4:5, `object-fit: cover`; на экране 3 iPhone — кадр высотой 236 px |
| `assets/v3/detail-2-tag.png` | Кадр «Бирка», видоискатель iPhone (экран 1) | 4:5 / cover по центру |
| `assets/v3/detail-3-label.png` | Кадр «Этикетка» | 4:5 / cover |
| `assets/v3/detail-4-seams.png` | Кадр «Швы» | 4:5 / cover |
| `assets/v3/detail-5-hardware.png` | Кадр «Фурнитура» | 4:5 / cover |
| `assets/v3/detail-6-logo.png` | Кадр «Логотип» | 4:5 / cover |
| `assets/v3/detail-7-inside.png` | Кадр «Изнанка» | 4:5 / cover |
| `assets/v3/cat-outerwear-wide.png` (1341×1173) | «Что мы проверяем», большая плитка «Верхняя одежда» | Плитка 8:7, cover по центру |
| `assets/v3/cat-sneakers-wide.png` (1341×1173) | Большая плитка «Обувь» (бирка на язычке) | 8:7, cover по центру |
| `assets/v2/cat-clothing.png` | Малая плитка «Одежда» | 12:13, фокус 50% 45% |
| `assets/v2/cat-bags.png` | Малая плитка «Сумки» | 12:13, по центру |
| `assets/v2/cat-accessories.png` | Малая плитка «Аксессуары» | 12:13, фокус 50% 62% |
| `assets/v3/final-person.png` (1024×1536, прозрачный фон) | Финальный призыв, человек перед фразой | Высота = блок фразы + 300 px − 30; фильтр `contrast(.9) brightness(1.06)`, тени + тень-эллипс на полу |
| `content/article-covers/amiri.jpg`, `moncler.jpg`, `balenciaga-track.jpg` | «Статьи», лесенка | 4:5, 1:1, 3:4 по порядку; cover |
| `content/catalog-photos/<ID>.jpg` — 16 шт. | «Настоящие проверки» | 4:5 / 1:1 / 3:4 — см. порядок ниже |

### Лента проверок — порядок, ID, пропорции

Раскладка по строкам в 4 колонки (i-й элемент → колонка i mod 4).

| # | ID | Бренд | Категория | Итог | Пропорция |
|---|---|---|---|---|---|
| 1 | AXNH7B | Amiri | Одежда | Оригинал | 4/5 |
| 2 | W47H8W | Moncler | Верхняя одежда | Реплика | 1/1 |
| 3 | 817FVB | Gucci | Сумки | Оригинал | 3/4 |
| 4 | 1WB5ON | Air Jordan | Кроссовки | Реплика | 4/5 |
| 5 | IRJXHR | Stone Island | Одежда | Оригинал | 1/1 |
| 6 | Z9EWEH | MCM | Аксессуары | Реплика | 3/4 |
| 7 | 4U462Q | On Running | Кроссовки | Оригинал | 4/5 |
| 8 | MXVU0I | Balenciaga | Одежда | Реплика | 4/5 |
| 9 | N59BDU | Nike | Обувь | Оригинал | 3/4 |
| 10 | 01LKHM | Balenciaga | Кроссовки | Реплика | 1/1 |
| 11 | 392CVO | Gucci | Сумки | Оригинал | 4/5 |
| 12 | ZHM645 | Louis Vuitton | Сумки | Реплика | 3/4 |
| 13 | YE88LN | Off-White | Одежда | Оригинал | 1/1 |
| 14 | 22HOYN | Moncler | Верхняя одежда | Реплика | 4/5 |
| 15 | LVIWH2 | Balenciaga | Кроссовки | Оригинал | 4/5 |
| 16 | BK9NMB | Louis Vuitton | Аксессуары | Реплика | 1/1 |

### Не используются на главной

`assets/v2/hero-doubt.png` (запас для og:image), `ring-man-coat.png`, `ring-hands-tags.png`, `ring-woman-puffer.png`, `cat-outerwear.png`, `cat-sneakers.png` (заменены wide-версиями).

## Что не сделано / открыто

- Все 11 новых фото есть. Если владелец захочет перегенерировать человека для финала — промпт №9 ниже, на полу должна быть мягкая тень.
- Обложки статей 406×510: на Retina мягкие. Нужны оригиналы ≥900 px с legit-lab.com.
- Фото проверок ~400–490 px шириной — для колонки ~330 px на Retina мягкие; это настоящие снимки, оставляем.
- PNG v3 весят 1–2 МБ: в чате 3 можно грузить по raw-ссылке как есть; оптимизация (WebP) — по желанию владельца.

## Промпты (полные, стиль внутри)

Генерировать в этом порядке; детали — с hero-puffer как референсом (image-to-image).

1. **hero-puffer.png** (4:5, прозрачный фон после вырезки) — A single oversized matte black down puffer jacket shown as if worn by an invisible person (ghost mannequin), front three-quarter view, high funnel collar with hood zipped all the way up, thick horizontal quilted baffles, dropped shoulders, long sleeves with ribbed cuffs, a blank white paper hang tag on a thin black string hanging from the zipper pull, garment centered and fully in frame with generous margins on all sides, plain flat light grey background #D9D9D6 with no shadow on the background for easy cutout. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft diffused studio key light from the upper left, gentle fill, rich nylon fabric texture, medium format camera, 85mm lens, crisp focus, no brand logos, no readable text, no letters or numbers on tags or labels, photorealistic.
2. **detail-1-overall.png** (4:5) — The same oversized matte black quilted down puffer jacket with high funnel collar and hood, laid flat and perfectly symmetrical, shot straight from above, whole jacket in frame with margins, sleeves slightly spread, blank white hang tag lying on the chest, on a seamless mid-grey studio paper backdrop. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft diffused studio light from the upper left, subtle soft shadow, rich nylon fabric texture, medium format camera, crisp focus, no brand logos, no readable text, no letters or numbers on tags or labels, photorealistic.
3. **detail-2-tag.png** (4:5) — Close-up of a hand holding a blank white cardboard hang tag attached by a thin black string to the zipper pull of the same matte black quilted puffer jacket, the tag shows only an abstract printed barcode pattern and empty lines, no letters or numbers, shallow depth of field, jacket fabric softly out of focus behind. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft diffused studio key light from the upper left, macro detail, medium format camera, no brand logos, no readable text, photorealistic.
4. **detail-3-label.png** (4:5) — Macro shot of the inner neck of the same matte black puffer jacket, a woven fabric label stitched just below the collar seam, the label has only a fine woven texture and a thin border, absolutely no letters, symbols or logos, visible stitch lines holding it in place. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft raking studio light revealing the weave texture, shallow depth of field, medium format camera, no brand logos, no readable text, photorealistic.
5. **detail-4-seams.png** (4:5) — Extreme close-up of the quilting seams on the same matte black down puffer jacket, two puffy baffles meeting at a straight double-stitched seam line, individual stitches crisp and countable, slight sheen on the nylon, fabric filling the whole frame. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft raking studio light from the upper left, macro lens, crisp focus, no brand logos, no readable text, photorealistic.
6. **detail-5-hardware.png** (4:5) — Macro shot of the chunky matte black metal zipper and zipper pull at the collar of the same black puffer jacket, smooth unmarked metal with no engraving, zipper teeth in sharp focus, the hang tag string partly visible, fabric falling off into soft focus. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft studio light with a small specular highlight on the metal, macro lens, no brand logos, no readable text, photorealistic.
7. **detail-6-logo.png** (4:5) — Close-up of the upper sleeve of the same matte black puffer jacket with a small round embossed rubber patch stitched on, the patch carries only an abstract geometric mark made of two slanted shapes, no letters, no real brand symbol, stitching around the patch visible. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft studio light from the upper left, macro detail, shallow depth of field, no readable text, photorealistic.
8. **detail-7-inside.png** (4:5) — The same matte black puffer jacket opened to show its inside: smooth dark grey lining with quilting lines, a long white care label sewn into the side seam showing only small abstract care pictograms and blank lines, no letters or numbers, an inner pocket edge visible. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft diffused studio light, shallow depth of field, medium format camera, no brand logos, no readable text, photorealistic.
9. **final-person.png** (2:3, прозрачный фон после вырезки) — Full-length portrait of a young adult standing straight facing the camera, wearing a very oversized long black quilted down puffer coat reaching the shins with the funnel collar zipped up to the chin, wide black trousers, chunky black boots, hands in coat pockets, calm neutral expression, whole figure in frame from head to toes with generous margins above and below, standing on a plain light grey studio floor with a soft natural contact shadow under the boots, plain flat light grey background #D9D9D6. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft diffused studio key light from the upper left, gentle fill, rich fabric texture, medium format camera, 85mm lens, no brand logos, no readable text, photorealistic.
10. **cat-outerwear-wide.png** (8:7) — Wide still life of an oversized black quilted down puffer jacket floating as if worn by an invisible person and a long black wool overcoat hanging slightly behind it, each with a blank white paper hang tag on a thin string, both garments placed in the right two thirds of the frame, empty dark space on the left and lower left for text, dark charcoal seamless studio backdrop fading to near black at the edges. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft top light, subtle floor shadow, rich fabric texture, medium format camera, no brand logos, no readable text, no letters or numbers on tags, photorealistic.
11. **cat-sneakers-wide.png** (8:7) — Wide still life of a pair of chunky light grey layered running sneakers with thick sculpted soles, one standing in profile and one turned three-quarter toward the camera, a small blank white cardboard tag fixed flat on the top of the tongue with a short plastic loop through the tongue, the tag lies against the tongue and does not hang or dangle, sneakers placed in the right two thirds of the frame, empty dark space on the left and lower left for text, dark charcoal seamless studio backdrop fading to near black at the edges. Monochrome fashion editorial photograph, black-and-white tonality with no color cast, soft top light, subtle floor shadow, mesh and suede texture, medium format camera, no brand logos, no readable text, no letters or numbers on the tag, photorealistic.
