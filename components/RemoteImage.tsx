"use client";

import { useState } from "react";
import { LogoMark } from "./Logo";

/**
 * Image served by legit-lab.com. If the production site does not answer,
 * show a quiet branded placeholder instead of a broken-image icon.
 */
export function RemoteImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-hidden="true"
        style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", color: "var(--muted)" }}
      >
        <LogoMark size={40} />
      </span>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
