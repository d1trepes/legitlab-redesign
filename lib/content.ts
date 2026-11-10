import catalogJson from "@/content/catalog.json";
import articlesJson from "@/content/articles.json";

export type Verdict = "Оригинал" | "Реплика";
export type Check = { id: string; brand: string; category: string; verdict: Verdict; photo: string };
export const CHECKS = catalogJson.items as Check[];
export const checkById = (id: string) => CHECKS.find((c) => c.id === id);

export type Article = {
  slug: string; brand: string; title: string; lead: string; date: string; url: string;
  /** Краткий собственный текст демо. Полные материалы — на legit-lab.com. */
  body: { heading: string; text: string }[];
};

const BODIES: Record<string, Article["body"]> = {
  "amiri-hoodie-legitcheck": [
    { heading: "Бирки", text: "Начни с вшивной бирки на воротнике и ярлыка с составом. Смотри на шрифт, расстояния между буквами и то, как бирка пришита: строчка ровная, нитки не торчат, текст не плывёт." },
    { heading: "Материал", text: "Сними ткань крупно при дневном свете. По фото видно плотность полотна, ворс изнанки и то, как лежит ткань на швах и манжетах." },
    { heading: "Принт", text: "Принт или вышивку снимай прямо, без наклона. Важны края рисунка, порядок цветов и положение относительно швов." },
    { heading: "Швы", text: "Выверни вещь и покажи швы изнутри: боковые, плечевые, низ. По ним хорошо видно, как и на каком оборудовании шили." },
  ],
  "moncler-puffer-legitcheck": [
    { heading: "Бирки и ярлыки", text: "Покажи бирку воротника и все внутренние ярлыки целиком и крупно. Текст должен читаться — лучше два кадра, чем один размытый." },
    { heading: "Логотип", text: "Нашивку на рукаве сними прямо и под углом. Эксперт смотрит на рисунок, окантовку и то, как нашивка закреплена." },
    { heading: "Фурнитура", text: "Молния, бегунок, кнопки, фиксаторы шнура. Нужны маркировка на бегунке и общий вид молнии по всей длине." },
    { heading: "Код и пошив", text: "Сними ярлык с кодом так, чтобы он читался, и простёжку секций. Сам код по фото мы не «пробиваем» — он один из признаков, а не доказательство." },
  ],
  "balenciaga-track-legitcheck": [
    { heading: "Форма", text: "Сними пару сбоку и сзади на ровной поверхности. Силуэт, высота задника и посадка слоёв видны только на прямом кадре." },
    { heading: "Логотипы и маркировка", text: "Надписи на носке, заднике и язычке — крупно и резко. Отдельно — размерная этикетка внутри." },
    { heading: "Материалы", text: "Сетка, накладки и их стыки. Хороший свет важнее камеры: без него фактуру не разобрать." },
    { heading: "Подошва", text: "Покажи подошву целиком и протектор крупно. Здесь смотрят рисунок, слои и маркировку." },
  ],
};

export const ARTICLES: Article[] = articlesJson.items.map((a) => ({
  slug: a.slug, brand: a.brand, title: a.title, lead: a.lead, date: a.date, url: a.url, body: BODIES[a.slug] ?? [],
}));
