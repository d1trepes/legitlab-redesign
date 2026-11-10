import type { Metadata } from "next";
import { OrderView } from "@/components/account/Orders";

export const metadata: Metadata = { title: "Заявка", robots: { index: false } };

export default function Page() {
  return <OrderView />;
}
