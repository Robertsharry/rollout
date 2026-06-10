import { Link } from "next-view-transitions";

import { StationLoop } from "@/components/learn/station-loop";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-loop");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Loop — Arrays and .map() on the Playbill`,
  description:
    "Learn how one line of code lays out a hundred items. Add reels to the playbill, take some away, and watch the same .map() rewrite the list every time.",
  path: "/learn/the-loop",
  keywords: [
    "javascript map tutorial",
    "react list rendering",
    "iteration for beginners",
    "arrays in javascript",
  ],
});

const RECAP = [
  "An array is just a numbered list of items, written between [ and ].",
  "The .map() method runs your little function once per item and hands back a new list of whatever the function returned.",
  "When the array changes, the .map() runs again. The list on the page rewrites itself with no extra wiring.",
  "Our real playbill, leaderboard, guide index — every list on this site — is one .map() over an array. Learn this and you have the shape of most JavaScript on the web.",
];

export default function TheLoopPage() {
  const next = stationAfter("the-loop");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The loop", path: "/learn/the-loop" },
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
              The loop
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              The Showboat plays more than one reel a night. We do not write
              one block of markup for each one. We write the list of reels
              once, and a single line of code lays out one item per entry.
              That line is .map(), and it is the engine behind almost every
              list on the web.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a working playbill. Press Add a reel — watch the array
              grow by one and the list grow by one in the same breath. Remove
              one — they both shrink. The markup never moves; the data does.
            </p>
          </header>

          <div className="mt-10">
            <StationLoop />
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
