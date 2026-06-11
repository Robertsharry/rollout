"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { scores } from "@/lib/db/schema";
import { GAME_SLUGS } from "@/lib/site";

const BOARD_GAMES = [...GAME_SLUGS, "penny-arcade"];

const ScoreInput = z.object({
  game: z.string().refine((g) => BOARD_GAMES.includes(g)),
  label: z.string().trim().min(3).max(120),
  value: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
});

export async function postScore(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/leaderboard");

  const parsed = ScoreInput.safeParse({
    game: formData.get("game"),
    label: formData.get("label"),
    value: formData.get("value") || undefined,
  });
  if (!parsed.success) redirect("/leaderboard?trouble=1");
  const { game, label, value } = parsed.data;

  await db.insert(scores).values({ userId: user.id, game, label, value });

  revalidatePath("/leaderboard");
  redirect("/leaderboard");
}
