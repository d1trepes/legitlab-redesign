/* LEGIT LAB — главная. Поведение собрано по decisions/25-prototype.html и 25-build-prompt.md */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const RAW = 'https://raw.githubusercontent.com/d1trepes/legitlab-redesign/main/';
const root = document.documentElement;
// мобильная версия (до 1023 px) и телефон (до 767 px) — chats/4-mobile.md
const MQ = matchMedia('(max-width:1023px)'), PH = matchMedia('(max-width:767px)');
const isM = () => MQ.matches;
// облегчённый режим: «уменьшить движение» или экономия трафика
const nc = navigator.connection || {};
const LITE_DEV = !!nc.saveData;

/* ---------- уменьшить движение: только системная настройка ---------- */
const mq = matchMedia('(prefers-reduced-motion: reduce)');
let RM = mq.matches;
const setRM = v => { RM = v; root.classList.toggle('rm', v); root.classList.toggle('lite', v || LITE_DEV); };
setRM(RM);
mq.addEventListener && mq.addEventListener('change', e => setRM(e.matches));

/* ---------- окно «Страница в разработке» ---------- */
const modal = $('#modal'), modalX = $('#modalX');
let lastFocus = null, hideT;
const openModal = () => {
  lastFocus = document.activeElement; clearTimeout(hideT);
  modal.hidden = false; void modal.offsetWidth; modal.classList.add('on'); modalX.focus();
};
const closeModal = () => {
  if (!modal.classList.contains('on')) return;
  modal.classList.remove('on');
  hideT = setTimeout(() => { modal.hidden = true; }, RM ? 0 : 260);
  lastFocus && lastFocus.focus && lastFocus.focus();
};
document.addEventListener('click', e => {
  const a = e.target.closest('[data-go]');
  if (!a) return;
  e.preventDefault(); e.stopPropagation(); openModal();
});
modalX.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (!e.target.closest('.box')) closeModal(); });
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('on')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') { e.preventDefault(); modalX.focus(); }
});
$('.hdr .logo').addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); });

/* ---------- 1. облако из 7 кадров ---------- */
// оптимизированные копии кадров (assets/v3/detail-*.png → site/img/frames): f — 320 px для облака и миниатюр, v — 640 px для экрана iPhone
const IMG = {}, BIG = {};
for (let i = 1; i <= 7; i++) { IMG['d' + i] = `img/frames/f${i}.webp`; BIG['d' + i] = `img/frames/v${i}.webp`; }
const FR = [['Общий вид', 'd1'], ['Бирка', 'd2'], ['Этикетка', 'd3'], ['Швы', 'd4'], ['Фурнитура', 'd5'], ['Логотип', 'd6'], ['Изнанка', 'd7']];
// позиции в облаке: x, y, z, поворот Y, наклон Z (для сцены 1344×480)
const CL = [[-560, -45, -40, 22, -4], [-350, 110, 170, 14, 3], [-290, -160, -240, 10, -2], [310, -165, -200, -10, 3], [330, 112, 190, -16, -3], [570, -85, -70, -22, 4], [590, 128, -30, -20, -3]];
const pin = $('#hero .pin'), cats = $('.cats'), hdr = $('#hdr');
const cloud = $('#cloud'), scene = $('#scene'), thing = $('#thing'), msg = $('#msg'), hero = $('#hero'), sheet = $('#sheet');
const els = FR.map(([t, f]) => {
  const d = document.createElement('div'); d.className = 'fr';
  d.innerHTML = `<img src="${IMG[f]}" width="120" height="150" alt="" decoding="async">${t}`;
  cloud.appendChild(d); return d;
});
let W = 1344, H = 480, TH = 420, AR = .8;
const setAR = () => { if (thing.naturalWidth) AR = thing.naturalWidth / thing.naturalHeight; };
thing.addEventListener('load', setAR); setAR();
const size = () => {
  if (isM()) return;
  root.style.setProperty('--sheetH', sheet.offsetHeight + 'px');
  W = scene.clientWidth; H = scene.clientHeight;
  msg.style.top = (H / 2 + 112) + 'px';
  TH = Math.min(H * .88, 540); thing.style.height = TH + 'px';
};
addEventListener('resize', size); size();
document.fonts && document.fonts.ready.then(size);

