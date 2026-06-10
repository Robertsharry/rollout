import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { GameCard } from "@/components/site/game-card";
import { Container, Section } from "@/components/site/section";
import { SectionHeading } from "@/components/site/section-heading";
import { GAMES } from "@/lib/site";

export function GamesGrid() {
  return (
    <Section id="games">
      <Container>
        <SectionHeading
          kicker="The gaming decks"
          title="Four tables. One house."
          description="Pick your table. Every deck is stocked with field guides, loadouts, and the regulars who main it."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game) => (
            <StaggerItem key={game.slug} className="h-full">
              <GameCard game={game} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
