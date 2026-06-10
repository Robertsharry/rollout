"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const VELVET =
  "repeating-linear-gradient(90deg, #571E22 0px, #6E262B 6px, #87333A 12px, #6E262B 18px, #571E22 24px)";

interface Easing {
  name: string;
  value: string;
}

const EASINGS: Easing[] = [
  { name: "Linear", value: "linear" },
  { name: "Ease", value: "ease" },
  { name: "House glide", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { name: "Overshoot", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

export function StationChoreo() {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(700);
  const [easing, setEasing] = useState<Easing>(EASINGS[2]);
  const [touching, setTouching] = useState<string | null>(null);

  const lines = [
    { text: ".curtain {" },
    {
      text: `  transition: transform ${duration}ms`,
      id: "duration",
    },
    { text: `              ${easing.value};`, id: "easing" },
    { text: "}" },
    { text: "" },
    { text: ".open .curtain.left  { transform: translateX(-103%); }", id: "transform" },
    { text: ".open .curtain.right { transform: translateX(103%);  }", id: "transform" },
  ];

  const curtainStyle = (side: "left" | "right"): React.CSSProperties => ({
    background: VELVET,
    transition: `transform ${duration}ms ${easing.value}`,
    transform: open
      ? `translateX(${side === "left" ? "-103%" : "103%"})`
      : "translateX(0)",
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="curtain.css — the whole trick"
          lines={lines}
          activeId={touching}
        />

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              Duration — {duration}ms
            </span>
            <input
              type="range"
              min={150}
              max={2000}
              step={50}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              onPointerDown={() => setTouching("duration")}
              onPointerUp={() => setTouching(null)}
              onBlur={() => setTouching(null)}
              className="mt-2 w-full accent-[var(--brass)]"
              aria-label="Curtain duration in milliseconds"
            />
          </label>

          <div>
            <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              Easing — how the motion breathes
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {EASINGS.map((e) => (
                <button
                  key={e.name}
                  type="button"
                  onClick={() => {
                    setEasing(e);
                    setTouching("easing");
                    setTimeout(() => setTouching(null), 900);
                  }}
                  aria-pressed={easing.name === e.name}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors",
                    easing.name === e.name
                      ? "border-brass bg-primary text-primary-foreground"
                      : "border-border text-sage hover:border-brass/60 hover:text-foreground",
                  )}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* the live curtain */}
        <div className="rounded-lg border border-brass/40 bg-[#241A12] p-3">
          <div className="relative aspect-video overflow-hidden rounded-sm bg-[#070B08]">
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-sm font-semibold tracking-[0.24em] text-gold-light uppercase">
                The picture
              </span>
            </div>
            <div className="absolute inset-y-0 left-0 w-[52%]" style={curtainStyle("left")} />
            <div className="absolute inset-y-0 right-0 w-[52%]" style={curtainStyle("right")} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:brightness-110"
        >
          {open ? "Close the curtain" : "Run the curtain"} <span aria-hidden>☞</span>
        </button>

        <p className="mt-3 text-sm leading-relaxed text-sage">
          Try Overshoot at 400ms, then House glide at 700ms — same two lines of
          CSS, completely different personality. We animate{" "}
          <code className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.85em]">
            transform
          </code>{" "}
          because the browser can slide it on the graphics card without
          repainting the page; animating{" "}
          <code className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.85em]">
            left
          </code>{" "}
          would stutter.
        </p>
      </div>
    </div>
  );
}
