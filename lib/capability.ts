/** Можно ли включать тяжёлый 3D: нет reduced-motion, есть WebGL, устройство не слабое, не включена экономия трафика. */
export function canRun3D() {
  if (typeof window === "undefined") return false;
  // ?3d=on / ?3d=off — принудительно включить или выключить (для проверки обеих версий)
  const force = new URLSearchParams(location.search).get("3d");
  if (force === "off") return false;
  if (force === "on") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
export const whenIdle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 1200 });
  else setTimeout(fn, 250);
};
