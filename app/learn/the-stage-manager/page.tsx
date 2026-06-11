import { Link } from "next-view-transitions";

import { StationStageManager } from "@/components/learn/station-stagemanager";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-stage-manager");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Stage Manager — Timers and Sequencing from the Real Theater`,
  description:
    "Learn setTimeout and sequencing with the Showboat Theater's actual curtain choreography: three cues, two timers, and a cleanup rule that keeps swaps from fighting.",
  path: "/learn/the-stage-manager",
});

const RECAP = [
  "setTimeout(fn, ms) books a cue: run this, that many milliseconds from now.",
  "Sequences are just cues with staggered times — close at 0, swap at 620, reopen at 700.",
  "Always clear old timers before booking new ones, and when the component leaves the stage.",
  "The swap hides behind the closed curtain — good sequencing is good stagecraft.",
];

export default function StationPage() {
  const next = stationAfter("the-stage-manager");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The stage manager", path: "/learn/the-stage-manager" },
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
              The stage manager
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              When you change reels in our Showboat Theater, the curtain closes, the picture swaps behind the velvet, and the curtain reopens — and nobody touches anything in between. That is a stage manager: a script of cues, each fired by a timer.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              This is the theater&apos;s real choreography, instrumented. Pick a new reel and watch each line of the script light up at the exact moment its cue fires. Note the last two lines — a new cue clears the old timers first, or two swaps would fight over the stage.
            </p>
          </header>

          <div className="mt-10">
            <StationStageManager />
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

          <StationLogButton slug="the-stage-manager" />

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
