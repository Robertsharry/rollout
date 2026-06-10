import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { STATIONS } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Engine Room — Learn to Code, Visually",
  description:
    "Interactive coding lessons that open the panels of this very website: take the theater stage apart, repaint the house with one variable, drive the curtain's animation yourself, and wire a tiny working theater in JavaScript.",
  path: "/learn",
  keywords: [
    "learn html visually",
    "learn css interactive",
    "css variables tutorial",
    "css transitions tutorial",
    "learn javascript visually",
    "javascript state tutorial",
    "beginner web development",
  ],
});

export default function LearnPage() {
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
            description="No toy examples. Every station opens a real panel of this website — the theater, the cards, the curtain — and shows you the code that makes it run. Built for people who learn with their eyes."
          />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container className="max-w-4xl">
          <Stagger className="space-y-5">
            {STATIONS.map((station) => (
              <StaggerItem key={station.slug}>
                <Link
                  href={`/learn/${station.slug}`}
                  className="group glass flex flex-col gap-4 rounded-lg p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/60 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-card/70">
                    <span className="font-display text-xl font-bold text-gold-light">
                      {station.number}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-display text-xl font-bold tracking-tight">
                        Station {station.number} — {station.title}
                      </h2>
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

            <StaggerItem>
              <div className="rounded-lg border border-border/70 bg-mahogany/40 p-6 text-center">
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-foreground/70 uppercase">
                  Station 05 — in the works
                </p>
                <p className="mt-1.5 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                  Components &amp; props: building the boat from reusable parts · arriving soon
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
