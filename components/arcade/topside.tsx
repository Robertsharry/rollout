"use client";

import { useEffect, useRef, useState } from "react";

import { Cabinet } from "@/components/arcade/cabinet";
import {
  clamp,
  fitCanvas,
  GAME_KEYS,
  loadHighScore,
  ParticlePool,
  prefersReducedMotion,
  saveHighScore,
  type GameState,
  type HudState,
  useCoarsePointer,
} from "@/lib/arcade/canvas";

const SLUG = "topside";
const W = 480;
const H = 640;
const PLAYER_Y = H - 46;

type WaspKind = "wasp" | "hornet";
type WaspMode = "entering" | "slotted" | "diving";

interface Wasp {
  kind: WaspKind;
  mode: WaspMode;
  hp: number;
  x: number;
  y: number;
  slotX: number;
  slotY: number;
  t: number;
  path: { x: number; y: number }[] | null;
  fireAt: number[];
  flash: number;
  dead: boolean;
}

interface Shot {
  x: number;
  y: number;
  vy: number;
  vx: number;
  enemy: boolean;
  dead: boolean;
}

interface Hooks {
  onHud: (h: HudState) => void;
}

function bezier(p: { x: number; y: number }[], t: number) {
  // de Casteljau, any degree
  let pts = p;
  while (pts.length > 1) {
    const next: { x: number; y: number }[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      next.push({
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
      });
    }
    pts = next;
  }
  return pts[0];
}

class TopsideGame {
  ctx: CanvasRenderingContext2D;
  hooks: Hooks;
  state: GameState = "attract";
  reduced = prefersReducedMotion();
  particles = new ParticlePool();
  raf = 0;
  last: number | null = null;
  time = 0;

  score = 0;
  high = 0;
  lives = 3;
  wave = 1;
  bonusWave = false;
  bonusKills = 0;
  extraLifeGiven = false;

  px = W / 2;
  vx = 0;
  invuln = 0;
  deadTimer = 0;
  shake = 0;

  wasps: Wasp[] = [];
  shots: Shot[] = [];
  spawnQueue: { kind: WaspKind; slotX: number; slotY: number; delay: number; side: 0 | 1 }[] =
    [];
  diveTimer = 3;
  banner = { text: "", ttl: 0 };

