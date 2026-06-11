"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { scores } from "@/lib/db/schema";

const ChalkInput = z.object({
  title: z.string().trim().min(2).max(40),
  value: z.coerce.number().int().min(1).max(1_000_000_000),
});

/** One click from the game over screen to the House Board. */
export async function chalkArcadeBest(formData: FormData) {
  const user = await requireUser();
  if (!db) redirect("/arcade");

  const parsed = ChalkInput.safeParse({
    title: formData.get("title"),
    value: formData.get("value"),
  });
  if (!parsed.success) redirect("/arcade");
  const { title, value } = parsed.data;

  await db.insert(scores).values({
    userId: user.id,
    game: "penny-arcade",
    label: `${title} — chalked from the cabinet`,
    value,
  });

  revalidatePath("/leaderboard");
  redirect("/leaderboard");
}
