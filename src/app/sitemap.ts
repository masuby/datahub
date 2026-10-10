import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { LOCALES, LANG_TAG, DEFAULT_LOCALE } from "@/i18n/config";
import { absoluteUrl } from "@/lib/seo";

/**
 * Every page in both languages, each entry carrying the full hreflang set
 * (en-TZ, sw-TZ, x-default → English), matching the pages' own
 * `alternates.languages`. Kiswahili service content is reviewed
 * (services.sw.ts), so /sw/services/* is listed and indexed like the rest.
 */

type Page = { path: string; priority: number; changeFrequency: "monthly" | "yearly" };

const PAGES: Page[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
  { path: "/dashboards", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/process", priority: 0.6, changeFrequency: "monthly" },
  { path: "/security", priority: 0.6, changeFrequency: "monthly" },
  { path: "/team", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap(({ path, priority, changeFrequency }) => {
    const languages = {
      ...Object.fromEntries(LOCALES.map((l) => [LANG_TAG[l], absoluteUrl(l, path)])),
      "x-default": absoluteUrl(DEFAULT_LOCALE, path),
    };
    return LOCALES.map((lang) => ({
      url: absoluteUrl(lang, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
