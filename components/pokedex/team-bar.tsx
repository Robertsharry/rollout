"use client";

import Image from "next/image";
import { useState } from "react";
import { ClipboardCopy, X } from "lucide-react";

import {
  analyzeTeam,
  spriteUrl,
  TYPE_COLORS,
  type DexMon,
} from "@/lib/pokedex";
import { cn } from "@/lib/utils";

function TypeDot({ type }: { type: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2 rounded-full"
      style={{ background: TYPE_COLORS[type] ?? "#888" }}
    />
  );
}

interface TeamBarProps {
  team: DexMon[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function TeamBar({ team, onRemove, onClear }: TeamBarProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (team.length === 0) return null;

  const report = analyzeTeam(team);

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("team", team.map((m) => m.i).join(","));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard refused — the url bar still has it */
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl">
      {open ? (
        <div className="mb-2 max-h-[46vh] overflow-y-auto rounded-lg border border-brass/50 bg-[#1B3528] p-5 shadow-2xl">
          <h3 className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
            The house reads your squad
          </h3>

          <div className="mt-3 space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground">Weak spots</p>
              {report.weakSpots.length === 0 ? (
                <p className="mt-1 text-sage">
                  No attacking type hits more than one of you hard. Tidy.
                </p>
              ) : (
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {report.weakSpots.map((w) => (
                    <li
                      key={w.type}
                      className="flex items-center gap-1.5 rounded-full border border-oxblood-bright/50 bg-card/60 px-2.5 py-1 text-xs"
                    >
                      <TypeDot type={w.type} />
                      <span className="capitalize">{w.type}</span>
                      <span className="text-sage">
                        hits {w.count}
                        {w.worst >= 4 ? " · one takes 4x" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="font-medium text-foreground">Walls</p>
              {report.walls.length === 0 ? (
                <p className="mt-1 text-sage">
                  Nothing your squad shrugs off as a group yet.
                </p>
              ) : (
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {report.walls.map((w) => (
                    <li
                      key={w.type}
                      className="flex items-center gap-1.5 rounded-full border border-sage/50 bg-card/60 px-2.5 py-1 text-xs"
                    >
                      <TypeDot type={w.type} />
                      <span className="capitalize">{w.type}</span>
                      <span className="text-sage">{w.count} resist</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="font-medium text-foreground">Coverage gaps</p>
              {report.gaps.length === 0 ? (
                <p className="mt-1 text-sage">
                  Full coverage — somebody hits everything for double. The
                  table fears you.
                </p>
              ) : (
                <>
                  <p className="mt-1 text-xs text-sage">
                    Nobody on the squad hits these for double with their own
                    typing:
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-2">
                    {report.gaps.map((g) => (
                      <li
                        key={g}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs capitalize"
                      >
                        <TypeDot type={g} />
                        {g}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 rounded-lg border border-brass/60 bg-[#1B3528]/95 p-2.5 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-3 sm:p-3">
        <div className="flex items-center justify-center gap-1.5 sm:min-w-0 sm:flex-1 sm:justify-start sm:gap-2">
          {Array.from({ length: 6 }, (_, i) => {
            const mon = team[i];
            return mon ? (
              <button
                key={mon.i}
                type="button"
                onClick={() => onRemove(mon.i)}
                title={`${mon.n} — tap to release`}
                className="group relative size-10 shrink-0 rounded-md border border-brass/50 bg-card/60 transition-colors hover:border-oxblood-bright sm:size-11"
              >
                <Image
                  src={spriteUrl(mon.i)}
                  alt={mon.n}
                  width={44}
                  height={44}
                  className="pixelated"
                />
                <span className="absolute -top-1 -right-1 hidden size-4 place-items-center rounded-full bg-oxblood-bright text-[9px] text-white group-hover:grid">
                  <X className="size-2.5" />
                </span>
              </button>
            ) : (
              <span
                key={`empty-${i}`}
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-md border border-dashed border-border sm:size-11"
              >
                <span className="size-1.5 rotate-45 bg-brass/40" />
              </span>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={cn(
              "h-10 flex-1 rounded-md px-3 text-xs font-semibold transition-all sm:flex-initial sm:px-4 sm:text-sm",
              open
                ? "bg-primary text-primary-foreground"
                : "border border-brass/50 text-foreground hover:border-brass",
            )}
          >
            Coverage {open ? "▾" : "▴"}
          </button>
          <button
            type="button"
            onClick={copyLink}
            title="Copy a link to this squad"
            aria-label="Copy a link to this squad"
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-sage transition-colors hover:border-brass/60 hover:text-foreground"
          >
            {copied ? <span className="text-xs">✓</span> : <ClipboardCopy className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="h-10 rounded-md border border-border px-3 text-xs text-sage transition-colors hover:border-oxblood-bright/60 hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
