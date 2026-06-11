import { Link } from "next-view-transitions";
import { PenLine } from "lucide-react";

import { AuthorChip } from "@/components/community/author-chip";
import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { currentUser } from "@/lib/auth-helpers";
import { isDbConfigured } from "@/lib/env";
import { isMod, listPublishedGuides } from "@/lib/manuscripts";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { GAMES } from "@/lib/site";
import { cn, formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Library — Community Guides",
  description:
    "Guides written by the Rollout squad and set in type by the house: Pokémon, UFC, Arc Raiders, Helldivers 2, and general gaming wisdom. Submit your own at the Manuscript Desk.",
  path: "/guides",
});

const SHELVES = [
  { slug: "all", name: "Every shelf" },
  ...GAMES.map((g) => ({ slug: g.slug, name: g.name })),
  { slug: "general", name: "General" },
];

const GAME_NAMES: Record<string, string> = {
  ...Object.fromEntries(GAMES.map((g) => [g.slug, g.name])),
  general: "General",
};

interface LibraryPageProps {
  searchParams: Promise<{ shelf?: string }>;
}

export default async function GuidesPage({ searchParams }: LibraryPageProps) {
  const { shelf } = await searchParams;
  const active = SHELVES.some((s) => s.slug === shelf) ? shelf! : "all";
  const [guides, user] = await Promise.all([
    listPublishedGuides(active === "all" ? undefined : active),
    currentUser(),
  ]);
  const mod = user ? await isMod(user.id) : false;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Library", path: "/guides" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Deck 3 · The Library"
            title="Written by the squad. Set in type by the house."
            description="Member guides that earned a place on the shelf. Every manuscript is read by the house before it is printed — no slop, no spam, just squad knowledge."
          />
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guides/submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:brightness-110"
            >
              <PenLine className="size-4" />
              Submit a manuscript
            </Link>
            {mod ? (
              <Link
                href="/guides/review"
                className="inline-flex h-11 items-center justify-center rounded-md border border-brass/50 px-5 text-sm font-semibold transition-colors hover:border-brass hover:bg-card"
              >
                The review desk
              </Link>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container className="max-w-4xl">
          {!isDbConfigured ? (
            <div className="glass mx-auto max-w-md rounded-lg p-8 text-center">
              <h2 className="font-display text-xl font-bold">
                The library opens with the database
              </h2>
              <div className="mt-6 flex justify-center">
                <DiscordButton />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {SHELVES.map((s) => (
                  <Link
                    key={s.slug}
                    href={s.slug === "all" ? "/guides" : `/guides?shelf=${s.slug}`}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                      active === s.slug
                        ? "border-brass bg-primary text-primary-foreground"
                        : "border-border text-sage hover:border-brass/60 hover:text-foreground",
                    )}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {guides.length === 0 ? (
                  <p className="py-10 text-center text-sm text-sage">
                    This shelf is waiting for its first volume. The Manuscript
                    Desk is open.
                  </p>
                ) : (
                  guides.map((guide) => (
                    <Reveal key={guide.id}>
                      <Link
                        href={`/guides/${guide.id}`}
                        className="group glass block rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/60"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h2 className="min-w-0 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-gold-light">
                            {guide.title}
                          </h2>
                          <span className="font-mono text-[11px] tracking-[0.12em] text-gold-light uppercase">
                            {GAME_NAMES[guide.game] ?? guide.game}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sage">
                          {guide.body}
                        </p>
                        <div className="mt-3">
                          <AuthorChip
                            author={guide.author}
                            meta={
                              guide.reviewedAt
                                ? `printed ${formatRelative(guide.reviewedAt)}`
                                : undefined
                            }
                          />
                        </div>
                      </Link>
                    </Reveal>
                  ))
                )}
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
