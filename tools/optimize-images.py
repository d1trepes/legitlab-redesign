"""Оптимизированные копии фото для сайта: assets/ и content/ → site/img/ (WebP нужных размеров).
Запуск из корня репозитория: python3 tools/optimize-images.py  (нужен Pillow с WebP).
Исходники в assets/ и content/ не меняются. Новый размер — добавить строку ниже."""
from PIL import Image
import os

def save(src, dst, w=None, h=None, q=78):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src); im.load()
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'A' in im.mode else 'RGB')
    if w and im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    if h and im.height > h: im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=q, method=6)

# кадры облака и iPhone: f — 320 px (карточки, миниатюры), v — 640 px (экран iPhone)
for n in ['1-overall', '2-tag', '3-label', '4-seams', '5-hardware', '6-logo', '7-inside']:
    save(f'assets/v3/detail-{n}.png', f'site/img/frames/f{n[0]}.webp', w=320, q=76)
    save(f'assets/v3/detail-{n}.png', f'site/img/frames/v{n[0]}.webp', w=640, q=74)
save('assets/v3/hero-puffer.png', 'site/img/hero-puffer.webp', h=1080, q=80)
save('assets/v3/final-person.png', 'site/img/final-person.webp', h=1400, q=80)
for n in ['outerwear-wide', 'sneakers-wide']:
    for w in (800, 1400): save(f'assets/v3/cat-{n}.png', f'site/img/cats/{n}-{w}.webp', w=w, q=74)
for n in ['clothing', 'bags', 'accessories']:
    for w in (600, 1000): save(f'assets/v2/cat-{n}.png', f'site/img/cats/{n}-{w}.webp', w=w, q=74)
# 16 проверок главной (decisions/22-photos.md)
for i in 'AXNH7B W47H8W 817FVB 1WB5ON IRJXHR Z9EWEH 4U462Q MXVU0I N59BDU 01LKHM 392CVO ZHM645 YE88LN 22HOYN LVIWH2 BK9NMB'.split():
    save(f'content/catalog-photos/{i}.jpg', f'site/img/checks/{i}.webp', w=700, q=80)
for n in ['amiri', 'moncler', 'balenciaga-track']:
    save(f'content/article-covers/{n}.jpg', f'site/img/articles/{n}.webp', q=82)
