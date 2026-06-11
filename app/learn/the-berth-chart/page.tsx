import { Link } from "next-view-transitions";

import { StationBerth } from "@/components/learn/station-berth";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-berth-chart");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Berth Chart — CSS Grid on the Real Specimen Cabinet`,
  description:
    "Learn CSS grid by redrawing the specimen cabinet's berth chart: columns from a slider, gaps you can feel, and a double berth that reflows the whole chart.",
  path: "/learn/the-berth-chart",
});

const RECAP = [
  "display: grid draws the chart; grid-template-columns decides how many berths to a row.",
  "repeat(3, 1fr) means three berths, each an equal share — fr is the fair share unit.",
  "grid-column: span 2 lets one item take a double berth, and the chart reflows around it.",
  "Reach for grid when the layout is two directions at once; reach for flexbox when it is one run.",
];

export default function StationPage() {
  const next = stationAfter("the-berth-chart");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The berth chart", path: "/learn/the-berth-chart" },
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
              The berth chart
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Where flexbox packs a single run, grid draws the whole chart first: this many columns, this much air, and everything aboard sleeps where the chart says. Our specimen cabinet — nine generations of starters — is laid out by exactly this kind of chart.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Redraw it yourself. Slide the columns, stretch the gaps, and give specimen №001 a double berth. Hover the columns line in the code and the chart shows you its pencil marks.
            </p>
          </header>

          <div className="mt-10">
            <StationBerth />
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

          <StationLogButton slug="the-berth-chart" />

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
