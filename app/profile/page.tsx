import type { Metadata } from "next";
import { Profile } from "@/components/account/Profile";

export const metadata: Metadata = { title: "Профиль", robots: { index: false } };

export default function Page() {
  return <Profile />;
}
