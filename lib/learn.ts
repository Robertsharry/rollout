export interface Station {
  slug: string;
  number: string;
  title: string;
  summary: string;
  teaches: string;
}

export const STATIONS: Station[] = [
  {
    slug: "the-bones",
    number: "01",
    title: "The bones",
    summary:
      "What HTML actually is, taught by taking the Showboat Theater's stage apart. Hover a line of markup and watch the matching plank light up.",
    teaches: "HTML structure & nesting",
  },
  {
    slug: "the-paint-shop",
    number: "02",
    title: "The paint shop",
    summary:
      "How one CSS variable repaints a whole boat. Swap liveries on a real house card and watch every surface follow a single line of code.",
    teaches: "CSS & design tokens",
  },
  {
    slug: "the-choreography",
    number: "03",
    title: "The choreography",
    summary:
      "The two lines of CSS behind the theater curtain. Drive the duration and easing yourself and feel how motion gets its personality.",
    teaches: "Transitions & easing",
  },
  {
    slug: "the-wiring",
    number: "04",
    title: "The wiring",
    summary:
      "How a click becomes movement. Drive a tiny working theater with its own script — buttons fire recipes, recipes edit state, the boat answers.",
    teaches: "State, events & handlers",
  },
];

export function stationAfter(slug: string): Station | null {
  const i = STATIONS.findIndex((s) => s.slug === slug);
  return i >= 0 && i < STATIONS.length - 1 ? STATIONS[i + 1] : null;
}
