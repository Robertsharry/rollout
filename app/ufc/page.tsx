import { Anton } from "next/font/google";
import { Link } from "next-view-transitions";

import { DiscordButton } from "@/components/site/discord-button";
import { JsonLd } from "@/components/site/json-ld";
import { Container, Section } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { FIGHT_CARD, UFC_GAME, type Bout } from "@/lib/ufc";
import { cn } from "@/lib/utils";

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

export const metadata = buildMetadata({
  title: `${FIGHT_CARD.event} Fight Card & UFC 6 — The Sporting Club`,
  description: `${FIGHT_CARD.event} at the White House: full fight card with ${FIGHT_CARD.bouts[0].red.name} vs ${FIGHT_CARD.bouts[0].blue.name}, plus EA Sports UFC 6 release details. Updated weekly by the house.`,
  path: "/ufc",
  keywords: [
    "UFC White House fight card",
    "UFC Freedom 250",
    "Topuria vs Gaethje",
    "EA Sports UFC 6 release date",
    "UFC 6 early access",
  ],
});

const INK = "#16130F";
const CREAM = "#F2E9D4";
const RED = "#C2261B";
const GOLD = "#C99B3F";

function CornerBlock({
  corner,
  side,
}: {
  corner: Bout["red"];
  side: "red" | "blue";
}) {
  return (
    <div className={cn("min-w-0", side === "red" ? "text-right" : "text-left")}>
      <p className="truncate font-display text-base font-bold tracking-tight sm:text-lg">
        {corner.name}
      </p>
      {corner.record ? (
        <p className="font-mono text-[11px] tracking-[0.12em] opacity-70">
          {corner.record}
        </p>
      ) : null}
    </div>
  );
}

function BoutRow({ bout, mainEvent }: { bout: Bout; mainEvent?: boolean }) {
  return (
    <div
      className={cn(
        "border-b border-dashed px-4 py-4 last:border-0 sm:px-6",
        mainEvent ? "border-[#16130F]/40 bg-[#16130F]/5" : "border-[#16130F]/30",
      )}
    >
      {mainEvent ? (
        <p className="mb-2 text-center font-mono text-[10px] font-bold tracking-[0.3em] uppercase">
          Main event
        </p>
      ) : null}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <CornerBlock corner={bout.red} side="red" />
        <div className="flex flex-col items-center gap-1">
          <span
            className={cn(
              anton.className,
              "uppercase",
              mainEvent ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
            )}
            style={{ color: RED }}
          >
            VS
          </span>
          <span className="font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase opacity-80">
            {bout.weight}
          </span>
          {bout.title ? (
            <span
              className="px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em] whitespace-nowrap text-[#F2E9D4] uppercase"
              style={{ background: RED }}
            >
              {bout.title}
            </span>
          ) : null}
        </div>
        <CornerBlock corner={bout.blue} side="blue" />
      </div>
      {bout.note ? (
        <p className="mt-2 text-center text-xs italic opacity-75">{bout.note}</p>
      ) : null}
    </div>
  );
}

export default function UfcPage() {
  const [mainEvent, ...undercard] = FIGHT_CARD.bouts;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "UFC", path: "/ufc" },
        ])}
      />

      <Section spacing="none" className="pt-28 pb-24">
        <Container className="max-w-3xl space-y-8">
          {/* event poster */}
          <Reveal>
            <article
              className="relative px-7 py-9 shadow-2xl sm:px-10"
              style={{ background: CREAM, color: INK }}
            >
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
                    "mt-4 text-6xl leading-[0.85] tracking-tight uppercase sm:text-8xl",
                  )}
                >
                  Freedom
                  <br />
                  <span style={{ color: RED }}>250</span>
                </h1>
                <div
                  className="mt-5 inline-block -skew-x-12 px-5 py-1.5"
                  style={{ background: RED }}
                >
                  <p className="skew-x-12 text-xs font-bold tracking-[0.22em] text-[#F2E9D4] uppercase">
                    {FIGHT_CARD.subtitle}
                  </p>
                </div>
                <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed italic">
                  {FIGHT_CARD.storyline}
                </p>
                <div className="mt-5 flex flex-col items-center gap-1 font-mono text-[11px] tracking-[0.14em] uppercase">
                  <span>{FIGHT_CARD.date}</span>
                  <span>{FIGHT_CARD.venue}</span>
                  <span className="font-bold">{FIGHT_CARD.broadcast}</span>
                </div>
              </div>
            </article>
          </Reveal>

          {/* the card */}
          <Reveal>
            <article
              className="relative shadow-2xl"
              style={{ background: CREAM, color: INK }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-[#16130F] px-4 py-3 sm:px-6">
                <h2 className="text-sm font-bold tracking-[0.26em] uppercase">
                  The card — seven bouts
                </h2>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-70">
                  Set by the house · {FIGHT_CARD.updated}
                </span>
              </div>
              <BoutRow bout={mainEvent} mainEvent />
              {undercard.map((bout) => (
                <BoutRow key={`${bout.red.name}-${bout.blue.name}`} bout={bout} />
              ))}
              <p className="border-t border-[#16130F]/30 px-4 py-3 text-center font-mono text-[10px] tracking-[0.16em] uppercase opacity-70 sm:px-6">
                Records and bouts update weekly — cards change, the house keeps up
              </p>
            </article>
          </Reveal>

          {/* the game */}
          <Reveal>
            <article
              className="relative px-7 py-8 shadow-2xl sm:px-10"
              style={{ background: CREAM, color: INK }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2.5 border border-[#16130F]/60"
              />
              <div className="relative">
                <div
                  className="mx-auto flex w-fit items-center gap-3 border-2 border-dashed px-5 py-2"
                  style={{ borderColor: "#8A6F2F", background: GOLD, color: "#2A1F08" }}
                >
                  <span aria-hidden className="text-xl">
                    ✪
                  </span>
                  <p className="text-xs font-bold tracking-[0.24em] uppercase">
                    Admit one — {UFC_GAME.title}
                  </p>
                </div>

                <div className="mt-6 grid gap-2 text-center">
                  <p className={cn(anton.className, "text-2xl uppercase sm:text-3xl")}>
                    <span style={{ color: RED }}>{UFC_GAME.earlyAccess}</span>
                  </p>
                  <p className="font-mono text-xs tracking-[0.16em] uppercase">
                    {UFC_GAME.release}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {UFC_GAME.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="border border-[#16130F] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.14em] uppercase"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-center font-mono text-[11px] tracking-[0.1em] uppercase opacity-80">
                  Covers: {UFC_GAME.covers}
                </p>

                <ul className="mx-auto mt-5 max-w-md space-y-2 text-sm leading-relaxed">
                  {UFC_GAME.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 rotate-45"
                        style={{ background: RED }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-center text-xs italic opacity-75">
                  {UFC_GAME.fineprint}
                </p>
              </div>
            </article>
          </Reveal>

          {/* watch with the house */}
          <Reveal>
            <div className="flex flex-col items-center gap-4 pt-2 text-center">
              <p className="max-w-md text-sm leading-relaxed text-sage">
                The house never misses a card. The{" "}
                <Link
                  href="/videos"
                  className="text-brass underline underline-offset-4 hover:text-gold-light"
                >
                  Showboat Theater
                </Link>{" "}
                is running the Freedom 250 promo and the UFC 6 reveal right now,
                and the squad calls fights together in Discord.
              </p>
              <DiscordButton label="Join the watch party" />
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground/80 uppercase">
                Fighter portraits via live stats feed arrive with the full
                sporting club build
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