let mx = 0, my = 0, rx = 0, ry = 0, clickT = 0, p = 0;
scene.addEventListener('pointermove', e => {
  if (isM()) return;
  const r = scene.getBoundingClientRect();
  mx = (e.clientX - r.left) / r.width * 2 - 1; my = (e.clientY - r.top) / r.height * 2 - 1;
});
scene.addEventListener('pointerleave', () => { mx = 0; my = 0; });
const scrollP = () => clamp((scrollY - hero.offsetTop) / ((hero.offsetHeight - innerHeight) * .5));
const toggle = () => {
  if (isM()) return;
  clickT = clickT > .5 || p > .5 ? 0 : 1;
  if (clickT === 0 && scrollP() > .02) scrollTo({ top: hero.offsetTop, behavior: RM ? 'auto' : 'smooth' });
};
scene.addEventListener('click', toggle);
scene.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

let catsTop = cats.offsetTop;
addEventListener('resize', () => { catsTop = cats.offsetTop; });
let heroVisible = true, dRun = false;
const startD = () => { if (!dRun && !isM()) { dRun = true; hdrState = ''; requestAnimationFrame(frame); } };
function frame(t) {
  if (isM()) { dRun = false; return; }
  requestAnimationFrame(frame);
  // первый экран ушёл из вида — не тратим кадры на облако
  heroVisible = scrollY < hero.offsetTop + hero.offsetHeight;
  header();
  if (!heroVisible) return;
  const target = Math.max(scrollP(), clickT);
  p = RM ? target : lerp(p, target, .085); if (Math.abs(p - target) < .001) p = target;
  const k = RM ? 0 : 1, ep = ease(p), flat = 1 - ep;
  rx = RM ? 0 : lerp(rx, -my * 7 * k, .06); ry = RM ? 0 : lerp(ry, mx * 11 * k, .06);
  const sx = clamp(W / 1344, .75, 1.15), sy = clamp(H / 480, .75, 1.3);
  cloud.style.transform = `rotateX(${rx * flat}deg) rotateY(${ry * flat}deg)`;
  const gap = Math.min(148, (W - 80) / 7);
  els.forEach((el, i) => {
    const q = ease(clamp((p - i * .035) / (1 - 6 * .035)));
    const c = CL[i], fl = RM ? 0 : Math.sin(t / 1000 * .7 + i * 1.3) * 7 * (1 - q);
    const x = lerp(c[0] * sx, (i - 3) * gap, q), y = lerp(c[1] * sy + fl, -10, q), z = lerp(c[2], 0, q);
    el.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${lerp(c[3], 0, q)}deg) rotateZ(${lerp(c[4], 0, q)}deg)`;
  });
  thing.style.opacity = 1 - .78 * ep;
  // вещь стоит на месте: обратный поворот гасит поворот облака, двигаются только кадры
  const sc = 1 - .06 * ep;
  thing.style.transform = `rotateY(${-ry * flat}deg) rotateX(${-rx * flat}deg) translate3d(${-TH * AR * sc / 2}px,${-TH * sc / 2}px,0) scale(${sc})`;
  msg.style.opacity = clamp((p - .7) / .3);
  // карточки: чёрный лист наезжает, первый экран чуть уходит вглубь
  catsTop = cats.offsetTop;
  const cv = clamp((scrollY + innerHeight - catsTop) / (innerHeight * .6));
  pin.style.transform = RM ? '' : `translateY(${-30 * cv}px)`;
  pin.style.opacity = 1 - .25 * cv;
}
// шапка: видна наверху, прячется, пока лист наезжает, возвращается с подложкой
// шапка над чёрным листом — чёрная, над светлым — светлая
const darks = $$('.dk'); let hdrDk = false;
const hdrTone = () => {
  const y = hdr.offsetHeight / 2;
  const d = darks.some(el => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
  if (d !== hdrDk) { hdrDk = d; hdr.classList.toggle('ondk', d); }
};
let hdrState = '';
function header() {
  hdrTone();
  const y = scrollY, st = y < innerHeight * .25 ? 'top' : y < cats.offsetTop - 40 ? 'hide' : 'solid';
  if (st === hdrState) return; hdrState = st;
  hdr.classList.toggle('hide', st === 'hide'); hdr.classList.toggle('solid', st === 'solid');
}
startD();
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
setTimeout(() => { sheet.style.animation = 'none'; }, 1300);

/* ---------- 3. iPhone ---------- */
const segs = $$('#segs button'), stx = $$('#stx>div');
const how = $('#how'), track = $('#track'), steps = $$('.st'), s1 = $('#s1'), frameNo = $('#frameNo');
const thumbs = $('#thumbs'); for (let i = 0; i < 7; i++) thumbs.appendChild(document.createElement('i'));
const th = [...thumbs.children];
const g7 = $('#grid7'), view = $('#view');
FR.forEach(([, f]) => {
  const i = document.createElement('i'); i.style.backgroundImage = `url(${IMG[f]})`; g7.appendChild(i);
  const im = document.createElement('img'); im.src = BIG[f]; im.alt = ''; im.decoding = 'async'; im.loading = 'lazy'; view.insertBefore(im, view.firstChild);
});
const gi = [...g7.children], vi = [...view.querySelectorAll('img')].reverse();
// QR: условный узор с тремя опорными квадратами
(() => {
  const n = 29, q = $('#qr'); let s = '', seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const fin = (x, y) => { s += `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`; };
  const inF = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inF(x, y) && rnd() > .52) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  fin(0, 0); fin(n - 7, 0); fin(0, n - 7); q.innerHTML = s;
})();
let cur = -1, timers = [];
const clearT = () => { timers.forEach(clearTimeout); timers = []; };
const later = (f, ms) => timers.push(setTimeout(f, ms));
function shot1() { // съёмка: кадр 1 готов, кадр 2 снимается
  th.forEach((t, i) => { t.style.backgroundImage = i === 0 ? `url(${IMG.d1})` : ''; t.classList.toggle('cur', i === 1); });
  frameNo.textContent = 'Кадр 2 из 7'; s1.classList.remove('snap');
  if (RM) return;
  later(() => { s1.classList.add('snap'); th[1].style.backgroundImage = `url(${IMG.d2})`; th[1].classList.remove('cur'); th[2].classList.add('cur'); }, 1500);
  later(() => { s1.classList.remove('snap'); frameNo.textContent = 'Кадр 3 из 7'; }, 2100);
}
let lookI = 1;
function look() {
  gi.forEach((g, i) => g.classList.toggle('look', i === lookI));
  vi.forEach((g, i) => g.classList.toggle('on', i === lookI));
  $('#viewL').textContent = FR[lookI][0];
  if (RM) return;
  later(() => { lookI = (lookI + 1) % 7; look(); }, 1600);
}
function show(i) {
  if (i === cur) return; cur = i; clearT();
  track.style.transform = `translateX(${-i * 33.3333}%)`;
  steps.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-pressed', k === i); });
  segs.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-pressed', k === i); });
  stx.forEach((s, k) => s.classList.toggle('on', k === i));
  if (i === 0) shot1();
  if (i === 1) { lookI = 1; look(); }
}
new IntersectionObserver(es => es.forEach(e => {
  if (isM()) return;
  if (!e.isIntersecting) { clearT(); cur = -1; }
  else show(Math.min(2, Math.floor(howP() * 3)));
})).observe(how);
const howP = () => clamp((scrollY - how.offsetTop) / (how.offsetHeight - innerHeight));
addEventListener('scroll', () => {
  if (isM()) return;
  const r = how.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  show(Math.min(2, Math.floor(howP() * 3)));
}, { passive: true });
steps.forEach(s => s.addEventListener('click', () => {
  const i = +s.dataset.i;
  scrollTo({ top: how.offsetTop + (how.offsetHeight - innerHeight) * (i / 3 + .12), behavior: RM ? 'auto' : 'smooth' });
}));
const fit = () => { if (isM()) return; $('#phoneFit').style.transform = `scale(${Math.min(1, (innerHeight - 110) / 650)})`; };
addEventListener('resize', fit); fit();
show(0);

/* ---------- 4. проверки: 16 ID и пропорции — decisions/22-photos.md, поля — content/catalog.json ---------- */
const PICK = [['AXNH7B', '4/5'], ['W47H8W', '1/1'], ['817FVB', '3/4'], ['1WB5ON', '4/5'], ['IRJXHR', '1/1'], ['Z9EWEH', '3/4'], ['4U462Q', '4/5'], ['MXVU0I', '4/5'],
  ['N59BDU', '3/4'], ['01LKHM', '1/1'], ['392CVO', '4/5'], ['ZHM645', '3/4'], ['YE88LN', '1/1'], ['22HOYN', '4/5'], ['LVIWH2', '4/5'], ['BK9NMB', '1/1']];
// запасные данные на случай, если catalog.json не загрузится
const FALLBACK = { AXNH7B: ['Amiri', 'Одежда', 'Оригинал'], W47H8W: ['Moncler', 'Верхняя одежда', 'Реплика'], '817FVB': ['Gucci', 'Сумки', 'Оригинал'], '1WB5ON': ['Air Jordan', 'Кроссовки', 'Реплика'],
  IRJXHR: ['Stone Island', 'Одежда', 'Оригинал'], Z9EWEH: ['MCM', 'Аксессуары', 'Реплика'], '4U462Q': ['On Running', 'Кроссовки', 'Оригинал'], MXVU0I: ['Balenciaga', 'Одежда', 'Реплика'],
  N59BDU: ['Nike', 'Обувь', 'Оригинал'], '01LKHM': ['Balenciaga', 'Кроссовки', 'Реплика'], '392CVO': ['Gucci', 'Сумки', 'Оригинал'], ZHM645: ['Louis Vuitton', 'Сумки', 'Реплика'],
  YE88LN: ['Off-White', 'Одежда', 'Оригинал'], '22HOYN': ['Moncler', 'Верхняя одежда', 'Реплика'], LVIWH2: ['Balenciaga', 'Кроссовки', 'Оригинал'], BK9NMB: ['Louis Vuitton', 'Аксессуары', 'Реплика']};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let C = PICK.map(([id, ar]) => ({ id, ar, brand: FALLBACK[id][0], category: FALLBACK[id][1], verdict: FALLBACK[id][2], photo: `content/catalog-photos/${id}.jpg` }));
let filter = 'all';
const mas = $('#mas');
const render = () => {
  // телефон — 2 колонки и 8 проверок, планшет — 3 и 9, десктоп — 4 и все
  const n = !isM() ? 4 : PH.matches ? 2 : 3, lim = !isM() ? 99 : n === 2 ? 8 : 9;
  const cols = Array.from({ length: n }, () => []);
  C.filter(c => filter === 'all' || c.verdict === filter).slice(0, lim).forEach((c, i) => cols[i % n].push(c));
  mas.innerHTML = cols.map(col => '<div>' + col.map(c =>
    `<a class="chk" href="#" data-go="/checks/${esc(c.id)}" data-r><div class="ph"><picture><source media="(max-width:1023px)" srcset="img/checks/${esc(c.id)}-400.webp"><img src="img/checks/${esc(c.id)}.webp" width="400" height="500" style="aspect-ratio:${c.ar}" alt="${esc(c.brand)}, ${esc(c.category)}" loading="lazy" decoding="async"></picture><span class="vd-p ${c.verdict === 'Оригинал' ? 'o' : 'r'}">${esc(c.verdict)}</span></div><div class="nm"><b>${esc(c.brand)}</b><span>${esc(c.category)}</span></div></a>`
  ).join('') + '</div>').join('');
  observe(); lazyFade && lazyFade(mas);
};
let lazyFade = null;
$$('#flt .btn').forEach(b => {
  b.setAttribute('aria-pressed', b.dataset.f === 'all');
  b.addEventListener('click', () => {
    if (filter === b.dataset.f) return;
    $$('#flt .btn').forEach(x => { const on = x === b; x.classList.toggle('fill', on); x.classList.toggle('out', !on); x.setAttribute('aria-pressed', on); });
    filter = b.dataset.f;
    if (RM) { render(); return; }
    mas.classList.add('fade'); setTimeout(() => { render(); mas.classList.remove('fade'); }, 200);
  });
});

/* ---------- данные из content/*.json ---------- */
const getJSON = path => fetch(RAW + path, { cache: 'no-cache' }).then(r => r.ok ? r.json() : Promise.reject(r.status));
getJSON('content/catalog.json').then(d => {
  const by = Object.fromEntries((d.items || []).map(it => [it.id, it]));
  // только публичные поля: id, brand, category, verdict, photo
  const next = C.map(c => { const it = by[c.id]; return it ? { ...c, brand: it.brand, category: it.category, verdict: it.verdict } : c; });
  // перерисовываем ленту, только если данные отличаются от встроенных — иначе фото не перезагружаются и не мигают
  if (JSON.stringify(next) !== JSON.stringify(C)) { C = next; render(); }
}).catch(() => {});
getJSON('content/articles.json').then(d => {
  (d.items || []).forEach(it => {
    const a = document.querySelector(`.art[data-slug="${CSS.escape(it.slug)}"]`);
    if (!a) return;
    if (it.url) a.href = it.url;
    if (it.brand) a.querySelector('.br').textContent = it.brand;
    if (it.lead) a.querySelector('.ld').textContent = it.lead;
  });
}).catch(() => {});
getJSON('content/links.json').then(d => {
  $$('[data-link]').forEach(a => { const u = d[a.dataset.link]; if (u) a.href = u; });
}).catch(() => {});

/* ---------- появление ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, sib = [...el.parentNode.children].filter(x => x.hasAttribute('data-r'));
  el.style.transitionDelay = Math.min(sib.indexOf(el), 6) * 70 + 'ms';
  el.classList.add('in'); io.unobserve(el);
}), { rootMargin: '0px 0px -8% 0px' });
function observe() { $$('[data-r]:not(.in)').forEach(el => io.observe(el)); }

/* =====================================================================
   МОБИЛЬНАЯ ВЕРСИЯ (до 1023 px) — chats/4-mobile.md. На десктопе не работает.
   ===================================================================== */
const lite = () => root.classList.contains('lite');
const tsh = $('#tsh');

/* ---------- 1. облако: собирается прокруткой (как на десктопе), касанием, крутится свайпом ---------- */
// высота экрана фиксируется в px: панели Telegram и Safari при прокрутке не дёргают первый экран
let VW = root.clientWidth;
const setVH = () => root.style.setProperty('--vh', (root.clientHeight || innerHeight) + 'px');
// координаты кадров для сцены 390×410 (от центра, px), z, поворот Y, наклон Z
// две сверху, три слева, две справа
const CM = [[-148, -128, 0, 10, -4], [-150, 6, 10, 10, 3], [-146, 138, -10, 8, -2], [-72, -150, 16, 4, 3], [78, -152, 6, -4, -3], [148, -40, 14, -10, 3], [146, 112, -6, -8, -2]];
const hm = { ry: 0, v: 0, drag: false, down: false, moved: false, x0: 0, ry0: 0, lx: 0, lt: 0, P: 0, T: 0, from: 0, t0: 0, raf: 0, last: 0, sp: 0 };
let MW = 390, MH = 410, JH = 280, FS = 1, FH = 112, FW = 74;
function mSize() {
  if (!isM()) return;
  root.style.setProperty('--sheetH', sheet.offsetHeight + 'px');
  MW = scene.clientWidth; MH = scene.clientHeight;
  JH = Math.round(Math.min(MH * .68, MW * .74 / AR)); thing.style.height = JH + 'px';
  FS = clamp(Math.min(MH / 410, MW / 390), .72, 1.3);
  FW = els[0].offsetWidth || 74; FH = els[0].offsetHeight || 112;
  tsh.style.width = Math.round(JH * AR * .9) + 'px';
  tsh.style.transform = `translate(-50%,${Math.round(JH * .47)}px)`;
  mApply();
}
function mApply() {
  const P = hm.P, e = ease(P), f = 1 - e, L = lite();
  const kx = Math.min(MW / 390, 1.6), ky = MH / 410;
  // собранные кадры: строка сообщения, под ней 4 + 3
  const GS = Math.min(1.25, (MW - 40 - 30) / (4 * FW), (MH - 40 - 46) / (2 * FH));
  const gw = FW * GS + 10, gh = FH * GS, t0 = -(36 + 2 * gh + 10) / 2;
  msg.style.top = (MH / 2 + t0) + 'px';
  const ryc = L ? 0 : hm.ry * f;
  cloud.style.transform = ryc ? `rotateY(${ryc}deg)` : '';
  els.forEach((el, i) => {
    const c = CM[i], q = ease(clamp((P - i * .04) / (1 - 6 * .04)));
    const gx = i < 4 ? (i - 1.5) * gw : (i - 5) * gw, gy = t0 + 36 + gh / 2 + (i < 4 ? 0 : gh + 10);
    const x = lerp(c[0] * kx, gx, q), y = lerp(c[1] * ky, gy, q), z = L ? 0 : lerp(c[2], 0, q);
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${L ? 0 : lerp(c[3], 0, q).toFixed(2)}deg) rotateZ(${lerp(c[4], 0, q).toFixed(2)}deg) scale(${lerp(FS, GS, q).toFixed(3)})`;
  });
  hero.classList.toggle('asm', P > .02);
  thing.style.opacity = 1 - .78 * e; tsh.style.opacity = 1 - .85 * e;
  const sc = 1 - .06 * e;
  thing.style.transform = `rotateY(${-ryc}deg) translate3d(${-JH * AR * sc / 2}px,${-JH * sc / 2}px,0) scale(${sc})`;
  msg.style.opacity = clamp((P - .7) / .3);
}
// начали листать — кадры съезжаются (короткая анимация по времени, не на каждый пиксель прокрутки);
// вернулись наверх — разъезжаются. Чёрный лист наезжает за счёт sticky, без JS.
let sq = false, autoW = 0;
const setT = v => {
  hm.T = v; hm.from = hm.P; hm.t0 = performance.now();
  scene.setAttribute('aria-pressed', !!v);
  if (RM) { hm.P = v; mApply(); return; }
  kick();
};
function mScroll() {
  sq = false;
  if (!isM()) return;
  const w = scrollY > 24 ? 1 : 0;
  if (w !== autoW) { autoW = w; if (hm.T !== w) setT(w); }
}
addEventListener('scroll', () => { if (isM() && !sq) { sq = true; requestAnimationFrame(mScroll); } }, { passive: true });
// цикл кадров крутится только во время жеста, инерции и сборки касанием
function mTick(t) {
  hm.raf = 0;
  const dt = hm.last ? Math.min(.04, (t - hm.last) / 1000) : .016; hm.last = t;
  let go = hm.drag;
  if (!hm.drag) {
    if (Math.abs(hm.ry) > .03 || Math.abs(hm.v) > .3) { hm.v += (-60 * hm.ry - 11 * hm.v) * dt; hm.ry = clamp(hm.ry + hm.v * dt, -14, 14); go = true; }
    else { hm.ry = 0; hm.v = 0; }
  }
  if (hm.P !== hm.T) { const k = (t - hm.t0) / 700; hm.P = k >= 1 ? hm.T : lerp(hm.from, hm.T, k); go = true; }
  mApply();
  if (go) hm.raf = requestAnimationFrame(mTick); else hm.last = 0;
}
const kick = () => { if (!hm.raf) { hm.last = 0; hm.raf = requestAnimationFrame(mTick); } };
const mToggle = () => setT(hm.T ? 0 : 1);
scene.addEventListener('pointerdown', e => {
  if (!isM()) return;
  hm.down = true; hm.moved = false; hm.x0 = hm.lx = e.clientX;
  if (lite() || hm.P > .3) return;
  hm.drag = true; hm.ry0 = hm.ry; hm.lt = e.timeStamp; hm.v = 0;
}, { passive: true });
scene.addEventListener('pointermove', e => {
  if (hm.down && Math.abs(e.clientX - hm.x0) > 8) hm.moved = true;
  if (!hm.drag) return;
  const dx = e.clientX - hm.x0, dt = (e.timeStamp - hm.lt) / 1000;
  hm.ry = clamp(hm.ry0 + dx / MW * 34, -14, 14);
  if (dt > 0) hm.v = lerp(hm.v, (e.clientX - hm.lx) / MW * 34 / dt, .5);
  hm.lx = e.clientX; hm.lt = e.timeStamp; kick();
}, { passive: true });
const mUp = () => { hm.down = false; if (!hm.drag) return; hm.drag = false; hm.v = clamp(hm.v, -140, 140); kick(); };
scene.addEventListener('pointerup', mUp); scene.addEventListener('pointercancel', mUp);
scene.addEventListener('click', () => { if (!isM()) return; if (hm.moved) { hm.moved = false; return; } mToggle(); });
scene.addEventListener('keydown', e => { if (isM() && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); mToggle(); } });
// парение кадров — CSS-анимация; первый экран ушёл из вида — пауза
new IntersectionObserver(es => es.forEach(e => hero.classList.toggle('off', !e.isIntersecting))).observe(hero);

