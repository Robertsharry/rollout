import { Link } from "next-view-transitions";

import { EngineProgress } from "@/components/learn/progress";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import {
  LANGUAGE_LABELS,
  stationsByLanguage,
  type StationLanguage,
} from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Engine Room — Learn to Code, Visually",
  description:
    "Interactive coding lessons that open the panels of this very website. Seventeen stations — full HTML, CSS from variables to flexbox, grid, and responsive design, six JavaScript stations, and a free build capstone — all taught by taking real parts of this site apart in your hands.",
  path: "/learn",
  keywords: [
    "learn html visually",
    "learn css interactive",
    "learn javascript visually",
    "flexbox tutorial interactive",
    "css grid tutorial interactive",
    "responsive design tutorial",
    "settimeout tutorial",
    "html attributes tutorial",
    "semantic html tutorial",
    "html forms tutorial",
    "accessibility tutorial",
    "css variables tutorial",
    "css transitions tutorial",
    "javascript state tutorial",
    "react map tutorial",
    "react components tutorial",
    "server actions tutorial",
    "beginner web development",
  ],
});

const ORDER: StationLanguage[] = ["html", "css", "js", "capstone"];

export default function LearnPage() {
  const groups = stationsByLanguage();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Below decks · The Engine Room"
            title="Learn the machinery of this very boat."
            description="No toy examples. Every station opens a real panel of this website — the theater, the cards, the curtain, the donation desk — and shows you the code that makes it run. Seventeen stations across HTML, CSS, and JavaScript, ending in a free build, made for people who learn with their eyes."
          />
          <EngineProgress />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container className="max-w-4xl space-y-14">
          {ORDER.map((lang) => {
            const stations = groups[lang];
            const label = LANGUAGE_LABELS[lang];
            return (
              <div key={lang}>
                <div className="mb-5 border-b border-brass/25 pb-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    {label.name}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-sage">
                    {label.tagline}
                  </p>
                </div>

                <Stagger className="space-y-4">
                  {stations.map((station) => (
                    <StaggerItem key={station.slug}>
                      <Link
                        href={`/learn/${station.slug}`}
                        className="group glass flex flex-col gap-4 rounded-lg p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/60 sm:flex-row sm:items-center sm:gap-6"
                      >
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-card/70">
                          <span className="font-display text-lg font-bold text-gold-light">
                            {station.number}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h3 className="font-display text-lg font-bold tracking-tight">
                              Station {station.number} — {station.title}
                            </h3>
                            <span className="font-mono text-[11px] tracking-[0.14em] text-gold-light uppercase">
                              {station.teaches}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-sage">
                            {station.summary}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-medium text-brass">
                          Open the hatch <span aria-hidden>☞</span>
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            );
          })}
        </Container>
      </Section>
    </>
  );
}
