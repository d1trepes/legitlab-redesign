// Content for the LEGIT LAB demo homepage.
// Sources are noted per block. Nothing here is invented: catalog cards, brand
// prices and article titles were read from the public pages of legit-lab.com
// on 08.11.2026 (see docs/IMPLEMENTATION_NOTES.md).

export const LINKS = {
  telegramChannel: "https://t.me/legitlaboratory",
  telegramBot: "https://t.me/legit_lab_bot",
  tiktok: "https://www.tiktok.com/@legit_laboratory",
  site: "https://legit-lab.com/",
  history: "https://legit-lab.com/",
  articles: "https://legit-lab.com/articles",
  account: "https://legit-lab.com/profile",
} as const;

/** Public check photos are served by the production site (hotlinked, not copied). */
export function legitImage(key: string, width: 384 | 640 | 1080 = 640) {
  const src = encodeURIComponent(`/api/image-source/uploadthing?key=${key}`);
  return `https://legit-lab.com/_next/image?url=${src}&w=${width}&q=75`;
}

export type Verdict = "Оригинал" | "Реплика";

export type CatalogItem = {
  id: string;
  brand: string;
  category: string;
  verdict: Verdict;
  imageKey: string;
};

// «Глобальная история» on legit-lab.com — public cards: verdict, ID, brand,
// category and the cover photo. Expert/client comments are never shown (D-016).
export const CATALOG: CatalogItem[] = [
  { id: "AXNH7B", brand: "Amiri", category: "Одежда", verdict: "Оригинал", imageKey: "VybVRCdhtI3BgF4Mz9evT5lp6GqOZub94eRgyz3wB7CnsiK8" },
  { id: "W47H8W", brand: "Moncler", category: "Верхняя одежда", verdict: "Реплика", imageKey: "VybVRCdhtI3BqAeO6RxZmTciBXjbOvDUGl6hHxI28MPoyFL1" },
  { id: "817FVB", brand: "Gucci", category: "Сумки", verdict: "Оригинал", imageKey: "VybVRCdhtI3B4jY4LWiqdfEm6sT2e0HOLBul1vVtXZCc5zGh" },
  { id: "EJW8RV", brand: "Balenciaga", category: "Кроссовки", verdict: "Реплика", imageKey: "VybVRCdhtI3BCWpPVJ6cW9ueR8TPljvXO3LJ04EcGgDSsdzY" },
  { id: "ETH9D9", brand: "Bape", category: "Одежда", verdict: "Оригинал", imageKey: "VybVRCdhtI3BvbRSpzA8mcLVDKe251HqkPWOTnBoifduXQjS" },
  { id: "736QHE", brand: "Louis Vuitton", category: "Аксессуары", verdict: "Реплика", imageKey: "VybVRCdhtI3BLnMxo3Y1s6uv5WXUfrPOaQIBTkbZzRoAjcSw" },
  { id: "N59BDU", brand: "Nike", category: "Обувь", verdict: "Оригинал", imageKey: "VybVRCdhtI3BJeJIJgSWivM34trmo9kQeTHYAuUjKgFDxV15" },
  { id: "TFEQIZ", brand: "Gucci", category: "Одежда", verdict: "Реплика", imageKey: "VybVRCdhtI3BvXJaH2A8mcLVDKe251HqkPWOTnBoifduXQjS" },
];

export type Category = { name: string; image?: string; alt?: string };

export const CATEGORIES: Category[] = [
  { name: "Одежда", image: "/img/category-clothing", alt: "Худи графитового цвета на вешалке с пустой биркой" },
  { name: "Верхняя одежда", image: "/img/category-outerwear", alt: "Чёрный пуховик на вешалке с пустой биркой" },
  { name: "Кроссовки и обувь", image: "/img/category-sneakers", alt: "Светлый кожаный кроссовок с пустой биркой" },
  { name: "Сумки", image: "/img/category-bags", alt: "Чёрная кожаная сумка с серебряной фурнитурой" },
  { name: "Аксессуары" },
];

// «Популярные бренды» on legit-lab.com: price of one check depends on the brand.
export const BRAND_PRICES = [
  { credits: 50, brands: ["Nike", "Air Jordan", "Adidas", "Vans"] },
  { credits: 70, brands: ["Balenciaga", "Stone Island", "Supreme", "Yeezy", "Vlone"] },
];

// Top-up packages from the current wallet screen. BYN prices are not confirmed yet.
export const PACKAGES = [
  { credits: 50 },
  { credits: 150, bonus: 10 },
  { credits: 300, bonus: 50 },
  { credits: 1000, bonus: 250 },
];

export type Article = {
  slug: string;
  brand: string;
  title: string;
  lead: string;
  date: string;
  imageKey: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "amiri-hoodie-legitcheck",
    brand: "Amiri",
    title: "Худи Amiri: как отличить оригинал",
    lead: "Бирки, материалы, принт и швы: на что смотреть в первую очередь.",
    date: "08.10.2026",
    imageKey: "VybVRCdhtI3Bv1c8ObA8mcLVDKe251HqkPWOTnBoifduXQjS",
  },
  {
    slug: "moncler-puffer-legitcheck",
    brand: "Moncler",
    title: "Пуховик Moncler: признаки подлинности",
    lead: "Логотип, фурнитура, QR-код и качество пошива на конкретных деталях.",
    date: "24.09.2026",
    imageKey: "VybVRCdhtI3B7xsskwZKPl9OXtALRwyIUac1BnHWTexZmofV",
  },
  {
    slug: "balenciaga-track-legitcheck",
    brand: "Balenciaga",
    title: "Balenciaga Track: разбор подделки",
    lead: "Форма, маркировка, материалы и подошва — по шагам.",
    date: "22.09.2026",
    imageKey: "VybVRCdhtI3B3rLwG9FbPeNRL5awimvV8XJzStEACBrkUd2s",
  },
];
