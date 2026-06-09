import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/site/coming-soon";
import { buildMetadata } from "@/lib/seo";
import { GAME_SLUGS, GAMES } from "@/lib/site";

interface GamePageProps {
  params: Promise<{ game: string }>;
}

export function generateStaticParams() {
  return GAME_SLUGS.map((game) => ({ game }));
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
  const data = GAMES.find((g) => g.slug === game);
  if (!data) notFound();

  return (
    <ComingSoon
      title={`${data.name} Hub`}
      blurb={`${data.blurb} Tutorials, loadouts, and discussion are dropping soon — get in the Discord to help shape what we build first.`}
      icon={data.icon}
      accent={data.accent}
      phase={data.slug === "pokemon" ? "Phase 1" : "Phase 1–3"}
    />
  );
}
