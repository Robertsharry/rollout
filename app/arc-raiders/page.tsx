import { JsonLd } from "@/components/site/json-ld";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Arc Raiders Region Guides & Loadout Doctrine — The Cargo Hold",
  description:
    "Salvage manifests for every Arc Raiders region — Dam Battlegrounds, Buried City, and Spaceport — with ARC threat notes, kit doctrine, and extraction discipline from the Rollout house.",
  path: "/arc-raiders",
  keywords: [
    "arc raiders guide",
    "arc raiders loadout",
    "arc raiders dam battlegrounds",
    "arc raiders buried city",
    "arc raiders spaceport",
    "arc raiders enemies",
  ],
});

interface ThreatEntry {
  name: string;
  profile: string;
  counsel: string;
}

const THREAT_LEDGER: ThreatEntry[] = [
  {
    name: "Tick",
    profile: "Small skitterer that latches and detonates",
    counsel: "Swat it the moment you hear it. Never let one ride along.",
  },
  {
    name: "Wasp",
    profile: "Flying harasser, hunts in packs",
    counsel: "Controlled bursts. Panic spray is how packs win.",
  },
  {
    name: "Hornet",
    profile: "Heavier airborne gun platform",
    counsel: "Break line of sight, punish the strafe, relocate.",
  },
  {
    name: "Leaper",
    profile: "Closes distance in ugly arcs",
    counsel: "Keep a close range answer loaded. Always.",
  },
  {
    name: "Rocketeer",
    profile: "Walking artillery with patience",
    counsel: "Never trade in the open. Flank it or leave it.",
  },
  {
    name: "Bastion",
    profile: "Armored anchor unit",
    counsel: "Team fire or walk away. Solo heroics feed the machine.",
  },
  {
    name: "The Queen",
    profile: "The main event",
    counsel: "Full kit, full squad, and an exit you have already walked.",
  },
];

interface RegionManifest {
  number: string;
  region: string;
  character: string;
  route: string[];
  bring: string[];
  extract: string;
}

const MANIFESTS: RegionManifest[] = [
  {
    number: "C-01",
    region: "Dam Battlegrounds",
    character:
      "The wide open classic: long sightlines across the dam crest, cramped fights in the galleries beneath it. Most raids die in the transition between the two.",
    route: [
      "Work the edges first; the open crest is where rookies donate their kit.",
      "Interior galleries pay better and fight smaller — clear by sound, not by sight.",
      "Third parties hear every fight on the crest. Win fast or do not start.",
    ],
    bring: [
      "A long glass for the crest and a close answer for the galleries — this is the one region where carrying both is not greed.",
      "Mobility over plate. The dam punishes anyone too heavy to cross open ground between covers.",
      "One quiet weapon per squad. Loud is a billboard here.",
    ],
    extract:
      "Call your exit before the last fight, not after. The walk out over open concrete is the most honest gunfight in the game.",
  },
  {
    number: "C-02",
    region: "Buried City",
    character:
      "A city swallowed by sand: tight streets, collapsed interiors, rooftops that see everything. The best loot sits where the ARC patrol routes cross.",
    route: [
      "Rooftops are the highway; streets are the toll road. Travel high, loot low, leave fast.",
      "Interiors muffle sound — clear corners like you mean it.",
      "Wasp packs own the open plazas. Cross them sprinting or not at all.",
    ],
    bring: [
      "Close quarters first: shotgun class or a fast SMG kit. The city rarely gives you a fight past thirty meters.",
      "Grenades earn double here — collapsed rooms turn every doorway into a choke.",
      "Light armor, fast hands. The city rewards raiders who leave before the argument starts.",
    ],
    extract:
      "Extractions in the city echo. Assume every raider in the district heard your call and is walking your way with opinions.",
  },
  {
    number: "C-03",
    region: "Spaceport",
    character:
      "The richest ground and the most contested: huge facility interiors, vertical catwalks, and ARC presence that treats the place like home. High traffic, high pay.",
    route: [
      "The big halls are loot rich and ambush rich in equal measure. Take a wall, never the middle.",
      "Catwalks give vision and give you away — silhouette discipline matters.",
      "ARC patrols here hit harder and arrive faster. Budget ammunition for two fights you did not plan.",
    ],
    bring: [
      "The heaviest kit you can run honestly. Spaceport fights go long and reward staying power.",
      "An anchor: one squadmate built around a shield or a heavy gun changes every interior fight.",
      "Medical depth over snacks. You will be trading, not avoiding.",
    ],
    extract:
      "Everyone knows where the exits are, including the machines. Leave early or leave as a squad with a plan — there is no quiet door out of the Spaceport.",
  },
];

