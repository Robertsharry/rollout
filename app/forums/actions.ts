"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import {
  createNotifications,
  extractMentions,
  findUsersByHandles,
} from "@/lib/community";
import { db } from "@/lib/db";
import { threads, replies } from "@/lib/db/schema";
import { BOARD_SLUGS } from "@/lib/saloon";

const ThreadInput = z.object({
  board: z.string().refine((b) => BOARD_SLUGS.includes(b)),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(3).max(5000),
});

const ReplyInput = z.object({
  threadId: z.string().min(10),
  body: z.string().trim().min(1).max(5000),
});

async function notifyMentions(
  actorId: string,
  body: string,
  threadId: string,
  snippet: string,
) {
  const handles = extractMentions(body);
  if (handles.length === 0) return;
  const mentioned = await findUsersByHandles(handles);
  await createNotifications(
    mentioned
      .filter((m) => m.id !== actorId)
      .map((m) => ({
        userId: m.id,
        actorId,
        kind: "mention" as const,
        threadId,
        snippet,
      })),
  );
}

export async function createThread(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/forums");

  const parsed = ThreadInput.safeParse({
    board: formData.get("board"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) redirect("/forums?trouble=1");
  const { board, title, body } = parsed.data;

  const [thread] = await db
    .insert(threads)
    .values({ board, title, body, authorId: user.id })
    .returning({ id: threads.id });

  await notifyMentions(user.id, body, thread.id, title.slice(0, 80));

  revalidatePath(`/forums/${board}`);
  revalidatePath("/forums");
  redirect(`/forums/${board}/${thread.id}`);
}

export async function createReply(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/forums");

  const parsed = ReplyInput.safeParse({
    threadId: formData.get("threadId"),
    body: formData.get("body"),
  });
  if (!parsed.success) redirect("/forums?trouble=1");
  const { threadId, body } = parsed.data;

  const [thread] = await db
    .select({ id: threads.id, board: threads.board, authorId: threads.authorId, title: threads.title })
    .from(threads)
    .where(eq(threads.id, threadId))
    .limit(1);
  if (!thread) redirect("/forums");

  await db.insert(replies).values({ threadId, body, authorId: user.id });
  await db
    .update(threads)
    .set({
      replyCount: sql`${threads.replyCount} + 1`,
      lastActivityAt: new Date(),
    })
    .where(eq(threads.id, threadId));

  // tell the thread author someone pulled up a chair
  if (thread.authorId !== user.id) {
    await createNotifications([
      {
        userId: thread.authorId,
        actorId: user.id,
        kind: "reply",
        threadId,
        snippet: thread.title.slice(0, 80),
      },
    ]);
  }
  await notifyMentions(user.id, body, threadId, thread.title.slice(0, 80));

  revalidatePath(`/forums/${thread.board}/${threadId}`);
  redirect(`/forums/${thread.board}/${threadId}`);
}
