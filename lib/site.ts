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
  tagline: "Tactical gaming HQ — built by the squad, for the squad.",
  description:
    "Rollout is a veteran-run gaming community hub for Pokémon, UFC, Arc Raiders, and Helldivers 2 — deep tutorials, loadouts, leaderboards, forums, and a Discord that actually shows up.",
  // NEXT_PUBLIC_SITE_URL is set in production; localhost is the dev fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  discordInvite: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.gg",
  locale: "en_US",
} as const;

export interface Game {
  slug: string;
  name: string;
  short: string;
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
    blurb:
      "Master every starter, build teams that win, and learn the type chart cold.",
    accent: "var(--amber)",
    icon: CircleDot,
    highlights: ["Starter tutorials", "Team building", "Type matchups"],
  },
  {
    slug: "ufc",
    name: "UFC",
    short: "UFC",
    blurb:
      "Fight breakdowns, card predictions, and technique guides for every octagon night.",
    accent: "var(--magenta)",
    icon: Swords,
    highlights: ["Fight breakdowns", "Card predictions", "Technique guides"],
  },
  {
    slug: "arc-raiders",
    name: "Arc Raiders",
    short: "ARC RAIDERS",
    blurb:
      "Region-by-region loadouts, map intel, and extraction routes that get you out alive.",
    accent: "var(--neon)",
    icon: Radar,
    highlights: ["Loadouts per region", "Map intel", "Extraction routes"],
  },
  {
    slug: "helldivers",
    name: "Helldivers 2",
    short: "HELLDIVERS 2",
    blurb:
      "Optimal loadouts per planet, stratagem science, and squad tactics for Super Earth.",
    accent: "var(--military)",
    icon: Rocket,
    highlights: ["Loadouts per planet", "Stratagem guides", "Squad tactics"],
  },
];

export const GAME_SLUGS = GAMES.map((g) => g.slug);

export interface SectionMeta {
  slug: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  /** Roadmap phase this ships in — surfaced on the "coming soon" stub. */
  phase: string;
}

/** Non-game feature sections. Used for nav + the styled "coming soon" stubs. */
export const SECTIONS: SectionMeta[] = [
  {
    slug: "forums",
    title: "Forums",
    blurb:
      "A board for every game. Start threads, drop hot takes, @mention the squad.",
    icon: MessagesSquare,
    accent: "var(--neon)",
    phase: "Phase 1–2",
  },
  {
    slug: "leaderboard",
    title: "Leaderboard",
    blurb: "Post your scores and runs. Climb the global board. Earn your flair.",
    icon: Trophy,
    accent: "var(--amber)",
    phase: "Phase 2",
  },
  {
    slug: "videos",
    title: "Videos",
    blurb:
      "Curated clips and highlights in a fully custom player — none of the ugly default embed.",
    icon: Clapperboard,
    accent: "var(--magenta)",
    phase: "Phase 5",
  },
  {
    slug: "arcade",
    title: "Arcade",
    blurb: "Quick mini-games to kill time between matches. Compete for high scores.",
    icon: Gamepad2,
    accent: "var(--neon)",
    phase: "Phase 5",
  },
  {
    slug: "learn",
    title: "Learn to Code",
    blurb: "Interactive lessons that take you from zero to shipping — right in the browser.",
    icon: Code2,
    accent: "var(--military)",
    phase: "Phase 5",
  },
  {
    slug: "donate",
    title: "Support Us",
    blurb: "Keep the servers running and the community ad-free. Back the mission.",
    icon: Heart,
    accent: "var(--magenta)",
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
  { label: "Forums", href: "/forums", icon: MessagesSquare },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Videos", href: "/videos", icon: Clapperboard },
  { label: "Arcade", href: "/arcade", icon: Gamepad2 },
  { label: "Learn", href: "/learn", icon: BookOpen },
];

export const COMMUNITY_STATS = [
  { label: "Members", value: 4200, suffix: "+" },
  { label: "Guides written", value: 180, suffix: "+" },
  { label: "Games covered", value: 4, suffix: "" },
  { label: "Online now", value: 312, suffix: "" },
];
