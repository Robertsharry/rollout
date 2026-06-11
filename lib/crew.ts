import "server-only";

import { and, count, desc, eq, lt, ne } from "drizzle-orm";

import { db } from "@/lib/db";
import { profiles, scores, submissions, threads, users } from "@/lib/db/schema";

/** The synthetic house member — keeps the books, takes no plank. */
export const HOUSE_ID = "the-house-0000";

export const PLANK_OWNER_LIMIT = 100;

export interface Ribbon {
  id: string;
  name: string;
  note: string;
  earned: boolean;
  /** CSS background for the ribbon bar. */
  pattern: string;
}

export interface ServiceRecord {
  user: { id: string; name: string | null; image: string | null };
  handle: string;
  role: string;
  enlisted: Date;
  /** Position in the crew book. Null for The House itself. */
  crewNumber: number | null;
  plankOwner: boolean;
  counts: { threads: number; scores: number; guides: number };
  recentThreads: { id: string; board: string; title: string; createdAt: Date }[];
  recentScores: { id: string; game: string; label: string; value: number | null; createdAt: Date }[];
  printedGuides: { id: string; game: string; title: string }[];
  ribbons: Ribbon[];
}

const ROLE_TITLES: Record<string, string> = {
  admin: "House Officer",
  mod: "Bosun",
  member: "Ship's Company",
};

export async function countMembers(): Promise<number> {
  if (!db) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(profiles)
    .where(ne(profiles.userId, HOUSE_ID));
  return row?.n ?? 0;
}

export async function getServiceRecord(
  handle: string,
): Promise<ServiceRecord | null> {
  if (!db) return null;

  const [row] = await db
    .select({
      userId: profiles.userId,
      handle: profiles.handle,
      role: profiles.role,
      enlisted: profiles.createdAt,
      name: users.name,
      image: users.image,
    })
    .from(profiles)
    .innerJoin(users, eq(users.id, profiles.userId))
    .where(eq(profiles.handle, handle.toLowerCase()))
    .limit(1);
  if (!row || !row.handle) return null;

  const isHouse = row.userId === HOUSE_ID;

  let crewNumber: number | null = null;
  if (!isHouse) {
    const [earlier] = await db
      .select({ n: count() })
      .from(profiles)
      .where(
        and(lt(profiles.createdAt, row.enlisted), ne(profiles.userId, HOUSE_ID)),
      );
    crewNumber = (earlier?.n ?? 0) + 1;
  }
  const plankOwner = crewNumber !== null && crewNumber <= PLANK_OWNER_LIMIT;

  const [threadRows, scoreRows, guideRows] = await Promise.all([
    db
      .select({
        id: threads.id,
        board: threads.board,
        title: threads.title,
        createdAt: threads.createdAt,
      })
      .from(threads)
      .where(eq(threads.authorId, row.userId))
      .orderBy(desc(threads.createdAt))
      .limit(50),
    db
      .select({
        id: scores.id,
        game: scores.game,
        label: scores.label,
        value: scores.value,
        createdAt: scores.createdAt,
      })
      .from(scores)
      .where(eq(scores.userId, row.userId))
      .orderBy(desc(scores.createdAt))
      .limit(50),
    db
      .select({ id: submissions.id, game: submissions.game, title: submissions.title })
      .from(submissions)
      .where(
        and(
          eq(submissions.authorId, row.userId),
          eq(submissions.status, "published"),
        ),
      )
      .orderBy(desc(submissions.reviewedAt))
      .limit(50),
  ]);

  const counts = {
    threads: threadRows.length,
    scores: scoreRows.length,
    guides: guideRows.length,
  };

  const ribbons: Ribbon[] = [
    {
      id: "ships-company",
      name: "Ship's Company",
      note: "Checked in and counted among the crew",
      earned: true,
      pattern:
        "repeating-linear-gradient(90deg, #1E3A2C 0 10px, #C9A14E 10px 14px, #1E3A2C 14px 24px)",
    },
    {
      id: "plank-owner",
      name: "Plank Owner",
      note: `Among the first ${PLANK_OWNER_LIMIT} aboard — never issued again`,
      earned: plankOwner,
      pattern:
        "repeating-linear-gradient(90deg, #5E2426 0 6px, #C9A14E 6px 18px, #EFE6CF 18px 22px, #C9A14E 22px 34px, #5E2426 34px 40px)",
    },
    {
      id: "took-the-floor",
      name: "Took the Floor",
      note: "Started a thread in the Saloon",
      earned: counts.threads > 0,
      pattern:
        "repeating-linear-gradient(90deg, #2F5240 0 8px, #B9C9B4 8px 12px, #2F5240 12px 20px)",
    },
    {
      id: "chalked-up",
      name: "Chalked Up",
      note: "Put a run on the House Board",
      earned: counts.scores > 0,
      pattern:
        "repeating-linear-gradient(90deg, #E3C77E 0 12px, #16130F 12px 15px, #E3C77E 15px 27px)",
    },
    {
      id: "in-print",
      name: "In Print",
      note: "A manuscript accepted and shelved in the Library",
      earned: counts.guides > 0,
      pattern:
        "repeating-linear-gradient(90deg, #EFE6CF 0 9px, #5E2426 9px 13px, #EFE6CF 13px 18px, #5E2426 18px 22px, #EFE6CF 22px 31px)",
    },
  ];

  return {
    user: { id: row.userId, name: row.name, image: row.image },
    handle: row.handle,
    role: ROLE_TITLES[row.role] ?? "Ship's Company",
    enlisted: row.enlisted,
    crewNumber,
    plankOwner,
    counts,
    recentThreads: threadRows.slice(0, 5),
    recentScores: scoreRows.slice(0, 5),
    printedGuides: guideRows.slice(0, 5),
    ribbons,
  };
}
