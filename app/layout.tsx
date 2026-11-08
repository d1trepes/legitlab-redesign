import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sofia-sans-extra-condensed/wght.css";
import "@fontsource-variable/golos-text/wght.css";
import "./globals.css";
import { DemoProvider } from "@/components/DemoProvider";

export const metadata: Metadata = {
  title: "LEGIT LAB — проверка подлинности брендовых вещей",
  description:
    "Экспертная проверка подлинности одежды, обуви, сумок и аксессуаров по фотографиям. Концептуальная демоверсия редизайна.",
  // Staging demo: keep it out of search until the owner approves a release.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f1ee",
};

// Light is the default (D-017). Only an explicit choice in «Настройки» switches
// to dark; the system preference does not override it.
const themeScript = `try{var t=localStorage.getItem('ll-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}else{document.documentElement.dataset.theme='light'}}catch(e){document.documentElement.dataset.theme='light'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
