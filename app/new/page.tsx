import type { Metadata } from "next";
import { Wizard } from "@/components/account/Wizard";

export const metadata: Metadata = { title: "Новая заявка", robots: { index: false } };

export default function Page() {
  return <Wizard />;
}
