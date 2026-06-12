# Rules & Architecture — the owner's manual

This is the document to open when you want to change something yourself, or just
understand why the boat is built the way it is. It assumes you can run commands
in a terminal and edit files, nothing more. The short version of these rules
also lives in [AGENTS.md](AGENTS.md) (that copy is written for AI assistants —
keep both in sync when something changes).

---

## 1. The one idea everything hangs on

The site is the **S.S. Rollout**, a Victorian riverboat gaming house. Every
section is a *room* of the boat. This is not decoration — it is the information
architecture. When you add anything new, first decide which room it belongs to
(or what new room it opens), and name it the way the house would.

| Room | Route | What it is |
| --- | --- | --- |
| Grand Foyer | `/` | Home. First impression, porter's tour for new visitors. |
| Specimen Cabinet | `/pokemon` | Full Pokédex (all 1025) + six slot team builder + Kanto field guides. |
| Sporting Club | `/ufc` | Fight card + UFC 6 game info. **You** update this weekly by hand. |
| Munitions Deck | `/helldivers` | Helldivers 2 loadouts per front. |
| Cargo Hold | `/arc-raiders` | Arc Raiders region manifests. |
| Showboat Theater | `/videos` | Curtained video stage. Every video id is verified before it ships. |
| Penny Arcade | `/arcade` | Three original games. No borrowed IP, ever. |
| Engine Room | `/learn` | 17 interactive code lessons that teach by deconstructing this site. |
| Saloon | `/forums` | Five tables (The Commons + one per game), threads, @mentions. |
| House Board | `/leaderboard` | Members post scores and runs. Arcade bests chalk on automatically. |
| Library | `/guides` | Community manuscripts. Submitted → **human review** → printed. |
| Mail Room | `/inbox` | Private lines between members + notification bells. |
| Patrons' Ledger | `/donate` | Stripe donations. The language is patronage, never gambling. |
| Service Records | `/crew/[handle]` | Permanent member pages: crew number, ribbons, Plank Owner. |
| Front Desk | `/signin`, `/profile` | Discord check in and your stateroom. |

Sister house: **REDTHREAD** (`redthread.red`) — your speculation board. It gets
a plaque in the footer, linked as the proprietor's other house.

---

## 2. Running the boat locally

```bash
npm install        # this repo uses npm — NOT pnpm, NOT yarn
cp .env.example .env.local   # then fill in what you have
npm run dev        # http://localhost:3000
```

Other commands you will actually use:

```bash
npm run build      # full production build — run before pushing big changes
npm run lint       # the linter; the build fails if this fails
npm run db:push    # push schema changes in lib/db/schema.ts to Neon
npm run db:studio  # browse the live database in a web UI
node scripts/seed-saloon.mjs    # seed welcome threads + the House member (safe to rerun)
node scripts/build-pokedex.mjs  # regenerate the Pokédex dataset (only when a new gen lands)
```

**Everything public works with zero credentials.** If `.env.local` is empty,
the site still renders; login, database features, and donations simply switch
off. That is by design (`lib/env.ts` exposes `isDbConfigured`,
`isAuthConfigured`, `isStripeConfigured` flags — features check those flags
instead of crashing).

### Environment variables (what each one is for)

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The site's public address. Localhost in dev, `https://rollout.community` in production. Used for SEO and auth callbacks. |
| `NEXT_PUBLIC_DISCORD_INVITE` | The "Join the Discord" button target. |
| `AUTH_SECRET` | Random secret for login sessions. Generate with `npx auth secret`. |
| `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` | Your Discord OAuth app. The app must list BOTH redirect URIs: `http://localhost:3000/api/auth/callback/discord` and `https://rollout.community/api/auth/callback/discord` (exact match). |
| `DATABASE_URL` | Neon Postgres connection string. |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe keys. **Test keys (`sk_test_`/`pk_test_`) on your machine. Live keys exist ONLY in Vercel's env settings — never in this repo, never in a file.** |
| `STRIPE_DONATION_PRICE_ID` | The "name your own amount" price for the open ledger option. |

---

## 3. How the code is laid out

```
app/                 one folder per room (route). page.tsx is the page.
  api/               auth endpoints + member search for @mentions
  globals.css        THE design system: every color token, font, utility
components/
  ui/                shadcn primitives (buttons, dialogs) — already themed
  site/              navbar, footer, logo, section frames, game cards
  home/ theater/ arcade/ learn/ pokedex/ community/ tour/
                     each room's own parts, named by room
  motion/            Reveal and friends — the scroll animation vocabulary
  effects/           cursor, smooth scroll, grain overlay
content/pokemon/     starter field guides as MDX files — drop a file, it's live
lib/                 the brains: one file per concern (see below)
lib/db/schema.ts     every database table, defined in code
scripts/             one time / occasional tools (seed, pokédex builder)
auth.ts              Discord login configuration
```