/* ---------- шапка: прячется вниз, возвращается вверх с подложкой ---------- */
let lastY = scrollY, mhs = '', hq = false, menuOpen = false;
const mHdr = () => {
  if (!isM() || menuOpen) return;
  hdrTone();
  const y = scrollY, d = y - lastY; let st = mhs;
  if (y < 10) st = 'top'; else if (d > 4 && y > 60) st = 'hide'; else if (d < -4) st = 'solid';
  if (Math.abs(d) > 4 || y < 10) lastY = y;
  if (st !== mhs) { mhs = st; hdr.classList.toggle('hide', st === 'hide'); hdr.classList.toggle('solid', st === 'solid'); }
};
addEventListener('scroll', () => { if (isM() && !hq) { hq = true; requestAnimationFrame(() => { hq = false; mHdr(); }); } }, { passive: true });

/* ---------- меню ---------- */
const mbtn = $('#mbtn'), mm = $('#mmenu'); let saveY = 0, mmT;
const lockScroll = on => {
  const b = document.body.style;
  if (on) { saveY = scrollY; b.position = 'fixed'; b.top = -saveY + 'px'; b.left = b.right = '0'; }
  else { b.position = b.top = b.left = b.right = ''; scrollTo(0, saveY); lastY = saveY; }
};
const openMenu = () => {
  if (menuOpen) return; menuOpen = true; clearTimeout(mmT);
  mm.hidden = false; void mm.offsetWidth; mm.classList.add('on');
  hdr.classList.add('mon'); mbtn.setAttribute('aria-expanded', 'true'); mbtn.setAttribute('aria-label', 'Закрыть меню');
  lockScroll(true);
};
const closeMenu = (focus) => {
  if (!menuOpen) return; menuOpen = false;
  mm.classList.remove('on'); hdr.classList.remove('mon');
  mbtn.setAttribute('aria-expanded', 'false'); mbtn.setAttribute('aria-label', 'Меню');
  lockScroll(false);
  mmT = setTimeout(() => { mm.hidden = true; }, lite() || RM ? 0 : 460);
  if (focus) mbtn.focus();
};
mbtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
mm.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (menuOpen && e.key === 'Escape') closeMenu(true); });

