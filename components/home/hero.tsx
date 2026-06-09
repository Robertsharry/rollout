"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

import { DiscordButton } from "@/components/site/discord-button";
import { GAMES } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const blob1X = useTransform(sx, (v) => v * 22);
  const blob1Y = useTransform(sy, (v) => v * 22);
  const blob2X = useTransform(sx, (v) => v * -30);
  const blob2Y = useTransform(sy, (v) => v * -18);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const scrollToGames = () =>
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid bg-radial-fade absolute inset-0 opacity-60" />
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          className="absolute top-[16%] left-[8%] size-[42vw] max-w-[640px] animate-aurora rounded-full bg-neon/20 blur-[120px]"
        />
        <motion.div
          style={{ x: blob2X, y: blob2Y }}
          className="absolute right-[6%] bottom-[10%] size-[38vw] max-w-[560px] animate-aurora rounded-full bg-magenta/20 blur-[120px]"
        />
        <div className="absolute top-[28%] left-1/2 size-[30vw] max-w-[480px] -translate-x-1/2 rounded-full bg-military/15 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase backdrop-blur"
      >
        <span className="size-1.5 rounded-full bg-neon animate-pulse-glow" />
        Veteran-run · 4 games · one squad
      </motion.div>

      <h1 className="mt-7 max-w-4xl text-center font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
        <span className="block overflow-hidden pb-[0.1em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Your squad’s
          </motion.span>
        </span>
        <span className="block overflow-hidden pb-[0.1em]">
          <motion.span
            className="text-gradient inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          >
            command center
          </motion.span>
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 max-w-2xl text-center text-base text-muted-foreground md:text-lg"
      >
        Deep tutorials, planet-by-planet loadouts, live leaderboards, and a forum
        that doesn’t suck — for Pokémon, UFC, Arc Raiders, and Helldivers 2. Built
        by the community, for the squad.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        <DiscordButton className="h-12 px-7 text-base" />
        <button
          type="button"
          onClick={scrollToGames}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card/40 px-7 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-neon/40 hover:bg-card"
        >
          Explore the games
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase"
      >
        {GAMES.map((g) => (
          <span key={g.slug}>{g.short}</span>
        ))}
      </motion.div>

      <button
        type="button"
        onClick={scrollToGames}
        aria-label="Scroll to games"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </button>
    </section>
  );
}
