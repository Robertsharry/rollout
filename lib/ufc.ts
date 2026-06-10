/**
 * ═══════════════════════════════════════════════════════════════════
 * THE HOUSE FIGHT BOOK — edited by hand, weekly.
 *
 * HOW TO UPDATE (no coding needed):
 *   1. Change the words between the quotes. Save the file. Done.
 *   2. `record` is each fighter's W-L-D, e.g. "28-1-0". Leave it as ""
 *      and the page simply hides it until you fill it in.
 *   3. Keep the main event as the FIRST bout in the list — the page
 *      gives the top slot the big print.
 *   4. After fight night, swap this whole card for the next event and
 *      bump `updated` to today's date.
 *
 * Card details set 2026-06-10 from UFC/ESPN/Tapology listings.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface Corner {
  name: string;
  /** Professional record, e.g. "28-1-0". Empty string hides it. */
  record?: string;
}

export interface Bout {
  red: Corner;
  blue: Corner;
  weight: string;
  /** Title stakes, shown as a red chip. Leave off for non title bouts. */
  title?: string;
  note?: string;
}

export const FIGHT_CARD = {
  event: "UFC Freedom 250",
  subtitle: "The White House Card",
  date: "Sunday, June 14, 2026",
  venue: "South Lawn, The White House — Washington, D.C.",
  broadcast: "Paramount+ · main card 8 PM ET",
  storyline:
    "The first fight card ever staged at the White House, headlining the country's 250th year. Seven bouts on the South Lawn, and the lightweight belt gets one owner.",
  updated: "June 10, 2026",
  bouts: [
    {
      red: { name: "Ilia Topuria", record: "" },
      blue: { name: "Justin Gaethje", record: "" },
      weight: "Lightweight",
      title: "Title unification",
      note: "Champion against interim champion. One belt leaves the lawn.",
    },
    {
      red: { name: "Alex Pereira", record: "" },
      blue: { name: "Ciryl Gane", record: "" },
      weight: "Heavyweight",
      title: "Interim title",
    },
    {
      red: { name: "Sean O'Malley", record: "" },
      blue: { name: "Aiemann Zahabi", record: "" },
      weight: "Bantamweight",
    },
    {
      red: { name: "Derrick Lewis", record: "" },
      blue: { name: "Josh Hokit", record: "" },
      weight: "Heavyweight",
    },
    {
      red: { name: "Mauricio Ruffy", record: "" },
      blue: { name: "Michael Chandler", record: "" },
      weight: "Lightweight",
    },
    {
      red: { name: "Bo Nickal", record: "" },
      blue: { name: "Kyle Daukaus", record: "" },
      weight: "Middleweight",
    },
    {
      red: { name: "Diego Lopes", record: "" },
      blue: { name: "Steve Garcia", record: "" },
      weight: "Featherweight",
    },
  ] satisfies Bout[],
};

export const UFC_GAME = {
  title: "EA Sports UFC 6",
  earlyAccess: "Friday, June 12 — Ultimate Edition early access",
  release: "June 19 — everyone fights",
  platforms: ["PlayStation 5", "Xbox Series X|S"],
  covers: "Alex Pereira (Standard) · Max Holloway (Ultimate)",
  features: [
    "Fighters move like the tape: markerless capture and the new Sapien Technology",
    "Hall of Legends and The Legacy — story modes for the greats and for your own run",
    "Flow State turns a fighter's signature skills loose under pressure",
  ],
  fineprint: "Current consoles only — no PS4, no Switch.",
  updated: "June 10, 2026",
};
