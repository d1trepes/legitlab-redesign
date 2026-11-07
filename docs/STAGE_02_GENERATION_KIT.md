# STAGE 02 — HERO & LOGO GENERATION KIT

**Дата:** 08.11.2026  
**Статус:** [ГИПОТЕЗА] промпты и система проверки. Не финальный ассет, не утверждённый логотип и не разрешение начинать вёрстку.  
**Источник решений:** [STAGE_02_ART_DIRECTION.md](STAGE_02_ART_DIRECTION.md), [DECISIONS.md](DECISIONS.md), [PROPOSED_SITEMAP.md](PROPOSED_SITEMAP.md).

## Рекомендованная последовательность

1. [РЕШЕНИЕ О ПРОЦЕССЕ — на предложение] Создать **2 варианта hero-ассета** и **3 логотипных направления**. Изображения и логотипы выбрать и согласовать, не заказывая сейчас сайт в коде.
2. Сопоставить **статические** композиции одного hero на 1440 px и 390 px, light/dark и текстовую иерархию; проверить лицензию TT Firs Neue + TT Commons Pro.
3. **Только после явного согласования визуального направления** — дать Codex изолированную задачу на navbar + hero + переход к секции «Примеры проверок», как первый тест этапа 03. Это не отдельный новый обязательный этап и не разрешение менять production.
4. В браузере проверить композицию без анимации, затем 2.5D motion, reduced-motion и производительность. Если тест не проходит — изменить ассет/композицию до расширения страницы.
5. После утверждения первого экрана Codex собирает **всю** desktop-главную из восьми согласованных секций, а не восемь разнородных hero.

## [ФАКТ] Зафиксированный hero-текст

- Композиционный брендовый слой: **LEGIT LAB** (это не H1).
- Семантический H1: **Проверка подлинности брендовых вещей**.
- Описание: **Помогаем понять, стоит ли покупать вещь и что именно ты держишь в руках.**
- CTA: **Начать проверку** / **Как это работает**.
- Основной вход с сайта — заявка **на сайте**; вторичная ссылка ведёт в соответствующий раздел главной.
- Сцена: одна рука держит худи; бирка видима, но не является настоящим доказательством подлинности. Объект пересекает часть больших букв LEGIT LAB, **не закрывает** оффер/кнопки. H1/описание/кнопки находятся в нижнем левом смысловом блоке; гигантская LEGIT LAB может быть по центру.
- Desktop framed navbar, полный набор ссылок; темы через настройки; light — default.

## PROMPT A — динамичная рука / худи (изолированный hero-ассет)

```text
Create a striking photorealistic editorial fashion cutout for a premium clothing authentication service.

A single realistic human hand enters dramatically from the upper-right edge and firmly grips a heavy oversized charcoal-grey hoodie near its collar. The hoodie hangs down with sculptural fabric folds, strong gravity, and a dynamic diagonal silhouette.

A small woven inner label is partially exposed near the neckline. One or two minimal blank paper hangtags dangle naturally from the collar on thin strings. The tags must look physically believable and clearly visible, suggesting garment inspection.

Camera: low three-quarter angle, dramatic close-up, wide sculptural composition, realistic hand anatomy, convincing fabric weight and texture.

Lighting: premium monochrome fashion campaign photography, crisp directional studio light, rich graphite shadows, fine textile details.

Composition: the hand and hoodie form one powerful central object, visually suitable for overlapping enormous typography behind them on a website.

Isolated subject, transparent background if supported. No text, no logos, no brand names, no UI, no background scenery, no additional objects.

Avoid ecommerce catalogue photography, mannequin poses, plastic fabric, distorted fingers, fake lettering, glossy CGI aesthetics, neon, gradients, excessive accessories, and floating graphic elements.
```

## PROMPT B — рука исследует ярлык (изолированный hero-ассет)

```text
High-end monochrome fashion editorial photograph, isolated cutout.

One realistic human hand lifts the collar of an oversized black hoodie, subtly turning it outward to reveal a small inner garment label. A simple blank swing tag hangs from the collar.

The garment falls naturally into deep sculptural folds. Confident intentional gesture, as if someone is carefully examining the item before buying it.

Dramatic close-up, sophisticated studio lighting, genuine cotton fabric texture, believable human anatomy, strong photographic realism.

Iconic composition suitable for a typography-led editorial website hero, with the garment overlapping large background letters.

Transparent background if available. No typography, no logo, no brand identifiers, no interface, no decorative symbols, no retail styling, no AI effects.
```

### Подготовка ассета к анимации

