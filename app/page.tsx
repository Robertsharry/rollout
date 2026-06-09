import { CtaBand } from "@/components/home/cta";
import { Featured } from "@/components/home/featured";
import { GamesGrid } from "@/components/home/games-grid";
import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <GamesGrid />
      <Featured />
      <CtaBand />
    </>
  );
}
