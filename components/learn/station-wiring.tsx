"use client";

import { useEffect, useRef, useState } from "react";

import { CodeBlock, type CodeLine } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const VELVET =
  "repeating-linear-gradient(90deg, #571E22 0px, #6E262B 6px, #87333A 12px, #6E262B 18px, #571E22 24px)";

interface Reel {
  id: string;
  title: string;
  poster: string;
}

const REELS: Reel[] = [
  {
    id: "welcome",
    title: "Captain's welcome",
    poster:
      "radial-gradient(circle at 30% 32%, #E6C375 0%, #8A5F1E 55%, #1A1208 100%)",
  },
  {
    id: "arcade",
    title: "Penny arcade tour",
    poster:
      "radial-gradient(circle at 68% 38%, #D26464 0%, #5E1C20 55%, #1B0608 100%)",
  },
  {
    id: "piano",
    title: "Saloon piano",
    poster:
      "radial-gradient(circle at 50% 60%, #9CA994 0%, #2D3A2A 55%, #080D08 100%)",
  },
];

interface StageState {
  curtain: "closed" | "open";
  reel: Reel;
  lights: "up" | "down";
}

const PULSE_MS = 1600;

// One active id at a time drives both highlights. A function id (raise/lower/
// pick) glows the function's lines AND every part of the stage it operates on,
// so hovering "function raise() {" lights the curtain and the footlights at
// once. Part ids (curtain/reel/lights) light only their own part.
function glowIds(active: string | null): string[] {
  if (!active) return [];
  switch (active) {
    case "raise":
      return ["raise", "curtain", "lights"];
    case "lower":
      return ["lower", "curtain", "lights"];
    case "pick":
      return ["pick", "reel"];
    default:
      return [active];
  }
}

const PART_LABELS: Record<string, string> = {
  curtain: "stage.curtain — the velvet",
  reel: "stage.reel — the picture and marquee",
  lights: "stage.lights — the footlights and house",
  raise: "function raise() — opens curtain, drops lights",
  lower: "function lower() — closes curtain, raises lights",
  pick: "function pick(reel) — swaps the picture",
};

