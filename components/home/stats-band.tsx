import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/site/section";
import { countMembers } from "@/lib/crew";
import { getPokemonGuides } from "@/lib/guides";
import { STATIONS } from "@/lib/learn";
import { listPublishedGuides } from "@/lib/manuscripts";
import { PROGRAM } from "@/lib/theater";

/**
 * Real numbers only: live counts from the database plus honest structural
 * counts. The house does not pad the books.
 */
export async function StatsBand() {
  const [members, houseGuides, communityGuides] = await Promise.all([
    countMembers().catch(() => 0),
    getPokemonGuides().catch(() => []),
    listPublishedGuides().catch(() => []),
  ]);

  const stats = [
    { label: "Members aboard", value: members },
    { label: "Guides on the shelf", value: houseGuides.length + communityGuides.length },
    { label: "Stations below decks", value: STATIONS.length },
    { label: "Reels on the bill", value: PROGRAM.length },
  ];

  return (
    <Section spacing="sm">
      <Container>
        <Reveal>
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-card/30 px-6 py-8 text-center"
              >
                <div className="font-display text-4xl font-bold text-foreground md:text-5xl">
                  <CountUp value={stat.value} suffix="" compact={stat.value >= 1000} />
                </div>
                <div className="font-mono text-xs tracking-[0.16em] text-sage uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
            Live from the ship&apos;s books — the house does not pad numbers
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
