"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

interface PosterProps {
  title: string;
  accent: string;
  line: string;
}

const STARTER: PosterProps[] = [
  { title: "Pokemon", accent: "#C9A14E", line: "Specimen Cabinet" },
  { title: "UFC", accent: "#D26464", line: "Sporting Club" },
  { title: "Helldivers", accent: "#9CA994", line: "Munitions Deck" },
];

const ACCENTS = [
  "#C9A14E",
  "#D26464",
  "#9CA994",
  "#8FB6D9",
  "#D27D4A",
];

const PART_LABELS: Record<string, string> = {
  definition: "function Poster(...) — the factory the cards are stamped from",
  "props-title": "title — the headline of THIS card",
  "props-accent": "accent — the colour of THIS card",
  "props-line": "line — the kicker line of THIS card",
};

export function StationParts() {
  const [posters, setPosters] = useState<PosterProps[]>(STARTER);
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const update = (idx: number, key: keyof PosterProps, value: string) => {
    setPosters((arr) =>
      arr.map((p, i) => (i === idx ? { ...p, [key]: value } : p)),
    );
  };

  const lines: CodeLine[] = [
    { text: "function Poster({ title, accent, line }) {", id: "definition" },
    { text: "  return (", id: "definition" },
    { text: '    <article className="card" style={{ borderColor: accent }}>', id: "definition" },
    { text: "      <p style={{ color: accent }}>{line}</p>", id: "definition" },
    { text: "      <h3>{title}</h3>", id: "definition" },
    { text: "    </article>", id: "definition" },
    { text: "  );", id: "definition" },
    { text: "}", id: "definition" },
    { text: "" },
    ...posters.flatMap((p, i): CodeLine[] => [
      { text: `<Poster`, id: `card:${i}` },
      { text: `  title="${p.title}"`, id: `card:${i}:title` },
      { text: `  accent="${p.accent}"`, id: `card:${i}:accent` },
      { text: `  line="${p.line}"`, id: `card:${i}:line` },
      { text: "/>", id: `card:${i}` },
    ]),
  ];

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id] ?? id,
  });

  const litCard = (i: number) =>
    active === `card:${i}` ||
    active === `card:${i}:title` ||
    active === `card:${i}:accent` ||
    active === `card:${i}:line`;

  const lit = (key: string) => active === key;

  const activeIds = (): string | string[] | null => {
    if (!active) return null;
    if (active.startsWith("card:") && !active.includes(":title") && !active.includes(":accent") && !active.includes(":line")) {
      const i = active.split(":")[1];
      return [active, `card:${i}:title`, `card:${i}:accent`, `card:${i}:line`];
    }
    return active;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="posters.tsx — one factory, three stampings"
          lines={lines}
          activeId={activeIds()}
          onActivate={hover}
        />

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {active
              ? PART_LABELS[active] ??
                (active.startsWith("card:")
                  ? "this usage of <Poster /> — its props become one card"
                  : "")
              : "Edit a prop on the right and watch only its card change. Same factory, different stampings."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {posters.map((p, i) => (
          <div
            key={i}
            {...partProps(`card:${i}`)}
            className={cn(
              "cursor-pointer rounded-md border-2 bg-card/40 p-4 transition-all",
              litCard(i) ? "ring-2 ring-gold-light" : "",
            )}
            style={{ borderColor: p.accent }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  {...partProps(`card:${i}:line`)}
                  className={cn(
                    "cursor-pointer font-mono text-[10px] tracking-[0.18em] uppercase transition-all",
                    lit(`card:${i}:line`) && "ring-2 ring-gold-light rounded-sm",
                  )}
                  style={{ color: p.accent }}
                >
                  {p.line}
                </p>
                <h3
                  {...partProps(`card:${i}:title`)}
                  className={cn(
                    "mt-1 cursor-pointer font-display text-xl font-bold transition-all",
                    lit(`card:${i}:title`) && "ring-2 ring-gold-light rounded-sm",
                  )}
                >
                  {p.title}
                </h3>
              </div>
              <div
                {...partProps(`card:${i}:accent`)}
                className={cn(
                  "size-8 shrink-0 cursor-pointer rounded-full border border-black/30 transition-all",
                  lit(`card:${i}:accent`) && "ring-2 ring-gold-light",
                )}
                style={{ background: p.accent }}
                aria-label={`accent colour: ${p.accent}`}
              />
            </div>

            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.12em] text-sage/70 uppercase">
                  title
                </span>
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  onFocus={() => hover(`card:${i}:title`)}
                  onBlur={() => hover(null)}
                  className="mt-1 w-full rounded-sm border border-border bg-background/60 px-2 py-1 font-mono text-xs text-foreground outline-none focus:border-brass"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.12em] text-sage/70 uppercase">
                  line
                </span>
                <input
                  type="text"
                  value={p.line}
                  onChange={(e) => update(i, "line", e.target.value)}
                  onFocus={() => hover(`card:${i}:line`)}
                  onBlur={() => hover(null)}
                  className="mt-1 w-full rounded-sm border border-border bg-background/60 px-2 py-1 font-mono text-xs text-foreground outline-none focus:border-brass"
                />
              </label>
            </div>

            <div className="mt-2">
              <span className="font-mono text-[10px] tracking-[0.12em] text-sage/70 uppercase">
                accent
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update(i, "accent", c)}
                    onMouseEnter={() => hover(`card:${i}:accent`)}
                    onMouseLeave={() => hover(null)}
                    aria-pressed={p.accent === c}
                    aria-label={`set accent to ${c}`}
                    className={cn(
                      "size-5 rounded-full border border-black/30 transition-all",
                      p.accent === c && "ring-2 ring-foreground/50",
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        <p className="text-sm leading-relaxed text-sage">
          Three cards, one component. The Poster function is the factory; the
          props are the slip of paper you hand it for each stamping. Every
          card, button, and badge on this site is built this way — one
          factory, dozens of stampings.
        </p>
      </div>
    </div>
  );
}
