# ROLLOUT

The squad's gaming house on the river — a community site for **Pokémon, UFC, Arc Raiders, and Helldivers 2**, run by veterans. Victorian riverboat design ("S.S. Rollout"), built to rank on Google, free of ads, kept alive by patrons.

**Production domain:** `rollout.community` (deploy pending — see roadmap).

**Owner's manual:** [RULES-AND-ARCHITECTURE.md](RULES-AND-ARCHITECTURE.md) — how the boat is built, the house rules, and a cookbook for everyday changes (fight card, theater reels, guides, deploy). Start there before editing anything.

**Sister house:** [REDTHREAD](https://redthread.red) — the proprietor's speculation board, linked from the footer.

## What's aboard today

| Deck | Route | Status |
| --- | --- | --- |
| Grand Foyer (home) + porter's tour for new visitors | `/` | ✅ live |
| Specimen Cabinet — full Pokédex (all 1025) + team builder with coverage analysis + Kanto guides | `/pokemon` | ✅ live |
| Sporting Club — Freedom 250 card + UFC 6 info | `/ufc` | ✅ live, hand updated weekly |
| Munitions Deck — loadouts per front | `/helldivers` | ✅ live |
| Cargo Hold — region manifests | `/arc-raiders` | ✅ live |
| Showboat Theater — curtained video stage | `/videos` | ✅ live |
| Penny Arcade — three original cabinets | `/arcade` | ✅ live |
| Engine Room — interactive code lessons | `/learn` | ✅ live (17 stations + station log + Engineer's Papers) |
| Patrons' Ledger — Stripe donations | `/donate` | ✅ live (test mode) |
| Saloon — five tables, threads, @mentions | `/forums` | ✅ live |
| Library — community guides + Manuscript Desk | `/guides` | ✅ live (house reviewed) |
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
- **`lib/pokedex-data.json`** — the full Pokédex dataset (1025 entries). Generated once by `node scripts/build-pokedex.mjs`; rerun the script when a new generation lands, never hand edit.

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
- ✅ Pokémon: full Pokédex + team builder (shareable squads, live coverage analysis) + 3 Kanto guides · UFC live card · Helldivers · Arc Raiders
- ✅ Mobile pass: every deck verified at phone width, no sideways scroll
- ✅ Theater · Arcade · Engine Room (17 stations: HTML, CSS incl. flexbox/grid/responsive, JS incl. timers, free build)
- ✅ Donations (Stripe, test mode)
- ✅ **Phase 2:** Saloon forums, @mentions with notifications, House Board, private messages
- ✅ Community guide submissions (Manuscript Desk → review → the Library) · Engine Room station log, Engineer's Papers, the Dry Dock · arcade bests chalk onto the House Board
- 🔜 Deploy to `rollout.community` (flip Stripe live — redirects already set)
- 🔜 More field guides (gens 2–9) · UFC fighter imagery via stats API

---

An independent house. Not affiliated with any game publisher. Built by the squad, for the squad.
