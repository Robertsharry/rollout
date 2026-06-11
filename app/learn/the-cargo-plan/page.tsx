import { Link } from "next-view-transitions";

import { StationCargo } from "@/components/learn/station-cargo";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-cargo-plan");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Cargo Plan — Flexbox by Packing a Hold`,
  description:
    "Learn flexbox by packing a riverboat hold: four crates, four words of CSS, every arrangement on one screen with the code lighting up as you work.",
  path: "/learn/the-cargo-plan",
});

const RECAP = [
  "display: flex turns a box into a foreman — its children stop stacking and start packing.",
  "flex-direction picks the run, justify-content packs along it, align-items settles across it.",
  "gap is the honest way to put air between things — no margin arithmetic.",
  "Every card row and button cluster on this boat is one of these holds.",
];

export default function StationPage() {
  const next = stationAfter("the-cargo-plan");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The cargo plan", path: "/learn/the-cargo-plan" },
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
              The cargo plan
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Before flexbox, lining boxes up on a page was carpentry — measured, fussy, and wrong the moment anything changed size. Flexbox replaced the carpentry with a foreman: you tell the hold which way it runs and how to pack, and every crate finds its place on its own.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a working hold and the four words that run it. Change a word, watch the cargo move. Hover any control and the line of CSS it owns lights up — and hovering the code lights the control right back.
            </p>
          </header>

          <div className="mt-10">
            <StationCargo />
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

          <StationLogButton slug="the-cargo-plan" />

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
