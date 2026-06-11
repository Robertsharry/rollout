import { Link } from "next-view-transitions";
import { AtSign, Bell, BookOpen, MessageSquare, Reply } from "lucide-react";

import { startConversation } from "@/app/inbox/actions";
import { AuthorChip } from "@/components/community/author-chip";
import { Container, Section } from "@/components/site/section";
import { requireUser } from "@/lib/auth-helpers";
import {
  listConversations,
  listNotifications,
  markNotificationsRead,
} from "@/lib/community";
import { buildMetadata } from "@/lib/seo";
import { cn, formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Mail Room",
  path: "/inbox",
  noIndex: true,
});

export default async function InboxPage() {
  const user = await requireUser();
  const [convos, notifs] = await Promise.all([
    listConversations(user.id),
    listNotifications(user.id),
  ]);
  // The bell quiets once you have read the room.
  await markNotificationsRead(user.id);

  return (
    <Section spacing="none" className="pt-28 pb-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The mail room
        </h1>
        <p className="mt-2 text-sm text-sage">
          Private lines and rung bells, kept behind the front desk.
        </p>

        {/* start a line */}
        <form
          action={startConversation}
          className="glass mt-6 flex items-center gap-3 rounded-lg p-4"
        >
          <AtSign className="size-4 shrink-0 text-gold-light" />
          <input
            name="handle"
            required
            minLength={2}
            placeholder="Open a private line — type a member's handle"
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background/40 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Open
          </button>
        </form>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* conversations */}
          <div>
            <h2 className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
              <MessageSquare className="size-3.5" /> Private lines
            </h2>
            <ul className="mt-4 space-y-2.5">
              {convos.length === 0 ? (
                <li className="text-sm text-sage">
                  No lines open yet. Find a handle in the saloon and start one.
                </li>
              ) : (
                convos.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/inbox/${c.id}`}
                      className={cn(
                        "glass block rounded-lg p-4 transition-all hover:-translate-y-0.5 hover:border-brass/60",
                        c.unread && "border-gold-light/60",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {c.otherName ?? "A patron"}
                          </span>
                          {c.otherHandle ? (
                            <span className="font-mono text-[11px] text-gold-light">
                              @{c.otherHandle}
                            </span>
                          ) : null}
                          {c.unread ? (
                            <span
                              aria-label="unread"
                              className="size-2 shrink-0 rotate-45 bg-gold-light"
                            />
                          ) : null}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                          {formatRelative(c.lastMessageAt)}
                        </span>
                      </div>
                      {c.lastBody ? (
                        <p className="mt-1.5 truncate text-sm text-sage">
                          {c.lastBody}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* notifications */}
          <div>
            <h2 className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
              <Bell className="size-3.5" /> Rung bells
            </h2>
            <ul className="mt-4 space-y-2.5">
              {notifs.length === 0 ? (
                <li className="text-sm text-sage">
                  All quiet. Get mentioned or replied to and it lands here.
                </li>
              ) : (
                notifs.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={
                        n.kind === "guide"
                          ? n.submissionId
                            ? `/guides/${n.submissionId}`
                            : "/guides/submit"
                          : n.threadId && n.board
                            ? `/forums/${n.board}/${n.threadId}`
                            : "/forums"
                      }
                      className={cn(
                        "glass block rounded-lg p-4 transition-all hover:-translate-y-0.5 hover:border-brass/60",
                        !n.readAt && "border-gold-light/60",
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        {n.kind === "mention" ? (
                          <AtSign className="size-3.5 shrink-0 text-brass" />
                        ) : n.kind === "guide" ? (
                          <BookOpen className="size-3.5 shrink-0 text-brass" />
                        ) : (
                          <Reply className="size-3.5 shrink-0 text-brass" />
                        )}
                        <AuthorChip author={n.actor} />
                      </div>
                      <p className="mt-1.5 text-sm text-sage">
                        {n.kind === "mention"
                          ? "mentioned you in "
                          : n.kind === "guide"
                            ? "reviewed your manuscript "
                            : "replied to "}
                        <span className="text-foreground/90">“{n.snippet}”</span>
                        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                          {formatRelative(n.createdAt)}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
