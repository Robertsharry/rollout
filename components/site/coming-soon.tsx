import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { DiscordButton } from "@/components/site/discord-button";
import { Container, Section } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  phase: string;
}

export function ComingSoon({
  title,
  blurb,
  icon: Icon,
  accent,
  phase,
}: ComingSoonProps) {
  return (
    <Section spacing="lg" className="grid min-h-[78vh] place-items-center">
      <Container className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: accent }}
        />
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span
            className="glass grid size-16 place-items-center rounded-2xl"
            style={{ color: accent }}
          >
            <Icon className="size-8" />
          </span>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs tracking-[0.18em] text-foreground/85 uppercase">
            <span
              className="size-1.5 rounded-full animate-pulse-glow"
              style={{ background: accent }}
            />
            Opening in {phase}
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base text-balance text-muted-foreground md:text-lg">
            {blurb}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DiscordButton />
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
            >
              <ArrowLeft className="size-4" />
              Return to the foyer
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
