import { Link } from "next-view-transitions";

import { StationLabels } from "@/components/learn/station-labels";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-labels");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Labels — HTML Attributes on a Real Link`,
  description:
    "Learn what HTML attributes actually do. Take them off a real anchor element one at a time and watch what the tag stops doing — opens in a new tab, safe to follow, the screen reader announcement.",
  path: "/learn/the-labels",
  keywords: [
    "html attributes tutorial",
    "anchor tag attributes",
    "aria label explained",
    "target blank rel noopener",
  ],
});

const RECAP = [
  "An attribute is a tiny pair: a key and a value, written inside the opening tag.",
  "Every attribute does ONE small job — where to go, how to open, what the screen reader says, which paint to wear.",
  "Take an attribute off and the tag still works; it just stops doing that one job. That is how you debug a busted link in seconds.",
  "The boat's navbar, the theater's iframe, the donate button — every label on this site is built out of plain attributes like these.",
];

export default function TheLabelsPage() {
  const next = stationAfter("the-labels");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The labels", path: "/learn/the-labels" },
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
              The labels
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              You met tags in The Bones. Most tags are not much on their own —
              an empty link goes nowhere, an empty image shows nothing. The
              attributes are how a tag gets its job. Each one is a labelled
              instruction stapled to the inside of the opening tag.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a real link to our Discord, rigged with all the labels
              it actually wears in production. Hover any one to see what it
              does. Toggle it off to see what disappears. The tag stays — only
              the work changes.
            </p>
          </header>

          <div className="mt-10">
            <StationLabels />
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
          <StationLogButton slug="the-labels" />

        </Container>
      </Section>
    </>
  );
}
