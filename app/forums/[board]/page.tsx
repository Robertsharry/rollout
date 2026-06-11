import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { createThread } from "@/app/forums/actions";
import { AuthorChip } from "@/components/community/author-chip";
import { MentionTextarea } from "@/components/community/mention-textarea";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { currentUser } from "@/lib/auth-helpers";
import { listThreads } from "@/lib/community";
import { BOARD_BY_SLUG, BOARD_SLUGS } from "@/lib/saloon";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { formatRelative } from "@/lib/utils";

interface BoardPageProps {
  params: Promise<{ board: string }>;
}

export function generateStaticParams() {
  return BOARD_SLUGS.map((board) => ({ board }));
}

export async function generateMetadata({
  params,
}: BoardPageProps): Promise<Metadata> {
  const { board } = await params;
  const data = BOARD_BY_SLUG[board];
  if (!data) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: `${data.name} — The Saloon`,
    description: data.blurb,
    path: `/forums/${board}`,
  });
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { board } = await params;
  const data = BOARD_BY_SLUG[board];
  if (!data) notFound();

  const [boardThreads, user] = await Promise.all([
    listThreads(board),
    currentUser(),
  ]);
  const Icon = data.icon;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Saloon", path: "/forums" },
          { name: data.name, path: `/forums/${board}` },
        ])}
      />

      <Section spacing="none" className="pt-28 pb-24">
        <Container className="max-w-4xl">
          <Link
            href="/forums"
            className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
          >
            ← The Saloon
          </Link>

          <div
            className="mt-5 flex items-center gap-4"
            style={{ "--accent": data.accent } as React.CSSProperties}
          >
            <span
              className="grid size-12 shrink-0 place-items-center rounded-lg border"
              style={{
                background: "color-mix(in oklch, var(--accent) 14%, transparent)",
                borderColor: "color-mix(in oklch, var(--accent) 35%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Icon className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {data.name}
              </h1>
              <p className="mt-1 text-sm text-sage">{data.blurb}</p>
            </div>
          </div>

          {/* new thread */}
          <div className="glass mt-8 rounded-lg p-5">
            {user ? (
              <form action={createThread} className="space-y-3">
                <input type="hidden" name="board" value={board} />
                <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                  Start a thread
                </h2>
                <input
                  name="title"
                  required
                  minLength={3}
                  maxLength={120}
                  placeholder="Give it a title worth arguing about"
                  className="w-full rounded-md border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
                />
                <MentionTextarea
                  name="body"
                  required
                  rows={4}
                  placeholder="Say your piece. Type @ to mention a member."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                  >
                    Put it on the felt
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-center text-sm text-sage">
                <Link href="/signin" className="text-brass underline underline-offset-4">
                  Check in with Discord
                </Link>{" "}
                to start a thread at this table.
              </p>
            )}
          </div>

          {/* threads */}
          <div className="mt-8 space-y-3">
            {boardThreads.length === 0 ? (
              <p className="py-8 text-center text-sm text-sage">
                No threads yet. The felt is fresh — deal first.
              </p>
            ) : (
              boardThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/forums/${board}/${thread.id}`}
                  className="group glass block rounded-lg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/60"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="min-w-0 font-display text-lg font-bold tracking-tight transition-colors group-hover:text-gold-light">
                      {thread.title}
                    </h3>
                    <span className="font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {thread.replyCount} replies ·{" "}
                      {formatRelative(thread.lastActivityAt)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <AuthorChip author={thread.author} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
