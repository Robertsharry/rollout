"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

interface Livery {
  name: string;
  bg: string;
  surface: string;
  ink: string;
  accent: string;
}

const LIVERIES: Livery[] = [
  {
    name: "House standard",
    bg: "#163024",
    surface: "#1E3A2C",
    ink: "#EFE6CF",
    accent: "#C9A14E",
  },
  {
    name: "Midnight service",
    bg: "#10131A",
    surface: "#181D27",
    ink: "#E8ECF4",
    accent: "#8FB6D9",
  },
  {
    name: "Daylight run",
    bg: "#EFE6CF",
    surface: "#F7F1E0",
    ink: "#1B1611",
    accent: "#8A5A18",
  },
  {
    name: "Engine grease",
    bg: "#191512",
    surface: "#241E18",
    ink: "#EBDCC8",
    accent: "#D27D4A",
  },
];

export function StationPaint() {
  const [livery, setLivery] = useState<Livery>(LIVERIES[0]);
  const [hue, setHue] = useState<number | null>(null);
  const [touchingAccent, setTouchingAccent] = useState(false);

  const accent = hue === null ? livery.accent : `hsl(${hue} 52% 60%)`;

  const lines = [
    { text: ":root {" },
    { text: `  --background: ${livery.bg};`, id: "bg" },
    { text: `  --surface:    ${livery.surface};`, id: "surface" },
    { text: `  --ink:        ${livery.ink};`, id: "ink" },
    { text: `  --accent:     ${accent};`, id: "accent" },
    { text: "}" },
    { text: "" },
    { text: ".card {" },
    { text: "  background: var(--surface);", id: "surface" },
    { text: "  color: var(--ink);", id: "ink" },
    { text: "  border: 1px solid var(--accent);", id: "accent" },
    { text: "}" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="globals.css — one place to repaint"
          lines={lines}
          activeId={touchingAccent ? "accent" : null}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {LIVERIES.map((l) => (
            <button
              key={l.name}
              type="button"
              onClick={() => {
                setLivery(l);
                setHue(null);
              }}
              aria-pressed={livery.name === l.name && hue === null}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors",
                livery.name === l.name && hue === null
                  ? "border-brass bg-primary text-primary-foreground"
                  : "border-border text-sage hover:border-brass/60 hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className="size-3 rounded-full border border-black/20"
                style={{ background: l.accent }}
              />
              {l.name}
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
            Or mix your own accent — drag the hue
          </span>
          <input
            type="range"
            min={0}
            max={360}
            value={hue ?? 43}
            onChange={(e) => setHue(Number(e.target.value))}
            onPointerDown={() => setTouchingAccent(true)}
            onPointerUp={() => setTouchingAccent(false)}
            onBlur={() => setTouchingAccent(false)}
            className="mt-2 w-full accent-[var(--brass)]"
            aria-label="Accent hue"
          />
        </label>
      </div>

      {/* the live card being repainted */}
      <div
        className="flex items-center justify-center rounded-lg p-6 transition-colors duration-300"
        style={{ background: livery.bg }}
      >
        <div
          className="w-full max-w-xs rounded-md p-5 transition-colors duration-300"
          style={{
            background: livery.surface,
            color: livery.ink,
            border: `1px solid ${accent}`,
          }}
        >
          <div
            className="font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
            style={{ color: accent }}
          >
            Munitions deck
          </div>
          <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
            Helldivers 2
          </h3>
          <p className="mt-1.5 text-sm opacity-80">
            Loadouts for every planet, stratagem science, squad tactics.
          </p>
          <div
            className="mt-4 inline-block rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors duration-300"
            style={{ background: accent, color: livery.bg }}
          >
            Draw a requisition ☞
          </div>
          <div
            aria-hidden
            className="mt-4 h-px w-full transition-colors duration-300"
            style={{ background: accent, opacity: 0.4 }}
          />
          <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase opacity-60">
            One palette · every surface follows
          </p>
        </div>
      </div>
    </div>
  );
}
