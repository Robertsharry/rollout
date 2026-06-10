"use client";

import Image from "next/image";

import { embedUrl, posterUrl, type ProgramEntry } from "@/lib/theater";
import { cn } from "@/lib/utils";

const VELVET =
  "repeating-linear-gradient(90deg, #571E22 0px, #6E262B 7px, #87333A 14px, #6E262B 21px, #571E22 28px)";
const VELVET_SHADE =
  "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.45))";

interface StageProps {
  entry: ProgramEntry;
  curtainsOpen: boolean;
  playing: boolean;
  lightsDown: boolean;
  onRaiseCurtain: () => void;
  onToggleLights: () => void;
}

function MarqueeBulbs({ count = 5 }: { count?: number }) {
  return (
    <span aria-hidden className="flex items-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-gold-light animate-pulse-glow"
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}
    </span>
  );
}

function CurtainHalf({ side, open }: { side: "left" | "right"; open: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-y-0 z-20 w-[52%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
        side === "left" ? "left-0" : "right-0",
        open && (side === "left" ? "-translate-x-[103%]" : "translate-x-[103%]"),
      )}
      style={{ background: `${VELVET_SHADE}, ${VELVET}` }}
    >
      {/* gold fringe along the leading edge */}
      <div
        className={cn(
          "absolute inset-y-0 w-1.5 bg-brass/70",
          side === "left" ? "right-0" : "left-0",
        )}
      />
    </div>
  );
}

export function Stage({
  entry,
  curtainsOpen,
  playing,
  lightsDown,
  onRaiseCurtain,
  onToggleLights,
}: StageProps) {
  return (
    <figure className={cn("relative", lightsDown && "z-50")}>
      {/* proscenium */}
      <div className="relative overflow-hidden rounded-lg border border-brass/60 bg-[#241A12] p-2.5 shadow-2xl sm:p-3.5">
        <div className="pointer-events-none absolute inset-1.5 rounded-md border border-brass/25" />

        {/* marquee */}
        <div className="relative flex items-center justify-between gap-3 px-2 pt-1 pb-3 sm:px-4">
          <MarqueeBulbs />
          <p className="min-w-0 truncate text-center font-display text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase sm:text-xs">
            Now showing · {entry.title}
          </p>
          <MarqueeBulbs />
        </div>

        {/* the stage opening */}
        <div className="relative aspect-video overflow-hidden rounded-sm bg-[#070B08]">
          {/* picture or poster */}
          {playing ? (
            <iframe
              key={entry.id}
              src={embedUrl(entry.id)}
              title={entry.ytTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <Image
              src={posterUrl(entry.id)}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover opacity-80"
              priority
            />
          )}

          {/* curtains */}
          <CurtainHalf side="left" open={curtainsOpen} />
          <CurtainHalf side="right" open={curtainsOpen} />

          {/* valance: velvet swag + scalloped trim, always dressed */}
          <div aria-hidden className="absolute inset-x-0 top-0 z-30">
            <div className="h-7" style={{ background: `${VELVET_SHADE}, ${VELVET}` }} />
            <div
              className="h-[13px] w-full"
              style={{
                background:
                  "radial-gradient(circle 13px at 13px 0, #5E2126 97%, transparent 100%)",
                backgroundSize: "26px 13px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>

          {/* raise-the-curtain plaque */}
          {!playing ? (
            <button
              type="button"
              onClick={onRaiseCurtain}
              className="group absolute inset-0 z-40 flex items-center justify-center"
              aria-label={`Raise the curtain and play ${entry.title}`}
            >
              <span className="flex flex-col items-center gap-4">
                <span className="grid size-16 place-items-center rounded-full border border-gold-light/70 bg-[#241A12]/80 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-gold-light">
                  <span
                    aria-hidden
                    className="ml-1 block size-0"
                    style={{
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderLeft: "16px solid var(--gold-light)",
                    }}
                  />
                </span>
                <span className="border border-brass/60 bg-[#241A12]/90 px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.24em] text-gold-light uppercase backdrop-blur">
                  Raise the curtain
                </span>
              </span>
            </button>
          ) : null}
        </div>

        {/* footlights */}
        <div
          aria-hidden
          className="mx-auto mt-2.5 h-1.5 w-2/3 rounded-full bg-gradient-to-r from-transparent via-gold-light/50 to-transparent"
        />
      </div>

      {/* stage controls + credit */}
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1.5">
        <p className="font-mono text-xs leading-relaxed tracking-[0.1em] text-sage uppercase">
          Reel courtesy of {entry.channel}
        </p>
        {playing ? (
          <button
            type="button"
            onClick={onToggleLights}
            className="rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-sage uppercase transition-colors hover:border-brass/60 hover:text-foreground"
          >
            House lights: {lightsDown ? "down ◆ raise" : "up ◆ dim"}
          </button>
        ) : null}
      </figcaption>
    </figure>
  );
}
