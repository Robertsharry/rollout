# ROLLOUT

Tactical gaming community hub for a Discord-based (veteran) community — **Pokémon, UFC, Arc Raiders, Helldivers 2**. Deep tutorials, loadouts, leaderboards, forums, on-site messaging, and donations. Built to rank on Google and to feel award-grade, not generic.

> This repo currently contains **Phase 0 — Foundation & Design System**: a deployable, Discord-logged-in shell that every later feature snaps into. See the roadmap below.

## Stack

- **Next.js 16** (App Router, RSC) · **React 19.2** · **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives)
- **Framer Motion** + **Lenis** (smooth scroll) + **next-view-transitions**
- **Auth.js v5** with **Discord** OAuth (login only)
- **Neon Postgres** + **Drizzle ORM**
- **Stripe** (donations — Phase 4) · deploy on **Vercel**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values (optional for public pages)
npm run dev                  # http://localhost:3000
```

Public pages (home, game hubs, stubs) run **without** any credentials. Auth and DB
features activate once their env vars are set.

### Environment

| Variable | Needed for | How to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | SEO canonical/OG, auth callbacks | your URL (e.g. `https://rollout.gg`) |
| `NEXT_PUBLIC_DISCORD_INVITE` | "Join the Discord" CTA | your server invite link |
| `AUTH_SECRET` | Auth.js | `npx auth secret` |
| `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` | Discord login | [Discord Developer Portal](https://discord.com/developers/applications) → OAuth2. Add redirect `…/api/auth/callback/discord` |
| `DATABASE_URL` | DB-backed profiles/sessions | [Neon](https://neon.tech) or Vercel Marketplace |

With **no** `DATABASE_URL`, login still works on stateless JWT sessions. Add the DB
to persist users + profiles (run `npm run db:push`).

## Scripts

```bash
npm run dev       # dev server (Turbopack)
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint
npm run db:push   # push the Drizzle schema to the database
npm run db:studio # Drizzle Studio
```

## Project structure

```
app/                # routes: home, /[game], feature stubs, /signin, /profile, api/auth, sitemap/robots/og
components/
  ui/               # shadcn primitives (themed via CSS variables)
  motion/           # Reveal, Stagger, KineticText, CountUp
  effects/          # LenisProvider, CustomCursor, NoiseOverlay
  site/             # Navbar, Footer, GameCard, Section, ComingSoon, …
  home/             # homepage sections (Hero, GamesGrid, StatsBand, Featured, Cta)
lib/
  site.ts           # brand, nav, games + section metadata (single source of truth)
  db/               # Drizzle client + schema
  seo.ts            # buildMetadata() + JSON-LD builders
auth.ts             # Auth.js v5 config
```

### Design system — "Tactical Neon"

Dark-first, deep space-black canvas with neon **cyan + magenta** accents and muted
**military green**. Tokens live in `app/globals.css` (shadcn variable names are
reused so every primitive inherits the theme). Fonts: Chakra Petch (display),
Inter (body), JetBrains Mono (data). All motion is gated by
`prefers-reduced-motion` and pointer type.

## Roadmap

- **Phase 0 — Foundation & Design System** ✅ (this)
- **Phase 1** — Pokémon hub + starter tutorials (MDX), forum, @mentions + notifications
- **Phase 2** — forums for all games, global leaderboard, on-site inbox/DMs
- **Phase 3** — Helldivers loadouts (per planet), Arc Raiders loadouts (per region), UFC hub
- **Phase 4** — Stripe donations + supporter tiers
- **Phase 5** — mini-games, learn-to-code, custom-skinned YouTube video hub

---

Not affiliated with any game publisher. Built by the community, for the squad.
