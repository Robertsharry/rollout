"use client";

import { useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const PART_LABELS: Record<string, string> = {
  img: "<img> — the picture itself",
  alt: 'alt="…" — what a screen reader hears in place of the picture',
  src: 'src="…" — where the picture lives',
  button: "<button> — the lever",
  "aria-label": 'aria-label="…" — what a screen reader hears for an icon',
  icon: "♥ — a glyph carrying meaning a reader cannot see",
};

export function StationCredits() {
  const [altOn, setAltOn] = useState(true);
  const [ariaOn, setAriaOn] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  const hover = (id: string | null) => setActive(id);

  const imgLines: CodeLine[] = [
    { text: "<img" },
    { text: '  src="/poster.jpg"', id: "src" },
    altOn
      ? {
          text: '  alt="A captain at the helm of the S.S. Rollout at dusk"',
          id: "alt",
        }
      : { text: '  alt=""', id: "alt" },
    { text: "/>", id: "img" },
  ];

  const btnLines: CodeLine[] = [
    ariaOn
      ? { text: '<button aria-label="Donate to Rollout">', id: "aria-label" }
      : { text: "<button>", id: "button" },
    { text: "  ♥", id: "icon" },
    { text: "</button>", id: "button" },
  ];

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id],
  });

  const lit = (id: string) => active === id;
  const ring = (id: string) =>
    lit(id) ? "ring-2 ring-gold-light" : "";

  const altReadout = altOn
    ? "A captain at the helm of the S.S. Rollout at dusk"
    : "Image";
  const ariaReadout = ariaOn ? "Donate to Rollout, button" : "Button";

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CodeBlock
            title="figure.html — a picture with a caption a reader can hear"
            lines={imgLines}
            activeId={active}
            onActivate={hover}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAltOn((v) => !v)}
              onMouseEnter={() => hover("alt")}
              onMouseLeave={() => hover(null)}
              aria-pressed={altOn}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
                altOn
                  ? "border-brass bg-primary text-primary-foreground"
                  : "border-border text-sage line-through hover:border-brass/60",
              )}
            >
              alt text
            </button>
          </div>
        </div>

        <div>
          <div
            {...partProps("img")}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-md border border-brass/40 transition-all",
              ring("img"),
            )}
            style={{
              background:
                "radial-gradient(circle at 40% 60%, #C9A14E 0%, #5E3A18 45%, #0A0D08 100%)",
              aspectRatio: "16 / 9",
            }}
          >
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-xs font-semibold tracking-[0.24em] text-gold-light uppercase">
                Poster · S.S. Rollout
              </span>
            </div>
          </div>

          <div
            {...partProps("alt")}
            className={cn(
              "mt-3 cursor-pointer rounded-md border p-3 transition-all",
              altOn
                ? lit("alt")
                  ? "border-gold-light bg-card/60 ring-2 ring-gold-light/60"
                  : "border-sage/40 bg-card/30"
                : "border-oxblood-bright/50 bg-card/30",
            )}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
              {altOn ? "Screen reader says" : "Screen reader says (no alt)"}
            </p>
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed",
                altOn ? "text-foreground/95" : "text-oxblood-bright/90 italic",
              )}
            >
              <span aria-hidden>“</span>
              {altReadout}
              <span aria-hidden>”</span>
            </p>
            {!altOn ? (
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] text-sage/70 uppercase">
                That is all a non sighted patron hears
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CodeBlock
            title="icon-button.html — a glyph with a label a reader can hear"
            lines={btnLines}
            activeId={active}
            onActivate={hover}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAriaOn((v) => !v)}
              onMouseEnter={() => hover("aria-label")}
              onMouseLeave={() => hover(null)}
              aria-pressed={ariaOn}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
                ariaOn
                  ? "border-brass bg-primary text-primary-foreground"
                  : "border-border text-sage line-through hover:border-brass/60",
              )}
            >
              aria-label
            </button>
          </div>
        </div>

        <div>
          <div
            {...partProps("button")}
            className={cn(
              "inline-flex size-16 cursor-pointer items-center justify-center rounded-full border border-brass/60 bg-card text-2xl text-oxblood-bright transition-all",
              ring("button") || (lit("aria-label") && "ring-2 ring-gold-light"),
            )}
          >
            <span {...partProps("icon")}>♥</span>
          </div>

          <div
            {...partProps("aria-label")}
            className={cn(
              "mt-3 cursor-pointer rounded-md border p-3 transition-all",
              ariaOn
                ? lit("aria-label")
                  ? "border-gold-light bg-card/60 ring-2 ring-gold-light/60"
                  : "border-sage/40 bg-card/30"
                : "border-oxblood-bright/50 bg-card/30",
            )}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] text-sage/80 uppercase">
              {ariaOn ? "Screen reader says" : "Screen reader says (no label)"}
            </p>
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed",
                ariaOn ? "text-foreground/95" : "text-oxblood-bright/90 italic",
              )}
            >
              <span aria-hidden>“</span>
              {ariaReadout}
              <span aria-hidden>”</span>
            </p>
            {!ariaOn ? (
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] text-sage/70 uppercase">
                A reader cannot see the ♥. A reader cannot guess the job.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card/50 px-4 py-2.5">
        <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
          {active
            ? PART_LABELS[active]
            : "Hover any tag or any caption. Toggle a label off and listen to what disappears."}
        </p>
      </div>
    </div>
  );
}
