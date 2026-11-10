# Legit Lab — HERO Asset Manifest

Обновлено: 08.11.2026. Статус: **[ФАКТ] оригиналы пользователя загружены и проверены в GitHub main**.

## Source of truth

**[РЕШЕНИЕ]** Единственный источник изображений для hero — прикреплённый пользователем файл «Два худи_ черный и белый.png». Его точная копия, без редактирования и перекодирования, хранится в [assets/hero/source/hoodies-original-user.png](../assets/hero/source/hoodies-original-user.png).

- Размер: **1536 × 1024 px**, RGBA, прозрачный фон.
- SHA-256 оригинала: `d106bb2fe95a9c2bc94a85d28d6319a5729d65cb6eb1a5d552337e12476840ab`.
- Этот исходник не является свидетельством реальной экспертной проверки. Не выдавать иллюстрацию за проверенный кейс.

## Точное разделение и текущие пути

Исходник **разрезан вертикально без изменения пикселей**:
- слева: x = 0…770, **771 × 1024** — [black-hoodie-hand.png](../assets/hero/black-hoodie-hand.png);
- справа: x = 771…1535, **765 × 1024** — [white-hoodie-hand.png](../assets/hero/white-hoodie-hand.png).

Проверена полная идентичность RGBA-пикселей каждой половины соответствующему прямоугольнику исходного изображения. Никакой генерации, ретуши, новой маски, изменения руки/ткани/бирок, пересвета или композиционной коррекции.

| Тема | Новое каноническое PNG | Существующие пути, **содержимое заменено** |
| --- | --- | --- |
| Light (default) | `assets/hero/black-hoodie-hand.png` | `assets/hero/hero-hoodie-black-light.png`, `assets/hero/hero-hoodie-black-light.webp` |
| Dark | `assets/hero/white-hoodie-hand.png` | `assets/hero/hero-hoodie-white-dark.png`, `assets/hero/hero-hoodie-white-dark.webp` |

WebP перекодированы из новых PNG **lossless**, проверено полное совпадение декодированных RGBA-пикселей с PNG. Существующие ссылки для сайта сохраняются, но больше не ведут на старые нереалистичные версии. Старые версии остались только в истории Git, не в текущем дереве `main`.

## SHA-256 рабочих файлов

| Файл | SHA-256 |
| --- | --- |
| `black-hoodie-hand.png` и `hero-hoodie-black-light.png` | `c5b329445beaee6261afc584dd42c75ce99ff2e919bcda563b6aaf7abde52165` |
| `white-hoodie-hand.png` и `hero-hoodie-white-dark.png` | `30cc7c789068becc74b212d60281fd03fd63dfb7b40cdcdccc69ae6c7ad5d004` |
| `hero-hoodie-black-light.webp` | `e3b51640c14e07e1c67c9a1e006ed0230496c3d212fa34530a9f87fa728320fc` |
| `hero-hoodie-white-dark.webp` | `f6d9e34931b8aa427caf135b537d5f02b708e9eebf3d34c0b539d17da5a46759` |

## Правила дальнейшего использования

- Сначала статично проверять обе темы на desktop 1440 / mobile 390; не менять изображения автоматически.
- Изображения отображать с `object-fit: contain` без дополнительных кропов капюшона, рукавов и бирок; нижняя часть предплечья может выходить за нижнюю границу по исходному кадру.
- Надпись LEGIT LAB, H1 и CTA держать в HTML, а не в растре.
- Код главной страницы через Codex **не запускать** до согласования завершённого этапа 02.
- Единственный источник истины при любых будущих изменениях — сохранённый оригинал пользователя выше; не возвращать старые генерации без отдельного явного решения.

См. [STAGE_02_ART_DIRECTION.md](STAGE_02_ART_DIRECTION.md), [DECISIONS.md](DECISIONS.md).
