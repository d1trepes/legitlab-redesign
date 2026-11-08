"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons";
import { LINKS, legitImage, type CatalogItem } from "@/lib/data";
import styles from "./DemoProvider.module.css";

type DialogState =
  | { kind: "check"; category?: string }
  | { kind: "login" }
  | { kind: "item"; item: CatalogItem }
  | null;

type Ctx = {
  openCheck: (category?: string) => void;
  openLogin: () => void;
  openItem: (item: CatalogItem) => void;
};

const DemoContext = createContext<Ctx | null>(null);

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DialogState>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (state && !d.open) d.showModal();
    if (!state && d.open) d.close();
  }, [state]);

  // Scroll reveal for every [data-reveal] element on the page.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const openCheck = useCallback((category?: string) => setState({ kind: "check", category }), []);
  const openLogin = useCallback(() => setState({ kind: "login" }), []);
  const openItem = useCallback((item: CatalogItem) => setState({ kind: "item", item }), []);

  return (
    <DemoContext.Provider value={{ openCheck, openLogin, openItem }}>
      {children}
      <dialog
        ref={ref}
        className={`${styles.dialog} ${state?.kind === "item" ? styles.wide : ""}`}
        onClose={() => setState(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setState(null);
        }}
        aria-labelledby="demo-dialog-title"
      >
        {state && (
          <div className={styles.inner}>
            <button className={styles.close} onClick={() => setState(null)} aria-label="Закрыть">
              <CloseIcon />
            </button>
            {state.kind === "check" && (
              <>
                <h2 id="demo-dialog-title" className={styles.title}>
                  Начать проверку
                </h2>
                {state.category && <p className={styles.meta}>Категория: {state.category}</p>}
                <p className={styles.text}>
                  Это концептуальная демоверсия: здесь заявка не создаётся и данные никуда не отправляются.
                  Оформить настоящую проверку можно на текущем сайте или в Telegram.
                </p>
                <div className={styles.actions}>
                  <a className="btn" href={LINKS.site} target="_blank" rel="noopener noreferrer">
                    Открыть legit-lab.com
                  </a>
                  <a className="btn btn--ghost" href={LINKS.telegramBot} target="_blank" rel="noopener noreferrer">
                    Telegram-бот
                  </a>
                </div>
              </>
            )}
            {state.kind === "login" && (
              <>
                <h2 id="demo-dialog-title" className={styles.title}>
                  Вход
                </h2>
                <p className={styles.text}>
                  В демоверсии нет учётных записей. Личный кабинет, баланс и история проверок работают на
                  текущем сайте.
                </p>
                <div className={styles.actions}>
                  <a className="btn" href={LINKS.account} target="_blank" rel="noopener noreferrer">
                    Открыть кабинет
                  </a>
                </div>
              </>
            )}
            {state.kind === "item" && (
              <div className={styles.item}>
                <div className={styles.itemPhoto}>
                  <img
                    src={legitImage(state.item.imageKey, 1080)}
                    alt={`${state.item.brand}, ${state.item.category.toLowerCase()} — фото из публичной проверки`}
                  />
                </div>
                <div className={styles.itemInfo}>
                  <span className={state.item.verdict === "Оригинал" ? styles.verdictOn : styles.verdictOff}>
                    {state.item.verdict}
                  </span>
                  <h2 id="demo-dialog-title" className={styles.itemBrand}>
                    {state.item.brand}
                  </h2>
                  <p className={styles.meta}>
                    {state.item.category} · #{state.item.id}
                  </p>
                  <p className={styles.text}>
                    Публичная карточка из истории проверок LEGIT LAB. Полное заключение эксперта и все
                    фотографии видит только владелец проверки.
                  </p>
                  <div className={styles.actions}>
                    <a className="btn btn--ghost" href={LINKS.history} target="_blank" rel="noopener noreferrer">
                      Вся история на legit-lab.com
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </dialog>
    </DemoContext.Provider>
  );
}
