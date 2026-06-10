import { Heart } from "lucide-react";

import { openLedger } from "@/app/donate/actions";
import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { isStripeConfigured, isStripeTestMode } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Patrons' Ledger — Support the House",
  description:
    "Keep the Rollout gaming house steaming: one time or monthly patronage through secure Stripe checkout. No ads, ever — the patrons keep the lights on.",
  path: "/donate",
});

interface UpkeepRow {
  item: string;
  note: string;
}

const UPKEEP: UpkeepRow[] = [
  { item: "Servers & steam", note: "hosting, database, the boilers" },
  { item: "The Showboat Theater", note: "reels curated, stage lit" },
  { item: "The Penny Arcade", note: "three cabinets, free forever" },
  { item: "No ads, ever", note: "patrons keep it that way" },
];

interface PresetRank {
  amount: number;
  rank: string;
}

const PRESETS: PresetRank[] = [
  { amount: 5, rank: "Deckhand" },
  { amount: 10, rank: "Stoker" },
  { amount: 25, rank: "Quartermaster" },
  { amount: 50, rank: "Pilot" },
];

interface DonatePageProps {
  searchParams: Promise<{ trouble?: string; canceled?: string }>;
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const params = await searchParams;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Patrons' Ledger", path: "/donate" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-10">
        <Container>
          <SectionHeading
            align="center"
            kicker="Deck 1 · The Patrons' Ledger"
            title="Keep her steaming."
            description="The house runs on patronage, not advertising. Every figure in the ledger keeps the guides free, the theater lit, and the arcade humming for the whole squad."
          />

          {isStripeTestMode ? (
            <p className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
                <span aria-hidden className="size-1.5 rotate-45 bg-gold-light" />
                Practice mode — no real charges until launch
              </span>
            </p>
          ) : null}

          {params.canceled ? (
            <p className="mx-auto mt-6 max-w-md rounded-md border border-border bg-card/60 px-4 py-3 text-center text-sm text-sage">
              No harm done — the ledger keeps. Come back any time.
            </p>
          ) : null}
          {params.trouble ? (
            <p className="mx-auto mt-6 max-w-md rounded-md border border-oxblood-bright/50 bg-card/60 px-4 py-3 text-center text-sm text-sage">
              The ledger line is busy. Give it another try in a moment, and flag
              the crew in Discord if it keeps up.
            </p>
          ) : null}
        </Container>
      </Section>

