import type { ImageName } from "@/lib/images.gen";

export type Zone = { title: string; text: string; x: number; y: number; zoom: number };
export type InspectItem = { id: string; tab: string; img: ImageName; alt: string; zones: Zone[] };

/** Куда смотрит эксперт. Координаты — доли кадра. */
export const INSPECT: InspectItem[] = [
  {
    id: "outerwear", tab: "Пуховик", img: "cat-outerwear", alt: "Чёрный пуховик с навесной биркой",
    zones: [
      { title: "Навесная бирка", text: "Шрифт, плотность картона, штрихкод и то, как бирка закреплена.", x: 0.57, y: 0.42, zoom: 3 },
      { title: "Воротник", text: "Вшивная бирка: рисунок букв, отступы, строчка по краю.", x: 0.48, y: 0.2, zoom: 2.4 },
      { title: "Молния", text: "Маркировка бегунка, шаг зубцов, строчка вдоль молнии.", x: 0.58, y: 0.63, zoom: 2.6 },
      { title: "Простёжка", text: "Ровность секций, шаг строчки, как лежит наполнитель.", x: 0.3, y: 0.56, zoom: 2.2 },
      { title: "Манжета и низ", text: "Резинка, фиксаторы шнура, обработка края.", x: 0.78, y: 0.84, zoom: 2.6 },
    ],
  },
  {
    id: "sneakers", tab: "Кроссовки", img: "cat-sneakers", alt: "Серый кроссовок с навесной биркой",
    zones: [
      { title: "Силуэт", text: "Форма носка, высота задника, посадка слоёв подошвы.", x: 0.5, y: 0.6, zoom: 1.5 },
      { title: "Шнуровка и язычок", text: "Этикетка на язычке, люверсы, плетение шнурков.", x: 0.5, y: 0.46, zoom: 2.8 },
      { title: "Задник", text: "Логотип, петля, симметрия швов на пятке.", x: 0.8, y: 0.44, zoom: 3 },
      { title: "Подошва", text: "Рисунок протектора, слои и маркировка.", x: 0.5, y: 0.79, zoom: 2.4 },
      { title: "Бирка", text: "Шрифт, артикул и штрихкод — совпадают ли с моделью.", x: 0.67, y: 0.65, zoom: 3.2 },
    ],
  },
  {
    id: "bags", tab: "Сумка", img: "cat-bags", alt: "Чёрная кожаная сумка с биркой",
    zones: [
      { title: "Пряжка", text: "Гравировка, вес и цвет металла, форма язычка.", x: 0.25, y: 0.36, zoom: 3 },
      { title: "Кольцо и карабин", text: "Литьё, стыки, как фурнитура закреплена на ремне.", x: 0.65, y: 0.43, zoom: 3.2 },
      { title: "Бегунок", text: "Маркировка производителя молнии и форма пуллера.", x: 0.29, y: 0.52, zoom: 3.2 },
      { title: "Бирка и код", text: "Шрифт, тиснение, формат серийного кода.", x: 0.68, y: 0.63, zoom: 3 },
      { title: "Кожа и швы", text: "Фактура, шаг строчки, обработка срезов.", x: 0.45, y: 0.76, zoom: 2.4 },
    ],
  },
];

/** Окно просмотра для зоны: центр зажат так, чтобы кадр не открывал пустоту. */
export function viewFor(zone: Zone | null) {
  if (!zone) return { cx: 0.5, cy: 0.5, zoom: 1 };
  const half = 1 / (2 * zone.zoom);
  const clamp = (v: number) => Math.min(1 - half, Math.max(half, v));
  return { cx: clamp(zone.x), cy: clamp(zone.y), zoom: zone.zoom };
}
