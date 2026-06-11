export type StationLanguage = "html" | "css" | "js" | "capstone";

export interface Station {
  slug: string;
  number: string;
  language: StationLanguage;
  title: string;
  summary: string;
  teaches: string;
}

export const LANGUAGE_LABELS: Record<StationLanguage, { name: string; tagline: string }> = {
  html: {
    name: "HTML — the bones of the boat",
    tagline: "The shape of every page. Tags, boxes, and how they all hang together.",
  },
  css: {
    name: "CSS — the paint and the motion",
    tagline: "How the boat looks, lays out, and moves. One palette repaints everything; one rule rearranges a deck.",
  },
  js: {
    name: "JavaScript — the wiring under the decks",
    tagline: "How the boat answers back. Click a button, edit some state, watch the boat respond.",
  },
  capstone: {
    name: "The Dry Dock — build your own",
    tagline: "No rails, no recipe. Real HTML and CSS in your hands, rendered live, with house challenges if you want a push.",
  },
};

export const STATIONS: Station[] = [
  {
    slug: "the-bones",
    number: "01",
    language: "html",
    title: "The bones",
    summary:
      "What HTML actually is, taught by taking the Showboat Theater's stage apart. Hover a line of markup and watch the matching plank light up.",
    teaches: "HTML structure & nesting",
  },
  {
    slug: "the-labels",
    number: "02",
    language: "html",
    title: "The labels",
    summary:
      "Attributes are how a tag carries extra information. Hover an attribute on a real link and watch its single job light up — where it goes, what announces it, how it opens.",
    teaches: "HTML attributes",
  },
  {
    slug: "the-signposts",
    number: "03",
    language: "html",
    title: "The signposts",
    summary:
      "Why a page uses <header>, <nav>, <main>, <footer> instead of plain boxes. Hover each landmark and watch the matching region of a real page outline itself.",
    teaches: "Semantic landmarks",
  },
  {
    slug: "the-forms",
    number: "04",
    language: "html",
    title: "The forms",
    summary:
      "How a form actually works — the <label>, the <input>, the <button> — built on a miniature of our donation desk. Type a figure, watch the same value travel through every line of code.",
    teaches: "Forms & inputs",
  },
  {
    slug: "the-credits",
    number: "05",
    language: "html",
    title: "The credits",
    summary:
      "Alt text and ARIA are the captions a screen reader sees. Toggle the captions on a real image and a real icon button — and hear what the boat sounds like through a reader.",
    teaches: "Accessibility text",
  },
  {
    slug: "the-paint-shop",
    number: "06",
    language: "css",
    title: "The paint shop",
    summary:
      "How one CSS variable repaints a whole boat. Swap liveries on a real house card and watch every surface follow a single line of code.",
    teaches: "CSS & design tokens",
  },
  {
    slug: "the-cargo-plan",
    number: "07",
    language: "css",
    title: "The cargo plan",
    summary:
      "Flexbox is how a hold gets packed. Stack four crates, then change one word — row, center, between — and watch the whole cargo rearrange itself.",
    teaches: "Flexbox layout",
  },
  {
    slug: "the-berth-chart",
    number: "08",
    language: "css",
    title: "The berth chart",
    summary:
      "Grid is the berth chart of a page: columns drawn first, everything sleeps where the chart says. Redraw the specimen cabinet with a slider and give one specimen a double berth.",
    teaches: "CSS grid",
  },
  {
    slug: "the-three-rivers",
    number: "09",
    language: "css",
    title: "The three rivers",
    summary:
      "One deck, three boats: skiff, packet, steamer. Drag the river wider and narrower and watch media queries redraw the same cards for every size of screen.",
    teaches: "Responsive design",
  },
  {
    slug: "the-choreography",
    number: "10",
    language: "css",
    title: "The choreography",
    summary:
      "The two lines of CSS behind the theater curtain. Drive the duration and easing yourself and feel how motion gets its personality.",
    teaches: "Transitions & easing",
  },
  {
    slug: "the-wiring",
    number: "11",
    language: "js",
    title: "The wiring",
    summary:
      "How a click becomes movement. Drive a tiny working theater with its own script — buttons fire recipes, recipes edit state, the boat answers.",
    teaches: "State, events & handlers",
  },
  {
    slug: "the-loop",
    number: "12",
    language: "js",
    title: "The loop",
    summary:
      "One line of code lays out a hundred cards. Add a reel to the playbill, change one, take one away — the .map() runs again and the list rewrites itself.",
    teaches: "Arrays & iteration",
  },
  {
    slug: "the-conditions",
    number: "13",
    language: "js",
    title: "The conditions",
    summary:
      "How the boat decides what to show. Flip a toggle and watch a single ternary choose the curtain, the picture, or the empty stage.",
    teaches: "Conditional rendering",
  },
  {
    slug: "the-parts",
    number: "14",
    language: "js",
    title: "The parts",
    summary:
      "One Card component, many cards. Pass different props and the same little factory builds different posters — the same trick every page on this site uses.",
    teaches: "Components & props",
  },
  {
    slug: "the-signal",
    number: "15",
    language: "js",
    title: "The signal",
    summary:
      "What happens between clicking submit and the server saying thanks. Send a request through the wires of a miniature donate form and watch every leg of the round trip.",
    teaches: "Forms & server actions",
  },
  {
    slug: "the-stage-manager",
    number: "16",
    language: "js",
    title: "The stage manager",
    summary:
      "The theater's curtain swap is three timed cues: close, change the reel, reopen. Run the sequence and watch each line of the script light up the moment its timer fires.",
    teaches: "Timers & sequencing",
  },
  {
    slug: "the-dry-dock",
    number: "17",
    language: "capstone",
    title: "The dry dock",
    summary:
      "Everything you logged, with the training wheels off. Write your own HTML and CSS and watch it render live — blank slip, or take a house challenge.",
    teaches: "Free build",
  },
];

export function stationAfter(slug: string): Station | null {
  const i = STATIONS.findIndex((s) => s.slug === slug);
  return i >= 0 && i < STATIONS.length - 1 ? STATIONS[i + 1] : null;
}

export function getStation(slug: string): Station {
  const s = STATIONS.find((s) => s.slug === slug);
  if (!s) throw new Error(`No station registered for slug "${slug}"`);
  return s;
}

export function stationsByLanguage(): Record<StationLanguage, Station[]> {
  return {
    html: STATIONS.filter((s) => s.language === "html"),
    css: STATIONS.filter((s) => s.language === "css"),
    js: STATIONS.filter((s) => s.language === "js"),
    capstone: STATIONS.filter((s) => s.language === "capstone"),
  };
}
