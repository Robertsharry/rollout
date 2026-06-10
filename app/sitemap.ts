import type { MetadataRoute } from "next";

import { getPokemonGuides } from "@/lib/guides";
import { GAME_SLUGS, SECTIONS } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const paths = [
    "/",
    ...GAME_SLUGS.map((slug) => `/${slug}`),
    ...SECTIONS.map((section) => `/${section.slug}`),
  ];

  const base: MetadataRoute.Sitemap = paths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const guides = await getPokemonGuides();
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: absoluteUrl(`/pokemon/guides/${guide.slug}`),
    lastModified: guide.updated ? new Date(guide.updated) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...base, ...guideEntries];
}
