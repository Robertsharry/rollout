import { Link } from "next-view-transitions";

import { StationConditions } from "@/components/learn/station-conditions";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-conditions");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Conditions — Conditional Rendering`,
  description:
    "Learn how the boat decides what to draw. Flip a status and watch one ternary choose the curtain, the picture, or the empty stage.",
  path: "/learn/the-conditions",
  keywords: [
    "react conditional rendering",
    "ternary operator",
    "javascript if else",
    "show hide elements",
  ],
});

const RECAP = [
  "A condition is a fork in the road. The code asks a yes-or-no question and follows the matching branch.",
  "The ternary (a ? b : c) is the shortest way to write 'show b when a is true, otherwise show c' — it returns a value, so it slots straight into the markup.",
  "The branch you do not take is never drawn. The browser never sees the markup of branches the condition skipped.",
  "Every show-or-hide on this site — toasts, modals, the curtain itself — is one of these forks under the hood.",
];

export default function TheConditionsPage() {
  const next = stationAfter("the-conditions");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The conditions", path: "/learn/the-conditions" },
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
              The conditions
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              A theater does not show every scene every night. Before the bell
              there is the curtain. After the bell there is the picture. While
              a reel is playing there is also a marquee announcing what is on.
              JavaScript decides which of those to draw with a single yes or
              no, written as a ternary.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is the stage and its small script. Flip the status to one
              of three values. Watch only the matching branch fire and only
              the matching parts get drawn.
            </p>
          </header>

          <div className="mt-10">
            <StationConditions />
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
          ) : null}
        </Container>
      </Section>
    </>
  );
}
