"use client";
import { useEffect, useRef, useState } from "react";
import { IMAGES } from "@/lib/images.gen";
import { imgUrl } from "@/components/Pic";
import { canRun3D, whenIdle } from "@/lib/capability";
import { RING_FRAMES, RING_START, RING_STEP, RING_TILT_X, RING_TILT_Z, depthTone } from "./ring";

const rad = (d: number) => (d * Math.PI) / 180;
const FRAMES = RING_FRAMES.map((name, i) => {
  const deg = i * RING_STEP + RING_START;
  const cos = Math.cos(rad(deg));
  return { name, deg, front: cos > 0, tone: depthTone(cos) };
});

function StaticLayer({ front }: { front: boolean }) {
  return (
    <div className="ring__static" aria-hidden="true">
      <div className="ring__tilt" style={{ transform: `rotateZ(${RING_TILT_Z}deg) rotateX(${RING_TILT_X}deg)` }}>
        {FRAMES.filter((f) => f.front === front).map((f) => (
          <picture key={f.name} className="ring__f" style={{ transform: `rotateY(${f.deg}deg) translateZ(var(--r))`, filter: `brightness(${f.tone.toFixed(2)})`, background: IMAGES[f.name].tone }}>
            <source type="image/avif" srcSet={`${imgUrl(f.name, 384, "avif")} 384w, ${imgUrl(f.name, 640, "avif")} 640w`} sizes="(min-width: 700px) 22vw, 180px" />
            <img src={imgUrl(f.name, 384)} srcSet={`${imgUrl(f.name, 384)} 384w, ${imgUrl(f.name, 640)} 640w`} sizes="(min-width: 700px) 22vw, 180px" alt="" width={384} height={512} decoding="async" fetchPriority={f.deg === RING_START ? "high" : undefined} />
          </picture>
        ))}
      </div>
    </div>
  );
}

/** Кольцо первого экрана: сразу статичная CSS-версия, затем (если устройство тянет) живая сцена Three.js. */
export function RingStage() {
  const host = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!canRun3D()) return;
    let dispose: (() => void) | undefined;
    let dead = false;
    whenIdle(async () => {
      try {
        const { mountRing } = await import("./ringScene");
        if (dead || !host.current || !back.current || !front.current) return;
        const big = host.current.clientWidth * (window.devicePixelRatio || 1) > 1500;
        dispose = mountRing({
          host: host.current, back: back.current, front: front.current,
          urls: RING_FRAMES.map((n) => imgUrl(n, big ? 640 : 384)),
          onReady: () => !dead && setLive(true),
        });
      } catch {
        // WebGL недоступен — остаётся статичная версия
      }
    });
    return () => {
      dead = true;
      dispose?.();
    };
  }, []);

  return (
    <div
      ref={host} className={`ring ${live ? "is-live" : ""}`}
      role={live ? "img" : undefined} tabIndex={live ? 0 : undefined}
      aria-label={live ? "Кольцо из кадров: люди рассматривают бирки на одежде. Его можно вращать перетаскиванием или стрелками." : undefined}
    >
      <div className="ring__layer ring__layer--back">
        <StaticLayer front={false} />
        <canvas ref={back} aria-hidden="true" />
      </div>
      <div className="ring__layer ring__layer--front">
        <StaticLayer front />
        <canvas ref={front} aria-hidden="true" />
      </div>
    </div>
  );
}
