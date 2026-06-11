import { Link } from "next-view-transitions";

import { StationDryDock } from "@/components/learn/station-drydock";
import { StationLogButton } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-dry-dock");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Dry Dock — Free Build with Live Preview`,
  description:
    "The Engine Room capstone: write your own HTML and CSS and watch it render live. Start from a blank slip or take a house challenge.",
  path: "/learn/the-dry-dock",
});

const RECAP = [
  "Everything renders from the same two materials you logged: structure first, paint second.",
  "When a build misbehaves, read it like the stations taught you — find the box, then find the bucket it drinks from.",
  "The challenges are starting points, not tests. Break them, rebuild them, make them yours.",
  "When something you build here makes you grin, you are a person who builds websites now. The house said so.",
];

export default function TheDryDockPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The dry dock", path: "/learn/the-dry-dock" },
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
              The dry dock
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Twelve stations of guided machinery, and now the rails come off.
              This is a working slip: HTML on one side, CSS under it, and your
              build rendered live on the right. Nothing here is a trick or a
              toy — it is the same two materials this whole boat is made of.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              Start from the blank slip, or take a house challenge and bend it
              until it is yours.
            </p>
          </header>

          <div className="mt-10">
            <StationDryDock />
          </div>

          <div className="glass mt-10 rounded-lg p-6">
            <h2 className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
              What the dry dock teaches
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

          <StationLogButton slug="the-dry-dock" />
        </Container>
      </Section>
    </>
  );
}
