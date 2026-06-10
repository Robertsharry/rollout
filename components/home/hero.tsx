"use client";

import { motion } from "framer-motion";

import { DiscordButton } from "@/components/site/discord-button";
import { GAMES } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

function GiltRule({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} aria-hidden>
      <span
        className="h-px flex-1 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--brass), var(--gold-light), var(--brass), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
      <span className="size-1.5 rotate-45 bg-brass" />
      <span
        className="h-px flex-1 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--brass), var(--gold-light), var(--brass), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

export function Hero() {
  const scrollToGames = () =>
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16">
      {/* backdrop: pressed-tin lattice under a lamp-light vignette */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="tin-ceiling absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 10%, transparent 35%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* gilt picture frame around the viewport */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 border border-brass/45 sm:inset-5"
      >
        <div className="absolute inset-1.5 border border-brass/20" />
        <span className="absolute -top-1 -left-1 size-2 rotate-45 bg-brass" />
        <span className="absolute -top-1 -right-1 size-2 rotate-45 bg-brass" />
        <span className="absolute -bottom-1 -left-1 size-2 rotate-45 bg-brass" />
        <span className="absolute -right-1 -bottom-1 size-2 rotate-45 bg-brass" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 border border-brass/50 bg-card/70 px-4 py-2 font-display text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap text-gold-light uppercase backdrop-blur sm:gap-3 sm:px-5 sm:text-xs sm:tracking-[0.26em]"
      >
        Now boarding
        <span aria-hidden className="size-1 shrink-0 rotate-45 bg-brass" />
        Four tables open
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="font-script mt-8 text-3xl text-brass sm:text-4xl"
        aria-hidden
      >
        The
      </motion.div>

      <h1 className="mt-1 text-center font-display text-6xl font-semibold tracking-[0.08em] text-balance sm:text-7xl md:text-8xl lg:text-9xl">
        <span className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={{ y: "112%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            ROLLOUT
          </motion.span>
        </span>
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-5 w-full max-w-md"
      >
        <GiltRule />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="engraved mt-5 text-center text-xs text-gold-light sm:text-sm sm:tracking-[0.3em]"
      >
        Gaming house &amp; outfitters
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="mt-2.5 text-center font-mono text-xs tracking-[0.16em] text-sage uppercase"
      >
        Est. 2026 · On the river · All hands welcome
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.95 }}
        className="mt-7 max-w-2xl text-center text-base text-sage md:text-lg"
      >
        Deep tutorials, loadouts for every planet and region, a saloon worth
        arguing in, and a house board that never sleeps — for Pokémon, UFC, Arc
        Raiders, and Helldivers&nbsp;2.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        <DiscordButton label="Board with Discord" className="h-12 px-7 text-base" />
        <button
          type="button"
          onClick={scrollToGames}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-brass/50 bg-card/40 px-7 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-brass hover:bg-card"
        >
          Tour the decks <span aria-hidden>☞</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
      >
        {GAMES.map((game) => (
          <span
            key={game.slug}
            className="flex items-baseline gap-2 font-mono text-xs tracking-[0.14em] uppercase"
          >
            <span className="text-foreground/90">{game.name}</span>
            <span aria-hidden className="text-brass">
              ·
            </span>
            <span className="text-gold-light">{game.wing}</span>
          </span>
        ))}
      </motion.div>

      <button
        type="button"
        onClick={scrollToGames}
        aria-label="Scroll to the games"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-float font-mono text-xs tracking-[0.2em] text-sage uppercase transition-colors hover:text-foreground"
      >
        Deck 02 ▾
      </button>
    </section>
  );
}
