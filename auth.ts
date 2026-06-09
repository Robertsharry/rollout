import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

import { db } from "@/lib/db";
import { accounts, profiles, sessions, users, verificationTokens } from "@/lib/db/schema";
import { isAuthConfigured } from "@/lib/env";

// Use the database adapter only when a DB is present; otherwise fall back to
// stateless JWT sessions so Discord login still works pre-database.
const adapter = db
  ? DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    })
  : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: (adapter ? "database" : "jwt") as "database" | "jwt" },
  providers: [Discord],
  pages: { signIn: "/signin" },
  events: {
    // Seed a profile row the first time a user is created (DB mode only).
    async createUser({ user }) {
      if (db && user.id) {
        await db
          .insert(profiles)
          .values({ userId: user.id, displayName: user.name ?? null })
          .onConflictDoNothing();
      }
    },
  },
});

export type SessionUser = { name?: string | null; image?: string | null };

/** Session user for the navbar/layout; null (never throws) when unconfigured. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isAuthConfigured) return null;
  try {
    const session = await auth();
    if (!session?.user) return null;
    return { name: session.user.name, image: session.user.image };
  } catch {
    return null;
  }
}