      <Section spacing="sm" className="pb-24">
        <Container className="max-w-4xl">
          {!isStripeConfigured ? (
            <div className="glass mx-auto max-w-md rounded-lg p-8 text-center">
              <Heart className="mx-auto size-8 text-oxblood-bright" />
              <h2 className="mt-4 font-display text-xl font-bold">
                The ledger opens soon
              </h2>
              <p className="mt-2 text-sm text-sage">
                The house is still setting up the till. Until then, the best
                support is showing up.
              </p>
              <div className="mt-6 flex justify-center">
                <DiscordButton />
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
              {/* the ledger of upkeep */}
              <Reveal>
                <div className="bg-[#F2E9D4] p-6 text-[#1B1611]">
                  <p className="border-b border-[#1B1611] pb-2 font-mono text-[11px] tracking-[0.2em] uppercase">
                    Ledger of upkeep
                  </p>
                  <dl className="mt-4 space-y-3 font-mono text-[13px]">
                    {UPKEEP.map((row) => (
                      <div key={row.item}>
                        <div className="flex items-baseline gap-2">
                          <dt className="shrink-0 font-semibold">{row.item}</dt>
                          <span
                            aria-hidden
                            className="grow border-b border-dotted border-[#1B1611]/60"
                          />
                          <dd className="shrink-0">✓</dd>
                        </div>
                        <p className="mt-0.5 text-[11px] tracking-[0.06em] opacity-70">
                          {row.note}
                        </p>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 border-t border-dashed border-[#1B1611]/50 pt-3 text-xs italic">
                    Stripe handles every card. The house never sees the numbers
                    — only the kindness.
                  </p>
                </div>
              </Reveal>

              {/* giving options */}
              <div className="space-y-6">
                {/* the open ledger — patron names the figure */}
                <Reveal>
                  <form
                    action={openLedger}
                    className="glass rounded-lg border-gold-light/50 p-6"
                  >
                    <input type="hidden" name="kind" value="house" />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl font-bold">
                          The open ledger
                        </h2>
                        <p className="mt-1.5 text-sm text-sage">
                          Name your own figure on the next page. The house
                          writes it down with gratitude.
                        </p>
                      </div>
                      <span className="shrink-0 border border-gold-light/60 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-gold-light uppercase">
                        House choice
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:brightness-110"
                    >
                      <Heart className="size-4" />
                      Open the ledger
                    </button>
                  </form>
                </Reveal>

                {/* crew ranks — one time */}
                <Reveal>
                  <div className="glass rounded-lg p-6">
                    <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                      One time — pick your rank
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {PRESETS.map((preset) => (
                        <form key={preset.amount} action={openLedger}>
                          <input type="hidden" name="kind" value="amount" />
                          <input
                            type="hidden"
                            name="amount"
                            value={preset.amount}
                          />
                          <button
                            type="submit"
                            className="w-full rounded-md border border-brass/50 bg-card/40 px-3 py-3 text-center transition-colors hover:border-brass hover:bg-card"
                          >
                            <span className="block font-display text-lg font-bold text-gold-light">
                              ${preset.amount}
                            </span>
                            <span className="block font-mono text-[10px] tracking-[0.14em] text-sage uppercase">
                              {preset.rank}
                            </span>
                          </button>
                        </form>
                      ))}
                    </div>
                    <form
                      action={openLedger}
                      className="mt-4 flex items-center gap-3"
                    >
                      <input type="hidden" name="kind" value="amount" />
                      <label className="flex h-11 flex-1 items-center gap-2 rounded-md border border-border bg-background/40 px-3 focus-within:border-brass">
                        <span className="font-display text-gold-light">$</span>
                        <input
                          type="number"
                          name="amount"
                          min={1}
                          max={999}
                          step={1}
                          required
                          placeholder="Your figure"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                        />
                      </label>
                      <button
                        type="submit"
                        className="h-11 shrink-0 rounded-md border border-brass/50 px-5 text-sm font-semibold transition-colors hover:border-brass hover:bg-card"
                      >
                        Give
                      </button>
                    </form>
                  </div>
                </Reveal>

                {/* monthly patronage */}
                <Reveal>
                  <div className="glass rounded-lg p-6">
                    <h2 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
                      Monthly — crew of the house
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          amount: 5,
                          name: "Crew",
                          note: "A hand on deck, every month",
                        },
                        {
                          amount: 15,
                          name: "Boiler Club",
                          note: "First in line when plaques arrive",
                        },
                      ].map((tier) => (
                        <form key={tier.amount} action={openLedger}>
                          <input type="hidden" name="kind" value="monthly" />
                          <input
                            type="hidden"
                            name="amount"
                            value={tier.amount}
                          />
                          <button
                            type="submit"
                            className="w-full rounded-md border border-brass/50 bg-card/40 p-4 text-left transition-colors hover:border-brass hover:bg-card"
                          >
                            <span className="flex items-baseline justify-between">
                              <span className="font-display text-lg font-bold">
                                {tier.name}
                              </span>
                              <span className="font-mono text-sm text-gold-light">
                                ${tier.amount}/mo
                              </span>
                            </span>
                            <span className="mt-1 block text-xs text-sage">
                              {tier.note}
                            </span>
                          </button>
                        </form>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-sage">
                      Cancel any time from your Stripe receipt — no questions,
                      no guilt, the house pours you one on the way out.
                    </p>
                  </div>
                </Reveal>

                <p className="text-center font-mono text-[11px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                  Signed in patrons get their plaque on the ledger wall when it
                  opens in Phase 2
                </p>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
