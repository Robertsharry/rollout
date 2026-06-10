import { Link } from "next-view-transitions";

import { StationChoreo } from "@/components/learn/station-choreo";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Station 03: The Choreography — CSS Transitions on the Real Curtain",
  description:
    "Learn CSS transitions and easing by driving this site's actual theater curtain: set the duration, pick the easing, and feel how motion gets personality.",
  path: "/learn/the-choreography",
});

const RECAP = [
  "A transition needs three answers: what property, how long, and with what easing.",
  "Easing is the personality. Linear feels mechanical; a good curve feels like fabric, or a bounce, or a held breath.",
  "Animate transform and opacity — the browser moves them on the graphics card. Animating layout properties like left makes the page stutter.",
  "The grand curtain in our theater is exactly this: one transition line and one transform per side. Stagecraft is cheaper than it looks.",
];

export default function TheChoreographyPage() {
  const next = stationAfter("the-choreography");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The choreography", path: "/learn/the-choreography" },
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
              Station 03 · Transitions &amp; easing
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              The choreography
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              When you raised the curtain in our theater, you watched two lines
              of CSS do all the work. A transition is a contract with the
              browser: when this value changes, do not jump — travel. You choose
              how long the trip takes and the shape of the journey.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              This is the actual curtain rig, wired to your hands. Set the
              clock, pick the easing, run it. The code under the controls is
              live — what you see is exactly what ships.
            </p>
          </header>

          <div className="mt-10">
            <StationChoreo />
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
