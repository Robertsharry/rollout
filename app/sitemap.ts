import type { MetadataRoute } from "next";

import { getPokemonGuides } from "@/lib/guides";
import { STATIONS } from "@/lib/learn";
import { listPublishedGuides } from "@/lib/manuscripts";
import { GAME_SLUGS, SECTIONS } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

const ARCADE_CABINETS = ["chip-chase", "boiler-dig", "topside"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const paths = [
    "/",
    "/guides",
    ...GAME_SLUGS.map((slug) => `/${slug}`),
    ...SECTIONS.map((section) => `/${section.slug}`),
    ...ARCADE_CABINETS.map((slug) => `/arcade/${slug}`),
    ...STATIONS.map((station) => `/learn/${station.slug}`),
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

  const community = await listPublishedGuides().catch(() => []);
  const communityEntries: MetadataRoute.Sitemap = community.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.id}`),
    lastModified: guide.reviewedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...base, ...guideEntries, ...communityEntries];
}
