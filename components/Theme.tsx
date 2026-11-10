"use client";
import { useSyncExternalStore } from "react";

const KEY = "legitlab:theme";
export type Theme = "light" | "dark";
const listeners = new Set<() => void>();
const get = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#0c0c0c" : "#e8e8e6");
  listeners.forEach((l) => l());
}
export function useTheme(): Theme {
  return useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), get, () => "light");
}

/** Выполняется до первой отрисовки: тема без мигания, метка «js» для анимаций появления. */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${KEY}");if(t==="dark"||t==="light")d.dataset.theme=t}catch(e){}})()`;

export function ThemeToggle({ className = "textbtn" }: { className?: string }) {
  const theme = useTheme();
  return (
    <button type="button" className={className} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    </button>
  );
}
