<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# House rules for Rollout

The site is one concept: the **S.S. Rollout**, a Victorian riverboat gaming house. Every section is a room of the boat. Hold that line in design, copy, and naming.

## Design
- Tokens live in `app/globals.css`: brass, gold light, oxblood, oxblood bright, sage, parchment, mahogany on bottle green. Use tokens, never raw palette inventions. **Never reintroduce the dark + neon + glassmorphism look** — the owner rejected it explicitly.
- **Exception:** UFC pages alone wear the cream "fight press" poster livery (ink, blood red, gold on `#F2E9D4`).
- Motion respects `prefers-reduced-motion` and pointer type, always. Animate transform and opacity only.

## Copy
- Voice: the house proprietor — warm, confident, period flavored, never cosplay. Rooms have names (Saloon, House Board, Showboat Theater, Patrons' Ledger); use them.
- **No hyphenated compound words in site copy.** Rewrite around them ("loadouts for every planet", not "planet-by-planet loadouts").
- Donations language is **patronage** — never chips, bets, or wagers.

## Content discipline
- **YouTube ids must be verified before shipping** (oEmbed 200 + `maxresdefault.jpg` exists). See `lib/theater.ts`.
- `lib/ufc.ts` is the owner's hand edited fight book, updated weekly by a human. Keep it human friendly; never auto generate over it.
- Game guides avoid invented specifics (records, stats, item names you cannot verify). Empty fields beat wrong facts.
- Community manuscripts (`/guides`) are read by a human before printing — never auto publish, never bypass the review desk.
- No borrowed IP in the Penny Arcade: original games, original names, original art.

## Engineering
- Features degrade gracefully when env vars are missing (`lib/env.ts` flags). Public pages must always render with zero credentials.
- Stripe: test keys locally, live keys only as Vercel env vars. Secrets never go in the repo.
- Strict `react-hooks/set-state-in-effect` rule is on — no synchronous setState in effects (use `useSyncExternalStore` or defer).

## Workflow
- Commits: **concise, plain language a non technical reader understands**, in sensible chunks. Push to `main`.
- After meaningful changes, update README and this file so the docs match the boat — no drift.
- Verify in the browser before claiming done; the preview tools are there for it.
