# HERO ASSETS — V4: внешний хват, физически непротиворечивая композиция

**Дата:** 08.11.2026  
**Статус:** [ГИПОТЕЗА] промпты на повторную генерацию. Ассеты пока не утверждены.  
**Связь:** [STAGE_02_ART_DIRECTION.md](STAGE_02_ART_DIRECTION.md) · [DECISIONS.md](DECISIONS.md) · [STAGE_02_GENERATION_KIT.md](STAGE_02_GENERATION_KIT.md).

## [ФАКТ] Что не получилось в полученных изображениях

- Чёрное и белое худи создали желаемый визуальный характер — объёмная ткань, складки, бирки, монохромная fashion-подача.
- В обоих изображениях наблюдается **неправдоподобная анатомическая связь**: предплечье выглядит так, будто проходит через корпус/проём худи и выходит из ткани. Это делает кадры непригодными как финальные hero-ассеты.
- Ранее формулировки «fabric drapes over/around the forearm» могли усиливать ошибку. В V4 они **убраны**. Эти кадры не считать согласованным результатом; использовать для оценки настроения, не как финальный production-арт.

## [РЕШЕНИЕ] Сохранить визуальную идею, исправить геометрию

- Одна рука поднимается вертикально снизу, оставаясь **полностью снаружи и спереди** худи.
- Пальцы **видимо сжимают наружную складку у верхнего плечевого шва около горловины**; есть понятная точка опоры и натяжение ткани.
- Худи висит **позади руки**, несколько широко/горизонтально, обе манжеты, капюшон, подол и бирки целиком внутри кадра.
- Только нижнее предплечье пересекает нижнюю границу, как в раннем правиле; **не проходить через рукав, карман, горловину, капюшон, корпус**.
- Светлая тема → чёрное худи. Тёмная тема → белое. Промпты ниже самостоятельные, без опоры на предыдущие изображения.

## 1. Black hoodie / Light theme — prompt

```text
Create an ultra-photorealistic high-end fashion editorial cutout of a single human hand holding a heavy oversized charcoal-black hoodie.

COMPOSITION:
A natural, proportionate human forearm rises vertically from the bottom center of the image. The entire forearm remains IN FRONT OF the hoodie, fully outside the garment.

The hand reaches the upper center of the composition and firmly grips a gathered fold of fabric at the hoodie's OUTER shoulder seam, next to the neckline.

The fingers visibly curl around the fabric from the outside, with realistic pressure and compression. The thumb and fingers must make clear physical contact with the fabric.

CRITICAL PHYSICAL REALISM:
The hand is NOT inside the hood, collar, body or sleeve.
The forearm does NOT enter or emerge from any opening in the hoodie.
The hoodie hangs BEHIND the raised forearm, supported entirely by the hand gripping its outer shoulder fabric.
There must be no visual intersection or impossible connection between the arm and the garment.

GARMENT:
An oversized heavyweight charcoal-black cotton hoodie, spreading broadly and slightly horizontally across the composition. Voluminous, sculptural fabric folds, believable gravity, thick cotton texture, visible seams and natural shadows.

The hood falls naturally toward the upper-right side. Both sleeves hang freely toward the left and right. One or two small unbranded garment tags hang from the neckline on the right side.

FRAMING:
The COMPLETE hoodie must remain inside the image, including its hood, both sleeves, cuffs, body, lower hem and tags.
ONLY the lower forearm is cropped by the bottom edge.
Keep natural empty space around the entire garment.

Premium editorial studio photography, realistic skin texture, natural anatomy, subtle directional light, sharp fabric details.

Portrait 4:5 composition, transparent background.

NO text, logos, brands, mannequin, hanger, extra hands, distorted fingers, artificial fabric intersections, CGI effects or retail-style product photography.
```

## 2. White hoodie / Dark theme — prompt

```text
Create an ultra-photorealistic premium fashion editorial cutout featuring a realistic human hand lifting a voluminous oversized soft-white hoodie.

COMPOSITION:
A naturally proportioned human forearm rises from the bottom center of the frame, remaining completely OUTSIDE and IN FRONT OF the hoodie.

At the upper center, the hand firmly grabs a thick gathered fold of fabric at the hoodie's outer shoulder seam near the neckline. All five fingers are anatomically correct, visibly wrapped around the fabric with realistic grip pressure.

PHYSICAL ACCURACY IS ESSENTIAL:
The hand grips the OUTER SURFACE of the garment.
The forearm remains visible in front of the hoodie, never entering its body, neckline, hood, pocket or sleeve.
The hoodie hangs freely BEHIND the arm, supported by the hand gripping the upper fabric.
No part of the arm passes through the clothing. No impossible fabric intersections.

GARMENT:
A premium heavyweight oversized hoodie in natural soft white cotton, with broad sculptural volume, deep realistic folds, subtle grey shadows, detailed stitching and tactile fabric texture.

The garment spreads slightly horizontally. Its hood falls toward the upper-right, while both sleeves hang naturally to the sides.

A small woven neck label and two minimal matte-black garment tags hang naturally from the right side of the neckline. The labels are unbranded and realistically sized.

FRAMING:
The entire hoodie must be visible within the image, including the hood, both sleeves, cuffs, lower hem, body and hanging labels.
ONLY the lower forearm extends beyond the bottom image border.
Do not crop any part of the clothing or hand.

Clean directional studio lighting, refined monochrome fashion campaign aesthetic, natural skin tone, believable textile weight, strong photographic realism.

Portrait 4:5 composition, isolated transparent background. The white hoodie must retain visible volume when placed against a near-black website background.

NO text, logos, brand names, mannequins, hangers, CGI appearance, glowing edges, excessive whitening, distorted anatomy, extra hands or impossible garment geometry.
```

## [ГИПОТЕЗА] Производственный контроль

- Генерация **двух независимых изображений не гарантирует идентичную геометрию**, даже при совпадении описания. После выбора работающего чёрного кадра имеет смысл создать белый цветовой вариант *редактированием уже физически корректной версии*, если нужна точная смена темы без скачка силуэта.
- Если генератор снова помещает руку в рукав/через ткань, прекратить бесконечное усиление отрицательного промпта. Надёжнее создать **фотографически правдоподобную постановку отдельно** и использовать inpainting / композитинг руки и худи с правильной маской.
- Проверить наличие пяти пальцев, точки хвата, натяжения ткани, непрерывности предплечья и разделение руки/вещи.
- На фоне light/dark проверить контраст границ и отсутствие ореолов; прозрачность должна быть настоящим alpha, а не нарисованной шахматной клеткой.
- Реализм **не подтверждает достоверность проверки**: изображения остаются художественными, их нельзя выдавать за клиентские фотографии.
- Codex не запускать до отдельного утверждения полноценной визуальной системы этапа 02.
