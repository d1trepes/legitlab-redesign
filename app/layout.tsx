import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { THEME_SCRIPT } from "@/components/Theme";
import { BASE, SITE_URL } from "@/lib/site";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/site.css";
import "./styles/home.css";
import "./styles/pages.css";
import "./styles/account.css";

const F = `${BASE}/fonts`;
const CYR = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";
const LAT = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const face = (family: string, file: string, weight: string, range: string) =>
  `@font-face{font-family:"${family}";src:url(${F}/${file}) format("woff2");font-weight:${weight};font-style:normal;font-display:swap;unicode-range:${range}}`;
const FONTS = [
  face("Alumni Sans", "alumni-sans-cyrillic-wght-normal.woff2", "100 900", CYR),
  face("Alumni Sans", "alumni-sans-latin-wght-normal.woff2", "100 900", LAT),
  face("Geologica", "geologica-cyrillic-wght-normal.woff2", "100 900", CYR),
  face("Geologica", "geologica-latin-wght-normal.woff2", "100 900", LAT),
].join("");

// На статическом хостинге заголовки не настроить, поэтому политика задаётся в документе.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: "LEGIT LAB — проверка подлинности брендовых вещей по фото", template: "%s — LEGIT LAB" },
  description: "Загрузи фото вещи — эксперт изучит бирки, швы и фурнитуру и ответит: оригинал или реплика. Одежда, обувь, сумки, аксессуары. Беларусь.",
  openGraph: {
    type: "website", locale: "ru_BY", siteName: "LEGIT LAB", url: SITE_URL + "/",
    title: "LEGIT LAB — проверка подлинности брендовых вещей по фото",
    description: "Сомневаешься в вещи? Проверь её до покупки.",
    images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  manifest: `${BASE}/manifest.webmanifest`,
  formatDetection: { telephone: false },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: "#e8e8e6",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-theme="light" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
        <link rel="preload" href={`${F}/alumni-sans-cyrillic-wght-normal.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${F}/geologica-cyrillic-wght-normal.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: FONTS }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">К содержанию</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
