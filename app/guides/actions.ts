"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { createNotifications } from "@/lib/community";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { isMod } from "@/lib/manuscripts";
import { GAME_SLUGS } from "@/lib/site";

const GUIDE_GAMES = [...GAME_SLUGS, "general"];

const SubmitInput = z.object({
  game: z.string().refine((g) => GUIDE_GAMES.includes(g)),
  title: z.string().trim().min(8).max(120),
  body: z.string().trim().min(200).max(20000),
});

export async function submitGuide(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/guides");

  const parsed = SubmitInput.safeParse({
    game: formData.get("game"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) redirect("/guides/submit?trouble=1");

  await db.insert(submissions).values({ ...parsed.data, authorId: user.id });

  revalidatePath("/guides/submit");
  redirect("/guides/submit?sent=1");
}

const ReviewInput = z.object({
  id: z.string().min(10),
  decision: z.enum(["published", "declined"]),
  note: z.string().trim().max(500).optional(),
});

export async function reviewSubmission(formData: FormData) {
  const user = await requireUser();
  if (!db || !(await isMod(user.id))) redirect("/guides");

  const parsed = ReviewInput.safeParse({
    id: formData.get("id"),
    decision: formData.get("decision"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) redirect("/guides/review?trouble=1");
  const { id, decision, note } = parsed.data;

  const [manuscript] = await db
    .select({
      id: submissions.id,
      authorId: submissions.authorId,
      title: submissions.title,
      status: submissions.status,
    })
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);
  if (!manuscript || manuscript.status !== "pending")
    redirect("/guides/review");

  await db
    .update(submissions)
    .set({ status: decision, reviewNote: note ?? null, reviewedAt: new Date() })
    .where(eq(submissions.id, id));

  // ring the author's bell either way
  if (manuscript.authorId !== user.id) {
    await createNotifications([
      {
        userId: manuscript.authorId,
        actorId: user.id,
        kind: "guide",
        submissionId: id,
        snippet: manuscript.title.slice(0, 80),
      },
    ]);
  }

  revalidatePath("/guides");
  revalidatePath("/guides/review");
  redirect("/guides/review");
}
