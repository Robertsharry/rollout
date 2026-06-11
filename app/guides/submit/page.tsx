import { Link } from "next-view-transitions";

import { submitGuide } from "@/app/guides/actions";
import { Container, Section } from "@/components/site/section";
import { requireUser } from "@/lib/auth-helpers";
import { listMySubmissions } from "@/lib/manuscripts";
import { buildMetadata } from "@/lib/seo";
import { GAMES } from "@/lib/site";
import { cn, formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Manuscript Desk — Submit a Guide",
  path: "/guides/submit",
  noIndex: true,
});

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  pending: { label: "With the house", tone: "text-gold-light border-gold-light/50" },
  published: { label: "On the shelf", tone: "text-sage border-sage/50" },
  declined: { label: "Returned", tone: "text-oxblood-bright border-oxblood-bright/50" },
};

interface SubmitPageProps {
  searchParams: Promise<{ sent?: string; trouble?: string }>;
}

export default async function SubmitGuidePage({ searchParams }: SubmitPageProps) {
  const user = await requireUser();
  const [params, mine] = await Promise.all([
    searchParams,
    listMySubmissions(user.id),
  ]);

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
          The Manuscript Desk
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-sage">
          Write the guide you wish existed. The house reads every manuscript
          before it reaches the shelf — what gets printed carries your name and
          your handle, forever.
        </p>

        {params.sent ? (
          <p className="mt-6 rounded-md border border-sage/50 bg-card/60 px-4 py-3 text-sm text-sage">
            Received. The house reads in order — you will get a bell either
            way.
          </p>
        ) : null}
        {params.trouble ? (
          <p className="mt-6 rounded-md border border-oxblood-bright/50 bg-card/60 px-4 py-3 text-sm text-sage">
            Something in the manuscript did not take — titles need 8 characters,
            the body at least 200. Give it another pass.
          </p>
        ) : null}

        <form action={submitGuide} className="glass mt-8 space-y-4 rounded-lg p-6">
          <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
            <label className="block">
              <span className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
                Shelf
              </span>
              <select
                name="game"
                required
                className="mt-2 h-11 w-full rounded-md border border-border bg-background/40 px-3 text-sm outline-none focus:border-brass"
              >
                {GAMES.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name}
                  </option>
                ))}
                <option value="general">General</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
                Title
              </span>
              <input
                name="title"
                required
                minLength={8}
                maxLength={120}
                placeholder="e.g. The two minute extraction checklist"
                className="mt-2 h-11 w-full rounded-md border border-border bg-background/40 px-3.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
              />
            </label>
          </div>
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
              The manuscript
            </span>
            <textarea
              name="body"
              required
              minLength={200}
              maxLength={20000}
              rows={14}
              placeholder="Plain text, blank line between paragraphs. At least 200 characters — real guides have meat on them. No invented stats; the house checks."
              className="mt-2 w-full rounded-md border border-border bg-background/40 px-3.5 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60 focus:border-brass"
            />
          </label>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-sage">
              House standard: accurate, specific, written like you talk.
            </p>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Hand it to the house
            </button>
          </div>
        </form>

        {mine.length > 0 ? (
          <div className="mt-10">
            <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
              Your manuscripts
            </h2>
            <ul className="mt-4 space-y-2.5">
              {mine.map((m) => {
                const status = STATUS_COPY[m.status] ?? STATUS_COPY.pending;
                return (
                  <li
                    key={m.id}
                    className="glass flex flex-wrap items-center justify-between gap-3 rounded-lg p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {formatRelative(m.createdAt)}
                        {m.reviewNote ? ` · note: ${m.reviewNote}` : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase",
                        status.tone,
                      )}
                    >
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
