import type { Metadata } from "next";
import { Wallet } from "@/components/account/Wallet";

export const metadata: Metadata = { title: "Кошелёк", robots: { index: false } };

export default function Page() {
  return <Wallet />;
}
