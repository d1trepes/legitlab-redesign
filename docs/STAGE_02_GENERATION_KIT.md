# Этап 02 — актуальные промпты hero и знака LEGIT LAB (V2)

**Дата:** 08.11.2026. **Статус:** [ГИПОТЕЗА] материалы для генерации и проверки, не утверждённые изображения и логотип.  
**Приоритет:** [STAGE_02_ART_DIRECTION.md](STAGE_02_ART_DIRECTION.md) и [DECISIONS.md](DECISIONS.md).  
Предыдущая версия промптов (рука сверху/справа, wordmark-only, LL monogram) **отклонена и оставлена в истории Git**. Использовать только V2 ниже.

## [ФАКТ — замечания к полученному изображению]

- Загруженный результат: тёмное худи с реалистичной фактурой и видимыми бирками, но рука **входит сверху справа**, держит худи сбоку, поэтому **не повторяется вертикальная композиционная логика Bounce**.
- [РЕШЕНИЕ] **Рука идёт снизу вверх**, запястье выходит из нижнего края hero, ладонь захватывает ворот худи; ткань **спускается/обтекает предплечье**, бирки естественно свисают и достаточно заметны.
- Крупный **LEGIT LAB** — композиционная типографика позади объекта, набирается как текст в коде; H1, описание и CTA остаются отдельными. Не вшивать текст в генерируемую картинку.
- Художественные бирки не являются доказательством подлинности и не должны изображать настоящую проверку.

## HERO PROMPT V2 (основной; можно приложить неудачное изображение как референс ткани)

```text
Use the uploaded hoodie image only as a reference for charcoal fabric texture, realistic folds and visible labels. Completely redesign the pose and composition.

Create an iconic photorealistic monochrome fashion editorial cutout for a clothing authentication website, inspired by the vertical silhouette of a hand lifting a basketball in an editorial sports poster.

CRITICAL COMPOSITION: A single human forearm rises vertically UPWARD FROM THE BOTTOM CENTER of the frame. The wrist begins at the bottom edge. A strong realistic hand reaches upward and grips a heavy charcoal-grey oversized hoodie around its collar at approximately the upper-middle of the composition. The hoodie fabric drapes downward OVER AND AROUND the raised forearm, cascading in natural folds as if sliding under gravity. The fabric must visually interact with the arm, not hang separately next to it.

One authentic-looking woven garment label is visible at the inner collar, with one or two small unbranded labels naturally hanging downward. No large blank retail price tags.

The hand, hoodie and labels together form one dramatic vertical sculptural silhouette. Front-facing camera with slight low-angle perspective, believable anatomy, gravity, garment weight, premium studio editorial lighting, sharp textile detail, organic shadows.

Isolated full subject on transparent background. Leave enough negative space on both sides for oversized LEGIT LAB typography to sit BEHIND the subject in the website. No typography baked into the image.

ABSOLUTELY NO hand entering from left, right or top; no arm coming from a corner; no extra arms or fingers; no mannequins, shopping ads, printed brand logos, fake lettering, colored accents, cartoon 3D, random graphics or artificial floating elements.
```

### Проверка результата hero

- [ ] Поза: **предплечье начинается строго снизу**, а не в верхнем/боковом углу.
- [ ] Худи спадает **поверх и вокруг** руки; нет ощущения, что человек держит товар за край на вешалке.
- [ ] Бирки небольшие и естественно связаны с воротом; не похожи на белые ценники магазина.
- [ ] Силуэт узнаваем при небольшом отображении и не закрывает H1/CTA.
- [ ] Нет неестественной кисти и лишних пальцев; края cutout чистые на белом и на почти чёрном фоне.
- [ ] Отдельный статичный постер без анимации уже работает; потом можно обсуждать 2.5D/video/3D и reduced-motion.

## [РЕШЕНИЕ] СИМВОЛ ПЕРЕД LEGIT LAB, а не просто надпись

Цель: **самостоятельный геометрический знак слева от неизменного названия LEGIT LAB**, работающий как favicon/avatar и в хедере. Генерировать отдельно **символ БЕЗ ТЕКСТА**, чтобы исключить ошибки букв и потом аккуратно набрать wordmark на лицензированном шрифте. Монограмму LL и просто текст без знака исключить из активных концепций.

**Общие рамки трёх концепций:** монохром, сплошные формы и осмысленная негативная область, без градиентов/теней/3D, никаких generic shield/checkmark/lock/QR/crosshair/AI sparkles. Легко воспроизвести как чистый SVG; при 20–24 px форма остаётся различимой.

### A — Inspection Frame / «рамка изучения» [ГИПОТЕЗА]

```text
Design ONLY an original standalone minimalist symbol for a fashion authentication brand, LEGIT LAB. Create a precise compact inspection frame built from two or three asymmetric geometric corner fragments, with one meaningful open gap suggesting that an item is being examined closely. Distinctive editorial fashion identity rather than a camera icon. Strong black solid geometry, balanced negative space, flat white background. Must remain recognizable at 24 px and fit to the left of a wordmark. NO TEXT, NO LL LETTERS, NO scanning target, no QR code, no checkmark, shield, lock, gradient, mockup, glow or copied brand icon.
```

### B — Folded Label / «сгиб бирки» [ГИПОТЕЗА]

```text
Design ONLY an original minimal geometric brand symbol for LEGIT LAB. Abstract the physical fold of a garment label into one bold angular folded ribbon shape with a precisely cut negative-space corner; two-dimensional and solid, no literal T-shirt icon. It must evoke examination of a garment detail, feel rigorous and memorable, work as an avatar or 24 px favicon, and sit to the left of the LEGIT LAB wordmark. Pure black shape on white, flat vector-like geometry. NO TEXT, NO LL MONOGRAM, NO gradient, glossy 3D, stitching illustration, checkmark, shield, shopping bag or decorative dots.
```

### C — Alignment / «совпадение деталей» [ГИПОТЕЗА]

```text
Design ONLY an original black monochrome abstract symbol for the fashion authentication service LEGIT LAB. Express meticulous comparison through two simple offset geometric shapes whose edges align into a clear, memorable central negative-space seam. The concept is visual alignment and evidence, not an approved verdict. Precise optical balance, editorial fashion attitude, bold simple silhouette, usable at favicon size and next to a wordmark. Flat pure black on white. NO TEXT, NO initial letters, NO shields, ticks, loupe, radar, scanning brackets, AI patterns, gradients, 3D or mockups.
```

### Критерии проверки знака

1. Оцениваем знак **отдельно от слова LEGIT LAB**, затем рядом с названием слева, на светлой и тёмной теме.
2. Проверка в размерах 20, 24, 32, 48 px, а также на аватаре и framed navbar. Никаких мелких элементов, исчезающих при уменьшении.
3. Факт генерации не означает оригинальность и готовые юридические права: перед коммерческим применением — проверка сходства и финальная векторизация.
4. После утверждения пользовательского выбора сохраняем каждый вариант под отдельным именем; финальный primary — только по явному выбору.

## [УТОЧНИТЬ] Дальнейший порядок

1. Получить обновлённый **hero V2** и три символа; оценить без кода.
2. Отобрать работающий визуальный материал, проверить русскую типографику TT Firs Neue + TT Commons Pro и лицензии, light/dark и макет 1440/390.
3. Согласовать окончательный арт-дирекшн и 2–3 варианта логотипа.
4. Только после утверждения и отдельной задачи начать в Codex этап 03: **сначала технический тест navbar + hero + переход, затем вся desktop-главная из восьми секций**. Не запускать код прямо из этого промпта.
