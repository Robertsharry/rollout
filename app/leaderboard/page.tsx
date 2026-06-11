import { Link } from "next-view-transitions";

import { postScore } from "@/app/leaderboard/actions";
import { AuthorChip } from "@/components/community/author-chip";
import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { currentUser } from "@/lib/auth-helpers";
import { listScores } from "@/lib/community";
import { isDbConfigured } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { GAMES } from "@/lib/site";
import { cn, formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The House Board — Community Leaderboard",
  description:
    "The Rollout house board: post your scores, clears, and personal bests across Pokémon, UFC, Arc Raiders, Helldivers 2, and the Penny Arcade.",
  path: "/leaderboard",
});

const TABLES = [
  { slug: "all", name: "Full board" },
  ...GAMES.map((g) => ({ slug: g.slug, name: g.name })),
  { slug: "penny-arcade", name: "Penny Arcade" },
];

const GAME_NAMES: Record<string, string> = {
  ...Object.fromEntries(GAMES.map((g) => [g.slug, g.name])),
  "penny-arcade": "Penny Arcade",
};

interface BoardPageProps {
  searchParams: Promise<{ table?: string }>;
}

export default async function LeaderboardPage({ searchParams }: BoardPageProps) {
  const { table } = await searchParams;
  const active = TABLES.some((t) => t.slug === table) ? table! : "all";
  const [entries, user] = await Promise.all([
    listScores(active === "all" ? undefined : active),
    currentUser(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "House Board", path: "/leaderboard" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="The grand foyer · The House Board"
            title="Put your name on the board."
            description="Scores, clears, speedruns, personal bests — post the run and let the squad argue about it. The board never sleeps and never forgets."
          />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container className="max-w-4xl">
          {!isDbConfigured ? (
            <div className="glass mx-auto max-w-md rounded-lg p-8 text-center">
              <h2 className="font-display text-xl font-bold">
                The board lights up with the database
              </h2>
              <div className="mt-6 flex justify-center">
                <DiscordButton />
              </div>
            </div>
          ) : (
            <>
              {/* post a run */}
              <Reveal>
                <div className="glass rounded-lg p-5">
                  {user ? (
                    <form
                      action={postScore}
                      className="grid gap-3 sm:grid-cols-[10rem_1fr_7rem_auto]"
                    >
                      <select
                        name="game"
                        required
                        className="h-11 rounded-md border border-border bg-background/40 px-3 text-sm outline-none focus:border-brass"
                      >
                        {TABLES.filter((t) => t.slug !== "all").map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <input
                        name="label"
                        required
                        minLength={3}
                        maxLength={120}
                        placeholder="The claim — e.g. Super Helldive clear, zero deaths"
                        className="h-11 rounded-md border border-border bg-background/40 px-3.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
                      />
                      <input
                        name="value"
                        type="number"
                        min={0}
                        placeholder="Number"
                        className="h-11 rounded-md border border-border bg-background/40 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
                      />
                      <button
                        type="submit"
                        className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                      >
                        Chalk it up
                      </button>
                    </form>
                  ) : (
                    <p className="text-center text-sm text-sage">
                      <Link
                        href="/signin"
                        className="text-brass underline underline-offset-4"
                      >
                        Check in with Discord
                      </Link>{" "}
                      to chalk your run onto the board. Arcade bests count —
                      the cabinets show your top score under BEST.
                    </p>
                  )}
                </div>
              </Reveal>

              {/* table filter */}
              <div className="mt-8 flex flex-wrap gap-2">
                {TABLES.map((t) => (
                  <Link
                    key={t.slug}
                    href={t.slug === "all" ? "/leaderboard" : `/leaderboard?table=${t.slug}`}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                      active === t.slug
                        ? "border-brass bg-primary text-primary-foreground"
                        : "border-border text-sage hover:border-brass/60 hover:text-foreground",
                    )}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>

              {/* the board */}
              <div className="mt-6 space-y-3">
                {entries.length === 0 ? (
                  <p className="py-10 text-center text-sm text-sage">
                    Nothing chalked up here yet. House record is wide open.
                  </p>
                ) : (
                  entries.map((entry, i) => (
                    <Reveal key={entry.id}>
                      <div className="glass flex items-center gap-4 rounded-lg p-4">
                        <span className="w-8 shrink-0 text-center font-mono text-sm text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-medium">
                            {entry.label}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <AuthorChip
                              author={entry.author}
                              meta={formatRelative(entry.createdAt)}
                              linkToRecord
                            />
                            <span className="font-mono text-[11px] tracking-[0.1em] text-gold-light uppercase">
                              {GAME_NAMES[entry.game] ?? entry.game}
                            </span>
                          </div>
                        </div>
                        {entry.value !== null ? (
                          <span className="shrink-0 border border-brass/40 bg-card/50 px-3 py-1.5 font-mono text-sm font-bold text-gold-light tabular-nums">
                            {entry.value.toLocaleString()}
                          </span>
                        ) : null}
                      </div>
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
