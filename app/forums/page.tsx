import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { currentUser } from "@/lib/auth-helpers";
import { boardSummaries, recentThreads } from "@/lib/community";
import { isDbConfigured } from "@/lib/env";
import { BOARDS } from "@/lib/saloon";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Saloon — Community Forums",
  description:
    "The Rollout saloon: a general table plus a table each for Pokémon, UFC, Arc Raiders, and Helldivers 2. Pull up a chair, start a thread, mention the squad by name.",
  path: "/forums",
});

export default async function ForumsPage() {
  const [summaries, recent, user] = await Promise.all([
    boardSummaries(),
    recentThreads(6),
    currentUser(),
  ]);
  const summaryByBoard = new Map(summaries.map((s) => [s.board, s]));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Saloon", path: "/forums" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Deck 2 · The Saloon"
            title="Pull up a chair."
            description="Five tables, one house. Start a thread, argue your starter pick, post your clutch run — and mention any member by @handle to ring their bell."
          />
          {!user ? (
            <p className="mt-6 text-center font-mono text-xs tracking-[0.14em] text-sage uppercase">
              Reading is open to all — posting needs a quick check in with
              Discord
            </p>
          ) : null}
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container className="max-w-5xl">
          {!isDbConfigured ? (
            <div className="glass mx-auto max-w-md rounded-lg p-8 text-center">
              <h2 className="font-display text-xl font-bold">
                The saloon opens with the database
              </h2>
              <p className="mt-2 text-sm text-sage">
                Until then, the conversation lives in the Discord.
              </p>
              <div className="mt-6 flex justify-center">
                <DiscordButton />
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-4">
                {BOARDS.map((board) => {
                  const Icon = board.icon;
                  const summary = summaryByBoard.get(board.slug);
                  return (
                    <Reveal key={board.slug}>
                      <Link
                        href={`/forums/${board.slug}`}
                        style={{ "--accent": board.accent } as React.CSSProperties}
                        className="group glass flex items-center gap-5 rounded-lg p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/60"
                      >
                        <span
                          className="grid size-12 shrink-0 place-items-center rounded-lg border"
                          style={{
                            background:
                              "color-mix(in oklch, var(--accent) 14%, transparent)",
                            borderColor:
                              "color-mix(in oklch, var(--accent) 35%, transparent)",
                            color: "var(--accent)",
                          }}
                        >
                          <Icon className="size-6" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-display text-lg font-bold tracking-tight">
                              {board.name}
                            </span>
                            <span className="font-mono text-[11px] tracking-[0.12em] text-gold-light uppercase">
                              {summary?.threadCount ?? 0} threads
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-sm text-sage">
                            {summary?.latestTitle
                              ? `Latest: ${summary.latestTitle}`
                              : board.blurb}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-medium text-brass">
                          <span aria-hidden>☞</span>
                        </span>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal>
                <aside className="glass rounded-lg p-5">
                  <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                    Fresh from the felt
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {recent.length === 0 ? (
                      <li className="text-sm text-sage">
                        Quiet in here. First round is on the house — start a
                        thread.
                      </li>
                    ) : (
                      recent.map((thread) => (
                        <li key={thread.id}>
                          <Link
                            href={`/forums/${thread.board}/${thread.id}`}
                            className="group block"
                          >
                            <span className="block truncate text-sm font-medium transition-colors group-hover:text-gold-light">
                              {thread.title}
                            </span>
                            <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                              {thread.replyCount} replies ·{" "}
                              {formatRelative(thread.lastActivityAt)}
                            </span>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </aside>
              </Reveal>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
