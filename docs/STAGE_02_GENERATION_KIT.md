# Этап 02 — актуальные промпты hero и знака LEGIT LAB (V2)

**Дата:** 08.11.2026. **Статус:** [ГИПОТЕЗА] материалы для генерации и проверки, не утверждённые изображения и логотип.  
**Приоритет:** [STAGE_02_ART_DIRECTION.md](STAGE_02_ART_DIRECTION.md) и [DECISIONS.md](DECISIONS.md).  
Предыдущая версия промптов (рука сверху/справа, wordmark-only, LL monogram) **отклонена и оставлена в истории Git**. Использовать только V2 ниже.

## [ФАКТ — замечания к полученному изображению]

- Загруженный результат: тёмное худи с реалистичной фактурой и видимыми бирками, но рука **входит сверху справа**, держит худи сбоку, поэтому **не повторяется вертикальная композиционная логика Bounce**.
- [РЕШЕНИЕ] **Рука идёт снизу вверх**, запястье выходит из нижнего края hero, ладонь захватывает ворот худи; ткань **спускается/обтекает предплечье**, бирки естественно свисают и достаточно заметны.
- Крупный **LEGIT LAB** — композиционная типографика позади объекта, набирается как текст в коде; H1, описание и CTA остаются отдельными. Не вшивать текст в генерируемую картинку.
- Художественные бирки не являются доказательством подлинности и не должны изображать настоящую проверку.

## HERO PROMPT V2 — без референсного изображения, только предплечье за нижней границей

```text
Create a single photorealistic high-fashion editorial cutout for LEGIT LAB, a clothing authenticity-checking service. Build the composition entirely from scratch. No reference image.

COMPOSITION — THE MOST IMPORTANT REQUIREMENT:
One realistic human forearm rises straight UP from the BOTTOM CENTER of the image, like an arm lifting an object high above the viewer. The arm enters the frame ONLY through the BOTTOM EDGE. The hand is near the upper-middle of the frame and firmly grips the collar / gathered neckline of ONE oversized charcoal-black hoodie.

The hoodie is lifted into the air. Its heavy cotton fabric folds and cascades naturally around the raised hand and forearm, as if slowly sliding down under gravity. The garment has a sculptural yet believable shape. The hood, entire body, bottom hem and BOTH sleeves including cuffs are ALL FULLY VISIBLE and COMPLETELY INSIDE THE IMAGE FRAME.

STRICT CROPPING RULE: the ONLY element allowed to cross or be cut by the image border is the human FOREARM at the BOTTOM CENTER. DO NOT crop any part of the hoodie, hood, sleeves, cuffs, hem, hanging tags, fingers or hand. Keep visible empty space around the full hoodie silhouette, especially on the left, right and top edges. The hoodie hem must end above the bottom border, while the forearm continues off the bottom of the image.

A small woven fabric label is visible inside the neckline, with one or two realistically sized, plain, unbranded garment tags hanging naturally from the collar. They suggest close examination of clothing, not retail price tags.

Front-facing camera with a subtle low-angle perspective; authentic human anatomy, five fingers, correct grip, true fabric weight, visible stitching, premium fashion-campaign lighting, tactile cotton texture, monochrome blacks and charcoal greys, clear silhouette and natural shadows.

Portrait 4:5 composition, full isolated subject on a TRANSPARENT background, suitable for placement in front of oversized website typography. No text or logo baked into the image.

AVOID: hand or arm entering from the top or either side, diagonal arm coming from a corner, hoodie cut off by frame, sleeves cut off, partial garment, mannequin, clothes hanger, second hand, extra fingers, floating garment, bizarre fabric physics, large white price tags, retail product shoot, colorful accents, CGI plastic look, watermarks, typography, icons or interface elements.
```

### Проверка результата hero

- [ ] Поза: **предплечье входит строго через нижний центр**, не сбоку и не сверху; **только предплечье** обрезается нижней границей.
- [ ] **Вся толстовка полностью в кадре**: капюшон, оба рукава с манжетами, низ изделия, бирки; со всех сторон кроме низа руки есть свободное поле. Ткань естественно спадает поверх и вокруг поднятой руки.
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


## PROMPT V2.1 — парная белая версия для dark theme (после выбора чёрного ассета)

**[ГИПОТЕЗА]** Это задача редактирования уже выбранного чёрного кадра, а не новая генерация с нуля. Чтобы сохранить идентичный силуэт, следует приложить именно выбранный кадр (отдельный PNG с прозрачностью). Не менять руку, бирки, масштаб и границы.

```text
Edit the provided image to create the exact matching DARK-THEME version of this same fashion editorial cutout. Keep the original pose, composition, anatomical proportions, hand, forearm, hood, sleeves, cuffs, hem, labels, hanging tags, lighting direction, camera angle, canvas size and transparent background EXACTLY THE SAME.

Change ONLY the charcoal-black hoodie fabric to realistic clean WHITE / SOFT OFF-WHITE cotton fleece, with subtle cool-grey shadows, natural stitch detail and believable texture. Preserve the natural skin tone of the arm and the existing label/tag colors. Keep all garment parts fully within the original frame; ONLY the lower forearm crosses the bottom edge. No new objects, no rearrangement, no typography, no logos, no artificial color inversion. Make the white garment stand out clearly on a near-black website background without glowing edges or overexposure.
```

[РЕШЕНИЕ ПО ПРЕДПОЧТЕНИЮ] Light theme → charcoal/black hoodie; Dark theme → white/off-white hoodie. Не делать обе версии чёрными и не применять CSS invert к картинке с человеческой кожей.

**Статус:** негенерированная белая версия; исходный пользовательский PNG ещё не перенесён в GitHub как файл. Оригинал доступен в текущем диалоге, но не объявлять его сохранённым в репозитории.
