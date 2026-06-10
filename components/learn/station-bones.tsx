"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const LINES: CodeLine[] = [
  { text: '<figure class="stage">', id: "stage" },
  { text: '  <div class="marquee">Now showing…</div>', id: "marquee" },
  { text: '  <div class="screen">', id: "screen" },
  { text: '    <iframe src="…the reel…" />', id: "iframe" },
  { text: '    <div class="curtain left"></div>', id: "curtains" },
  { text: '    <div class="curtain right"></div>', id: "curtains" },
  { text: '    <div class="valance"></div>', id: "valance" },
  { text: "  </div>", id: "screen" },
  { text: "  <figcaption>Reel courtesy of…</figcaption>", id: "caption" },
  { text: "</figure>", id: "stage" },
];

const PART_LABELS: Record<string, string> = {
  stage: "<figure> — the whole stage",
  marquee: "<div> — the marquee",
  screen: "<div> — the screen box",
  iframe: "<iframe> — the picture",
  curtains: "two <div>s — the velvet",
  valance: "<div> — the valance",
  caption: "<figcaption> — the credit",
};

const SCREEN_CHILDREN = new Set(["iframe", "curtains", "valance"]);

const VELVET =
  "repeating-linear-gradient(90deg, #571E22 0px, #6E262B 6px, #87333A 12px, #6E262B 18px, #571E22 24px)";

export function StationBones() {
  const [active, setActive] = useState<string | null>(null);

  const lit = (id: string) =>
    active === id || (active === "stage" && id !== "stage");
  const childGlow = (id: string) =>
    active === "screen" && SCREEN_CHILDREN.has(id);

  const part = (id: string, className: string, children?: React.ReactNode) => (
    <button
      type="button"
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(id)}
      onBlur={() => setActive(null)}
      onClick={() => setActive(active === id ? null : id)}
      aria-label={PART_LABELS[id]}
      className={cn(
        "block cursor-pointer text-left transition-all duration-200",
        className,
        lit(id) && "ring-2 ring-gold-light",
        childGlow(id) && "ring-1 ring-gold-light/50",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CodeBlock
        title="theater/stage.tsx — simplified"
        lines={LINES}
        activeId={active}
        onActivate={setActive}
      />

      <div>
        {/* the live replica */}
        <div
          className={cn(
            "rounded-lg border border-brass/40 bg-[#241A12] p-3 transition-all",
            lit("stage") && active === "stage" && "ring-2 ring-gold-light",
          )}
          onMouseEnter={() => active === null && setActive(null)}
        >
          {part(
            "marquee",
            "w-full rounded-sm border border-brass/40 bg-[#2E2218] px-3 py-2 text-center font-display text-[10px] font-semibold tracking-[0.2em] text-gold-light uppercase",
            <>Now showing · the bones</>,
          )}

          <div
            className={cn(
              "relative mt-2 aspect-video overflow-hidden rounded-sm bg-[#070B08] transition-all",
              lit("screen") && "ring-2 ring-gold-light",
            )}
            onMouseEnter={() => setActive("screen")}
            onMouseLeave={() => setActive(null)}
          >
            {part(
              "iframe",
              "absolute inset-x-[26%] inset-y-[30%] grid place-items-center rounded-sm border border-dashed border-sage/50 bg-[#10241B] font-mono text-[10px] tracking-[0.14em] text-sage uppercase",
              <>the picture</>,
            )}
            {part("curtains", "absolute inset-y-0 left-0 w-[22%]")}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 w-[22%]",
                (lit("curtains") || childGlow("curtains")) && "ring-2 ring-gold-light",
              )}
              style={{ background: VELVET }}
            />
            {part("curtains", "absolute inset-y-0 right-0 w-[22%]")}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 w-[22%]",
                (lit("curtains") || childGlow("curtains")) && "ring-2 ring-gold-light",
              )}
              style={{ background: VELVET }}
            />
            {part(
              "valance",
              "absolute inset-x-0 top-0 h-[14%]",
              <span
                aria-hidden
                className="block h-full w-full"
                style={{ background: VELVET }}
              />,
            )}
          </div>

          {part(
            "caption",
            "mt-2 w-full px-1 font-mono text-[10px] tracking-[0.14em] text-sage uppercase",
            <>Reel courtesy of the engine room</>,
          )}
        </div>

        {/* readout */}
        <div className="mt-3 flex min-h-10 items-center rounded-md border border-border bg-card/50 px-4 py-2">
          <p className="font-mono text-xs tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active]
              : "Hover the code or the stage — each line of markup is a physical part."}
          </p>
        </div>
      </div>
    </div>
  );
}
