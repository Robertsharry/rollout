"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "next-view-transitions";
import {
  Anchor,
  BookOpen,
  Code2,
  Gamepad2,
  MessagesSquare,
  Ship,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const SEEN_KEY = "rollout-tour-seen";
const TOUR_EVENT = "rollout-tour-change";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(TOUR_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(TOUR_EVENT, cb);
  };
}

function seenSnapshot() {
  try {
    return localStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return true;
  }
}

export function markTourSeen() {
  try {
    localStorage.setItem(SEEN_KEY, new Date().toISOString());
  } catch {
    /* the porter does not insist */
  }
  window.dispatchEvent(new Event(TOUR_EVENT));
}

export function reopenTour() {
  try {
    localStorage.removeItem(SEEN_KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new Event(TOUR_EVENT));
}

interface Stop {
  icon: LucideIcon;
  kicker: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
}

const STOPS: Stop[] = [
  {
    icon: Ship,
    kicker: "Welcome aboard",
    title: "This is the S.S. Rollout.",
    body: "A gaming house on the river, run by veterans. Every section of the site is a room of the boat — guides, forums, games, and a few surprises. The porter will walk you through the decks; it takes half a minute.",
  },
  {
    icon: Gamepad2,
    kicker: "The game decks",
    title: "Four games, deep guides.",
    body: "Pokémon starter field guides across nine generations, the live UFC fight card updated weekly, Helldivers loadouts for every front, and Arc Raiders region manifests — written by people who actually play.",
    link: { href: "/pokemon", label: "Peek at the specimen cabinet" },
  },
  {
    icon: MessagesSquare,
    kicker: "The community rooms",
    title: "Talk, compete, get printed.",
    body: "The Saloon has a table for every game — mention members with @ and they get a bell. Chalk your runs onto the House Board. Write a guide at the Manuscript Desk and the house prints the good ones with your name on them.",
    link: { href: "/forums", label: "Look into the Saloon" },
  },
  {
    icon: BookOpen,
    kicker: "The entertainment",
    title: "A theater and an arcade.",
    body: "The Showboat Theater screens hand picked reels behind a real velvet curtain. The Penny Arcade has three original cabinets built by the house — and your best run can go straight onto the House Board.",
    link: { href: "/videos", label: "Take a seat in the theater" },
  },
  {
    icon: Code2,
    kicker: "Below decks",
    title: "Learn to code on this very boat.",
    body: "The Engine Room teaches HTML, CSS, and JavaScript by taking real parts of this site apart in your hands — seventeen stations, free forever. Log them all and the house draws up your Engineer's Papers.",
    link: { href: "/learn", label: "Open the Engine Room" },
  },
  {
    icon: Anchor,
    kicker: "Take a bunk",
    title: "The first 100 aboard are Plank Owners.",
    body: "Check in with Discord and you get a permanent service record — ribbons, your guides, your runs, your crew number. Original crew keep the Plank Owner ribbon forever. The house is just getting started.",
  },
];

interface PorterTourProps {
  signedIn: boolean;
}

export function PorterTour({ signedIn }: PorterTourProps) {
  const seen = useSyncExternalStore(subscribe, seenSnapshot, () => true);
  const [stop, setStop] = useState(0);

  // members know the boat; the porter tips his cap and steps aside
  const open = !seen && !signedIn;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") markTourSeen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const current = STOPS[stop];
  const Icon = current.icon;
  const last = stop === STOPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A short tour of the site"
      className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Dismiss the tour"
        onClick={markTourSeen}
        className="absolute inset-0 bg-black/70"
        style={{
          animation: "tour-fade 400ms ease 600ms backwards",
        }}
      />

      <div
        className="relative w-full max-w-md rounded-lg border border-brass/60 bg-[#1B3528] p-6 shadow-2xl sm:p-7"
        style={{ animation: "tour-rise 500ms cubic-bezier(0.22, 1, 0.36, 1) 700ms backwards" }}
      >
        <div className="pointer-events-none absolute inset-1.5 rounded-md border border-brass/25" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <span className="font-display text-[11px] font-semibold tracking-[0.24em] text-gold-light uppercase">
              The porter&apos;s tour · {stop + 1} of {STOPS.length}
            </span>
            <button
              type="button"
              onClick={markTourSeen}
              aria-label="Skip the tour"
              className="grid size-7 shrink-0 place-items-center rounded-md text-sage transition-colors hover:bg-card hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 flex size-12 items-center justify-center rounded-full border border-brass/50 bg-card/70 text-brass">
            <Icon className="size-6" />
          </div>

          <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
            {current.kicker}
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight">
            {current.title}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-sage">{current.body}</p>

          {current.link ? (
            <Link
              href={current.link.href}
              onClick={markTourSeen}
              className="mt-3 inline-block text-sm font-medium text-brass underline underline-offset-4 hover:text-gold-light"
            >
              {current.link.label} <span aria-hidden>☞</span>
            </Link>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-hidden>
              {STOPS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-1.5 rotate-45 transition-colors",
                    i === stop ? "bg-gold-light" : "bg-brass/30",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {stop > 0 ? (
                <button
                  type="button"
                  onClick={() => setStop((s) => Math.max(0, s - 1))}
                  className="h-10 rounded-md border border-border px-4 text-sm font-medium text-sage transition-colors hover:border-brass/60 hover:text-foreground"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={markTourSeen}
                  className="h-10 rounded-md border border-border px-4 text-sm font-medium text-sage transition-colors hover:border-brass/60 hover:text-foreground"
                >
                  Skip
                </button>
              )}
              {last ? (
                <Link
                  href="/signin"
                  onClick={markTourSeen}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  Check in <span aria-hidden className="ml-1.5">⚓</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setStop((s) => Math.min(STOPS.length - 1, s + 1))}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  Next <span aria-hidden className="ml-1.5">☞</span>
                </button>
              )}
            </div>
          </div>

          {last ? (
            <button
              type="button"
              onClick={markTourSeen}
              className="mt-3 w-full text-center font-mono text-[11px] tracking-[0.14em] text-sage uppercase transition-colors hover:text-foreground"
            >
              Wander on my own
            </button>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes tour-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tour-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes tour-rise { from { opacity: 0 } to { opacity: 1 } }
        }
      `}</style>
    </div>
  );
}

/** Footer link that invites anyone to retake the tour. */
export function TourTrigger() {
  return (
    <button
      type="button"
      onClick={reopenTour}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Take the porter&apos;s tour
    </button>
  );
}
