import type { MetadataRoute } from "next";

import { GAME_SLUGS, SECTIONS } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    ...GAME_SLUGS.map((slug) => `/${slug}`),
    ...SECTIONS.map((section) => `/${section.slug}`),
  ];

  return paths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