  left = false;
  right = false;
  onKeyDown = (e: KeyboardEvent) => {
    if (GAME_KEYS.has(e.code) && this.state !== "attract") e.preventDefault();
    if (e.code === "Enter" && (this.state === "attract" || this.state === "over"))
      this.start();
    else if (e.code === "KeyP" && this.state === "playing") this.setState("paused");
    else if (e.code === "KeyP" && this.state === "paused") this.setState("playing");
    if (this.state !== "playing") return;
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.left = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.right = true;
    if (e.code === "Space") this.fire();
  };
  onKeyUp = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.right = false;
  };

  constructor(canvas: HTMLCanvasElement, hooks: Hooks) {
    this.ctx = fitCanvas(canvas, W, H);
    this.hooks = hooks;
    this.high = loadHighScore(SLUG);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.raf = requestAnimationFrame(this.frame);
    queueMicrotask(() => this.pushHud());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  setState(s: GameState) {
    this.state = s;
    this.pushHud();
  }

  pushHud() {
    this.hooks.onHud({
      score: this.score,
      high: this.high,
      lives: this.lives,
      stage: this.bonusWave ? "BONUS" : `W${this.wave}`,
      state: this.state,
    });
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.extraLifeGiven = false;
    this.px = W / 2;
    this.shots = [];
    this.wasps = [];
    this.particles.clear();
    this.invuln = 0;
    this.deadTimer = 0;
    this.buildWave();
    this.setState("playing");
  }

  buildWave() {
    this.bonusWave = this.wave % 3 === 0 && this.wave > 0 && this.wave % 3 === 0
      ? this.wave % 3 === 0
      : false;
    this.bonusWave = this.wave > 1 && this.wave % 3 === 0;
    this.bonusKills = 0;
    this.wasps = [];
    this.spawnQueue = [];
    this.diveTimer = 3.2;

    const rows: { kind: WaspKind; count: number; y: number }[] = [
      { kind: "hornet", count: 4, y: 96 },
      { kind: "wasp", count: 8, y: 140 },
      { kind: "wasp", count: 10, y: 180 },
    ];
    let i = 0;
    rows.forEach((row) => {
      const gap = Math.min(46, (W - 80) / row.count);
      const x0 = W / 2 - (gap * (row.count - 1)) / 2;
      for (let k = 0; k < row.count; k++) {
        this.spawnQueue.push({
          kind: row.kind,
          slotX: x0 + k * gap,
          slotY: row.y,
          delay: 0.12 * i + Math.floor(i / 6) * 0.7,
          side: (i % 2) as 0 | 1,
        });
        i++;
      }
    });
    this.banner = {
      text: this.bonusWave ? "BONUS SWARM" : `WAVE ${this.wave}`,
      ttl: 1.4,
    };
  }

  entryPath(side: 0 | 1, slotX: number, slotY: number) {
    const sx = side === 0 ? -30 : W + 30;
    const c1 = { x: side === 0 ? W * 0.7 : W * 0.3, y: 120 };
    const c2 = { x: side === 0 ? W * 0.2 : W * 0.8, y: 330 };
    return [{ x: sx, y: 60 }, c1, c2, { x: slotX, y: slotY }];
  }

  divePath(w: Wasp) {
    const dir = w.x < W / 2 ? 1 : -1;
    return [
      { x: w.x, y: w.y },
      { x: w.x + dir * 90, y: w.y + 120 },
      { x: this.px + dir * -40, y: H - 180 },
      { x: this.px, y: H + 60 },
    ];
  }

  fire() {
    if (this.deadTimer > 0) return;
    const live = this.shots.filter((s) => !s.enemy && !s.dead).length;
    if (live >= 2) return;
    this.shots.push({ x: this.px, y: PLAYER_Y - 18, vy: -540, vx: 0, enemy: false, dead: false });
  }

  frame = (ts: number) => {
    this.raf = requestAnimationFrame(this.frame);
    if (this.last === null) {
      this.last = ts;
      return;
    }
    const dt = Math.min((ts - this.last) / 1000, 0.05);
    this.last = ts;
    if (this.state === "playing") {
      this.time += dt;
      this.update(dt);
    }
    this.render();
  };

  update(dt: number) {
    if (this.banner.ttl > 0) this.banner.ttl -= dt;
    this.particles.update(dt);
    if (this.shake > 0) this.shake -= dt;

    if (this.deadTimer > 0) {
      this.deadTimer -= dt;
      if (this.deadTimer <= 0) {
        if (this.lives <= 0) {
          this.high = saveHighScore(SLUG, this.score);
          this.setState("over");
        } else {
          this.px = W / 2;
          this.invuln = 2;
        }
      }
      return;
    }
    if (this.invuln > 0) this.invuln -= dt;

    // player
    const move = (this.left ? -1 : 0) + (this.right ? 1 : 0);
    this.px = clamp(this.px + move * 260 * dt, 26, W - 26);

    // spawns
    for (const q of this.spawnQueue) q.delay -= dt;
    while (this.spawnQueue.length && this.spawnQueue[0].delay <= 0) {
      const q = this.spawnQueue.shift()!;
      this.wasps.push({
        kind: q.kind,
        mode: "entering",
        hp: q.kind === "hornet" ? 2 : 1,
        x: q.side === 0 ? -30 : W + 30,
        y: 60,
        slotX: q.slotX,
        slotY: q.slotY,
        t: 0,
        path: this.entryPath(q.side, q.slotX, q.slotY),
        fireAt: this.bonusWave ? [] : [0.35 + Math.random() * 0.3],
        flash: 0,
        dead: false,
      });
    }

    // wasps
    const sway = Math.sin(this.time * 1.6) * 14;
    for (const w of this.wasps) {
      if (w.dead) continue;
      w.flash = Math.max(0, w.flash - dt * 6);
      if (w.mode === "entering" && w.path) {
        w.t += dt / 2.1;
        const p = bezier(w.path, Math.min(w.t, 1));
        w.x = p.x;
        w.y = p.y;
        if (w.t >= 1) {
          if (this.bonusWave) {
            w.dead = true; // bonus swarm just passes through
            continue;
          }
          w.mode = "slotted";
          w.path = null;
        }
      } else if (w.mode === "slotted") {
        w.x = w.slotX + sway;
        w.y = w.slotY + Math.sin(this.time * 2.2 + w.slotX) * 4;
      } else if (w.mode === "diving" && w.path) {
        w.t += dt / 2.4;
        const p = bezier(w.path, Math.min(w.t, 1));
        w.x = p.x;
        w.y = p.y;
        while (w.fireAt.length && w.t > w.fireAt[0]) {
          w.fireAt.shift();
          const aim = (this.px - w.x) / 1.1;
          this.shots.push({
            x: w.x,
            y: w.y + 10,
            vx: clamp(aim, -140, 140),
            vy: 250 + this.wave * 8,
            enemy: true,
            dead: false,
          });
        }
        if (w.t >= 1) {
          w.mode = "entering";
          w.t = 0.55;
          w.path = this.entryPath(w.x < W / 2 ? 0 : 1, w.slotX, w.slotY);
          w.fireAt = [];
        }
      }
    }

    // dive scheduling
    if (!this.bonusWave) {
      this.diveTimer -= dt;
      if (this.diveTimer <= 0) {
        this.diveTimer = Math.max(0.9, 2.4 - this.wave * 0.12);
        const slotted = this.wasps.filter((w) => !w.dead && w.mode === "slotted");
        const count = Math.min(slotted.length, 1 + Math.floor(this.wave / 2));
        for (let i = 0; i < count; i++) {
          const pick = slotted[Math.floor(Math.random() * slotted.length)];
          if (pick && pick.mode === "slotted") {
            pick.mode = "diving";
            pick.t = 0;
            pick.path = this.divePath(pick);
            pick.fireAt = [0.3 + Math.random() * 0.2, 0.55 + Math.random() * 0.2];
          }
        }
      }
    }

    // shots
    for (const s of this.shots) {
      if (s.dead) continue;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.y < -10 || s.y > H + 10) s.dead = true;
    }

    // player shots vs wasps
    for (const s of this.shots) {
      if (s.dead || s.enemy) continue;
      for (const w of this.wasps) {
        if (w.dead || w.x < -20 || w.x > W + 20) continue;
        const r = w.kind === "hornet" ? 17 : 13;
        if (Math.hypot(s.x - w.x, s.y - w.y) < r) {
          s.dead = true;
          w.hp--;
          w.flash = 1;
          if (w.hp <= 0) {
            w.dead = true;
            const diving = w.mode === "diving" || this.bonusWave;
            const base = w.kind === "hornet" ? 150 : 50;
            const pts = this.bonusWave ? 100 : diving ? base * 2 : base;
            this.score += pts;
            if (this.bonusWave) this.bonusKills++;
            this.particles.burst(
              w.x,
              w.y,
              w.kind === "hornet" ? "#E24B4A" : "#D9C26B",
              16,
              160,
            );
            this.pushHud();
          }
          break;
        }
      }
    }

    // enemy shots / divers vs player
    if (this.invuln <= 0) {
      for (const s of this.shots) {
        if (s.dead || !s.enemy) continue;
        if (Math.abs(s.x - this.px) < 13 && Math.abs(s.y - PLAYER_Y) < 11) {
          s.dead = true;
          this.killPlayer();
        }
      }
      for (const w of this.wasps) {
        if (w.dead || w.mode !== "diving") continue;
        if (Math.hypot(w.x - this.px, w.y - PLAYER_Y) < 19) {
          w.dead = true;
          this.killPlayer();
        }
      }
    }

    this.shots = this.shots.filter((s) => !s.dead);

    // extra hand at 20,000
    if (!this.extraLifeGiven && this.score >= 20000) {
      this.extraLifeGiven = true;
      this.lives++;
      this.banner = { text: "EXTRA HAND", ttl: 1.4 };
      this.pushHud();
    }

    // wave clear
    const alive = this.wasps.some((w) => !w.dead);
    if (!alive && this.spawnQueue.length === 0) {
      if (this.bonusWave && this.bonusKills >= 22) {
        this.score += 1000;
        this.banner = { text: "PERFECT SWEEP +1000", ttl: 1.6 };
      }
      this.wave++;
      this.buildWave();
      this.pushHud();
    }
  }

  killPlayer() {
    this.lives--;
    this.deadTimer = 1.3;
    this.shake = this.reduced ? 0 : 0.25;
    this.particles.burst(this.px, PLAYER_Y, "#E3C77E", 30, 220, 0.9);
    this.pushHud();
  }

  /* ---------------------------------------------------------- rendering */

  render() {
    const { ctx } = this;
    ctx.save();
    if (this.shake > 0) {
      ctx.translate(
        (Math.random() - 0.5) * 6 * this.shake * 4,
        (Math.random() - 0.5) * 6 * this.shake * 4,
      );
    }
    ctx.clearRect(-10, -10, W + 20, H + 20);
    ctx.fillStyle = "#0A0F0C";
    ctx.fillRect(-10, -10, W + 20, H + 20);

    // ember stars drifting
    ctx.fillStyle = "rgba(227,199,126,0.35)";
    for (let i = 0; i < 26; i++) {
      const y = (i * 97 + this.time * 14 * (i % 3 ? 1 : 1.7)) % H;
      const x = (i * 53) % W;
      ctx.fillRect(x, y, 1.6, 1.6);
    }

    // river deck line
    ctx.fillStyle = "#16291F";
    ctx.fillRect(0, H - 24, W, 24);
    ctx.strokeStyle = "rgba(201,161,78,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, H - 24.5, W - 1, 24);

    if (this.state === "playing" || this.state === "paused") {
      this.drawWasps();
      this.drawShots();
      this.drawPlayer();
    }
    this.particles.draw(ctx);

    if (this.banner.ttl > 0 && this.state === "playing") {
      ctx.fillStyle = "#E3C77E";
      ctx.font = "700 28px Fraunces, Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(this.banner.text, W / 2, H / 2 - 60);
    }
    ctx.restore();
  }

  drawPlayer() {
    const { ctx } = this;
    if (this.deadTimer > 0) return;
    if (this.invuln > 0 && Math.floor(this.invuln * 10) % 2 === 0) return;
    ctx.fillStyle = "#2F5240";
    ctx.fillRect(this.px - 16, PLAYER_Y - 4, 32, 12);
    ctx.fillStyle = "#C9A14E";
    ctx.beginPath();
    ctx.moveTo(this.px, PLAYER_Y - 20);
    ctx.lineTo(this.px + 7, PLAYER_Y - 2);
    ctx.lineTo(this.px - 7, PLAYER_Y - 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#E3C77E";
    ctx.fillRect(this.px - 1.6, PLAYER_Y - 26, 3.2, 8);
  }

  drawShots() {
    const { ctx } = this;
    for (const s of this.shots) {
      if (s.dead) continue;
      if (s.enemy) {
        ctx.fillStyle = "#E24B4A";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#E3C77E";
        ctx.fillRect(s.x - 1.5, s.y - 8, 3, 12);
      }
    }
  }

  drawWasps() {
    const { ctx } = this;
    const flap = Math.sin(this.time * 18) * 3;
    for (const w of this.wasps) {
      if (w.dead || w.x < -25 || w.x > W + 25) continue;
      const hornet = w.kind === "hornet";
      const bodyColor = w.flash > 0.5 ? "#EFE6CF" : hornet ? "#A8372C" : "#C8A93C";
      // wings
      ctx.fillStyle = "rgba(220,235,225,0.5)";
      ctx.beginPath();
      ctx.ellipse(w.x - (hornet ? 12 : 9), w.y - 2, hornet ? 8 : 6, 3.5 + flap, -0.4, 0, Math.PI * 2);
      ctx.ellipse(w.x + (hornet ? 12 : 9), w.y - 2, hornet ? 8 : 6, 3.5 - flap, 0.4, 0, Math.PI * 2);
      ctx.fill();
      // body chevron
      ctx.fillStyle = bodyColor;
      const s = hornet ? 1.45 : 1;
      ctx.beginPath();
      ctx.moveTo(w.x, w.y + 9 * s);
      ctx.lineTo(w.x + 8 * s, w.y - 5 * s);
      ctx.lineTo(w.x, w.y - 1 * s);
      ctx.lineTo(w.x - 8 * s, w.y - 5 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#10130E";
      ctx.fillRect(w.x - 2.6, w.y - 3, 2, 2);
      ctx.fillRect(w.x + 0.8, w.y - 3, 2, 2);
    }
  }
}

interface ChalkProp {
  signedIn: boolean;
  action: (formData: FormData) => Promise<void>;
}

export function Topside({ chalk }: { chalk?: ChalkProp }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TopsideGame | null>(null);
  const [hud, setHud] = useState<HudState>({
    score: 0,
    high: 0,
    lives: 3,
    stage: "W1",
    state: "attract",
  });
  const coarse = useCoarsePointer();

  useEffect(() => {
    const game = new TopsideGame(canvasRef.current!, { onHud: setHud });
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  const hold = (side: "left" | "right") => () => {
    if (!gameRef.current) return;
    if (side === "left") gameRef.current.left = true;
    else gameRef.current.right = true;
  };
  const release = () => {
    if (!gameRef.current) return;
    gameRef.current.left = false;
    gameRef.current.right = false;
  };

  return (
    <Cabinet
      title="Topside"
      tagline="The wasps found the boat."
      accent="#D9C26B"
      hud={hud}
      controls={[
        "Left and right work the deck gun",
        "Space fires — two shells in the air, max",
        "Every third wave is a bonus swarm",
      ]}
      onStart={() => gameRef.current?.start()}
      onTogglePause={() =>
        gameRef.current?.setState(
          gameRef.current.state === "paused" ? "playing" : "paused",
        )
      }
      chalk={chalk}
      touch={
        coarse ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                className="h-12 w-16 rounded-md border border-brass/40 bg-card/60 text-lg text-gold-light active:bg-card"
                onPointerDown={hold("left")}
                onPointerUp={release}
                onPointerLeave={release}
                aria-label="Move left"
              >
                ◀
              </button>
              <button
                type="button"
                className="h-12 w-16 rounded-md border border-brass/40 bg-card/60 text-lg text-gold-light active:bg-card"
                onPointerDown={hold("right")}
                onPointerUp={release}
                onPointerLeave={release}
                aria-label="Move right"
              >
                ▶
              </button>
            </div>
            <button
              type="button"
              onClick={() => gameRef.current?.fire()}
              className="h-16 w-16 rounded-full border border-gold-light/60 bg-card/60 font-display text-[10px] font-bold tracking-[0.14em] text-gold-light uppercase active:bg-card"
            >
              Fire
            </button>
          </div>
        ) : undefined
      }
    >
      <canvas
        ref={canvasRef}
        className="block w-full touch-none"
        style={{ aspectRatio: `${W} / ${H}` }}
        aria-label="Topside game screen"
      />
    </Cabinet>
  );
}
