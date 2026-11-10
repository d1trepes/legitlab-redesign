import pricing from "@/content/pricing.json";
import links from "@/content/links.json";

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_URL = "https://d1trepes.github.io/legitlab-redesign";
export const asset = (p: string) => `${BASE}${p}`;

export const LINKS = links;

/** Курс не утверждён (content/pricing.json → creditToBYN: null). Единственная константа демо-курса. */
export const DEMO_CREDIT_TO_BYN = 0.3;
export const CREDIT_TO_BYN: number = pricing.creditToBYN ?? DEMO_CREDIT_TO_BYN;
export const RATE_IS_DEMO = pricing.creditToBYN == null;

export const PRICE_GROUPS = pricing.pricePerCheckByBrand;
export const PACKAGES = pricing.packages as { credits: number; bonus: number; tag?: string }[];
export const BRANDS = PRICE_GROUPS.flatMap((g) => g.brands.map((b) => ({ brand: b, credits: g.credits })));
export const MIN_PRICE = Math.min(...PRICE_GROUPS.map((g) => g.credits));
export const MAX_PRICE = Math.max(...PRICE_GROUPS.map((g) => g.credits));
/** Цена для брендов вне списка не утверждена — в демо считаем по верхней ставке. */
export const OTHER_BRAND_PRICE = MAX_PRICE;

export const priceOf = (brand: string) =>
  BRANDS.find((b) => b.brand.toLowerCase() === brand.trim().toLowerCase())?.credits ?? OTHER_BRAND_PRICE;

export const byn = (credits: number) =>
  (credits * CREDIT_TO_BYN).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " BYN";

export const plural = (n: number, forms: [string, string, string]) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
};
export const credits = (n: number) => `${n} ${plural(n, ["кредит", "кредита", "кредитов"])}`;
export const checks = (n: number) => `${n} ${plural(n, ["проверка", "проверки", "проверок"])}`;

/** «хватит на N проверок» */
export const checksFor = (n: number) => `${n} ${plural(n, ["проверку", "проверки", "проверок"])}`;

export const PROMOS: Record<string, number> = { DEMO10: 10 };

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
