"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

type Direction = "row" | "column";
type Justify = "flex-start" | "center" | "space-between" | "flex-end";
type Align = "flex-start" | "center" | "flex-end";

const JUSTIFY_LABELS: Record<Justify, string> = {
  "flex-start": "Bow",
  center: "Midships",
  "space-between": "Spread",
  "flex-end": "Stern",
};

const ALIGN_LABELS: Record<Align, string> = {
  "flex-start": "Deck",
  center: "Amidlevel",
  "flex-end": "Keel",
};

const CRATES = [
  { label: "A", h: 44 },
  { label: "B", h: 64 },
  { label: "C", h: 52 },
  { label: "D", h: 76 },
];

export function StationCargo() {
  const [direction, setDirection] = useState<Direction>("row");
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("flex-start");
  const [gap, setGap] = useState(12);
  const [active, setActive] = useState<string | null>(null);

  const lines = [
    { text: ".hold {" },
    { text: "  display: flex;", id: "flex" },
    { text: `  flex-direction: ${direction};`, id: "direction" },
    { text: `  justify-content: ${justify};`, id: "justify" },
    { text: `  align-items: ${align};`, id: "align" },
    { text: `  gap: ${gap}px;`, id: "gap" },
    { text: "}" },
  ];

  const group = (id: string) =>
    cn(
      "rounded-md border p-3 transition-colors",
      active === id ? "border-gold-light bg-card/70" : "border-border",
    );

  return (
    <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <div>
        <CodeBlock
          title="cargo.css — one word moves every crate"
          lines={lines}
          activeId={active}
          onActivate={setActive}
        />
        <div className="mt-4 space-y-3">
          <div
            className={group("direction")}
            onMouseEnter={() => setActive("direction")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              flex-direction — which way the hold runs
            </span>
            <div className="mt-2 flex gap-2">
              {(["row", "column"] as Direction[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  aria-pressed={direction === d}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                    direction === d
                      ? "border-brass bg-primary text-primary-foreground"
                      : "border-border text-sage hover:border-brass/60",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div
            className={group("justify")}
            onMouseEnter={() => setActive("justify")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              justify-content — packing along the run
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(JUSTIFY_LABELS) as Justify[]).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => setJustify(j)}
                  aria-pressed={justify === j}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                    justify === j
                      ? "border-brass bg-primary text-primary-foreground"
                      : "border-border text-sage hover:border-brass/60",
                  )}
                >
                  {JUSTIFY_LABELS[j]}
                </button>
              ))}
            </div>
          </div>

          <div
            className={group("align")}
            onMouseEnter={() => setActive("align")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              align-items — settling across the run
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(ALIGN_LABELS) as Align[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAlign(a)}
                  aria-pressed={align === a}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                    align === a
                      ? "border-brass bg-primary text-primary-foreground"
                      : "border-border text-sage hover:border-brass/60",
                  )}
                >
                  {ALIGN_LABELS[a]}
                </button>
              ))}
            </div>
          </div>

          <div
            className={group("gap")}
            onMouseEnter={() => setActive("gap")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              gap — air between crates · {gap}px
            </span>
            <input
              type="range"
              min={0}
              max={32}
              step={4}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--brass)]"
              aria-label="Gap between crates"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
          The hold — live
        </p>
        <div
          className={cn(
            "mt-2 h-[340px] overflow-hidden rounded-md border-2 p-3 transition-colors",
            active === "flex" ? "border-gold-light" : "border-brass/40",
          )}
          style={{
            display: "flex",
            flexDirection: direction,
            justifyContent: justify,
            alignItems: align,
            gap,
            background: "#241A12",
          }}
          onMouseEnter={() => setActive("flex")}
          onMouseLeave={() => setActive(null)}
        >
          {CRATES.map((crate) => (
            <div
              key={crate.label}
              className="grid shrink-0 place-items-center rounded-sm border-2 border-brass/60 bg-mahogany font-display text-lg font-bold text-gold-light transition-all"
              style={{
                width: direction === "row" ? "min(64px, 17%)" : "min(120px, 60%)",
                height: crate.h,
              }}
            >
              {crate.label}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sage">
          Four crates, zero positioning math. The hold decides everything from
          four words — hover any control and the line of CSS it owns lights up,
          and the other way around.
        </p>
      </div>
    </div>
  );
}