/* ---------- окно: лист снизу, закрытие свайпом вниз ---------- */
const box = $('.modal .box'); let by0 = null, bdy = 0;
box.addEventListener('pointerdown', e => {
  if (!isM() || e.target.closest('button')) return;
  by0 = e.clientY; bdy = 0; box.style.transition = 'none'; box.setPointerCapture && box.setPointerCapture(e.pointerId);
});
box.addEventListener('pointermove', e => { if (by0 === null) return; bdy = Math.max(0, e.clientY - by0); box.style.transform = `translateY(${bdy}px)`; });
const boxUp = () => { if (by0 === null) return; by0 = null; box.style.transition = ''; box.style.transform = ''; if (bdy > 70) closeModal(); };
box.addEventListener('pointerup', boxUp); box.addEventListener('pointercancel', boxUp);

/* ---------- 3. iPhone: свайп и автолистание, пока блок на экране ---------- */
let autoT = 0, howOn = false, mIdx = 0;
const schedule = () => {
  clearTimeout(autoT);
  if (!isM() || !howOn || lite()) return;
  autoT = setTimeout(() => { show((cur + 1) % 3); schedule(); }, 4500);
};
new IntersectionObserver(es => es.forEach(e => {
  if (!isM()) return;
  howOn = e.isIntersecting;
  if (howOn) { cur = -1; show(mIdx); schedule(); }
  else { mIdx = Math.max(0, cur); clearT(); clearTimeout(autoT); }
}), { threshold: .25 }).observe(how);
segs.forEach(b => b.addEventListener('click', () => { show(+b.dataset.i); schedule(); }));
const iph = $('.iph'); let sx0 = null, sdx = 0, swp = false;
const trackTo = d => { track.style.transform = `translateX(calc(${-Math.max(0, cur) * 33.3333}% + ${d}px))`; };
iph.addEventListener('pointerdown', e => { if (!isM()) return; sx0 = e.clientX; sdx = 0; swp = false; }, { passive: true });
iph.addEventListener('pointermove', e => {
  if (sx0 === null) return;
  sdx = e.clientX - sx0;
  if (!swp && Math.abs(sdx) > 8) { swp = true; track.style.transition = 'none'; clearTimeout(autoT); }
  if (swp) {
    const k = iph.offsetWidth / iph.getBoundingClientRect().width; // экран телефона уменьшен
    let d = sdx * k; if ((cur <= 0 && d > 0) || (cur === 2 && d < 0)) d *= .35;
    trackTo(d);
  }
}, { passive: true });
const iphUp = cancel => {
  if (sx0 === null) return; sx0 = null;
  if (!swp) return;
  track.style.transition = '';
  const n = !cancel && Math.abs(sdx) > 40 ? clamp(cur + (sdx < 0 ? 1 : -1), 0, 2) : cur;
  if (n !== cur) show(n); else trackTo(0);
  schedule();
};
iph.addEventListener('pointerup', () => iphUp(false)); iph.addEventListener('pointercancel', () => iphUp(true));

