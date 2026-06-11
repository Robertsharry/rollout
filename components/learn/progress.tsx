"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Link } from "next-view-transitions";

import { STATIONS } from "@/lib/learn";
import { cn } from "@/lib/utils";

const LOG_KEY = "rollout-engine-log";
const LOG_EVENT = "rollout-engine-log-change";

function readLog(): string[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

let cache: { raw: string; value: string[] } = { raw: "", value: [] };

function snapshot(): string[] {
  const raw = (() => {
    try {
      return localStorage.getItem(LOG_KEY) ?? "";
    } catch {
      return "";
    }
  })();
  if (raw !== cache.raw) cache = { raw, value: readLog() };
  return cache.value;
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(LOG_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(LOG_EVENT, cb);
  };
}

const EMPTY: string[] = [];

function useEngineLog() {
  const logged = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const toggle = (slug: string) => {
    const next = logged.includes(slug)
      ? logged.filter((s) => s !== slug)
      : [...logged, slug];
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(next));
    } catch {
      /* private browsing keeps no log; the lesson still counts */
    }
    window.dispatchEvent(new Event(LOG_EVENT));
  };
  return { logged, toggle };
}

/* ----------------------------------------------------- per lesson button */

export function StationLogButton({ slug }: { slug: string }) {
  const { logged, toggle } = useEngineLog();
  const done = logged.includes(slug);
  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={done}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-6 text-sm font-semibold transition-colors",
          done
            ? "border-sage/60 bg-card/60 text-sage"
            : "border-brass/50 text-foreground hover:border-brass hover:bg-card",
        )}
      >
        {done ? "Logged in the engine book ✓" : "Log this station ◆"}
      </button>
    </div>
  );
}

/* --------------------------------------------------------- hub progress */

export function EngineProgress() {
  const { logged } = useEngineLog();
  const total = STATIONS.length;
  const count = STATIONS.filter((s) => logged.includes(s.slug)).length;
  const next = STATIONS.find((s) => !logged.includes(s.slug));
  const complete = count === total;

  return (
    <div className="glass mx-auto mt-8 max-w-2xl rounded-lg p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
          The engine book
        </span>
        <span className="font-mono text-xs text-sage tabular-nums">
          {count} of {total} stations logged
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brass/15">
        <div
          className="h-full rounded-full bg-brass transition-all duration-500"
          style={{ width: `${(count / total) * 100}%` }}
        />
      </div>
      {complete ? (
        <PapersPanel />
      ) : next ? (
        <p className="mt-3 text-sm text-sage">
          {count === 0 ? "Start at the bones — " : "Next up: "}
          <Link
            href={`/learn/${next.slug}`}
            className="text-brass underline underline-offset-4 hover:text-gold-light"
          >
            Station {next.number} — {next.title}
          </Link>
          . Log each station as you finish it; your progress lives in this
          browser, no account needed.
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------- the engineer's papers */

function PapersPanel() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim()) return;
    await document.fonts.ready;
    const W = 1500;
    const H = 1060;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#163024";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#C9A14E";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.lineWidth = 1;
    ctx.strokeRect(56, 56, W - 112, H - 112);
    for (const [x, y] of [
      [40, 40],
      [W - 40, 40],
      [40, H - 40],
      [W - 40, H - 40],
    ]) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#C9A14E";
      ctx.fillRect(-9, -9, 18, 18);
      ctx.restore();
    }

    // the house roundel
    ctx.strokeStyle = "#C9A14E";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W / 2, 190, 56, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([8, 22]);
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(W / 2, 190, 47, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.save();
    ctx.translate(W / 2, 190);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#E3C77E";
    ctx.fillRect(-17, -17, 34, 34);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = "#C9A14E";
    ctx.font = "600 26px Fraunces, Georgia, serif";
    ctx.fillText("T H E   E N G I N E   R O O M   O F   T H E   S. S.   R O L L O U T", W / 2, 308);

    ctx.fillStyle = "#EFE6CF";
    ctx.font = "700 92px Fraunces, Georgia, serif";
    ctx.fillText("Engineer's Papers", W / 2, 420);

    ctx.fillStyle = "#B9C9B4";
    ctx.font = "italic 34px 'Source Serif 4', Georgia, serif";
    ctx.fillText("be it known throughout the river that", W / 2, 500);

    ctx.fillStyle = "#E3C77E";
    ctx.font = "700 72px Fraunces, Georgia, serif";
    ctx.fillText(name.trim().slice(0, 40), W / 2, 610);

    ctx.fillStyle = "#B9C9B4";
    ctx.font = "30px 'Source Serif 4', Georgia, serif";
    ctx.fillText("has opened every panel and logged all thirteen stations —", W / 2, 690);
    ctx.fillText("the bones, the paint, and the wiring of a working boat.", W / 2, 734);

    ctx.strokeStyle = "#C9A14E";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 180, 820);
    ctx.lineTo(W / 2 + 180, 820);
    ctx.stroke();

    ctx.fillStyle = "#C9A14E";
    ctx.font = "44px 'Pinyon Script', cursive";
    ctx.fillText("The House", W / 2, 880);

    ctx.fillStyle = "#B9C9B4";
    ctx.font = "22px 'Cutive Mono', monospace";
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.fillText(`LOGGED ${date.toUpperCase()} · ROLLOUT.COMMUNITY`, W / 2, 950);

    setUrl(canvas.toDataURL("image/png"));
  };

  return (
    <div className="mt-4 border-t border-brass/25 pt-4">
      <p className="text-sm leading-relaxed text-sage">
        Every station logged. The house owes you your{" "}
        <span className="text-gold-light">Engineer&apos;s Papers</span> — put a
        name on them, hang them anywhere.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="The name on the papers"
          className="h-11 min-w-0 flex-1 rounded-md border border-border bg-background/40 px-3.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-brass"
        />
        <button
          type="button"
          onClick={draw}
          disabled={!name.trim()}
          className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
        >
          Draw up my papers
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      {url ? (
        <div className="mt-4 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Your Engineer's Papers certificate"
            className="w-full rounded-md border border-brass/40"
          />
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={url}
              download="rollout-engineers-papers.png"
              className="inline-flex h-10 items-center justify-center rounded-md border border-brass/50 px-5 text-sm font-semibold transition-colors hover:border-brass hover:bg-card"
            >
              Download the papers
            </a>
            <span className="text-xs text-sage">
              Post them in the Saloon — the house likes to see it.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
