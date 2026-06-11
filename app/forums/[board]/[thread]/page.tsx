import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { createReply } from "@/app/forums/actions";
import { AuthorChip } from "@/components/community/author-chip";
import { MentionTextarea } from "@/components/community/mention-textarea";
import { PostBody } from "@/components/community/post-body";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { currentUser } from "@/lib/auth-helpers";
import { getThread } from "@/lib/community";
import { BOARD_BY_SLUG } from "@/lib/saloon";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { formatRelative } from "@/lib/utils";

interface ThreadPageProps {
  params: Promise<{ board: string; thread: string }>;
}

export async function generateMetadata({
  params,
}: ThreadPageProps): Promise<Metadata> {
  const { thread: threadId } = await params;
  const thread = await getThread(threadId);
  if (!thread) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: `${thread.title} — The Saloon`,
    description: thread.body.slice(0, 150),
    path: `/forums/${thread.board}/${thread.id}`,
  });
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { board, thread: threadId } = await params;
  const boardData = BOARD_BY_SLUG[board];
  const [thread, user] = await Promise.all([getThread(threadId), currentUser()]);
  if (!thread || !boardData || thread.board !== board) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Saloon", path: "/forums" },
          { name: boardData.name, path: `/forums/${board}` },
          { name: thread.title, path: `/forums/${board}/${thread.id}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DiscussionForumPosting",
          headline: thread.title,
          text: thread.body.slice(0, 300),
          datePublished: thread.createdAt.toISOString(),
          author: { "@type": "Person", name: thread.author.name ?? "A patron" },
          commentCount: thread.replyCount,
        }}
      />

      <Section spacing="none" className="pt-28 pb-24">
        <Container className="max-w-3xl">
          <Link
            href={`/forums/${board}`}
            className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
          >
            ← {boardData.name}
          </Link>

          {/* the opening post */}
          <article className="glass mt-5 rounded-lg p-6 sm:p-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              {thread.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <AuthorChip
                author={thread.author}
                meta={formatRelative(thread.createdAt)}
              />
            </div>
            <PostBody body={thread.body} className="mt-4" />
          </article>

          {/* replies */}
          <div className="mt-6 space-y-4">
            {thread.replies.map((reply) => (
              <article key={reply.id} className="glass rounded-lg p-5">
                <AuthorChip
                  author={reply.author}
                  meta={formatRelative(reply.createdAt)}
                />
                <PostBody body={reply.body} className="mt-3" />
              </article>
            ))}
          </div>

          {/* reply composer */}
          <div className="glass mt-8 rounded-lg p-5">
            {user ? (
              <form action={createReply} className="space-y-3">
                <input type="hidden" name="threadId" value={thread.id} />
                <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                  Add your piece
                </h2>
                <MentionTextarea
                  name="body"
                  required
                  rows={3}
                  placeholder="Type @ to mention a member — they get a bell."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                  >
                    Reply
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-center text-sm text-sage">
                <Link
                  href="/signin"
                  className="text-brass underline underline-offset-4"
                >
                  Check in with Discord
                </Link>{" "}
                to join this thread.
              </p>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
