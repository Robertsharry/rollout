import Image from "next/image";
import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { PokedexClient } from "@/components/pokedex/pokedex-client";
import { artworkUrl, getPokemonGuides } from "@/lib/guides";
import { GENERATIONS } from "@/lib/pokemon-starters";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pokédex & Team Builder — All 1025, Every Generation",
  description:
    "The house registry of every Pokémon from Kanto to Paldea. Search all 1025, filter by generation and type, build a squad of six, and get instant coverage analysis: weak spots, walls, and gaps.",
  path: "/pokemon",
  keywords: [
    "pokedex",
    "pokemon team builder",
    "pokemon type coverage",
    "pokemon team weakness calculator",
    "all pokemon by generation",
    "pokemon starter guide",
  ],
});

export default async function PokemonPage() {
  const written = new Set((await getPokemonGuides()).map((g) => g.slug));
  const guidedStarters = GENERATIONS.flatMap((gen) => gen.starters).filter(
    (s) => s.guideSlug && written.has(s.guideSlug),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pokémon", path: "/pokemon" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-8">
        <Container>
          <SectionHeading
            align="center"
            kicker="The specimen cabinet · full registry"
            title="All 1025, cataloged. Draft your six."
            description="Every Pokémon from Kanto to Paldea in one registry. Search it, filter it by generation or type, and tap any specimen to draft it. The house reads your squad as you build — weak spots, walls, and coverage gaps, computed on the spot."
          />
        </Container>
      </Section>

      <Section spacing="none" className="pb-4">
        <Container>
          <PokedexClient />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container>
          <Reveal>
            <div className="border-t border-brass/25 pt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Field guides on the shelf
                </h2>
                <Link
                  href="/guides"
                  className="text-sm font-medium text-brass transition-colors hover:text-gold-light"
                >
                  Browse the Library <span aria-hidden>☞</span>
                </Link>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-sage">
                Long form starter guides written by the house outfitters —
                stats, evolutions, movesets, and the road through the gyms.
                Kanto is on the shelf; the squad votes the next wing in.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {guidedStarters.map((starter) => (
                  <Link
                    key={starter.dexId}
                    href={`/pokemon/guides/${starter.guideSlug}`}
                    className="group glass flex items-center gap-4 rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/60"
                  >
                    <Image
                      src={artworkUrl(starter.dexId)}
                      alt={`Official artwork of ${starter.name}`}
                      width={64}
                      height={64}
                      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-semibold">
                        {starter.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] tracking-[0.14em] text-gold-light uppercase">
                        Full field guide
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
