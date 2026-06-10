export interface ProgramEntry {
  /** YouTube video id — every id here is verified via oEmbed before shipping. */
  id: string;
  /** House display title (clean, no emoji). */
  title: string;
  /** Exact YouTube title, used for accessibility and structured data. */
  ytTitle: string;
  /** Uploading channel, credited on the playbill. */
  channel: string;
  /** Game slug, matching lib/site GAMES. */
  game: string;
  act: string;
  blurb: string;
}

/**
 * Tonight's program. Hand picked by the house; ids validated against
 * YouTube's oEmbed endpoint on 2026-06-09.
 */
export const PROGRAM: ProgramEntry[] = [
  {
    id: "3nQ-b04IFIA",
    title: "Helldivers 2: The Intro Cinematic",
    ytTitle: "HELLDIVERS 2 | Intro Cinematic | Announcement Trailer",
    channel: "Goodbye Kansas Studios",
    game: "helldivers",
    act: "Act I",
    blurb: "The recruitment film that lied to every single one of us. A classic.",
  },
  {
    id: "9slTF7NJ7UI",
    title: "Arc Raiders: Launch Trailer",
    ytTitle: "ARC Raiders - Official Launch Trailer",
    channel: "IGN",
    game: "arc-raiders",
    act: "Act II",
    blurb: "Topside in three minutes: why the surface belongs to the machines.",
  },
  {
    id: "44tZFN9mu1E",
    title: "Arc Raiders: Know Your Enemy",
    ytTitle: "ARC Raiders - Official 'Know Your Enemy' Trailer",
    channel: "IGN",
    game: "arc-raiders",
    act: "Act II",
    blurb: "The bestiary in motion. Study it before you dive — the cargo hold will quiz you.",
  },
  {
    id: "6ZZ_3LeFxC4",
    title: "Greatest Knockouts of 2025",
    ytTitle: "GREATEST KNOCKOUTS From 2025!",
    channel: "UFC",
    game: "ufc",
    act: "Act III",
    blurb: "A full year of lights out, called as it happened. Straight from the source.",
  },
  {
    id: "mOo3OP8RWbE",
    title: "One Knockout Per Year Since 2008",
    ytTitle: "GREATEST KNOCKOUT From Each Year!",
    channel: "UFC",
    game: "ufc",
    act: "Act III",
    blurb: "An education in violence, one year at a time.",
  },
  {
    id: "SxwOJi2dd4c",
    title: "Pokémon Scarlet & Violet: The Reveal",
    ytTitle: "Pokémon Scarlet and Pokémon Violet Announcement Trailer",
    channel: "GameSpot",
    game: "pokemon",
    act: "Act IV",
    blurb: "The Paldea reveal that opened the ninth generation.",
  },
  {
    id: "rSMqv0EKZPw",
    title: "Pokémon Scarlet & Violet: Launch Trailer",
    ytTitle: "Pokémon Scarlet & Pokémon Violet – Official HD Launch Trailer",
    channel: "GameSpot",
    game: "pokemon",
    act: "Act IV",
    blurb: "The launch picture. Choose your partner all over again.",
  },
];

export function posterUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function embedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`;
}

export function watchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
