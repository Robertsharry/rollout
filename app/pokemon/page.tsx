import Image from "next/image";
import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { artworkUrl, getPokemonGuides } from "@/lib/guides";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pokémon Starter Field Guides — The Specimen Cabinet",
  description:
    "Full field guides for every Kanto starter: base stats, evolution lines, movesets, gym matchups, and team building. Cataloged by the Rollout house outfitters.",
  path: "/pokemon",
  keywords: [
    "pokemon starter guide",
    "best starter pokemon",
    "bulbasaur guide",
    "charmander guide",
    "squirtle guide",
    "kanto starters",
  ],
});

interface LockedDrawer {
  label: string;
  note: string;
}

const LOCKED_DRAWERS: LockedDrawer[] = [
  { label: "Johto specimens", note: "Arriving soon" },
  { label: "Hoenn specimens", note: "Arriving soon" },
  { label: "Team recipes", note: "Arriving soon" },
];

export default async function PokemonPage() {
  const guides = await getPokemonGuides();

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
            title="Choose your first partner."
            description="Every starter cataloged by the house outfitters: stats, evolutions, movesets, and the road through Kanto. Pull a drawer to read the full field guide."
          />
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/pokemon/guides/${guide.slug}`}
                className="group glass flex h-full flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/60"
              >
                <div className="border-b border-brass/30 bg-card/80 px-4 py-2.5 text-center">
                  <span className="font-display text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase">
                    Specimen №{String(guide.dexId).padStart(3, "0")} —{" "}
                    {guide.starter}
                  </span>
                </div>

                <div className="relative flex justify-center px-6 pt-6">
                  <div
                    aria-hidden
                    className="absolute top-10 size-36 rounded-full bg-brass/10 blur-2xl transition-all duration-300 group-hover:bg-brass/20"
                  />
                  <Image
                    src={artworkUrl(guide.dexId)}
                    alt={`Official artwork of ${guide.starter}`}
                    width={176}
                    height={176}
                    className="relative transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6 pt-4 text-center">
                  <div className="flex justify-center gap-2">
                    {guide.types.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border border-brass/40 bg-background/40 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em] text-gold-light uppercase"
                      >
                        {type}
                      </span>
                    ))}
                    <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em] text-foreground/75 uppercase">
                      {guide.difficulty}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-sage">
                    {guide.summary}
                  </p>
                  <span className="mt-auto pt-5 text-sm font-medium text-brass">
                    Open the field guide <span aria-hidden>☞</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {LOCKED_DRAWERS.map((drawer) => (
              <div
                key={drawer.label}
                className="rounded-md border border-border/70 bg-mahogany/40 px-5 py-4 text-center"
              >
                <p className="font-display text-xs font-semibold tracking-[0.2em] text-foreground/70 uppercase">
                  {drawer.label}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                  {drawer.note}
                </p>
                <span
                  aria-hidden
                  className="mx-auto mt-3 block size-2.5 rounded-full bg-brass/50"
                />
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-sage">
            Got a take on the right pick? The Saloon opens soon — bring your
            argument.
          </p>
        </Container>
      </Section>
    </>
  );
}
