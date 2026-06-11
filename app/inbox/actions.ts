"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { findOrCreateConversation, markConversationRead } from "@/lib/community";
import { db } from "@/lib/db";
import { conversations, messages, profiles } from "@/lib/db/schema";

const MessageInput = z.object({
  conversationId: z.string().min(10),
  body: z.string().trim().min(1).max(3000),
});

export async function sendMessage(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/inbox");

  const parsed = MessageInput.safeParse({
    conversationId: formData.get("conversationId"),
    body: formData.get("body"),
  });
  if (!parsed.success) redirect("/inbox");
  const { conversationId, body } = parsed.data;

  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (!convo || (convo.userAId !== user.id && convo.userBId !== user.id))
    redirect("/inbox");

  await db.insert(messages).values({ conversationId, senderId: user.id, body });
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId));
  await markConversationRead(conversationId, user.id);

  revalidatePath(`/inbox/${conversationId}`);
  revalidatePath("/inbox");
  redirect(`/inbox/${conversationId}`);
}

const StartInput = z.object({ handle: z.string().trim().min(2).max(32) });

/** Open (or reopen) a private line to another member by handle. */
export async function startConversation(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/inbox");

  const parsed = StartInput.safeParse({ handle: formData.get("handle") });
  if (!parsed.success) redirect("/inbox?trouble=notfound");
  const handle = parsed.data.handle.replace(/^@/, "").toLowerCase();

  const [target] = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.handle, handle))
    .limit(1);

  if (!target || target.userId === user.id) redirect("/inbox?trouble=notfound");

  const convo = await findOrCreateConversation(user.id, target.userId);
  if (!convo) redirect("/inbox");
  redirect(`/inbox/${convo.id}`);
}
