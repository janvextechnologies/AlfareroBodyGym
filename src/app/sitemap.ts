import type { MetadataRoute } from "next";
import { gym } from "@/data/gym";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: gym.siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