/* ---------- 5. статьи: полоса прокрутки ленты ---------- */
const arow = $('#arow'), abar = $('#abar i'); let aq = false;
const aUpd = () => {
  aq = false;
  const fr = arow.clientWidth / arow.scrollWidth, max = arow.scrollWidth - arow.clientWidth;
  abar.style.width = Math.min(100, fr * 100) + '%';
  abar.style.transform = `translateX(${max > 0 ? arow.scrollLeft / max * (1 / fr - 1) * 100 : 0}%)`;
};
arow.addEventListener('scroll', () => { if (!aq) { aq = true; requestAnimationFrame(aUpd); } }, { passive: true });

/* ---------- фото: подложка, проявление после загрузки ---------- */
lazyFade = (scope = document) => {
  if (!isM()) return;
  scope.querySelectorAll('img[loading="lazy"]').forEach(im => {
    if (im.closest('.view') || im.classList.contains('lz') || (im.complete && im.naturalWidth)) return;
    im.classList.add('lz');
    const ok = () => im.classList.add('ok');
    im.addEventListener('load', ok, { once: true }); im.addEventListener('error', ok, { once: true });
  });
};

/* ---------- переключение десктоп ↔ мобильная ---------- */
const enterM = () => {
  VW = root.clientWidth; setVH();
  pin.style.transform = pin.style.opacity = '';
  hdr.classList.remove('hide', 'solid'); mhs = ''; lastY = scrollY;
  $('#phoneFit').style.transform = '';
  hm.P = hm.T = 0;
  mSize(); mScroll(); aUpd(); lazyFade();
  if (how.getBoundingClientRect().top < innerHeight) { cur = -1; show(0); }
};
const enterD = () => {
  closeMenu(); clearTimeout(autoT);
  thing.style.height = ''; tsh.removeAttribute('style'); cloud.style.transform = ''; root.style.removeProperty('--vh');
  clickT = 0; p = 0; hero.classList.remove('asm');
  size(); fit(); startD(); cur = -1; show(0);
};
MQ.addEventListener && MQ.addEventListener('change', () => { (isM() ? enterM : enterD)(); render(); });
PH.addEventListener && PH.addEventListener('change', () => { if (isM()) { render(); aUpd(); } });
// пересчёт только при смене ширины (поворот экрана), не при прыжках панелей браузера
addEventListener('resize', () => { if (isM() && root.clientWidth !== VW) { VW = root.clientWidth; setVH(); mSize(); aUpd(); } });
document.fonts && document.fonts.ready.then(() => { if (isM()) mSize(); });
thing.addEventListener('load', () => { if (isM()) mSize(); });
if (isM()) enterM();
render(); observe();
})();
