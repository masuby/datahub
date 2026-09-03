import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://datahub.co.tz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...SERVICES.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
