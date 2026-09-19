import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Only lists routes that actually exist today. Add entries here as real pages ship
// (e.g. /contact, /services, /pricing are linked from the nav/footer but not built yet).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
