/**
 * Pragmatic env access. Phase 0 must run (public pages, design system) even
 * before Discord/Neon credentials exist, so we never throw at import time —
 * features check the `is*Configured` flags and degrade gracefully.
 */
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
  AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const isDbConfigured = Boolean(env.DATABASE_URL);

export const isAuthConfigured = Boolean(
  env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET,
);
