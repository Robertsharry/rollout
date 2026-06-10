import Image from "next/image";
import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { artworkUrl, getPokemonGuides } from "@/lib/guides";
import { GENERATIONS, STARTER_COUNT, type StarterLine } from "@/lib/pokemon-starters";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Pokémon Starter Field Guides, Kanto to Paldea — The Specimen Cabinet",
  description:
    "Every starter from all nine generations cataloged in one cabinet — Kanto through Paldea, 27 lines. Full field guides with stats, evolutions, movesets, and gym matchups, rolling out wing by wing.",
  path: "/pokemon",
  keywords: [
    "pokemon starter guide",
    "best starter pokemon",
    "all pokemon starters by generation",
    "kanto starters",
    "paldea starters",
    "scarlet violet starters",
  ],
});

function SpecimenPlate({
  starter,
  guideReady,
}: {
  starter: StarterLine;
  guideReady: boolean;
}) {
  const inner = (
    <>
      <div className="border-b border-brass/30 bg-card/80 px-3 py-2 text-center">
        <span className="font-display text-[10px] font-semibold tracking-[0.18em] text-gold-light uppercase">
          №{String(starter.dexId).padStart(3, "0")} — {starter.name}
        </span>
      </div>
      <div className="relative flex justify-center px-4 pt-4">
        <div
          aria-hidden
          className={cn(
            "absolute top-7 size-24 rounded-full blur-2xl transition-all duration-300",
            guideReady ? "bg-brass/15 group-hover:bg-brass/25" : "bg-brass/5",
          )}
        />
        <Image
          src={artworkUrl(starter.dexId)}
          alt={`Official artwork of ${starter.name}`}
          width={120}
          height={120}
          className={cn(
            "relative transition-transform duration-300",
            guideReady ? "group-hover:scale-105" : "opacity-90",
          )}
        />
      </div>
      <div className="flex flex-1 flex-col items-center gap-2.5 p-4 pt-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {starter.types.map((type) => (
            <span
              key={type}
              className="rounded-full border border-brass/40 bg-background/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-gold-light uppercase"
            >
              {type}
            </span>
          ))}
        </div>
        {guideReady ? (
          <span className="mt-auto text-sm font-medium text-brass">
            Open the field guide <span aria-hidden>☞</span>
          </span>
        ) : (
          <span className="mt-auto font-mono text-[10px] tracking-[0.14em] text-muted-foreground/90 uppercase">
            Guide commissioned
          </span>
        )}
      </div>
    </>
  );

  if (guideReady) {
    return (
      <Link
        href={`/pokemon/guides/${starter.guideSlug}`}
        className="group glass flex h-full flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/60"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-lg border-border/60">
      {inner}
    </div>
  );
}

export default async function PokemonPage() {
  const written = new Set((await getPokemonGuides()).map((g) => g.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pokémon", path: "/pokemon" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-10">
        <Container>
          <SectionHeading
            align="center"
            kicker="The specimen cabinet"
            title="Nine generations. Every starter. One cabinet."
            description={`All ${STARTER_COUNT} starter lines from Kanto to Paldea, cataloged by the house outfitters. Kanto's full field guides are on the shelf now — stats, evolutions, movesets, and the road through the gyms. The remaining wings are commissioned and filling drawer by drawer.`}
          />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container>
          <div className="space-y-12">
            {GENERATIONS.map((gen) => (
              <Reveal key={gen.gen}>
                <section aria-label={`Generation ${gen.gen}: ${gen.region}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-brass/25 pb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-sm font-bold tracking-[0.18em] text-gold-light uppercase">
                        Wing {String(gen.gen).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        {gen.region}
                      </h2>
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
                      {gen.games}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {gen.starters.map((starter) => (
                      <SpecimenPlate
                        key={starter.dexId}
                        starter={starter}
                        guideReady={Boolean(
                          starter.guideSlug && written.has(starter.guideSlug),
                        )}
                      />
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-sage">
              Which wing should the outfitters write next? The squad decides.
            </p>
            <div className="mt-4 flex justify-center">
              <DiscordButton label="Vote the next guides in Discord" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
