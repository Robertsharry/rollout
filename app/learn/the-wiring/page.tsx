import { Link } from "next-view-transitions";

import { StationWiring } from "@/components/learn/station-wiring";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Station 04: The Wiring — JavaScript by Running a Tiny Theater",
  description:
    "Learn the JavaScript loop — state, events, handlers, render — by driving a working miniature of this site's Showboat Theater. Click a control, watch the state change in code, watch the boat answer.",
  path: "/learn/the-wiring",
  keywords: [
    "learn javascript visually",
    "javascript state tutorial",
    "event handlers beginner",
    "state and render explained",
    "interactive coding lesson",
  ],
});

const RECAP = [
  "State is one little box that says what is true right now: this stage has these values, that is all.",
  "An event (a click, a key, a hover) is a signal from outside. A handler is the short script the boat runs when the signal arrives.",
  "Handlers do not draw anything; they only edit the state. The display reads the state and follows.",
  "Three controls and one tiny script ran the whole theater. Every interactive piece of this site is this same loop, larger.",
];

export default function TheWiringPage() {
  const next = stationAfter("the-wiring");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The wiring", path: "/learn/the-wiring" },
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
              Station 04 · State, events &amp; handlers
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              The wiring
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Until now you have built bones, mixed paint, and choreographed
              motion. None of those things knew when you clicked. JavaScript is
              what makes the boat listen. Think of it as the wiring under the
              decks: a button is hooked to a small recipe, the recipe edits a
              tiny notebook the boat keeps about itself, and the display reads
              that notebook to decide what to show.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a working miniature theater, complete with its own
              script. Push the controls. Watch the values inside the state
              object update under your hands, and watch the boat answer. The
              recipes never move — only the values do, and the display follows.
            </p>
          </header>

          <div className="mt-10">
            <StationWiring />
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

          {next ? (
            <div className="mt-8 text-right">
              <Link
                href={`/learn/${next.slug}`}
                className="text-sm font-medium text-brass transition-colors hover:text-gold-light"
              >
                Next — Station {next.number}: {next.title} <span aria-hidden>☞</span>
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-between">
              <Link
                href="/learn"
                className="text-sm font-medium text-brass transition-colors hover:text-gold-light"
              >
                <span aria-hidden>☜</span> Back to the Engine Room
              </Link>
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                Station 05 is being fitted
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
