"use client";

import { useEffect, useRef, useState } from "react";

import { Cabinet } from "@/components/arcade/cabinet";
import {
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

const SLUG = "chip-chase";
const COLS = 19;
const ROWS = 21;
const CELL = 24;
const W = COLS * CELL;
const H = ROWS * CELL;

/* Original house maze — drawn from scratch, not a copy of anything sacred. */
const MAZE = [
  "###################",
  "#........#........#",
  "#o##.###.#.###.##o#",
  "#.................#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "####.#.......#.####",
  "####.#.##=##.#.####",
  "T....#.#   #.#....T",
  "####.#.#####.#.####",
  "####.#.......#.####",
  "####.#.#####.#.####",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o.#...........#.o#",
  "##.#.#.#####.#.#.##",
  "#....#...#...#....#",
  "#.######.#.######.#",
  "#.................#",
  "###################",
];

const TUNNEL_ROW = 9;
const PLAYER_START = { c: 9, r: 15 };
const DOOR = { c: 9, r: 8 };
const VAULT_EXIT = { c: 9, r: 7 };

interface Dir {
  x: number;
  y: number;
}
const DIRS: Dir[] = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
];
const STOP: Dir = { x: 0, y: 0 };

type SharpMode = "vault" | "exiting" | "roam" | "frightened" | "eyes";

interface Sharp {
  suit: string;
  color: string;
  c: number;
  r: number;
  x: number;
  y: number;
  dir: Dir;
  mode: SharpMode;
  releaseAt: number;
  bounce: number;
  home: { c: number; r: number };
  scatter: { c: number; r: number };
}

interface Hooks {
  onHud: (h: HudState) => void;
}

class ChipChaseGame {
  ctx: CanvasRenderingContext2D;
  hooks: Hooks;
  state: GameState = "attract";
  reduced = prefersReducedMotion();
  particles = new ParticlePool();
  raf = 0;
  last: number | null = null;
  time = 0;

  walls = new Set<string>();
  doorKey = `${DOOR.c},${DOOR.r}`;
  chips = new Set<string>();
  markers = new Set<string>();

  score = 0;
  high = 0;
  lives = 3;
  round = 1;
  eatChain = 0;

  px = 0;
  py = 0;
  pdir: Dir = STOP;
  pnext: Dir = STOP;
  mouth = 0;
  deadTimer = 0;

  sharps: Sharp[] = [];
  modeTimer = 0;
  modePhase = 0;
  frightened = 0;
  banner = { text: "", ttl: 0 };

