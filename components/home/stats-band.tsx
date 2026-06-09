import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/site/section";
import { COMMUNITY_STATS } from "@/lib/site";

export function StatsBand() {
  return (
    <Section spacing="sm">
      <Container>
        <Reveal>
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
            {COMMUNITY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-card/30 px-6 py-8 text-center"
              >
                <div className="font-display text-4xl font-bold text-foreground md:text-5xl">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    compact={stat.value >= 1000}
                  />
                </div>
                <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