export function StationWiring() {
  const [stage, setStage] = useState<StageState>({
    curtain: "closed",
    reel: REELS[0],
    lights: "up",
  });
  const [active, setActive] = useState<string | null>(null);
  const [readout, setReadout] = useState<string | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    },
    [],
  );

  const pulse = (id: string, message: string) => {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setActive(id);
    setReadout(message);
    pulseTimer.current = setTimeout(() => {
      setActive((cur) => (cur === id ? null : cur));
      setReadout(null);
      pulseTimer.current = null;
    }, PULSE_MS);
  };

  const hover = (id: string | null) => {
    // A genuine hover overrides any in-flight pulse — but keep the readout
    // alive while the user is exploring related parts.
    setActive(id);
  };

  const raise = () => {
    setStage((s) => ({ ...s, curtain: "open", lights: "down" }));
    pulse("raise", 'raise() ran  ·  curtain → "open"  ·  lights → "down"');
  };
  const lower = () => {
    setStage((s) => ({ ...s, curtain: "closed", lights: "up" }));
    pulse("lower", 'lower() ran  ·  curtain → "closed"  ·  lights → "up"');
  };
  const pickReel = (reel: Reel) => {
    setStage((s) => ({ ...s, reel }));
    pulse("pick", `pick("${reel.title}") ran  ·  reel → "${reel.title}"`);
  };

  const lines: CodeLine[] = [
    { text: "// the boat's whole memory of right now" },
    { text: "let stage = {" },
    { text: `  curtain: "${stage.curtain}",`, id: "curtain" },
    { text: `  reel:    "${stage.reel.title}",`, id: "reel" },
    { text: `  lights:  "${stage.lights}",`, id: "lights" },
    { text: "};" },
    { text: "" },
    { text: "// recipes the buttons are wired to" },
    { text: "function raise() {", id: "raise" },
    { text: '  stage.curtain = "open";', id: "curtain" },
    { text: '  stage.lights  = "down";', id: "lights" },
    { text: "  render();", id: "raise" },
    { text: "}", id: "raise" },
    { text: "" },
    { text: "function lower() {", id: "lower" },
    { text: '  stage.curtain = "closed";', id: "curtain" },
    { text: '  stage.lights  = "up";', id: "lights" },
    { text: "  render();", id: "lower" },
    { text: "}", id: "lower" },
    { text: "" },
    { text: "function pick(reel) {", id: "pick" },
    { text: "  stage.reel = reel;", id: "reel" },
    { text: "  render();", id: "pick" },
    { text: "}", id: "pick" },
  ];

  const lit = new Set(glowIds(active));
  const litCurtain = lit.has("curtain");
  const litReel = lit.has("reel");
  const litLights = lit.has("lights");

  const lightsDown = stage.lights === "down";
  const curtainOpen = stage.curtain === "open";

  const partProps = (id: string) => ({
    onMouseEnter: () => hover(id),
    onMouseLeave: () => hover(null),
    onFocus: () => hover(id),
    onBlur: () => hover(null),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": PART_LABELS[id],
  });

  const defaultReadout =
    "Hover any line of code, or any part of the stage — both light up together.";

  return (
    <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <div>
        <CodeBlock
          title="theater.js — state on top, recipes below"
          lines={lines}
          activeId={glowIds(active)}
          onActivate={hover}
        />

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {readout ?? (active ? PART_LABELS[active] ?? defaultReadout : defaultReadout)}
          </p>
        </div>
      </div>

      <div>
        <div
          className={cn(
            "relative rounded-lg border p-3 transition-colors duration-500",
            lightsDown
              ? "border-brass/50 bg-[#0E0A06]"
              : "border-brass/40 bg-[#241A12]",
          )}
        >
          {/* marquee — part of "reel" */}
          <div
            {...partProps("reel")}
            className={cn(
              "cursor-pointer rounded-sm border bg-[#2E2218] px-3 py-2 text-center font-display text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase transition-all",
              litReel ? "border-gold-light ring-2 ring-gold-light/70" : "border-brass/40",
            )}
          >
            Now showing · {stage.reel.title}
          </div>

          {/* stage opening */}
          <div className="relative mt-2 aspect-video overflow-hidden rounded-sm bg-[#070B08]">
            {/* picture — part of "reel" */}
            <div
              {...partProps("reel")}
              className={cn(
                "absolute inset-0 cursor-pointer transition-all duration-500",
                litReel && "ring-2 ring-gold-light",
              )}
              style={{
                background: stage.reel.poster,
                opacity: lightsDown ? 1 : 0.55,
              }}
            />

            {/* curtain halves — part of "curtain" */}
            <div
              {...partProps("curtain")}
              className={cn(
                "absolute inset-y-0 left-0 z-10 w-[52%] cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
                litCurtain && "outline outline-2 -outline-offset-2 outline-gold-light",
              )}
              style={{
                background: VELVET,
                transform: curtainOpen ? "translateX(-103%)" : "translateX(0)",
              }}
            />
            <div
              {...partProps("curtain")}
              className={cn(
                "absolute inset-y-0 right-0 z-10 w-[52%] cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
                litCurtain && "outline outline-2 -outline-offset-2 outline-gold-light",
              )}
              style={{
                background: VELVET,
                transform: curtainOpen ? "translateX(103%)" : "translateX(0)",
              }}
            />

            {/* valance: dressing, not interactive */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[14%]"
              style={{ background: VELVET }}
            />

            {/* curtain-open ghost outline so the bridge still reads when the
                velvet is off-screen */}
            {curtainOpen && litCurtain ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[52%] border-2 border-dashed border-gold-light/70"
              />
            ) : null}
            {curtainOpen && litCurtain ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[52%] border-2 border-dashed border-gold-light/70"
              />
            ) : null}
          </div>

          {/* footlights — part of "lights" */}
          <div
            {...partProps("lights")}
            className={cn(
              "mx-auto mt-2 grid cursor-pointer place-items-center rounded-full py-1.5 transition-colors",
              litLights && "bg-gold-light/10",
            )}
          >
            <div
              aria-hidden
              className={cn(
                "h-1 w-2/3 rounded-full bg-gradient-to-r from-transparent via-gold-light to-transparent transition-opacity duration-500",
                lightsDown ? "opacity-90" : "opacity-30",
                litLights && "via-gold-light/100 opacity-100",
              )}
            />
            <span
              className={cn(
                "mt-1 font-mono text-[9px] tracking-[0.18em] uppercase transition-colors",
                litLights ? "text-gold-light" : "text-transparent",
              )}
            >
              footlights
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              The curtain button
            </span>
            <button
              type="button"
              onClick={curtainOpen ? lower : raise}
              onMouseEnter={() => hover(curtainOpen ? "lower" : "raise")}
              onMouseLeave={() => hover(null)}
              aria-label={curtainOpen ? "Lower the curtain" : "Raise the curtain"}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:brightness-110"
            >
              {curtainOpen ? "Lower the curtain" : "Raise the curtain"} <span aria-hidden>☞</span>
            </button>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] text-sage/80 uppercase">
              Wired to {curtainOpen ? "lower()" : "raise()"}
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              Pick a reel — wired to pick(reel)
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {REELS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => pickReel(r)}
                  onMouseEnter={() => hover("pick")}
                  onMouseLeave={() => hover(null)}
                  aria-pressed={stage.reel.id === r.id}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors",
                    stage.reel.id === r.id
                      ? "border-brass bg-primary text-primary-foreground"
                      : "border-border text-sage hover:border-brass/60 hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-3 rounded-full border border-black/30"
                    style={{ background: r.poster }}
                  />
                  {r.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-sage">
          Three controls, one tiny script. Every click runs a recipe; every
          recipe edits the same little box of state; the boat just shows
          whatever the box says. That loop runs every interactive piece of this
          site — only larger.
        </p>
      </div>
    </div>
  );
}
