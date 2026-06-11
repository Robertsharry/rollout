import { Link } from "next-view-transitions";

import { StationRivers } from "@/components/learn/station-rivers";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-three-rivers");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Three Rivers — Responsive Design with Live Media Queries`,
  description:
    "Learn responsive design by steering one deck through three boats: drag the river wider and watch media queries redraw the same cards for phone, tablet, and desk.",
  path: "/learn/the-three-rivers",
});

const RECAP = [
  "Start with the skiff: the plain rule is the smallest screen, no query needed.",
  "@media (min-width: …) adds rules that only apply once the river is wide enough.",
  "The browser keeps every rule and applies the widest one that fits — you watched it switch live.",
  "This whole site rides the same three rivers; resize your window and the decks redraw.",
];

export default function StationPage() {
  const next = stationAfter("the-three-rivers");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The three rivers", path: "/learn/the-three-rivers" },
        ])}
      />

      <Section spacing="none" className="pt-28 pb-20">
        <Container className="max-w-5xl">
          <Link
            href="/learn"
            className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
          >
            ← The Engine Room
          </Link>

          <header className="mt-5 max-w-3xl">
            <p className="font-mono text-xs tracking-[0.2em] text-gold-light uppercase">
              Station {STATION.number} · {STATION.teaches}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              The three rivers
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Every visitor arrives on a different boat: a skiff of a phone, a packet boat of a tablet, a full steamer of a desk. You do not build three decks. You build one deck and post rules for when the river widens — those rules are media queries.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Drag the river and watch the deck redraw itself. The rule currently in force lights up in the code as you drag — and hovering a rule steers the river straight to that boat.
            </p>
          </header>

          <div className="mt-10">
            <StationRivers />
          </div>

          <div className="glass mt-10 rounded-lg p-6">
            <h2 className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
              What you just learned
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
              {RECAP.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-brass" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <StationLogButton slug="the-three-rivers" />

          {next ? (
            <div className="mt-8 text-right">
              <Link
                href={`/learn/${next.slug}`}
                className="text-sm font-medium text-brass transition-colors hover:text-gold-light"
              >
                Next — Station {next.number}: {next.title} <span aria-hidden>☞</span>
              </Link>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
