import { Link } from "next-view-transitions";

import { StationCredits } from "@/components/learn/station-credits";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-credits");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Credits — Alt Text and ARIA Labels`,
  description:
    "Why every image needs an alt and every icon button needs an aria-label. Toggle the captions on real elements and hear what disappears for non sighted readers.",
  path: "/learn/the-credits",
  keywords: [
    "alt text tutorial",
    "aria label tutorial",
    "accessibility for beginners",
    "screen reader basics",
  ],
});

const RECAP = [
  "The screen is one of many ways a page is read. Roughly one in fifty patrons reads with their ears, through a screen reader.",
  "alt text on an image is the caption a reader hears. A picture with no alt is silence — the reader just hears 'image'.",
  "An icon button with no aria-label is silence the same way — 'button' is all the reader hears, and 'button' is not a job description.",
  "Two attributes, a few quiet seconds of writing. The whole boat opens up to a reader who could not see it otherwise.",
];

export default function TheCreditsPage() {
  const next = stationAfter("the-credits");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The credits", path: "/learn/the-credits" },
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
              The credits
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Imagine a guest at the door of the house who cannot see the
              brass and the velvet. Your job, as the proprietor, is to
              describe the room out loud. That is what alt text and ARIA
              labels are. They are the captions a screen reader speaks. Get
              them right and a whole class of patron walks aboard. Skip them
              and the room is silent.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Below is a real poster and a real icon button. Toggle their
              captions and listen to what disappears. Every image and every
              icon on this site gets the same treatment.
            </p>
          </header>

          <div className="mt-10">
            <StationCredits />
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
