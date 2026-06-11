import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { profiles, submissions, users } from "@/lib/db/schema";

const authorSelect = {
  id: users.id,
  name: users.name,
  image: users.image,
  handle: profiles.handle,
} as const;

export async function listPublishedGuides(game?: string, limit = 60) {
  if (!db) return [];
  const where = game
    ? and(eq(submissions.status, "published"), eq(submissions.game, game))
    : eq(submissions.status, "published");
  return db
    .select({
      id: submissions.id,
      game: submissions.game,
      title: submissions.title,
      body: submissions.body,
      createdAt: submissions.createdAt,
      reviewedAt: submissions.reviewedAt,
      author: authorSelect,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(where)
    .orderBy(desc(submissions.reviewedAt))
    .limit(limit);
}

export async function getPublishedGuide(id: string) {
  if (!db) return null;
  const [guide] = await db
    .select({
      id: submissions.id,
      game: submissions.game,
      title: submissions.title,
      body: submissions.body,
      createdAt: submissions.createdAt,
      reviewedAt: submissions.reviewedAt,
      author: authorSelect,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(submissions.id, id), eq(submissions.status, "published")))
    .limit(1);
  return guide ?? null;
}

export async function listPendingSubmissions() {
  if (!db) return [];
  return db
    .select({
      id: submissions.id,
      game: submissions.game,
      title: submissions.title,
      body: submissions.body,
      createdAt: submissions.createdAt,
      author: authorSelect,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.authorId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(submissions.status, "pending"))
    .orderBy(submissions.createdAt);
}

export async function listMySubmissions(userId: string) {
  if (!db) return [];
  return db
    .select({
      id: submissions.id,
      game: submissions.game,
      title: submissions.title,
      status: submissions.status,
      reviewNote: submissions.reviewNote,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .where(eq(submissions.authorId, userId))
    .orderBy(desc(submissions.createdAt));
}

export async function isMod(userId: string) {
  if (!db) return false;
  const [row] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return row?.role === "mod" || row?.role === "admin";
}
