import "server-only";

import { and, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db";
import {
  conversations,
  messages,
  notifications,
  profiles,
  replies,
  scores,
  threads,
  users,
  type NotificationKind,
} from "@/lib/db/schema";

/* ------------------------------------------------------------- mentions */

export const MENTION_RE = /@([a-z0-9_]{2,32})/g;

/** Pull unique @handles out of a post body. */
export function extractMentions(body: string): string[] {
  return [...new Set([...body.matchAll(MENTION_RE)].map((m) => m[1]))];
}

/* ------------------------------------------------------------- authors */

export interface AuthorChip {
  id: string;
  name: string | null;
  handle: string | null;
  image: string | null;
}

const authorSelect = {
  id: users.id,
  name: users.name,
  image: users.image,
  handle: profiles.handle,
} as const;

/* --------------------------------------------------------------- saloon */

export interface BoardSummary {
  board: string;
  threadCount: number;
  latestTitle: string | null;
  latestAt: Date | null;
}

export async function boardSummaries(): Promise<BoardSummary[]> {
  if (!db) return [];
  const counts = await db
    .select({ board: threads.board, threadCount: count() })
    .from(threads)
    .groupBy(threads.board);
  const latest = await db
    .selectDistinctOn([threads.board], {
      board: threads.board,
      title: threads.title,
      lastActivityAt: threads.lastActivityAt,
    })
    .from(threads)
    .orderBy(threads.board, desc(threads.lastActivityAt));

  const byBoard = new Map(latest.map((l) => [l.board, l]));
  return counts.map((c) => ({
    board: c.board,
    threadCount: c.threadCount,
    latestTitle: byBoard.get(c.board)?.title ?? null,
    latestAt: byBoard.get(c.board)?.lastActivityAt ?? null,
  }));
}

export async function listThreads(board: string, limit = 40) {
  if (!db) return [];
  return db
    .select({
      id: threads.id,
      title: threads.title,
      replyCount: threads.replyCount,
      createdAt: threads.createdAt,
      lastActivityAt: threads.lastActivityAt,
      author: authorSelect,
    })
    .from(threads)
    .innerJoin(users, eq(users.id, threads.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(threads.board, board))
    .orderBy(desc(threads.lastActivityAt))
    .limit(limit);
}

export async function recentThreads(limit = 6) {
  if (!db) return [];
  return db
    .select({
      id: threads.id,
      board: threads.board,
      title: threads.title,
      replyCount: threads.replyCount,
      lastActivityAt: threads.lastActivityAt,
      author: authorSelect,
    })
    .from(threads)
    .innerJoin(users, eq(users.id, threads.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .orderBy(desc(threads.lastActivityAt))
    .limit(limit);
}

export async function getThread(id: string) {
  if (!db) return null;
  const [thread] = await db
    .select({
      id: threads.id,
      board: threads.board,
      title: threads.title,
      body: threads.body,
      replyCount: threads.replyCount,
      createdAt: threads.createdAt,
      author: authorSelect,
    })
    .from(threads)
    .innerJoin(users, eq(users.id, threads.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(threads.id, id))
    .limit(1);
  if (!thread) return null;

  const threadReplies = await db
    .select({
      id: replies.id,
      body: replies.body,
      createdAt: replies.createdAt,
      author: authorSelect,
    })
    .from(replies)
    .innerJoin(users, eq(users.id, replies.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(replies.threadId, id))
    .orderBy(replies.createdAt);

  return { ...thread, replies: threadReplies };
}

/* -------------------------------------------------------------- members */

export async function searchMembers(q: string, limit = 8) {
  if (!db) return [];
  const needle = `%${q}%`;
  return db
    .select(authorSelect)
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(or(ilike(profiles.handle, needle), ilike(users.name, needle)))
    .limit(limit);
}

export async function findUsersByHandles(handles: string[]) {
  if (!db || handles.length === 0) return [];
  return db
    .select(authorSelect)
    .from(profiles)
    .innerJoin(users, eq(users.id, profiles.userId))
    .where(or(...handles.map((h) => eq(profiles.handle, h))));
}

/* -------------------------------------------------------- notifications */

export async function createNotifications(
  rows: {
    userId: string;
    actorId: string;
    kind: NotificationKind;
    threadId?: string;
    submissionId?: string;
    snippet: string;
  }[],
) {
  if (!db || rows.length === 0) return;
  await db.insert(notifications).values(rows);
}

export async function listNotifications(userId: string, limit = 30) {
  if (!db) return [];
  return db
    .select({
      id: notifications.id,
      kind: notifications.kind,
      snippet: notifications.snippet,
      threadId: notifications.threadId,
      submissionId: notifications.submissionId,
      board: threads.board,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
      actor: authorSelect,
    })
    .from(notifications)
    .innerJoin(users, eq(users.id, notifications.actorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .leftJoin(threads, eq(threads.id, notifications.threadId))
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationsRead(userId: string) {
  if (!db) return;
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
}

/* ---------------------------------------------------------- house board */

export async function listScores(game?: string, limit = 60) {
  if (!db) return [];
  const base = db
    .select({
      id: scores.id,
      game: scores.game,
      label: scores.label,
      value: scores.value,
      createdAt: scores.createdAt,
      author: authorSelect,
    })
    .from(scores)
    .innerJoin(users, eq(users.id, scores.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .orderBy(desc(scores.createdAt))
    .limit(limit);
  return game ? base.where(eq(scores.game, game)) : base;
}

/* ------------------------------------------------------------- mail room */

function sortPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function findOrCreateConversation(meId: string, otherId: string) {
  if (!db) return null;
  const [a, b] = sortPair(meId, otherId);
  const existing = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userAId, a), eq(conversations.userBId, b)))
    .limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db
    .insert(conversations)
    .values({ userAId: a, userBId: b })
    .returning();
  return created;
}

export async function listConversations(meId: string) {
  if (!db) return [];
  const other = alias(users, "other");
  const otherProfile = alias(profiles, "otherProfile");
  const rows = await db
    .select({
      id: conversations.id,
      userAId: conversations.userAId,
      userBId: conversations.userBId,
      lastMessageAt: conversations.lastMessageAt,
      aLastReadAt: conversations.aLastReadAt,
      bLastReadAt: conversations.bLastReadAt,
      otherId: other.id,
      otherName: other.name,
      otherImage: other.image,
      otherHandle: otherProfile.handle,
    })
    .from(conversations)
    .innerJoin(
      other,
      sql`${other.id} = case when ${conversations.userAId} = ${meId} then ${conversations.userBId} else ${conversations.userAId} end`,
    )
    .leftJoin(otherProfile, eq(otherProfile.userId, other.id))
    .where(
      or(eq(conversations.userAId, meId), eq(conversations.userBId, meId)),
    )
    .orderBy(desc(conversations.lastMessageAt));

  return Promise.all(
    rows.map(async (row) => {
      const [last] = db
        ? await db
            .select({ body: messages.body, senderId: messages.senderId })
            .from(messages)
            .where(eq(messages.conversationId, row.id))
            .orderBy(desc(messages.createdAt))
            .limit(1)
        : [];
      const myLastRead =
        row.userAId === meId ? row.aLastReadAt : row.bLastReadAt;
      const unread =
        Boolean(last) &&
        last.senderId !== meId &&
        (!myLastRead || row.lastMessageAt > myLastRead);
      return { ...row, lastBody: last?.body ?? null, unread };
    }),
  );
}

export async function getConversation(id: string, meId: string) {
  if (!db) return null;
  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  if (!convo || (convo.userAId !== meId && convo.userBId !== meId)) return null;

  const otherId = convo.userAId === meId ? convo.userBId : convo.userAId;
  const [other] = await db
    .select(authorSelect)
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, otherId))
    .limit(1);

  const convoMessages = await db
    .select({
      id: messages.id,
      body: messages.body,
      senderId: messages.senderId,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  return { ...convo, other, messages: convoMessages };
}

export async function markConversationRead(id: string, meId: string) {
  if (!db) return;
  const [convo] = await db
    .select({ a: conversations.userAId, b: conversations.userBId })
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  if (!convo) return;
  await db
    .update(conversations)
    .set(convo.a === meId ? { aLastReadAt: new Date() } : { bLastReadAt: new Date() })
    .where(eq(conversations.id, id));
}

/* ----------------------------------------------------------- nav badges */

export interface UnreadCounts {
  notifications: number;
  messages: number;
}

export async function unreadCounts(userId: string): Promise<UnreadCounts> {
  if (!db) return { notifications: 0, messages: 0 };
  const [notif] = await db
    .select({ n: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  const convos = await listConversations(userId);
  return {
    notifications: notif?.n ?? 0,
    messages: convos.filter((c) => c.unread).length,
  };
}
