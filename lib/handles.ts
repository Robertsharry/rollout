import { eq } from "drizzle-orm";

import type { Database } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

/** Squash any display name into mention shape: lowercase, a–z 0–9 _ only. */
export function slugifyHandle(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "")
    .slice(0, 24);
  return base.length >= 2 ? base : "patron";
}

/** Find a free handle, appending digits when the bar gets crowded. */
export async function mintHandle(db: Database, name: string): Promise<string> {
  const base = slugifyHandle(name);
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate =
      attempt === 0 ? base : `${base}${Math.floor(Math.random() * 900) + 100}`;
    const taken = await db
      .select({ userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.handle, candidate))
      .limit(1);
    if (taken.length === 0) return candidate;
  }
  return `${base}${Date.now() % 100000}`;
}
