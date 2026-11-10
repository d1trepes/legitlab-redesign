"use client";
import { useEffect, useRef, useState } from "react";
import { Pic, imgUrl } from "@/components/Pic";
import { canRun3D, whenIdle } from "@/lib/capability";
import { INSPECT, viewFor } from "./inspect";

type Api = { setItem: (url: string, zones: (typeof INSPECT)[number]["zones"]) => void; setActive: (i: number | null) => void; dispose: () => void };

/** Второй и последний тяжёлый интерактив главной: разбор вещи по зонам, куда смотрит эксперт. */
export function Inspect() {
  const [item, setItem] = useState(0);
  const [zone, setZone] = useState<number | null>(0);
  const [live, setLive] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<Api | null>(null);
  const cur = INSPECT[item];
  const view = viewFor(zone === null ? null : cur.zones[zone]);

  useEffect(() => {
    if (!canRun3D() || !host.current) return;
    let dead = false;
    // сцена поднимается только когда блок подходит к экрану
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      whenIdle(async () => {
        try {
          const { mountInspect } = await import("./inspectScene");
          if (dead || !host.current || !canvas.current) return;
          api.current = mountInspect({ host: host.current, canvas: canvas.current, onPick: setZone, onReady: () => !dead && setLive(true) });
          api.current.setItem(imgUrl(INSPECT[0].img, 1122), INSPECT[0].zones);
          api.current.setActive(0);
        } catch {}
      });
    }, { rootMargin: "400px" });
    io.observe(host.current);
    return () => {
      dead = true;
      io.disconnect();
      api.current?.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.setItem(imgUrl(cur.img, 1122), cur.zones);
  }, [cur]);
  useEffect(() => {
    api.current?.setActive(zone);
  }, [zone, item]);

  const pick = (i: number) => {
    setItem(i);
    setZone(0);
  };

  return (
    <div className="insp">
      <div className="insp__panel">
        <div className="insp__tabs" role="tablist" aria-label="Вещь">
          {INSPECT.map((it, i) => (
            <button key={it.id} type="button" role="tab" aria-selected={i === item} onClick={() => pick(i)}>{it.tab}</button>
          ))}
        </div>
        <ul className="insp__zones">
          {cur.zones.map((z, i) => (
            <li key={z.title}>
              <button type="button" aria-pressed={i === zone} onClick={() => setZone(i === zone ? null : i)}>
                <span className="d d-m">{z.title}</span>
                <span className="insp__text">{z.text}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="textbtn" disabled={zone === null} onClick={() => setZone(null)}>Показать вещь целиком</button>
      </div>
      <div ref={host} className={`insp__stage ${live ? "is-live" : ""}`}>
        <div className="insp__static" style={{ transform: `scale(${view.zoom}) translate(${(0.5 - view.cx) * 100}%, ${(0.5 - view.cy) * 100}%)` }}>
          <Pic name={cur.img} alt={cur.alt} sizes="(min-width: 900px) 55vw, 100vw" ratio="4 / 5" />
          {cur.zones.map((z, i) => (
            <button
              key={z.title} type="button" tabIndex={-1} aria-hidden="true"
              className={`insp__mark ${i === zone ? "is-on" : ""}`} hidden={zone !== null && i !== zone} onClick={() => setZone(i === zone ? null : i)}
              style={{ left: `${z.x * 100}%`, top: `${z.y * 100}%`, width: `${80 / z.zoom}%`, ["--z" as string]: view.zoom }}
            />
          ))}
        </div>
        <canvas ref={canvas} aria-hidden="true" />
      </div>
    </div>
  );
}
