import { Link } from "next-view-transitions";

import { StationPaint } from "@/components/learn/station-paint";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { getStation, stationAfter } from "@/lib/learn";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const STATION = getStation("the-paint-shop");

export const metadata = buildMetadata({
  title: `Station ${STATION.number}: The Paint Shop — CSS Variables on a Real Card`,
  description:
    "Learn CSS custom properties by repainting one of this site's real cards. Swap whole liveries and mix your own accent, then read the one line of code that did it.",
  path: "/learn/the-paint-shop",
});

const RECAP = [
  "A CSS variable is a named bucket of paint: define --accent once, dip into it everywhere with var(--accent).",
  "Change the bucket, repaint the boat — every surface that references the variable follows automatically.",
  "That is exactly how this site works: our green, brass, and parchment live in one file, and every card, button, and border drinks from it.",
  "Liveries (themes) are just different values in the same buckets. Dark mode is not a redesign; it is a refill.",
];

export default function ThePaintShopPage() {
  const next = stationAfter("the-paint-shop");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Engine Room", path: "/learn" },
          { name: "The paint shop", path: "/learn/the-paint-shop" },
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
              The paint shop
            </h1>
            <p className="mt-4 leading-relaxed text-sage">
              Every color on this boat — the bottle green felt, the brass
              hairlines, the parchment ink — is mixed in one place and poured
              into named buckets called CSS variables. The cards do not know
              what color they are. They only know which bucket to drink from.
            </p>
            <p className="mt-3 leading-relaxed text-sage">
              That card on the right is a real house card wired to four buckets.
              Swap the livery, or grab the hue slider and mix your own accent.
              Watch the code: only the values change. The structure never moves.
            </p>
          </header>

          <div className="mt-10">
            <StationPaint />
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