- [ГИПОТЕЗА] Начать с изображения руки/худи как единого cutout в PNG/WebP/AVIF с прозрачным фоном. Сразу проверить светлый и тёмный фон: отсутствие белого ореола, реалистичные края руки/ткани и достаточный контраст.
- Нельзя требовать независимого покачивания бирок от единственной плоской картинки: для этого нужен отдельный слой с совпадающим ракурсом, короткий ролик или настоящий 3D.
- Не встраивать текст LEGIT LAB, H1, кнопки и интерфейс в генерируемую картинку; это элементы веб-интерфейса.
- Не выдавать художественные изображения и сгенерированные бирки за реальные результаты эксперта.

## LOGO — 3 генеративные концепции (НЕ готовый SVG)

**Правило:** запросы к генератору годятся только для оценки визуального направления; точный wordmark надо проверить вручную, перерисовать/набрать легально лицензированным шрифтом, затем экспортировать в корректный SVG. Генераторы могут ошибаться в написании. Не использовать чужие логотипы как образец для копирования.

### Logo A — typographic wordmark

```text
Explore an original typography-only logo for LEGIT LAB, a fashion authentication service. Black ink on white background, uppercase Latin letters spelled exactly “LEGIT LAB”. Create a distinctive compact editorial wordmark with controlled spacing, excellent small-size legibility, confident fashion identity without luxury-brand imitation. No symbol, no badge, no gradients, no mockup, no arbitrary decoration. Show only the black wordmark on a plain white background.
```

### Logo B — wordmark + LL monogram

```text
Explore an original monochrome identity for LEGIT LAB: custom uppercase “LEGIT LAB” wordmark plus a separate minimal LL monogram. The monogram should rely on precise typographic counterforms, not generic hexagons, shields, ticks, locks or scan icons. Editorial fashion attitude, highly legible at favicon and social-avatar scale. Flat black on white, clean 2D vector-like presentation, no mockups, shadows or color accents. Spell LEGIT LAB exactly.
```

### Logo C — garment-label / verification cue

```text
Explore an original monochrome identity for LEGIT LAB, combining a compact editorial wordmark with a subtle abstract garment-label or folded-fabric edge motif. The mark should suggest close examination of clothes without looking like a shopping brand or a generic tech/security company. Restrained geometry, optical balance, black on white, excellent legibility in small sizes. No checkmarks, shields, AI circuits, 3D effects, gradients or copied brand symbols. Spell LEGIT LAB exactly.
```

**Проверка A/B/C:** размер 24/32/48 px, 140–220 px wordmark, белая и тёмная поверхности, navbar, favicon/avatar, одноцветный вектор. Сохранить все варианты отдельно, primary не назначать до выбора инициатором.

## Визуальная система — короткие проверки до Codex

- [ ] **Читаемость:** собственное «LEGIT LAB» и **семантический H1** визуально различаются; с первого кадра понятно, что услуга — проверка подлинности вещей по фото. Все тексты, кнопки и nav доступны без окончания анимации.
- [ ] **Референсы:** от Bounce только принцип пересечения большого объекта и больших букв; от Athlete Showcase — композиционный переход с перекрытием. Не копировать фотографии/сетку.
- [ ] **Типографика:** TT Firs Neue + TT Commons Pro, кириллица, лицензия, длина H1 и 390 px. Не использовать Onest/Unbounded, Inter/Manrope как альтернативы для основного направления.
- [ ] **Сетка:** проверить desktop 1440, mobile 390 и промежуточные ширины, чтобы рука и худи не заслоняли H1 и CTA. Framed navbar адаптируется без неудобного уплотнения.
- [ ] **Цвет:** только чёрный/белый/серые оттенки, light default + полноценный dark. На обеих темах проверяется фото, границы, состояние кнопок, статусы и доступность.
- [ ] **Кнопки:** прямоугольные с небольшим радиусом; достаточный размер для нажатия; первичный CTA визуально приоритетнее вторичного, без декоративной пестроты.
- [ ] **Motion:** единичное спокойное появление объекта, статичный fallback, `prefers-reduced-motion`, отсутствие задержки CTA/скачка вёрстки и заметной деградации загрузки на мобильном.
- [ ] **Иерархия блоков:** следующий блок — «Примеры проверок» со скруглённой поверхностью, перекрывающей низ hero, без добавления девятой секции.
- [ ] **Авторские права и доверие:** реальные кейсы — только разрешённые материалы; экспертные комментарии не публиковать; сгенерированный рекламный арт не маскировать под реальную проверку.
- [ ] **Лого:** три независимые идеи, small-size, право использования шрифта/ассетов, отдельные SVG после проверки.

## Что не отдавать Codex до согласования

Тексты генерации здесь — **не задача сделать интерфейс**. После выбора изображений и logo-направления и утверждения арт-дирекшна подготовить отдельное задание на полный desktop этапа 03 с коротким изолированным hero-тестом внутри этапа. Не реализовывать произвольные компоненты по одному текстовому описанию без выбранного визуального ключевого кадра.
