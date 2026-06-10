import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/site/coming-soon";
import { buildMetadata } from "@/lib/seo";
import { GAME_SLUGS, GAMES } from "@/lib/site";

interface GamePageProps {
  params: Promise<{ game: string }>;
}

// Pokémon and UFC have dedicated routes; this dynamic stub serves the rest.
const STUB_SLUGS = GAME_SLUGS.filter(
  (slug) => slug !== "pokemon" && slug !== "ufc",
);

export function generateStaticParams() {
  return STUB_SLUGS.map((game) => ({ game }));
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { game } = await params;
  const data = GAMES.find((g) => g.slug === game);
  if (!data) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: `${data.name} Hub`,
    description: data.blurb,
    path: `/${data.slug}`,
  });
}

export default async function GamePage({ params }: GamePageProps) {
  const { game } = await params;
  const data = GAMES.find((g) => g.slug === game && STUB_SLUGS.includes(g.slug));
  if (!data) notFound();

  return (
    <ComingSoon
      title={`${data.name} Hub`}
      blurb={`${data.blurb} Guides, loadouts, and discussion are on the way — step into the Discord to help shape what we outfit first.`}
      icon={data.icon}
      accent={data.accent}
      phase="Phase 3"
    />
  );
}