export default function ArcRaidersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Arc Raiders", path: "/arc-raiders" },
        ])}
      />

      <Section spacing="none" className="pt-32 pb-12">
        <Container>
          <SectionHeading
            align="center"
            kicker="Cargo hold · Salvage manifests"
            title="Go topside with a plan."
            description="Region briefs written like the cargo manifests they are: what the ground does, what to bring, and how to leave with it. Doctrine over shopping lists — named gear ledgers land with the wiki integration."
          />
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              The threat ledger
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-sage">
              The machines you will meet topside, and the house counsel on each.
              Pair this with the Know Your Enemy reel playing in the{" "}
              <a href="/videos" className="text-brass underline underline-offset-4">
                Showboat Theater
              </a>
              .
            </p>
          </Reveal>
          <Reveal className="mt-7">
            <div className="glass overflow-hidden rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/70">
                    <th className="px-4 py-3 text-left font-mono text-xs font-medium tracking-[0.14em] text-gold-light uppercase">
                      Unit
                    </th>
                    <th className="hidden px-4 py-3 text-left font-mono text-xs font-medium tracking-[0.14em] text-gold-light uppercase sm:table-cell">
                      Profile
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-medium tracking-[0.14em] text-gold-light uppercase">
                      House counsel
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {THREAT_LEDGER.map((threat) => (
                    <tr
                      key={threat.name}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-3 font-display font-bold whitespace-nowrap">
                        {threat.name}
                      </td>
                      <td className="hidden px-4 py-3 text-sage sm:table-cell">
                        {threat.profile}
                      </td>
                      <td className="px-4 py-3 text-foreground/90">
                        {threat.counsel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <SectionHeading
            kicker="Region manifests"
            title="Three grounds, three disciplines."
            description="Every region asks a different question. The manifest tells you what it is before the machines do."
          />
          <div className="mt-10 space-y-8">
            {MANIFESTS.map((manifest) => (
              <Reveal key={manifest.number}>
                <article className="glass overflow-hidden rounded-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brass/30 bg-card/70 px-6 py-3.5">
                    <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                      {manifest.region}
                    </h3>
                    <span className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
                      Manifest №{manifest.number}
                    </span>
                  </div>
                  <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr_1fr] sm:p-7">
                    <div>
                      <p className="leading-relaxed text-foreground/90">
                        {manifest.character}
                      </p>
                      <h4 className="mt-5 font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
                        Route counsel
                      </h4>
                      <ul className="mt-2.5 space-y-2 text-sm text-sage">
                        {manifest.route.map((r) => (
                          <li key={r} className="flex gap-2.5">
                            <span
                              aria-hidden
                              className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-brass"
                            />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
                        Bring
                      </h4>
                      <ul className="mt-2.5 space-y-2 text-sm text-sage">
                        {manifest.bring.map((b) => (
                          <li key={b} className="flex gap-2.5">
                            <span
                              aria-hidden
                              className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-brass"
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-border bg-background/40 p-5">
                      <h4 className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
                        Extraction discipline
                      </h4>
                      <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">
                        {manifest.extract}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-sage">
              Running topside tonight? The squad keeps a seat open.
            </p>
            <div className="mt-4 flex justify-center">
              <DiscordButton label="Find a squad in Discord" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
