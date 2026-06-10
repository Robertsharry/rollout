/** Shared helpers for the Penny Arcade canvas games. */
import { useSyncExternalStore } from "react";

const COARSE_QUERY = "(pointer: coarse)";

function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia(COARSE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True on touch-first devices; SSR snapshot is false. */
export function useCoarsePointer() {
  return useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia(COARSE_QUERY).matches,
    () => false,
  );
}

/** Scale a canvas for the device pixel ratio at a fixed logical size. */
export function fitCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return ctx;
}

export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const HS_PREFIX = "rollout-arcade-";

export function loadHighScore(slug: string): number {
  try {
    return Number(localStorage.getItem(HS_PREFIX + slug)) || 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(slug: string, score: number): number {
  const best = Math.max(loadHighScore(slug), score);
  try {
    localStorage.setItem(HS_PREFIX + slug, String(best));
  } catch {
    /* private browsing — the house forgives */
  }
  return best;
}

/** Keys the games own while running; we stop the page from scrolling on them. */
export const GAME_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyP",
  "Enter",
]);

export type GameState = "attract" | "playing" | "paused" | "over";

export interface HudState {
  score: number;
  high: number;
  lives: number;
  /** Round / wave label, e.g. "ROUND 2". */
  stage: string;
  state: GameState;
}

/** Tiny pooled particle burst used by all three games. */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  color: string;
  size: number;
}

export class ParticlePool {
  private pool: Particle[] = [];

  burst(
    x: number,
    y: number,
    color: string,
    count = 10,
    speed = 120,
    ttl = 0.5,
  ) {
    for (let i = 0; i < count; i++) {
      if (this.pool.length > 160) break;
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.35 + Math.random() * 0.65);
      this.pool.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: ttl,
        ttl,
        color,
        size: 1.5 + Math.random() * 2.5,
      });
    }
  }

  update(dt: number) {
    for (let i = this.pool.length - 1; i >= 0; i--) {
      const p = this.pool[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.pool.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - 2.2 * dt;
      p.vy *= 1 - 2.2 * dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.pool) {
      ctx.globalAlpha = Math.max(0, p.life / p.ttl);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  clear() {
    this.pool.length = 0;
  }
}
