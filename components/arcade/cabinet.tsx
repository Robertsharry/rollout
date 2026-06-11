"use client";

import { Link } from "next-view-transitions";

import type { HudState } from "@/lib/arcade/canvas";

interface CabinetProps {
  title: string;
  tagline: string;
  /** CSS color for the cabinet's marquee accent. */
  accent: string;
  hud: HudState;
  controls: string[];
  onStart: () => void;
  onTogglePause: () => void;
  children: React.ReactNode;
  /** Optional touch control cluster rendered under the bezel. */
  touch?: React.ReactNode;
  /** When set, the game over screen offers to chalk the score to the House Board. */
  chalk?: {
    signedIn: boolean;
    action: (formData: FormData) => Promise<void>;
  };
}

function HudPlaque({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5">
      <span className="font-mono text-[10px] tracking-[0.2em] text-sage uppercase">
        {label}
      </span>
      <span className="font-mono text-base font-bold tracking-[0.1em] text-gold-light tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function Cabinet({
  title,
  tagline,
  accent,
  hud,
  controls,
  onStart,
  onTogglePause,
  children,
  touch,
  chalk,
}: CabinetProps) {
  return (
    <div className="mx-auto w-full max-w-xl">
      {/* cabinet body */}
      <div
        className="relative overflow-hidden rounded-lg border border-brass/60 bg-[#241A12] p-3 shadow-2xl sm:p-4"
        style={{ "--cab-accent": accent } as React.CSSProperties}
      >
        <div className="pointer-events-none absolute inset-1.5 rounded-md border border-brass/25" />

        {/* marquee */}
        <div className="relative rounded-sm border border-brass/40 bg-gradient-to-b from-[#2E2218] to-[#241A12] px-4 py-3 text-center">
          <p
            className="font-display text-2xl font-bold tracking-[0.18em] uppercase"
            style={{ color: "var(--cab-accent)" }}
          >
            {title}
          </p>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.22em] text-sage uppercase">
            {tagline}
          </p>
        </div>

        {/* HUD strip */}
        <div className="relative mt-3 grid grid-cols-4 gap-2 rounded-sm border border-brass/25 bg-[#1B140D] px-3 py-2">
          <HudPlaque label="Score" value={hud.score.toLocaleString()} />
          <HudPlaque label="Best" value={hud.high.toLocaleString()} />
          <HudPlaque label="Lives" value={"◆".repeat(Math.max(0, hud.lives)) || "—"} />
          <HudPlaque label="Stage" value={hud.stage} />
        </div>

        {/* bezel + screen */}
        <div className="relative mt-3 overflow-hidden rounded-sm border border-brass/30 bg-[#0B0F0B]">
          {children}

          {/* CRT scanlines, static and cheap */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0 1px, transparent 1px 3px)",
            }}
          />

          {/* overlays */}
          {hud.state !== "playing" ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0B0F0B]/85 px-6 text-center backdrop-blur-[2px]">
              {hud.state === "attract" ? (
                <>
                  <p
                    className="font-display text-3xl font-bold tracking-[0.14em] uppercase"
                    style={{ color: "var(--cab-accent)" }}
                  >
                    {title}
                  </p>
                  <div className="space-y-1 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">
                    {controls.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={onStart}
                    className="mt-1 animate-pulse-glow border border-gold-light/70 bg-[#241A12]/90 px-5 py-2 font-display text-xs font-semibold tracking-[0.24em] text-gold-light uppercase"
                  >
                    Insert token ◆ press enter
                  </button>
                </>
              ) : null}

              {hud.state === "paused" ? (
                <>
                  <p className="font-display text-2xl font-bold tracking-[0.2em] text-gold-light uppercase">
                    Paused
                  </p>
                  <button
                    type="button"
                    onClick={onTogglePause}
                    className="border border-brass/60 bg-[#241A12]/90 px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-sage uppercase"
                  >
                    P to resume ◆ or tap
                  </button>
                </>
              ) : null}

              {hud.state === "over" ? (
                <>
                  <p className="font-display text-3xl font-bold tracking-[0.16em] text-oxblood-bright uppercase">
                    Game over
                  </p>
                  <div className="font-mono text-xs tracking-[0.16em] text-sage uppercase">
                    <p>
                      Score {hud.score.toLocaleString()}
                      {hud.score >= hud.high && hud.score > 0
                        ? " ◆ new house best"
                        : ` ◆ best ${hud.high.toLocaleString()}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onStart}
                    className="mt-1 border border-gold-light/70 bg-[#241A12]/90 px-5 py-2 font-display text-xs font-semibold tracking-[0.24em] text-gold-light uppercase"
                  >
                    Play again ◆ enter
                  </button>
                  {chalk && hud.score > 0 ? (
                    chalk.signedIn ? (
                      <form action={chalk.action}>
                        <input type="hidden" name="title" value={title} />
                        <input type="hidden" name="value" value={hud.score} />
                        <button
                          type="submit"
                          className="border border-brass/60 bg-[#241A12]/90 px-5 py-2 font-mono text-[11px] tracking-[0.18em] text-sage uppercase transition-colors hover:border-gold-light hover:text-gold-light"
                        >
                          Chalk it onto the House Board ☞
                        </button>
                      </form>
                    ) : (
                      <Link
                        href="/signin"
                        className="font-mono text-[11px] tracking-[0.16em] text-sage uppercase underline underline-offset-4 hover:text-gold-light"
                      >
                        Check in to chalk this onto the House Board
                      </Link>
                    )
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {touch ? <div className="relative mt-3">{touch}</div> : null}

        {/* coin door */}
        <div className="relative mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] tracking-[0.2em] text-sage/80 uppercase">
            No tokens required — the house covers it
          </span>
          <span
            aria-hidden
            className="size-2 rotate-45"
            style={{ background: "var(--cab-accent)" }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href="/arcade"
          className="font-mono text-xs tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
        >
          ← Back to the hall
        </Link>
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground/80 uppercase">
          Original house cabinet
        </span>
      </div>
    </div>
  );
}
