import {
  Group, LinearFilter, LinearMipmapLinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, Plane, PlaneGeometry,
  Scene, SRGBColorSpace, TextureLoader, Vector3, WebGLRenderer, type Texture,
} from "three";
import { RING_START, RING_STEP, RING_TILT_X, RING_TILT_Z, depthTone, ringMetrics } from "./ring";

const rad = (deg: number) => (deg * Math.PI) / 180;

type Options = { host: HTMLElement; back: HTMLCanvasElement; front: HTMLCanvasElement; urls: string[]; onReady: () => void };

/** 3D-кольцо первого экрана. Две канвы делят сцену плоскостью z = 0: дальняя половина уходит за заголовок, ближняя — перед ним. */
export function mountRing({ host, back, front, urls, onReady }: Options) {
  const make = (canvas: HTMLCanvasElement, normalZ: number) => {
    const r = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    r.setClearColor(0x000000, 0);
    r.clippingPlanes = [new Plane(new Vector3(0, 0, normalZ), 0)];
    return r;
  };
  const renderers = [make(back, -1), make(front, 1)];
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 10, 6000);
  const tilt = new Group();
  tilt.rotation.order = "ZYX";
  const spin = new Group();
  tilt.add(spin);
  scene.add(tilt);

  const geo = new PlaneGeometry(1, 1);
  const frames: { face: Mesh<PlaneGeometry, MeshBasicMaterial>; rear: Mesh<PlaneGeometry, MeshBasicMaterial>; angle: number }[] = [];
  const textures: Texture[] = [];
  const loader = new TextureLoader();
  let loaded = 0;
  let ready = false;

  urls.forEach((url, i) => {
    const tex = loader.load(url, () => {
      loaded++;
      dirty = true;
    });
    tex.colorSpace = SRGBColorSpace;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.magFilter = LinearFilter;
    tex.anisotropy = 4;
    textures.push(tex);
    const angle = rad(i * RING_STEP);
    const face = new Mesh(geo, new MeshBasicMaterial({ map: tex }));
    const rear = new Mesh(geo, new MeshBasicMaterial({ map: tex }));
    face.rotation.y = angle;
    rear.rotation.y = angle + Math.PI;
    spin.add(face, rear);
    frames.push({ face, rear, angle });
  });

  let w = 0, h = 0;
  function layout() {
    w = host.clientWidth;
    h = host.clientHeight;
    if (!w || !h) return;
    const m = ringMetrics(w, h);
    camera.aspect = w / h;
    camera.fov = (2 * Math.atan(h / 2 / m.perspective) * 180) / Math.PI;
    camera.position.set(0, 0, m.perspective);
    camera.updateProjectionMatrix();
    tilt.position.set(m.cx - w / 2, h / 2 - m.cy, 0);
    frames.forEach(({ face, rear, angle }) => {
      for (const mesh of [face, rear]) {
        mesh.scale.set(m.fw, m.fh, 1);
        mesh.position.set(Math.sin(angle) * m.r, 0, Math.cos(angle) * m.r);
      }
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderers.forEach((rr) => {
      rr.setPixelRatio(dpr);
      rr.setSize(w, h, false);
    });
    dirty = true;
  }

  // движение: медленный ход + прокрутка + перетаскивание + наклон за курсором
  let angle = rad(RING_START);
  let velocity = 0;
  let dragging = false;
  let lastX = 0;
  let px = 0, py = 0, tx = 0, ty = 0;
  let scrollBase = window.scrollY;
  let dirty = true;
  let visible = true;
  let raf = 0;
  let last = performance.now();

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    lastX = e.clientX;
    host.classList.add("is-drag");
  };
  const onMove = (e: PointerEvent) => {
    const b = host.getBoundingClientRect();
    tx = ((e.clientX - b.left) / b.width) * 2 - 1;
    ty = ((e.clientY - b.top) / b.height) * 2 - 1;
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    angle += dx * 0.0045;
    velocity = dx * 0.0045 * 60;
  };
  const onUp = () => {
    dragging = false;
    host.classList.remove("is-drag");
  };
  const onScroll = () => {
    const d = window.scrollY - scrollBase;
    scrollBase = window.scrollY;
    angle += d * 0.0022;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") velocity = -2.2;
    if (e.key === "ArrowRight") velocity = 2.2;
  };

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!dragging) {
      angle += (0.07 + velocity) * dt;
      velocity *= Math.pow(0.04, dt);
    }
    px += (tx - px) * Math.min(1, dt * 4);
    py += (ty - py) * Math.min(1, dt * 4);
    spin.rotation.y = angle;
    tilt.rotation.x = rad(-RING_TILT_X) + py * 0.07;
    tilt.rotation.z = rad(-RING_TILT_Z) - px * 0.03;
    tilt.rotation.y = px * 0.1;
    frames.forEach(({ face, rear, angle: a }) => {
      const tone = depthTone(Math.cos(a + angle));
      face.material.color.setScalar(tone);
      rear.material.color.setScalar(tone * 0.55);
    });
    renderers.forEach((rr) => rr.render(scene, camera));
    if (!ready && loaded === urls.length && dirty) {
      ready = true;
      onReady();
    }
    dirty = false;
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden;
    last = performance.now();
  });
  const onVis = () => {
    visible = !document.hidden;
    last = performance.now();
  };
  const ro = new ResizeObserver(layout);

  layout();
  io.observe(host);
  ro.observe(host);
  host.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  window.addEventListener("scroll", onScroll, { passive: true });
  host.addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", onVis);
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    host.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    window.removeEventListener("scroll", onScroll);
    host.removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVis);
    textures.forEach((t) => t.dispose());
    frames.forEach((f) => {
      f.face.material.dispose();
      f.rear.material.dispose();
    });
    geo.dispose();
    renderers.forEach((rr) => rr.dispose());
  };
}
