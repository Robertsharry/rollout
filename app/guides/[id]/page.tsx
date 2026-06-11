import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { AuthorChip } from "@/components/community/author-chip";
import { PostBody } from "@/components/community/post-body";
import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { getPublishedGuide } from "@/lib/manuscripts";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { GAMES, SITE } from "@/lib/site";
import { absoluteUrl, formatRelative } from "@/lib/utils";

const GAME_NAMES: Record<string, string> = {
  ...Object.fromEntries(GAMES.map((g) => [g.slug, g.name])),
  general: "General",
};

interface GuidePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { id } = await params;
  const guide = await getPublishedGuide(id);
  if (!guide) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: `${guide.title} — Community Guide`,
    description: guide.body.slice(0, 150),
    path: `/guides/${guide.id}`,
  });
}

export default async function CommunityGuidePage({ params }: GuidePageProps) {
  const { id } = await params;
  const guide = await getPublishedGuide(id);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Library", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.id}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.body.slice(0, 200),
          datePublished: (guide.reviewedAt ?? guide.createdAt).toISOString(),
          url: absoluteUrl(`/guides/${guide.id}`),
          author: { "@type": "Person", name: guide.author.name ?? "A patron" },
          publisher: { "@type": "Organization", name: SITE.name },
        }}
      />

      <Section spacing="none" className="pt-28 pb-24">
        <Container className="max-w-3xl">
          <Link
            href="/guides"
            className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
          >
            ← The Library
          </Link>

          <article className="glass mt-5 overflow-hidden rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brass/30 bg-card/80 px-6 py-3">
              <span className="font-display text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase">
                {GAME_NAMES[guide.game] ?? guide.game} · community guide
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-sage uppercase">
                Read &amp; printed by the house
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {guide.title}
              </h1>
              <div className="mt-3">
                <AuthorChip
                  linkToRecord
                  author={guide.author}
                  meta={
                    guide.reviewedAt
                      ? `printed ${formatRelative(guide.reviewedAt)}`
                      : undefined
                  }
                />
              </div>
              <PostBody body={guide.body} className="mt-6" />
            </div>
          </article>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-sage">
              Got a better route, a sharper kit, a cleaner answer? The desk is
              open.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/guides/submit"
                className="inline-flex h-11 items-center justify-center rounded-md border border-brass/50 px-6 text-sm font-semibold transition-colors hover:border-brass hover:bg-card"
              >
                Submit a manuscript
              </Link>
              <DiscordButton label="Argue it in Discord" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
