import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { sendMessage } from "@/app/inbox/actions";
import { Container, Section } from "@/components/site/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requireUser } from "@/lib/auth-helpers";
import { getConversation, markConversationRead } from "@/lib/community";
import { buildMetadata } from "@/lib/seo";
import { cn, formatRelative } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Private line",
  path: "/inbox",
  noIndex: true,
});

interface ConversationPageProps {
  params: Promise<{ conversation: string }>;
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const user = await requireUser();
  const { conversation: conversationId } = await params;
  const convo = await getConversation(conversationId, user.id);
  if (!convo) notFound();
  await markConversationRead(conversationId, user.id);

  const other = convo.other;
  const initials = (other?.name ?? "P").slice(0, 2).toUpperCase();

  return (
    <Section spacing="none" className="pt-28 pb-24">
      <Container className="max-w-2xl">
        <Link
          href="/inbox"
          className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
        >
          ← The mail room
        </Link>

        <div className="glass mt-5 flex items-center gap-3 rounded-lg p-4">
          <Avatar className="size-9">
            <AvatarImage src={other?.image ?? undefined} alt="" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-display font-bold">
              {other?.name ?? "A patron"}
            </p>
            {other?.handle ? (
              <p className="font-mono text-[11px] text-gold-light">
                @{other.handle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {convo.messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-sage">
              A fresh line. Say something worth the postage.
            </p>
          ) : (
            convo.messages.map((m) => {
              const mine = m.senderId === user.id;
              return (
                <div
                  key={m.id}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2.5",
                      mine
                        ? "bg-primary text-primary-foreground"
                        : "glass text-foreground",
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {m.body}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-right font-mono text-[10px]",
                        mine ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {formatRelative(m.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          action={sendMessage}
          className="glass mt-6 flex items-end gap-3 rounded-lg p-4"
        >
          <input type="hidden" name="conversationId" value={convo.id} />
          <textarea
            name="body"
            required
            rows={2}
            maxLength={3000}
            placeholder="Write your line…"
            className="min-w-0 flex-1 resize-none rounded-md border border-border bg-background/40 px-3.5 py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60 focus:border-brass"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Send
          </button>
        </form>
      </Container>
    </Section>
  );
}
