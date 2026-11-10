import type { Metadata } from "next";
import { Forgot } from "@/components/account/Auth";

export const metadata: Metadata = { title: "Восстановление пароля", robots: { index: false } };

export default function Page() {
  return <Forgot />;
}
