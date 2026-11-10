import type { Metadata } from "next";
import { Register } from "@/components/account/Auth";

export const metadata: Metadata = { title: "Регистрация", robots: { index: false } };

export default function Page() {
  return <Register />;
}
