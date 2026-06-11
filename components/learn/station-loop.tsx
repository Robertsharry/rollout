"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

interface Reel {
  id: string;
  title: string;
}

const STARTER: Reel[] = [
  { id: "welcome", title: "Captain's welcome" },
  { id: "arcade", title: "Penny arcade tour" },
  { id: "piano", title: "Saloon piano" },
];

const CANDIDATES = [
  "Helldivers debrief",
  "Pokemon top five",
  "Arc Raiders dropzone",
  "Saturday fight card",
  "Engine room tour",
];

const PART_LABELS: Record<string, string> = {
  array: "the REELS array — the list of data",
  map: ".map() — runs once per item, returns the new shape",
  output: "the <ul> the browser actually draws",
};

export function StationLoop() {
  const [reels, setReels] = useState<Reel[]>(STARTER);
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const addReel = () => {
    const pool = CANDIDATES.filter(
      (c) => !reels.some((r) => r.title === c),
    );
    if (pool.length === 0) return;
    const title = pool[reels.length % pool.length];
    const id = title.toLowerCase().replace(/\s+/g, "-");
    setReels((r) => [...r, { id, title }]);
  };

  const removeReel = (id: string) => {
    setReels((r) => r.filter((reel) => reel.id !== id));
  };

  const lines: CodeLine[] = [
    { text: "const REELS = [", id: "array" },
    ...reels.flatMap((r): CodeLine[] => [
      { text: `  { id: "${r.id}", title: "${r.title}" },`, id: `item:${r.id}` },
    ]),
    { text: "];", id: "array" },
    { text: "" },
    { text: "function Playbill() {", id: "map" },
    { text: "  return (", id: "map" },
    { text: "    <ul>", id: "output" },
    { text: "      {REELS.map((reel) => (", id: "map" },
    { text: "        <li key={reel.id}>", id: "map" },
    { text: "          {reel.title}", id: "map" },
    { text: "        </li>", id: "map" },
    { text: "      ))}", id: "map" },
    { text: "    </ul>", id: "output" },
    { text: "  );", id: "map" },
    { text: "}", id: "map" },
  ];

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id] ?? `reel: ${id.replace("item:", "")}`,
  });

  const lit = (id: string) => active === id;
  const ring = (id: string) =>
    lit(id) || (active === "map" && id.startsWith("item:")) || (active === "output" && id.startsWith("item:"))
      ? "ring-2 ring-gold-light"
      : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <div>
        <CodeBlock
          title="playbill.tsx — data on top, one .map() does the rest"
          lines={lines}
          activeId={
            active === "map"
              ? [
                  "map",
                  ...reels.map((r) => `item:${r.id}`),
                ]
              : active === "output"
                ? ["output", ...reels.map((r) => `item:${r.id}`)]
                : active
          }
          onActivate={hover}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addReel}
            disabled={
              CANDIDATES.filter((c) => !reels.some((r) => r.title === c))
                .length === 0
            }
            className="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add a reel <span aria-hidden>＋</span>
          </button>
          <button
            type="button"
            onClick={() => setReels(STARTER)}
            className="rounded-md border border-border bg-card/60 px-3.5 py-2 text-sm font-medium text-sage transition-all hover:border-brass/60 hover:text-foreground"
          >
            Reset the playbill
          </button>
        </div>

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active] ??
                (active.startsWith("item:")
                  ? "this entry in the array becomes this item in the list"
                  : "")
              : "Add a reel — the array grows by one, the .map() runs once more, the list rewrites itself."}
          </p>
        </div>
      </div>

      <div>
        <div
          {...partProps("output")}
          className={cn(
            "cursor-pointer rounded-md border border-brass/40 bg-card/40 p-4 transition-all",
            lit("output") && "ring-2 ring-gold-light",
          )}
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
            Tonight&apos;s playbill — &lt;ul&gt;
          </p>
          <ul className="mt-3 space-y-2">
            {reels.map((r) => (
              <li
                key={r.id}
                {...partProps(`item:${r.id}`)}
                className={cn(
                  "group flex cursor-pointer items-center justify-between gap-3 rounded-sm border border-border bg-card/60 px-3 py-2 transition-all",
                  ring(`item:${r.id}`),
                )}
              >
                <span className="font-display text-sm font-semibold text-foreground/95">
                  {r.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReel(r.id);
                  }}
                  aria-label={`Remove ${r.title}`}
                  className="font-mono text-[11px] tracking-[0.1em] text-oxblood-bright/70 uppercase opacity-60 transition-opacity hover:opacity-100"
                >
                  remove ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-sage">
          The list on the right is not three rows of handwritten markup. It is
          one line of code that runs once per entry in the array. Add a reel,
          take a reel away — the same .map() rewrites the whole list. That
          single trick is how every playbill, every leaderboard, every guide
          index on this site is laid out.
        </p>
      </div>
    </div>
  );
}
