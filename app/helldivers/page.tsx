import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { FRONTS, KNOWN_THEATERS, type Requisition } from "@/lib/helldivers";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Helldivers 2 Loadouts by Front & Planet — The Munitions Deck",
  description:
    "House standard Helldivers 2 loadouts for the Terminid, Automaton, and Illuminate fronts — requisition slips with primaries, stratagems, armor passives, and planet notes for Hellmire, Malevelon Creek, and more.",
  path: "/helldivers",
  keywords: [
    "helldivers 2 loadouts",
    "helldivers 2 best loadout",
    "helldivers 2 terminid loadout",
    "helldivers 2 automaton loadout",
    "helldivers 2 stratagems",
  ],
});

const DOCTRINE = [
  {
    rule: "One answer to armor, one to crowds, one way out.",
    detail:
      "Every slip below carries all three. If your custom kit cannot name them, it is not a kit — it is a donation to the enemy.",
  },
  {
    rule: "Match the passive to the front.",
    detail:
      "Fortified against rockets, Medic against swarms, Engineering when grenades are your plan. Armor passives are the quietest stat in the game and the most felt.",
  },
  {
    rule: "The squad carries sixteen slots, not four.",
    detail:
      "Overlap is waste. Two anti tank players is a plan; four is a vigil. Call your slots in the Discord before you drop.",
  },
];

function RequisitionSlip({ slip }: { slip: Requisition }) {
  return (
    <article className="relative bg-[#F2E9D4] p-6 text-[#1B1611] sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 border border-[#1B1611]/50"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 border-b border-[#1B1611] pb-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase">
              Requisition №{slip.number}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
              {slip.name}
            </h3>
          </div>
          <span className="shrink-0 border border-[#5E2426] px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-[#5E2426] uppercase">
            {slip.role}
          </span>
        </div>

        <dl className="mt-4 space-y-1.5 font-mono text-[13px]">
          {[
            ["Primary", slip.primary],
            ["Secondary", slip.secondary],
            ["Grenade", slip.grenade],
            ["Armor", slip.armor],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-2">
              <dt className="shrink-0 tracking-[0.1em] uppercase">{label}</dt>
              <span
                aria-hidden
                className="grow border-b border-dotted border-[#1B1611]/60"
              />
              <dd className="shrink-0 text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 font-mono text-[11px] tracking-[0.18em] uppercase">
          Stratagems
        </p>
        <ul className="mt-1.5 grid grid-cols-1 gap-x-4 gap-y-1 font-mono text-[13px] sm:grid-cols-2">
          {slip.stratagems.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 shrink-0 rotate-45 bg-[#5E2426]" />
              {s}
            </li>
          ))}
        </ul>

        <p className="mt-5 border-t border-dashed border-[#1B1611]/50 pt-4 text-sm leading-relaxed">
          <span className="font-semibold">Why it holds: </span>
          {slip.whyItHolds}
        </p>
        <p className="mt-3 text-sm leading-relaxed italic">{slip.fieldNote}</p>

        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-70">
            Compounded by the house outfitters
          </p>
          <span className="inline-block -rotate-6 border-2 border-[#4A5D3A] px-2 py-0.5 font-display text-[10px] font-bold tracking-[0.2em] text-[#4A5D3A] uppercase">
            House approved
          </span>
        </div>
      </div>
    </article>
  );
}

export default function HelldiversPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Helldivers 2", path: "/helldivers" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Munitions deck · Requisitions"
            title="Drop with the right paper."
            description="House standard kits for every front, written as requisition slips and signed by people who actually dive. Fundamentals first — this counter does not chase the weekly patch meta."
          />
          <p className="mt-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              <span aria-hidden className="size-1.5 rotate-45 bg-brass" />
              The live war table and per planet ledger arrive in Phase 3
            </span>
          </p>
        </Container>
      </Section>

      <Section spacing="none" className="pb-4">
        <Container>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {DOCTRINE.map((d) => (
              <StaggerItem key={d.rule}>
                <div className="glass h-full rounded-lg p-6">
                  <h2 className="font-display text-lg font-bold tracking-tight">
                    {d.rule}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-sage">
                    {d.detail}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {FRONTS.map((front) => (
        <Section key={front.slug} spacing="md" id={front.slug}>
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {front.title}
                </h2>
                <span className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
                  vs. the {front.enemy}
                </span>
              </div>
              <p className="mt-3 max-w-3xl leading-relaxed text-sage">
                {front.doctrine}
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {front.requisitions.map((slip) => (
                <Reveal key={slip.number}>
                  <RequisitionSlip slip={slip} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section spacing="md">
        <Container>
          <SectionHeading
            kicker="Known theaters"
            title="Planets with a reputation."
            description="Names the squad says with a certain tone. Planet by planet conditions change with the galactic war — these are the ones that earned a permanent note."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {KNOWN_THEATERS.map((t) => (
              <Reveal key={t.planet}>
                <div className="glass h-full rounded-lg p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-bold">{t.planet}</h3>
                    <span className="font-mono text-[11px] tracking-[0.12em] text-gold-light uppercase">
                      {t.front}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-sage">
                    {t.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-sage">
              Got a slip the counter should stock? Bring it to the squad.
            </p>
            <div className="mt-4 flex justify-center">
              <DiscordButton label="Call your slots in Discord" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
