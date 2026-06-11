"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const SPECIMENS = ["№001", "№004", "№007", "№152", "№155", "№158"];

export function StationBerth() {
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(12);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const lines = [
    { text: ".cabinet {" },
    { text: "  display: grid;", id: "grid" },
    { text: `  grid-template-columns: repeat(${cols}, 1fr);`, id: "cols" },
    { text: `  gap: ${gap}px;`, id: "gap" },
    { text: "}" },
    { text: "" },
    { text: featured ? ".featured {" : "/* .featured — toggled off */", id: "span" },
    {
      text: featured ? "  grid-column: span 2;" : "/* grid-column: span 2; */",
      id: "span",
    },
    { text: featured ? "}" : "" },
  ];

  const group = (id: string) =>
    cn(
      "rounded-md border p-3 transition-colors",
      active === id ? "border-gold-light bg-card/70" : "border-border",
    );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="cabinet.css — the berth chart"
          lines={lines}
          activeId={active}
          onActivate={setActive}
        />
        <div className="mt-4 space-y-3">
          <div
            className={group("cols")}
            onMouseEnter={() => setActive("cols")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              Columns on the chart · {cols}
            </span>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--brass)]"
              aria-label="Number of columns"
            />
          </div>
          <div
            className={group("gap")}
            onMouseEnter={() => setActive("gap")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              Gap between berths · {gap}px
            </span>
            <input
              type="range"
              min={4}
              max={28}
              step={4}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--brass)]"
              aria-label="Gap between cells"
            />
          </div>
          <div
            className={group("span")}
            onMouseEnter={() => setActive("span")}
            onMouseLeave={() => setActive(null)}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
              The featured berth
            </span>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setFeatured((v) => !v)}
                aria-pressed={featured}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                  featured
                    ? "border-brass bg-primary text-primary-foreground"
                    : "border-border text-sage hover:border-brass/60",
                )}
              >
                {featured ? "Specimen №001 spans two berths" : "Give №001 a double berth"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
          The cabinet — live
        </p>
        <div
          className={cn(
            "relative mt-2 rounded-md border-2 p-3 transition-colors",
            active === "grid" ? "border-gold-light" : "border-brass/40",
          )}
          style={{ background: "#241A12" }}
          onMouseEnter={() => setActive("grid")}
          onMouseLeave={() => setActive(null)}
        >
          {/* column guides flash when the columns line is hovered */}
          {active === "cols" ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 grid"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}
            >
              {Array.from({ length: cols }, (_, i) => (
                <div key={i} className="rounded-sm border border-dashed border-gold-light/60" />
              ))}
            </div>
          ) : null}

          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}
          >
            {SPECIMENS.map((label, i) => (
              <div
                key={label}
                onMouseEnter={
                  i === 0 && featured ? () => setActive("span") : undefined
                }
                onMouseLeave={i === 0 && featured ? () => setActive(null) : undefined}
                className={cn(
                  "rounded-sm border bg-card/60 px-2 py-5 text-center transition-all",
                  i === 0 && featured
                    ? "border-gold-light"
                    : "border-brass/40",
                  i === 0 && featured && active === "span" && "bg-card",
                )}
                style={
                  i === 0 && featured && cols > 1
                    ? { gridColumn: "span 2" }
                    : undefined
                }
              >
                <span className="font-display text-xs font-semibold tracking-[0.18em] text-gold-light uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sage">
          This is exactly how the real specimen cabinet lays out its drawers.
          Hover the columns line and the chart shows its pencil marks; give
          №001 the double berth and the whole chart reflows around it.
        </p>
      </div>
    </div>
  );
}
