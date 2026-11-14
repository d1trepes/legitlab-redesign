/* LEGIT LAB — главная. Поведение собрано по decisions/25-prototype.html и 25-build-prompt.md */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const RAW = 'https://raw.githubusercontent.com/d1trepes/legitlab-redesign/main/';
const root = document.documentElement;

/* ---------- уменьшить движение: только системная настройка ---------- */
const mq = matchMedia('(prefers-reduced-motion: reduce)');
let RM = mq.matches;
const setRM = v => { RM = v; root.classList.toggle('rm', v); };
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
  root.style.setProperty('--sheetH', sheet.offsetHeight + 'px');
  W = scene.clientWidth; H = scene.clientHeight;
  msg.style.top = (H / 2 + 112) + 'px';
  TH = Math.min(H * .88, 540); thing.style.height = TH + 'px';
};
addEventListener('resize', size); size();
document.fonts && document.fonts.ready.then(size);

let mx = 0, my = 0, rx = 0, ry = 0, clickT = 0, p = 0;
scene.addEventListener('pointermove', e => {
  const r = scene.getBoundingClientRect();
  mx = (e.clientX - r.left) / r.width * 2 - 1; my = (e.clientY - r.top) / r.height * 2 - 1;
});
scene.addEventListener('pointerleave', () => { mx = 0; my = 0; });
const scrollP = () => clamp((scrollY - hero.offsetTop) / ((hero.offsetHeight - innerHeight) * .5));
const toggle = () => {
  clickT = clickT > .5 || p > .5 ? 0 : 1;
  if (clickT === 0 && scrollP() > .02) scrollTo({ top: hero.offsetTop, behavior: RM ? 'auto' : 'smooth' });
};
scene.addEventListener('click', toggle);
scene.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

let catsTop = cats.offsetTop;
addEventListener('resize', () => { catsTop = cats.offsetTop; });
let heroVisible = true;
function frame(t) {
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
let hdrState = '';
function header() {
  const y = scrollY, st = y < innerHeight * .25 ? 'top' : y < cats.offsetTop - 40 ? 'hide' : 'solid';
  if (st === hdrState) return; hdrState = st;
  hdr.classList.toggle('hide', st === 'hide'); hdr.classList.toggle('solid', st === 'solid');
}
requestAnimationFrame(frame);
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
setTimeout(() => { sheet.style.animation = 'none'; }, 1300);

/* ---------- 3. iPhone ---------- */
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
  if (i === 0) shot1();
  if (i === 1) { lookI = 1; look(); }
}
new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) { clearT(); cur = -1; }
  else show(Math.min(2, Math.floor(howP() * 3)));
})).observe(how);
const howP = () => clamp((scrollY - how.offsetTop) / (how.offsetHeight - innerHeight));
addEventListener('scroll', () => {
  const r = how.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  show(Math.min(2, Math.floor(howP() * 3)));
}, { passive: true });
steps.forEach(s => s.addEventListener('click', () => {
  const i = +s.dataset.i;
  scrollTo({ top: how.offsetTop + (how.offsetHeight - innerHeight) * (i / 3 + .12), behavior: RM ? 'auto' : 'smooth' });
}));
const fit = () => { $('#phoneFit').style.transform = `scale(${Math.min(1, (innerHeight - 110) / 650)})`; };
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
  const cols = [[], [], [], []];
  C.filter(c => filter === 'all' || c.verdict === filter).forEach((c, i) => cols[i % 4].push(c));
  mas.innerHTML = cols.map(col => '<div>' + col.map(c =>
    `<a class="chk" href="#" data-go="/checks/${esc(c.id)}" data-r><div class="ph"><img src="img/checks/${esc(c.id)}.webp" style="aspect-ratio:${c.ar}" alt="${esc(c.brand)}, ${esc(c.category)}" loading="lazy" decoding="async"><span class="vd-p ${c.verdict === 'Оригинал' ? 'o' : 'r'}">${esc(c.verdict)}</span></div><div class="nm"><b>${esc(c.brand)}</b><span>${esc(c.category)}</span></div></a>`
  ).join('') + '</div>').join('');
  observe();
};
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
render(); observe();
})();
