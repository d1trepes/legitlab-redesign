import type { Metadata } from "next";
import { Orders } from "@/components/account/Orders";

export const metadata: Metadata = { title: "Заявки", robots: { index: false } };

export default function Page() {
  return <Orders />;
}
