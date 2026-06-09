import { Link } from "next-view-transitions";

import { Reveal } from "@/components/motion/reveal";
import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBand() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-16 text-center md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-neon/15 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-24 size-80 rounded-full bg-magenta/15 blur-[110px]"
            />
            <h2 className="relative font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Your squad is already inside.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              Jump into the Discord, claim your profile, and start posting. It’s
              free, it’s ours, and it’s built for the long haul.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <DiscordButton className="h-12 px-7 text-base" />
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 px-7 text-base",
                )}
              >
                Sign in with Discord
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
