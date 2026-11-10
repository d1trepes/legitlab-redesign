import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ARTICLES, CHECKS } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/catalog/", "/how-it-works/", "/pricing/", "/articles/", "/security/", "/brand/"];
  return [
    ...pages.map((p) => ({ url: SITE_URL + p })),
    ...CHECKS.map((c) => ({ url: `${SITE_URL}/catalog/${c.id}/` })),
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}/articles/${a.slug}/` })),
  ];
}
