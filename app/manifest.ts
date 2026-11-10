import type { MetadataRoute } from "next";
import { BASE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LEGIT LAB — проверка подлинности", short_name: "LEGIT LAB", lang: "ru",
    start_url: `${BASE}/`, scope: `${BASE}/`, display: "standalone",
    background_color: "#e8e8e6", theme_color: "#0b0b0b",
    icons: [
      { src: `${BASE}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
