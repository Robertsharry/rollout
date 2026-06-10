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

const PULSE_MS = 1400;

export function StationWiring() {
  const [stage, setStage] = useState<StageState>({
    curtain: "closed",
    reel: REELS[0],
    lights: "up",
  });
  const [pulse, setPulse] = useState<string[]>([]);
  const [readout, setReadout] = useState<string | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    },
    [],
  );

  const fire = (ids: string[], message: string) => {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setPulse(ids);
    setReadout(message);
    pulseTimer.current = setTimeout(() => {
      setPulse([]);
      setReadout(null);
    }, PULSE_MS);
  };

  const raise = () => {
    setStage((s) => ({ ...s, curtain: "open", lights: "down" }));
    fire(
      ["fn-raise", "state-curtain", "state-lights"],
      'raise() ran  ·  curtain → "open"  ·  lights → "down"',
    );
  };
  const lower = () => {
    setStage((s) => ({ ...s, curtain: "closed", lights: "up" }));
    fire(
      ["fn-lower", "state-curtain", "state-lights"],
      'lower() ran  ·  curtain → "closed"  ·  lights → "up"',
    );
  };
  const pickReel = (reel: Reel) => {
    setStage((s) => ({ ...s, reel }));
    fire(
      ["fn-pick", "state-reel"],
      `pick("${reel.title}") ran  ·  reel → "${reel.title}"`,
    );
  };

  const lines: CodeLine[] = [
    { text: "// the boat's whole memory of right now" },
    { text: "let stage = {" },
    { text: `  curtain: "${stage.curtain}",`, id: "state-curtain" },
    { text: `  reel:    "${stage.reel.title}",`, id: "state-reel" },
    { text: `  lights:  "${stage.lights}",`, id: "state-lights" },
    { text: "};" },
    { text: "" },
    { text: "// recipes the buttons are wired to" },
    { text: "function raise() {", id: "fn-raise" },
    { text: '  stage.curtain = "open";', id: "fn-raise" },
    { text: '  stage.lights  = "down";', id: "fn-raise" },
    { text: "  render();", id: "fn-raise" },
    { text: "}", id: "fn-raise" },
    { text: "" },
    { text: "function lower() {", id: "fn-lower" },
    { text: '  stage.curtain = "closed";', id: "fn-lower" },
    { text: '  stage.lights  = "up";', id: "fn-lower" },
    { text: "  render();", id: "fn-lower" },
    { text: "}", id: "fn-lower" },
    { text: "" },
    { text: "function pick(reel) {", id: "fn-pick" },
    { text: "  stage.reel = reel;", id: "fn-pick" },
    { text: "  render();", id: "fn-pick" },
    { text: "}", id: "fn-pick" },
  ];

  const lightsDown = stage.lights === "down";
  const curtainOpen = stage.curtain === "open";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CodeBlock
          title="theater.js — state on top, recipes below"
          lines={lines}
          activeId={pulse}
        />

        <div className="mt-4 min-h-12 rounded-md border border-border bg-card/50 px-4 py-2.5">
          <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-gold-light">
            {readout ?? "Click a control on the right — the recipe fires and the state updates under your eyes."}
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
          <div className="rounded-sm border border-brass/40 bg-[#2E2218] px-3 py-2 text-center font-display text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase">
            Now showing · {stage.reel.title}
          </div>

          <div className="relative mt-2 aspect-video overflow-hidden rounded-sm bg-[#070B08]">
            <div
              aria-hidden
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: stage.reel.poster,
                opacity: lightsDown ? 1 : 0.55,
              }}
            />

            <div
              aria-hidden
              className="absolute inset-y-0 left-0 z-10 w-[52%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{
                background: VELVET,
                transform: curtainOpen ? "translateX(-103%)" : "translateX(0)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 z-10 w-[52%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{
                background: VELVET,
                transform: curtainOpen ? "translateX(103%)" : "translateX(0)",
              }}
            />

            <div
              aria-hidden
              className="absolute inset-x-0 top-0 z-20 h-[14%]"
              style={{ background: VELVET }}
            />
          </div>

          <div
            aria-hidden
            className={cn(
              "mx-auto mt-2 h-1 w-2/3 rounded-full bg-gradient-to-r from-transparent via-gold-light to-transparent transition-opacity duration-500",
              lightsDown ? "opacity-90" : "opacity-30",
            )}
          />
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <span className="font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
              The curtain button
            </span>
            <button
              type="button"
              onClick={curtainOpen ? lower : raise}
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