  keys = new Set<string>();
  onKeyDown = (e: KeyboardEvent) => {
    if (GAME_KEYS.has(e.code) && this.state !== "attract") e.preventDefault();
    this.keys.add(e.code);
    if (e.code === "Enter" && (this.state === "attract" || this.state === "over"))
      this.start();
    else if (e.code === "KeyP" && this.state === "playing") this.setState("paused");
    else if (e.code === "KeyP" && this.state === "paused") this.setState("playing");
    if (this.state === "playing") {
      const d = this.dirFromKey(e.code);
      if (d) this.pnext = d;
    }
  };
  onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);

  constructor(canvas: HTMLCanvasElement, hooks: Hooks) {
    this.ctx = fitCanvas(canvas, W, H);
    this.hooks = hooks;
    this.high = loadHighScore(SLUG);
    MAZE.forEach((row, r) =>
      row.split("").forEach((ch, c) => {
        if (ch === "#") this.walls.add(`${c},${r}`);
      }),
    );
    this.resetBoard();
    this.resetActors();
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

  dirFromKey(code: string): Dir | null {
    if (code === "ArrowUp" || code === "KeyW") return DIRS[0];
    if (code === "ArrowLeft" || code === "KeyA") return DIRS[1];
    if (code === "ArrowDown" || code === "KeyS") return DIRS[2];
    if (code === "ArrowRight" || code === "KeyD") return DIRS[3];
    return null;
  }

  setDirFromTouch(d: Dir) {
    if (this.state === "playing") this.pnext = d;
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
      stage: `R${this.round}`,
      state: this.state,
    });
  }

  resetBoard() {
    this.chips.clear();
    this.markers.clear();
    MAZE.forEach((row, r) =>
      row.split("").forEach((ch, c) => {
        if (ch === ".") this.chips.add(`${c},${r}`);
        if (ch === "o") this.markers.add(`${c},${r}`);
      }),
    );
  }

  resetActors() {
    this.px = (PLAYER_START.c + 0.5) * CELL;
    this.py = (PLAYER_START.r + 0.5) * CELL;
    this.pdir = STOP;
    this.pnext = STOP;
    this.frightened = 0;
    this.eatChain = 0;
    this.modeTimer = 0;
    this.modePhase = 0;
    const mk = (
      suit: string,
      color: string,
      home: { c: number; r: number },
      scatter: { c: number; r: number },
      releaseAt: number,
      outside = false,
    ): Sharp => ({
      suit,
      color,
      c: home.c,
      r: home.r,
      x: (home.c + 0.5) * CELL,
      y: (home.r + 0.5) * CELL,
      dir: outside ? DIRS[1] : DIRS[0],
      mode: outside ? "roam" : "vault",
      releaseAt,
      bounce: Math.random() * Math.PI,
      home,
      scatter,
    });
    this.sharps = [
      mk("♠", "#5AB1F0", VAULT_EXIT, { c: 17, r: 1 }, 0, true),
      mk("♥", "#E24B4A", { c: 8, r: 9 }, { c: 1, r: 1 }, 2),
      mk("♣", "#63C06A", { c: 9, r: 9 }, { c: 17, r: 19 }, 7),
      mk("♦", "#E89B3C", { c: 10, r: 9 }, { c: 1, r: 19 }, 14),
    ];
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.round = 1;
    this.resetBoard();
    this.resetActors();
    this.particles.clear();
    this.time = 0;
    this.banner = { text: "ROUND 1", ttl: 1.4 };
    this.setState("playing");
  }

  walkable(c: number, r: number, sharp?: Sharp) {
    if (r === TUNNEL_ROW && (c < 0 || c >= COLS)) return true;
    const key = `${c},${r}`;
    if (key === this.doorKey)
      return Boolean(sharp && (sharp.mode === "exiting" || sharp.mode === "eyes"));
    return !this.walls.has(key);
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
    this.mouth += dt * 9;
    if (this.banner.ttl > 0) this.banner.ttl -= dt;
    this.particles.update(dt);

    if (this.deadTimer > 0) {
      this.deadTimer -= dt;
      if (this.deadTimer <= 0) {
        if (this.lives <= 0) {
          this.high = saveHighScore(SLUG, this.score);
          this.setState("over");
        } else {
          this.resetActors();
        }
      }
      return;
    }

    // global pursuit phases: breathe (scatter) then hunt (chase)
    if (this.frightened > 0) {
      this.frightened -= dt;
      if (this.frightened <= 0) this.eatChain = 0;
    } else {
      this.modeTimer += dt;
      const plan = [7, 20, 7, 20, 5, 9999];
      if (this.modeTimer > plan[Math.min(this.modePhase, 5)]) {
        this.modeTimer = 0;
        this.modePhase++;
      }
    }

    this.movePlayer(dt);
    this.sharps.forEach((s) => this.moveSharp(s, dt));
    this.collide();

    if (this.chips.size === 0 && this.markers.size === 0) {
      this.round++;
      this.resetBoard();
      this.resetActors();
      this.banner = { text: `ROUND ${this.round}`, ttl: 1.4 };
      this.pushHud();
    }
  }

  speedScale() {
    return Math.min(1 + (this.round - 1) * 0.05, 1.35);
  }

  movePlayer(dt: number) {
    const speed = 5.2 * CELL * this.speedScale();
    const cx = Math.floor(this.px / CELL);
    const cy = Math.floor(this.py / CELL);
    const centerX = (cx + 0.5) * CELL;
    const centerY = (cy + 0.5) * CELL;
    const atCenter =
      Math.abs(this.px - centerX) < 2.2 && Math.abs(this.py - centerY) < 2.2;

    if (atCenter) {
      if (
        (this.pnext.x || this.pnext.y) &&
        this.walkable(cx + this.pnext.x, cy + this.pnext.y)
      ) {
        this.pdir = this.pnext;
        this.px = centerX;
        this.py = centerY;
      } else if (!this.walkable(cx + this.pdir.x, cy + this.pdir.y)) {
        this.pdir = STOP;
        this.px = centerX;
        this.py = centerY;
      }
    } else if (
      this.pnext.x === -this.pdir.x &&
      this.pnext.y === -this.pdir.y &&
      (this.pnext.x || this.pnext.y)
    ) {
      this.pdir = this.pnext; // reversing is always legal
    }

    this.px += this.pdir.x * speed * dt;
    this.py += this.pdir.y * speed * dt;

    // tunnel wrap
    if (this.px < -CELL / 2) this.px = W + CELL / 2 - 1;
    if (this.px > W + CELL / 2) this.px = -CELL / 2 + 1;

    const key = `${Math.floor(this.px / CELL)},${Math.floor(this.py / CELL)}`;
    if (this.chips.delete(key)) {
      this.score += 10;
      this.pushHud();
    }
    if (this.markers.delete(key)) {
      this.score += 50;
      this.frightened = Math.max(2.5, 6.5 - this.round * 0.5);
      this.eatChain = 0;
      this.sharps.forEach((s) => {
        if (s.mode === "roam") s.dir = { x: -s.dir.x, y: -s.dir.y };
        if (s.mode === "roam") s.mode = "frightened";
      });
      this.pushHud();
    }
  }

  sharpTarget(s: Sharp): { c: number; r: number } {
    const pc = Math.floor(this.px / CELL);
    const pr = Math.floor(this.py / CELL);
    const scatter = this.modePhase % 2 === 0 && this.modePhase < 5;
    if (scatter) return s.scatter;
    switch (s.suit) {
      case "♠":
        return { c: pc, r: pr }; // the Shark: straight at you
      case "♥":
        return { c: pc + this.pdir.x * 4, r: pr + this.pdir.y * 4 }; // the Counter: where you're headed
      case "♣": {
        // the Mirror: reflects you through the vault
        return { c: 2 * DOOR.c - pc, r: 2 * DOOR.r - pr };
      }
      default:
        // the Lush: wanders when close, hunts when far
        return Math.hypot(pc - s.c, pr - s.r) > 7
          ? { c: pc, r: pr }
          : s.scatter;
    }
  }

  moveSharp(s: Sharp, dt: number) {
    const base = 4.7 * CELL * this.speedScale();
    let speed = base;
    if (s.mode === "frightened") speed = base * 0.62;
    if (s.mode === "eyes") speed = base * 1.7;
    if (s.r === TUNNEL_ROW && (s.c <= 0 || s.c >= COLS - 1)) speed *= 0.6;

    if (s.mode === "vault") {
      s.releaseAt -= dt;
      s.bounce += dt * 6;
      s.y = (s.home.r + 0.5) * CELL + Math.sin(s.bounce) * 4;
      if (s.releaseAt <= 0) {
        s.mode = "exiting";
        s.x = (9 + 0.5) * CELL;
        s.y = (9 + 0.5) * CELL;
      }
      return;
    }
    if (s.mode === "exiting") {
      s.y -= speed * dt * 0.8;
      const exitY = (VAULT_EXIT.r + 0.5) * CELL;
      if (s.y <= exitY) {
        s.y = exitY;
        s.mode = this.frightened > 0 ? "frightened" : "roam";
        s.dir = Math.random() < 0.5 ? DIRS[1] : DIRS[3];
      }
      s.c = Math.floor(s.x / CELL);
      s.r = Math.floor(s.y / CELL);
      return;
    }

    const cx = Math.floor(s.x / CELL);
    const cy = Math.floor(s.y / CELL);
    const centerX = (cx + 0.5) * CELL;
    const centerY = (cy + 0.5) * CELL;
    const atCenter =
      Math.abs(s.x - centerX) < 2.2 && Math.abs(s.y - centerY) < 2.2;

    if (atCenter && (cx !== s.c || cy !== s.r || (!s.dir.x && !s.dir.y))) {
      s.c = cx;
      s.r = cy;
      const target =
        s.mode === "eyes" ? { c: DOOR.c, r: VAULT_EXIT.r } : this.sharpTarget(s);
      const options = DIRS.filter(
        (d) =>
          !(d.x === -s.dir.x && d.y === -s.dir.y) &&
          this.walkable(cx + d.x, cy + d.y, s),
      );
      const pool = options.length ? options : [{ x: -s.dir.x, y: -s.dir.y }];
      if (s.mode === "frightened") {
        s.dir = pool[Math.floor(Math.random() * pool.length)];
      } else {
        s.dir = pool.reduce((best, d) => {
          const dist = (dd: Dir) =>
            Math.hypot(cx + dd.x - target.c, cy + dd.y - target.r);
          return dist(d) < dist(best) ? d : best;
        }, pool[0]);
      }
      s.x = centerX;
      s.y = centerY;
    }

    s.x += s.dir.x * speed * dt;
    s.y += s.dir.y * speed * dt;
    if (s.x < -CELL / 2) s.x = W + CELL / 2 - 1;
    if (s.x > W + CELL / 2) s.x = -CELL / 2 + 1;

    // frightened wears off back to the hunt
    if (s.mode === "frightened" && this.frightened <= 0) s.mode = "roam";

    // eyes reaching the vault door drop back in and recover
    if (s.mode === "eyes") {
      const nearDoor =
        Math.abs(s.x - (DOOR.c + 0.5) * CELL) < 4 &&
        Math.abs(s.y - (VAULT_EXIT.r + 0.5) * CELL) < 4;
      if (nearDoor) {
        s.mode = "exiting";
        s.x = (9 + 0.5) * CELL;
        s.y = (9 + 0.5) * CELL;
      }
    }
  }

  collide() {
    for (const s of this.sharps) {
      if (s.mode === "vault" || s.mode === "exiting" || s.mode === "eyes") continue;
      const d = Math.hypot(s.x - this.px, s.y - this.py);
      if (d > CELL * 0.62) continue;
      if (s.mode === "frightened") {
        this.eatChain = Math.min(this.eatChain + 1, 4);
        const pts = 100 * Math.pow(2, this.eatChain);
        this.score += pts;
        s.mode = "eyes";
        this.particles.burst(s.x, s.y, "#E3C77E", 14, 150);
        this.pushHud();
      } else {
        this.lives--;
        this.deadTimer = 1.2;
        this.particles.burst(this.px, this.py, "#E3C77E", 26, 190, 0.8);
        this.pushHud();
        return;
      }
    }
  }

  /* ---------------------------------------------------------- rendering */

  render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0B0F0B";
    ctx.fillRect(0, 0, W, H);

    // walls as felt tiles
    ctx.fillStyle = "#1B3527";
    this.walls.forEach((key) => {
      const [c, r] = key.split(",").map(Number);
      ctx.fillRect(c * CELL + 2, r * CELL + 2, CELL - 4, CELL - 4);
    });
    // vault door
    ctx.fillStyle = "#C9A14E";
    ctx.fillRect(DOOR.c * CELL + 3, DOOR.r * CELL + CELL / 2 - 2, CELL - 6, 4);

    // chips + house markers
    ctx.fillStyle = "#E3C77E";
    this.chips.forEach((key) => {
      const [c, r] = key.split(",").map(Number);
      ctx.beginPath();
      ctx.arc((c + 0.5) * CELL, (r + 0.5) * CELL, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
    const pulse = this.reduced ? 1 : 0.85 + Math.sin(this.time * 5) * 0.2;
    this.markers.forEach((key) => {
      const [c, r] = key.split(",").map(Number);
      const x = (c + 0.5) * CELL;
      const y = (r + 0.5) * CELL;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "#C9A14E";
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
    });

    if (this.state === "playing" || this.state === "paused") {
      this.drawSharps();
      this.drawPlayer();
    }
    this.particles.draw(ctx);

    if (this.banner.ttl > 0 && this.state === "playing") {
      ctx.fillStyle = "#E3C77E";
      ctx.font = "700 26px Fraunces, Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(this.banner.text, W / 2, (11.5 + 0.2) * CELL);
    }
  }

  drawPlayer() {
    const { ctx } = this;
    if (this.deadTimer > 0 && Math.floor(this.deadTimer * 10) % 2 === 0) return;
    const angle = Math.atan2(this.pdir.y, this.pdir.x);
    const open =
      this.pdir === STOP ? 0.12 : 0.14 + Math.abs(Math.sin(this.mouth)) * 0.38;
    ctx.save();
    ctx.translate(this.px, this.py);
    if (this.pdir.x || this.pdir.y) ctx.rotate(angle);
    ctx.fillStyle = "#E3C77E";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 9.5, open, Math.PI * 2 - open);
    ctx.closePath();
    ctx.fill();
    // chip edge ticks
    ctx.strokeStyle = "#241A12";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const a = open + ((Math.PI * 2 - open * 2) / 6) * (i + 0.5);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 6.5, Math.sin(a) * 6.5);
      ctx.lineTo(Math.cos(a) * 9.5, Math.sin(a) * 9.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawSharps() {
    const { ctx } = this;
    for (const s of this.sharps) {
      if (s.mode === "eyes") {
        ctx.fillStyle = "#EFE6CF";
        ctx.beginPath();
        ctx.arc(s.x - 4, s.y - 2, 3, 0, Math.PI * 2);
        ctx.arc(s.x + 4, s.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      const flash =
        s.mode === "frightened" &&
        this.frightened < 1.8 &&
        Math.floor(this.frightened * 6) % 2 === 0;
      const body =
        s.mode === "frightened" ? (flash ? "#EFE6CF" : "#3D4E6E") : s.color;
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(s.x, s.y - 1.5, 9.5, Math.PI, 0);
      ctx.lineTo(s.x + 9.5, s.y + 8);
      for (let i = 0; i < 3; i++) {
        ctx.lineTo(s.x + 9.5 - (i * 2 + 1) * (19 / 6), s.y + 4.5);
        ctx.lineTo(s.x + 9.5 - (i + 1) * (19 / 3), s.y + 8);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = s.mode === "frightened" ? "#E3C77E" : "#10130E";
      ctx.font = "bold 11px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(s.mode === "frightened" ? "?" : s.suit, s.x, s.y + 3.5);
    }
  }
}

const TOUCH_DIRS: { label: string; dir: Dir; area: string }[] = [
  { label: "▲", dir: DIRS[0], area: "up" },
  { label: "◀", dir: DIRS[1], area: "left" },
  { label: "▼", dir: DIRS[2], area: "down" },
  { label: "▶", dir: DIRS[3], area: "right" },
];

interface ChalkProp {
  signedIn: boolean;
  action: (formData: FormData) => Promise<void>;
}

export function ChipChase({ chalk }: { chalk?: ChalkProp }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ChipChaseGame | null>(null);
  const [hud, setHud] = useState<HudState>({
    score: 0,
    high: 0,
    lives: 3,
    stage: "R1",
    state: "attract",
  });
  const coarse = useCoarsePointer();

  useEffect(() => {
    const game = new ChipChaseGame(canvasRef.current!, { onHud: setHud });
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  // swipe steering
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    touchStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.hypot(dx, dy) < 22) return;
    const dir =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? DIRS[3]
          : DIRS[1]
        : dy > 0
          ? DIRS[2]
          : DIRS[0];
    gameRef.current?.setDirFromTouch(dir);
  };

  return (
    <Cabinet
      title="Chip Chase"
      tagline="Clear the table. Mind the sharps."
      accent="#E3C77E"
      hud={hud}
      controls={[
        "Arrows or WASD to run the maze",
        "House markers turn the tables",
        "P pauses · swipe steers on touch",
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
          <div className="grid grid-cols-3 gap-2" style={{ gridTemplateAreas: '". up ." "left down right"' }}>
            {TOUCH_DIRS.map((t) => (
              <button
                key={t.area}
                type="button"
                style={{ gridArea: t.area }}
                className="h-12 rounded-md border border-brass/40 bg-card/60 text-lg text-gold-light active:bg-card"
                onClick={() => gameRef.current?.setDirFromTouch(t.dir)}
                aria-label={`Move ${t.area}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : undefined
      }
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="block w-full touch-none"
        style={{ aspectRatio: `${W} / ${H}` }}
        aria-label="Chip Chase game screen"
      />
    </Cabinet>
  );
}
