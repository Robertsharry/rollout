import { Link } from "next-view-transitions";

import { StationParts } from "@/components/learn/station-parts";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-parts");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Parts — Components and Props`,
  description:
    "One component, many cards. Pass different props and the same little factory builds different posters — the trick behind every card on this site.",
  path: "/learn/the-parts",
  keywords: [
    "react components tutorial",
    "props for beginners",
    "reusable components",
    "react basics",
  ],
});

const RECAP = [
  "A component is a function that returns a piece of markup. You write the recipe once.",
  "Props are the slip of paper you hand the recipe each time you stamp a copy. Same recipe, different ingredients, different stamping.",
  "Every <Card />, <Button />, <Badge /> on this site is exactly this — defined once, used hundreds of times with different props.",
  "When you find yourself copying markup three times to change one word, that is the signal to lift it into a component.",
];

export default function ThePartsPage() {
  const next = stationAfter("the-parts");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The parts", path: "/learn/the-parts" },
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
              The parts
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              You have seen the cards on every page of this boat — the Pokemon
              card, the UFC card, the Helldivers card. We did not write them
              three times. We wrote one Poster recipe and handed it different
              ingredients three times. The recipe is a component; the
              ingredients are props.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is the recipe, then three stampings. Change a title, pick
              a different accent — watch one card respond, the recipe stay
              still. That is the whole idea: many cards from one factory.
            </p>
          </header>

          <div className="mt-10">
            <StationParts />
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
          <StationLogButton slug="the-parts" />

        </Container>
      </Section>
    </>
  );
}
