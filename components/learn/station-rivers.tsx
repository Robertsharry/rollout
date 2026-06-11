"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

type RuleId = "sm" | "md" | "lg";

const BOATS: { id: RuleId; name: string; width: number; note: string }[] = [
  { id: "sm", name: "Skiff", width: 420, note: "a phone" },
  { id: "md", name: "Packet", width: 700, note: "a tablet" },
  { id: "lg", name: "Steamer", width: 940, note: "a desk" },
];

function ruleFor(width: number): RuleId {
  if (width >= 820) return "lg";
  if (width >= 520) return "md";
  return "sm";
}

const CARDS = ["Pokémon", "UFC", "Arc Raiders", "Helldivers 2", "Theater", "Arcade"];

export function StationRivers() {
  const [width, setWidth] = useState(940);
  const activeRule = ruleFor(width);
  const cols = activeRule === "lg" ? 3 : activeRule === "md" ? 2 : 1;
  const boat = BOATS.find((b) => b.id === activeRule)!;

  const lines = [
    { text: "/* the skiff — every screen starts here */", id: "sm" },
    { text: ".deck { grid-template-columns: 1fr; }", id: "sm" },
    { text: "" },
    { text: "@media (min-width: 520px) { /* the packet */", id: "md" },
    { text: "  .deck { grid-template-columns: 1fr 1fr; }", id: "md" },
    { text: "}" },
    { text: "" },
    { text: "@media (min-width: 820px) { /* the steamer */", id: "lg" },
    { text: "  .deck { grid-template-columns: 1fr 1fr 1fr; }", id: "lg" },
    { text: "}" },
  ];

  // Hovering a rule in the code steers the river to that boat's width.
  const steerTo = (id: string | null) => {
    if (!id) return;
    const target = BOATS.find((b) => b.id === id);
    if (target) setWidth(target.width);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="deck.css — the rule in force lights up live"
          lines={lines}
          activeId={activeRule}
          onActivate={steerTo}
        />
        <div className="mt-4 rounded-md border border-border p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              The river · {width}px — riding the {boat.name.toLowerCase()} ({boat.note})
            </span>
          </div>
          <input
            type="range"
            min={320}
            max={960}
            step={10}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--brass)]"
            aria-label="Viewport width"
          />
          <div className="mt-2 flex gap-2">
            {BOATS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setWidth(b.width)}
                aria-pressed={activeRule === b.id}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                  activeRule === b.id
                    ? "border-brass bg-primary text-primary-foreground"
                    : "border-border text-sage hover:border-brass/60",
                )}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
          One deck, every boat — live
        </p>
        <div className="mt-2 overflow-x-auto rounded-md border-2 border-brass/40 bg-[#10130E] p-4">
          <div
            className="mx-auto rounded-sm border border-dashed border-sage/40 bg-[#241A12] p-3 transition-all duration-300"
            style={{ width: Math.min(width, 9999), maxWidth: "100%" }}
          >
            <div
              className="grid gap-2 transition-all"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {CARDS.map((card) => (
                <div
                  key={card}
                  className="rounded-sm border border-brass/40 bg-card/60 px-2 py-4 text-center"
                >
                  <span className="font-display text-[11px] font-semibold tracking-[0.14em] text-gold-light uppercase">
                    {card}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sage">
          Same six cards, no duplicated code — the deck redraws itself as the
          river widens. Drag the slider and watch the rule in force light up in
          the CSS; hover a rule and the river steers itself to that boat.
        </p>
      </div>
    </div>
  );
}
