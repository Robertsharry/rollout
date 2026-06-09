import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";

/**
 * Returns a Drizzle client, or null when DATABASE_URL is absent so public
 * pages can render without a database. Consumers must null-check.
 */
function createDb() {
  if (!env.DATABASE_URL) return null;
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = createDb();
export type Database = NonNullable<ReturnType<typeof createDb>>;
