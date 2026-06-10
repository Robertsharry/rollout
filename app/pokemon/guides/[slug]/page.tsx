import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx";
import { DiscordButton } from "@/components/site/discord-button";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import {
  artworkUrl,
  getPokemonGuide,
  getPokemonGuides,
  type StatBlock,
} from "@/lib/guides";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guides = await getPokemonGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getPokemonGuide(slug);
  if (!guide) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/pokemon/guides/${guide.slug}`,
    keywords: [
      `${guide.starter.toLowerCase()} guide`,
      `${guide.starter.toLowerCase()} evolution`,
      `${guide.starter.toLowerCase()} moveset`,
      "pokemon starter guide",
    ],
  });
}

const STAT_LABELS: { key: keyof StatBlock; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Attack" },
  { key: "def", label: "Defense" },
  { key: "spa", label: "Sp. Atk" },
  { key: "spd", label: "Sp. Def" },
  { key: "spe", label: "Speed" },
];

function StatLedger({ stats }: { stats: StatBlock }) {
  return (
    <div className="space-y-2.5">
      {STAT_LABELS.map(({ key, label }) => {
        const value = stats[key];
        const width = Math.min(100, Math.round((value / 120) * 100));
        return (
          <div key={key} className="grid grid-cols-[5.5rem_2.5rem_1fr] items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              {label}
            </span>
            <span className="text-right font-mono text-sm text-gold-light">
              {value}
            </span>
            <span className="h-1 overflow-hidden rounded-full bg-brass/15">
              <span
                className="block h-full rounded-full bg-brass"
                style={{ width: `${width}%` }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getPokemonGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pokémon", path: "/pokemon" },
          { name: guide.starter, path: `/pokemon/guides/${guide.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          dateModified: guide.updated,
          url: absoluteUrl(`/pokemon/guides/${guide.slug}`),
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name },
        }}
      />

      <Section spacing="none" className="pt-28 pb-20">
        <Container className="max-w-3xl">
          <Link
            href="/pokemon"
            className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
          >
            ← The specimen cabinet
          </Link>

          {/* specimen plate */}
          <header className="glass mt-5 overflow-hidden rounded-lg">
            <div className="border-b border-brass/30 bg-card/80 px-6 py-3 text-center">
              <span className="font-display text-xs font-semibold tracking-[0.24em] text-gold-light uppercase">
                Specimen №{String(guide.dexId).padStart(3, "0")} · House field
                guide
              </span>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
              <div className="relative mx-auto">
                <div
                  aria-hidden
                  className="absolute inset-4 rounded-full bg-brass/10 blur-2xl"
                />
                <Image
                  src={artworkUrl(guide.dexId)}
                  alt={`Official artwork of ${guide.starter}`}
                  width={200}
                  height={200}
                  priority
                  className="relative"
                />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {guide.title}
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
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
              </div>
            </div>

            <div className="grid gap-8 border-t border-border/60 p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <h2 className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
                  Base stats — ledger
                </h2>
                <div className="mt-4">
                  <StatLedger stats={guide.stats} />
                </div>
              </div>
              <div>
                <h2 className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
                  The evolution line
                </h2>
                <div className="mt-4 flex items-center justify-between gap-2">
                  {guide.evolutions.map((stage, i) => (
                    <div key={stage.dexId} className="flex items-center gap-2">
                      {i > 0 ? (
                        <span aria-hidden className="text-brass">
                          ☞
                        </span>
                      ) : null}
                      <div className="text-center">
                        <Image
                          src={artworkUrl(stage.dexId)}
                          alt={`Official artwork of ${stage.name}`}
                          width={72}
                          height={72}
                        />
                        <p className="mt-1 text-xs font-medium">{stage.name}</p>
                        <p className="font-mono text-[11px] text-sage">
                          {stage.method}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <article className="mt-4">
            <MDXRemote source={guide.content} components={mdxComponents} />
          </article>

          <footer className="mt-12 border-t border-border/60 pt-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="font-mono text-xs tracking-[0.14em] text-sage uppercase">
                Filed {guide.updated} · By the house outfitters
              </p>
              <DiscordButton label="Argue your pick in Discord" />
            </div>
          </footer>
        </Container>
      </Section>
    </>
  );
}