The `lib/` files worth knowing:

| File | Owns |
| --- | --- |
| `lib/site.ts` | Site name, tagline, nav, the four games and their blurbs. |
| `lib/ufc.ts` | **Your hand edited weekly fight book.** Instructions at the top of the file. |
| `lib/theater.ts` | The Theater playbill. Read the verification rule below before touching. |
| `lib/pokedex.ts` + `lib/pokedex-data.json` | The Pokédex dataset + the type chart + team analysis math. |
| `lib/pokemon-starters.ts` | The 27 starter lines and which have written guides. |
| `lib/guides.ts` | Loads the MDX field guides from `content/pokemon/`. |
| `lib/manuscripts.ts` | Community guide submissions + the review desk. |
| `lib/community.ts` | Threads, replies, scores, mentions, notifications, DMs. |
| `lib/crew.ts` | Service records: crew numbers, ribbons, the Plank Owner first 100 rule. |
| `lib/handles.ts` | Mints @handles at first login. |
| `lib/learn.ts` | The 17 Engine Room stations: order, tracks, titles. |
| `lib/stripe.ts` + `app/donate/actions.ts` | Donations checkout. |
| `lib/seo.ts` | Page metadata + structured data builders. |
| `lib/env.ts` | Reads env vars once, exposes the "is X configured" flags. |

### How data flows (the mental model)

- **Pages are server components.** They fetch from the database on the server
  and send finished HTML. Anything interactive ("use client" at the top of the
  file) is an island inside a server page — the Pokédex, the arcade games, the
  theater curtain, forms.
- **Writes go through server actions** (`actions.ts` files next to the page).
  Every action validates input with zod and checks the session. There is no
  hand rolled REST API to maintain.
- **The database** (Neon Postgres, tables in `lib/db/schema.ts`): users,
  accounts, sessions (Auth.js), profiles (handle, role), threads, replies,
  submissions (manuscripts), notifications, scores, conversations, messages.
- **Some things deliberately do NOT touch the database** and live in the
  visitor's browser (localStorage): arcade high scores, Engine Room progress,
  the Pokédex squad, "tour seen". Reason: they work logged out, cost nothing,
  and losing them is harmless.
- **Login**: Discord OAuth via Auth.js v5. First login creates the user, mints
  a handle, and the member shows up in Neon. Roles (`member` → `mod` →
  `admin`) live on the `profile` table; review desk access requires mod+.

---

## 4. The design rules (the look)

All tokens live in `app/globals.css`. The palette is bottle green felt, brass,
gold light, oxblood, sage, parchment, mahogany — defined once as CSS variables
and used as Tailwind classes (`text-gold-light`, `border-brass/40`, `glass`,
`tin-ceiling`...).

1. **Use the tokens. Never invent a new hex in a component.** If a new shade is
   truly needed, it gets added to `globals.css` with a name, then used by name.
2. **Never reintroduce the dark + neon + glassmorphism look.** That was v1 and
   it was rejected for looking like every other site.
3. **One exception: UFC pages wear the cream fight press livery** (ink, blood
   red, gold on `#F2E9D4`, Anton headlines). That livery stays inside `/ufc`.
4. **Motion**: only animate `transform` and `opacity` (they are cheap). Respect
   `prefers-reduced-motion` and don't run hover effects on touch screens —
   existing components already do this; copy their pattern.
5. Fonts: Fraunces (display), Source Serif 4 (body), Pinyon Script (flourish),
   Cutive Mono (labels/numbers). Loaded once in the root layout.

## 5. The copy rules (the voice)

The narrator is the **house proprietor**: warm, confident, lightly period
flavored, never costume drama. Rooms are called by their names.

- **No hyphenated compound words.** "Loadouts for every planet", never
  "planet-by-planet loadouts". Rewrite around the hyphen every time.
- **Donations are patronage.** Never chips, bets, wagers, or gambling imagery —
  this is a veterans' community and the line matters.
- Plain words beat clever ones. The flavor comes from rhythm and warmth, not
  from "ye olde" vocabulary.

## 6. The content rules (the discipline)

These exist because wrong content is worse than missing content.

- **YouTube ids must be verified before they ship.** A reel goes in
  `lib/theater.ts` only after (a) the oEmbed endpoint returns 200 for the id,
  and (b) `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` actually exists.
  Quick check: `curl -s -o /dev/null -w "%{http_code}" "https://www.youtube.com/oembed?url=https://youtube.com/watch?v=<ID>"`
- **`lib/ufc.ts` is yours.** You edit it weekly by hand. Anyone (human or AI)
  touching it must keep it human friendly — clear labels, empty strings where
  you haven't filled records in yet. Nothing auto generates over it.
- **Game guides never invent specifics.** No made up stats, records, or item
  names. An empty field beats a wrong fact.
