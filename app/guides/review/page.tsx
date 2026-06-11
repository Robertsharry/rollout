import { redirect } from "next/navigation";
import { Link } from "next-view-transitions";

import { reviewSubmission } from "@/app/guides/actions";
import { AuthorChip } from "@/components/community/author-chip";
import { PostBody } from "@/components/community/post-body";
import { Container, Section } from "@/components/site/section";
import { requireUser } from "@/lib/auth-helpers";
import { isMod, listPendingSubmissions } from "@/lib/manuscripts";
import { buildMetadata } from "@/lib/seo";
import { GAMES } from "@/lib/site";
import { formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Review Desk",
  path: "/guides/review",
  noIndex: true,
});

const GAME_NAMES: Record<string, string> = {
  ...Object.fromEntries(GAMES.map((g) => [g.slug, g.name])),
  general: "General",
};

export default async function ReviewDeskPage() {
  const user = await requireUser();
  if (!(await isMod(user.id))) redirect("/guides");

  const pending = await listPendingSubmissions();

  return (
    <Section spacing="none" className="pt-28 pb-24">
      <Container className="max-w-3xl">
        <Link
          href="/guides"
          className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
        >
          ← The Library
        </Link>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The review desk
        </h1>
        <p className="mt-2 text-sm text-sage">
          {pending.length === 0
            ? "Nothing waiting. The desk is clear."
            : `${pending.length} manuscript${pending.length === 1 ? "" : "s"} waiting for the house's eye.`}
        </p>

        <div className="mt-8 space-y-6">
          {pending.map((m) => (
            <article key={m.id} className="glass overflow-hidden rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brass/30 bg-card/80 px-5 py-3">
                <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-gold-light uppercase">
                  {GAME_NAMES[m.game] ?? m.game}
                </span>
                <AuthorChip author={m.author} meta={formatRelative(m.createdAt)} linkToRecord />
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="font-display text-xl font-bold tracking-tight">
                  {m.title}
                </h2>
                <details className="mt-3">
                  <summary className="cursor-pointer font-mono text-xs tracking-[0.14em] text-brass uppercase">
                    Read the full manuscript
                  </summary>
                  <PostBody body={m.body} className="mt-3" />
                </details>

                <form
                  action={reviewSubmission}
                  className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4"
                >
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    name="note"
                    maxLength={500}
                    placeholder="Optional note to the author"
                    className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background/40 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
                  />
                  <button
                    type="submit"
                    name="decision"
                    value="published"
                    className="h-10 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                  >
                    Print it
                  </button>
                  <button
                    type="submit"
                    name="decision"
                    value="declined"
                    className="h-10 rounded-md border border-oxblood-bright/50 px-5 text-sm font-semibold text-oxblood-bright transition-colors hover:bg-card"
                  >
                    Return it
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
