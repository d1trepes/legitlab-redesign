import type { Metadata } from "next";
import { VerifyView } from "@/components/account/Orders";
import { CHECKS } from "@/lib/content";

export const metadata: Metadata = { title: "Сверка сертификата", robots: { index: false } };

export default function Page() {
  return <VerifyView catalogIds={CHECKS.map((c) => c.id)} />;
}
