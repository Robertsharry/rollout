# ROLLOUT

The squad's gaming house on the river — a community site for **Pokémon, UFC, Arc Raiders, and Helldivers 2**, run by veterans. Victorian riverboat design ("S.S. Rollout"), built to rank on Google, free of ads, kept alive by patrons.

**Production domain:** `rollout.community` (deploy pending — see roadmap).

## What's aboard today

| Deck | Route | Status |
| --- | --- | --- |
| Grand Foyer (home) | `/` | ✅ live |
| Specimen Cabinet — all 9 gens, 3 full Kanto guides | `/pokemon` | ✅ live |
| Sporting Club — Freedom 250 card + UFC 6 info | `/ufc` | ✅ live, hand updated weekly |
| Munitions Deck — loadouts per front | `/helldivers` | ✅ live |
| Cargo Hold — region manifests | `/arc-raiders` | ✅ live |
| Showboat Theater — curtained video stage | `/videos` | ✅ live |
| Penny Arcade — three original cabinets | `/arcade` | ✅ live |
| Engine Room — interactive code lessons | `/learn` | ✅ live (12 stations: full HTML, CSS, and JS curricula) |
| Patrons' Ledger — Stripe donations | `/donate` | ✅ live (test mode) |
| Saloon — five tables, threads, @mentions | `/forums` | ✅ live |
| House Board — post your scores and runs | `/leaderboard` | ✅ live |
| Mail Room — private lines + rung bells | `/inbox` | ✅ live (members only) |
| Check in (Discord login) + Stateroom | `/signin`, `/profile` | ✅ verified end to end |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 + shadcn (Base UI) · Framer Motion + Lenis · Auth.js v5 (Discord) · Neon Postgres + Drizzle · Stripe Checkout · MDX guides · deploy target Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000
```

Public pages run with **zero** env vars. Each credential below switches a feature on; everything degrades gracefully when missing.

| Variable | Turns on | Source |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | correct links/SEO | your URL |
| `NEXT_PUBLIC_DISCORD_INVITE` | "Board with Discord" buttons | your server invite |
| `AUTH_SECRET` | login sessions | `npx auth secret` |
| `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` | Discord login | [Discord dev portal](https://discord.com/developers/applications) → OAuth2 (+ redirect `…/api/auth/callback/discord`) |
| `DATABASE_URL` | members, profiles, future forums | [Neon](https://neon.tech) |
| `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | the Patrons' Ledger | [Stripe](https://dashboard.stripe.com/apikeys) — **test keys locally, live keys only in Vercel** |
| `STRIPE_DONATION_PRICE_ID` | the "name your figure" option | a Stripe price with *customer chooses amount* |

## Scripts

```bash
npm run dev / build / start / lint
npm run db:push      # push Drizzle schema to Neon
npm run db:studio    # browse the database
node --env-file=.env.local scripts/seed-saloon.mjs   # welcome threads + house member (safe to rerun)
```

## Hand edited house data

Some content is meant to be edited by the owner, not generated:

- **`lib/ufc.ts`** — the fight card + game info. Plain instructions at the top; update weekly.
- **`lib/theater.ts`** — the Theater program. Every YouTube id must be verified (oEmbed + maxres poster) before it ships.
- **`content/pokemon/*.mdx`** — field guides. Drop a file, it's live.

## Project structure

```
app/              routes (each deck of the boat) + sitemap/robots/OG image
components/
  ui/             shadcn primitives (themed by tokens)
  site/           navbar, footer, logo, sections, cards
  home/ theater/ arcade/ learn/   each deck's parts
  motion/ effects/                reveals, curtains, cursor, lenis
lib/              site config, seo, db, stripe, guides, ufc, theater, arcade
content/pokemon/  MDX field guides
auth.ts           Auth.js v5 (Discord)
```

## Roadmap

- ✅ Foundation, riverboat design system, SEO
- ✅ Pokémon cabinet (9 gens) + 3 Kanto guides · UFC live card · Helldivers · Arc Raiders
- ✅ Theater · Arcade · Engine Room (12 stations: HTML, CSS, JS — bones to server actions)
- ✅ Donations (Stripe, test mode)
- ✅ **Phase 2:** Saloon forums, @mentions with notifications, House Board, private messages
- 🔜 Deploy to `rollout.community` (flip Stripe live — redirects already set)
- 🔜 More field guides (gens 2–9) · UFC fighter imagery via stats API · arcade bests auto chalked to the board

---

An independent house. Not affiliated with any game publisher. Built by the squad, for the squad.
