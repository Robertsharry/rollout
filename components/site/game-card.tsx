import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";

import type { Game } from "@/lib/site";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className }: GameCardProps) {
  const Icon = game.icon;

  return (
    <Link
      href={`/${game.slug}`}
      style={{ "--accent": game.accent } as React.CSSProperties}
      className={cn(
        "group glass relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20",
        className,
      )}
    >
      {/* corner accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
        style={{ background: "var(--accent)" }}
      />
      {/* top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklch, var(--accent) 70%, transparent), transparent)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <span
          className="grid size-12 place-items-center rounded-xl border"
          style={{
            background: "color-mix(in oklch, var(--accent) 14%, transparent)",
            borderColor: "color-mix(in oklch, var(--accent) 35%, transparent)",
            color: "var(--accent)",
          }}
        >
          <Icon className="size-6" />
        </span>
        <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <h3 className="relative mt-5 font-display text-xl font-bold tracking-tight">
        {game.name}
      </h3>
      <p className="relative mt-2 text-sm text-muted-foreground">{game.blurb}</p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {game.highlights.map((h) => (
          <span
            key={h}
            className="rounded-full border border-border/70 bg-background/40 px-2.5 py-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
          >
            {h}
          </span>
        ))}
      </div>
    </Link>
  );
}
