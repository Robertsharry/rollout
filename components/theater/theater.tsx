"use client";

import { useEffect, useRef, useState } from "react";

import { Playbill } from "@/components/theater/playbill";
import { Stage } from "@/components/theater/stage";
import { PROGRAM, type ProgramEntry } from "@/lib/theater";

const CURTAIN_MS = 700;

/**
 * The Showboat Theater: stage + playbill with a shared seat of state.
 * Picking a new reel while one is showing closes the curtain, swaps the
 * picture behind it, and reopens — the house never breaks the illusion.
 */
export function Theater() {
  const [entry, setEntry] = useState<ProgramEntry>(PROGRAM[0]);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lightsDown, setLightsDown] = useState(false);
  const [filter, setFilter] = useState("all");

  const stageRef = useRef<HTMLDivElement>(null);
  const transitioning = useRef(false);
  const reducedMotion = useRef(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightsDown(false);
    };
    window.addEventListener("keydown", onKey);
    const pending = timeouts.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      pending.forEach(clearTimeout);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timeouts.current.push(setTimeout(fn, ms));
  };

  const raiseCurtain = () => {
    if (transitioning.current) return;
    setCurtainsOpen(true);
    setPlaying(true);
    setLightsDown(true);
  };

  const selectEntry = (next: ProgramEntry) => {
    if (transitioning.current) return;
    stageRef.current?.scrollIntoView({
      behavior: reducedMotion.current ? "auto" : "smooth",
      block: "center",
    });
    if (next.id === entry.id) return;

    // Before the first showing, just swap the poster behind the curtain.
    if (!playing) {
      setEntry(next);
      return;
    }

    if (reducedMotion.current) {
      setEntry(next);
      return;
    }

    // Close, swap behind the velvet, reopen.
    transitioning.current = true;
    setCurtainsOpen(false);
    later(() => setEntry(next), CURTAIN_MS - 80);
    later(() => {
      setCurtainsOpen(true);
      transitioning.current = false;
    }, CURTAIN_MS + 120);
  };

  return (
    <div>
      {/* house lights — dims everything but the stage while a reel runs */}
      <div
        aria-hidden
        onClick={() => setLightsDown(false)}
        className={
          lightsDown && playing
            ? "fixed inset-0 z-40 bg-black/65 opacity-100 transition-opacity duration-700"
            : "pointer-events-none fixed inset-0 z-40 bg-black/65 opacity-0 transition-opacity duration-700"
        }
      />

      <div ref={stageRef} className="mx-auto max-w-4xl scroll-mt-28">
        <Stage
          entry={entry}
          curtainsOpen={curtainsOpen}
          playing={playing}
          lightsDown={lightsDown}
          onRaiseCurtain={raiseCurtain}
          onToggleLights={() => setLightsDown((v) => !v)}
        />
      </div>

      <div className="mt-16">
        <Playbill
          program={PROGRAM}
          selectedId={entry.id}
          filter={filter}
          onFilter={setFilter}
          onSelect={selectEntry}
        />
      </div>
    </div>
  );
}
