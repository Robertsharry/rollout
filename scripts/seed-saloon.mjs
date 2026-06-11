/**
 * Seeds the Saloon with the house's own furniture: a "The House" member,
 * a welcome thread at every table, and a couple of board entries.
 * Also mints handles for any member who checked in before handles existed.
 *
 * Run: node --env-file=.env.local scripts/seed-saloon.mjs
 * Safe to run twice — it skips anything that already exists.
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const HOUSE_ID = "the-house-0000";

// the house checks in
const existing = await sql`select id from "user" where id = ${HOUSE_ID}`;
if (existing.length === 0) {
  await sql`insert into "user" (id, name) values (${HOUSE_ID}, 'The House')`;
  console.log("seated The House");
}
await sql`
  insert into profile ("userId", "displayName", handle, role)
  values (${HOUSE_ID}, 'The House', 'house', 'admin')
  on conflict ("userId") do update set handle = coalesce(profile.handle, 'house')
`;

// mint handles for early members who predate the handle column
const unhandled = await sql`
  select p."userId", coalesce(p."displayName", u.name, 'patron') as name
  from profile p join "user" u on u.id = p."userId"
  where p.handle is null
`;
for (const row of unhandled) {
  const base =
    row.name.toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 24) || "patron";
  let candidate = base;
  for (let i = 0; i < 20; i++) {
    const taken = await sql`select 1 from profile where handle = ${candidate}`;
    if (taken.length === 0) break;
    candidate = `${base}${Math.floor(Math.random() * 900) + 100}`;
  }
  await sql`update profile set handle = ${candidate} where "userId" = ${row.userId}`;
  console.log(`minted handle @${candidate} for ${row.name}`);
}

// one welcome thread per table
const WELCOMES = [
  [
    "the-commons",
    "Welcome aboard — read this, then pull up a chair",
    "The Saloon runs on three house rules: be good to the squad, keep the arguments about the games, and mention members with @ when you want them at the table.\n\nIntroduce yourself below. First round is on the house.",
  ],
  [
    "pokemon",
    "The eternal question: which starter, and why are you wrong?",
    "Every region, every generation, one argument that never settles. State your pick and defend it. The field guides in the specimen cabinet are admissible evidence.",
  ],
  [
    "ufc",
    "Freedom 250 watch thread — the White House card",
    "June 14, South Lawn. Topuria and Gaethje settle the lightweight argument. Predictions on the felt before the anthem, please.",
  ],
  [
    "arc-raiders",
    "Topside stories: your best extraction, your worst one",
    "The cargo hold has the doctrine. This table has the war stories. What did you bring back, and what did it cost?",
  ],
  [
    "helldivers",
    "Loadout confessions — what are you actually dropping with?",
    "The requisition slips say one thing. Your hands say another. Post the kit you really run and the squad will judge it with love.",
  ],
];

for (const [board, title, body] of WELCOMES) {
  const dupe = await sql`select 1 from thread where board = ${board} and title = ${title}`;
  if (dupe.length > 0) continue;
  await sql`
    insert into thread (id, board, "authorId", title, body)
    values (${crypto.randomUUID()}, ${board}, ${HOUSE_ID}, ${title}, ${body})
  `;
  console.log(`dealt: [${board}] ${title}`);
}

// a couple of house board entries so the felt is not bare
const SCORES = [
  // a standing challenge, not a claim — the house does not invent runs
  ["penny-arcade", "House bounty — beat this at Chip Chase", 4210],
];
for (const [game, label, value] of SCORES) {
  const dupe = await sql`select 1 from score where label = ${label}`;
  if (dupe.length > 0) continue;
  await sql`
    insert into score (id, "userId", game, label, value)
    values (${crypto.randomUUID()}, ${HOUSE_ID}, ${game}, ${label}, ${value})
  `;
  console.log(`chalked: ${label}`);
}

const counts = await sql`
  select
    (select count(*) from thread) as threads,
    (select count(*) from score) as scores,
    (select count(*) from profile where handle is not null) as handled
`;
console.log("seed complete:", JSON.stringify(counts[0]));

// the owner runs the review desk
await sql`update profile set role = 'admin' where handle = 'iamrob' and role = 'member'`;
console.log("review desk keys handed to @iamrob");

// one volume on the shelf so the library is not bare
const GUIDE_TITLE = "The two minute extraction checklist";
const guideDupe = await sql`select 1 from submission where title = ${GUIDE_TITLE}`;
if (guideDupe.length === 0) {
  await sql`
    insert into submission (id, "authorId", game, title, body, status, "reviewedAt")
    values (
      ${crypto.randomUUID()}, ${HOUSE_ID}, 'arc-raiders', ${GUIDE_TITLE},
      ${'Before you call the elevator, run the list. It takes two minutes and it has saved more kits than any gunfight ever will.\n\nOne: count your noise. Every fight you took in the last ten minutes told somebody where you are. If you fought near the exit, leave from a different one.\n\nTwo: check the sky. Wasps patrol in loops — watch one full circuit before you cross open ground. If you cannot see the loop, you are the loop.\n\nThree: weigh the greed. The last container is how raiders die. If your bag is worth more than your life insurance, it already is.\n\nFour: walk the exit before you need it. Thirty seconds spent learning the cover around the elevator pays out every single raid.\n\nFive: leave together or do not leave. Split extractions feed the machines twice.'},
      'published', now()
    )
  `;
  console.log("shelved: " + GUIDE_TITLE);
}