- **Community manuscripts are read by a human before printing.** The review
  desk (`/guides` → review, mod/admin only) is never bypassed and nothing auto
  publishes.
- **The Penny Arcade is original.** Original games, names, art. No Pac Man, no
  Galaga, no gray areas.
- **`lib/pokedex-data.json` is generated, never hand edited.** When a new
  generation releases, bump `MAX_ID` in `scripts/build-pokedex.mjs`, run it,
  and commit the new JSON.

---

## 7. The owner's cookbook

### Update the weekly fight card
Open `lib/ufc.ts`. The file starts with instructions. Edit the bouts, save,
commit, push. No code knowledge needed beyond keeping the quotes and commas
intact. If the page errors after an edit, you almost certainly deleted a comma
or quote — `npm run dev` will point at the line.

### Add a video to the Theater
1. Verify the id (rule above — both checks).
2. Add an entry to the right act in `lib/theater.ts`, copying an existing one.
3. Look at `/videos` locally: poster shows, curtain opens, video plays.

### Add a starter field guide
Copy `content/pokemon/bulbasaur-line.mdx` to a new file, keep the frontmatter
fields, write. Then open `lib/pokemon-starters.ts` and set that starter's
`guideSlug` to your new file name. The cabinet links it automatically.

### Publish a community guide
Members submit at `/guides/submit`. You (admin) open `/guides` while signed
in — pending manuscripts show a review button. Approve to print or decline.

### Make someone a moderator
Their `role` lives on the `profile` table. Easiest: `npm run db:studio`, open
`profile`, set `role` to `mod` (or `admin`). Mods can review manuscripts.

### Change a color everywhere
`app/globals.css`, top of the file. Edit the token's oklch value once. Check
contrast on small sage text before shipping — legibility was a hard won fight.

### Add an Engine Room station
1. Add the entry in `lib/learn.ts` (pick the track; numbers renumber
   themselves).
2. Build the component in `components/learn/` and the page in `app/learn/`.
3. Honor the **bridge rule**: the code panel and the visual must light each
   other up BOTH ways (hover code → visual highlights; hover visual → code
   highlights). Stations that skip this feel dead next to the others.
4. The Papers certificate counts stations automatically — no edit needed.

### See who has joined
`npm run db:studio` → `profile` table. Crew numbers on the site derive from
signup order (the House member is excluded and Plank Owner caps at the first
100 — that cap is a promise, never reissue it).

---

## 8. Deploying (when you ship to rollout.community)

On Vercel, set every variable from the table in section 2, with production
values: `NEXT_PUBLIC_SITE_URL=https://rollout.community`, **live** Stripe keys
(`sk_live_`/`pk_live_` + the live donation price id), and make sure the Discord
OAuth app has the production redirect URI added. Neon and the schema are
already live — no migration step needed on deploy. After the first deploy,
sign in once and confirm: login works, a thread posts, the donate checkout
opens (then refund yourself or use a 100% off promo to test).

If a secret ever lands in a chat, a screenshot, or a commit: **rotate it** in
the Discord/Stripe dashboard. Two have been rotated already for exactly this.

---

## 9. When things break

| Symptom | Likely cause and fix |
| --- | --- |
| `pnpm: command not found` or stray `pnpm-lock.yaml` appears | This repo uses **npm**. Delete any `pnpm-lock.yaml`/`pnpm-workspace.yaml` that show up; run `npm install`. |
| Lint error: `set-state-in-effect` | The strictest rule we keep on. You cannot call a state setter synchronously inside `useEffect`. Pattern to copy: `useSyncExternalStore` (see `components/pokedex/pokedex-client.tsx` or `components/learn/progress.tsx`). |
| Lint error: unescaped apostrophe | In JSX text, write `&apos;` instead of `'`. |
| `drizzle-kit push` hangs asking a question | It wants an interactive answer the terminal can't give. Either run it in a real terminal and answer, or apply the change with SQL in the Neon console, then push again. |
| A page scrolls sideways on a phone | Almost always a grid/flex item refusing to shrink (`min-width: auto`). Put `min-w-0` on the grid's children — the station grids use `[&>*]:min-w-0` for exactly this. |
| Theater poster is a gray box | The video id failed the `maxresdefault.jpg` check. Verify the id; some videos simply never get a maxres poster — pick a different upload. |
| Stripe button does nothing locally | Keys missing in `.env.local`, or you are using live keys locally (don't). |
| Build fails on Vercel but not locally | Usually an env var that exists locally but not on Vercel. Compare against section 2's table. |

---

## 10. Keeping the docs honest

Three documents describe this project and they must not drift:

- **README.md** — the public face: what is live, how to start.
- **AGENTS.md** — the same rules, compressed, for AI assistants.
- **This file** — the full explanation, for you.

The standing rule: after any meaningful change, update all three in the same
commit. Commits themselves stay in plain language a non technical reader
understands, pushed to `main` in sensible chunks.
