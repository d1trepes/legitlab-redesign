import type { ImageName } from "./images.gen";

export type CategoryId = "outerwear" | "clothing" | "sneakers" | "bags" | "accessories";
/** Пример кадра: иллюстрация из фотосерии с фокусом в точке (x, y — доли кадра). */
export type Example = { img: ImageName; x: number; y: number; zoom: number };
export type Slot = { id: string; title: string; hint: string; required: boolean; example: Example };
export type Category = { id: CategoryId; title: string; items: string; image: ImageName; slots: Slot[] };

const tag: Example = { img: "ring-hands-tags", x: 0.52, y: 0.62, zoom: 1.6 };
const s = (id: string, title: string, hint: string, example: Example, required = true): Slot => ({ id, title, hint, required, example });

export const CATEGORIES: Category[] = [
  {
    id: "outerwear", title: "Верхняя одежда", items: "Пуховики, куртки, пальто, ветровки", image: "cat-outerwear",
    slots: [
      s("front", "Общий вид спереди", "Вещь целиком, расправлена, на ровном фоне.", { img: "cat-outerwear", x: 0.5, y: 0.5, zoom: 1 }),
      s("back", "Общий вид сзади", "Так же целиком, со спины.", { img: "ring-man-coat", x: 0.5, y: 0.5, zoom: 1 }),
      s("neck", "Бирка на воротнике", "Прямо, без наклона, текст читается.", { img: "cat-outerwear", x: 0.48, y: 0.2, zoom: 2.6 }),
      s("label", "Внутренние ярлыки и код", "Все ярлыки с составом и кодом, каждый отдельным кадром.", tag),
      s("logo", "Логотип или нашивка", "Крупно, прямо. Видны края и строчка.", { img: "cat-outerwear", x: 0.57, y: 0.42, zoom: 3 }),
      s("zip", "Молния и фурнитура", "Бегунок с маркировкой, кнопки, фиксаторы.", { img: "cat-outerwear", x: 0.58, y: 0.62, zoom: 2.6 }),
      s("seams", "Швы и подкладка", "Изнанка: простёжка, боковой шов, подкладка.", { img: "cat-outerwear", x: 0.3, y: 0.56, zoom: 2.4 }, false),
    ],
  },
  {
    id: "clothing", title: "Одежда", items: "Худи, футболки, джинсы, трикотаж", image: "cat-clothing",
    slots: [
      s("front", "Общий вид спереди", "Вещь целиком, расправлена, на ровном фоне.", { img: "cat-clothing", x: 0.5, y: 0.5, zoom: 1 }),
      s("back", "Общий вид сзади", "Так же целиком, со спины.", { img: "cat-clothing", x: 0.5, y: 0.55, zoom: 1.15 }),
      s("neck", "Бирка на воротнике", "Прямо, без наклона, текст читается.", { img: "cat-clothing", x: 0.5, y: 0.2, zoom: 3 }),
      s("label", "Ярлык с составом", "Внутренний ярлык с обеих сторон.", tag),
      s("logo", "Принт, вышивка или логотип", "Крупно и прямо, видны края рисунка.", { img: "cat-clothing", x: 0.5, y: 0.36, zoom: 2.8 }),
      s("seams", "Швы изнутри", "Выверни вещь: плечо, бок, низ.", { img: "cat-clothing", x: 0.3, y: 0.8, zoom: 2.6 }),
      s("hang", "Навесные бирки", "Если сохранились — обе стороны.", { img: "ring-hands-tags", x: 0.55, y: 0.56, zoom: 1.2 }, false),
    ],
  },
  {
    id: "sneakers", title: "Обувь", items: "Кроссовки, кеды, ботинки", image: "cat-sneakers",
    slots: [
      s("side", "Пара сбоку", "Внешняя сторона, на ровной поверхности.", { img: "cat-sneakers", x: 0.5, y: 0.6, zoom: 1.5 }),
      s("top", "Пара сверху", "Обе полупары рядом, шнуровка видна.", { img: "cat-sneakers", x: 0.48, y: 0.5, zoom: 2 }),
      s("heel", "Задник", "Прямо сзади, обе полупары.", { img: "cat-sneakers", x: 0.8, y: 0.45, zoom: 3 }),
      s("sole", "Подошва", "Целиком и протектор крупно.", { img: "cat-sneakers", x: 0.5, y: 0.78, zoom: 2.4 }),
      s("size", "Размерная этикетка", "Внутри, на язычке или стенке. Текст читается.", { img: "cat-sneakers", x: 0.67, y: 0.65, zoom: 3.2 }),
      s("insole", "Стелька и строчка под ней", "Достань стельку, сними её и то, что под ней.", { img: "cat-sneakers", x: 0.6, y: 0.42, zoom: 3 }),
      s("box", "Этикетка на коробке", "Если коробка сохранилась.", tag, false),
    ],
  },
  {
    id: "bags", title: "Сумки", items: "Сумки, рюкзаки, клатчи", image: "cat-bags",
    slots: [
      s("front", "Общий вид спереди", "Сумка целиком, стоит ровно.", { img: "cat-bags", x: 0.5, y: 0.5, zoom: 1 }),
      s("back", "Общий вид сзади", "Обратная сторона целиком.", { img: "cat-bags", x: 0.5, y: 0.6, zoom: 1.2 }),
      s("logo", "Логотип или тиснение", "Крупно, при боковом свете.", { img: "cat-bags", x: 0.4, y: 0.7, zoom: 2.8 }),
      s("hardware", "Фурнитура", "Кольца, пряжки, бегунки с гравировкой.", { img: "cat-bags", x: 0.65, y: 0.43, zoom: 3.2 }),
      s("code", "Внутренняя бирка и код", "Бирка внутри и серийный код, если есть.", { img: "cat-bags", x: 0.68, y: 0.62, zoom: 3 }),
      s("seams", "Швы и ручки", "Строчка на ручке и по краю.", { img: "cat-bags", x: 0.25, y: 0.36, zoom: 3 }),
      s("bottom", "Дно и углы", "Дно целиком, углы крупно.", { img: "cat-bags", x: 0.5, y: 0.83, zoom: 2.2 }, false),
    ],
  },
  {
    id: "accessories", title: "Аксессуары", items: "Ремни, очки, кепки, кошельки", image: "cat-accessories",
    slots: [
      s("front", "Общий вид", "Вещь целиком на ровном фоне.", { img: "cat-accessories", x: 0.5, y: 0.5, zoom: 1 }),
      s("back", "Обратная сторона", "Изнанка или оборот целиком.", { img: "cat-accessories", x: 0.35, y: 0.5, zoom: 1.6 }),
      s("logo", "Логотип или гравировка", "Крупно и прямо.", { img: "cat-accessories", x: 0.62, y: 0.6, zoom: 3 }),
      s("mark", "Маркировка и серийный номер", "Штамп, номер модели, страна.", { img: "cat-accessories", x: 0.7, y: 0.75, zoom: 3 }),
      s("hardware", "Фурнитура", "Пряжка, петли, застёжки.", { img: "cat-accessories", x: 0.62, y: 0.62, zoom: 2.6 }),
      s("seams", "Швы и края", "Строчка и обработка края крупно.", { img: "cat-accessories", x: 0.25, y: 0.55, zoom: 3 }),
      s("pack", "Упаковка и бирки", "Если сохранились.", tag, false),
    ],
  },
];

export const categoryById = (id: string | null | undefined) => CATEGORIES.find((c) => c.id === id);
export const requiredCount = (c: Category) => c.slots.filter((x) => x.required).length;
