import Link from "next/link";
import { Pic } from "./Pic";
import { Verdict } from "./Verdict";
import type { Check } from "@/lib/content";
import type { ImageName } from "@/lib/images.gen";

export function CheckCard({ check, sizes, priority }: { check: Check; sizes: string; priority?: boolean }) {
  return (
    <Link href={`/catalog/${check.id}/`} className="card">
      <Pic name={`check-${check.id}` as ImageName} alt={`${check.brand}, ${check.category.toLowerCase()}: фото из проверки`} sizes={sizes} ratio="4 / 5" priority={priority} />
      <span className="card__row">
        <span className="card__brand d d-s">{check.brand}</span>
        <Verdict value={check.verdict} />
      </span>
      <span className="card__meta">{check.category}</span>
    </Link>
  );
}
