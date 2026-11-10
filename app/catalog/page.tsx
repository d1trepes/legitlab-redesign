import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { CHECKS } from "@/lib/content";
import { checks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Каталог проверок",
  description: "Настоящие проверки LEGIT LAB: бренд, категория, итог и фото. Смотри, как выглядят оригиналы и реплики.",
};

export default function CatalogPage() {
  return (
    <div className="wrap">
      <header className="pagehead pagehead--split">
        <h1 className="d d-xxl">Каталог проверок</h1>
        <p className="lead">{checks(CHECKS.length)} с legit-lab.com. Здесь видно бренд, категорию, итог и фото вещи. Заключение эксперта остаётся у владельца.</p>
      </header>
      <Catalog />
    </div>
  );
}
