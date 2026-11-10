import {
  BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments, LinearFilter, Mesh, PerspectiveCamera,
  PlaneGeometry, Raycaster, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer, type Texture,
} from "three";
import { viewFor, type Zone } from "./inspect";

type Options = {
  host: HTMLElement; canvas: HTMLCanvasElement;
  onPick: (zone: number | null) => void; onReady: () => void;
};

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// «Лампа эксперта»: кадр чуть светлее там, куда смотрит курсор
const FRAG = `uniform sampler2D uTex; uniform vec2 uLamp; uniform float uOn; varying vec2 vUv;
void main(){ vec3 c = texture2D(uTex, vUv).rgb; float d = distance(vUv * vec2(0.8, 1.0), uLamp * vec2(0.8, 1.0));
float k = mix(1.0, mix(0.7, 1.22, smoothstep(0.5, 0.0, d)), uOn); gl_FragColor = vec4(c * k, 1.0);
#include <colorspace_fragment>
}`;

/** Разбор вещи: кадр в перспективе наклоняется за курсором, камера подлетает к выбранной детали. */
export function mountInspect({ host, canvas, onPick, onReady }: Options) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 10, 8000);
  const tilt = new Group();
  const content = new Group();
  tilt.add(content);
  scene.add(tilt);

  const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: { uTex: { value: null }, uLamp: { value: new Vector2(0.5, 0.5) }, uOn: { value: 0 } } });
  const plane = new Mesh(new PlaneGeometry(1, 1), material);
  content.add(plane);
  const markMat = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const activeMat = new LineBasicMaterial({ color: 0xffffff });
  let marks: LineSegments[] = [];
  let zones: Zone[] = [];
  let active: number | null = null;
  const loader = new TextureLoader();
  const cache = new Map<string, Texture>();
  let ready = false;

  function brackets(z: Zone) {
    const s = 0.5 / z.zoom, c = s * 0.34, a = 0.8; // полуразмер рамки, длина уголка, пропорция кадра
    const pts: number[] = [];
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = sx * s, y = sy * s * a;
      pts.push(x, y, 0, x - sx * c, y, 0, x, y, 0, x, y - sy * c * a, 0);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    const m = new LineSegments(g, markMat);
    m.position.set(z.x - 0.5, 0.5 - z.y, 0.012);
    return m;
  }

  function setItem(url: string, next: Zone[]) {
    zones = next;
    marks.forEach((m) => {
      plane.remove(m);
      m.geometry.dispose();
    });
    marks = zones.map(brackets);
    marks.forEach((m) => plane.add(m));
    const apply = (t: Texture) => {
      material.uniforms.uTex.value = t;
      if (!ready) {
        ready = true;
        onReady();
      }
    };
    const hit = cache.get(url);
    if (hit) apply(hit);
    else
      loader.load(url, (t) => {
        t.colorSpace = SRGBColorSpace;
        t.minFilter = LinearFilter;
        t.generateMipmaps = false;
        cache.set(url, t);
        apply(t);
      });
  }
  function setActive(i: number | null) {
    active = i;
    marks.forEach((m, k) => {
      m.material = k === i ? activeMat : markMat;
      m.visible = i === null || k === i;
    });
  }

  let w = 0, h = 0;
  const P = 1500;
  function layout() {
    w = host.clientWidth;
    h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.fov = (2 * Math.atan(h / 2 / P) * 180) / Math.PI;
    camera.position.set(0, 0, P);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
  }

  const cur = { cx: 0.5, cy: 0.5, zoom: 1 };
  let px = 0, py = 0, tx = 0, ty = 0, lampOn = 0, hover = false;
  const lamp = new Vector2(0.5, 0.5);
  const ray = new Raycaster();
  const ndc = new Vector2();
  let visible = false, raf = 0, last = performance.now();

  const local = (e: PointerEvent | MouseEvent) => {
    const b = host.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -(((e.clientY - b.top) / b.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    return ray.intersectObject(plane, false)[0]?.uv ?? null;
  };
  const onMove = (e: PointerEvent) => {
    hover = true;
    tx = ndc.x;
    ty = ndc.y;
    const uv = local(e);
    tx = ndc.x;
    ty = ndc.y;
    if (uv) lamp.copy(uv);
  };
  const onLeave = () => {
    hover = false;
    tx = 0;
    ty = 0;
  };
  const onClick = (e: MouseEvent) => {
    const uv = local(e);
    if (!uv) return;
    let best: number | null = null, bd = 1;
    zones.forEach((z, i) => {
      const d = Math.hypot(uv.x - z.x, 1 - uv.y - z.y);
      if (d < 0.6 / z.zoom && d < bd) {
        bd = d;
        best = i;
      }
    });
    onPick(best === active ? null : best);
  };

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const target = viewFor(active === null ? null : zones[active] ?? null);
    const k = 1 - Math.pow(0.002, dt);
    cur.cx += (target.cx - cur.cx) * k;
    cur.cy += (target.cy - cur.cy) * k;
    cur.zoom += (target.zoom - cur.zoom) * k;
    px += (tx - px) * Math.min(1, dt * 5);
    py += (ty - py) * Math.min(1, dt * 5);
    lampOn += ((hover ? 1 : 0) - lampOn) * Math.min(1, dt * 4);
    const cover = Math.max(w / 0.8, h) * 1.08; // кадр 4:5 закрывает сцену с запасом на наклон
    const s = cover * cur.zoom;
    plane.scale.set(s * 0.8, s, 1);
    content.position.set(-(cur.cx - 0.5) * s * 0.8, (cur.cy - 0.5) * s, 0);
    tilt.rotation.set(py * 0.09, px * 0.13, 0);
    material.uniforms.uLamp.value.copy(lamp);
    material.uniforms.uOn.value = lampOn;
    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    last = performance.now();
  });
  const ro = new ResizeObserver(layout);
  layout();
  io.observe(host);
  ro.observe(host);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("click", onClick);
  raf = requestAnimationFrame(frame);

  return {
    setItem, setActive,
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
      cache.forEach((t) => t.dispose());
      marks.forEach((m) => m.geometry.dispose());
      plane.geometry.dispose();
      material.dispose();
      markMat.dispose();
      activeMat.dispose();
      renderer.dispose();
    },
  };
}
