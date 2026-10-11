import type { MetadataRoute } from "next";
import { gym } from "@/data/gym";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${gym.siteUrl}/sitemap.xml`,
  };
}
