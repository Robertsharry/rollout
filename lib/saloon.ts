import { MessagesSquare, type LucideIcon } from "lucide-react";

import { GAMES } from "@/lib/site";

export interface Board {
  slug: string;
  name: string;
  blurb: string;
  accent: string;
  icon: LucideIcon;
}

/** The tables of the Saloon: one general room plus a table per game. */
export const BOARDS: Board[] = [
  {
    slug: "the-commons",
    name: "The Commons",
    blurb:
      "The general table. Introductions, plans, victories, gripes — anything the squad wants to put on the felt.",
    accent: "var(--brass)",
    icon: MessagesSquare,
  },
  ...GAMES.map((game) => ({
    slug: game.slug,
    name: `${game.name} table`,
    blurb: game.blurb,
    accent: game.accent,
    icon: game.icon,
  })),
];

export const BOARD_BY_SLUG: Record<string, Board> = Object.fromEntries(
  BOARDS.map((b) => [b.slug, b]),
);

export const BOARD_SLUGS = BOARDS.map((b) => b.slug);
