import { BookOpen, Map, Trophy, type LucideIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";

interface FeatureItem {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  tag: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "A field guide for every starter",
    desc: "Full walkthroughs from the specimen cabinet: movesets, evolutions, and the teams they fit.",
    href: "/pokemon",
    icon: BookOpen,
    tag: "Field guides",
  },
  {
    title: "A loadout for every Helldivers planet",
    desc: "Stratagem and weapon kits tuned to each biome, written to survive the drop.",
    href: "/helldivers",
    icon: Map,
    tag: "Outfitting",
  },
  {
    title: "Climb the house board",
    desc: "Post your best runs and scores. Earn your flair. Defend your seat against the squad.",
    href: "/leaderboard",
    icon: Trophy,
    tag: "Compete",
  },
];

export function Featured() {
  return (
    <Section>
      <Container>
        <SectionHeading
          kicker="House specialties"
          title="Less wiki. More edge."
          description="The stuff that actually makes you better, written by the people who play."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.href} delay={i * 0.08}>
                <Link
                  href={feature.href}
                  className="group glass flex h-full flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-white/20"
                >
                  <span className="font-mono text-xs tracking-[0.18em] text-gold-light uppercase">
                    {feature.tag}
                  </span>
                  <Icon className="mt-4 size-7 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <h3 className="mt-4 font-display text-lg font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                  <span className="mt-auto pt-5 text-sm font-medium text-brass">
                    Right this way <span aria-hidden>☞</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
