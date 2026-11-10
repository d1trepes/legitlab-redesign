import type { Metadata } from "next";
import { Login } from "@/components/account/Auth";

export const metadata: Metadata = { title: "Вход", robots: { index: false } };

export default function Page() {
  return <Login />;
}
