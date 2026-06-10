"use client";

import Image from "next/image";

import { posterUrl, type ProgramEntry } from "@/lib/theater";
import { GAMES } from "@/lib/site";
import { cn } from "@/lib/utils";

const GAME_NAMES: Record<string, string> = Object.fromEntries(
  GAMES.map((g) => [g.slug, g.name]),
);

interface PlaybillProps {
  program: ProgramEntry[];
  selectedId: string;
  filter: string;
  onFilter: (slug: string) => void;
  onSelect: (entry: ProgramEntry) => void;
}

const FILTERS = [{ slug: "all", label: "Full bill" }].concat(
  GAMES.map((g) => ({ slug: g.slug, label: g.name })),
);

export function Playbill({
  program,
  selectedId,
  filter,
  onFilter,
  onSelect,
}: PlaybillProps) {
  const visible =
    filter === "all" ? program : program.filter((e) => e.game === filter);

  return (
    <section aria-label="Tonight's program">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Tonight’s program
        </h2>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => onFilter(f.slug)}
              aria-pressed={filter === f.slug}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                filter === f.slug
                  ? "border-brass bg-primary text-primary-foreground"
                  : "border-border text-sage hover:border-brass/60 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry) => {
          const onStage = entry.id === selectedId;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              aria-pressed={onStage}
              className={cn(
                "group glass flex h-full flex-col overflow-hidden rounded-lg text-left transition-all duration-300 hover:-translate-y-1",
                onStage ? "border-brass" : "hover:border-brass/60",
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={posterUrl(entry.id)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 border border-brass/50 bg-[#241A12]/85 px-2 py-0.5 font-display text-[10px] font-semibold tracking-[0.2em] text-gold-light uppercase backdrop-blur">
                  {entry.act}
                </span>
                {onStage ? (
                  <span className="absolute top-2.5 right-2.5 border border-gold-light bg-primary px-2 py-0.5 font-display text-[10px] font-semibold tracking-[0.2em] text-primary-foreground uppercase">
                    On stage
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[11px] tracking-[0.14em] text-gold-light uppercase">
                  {GAME_NAMES[entry.game] ?? "The house"}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sage">
                  {entry.blurb}
                </p>
                <span className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-sm font-medium text-brass">
                    {onStage ? "Now seating" : "Take your seat"}{" "}
                    <span aria-hidden>☞</span>
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground/80 uppercase">
                    via {entry.channel}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
