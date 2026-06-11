"use client";

import { useEffect, useRef, useState } from "react";

import { CodeBlock } from "@/components/learn/code-block";
import { cn } from "@/lib/utils";

const VELVET =
  "repeating-linear-gradient(90deg, #571E22 0px, #6E262B 6px, #87333A 12px, #6E262B 18px, #571E22 24px)";

const REELS = ["Captain's welcome", "Penny arcade tour", "Saloon piano"];

type Phase = "idle" | "close" | "swap" | "open";

const CUES: { id: Phase; label: string; at: string }[] = [
  { id: "close", label: "Close the velvet", at: "0ms" },
  { id: "swap", label: "Change the reel", at: "620ms" },
  { id: "open", label: "Reopen", at: "700ms" },
];

export function StationStageManager() {
  const [reel, setReel] = useState(REELS[0]);
  const [curtainOpen, setCurtainOpen] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hovered, setHovered] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const cue = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const changeReel = (next: string) => {
    if (next === reel || phase !== "idle") return;
    // a new cue cancels the old ones — the cleanup the code points at
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setPhase("close");
    setCurtainOpen(false);
    cue(() => {
      setPhase("swap");
      setReel(next);
    }, 620);
    cue(() => {
      setPhase("open");
      setCurtainOpen(true);
    }, 700);
    cue(() => setPhase("idle"), 1500);
  };

  const activeId = hovered ?? (phase !== "idle" ? phase : null);

  const lines = [
    { text: "function changeReel(next) {" },
    { text: "  closeCurtain();", id: "close" },
    { text: "  setTimeout(() => setReel(next), 620);", id: "swap" },
    { text: "  setTimeout(() => openCurtain(), 700);", id: "open" },
    { text: "}" },
    { text: "" },
    { text: "// a new cue clears the old timers first,", id: "cleanup" },
    { text: "// or two swaps would fight over the stage", id: "cleanup" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
      <div>
        <CodeBlock
          title="stage-manager.js — watch each cue fire"
          lines={lines}
          activeId={activeId}
          onActivate={setHovered}
        />

        {/* the cue sheet */}
        <div className="mt-4 rounded-md border border-border p-3">
          <span className="font-mono text-[11px] tracking-[0.16em] text-gold-light uppercase">
            The cue sheet
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CUES.map((c) => (
              <div
                key={c.id}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-center transition-all",
                  activeId === c.id
                    ? "border-gold-light bg-card/80"
                    : phase === "idle"
                      ? "border-border"
                      : "border-border opacity-60",
                )}
              >
                <p className="font-mono text-[10px] tracking-[0.14em] text-sage uppercase">
                  {c.at}
                </p>
                <p className="mt-0.5 text-xs font-medium">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {REELS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => changeReel(r)}
              disabled={phase !== "idle"}
              aria-pressed={reel === r}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors disabled:opacity-50",
                reel === r
                  ? "border-brass bg-primary text-primary-foreground"
                  : "border-border text-sage hover:border-brass/60",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-gold-light uppercase">
          The stage — live
        </p>
        <div className="mt-2 rounded-lg border border-brass/40 bg-[#241A12] p-3">
          <p className="pb-2 text-center font-display text-[11px] font-semibold tracking-[0.2em] text-gold-light uppercase">
            Now showing · {reel}
          </p>
          <div className="relative aspect-video overflow-hidden rounded-sm bg-[#070B08]">
            <div className="absolute inset-0 grid place-items-center">
              <span className="px-4 text-center font-display text-sm font-semibold tracking-[0.2em] text-gold-light uppercase">
                {reel}
              </span>
            </div>
            <div
              className="absolute inset-y-0 left-0 w-[52%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{
                background: VELVET,
                transform: curtainOpen ? "translateX(-103%)" : "translateX(0)",
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-[52%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{
                background: VELVET,
                transform: curtainOpen ? "translateX(103%)" : "translateX(0)",
              }}
            />
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sage">
          This is the real choreography from our Showboat Theater: three cues
          on two timers. Pick a different reel and watch the cue sheet and the
          script light up in time with the stage — the swap happens behind
          closed velvet, exactly 620 milliseconds in.
        </p>
      </div>
    </div>
  );
}
