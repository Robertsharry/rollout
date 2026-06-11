import {
  BookOpen,
  CircleDot,
  Clapperboard,
  Code2,
  Gamepad2,
  Heart,
  MessagesSquare,
  Radar,
  Rocket,
  Swords,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for brand, navigation, and content metadata.
 * Rename the community here (one place) once the final name is chosen.
 */
export const SITE = {
  name: "ROLLOUT",
  shortName: "Rollout",
  tagline: "The squad's gaming house on the river. Guides, loadouts, and good company.",
  description:
    "Rollout is a gaming house run by veterans, covering Pokémon, UFC, Arc Raiders, and Helldivers 2. Deep tutorials, loadouts for every planet and region, leaderboards, forums, and a Discord that actually shows up.",
  // NEXT_PUBLIC_SITE_URL is set in production; localhost is the dev fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Canonical production hostname — used as a fallback for OG/SEO before deploy. */
  productionUrl: "https://rollout.community",
  discordInvite: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.gg",
  locale: "en_US",
} as const;

export interface Game {
  slug: string;
  name: string;
  short: string;
  /** The room of the house this game occupies. */
  wing: string;
  blurb: string;
  /** CSS color token used for the card's accent glow/gradient. */
  accent: string;
  icon: LucideIcon;
  highlights: string[];
}

export const GAMES: Game[] = [
  {
    slug: "pokemon",
    name: "Pokémon",
    short: "POKÉMON",
    wing: "Specimens",
    blurb:
      "Master every starter, build teams that win, and learn the type chart cold.",
    accent: "var(--gold-light)",
    icon: CircleDot,
    highlights: ["Starter field guides", "Team building", "Type matchups"],
  },
  {
    slug: "ufc",
    name: "UFC",
    short: "UFC",
    wing: "Pugilism",
    blurb:
      "Fight breakdowns, card predictions, and technique guides for every octagon night.",
    accent: "var(--oxblood-bright)",
    icon: Swords,
    highlights: ["Fight breakdowns", "Card predictions", "UFC 6 game hub"],
  },
  {
    slug: "arc-raiders",
    name: "Arc Raiders",
    short: "ARC RAIDERS",
    wing: "Salvage",
    blurb:
      "Loadouts for every region, map intel, and extraction routes that get you out alive.",
    accent: "var(--brass)",
    icon: Radar,
    highlights: ["Loadouts by region", "Map intel", "Extraction routes"],
  },
  {
    slug: "helldivers",
    name: "Helldivers 2",
    short: "HELLDIVERS 2",
    wing: "Munitions",
    blurb:
      "Loadouts for every planet, stratagem science, and squad tactics for Super Earth.",
    accent: "var(--sage)",
    icon: Rocket,
    highlights: ["Loadouts by planet", "Stratagem guides", "Squad tactics"],
  },
];

export const GAME_SLUGS = GAMES.map((g) => g.slug);

export interface SectionMeta {
  slug: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  /** Roadmap phase this ships in — surfaced on the "opening soon" stub. */
  phase: string;
}

/** Non-game feature sections. Used for nav + the styled "opening soon" stubs. */
export const SECTIONS: SectionMeta[] = [
  {
    slug: "forums",
    title: "The Saloon",
    blurb:
      "A table for every game. Start threads, drop hot takes, mention the squad by name.",
    icon: MessagesSquare,
    accent: "var(--brass)",
    phase: "Phase 2",
  },
  {
    slug: "leaderboard",
    title: "The House Board",
    blurb:
      "Post your scores and runs. Climb the standings. Earn your place on the board.",
    icon: Trophy,
    accent: "var(--gold-light)",
    phase: "Phase 2",
  },
  {
    slug: "videos",
    title: "Showboat Theater",
    blurb:
      "Curated clips and highlights in a player dressed for the house, not the default embed.",
    icon: Clapperboard,
    accent: "var(--oxblood-bright)",
    phase: "Phase 5",
  },
  {
    slug: "arcade",
    title: "Penny Arcade",
    blurb:
      "Quick games to kill time between matches. Compete for the house high scores.",
    icon: Gamepad2,
    accent: "var(--brass)",
    phase: "Phase 5",
  },
  {
    slug: "learn",
    title: "Engine Room",
    blurb:
      "Learn to code below decks. Interactive lessons that take you from zero to shipping.",
    icon: Code2,
    accent: "var(--sage)",
    phase: "Phase 5",
  },
  {
    slug: "donate",
    title: "Patrons' Ledger",
    blurb:
      "Keep the boilers lit and the house free of ads. Back the mission, earn your plaque.",
    icon: Heart,
    accent: "var(--oxblood-bright)",
    phase: "Phase 4",
  },
];

export const SECTION_BY_SLUG: Record<string, SectionMeta> = Object.fromEntries(
  SECTIONS.map((s) => [s.slug, s]),
);

export interface NavItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: { label: string; href: string; icon?: LucideIcon }[];
}

export const NAV: NavItem[] = [
  {
    label: "Games",
    icon: Gamepad2,
    children: GAMES.map((g) => ({
      label: g.name,
      href: `/${g.slug}`,
      icon: g.icon,
    })),
  },
  { label: "Saloon", href: "/forums", icon: MessagesSquare },
  { label: "Library", href: "/guides", icon: BookOpen },
  { label: "House Board", href: "/leaderboard", icon: Trophy },
  { label: "Theater", href: "/videos", icon: Clapperboard },
  { label: "Arcade", href: "/arcade", icon: Gamepad2 },
  { label: "Engine Room", href: "/learn", icon: BookOpen },
];

