import { Anton } from "next/font/google";
import { Link } from "next-view-transitions";

import { DiscordButton } from "@/components/site/discord-button";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

export const metadata = buildMetadata({
  title: "UFC — The Sporting Club",
  description:
    "Fight breakdowns, card predictions, technique guides, and the UFC 6 game hub. The sporting club deck of the Rollout gaming house.",
  path: "/ufc",
  keywords: ["UFC fight breakdowns", "UFC predictions", "UFC 6 game", "MMA technique guides"],
});

interface TapeRow {
  left: string;
  right: string;
}

const TAPE: TapeRow[] = [
  { left: "Fight breakdowns", right: "Card predictions" },
  { left: "Technique guides", right: "Live results talk" },
  { left: "Ranked debates", right: "Watch party calls" },
];

export default function UfcPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "UFC", path: "/ufc" },
        ])}
      />
      <Section spacing="lg" className="grid min-h-[88vh] place-items-center pt-28">
        <Container className="flex justify-center">
          {/* the fight poster, pinned up in the gaming house */}
          <article className="relative w-full max-w-2xl bg-[#F2E9D4] px-7 py-9 text-[#16130F] shadow-2xl sm:px-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-2.5 border border-[#16130F]/60"
            />

            <div className="relative text-center">
              <p className="text-[11px] font-bold tracking-[0.32em] uppercase">
                Rollout Athletic Commission presents
              </p>

              <h1
                className={cn(
                  anton.className,
                  "mt-4 text-7xl leading-[0.85] tracking-tight uppercase sm:text-8xl",
                )}
              >
                Fight
                <br />
                <span className="text-[#C2261B]">Night</span>
              </h1>

              <div className="mt-5 inline-block -skew-x-12 bg-[#C2261B] px-5 py-1.5">
                <p className="skew-x-12 text-xs font-bold tracking-[0.22em] text-[#F2E9D4] uppercase">
                  The sporting club · Opening in Phase 3
                </p>
              </div>

              <div className="mt-8 border-t-4 border-[#16130F] pt-4">
                <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
                  Tale of the tape
                </p>
                <div className="mt-3 space-y-2">
                  {TAPE.map((row) => (
                    <div
                      key={row.left}
                      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm font-semibold"
                    >
                      <span className="text-right">{row.left}</span>
                      <span aria-hidden className="h-4 w-0.5 bg-[#16130F]" />
                      <span className="text-left">{row.right}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-stretch justify-center">
                <div className="flex w-full max-w-md items-center gap-4 border-2 border-dashed border-[#8A6F2F] bg-[#C99B3F] px-5 py-4 text-left text-[#2A1F08]">
                  <div className="text-2xl" aria-hidden>
                    ✪
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-[0.24em] uppercase">
                      Admit one — UFC 6 game hub
                    </p>
                    <p className="mt-1 text-xs font-medium tracking-[0.08em] uppercase">
                      Roster ratings · Online tactics · Career talk
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-7 text-sm italic">
                Fight cards and fighter portraits will be pulled live from a
                stats API, so the posters always show the real matchups.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <DiscordButton label="Get fight night pings" />
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center border-2 border-[#16130F] px-6 text-sm font-bold tracking-[0.08em] text-[#16130F] uppercase transition-colors hover:bg-[#16130F] hover:text-[#F2E9D4]"
                >
                  Return to the foyer
                </Link>
              </div>

              <p className="mt-7 text-[11px] font-semibold tracking-[0.26em] uppercase">
                Saturday nights · Main card · The house never misses one
              </p>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}
