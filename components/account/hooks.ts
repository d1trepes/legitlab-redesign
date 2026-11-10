"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPhoto } from "@/lib/photos";
import { useAppState, userOf } from "@/lib/store";

/** Только внутренние адреса: защита от перенаправления на чужой сайт через ?next=. */
export const safeNext = (v: string | null | undefined, fallback: string) => (v && /^\/(?!\/)[\w\-./?=&%]*$/.test(v) ? v : fallback);

/** Кабинет: если входа нет — на страницу входа с возвратом сюда же. */
export function useAuth() {
  const state = useAppState();
  const user = userOf(state);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (state && !user) router.replace(`/login/?next=${encodeURIComponent(path + location.search)}`);
  }, [state, user, router, path]);
  return { state, user };
}

/** Адрес фото из IndexedDB. */
export function usePhotoUrl(id: string | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return setUrl(null);
    let u: string | null = null;
    let dead = false;
    getPhoto(id).then((b) => {
      if (dead || !b) return;
      u = URL.createObjectURL(b);
      setUrl(u);
    }).catch(() => {});
    return () => {
      dead = true;
      if (u) URL.revokeObjectURL(u);
    };
  }, [id]);
  return url;
}

export function useQuery() {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => setQ(new URLSearchParams(location.search)), []);
  return q;
}
