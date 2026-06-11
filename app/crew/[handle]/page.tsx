import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServiceRecord } from "@/lib/crew";
import { BOARD_BY_SLUG } from "@/lib/saloon";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { GAMES } from "@/lib/site";
import { cn, formatRelative } from "@/lib/utils";

const GAME_NAMES: Record<string, string> = {
  ...Object.fromEntries(GAMES.map((g) => [g.slug, g.name])),
  "penny-arcade": "Penny Arcade",
  general: "General",
};

interface CrewPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: CrewPageProps): Promise<Metadata> {
  const { handle } = await params;
  const record = await getServiceRecord(handle);
  if (!record) return buildMetadata({ title: "No such crew member", noIndex: true });
  return buildMetadata({
    title: `Service Record — ${record.user.name ?? record.handle} (@${record.handle})`,
    description: `${record.user.name ?? record.handle}'s service record aboard the S.S. Rollout: ribbons, manuscripts, board runs, and saloon threads.`,
    path: `/crew/${record.handle}`,
  });
}

export default async function CrewPage({ params }: CrewPageProps) {
  const { handle } = await params;
  const record = await getServiceRecord(handle);
  if (!record) notFound();

  const initials = (record.user.name ?? "P").slice(0, 2).toUpperCase();
  const enlistedLabel = record.enlisted.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Crew", path: "/crew" },
          { name: `@${record.handle}`, path: `/crew/${record.handle}` },
        ])}
      />

      <Section spacing="none" className="pt-28 pb-24">
        <Container className="max-w-3xl">
          {/* the record plate */}
          <header className="glass relative overflow-hidden rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brass/30 bg-card/80 px-6 py-3">
              <span className="font-display text-[11px] font-semibold tracking-[0.24em] text-gold-light uppercase">
                Service record · S.S. Rollout
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
                {record.crewNumber !== null
                  ? `Crew №${String(record.crewNumber).padStart(4, "0")}`
                  : "The House"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-5 p-7 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <Avatar className="size-24 ring-2 ring-brass/60">
                  <AvatarImage src={record.user.image ?? undefined} alt="" />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                {record.plankOwner ? (
                  <span
                    aria-hidden
                    className="absolute -right-1 -bottom-1 grid size-7 place-items-center rounded-full border border-gold-light bg-[#241A12] text-xs"
                    title="Plank Owner"
                  >
                    ⚓
                  </span>
                ) : null}
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-3xl font-bold tracking-tight">
                  {record.user.name ?? "A patron"}
                </h1>
                <p className="mt-1 font-mono text-sm text-gold-light">
                  @{record.handle}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
                    {record.role}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
                    Enlisted {enlistedLabel}
                  </span>
                </div>
                {record.plankOwner ? (
                  <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-gold-light uppercase">
                    ⚓ Plank Owner — original crew, on the record forever
                  </p>
                ) : null}
              </div>
            </div>
          </header>

          {/* the ribbon rack */}
          <section className="glass mt-6 rounded-lg p-6" aria-label="Ribbon rack">
            <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
              Ribbon rack
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {record.ribbons.map((ribbon) => (
                <div
                  key={ribbon.id}
                  className={cn(!ribbon.earned && "opacity-35")}
                  title={ribbon.note}
                >
                  <div
                    className={cn(
                      "h-8 w-full max-w-32 rounded-[2px] border",
                      ribbon.earned ? "border-brass/70" : "border-border grayscale",
                    )}
                    style={{ background: ribbon.pattern }}
                  />
                  <p className="mt-1.5 text-xs font-medium">
                    {ribbon.name}
                    {!ribbon.earned ? (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {" "}
                        · not yet earned
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-sage">
                    {ribbon.note}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* the record proper */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="glass rounded-lg p-5">
              <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                In print · {record.counts.guides}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {record.printedGuides.length === 0 ? (
                  <li className="text-sm text-sage">
                    No manuscripts on the shelf yet.
                  </li>
                ) : (
                  record.printedGuides.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/guides/${g.id}`}
                        className="group block text-sm"
                      >
                        <span className="font-medium transition-colors group-hover:text-gold-light">
                          {g.title}
                        </span>
                        <span className="ml-2 font-mono text-[10px] tracking-[0.1em] text-sage uppercase">
                          {GAME_NAMES[g.game] ?? g.game}
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="glass rounded-lg p-5">
              <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                On the board · {record.counts.scores}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {record.recentScores.length === 0 ? (
                  <li className="text-sm text-sage">Nothing chalked yet.</li>
                ) : (
                  record.recentScores.map((s) => (
                    <li key={s.id} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate">{s.label}</span>
                      {s.value !== null ? (
                        <span className="shrink-0 font-mono text-gold-light tabular-nums">
                          {s.value.toLocaleString()}
                        </span>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="glass rounded-lg p-5 md:col-span-2">
              <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                In the saloon · {record.counts.threads}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {record.recentThreads.length === 0 ? (
                  <li className="text-sm text-sage">
                    Has not taken the floor yet.
                  </li>
                ) : (
                  record.recentThreads.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/forums/${t.board}/${t.id}`}
                        className="group flex flex-wrap items-baseline justify-between gap-x-4 text-sm"
                      >
                        <span className="min-w-0 font-medium transition-colors group-hover:text-gold-light">
                          {t.title}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.1em] text-sage uppercase">
                          {BOARD_BY_SLUG[t.board]?.name ?? t.board} ·{" "}
                          {formatRelative(t.createdAt)}
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>

          <p className="mt-8 text-center font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
            The record is permanent — the river remembers
          </p>
        </Container>
      </Section>
    </>
  );
}
