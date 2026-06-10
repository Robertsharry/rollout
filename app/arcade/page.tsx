import { Link } from "next-view-transitions";

import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Penny Arcade — Free Browser Games",
  description:
    "Three hall classics rebuilt by the house, free to play in the browser: Chip Chase, Boiler Dig, and Topside. No tokens required.",
  path: "/arcade",
  keywords: [
    "free browser arcade games",
    "maze chase game",
    "digging arcade game",
    "formation shooter",
  ],
});

interface CabinetCard {
  slug: string;
  title: string;
  tagline: string;
  accent: string;
  blurb: string;
  art: React.ReactNode;
}

function MazeArt() {
  return (
    <div className="grid h-full grid-cols-6 gap-1 p-3 opacity-80">
      {Array.from({ length: 24 }, (_, i) => (
        <div
          key={i}
          className={
            [0, 2, 5, 9, 12, 14, 17, 21].includes(i)
              ? "rounded-sm bg-[#1B3527]"
              : "flex items-center justify-center"
          }
        >
          {![0, 2, 5, 9, 12, 14, 17, 21].includes(i) ? (
            <span className="size-1 rounded-full bg-gold-light/70" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StrataArt() {
  return (
    <div className="flex h-full flex-col p-3 opacity-90">
      <div className="h-1/4 rounded-t-sm bg-[#3B2F22]" />
      <div className="relative h-1/4 bg-[#36281C]">
        <span className="absolute top-1/2 left-1/3 size-2 -translate-y-1/2 rotate-45 bg-gold-light/70" />
      </div>
      <div className="relative h-1/4 bg-[#2E2117]">
        <span className="absolute top-1/2 right-1/4 size-3 -translate-y-1/2 rounded-sm border border-gold-light/60 bg-[#3B2A20]" />
      </div>
      <div className="h-1/4 rounded-b-sm bg-[#271B12]" />
    </div>
  );
}

function SwarmArt() {
  return (
    <div className="relative h-full p-3 opacity-90">
      {[
        [20, 18],
        [45, 12],
        [70, 20],
        [32, 38],
        [58, 34],
      ].map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute size-2 rotate-45 bg-[#C8A93C]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
      <span className="absolute bottom-3 left-1/2 h-4 w-1.5 -translate-x-1/2 bg-brass" />
      <span className="absolute bottom-2 left-1/2 h-1.5 w-8 -translate-x-1/2 bg-[#2F5240]" />
    </div>
  );
}

const CABINETS: CabinetCard[] = [
  {
    slug: "chip-chase",
    title: "Chip Chase",
    tagline: "Clear the table. Mind the sharps.",
    accent: "var(--gold-light)",
    blurb:
      "Run an original house maze, pocket every chip, and stay ahead of four card sharps who each hunt a different way. House markers turn the tables — briefly.",
    art: <MazeArt />,
  },
  {
    slug: "boiler-dig",
    title: "Boiler Dig",
    tagline: "Carve the soot. Drop the cargo.",
    accent: "var(--sage)",
    blurb:
      "Dig tunnels below decks, vent rust mites with the steam lance, and undermine loose cargo so it does the heavy work for you. Watch your own head.",
    art: <StrataArt />,
  },
  {
    slug: "topside",
    title: "Topside",
    tagline: "The wasps found the boat.",
    accent: "#D9C26B",
    blurb:
      "Man the deck gun against diving swarms. Two shells in the air at a time, formations that break and come for you, and a bonus swarm every third wave.",
    art: <SwarmArt />,
  },
];

export default function ArcadePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Penny Arcade", path: "/arcade" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Deck 2 · The Penny Arcade"
            title="Three cabinets, lights on."
            description="The hall classics, rebuilt by the house from the felt up — original boards, original art, no tokens required. High scores live on this machine; the global board joins in Phase 2."
          />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {CABINETS.map((cab) => (
              <StaggerItem key={cab.slug} className="h-full">
                <Link
                  href={`/arcade/${cab.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-brass/40 bg-[#241A12] transition-all duration-300 hover:-translate-y-1 hover:border-brass"
                  style={{ "--cab-accent": cab.accent } as React.CSSProperties}
                >
                  <div className="border-b border-brass/30 bg-gradient-to-b from-[#2E2218] to-[#241A12] px-4 py-3 text-center">
                    <p
                      className="font-display text-lg font-bold tracking-[0.16em] uppercase"
                      style={{ color: "var(--cab-accent)" }}
                    >
                      {cab.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-sage uppercase">
                      {cab.tagline}
                    </p>
                  </div>
                  <div className="mx-4 mt-4 aspect-[4/3] overflow-hidden rounded-sm border border-brass/25 bg-[#0B0F0B]">
                    {cab.art}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-relaxed text-sage">{cab.blurb}</p>
                    <span className="mt-auto pt-4 text-sm font-medium text-brass">
                      Step up to the cabinet <span aria-hidden>☞</span>
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <p className="mt-12 text-center font-mono text-xs tracking-[0.14em] text-sage uppercase">
            Keyboard on deck · touch controls on the small screens · P pauses
          </p>
        </Container>
      </Section>
    </>
  );
}
