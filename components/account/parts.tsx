"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { Pic } from "@/components/Pic";
import { usePhotoUrl } from "./hooks";
import type { Photo } from "@/lib/store";
import { credits } from "@/lib/site";

const TABS = [
  { href: "/orders/", label: "Заявки" },
  { href: "/wallet/", label: "Кошелёк" },
  { href: "/profile/", label: "Профиль" },
];

export function AccountShell({ title, balance, children, aside }: { title: string; balance?: number; children: ReactNode; aside?: ReactNode }) {
  const path = usePathname();
  return (
    <div className="wrap acc">
      <nav className="acc__nav" aria-label="Кабинет">
        {TABS.map((t) => <Link key={t.href} href={t.href} aria-current={path.startsWith(t.href) ? "page" : undefined}>{t.label}</Link>)}
        {balance !== undefined && <Link href="/wallet/" className="acc__bal num">{credits(balance)}</Link>}
      </nav>
      <header className="acc__head">
        <h1 className="d d-xl">{title}</h1>
        {aside}
      </header>
      {children}
    </div>
  );
}

export function Loading() {
  return <div className="wrap acc acc--loading" aria-busy="true"><p className="muted">Открываем кабинет</p></div>;
}

export function PhotoThumb({ photo, sizes = "160px" }: { photo: Photo; sizes?: string }) {
  const url = usePhotoUrl(photo.photoId);
  if (photo.demo) return <Pic name={photo.demo} alt={photo.title} sizes={sizes} ratio="4 / 5" />;
  return <span className="pic thumb" style={{ aspectRatio: "4 / 5" }}>{url ? <img src={url} alt={photo.title} /> : null}</span>;
}

export function QR({ text, size = 132 }: { text: string; size?: number }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString(text, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0b0b0b", light: "#ffffff" } }).then(setSvg).catch(() => {});
  }, [text]);
  return <span className="qr" style={{ width: size, height: size }} role="img" aria-label="QR-код" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Поле одноразового кода. */
export function CodeInput({ value, onChange, long }: { value: string; onChange: (v: string) => void; long?: boolean }) {
  return (
    <input
      className="input code" inputMode={long ? "text" : "numeric"} autoComplete="one-time-code" autoFocus
      maxLength={long ? 9 : 6} placeholder={long ? "000000" : "000000"} aria-label="Код"
      value={value} onChange={(e) => onChange(long ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ""))}
    />
  );
}
