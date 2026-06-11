"use client";

import { useEffect, useRef, useState } from "react";

import { Cabinet } from "@/components/arcade/cabinet";
import {
  fitCanvas,
  GAME_KEYS,
  loadHighScore,
  ParticlePool,
  saveHighScore,
  type GameState,
  type HudState,
  useCoarsePointer,
} from "@/lib/arcade/canvas";

const SLUG = "boiler-dig";
const COLS = 15;
const ROWS = 13; // row 0 is the deck; rows 1..12 are soot and soil
const CELL = 32;
const W = COLS * CELL;
const H = ROWS * CELL;

const STRATA = ["#3B2F22", "#36281C", "#2E2117", "#271B12"];
const DUG = "#130E09";

interface Dir {
  x: number;
  y: number;
}
const UP: Dir = { x: 0, y: -1 };
const LEFT: Dir = { x: -1, y: 0 };
const DOWN: Dir = { x: 0, y: 1 };
const RIGHT: Dir = { x: 1, y: 0 };
const STOP: Dir = { x: 0, y: 0 };

type CritterKind = "mite" | "imp";

interface Critter {
  kind: CritterKind;
  x: number;
  y: number;
  dir: Dir;
  ghost: boolean;
  repath: number;
  path: { c: number; r: number }[];
  // imp fire
  charge: number;
  flame: number;
  flameDir: 1 | -1;
  dead: boolean;
}

interface Crate {
  c: number;
  r: number;
  state: "rest" | "wobble" | "fall";
  timer: number;
  y: number;
  fell: number;
  gone: boolean;
}

interface Hooks {
  onHud: (h: HudState) => void;
}

const key = (c: number, r: number) => `${c},${r}`;

class BoilerDigGame {
  ctx: CanvasRenderingContext2D;
  hooks: Hooks;
  state: GameState = "attract";
  particles = new ParticlePool();
  raf = 0;
  last: number | null = null;
  time = 0;

  soil = new Set<string>();
  nuggets = new Set<string>();
  critters: Critter[] = [];
  crates: Crate[] = [];

  score = 0;
  high = 0;
  lives = 3;
  round = 1;

  px = 0;
  py = 0;
  pdir: Dir = STOP;
  want: Dir = STOP;
  facing: Dir = RIGHT;
  lance = 0;
  lanceCooldown = 0;
  deadTimer = 0;
  banner = { text: "", ttl: 0 };

  onKeyDown = (e: KeyboardEvent) => {
    if (GAME_KEYS.has(e.code) && this.state !== "attract") e.preventDefault();
    if (e.code === "Enter" && (this.state === "attract" || this.state === "over"))
      this.start();
    else if (e.code === "KeyP" && this.state === "playing") this.setState("paused");
    else if (e.code === "KeyP" && this.state === "paused") this.setState("playing");
    if (this.state !== "playing") return;
    if (e.code === "ArrowUp" || e.code === "KeyW") this.want = UP;
    else if (e.code === "ArrowLeft" || e.code === "KeyA") this.want = LEFT;
    else if (e.code === "ArrowDown" || e.code === "KeyS") this.want = DOWN;
    else if (e.code === "ArrowRight" || e.code === "KeyD") this.want = RIGHT;
    else if (e.code === "Space") this.fire();
  };
  onKeyUp = (e: KeyboardEvent) => {
    const d = this.want;
    if (
      ((e.code === "ArrowUp" || e.code === "KeyW") && d === UP) ||
      ((e.code === "ArrowLeft" || e.code === "KeyA") && d === LEFT) ||
      ((e.code === "ArrowDown" || e.code === "KeyS") && d === DOWN) ||
      ((e.code === "ArrowRight" || e.code === "KeyD") && d === RIGHT)
    )
      this.want = STOP;
  };

  constructor(canvas: HTMLCanvasElement, hooks: Hooks) {
    this.ctx = fitCanvas(canvas, W, H);
    this.hooks = hooks;
    this.high = loadHighScore(SLUG);
    this.buildBoard();
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
      stage: `B${this.round}`,
      state: this.state,
    });
  }

  buildBoard() {
    this.soil.clear();
    this.nuggets.clear();
    for (let r = 1; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) this.soil.add(key(c, r));

    // starting shaft below the boiler hatch
    for (let r = 1; r <= 4; r++) this.soil.delete(key(7, r));

    // critter pockets
    const pockets: [number, number, number][] = [
      [2, 3, 3],
      [10, 6, 3],
      [3, 9, 3],
      [11, 10, 2],
    ];
    pockets.forEach(([c0, r, len]) => {
      for (let c = c0; c < c0 + len; c++) this.soil.delete(key(c, r));
    });

    // salvage nuggets buried in the soot
    const spots = [
      [1, 5],
      [5, 7],
      [13, 3],
      [8, 9],
      [4, 12],
      [12, 12],
    ];
    spots.forEach(([c, r]) => this.nuggets.add(key(c, r)));

    // loose cargo
    this.crates = [
      [4, 2],
      [11, 4],
      [7, 7],
      [2, 8],
      [13, 8],
    ].map(([c, r]) => {
      this.soil.delete(key(c, r));
      return { c, r, state: "rest" as const, timer: 0, y: r * CELL, fell: 0, gone: false };
    });

    this.spawnActors(true);
  }

  spawnActors(fresh: boolean) {
    this.px = 7.5 * CELL;
    this.py = 0.5 * CELL;
    this.pdir = STOP;
    this.want = STOP;
    this.facing = RIGHT;
    this.lance = 0;
    this.lanceCooldown = 0;

    if (fresh) {
      const mites = Math.min(3 + Math.floor(this.round / 2), 6);
      const spawns = [
        { c: 3, r: 3 },
        { c: 11, r: 6 },
        { c: 4, r: 9 },
        { c: 11, r: 10 },
        { c: 2, r: 3 },
        { c: 10, r: 6 },
      ];
      this.critters = [];
      for (let i = 0; i < mites; i++) {
        const s = spawns[i % spawns.length];
        this.critters.push(this.makeCritter("mite", s.c, s.r));
      }
      const imps = Math.min(1 + Math.floor((this.round - 1) / 2), 3);
      const impSpawns = [
        { c: 12, r: 10 },
        { c: 2, r: 9 },
        { c: 10, r: 6 },
      ];
      for (let i = 0; i < imps; i++) {
        const s = impSpawns[i % impSpawns.length];
        this.critters.push(this.makeCritter("imp", s.c, s.r));
      }
    }
  }

  makeCritter(kind: CritterKind, c: number, r: number): Critter {
    return {
      kind,
      x: (c + 0.5) * CELL,
      y: (r + 0.5) * CELL,
      dir: LEFT,
      ghost: false,
      repath: Math.random() * 0.4,
      path: [],
      charge: 0,
      flame: 0,
      flameDir: 1,
      dead: false,
    };
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.round = 1;
    this.buildBoard();
    this.particles.clear();
    this.banner = { text: "BOILER 1", ttl: 1.4 };
    this.setState("playing");
  }

  fire() {
    if (this.lanceCooldown > 0 || this.lance > 0) return;
    this.lance = 0.18;
    this.lanceCooldown = 0.75;
  }

  dug(c: number, r: number) {
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
    if (this.crates.some((b) => !b.gone && b.state !== "fall" && b.c === c && b.r === r))
      return false;
    return r === 0 || !this.soil.has(key(c, r));
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

    if (this.deadTimer > 0) {
      this.deadTimer -= dt;
      if (this.deadTimer <= 0) {
        if (this.lives <= 0) {
          this.high = saveHighScore(SLUG, this.score);
          this.setState("over");
        } else {
          this.spawnActors(false);
        }
      }
      return;
    }

    this.movePlayer(dt);
    this.critters.forEach((m) => this.moveCritter(m, dt));
    this.updateCrates(dt);

    if (this.lance > 0) {
      this.lance -= dt;
      this.lanceHits();
    }
    if (this.lanceCooldown > 0) this.lanceCooldown -= dt;

    this.critters = this.critters.filter((m) => !m.dead);
    if (this.critters.length === 0) {
      this.round++;
      this.score += 500;
      this.buildBoard();
      this.banner = { text: `BOILER ${this.round}`, ttl: 1.4 };
      this.pushHud();
    }
  }

  movePlayer(dt: number) {
    const cx = Math.floor(this.px / CELL);
    const cy = Math.floor(this.py / CELL);
    const inSoil = this.soil.has(key(cx, cy));
    const speed = (inSoil ? 2.6 : 3.7) * CELL * Math.min(1 + this.round * 0.03, 1.25);

    const centerX = (cx + 0.5) * CELL;
    const centerY = (cy + 0.5) * CELL;
    const atCenter =
      Math.abs(this.px - centerX) < 2.4 && Math.abs(this.py - centerY) < 2.4;

    const blockedByCrate = (c: number, r: number) =>
      this.crates.some((b) => !b.gone && b.state !== "fall" && b.c === c && b.r === r);
    const can = (d: Dir) => {
      const nc = cx + d.x;
      const nr = cy + d.y;
      if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) return false;
      return !blockedByCrate(nc, nr);
    };

    if (atCenter) {
      if ((this.want.x || this.want.y) && can(this.want)) {
        this.pdir = this.want;
        this.facing = this.want;
        this.px = centerX;
        this.py = centerY;
      } else if (!this.want.x && !this.want.y) {
        this.pdir = STOP;
      } else if (!can(this.pdir)) {
        this.pdir = STOP;
      }
    } else if (
      this.want.x === -this.pdir.x &&
      this.want.y === -this.pdir.y &&
      (this.want.x || this.want.y)
    ) {
      this.pdir = this.want;
      this.facing = this.want;
    }

    this.px += this.pdir.x * speed * dt;
    this.py += this.pdir.y * speed * dt;
    this.px = Math.max(CELL / 2, Math.min(W - CELL / 2, this.px));
    this.py = Math.max(CELL / 2, Math.min(H - CELL / 2, this.py));

    const nc = Math.floor(this.px / CELL);
    const nr = Math.floor(this.py / CELL);
    if (this.soil.delete(key(nc, nr))) {
      this.score += 5;
      if (this.nuggets.delete(key(nc, nr))) {
        this.score += 150;
        this.particles.burst(this.px, this.py, "#E3C77E", 10, 110);
      }
      this.pushHud();
    }
  }

  repath(m: Critter) {
    // breadth first through dug cells toward the stoker
    const start = { c: Math.floor(m.x / CELL), r: Math.floor(m.y / CELL) };
    const goal = { c: Math.floor(this.px / CELL), r: Math.floor(this.py / CELL) };
    const seen = new Set<string>([key(start.c, start.r)]);
    const queue: { c: number; r: number; path: { c: number; r: number }[] }[] = [
      { ...start, path: [] },
    ];
    let guard = 0;
    while (queue.length && guard++ < 140) {
      const cur = queue.shift()!;
      if (cur.c === goal.c && cur.r === goal.r) {
        m.path = cur.path;
        m.ghost = false;
        return;
      }
      for (const d of [UP, LEFT, DOWN, RIGHT]) {
        const nc = cur.c + d.x;
        const nr = cur.r + d.y;
        const k = key(nc, nr);
        if (seen.has(k) || !this.dug(nc, nr)) continue;
        seen.add(k);
        queue.push({ c: nc, r: nr, path: [...cur.path, { c: nc, r: nr }] });
      }
    }
    m.path = [];
    m.ghost = true; // no tunnel route — seep through the soot
  }

  moveCritter(m: Critter, dt: number) {
    if (m.kind === "imp") {
      if (m.flame > 0) {
        m.flame -= dt;
        this.checkFlame(m);
        return;
      }
      if (m.charge > 0) {
        m.charge -= dt;
        if (m.charge <= 0) {
          m.flame = 0.38;
          m.flameDir = this.px < m.x ? -1 : 1;
        }
        return;
      }
      const sameRow = Math.abs(this.py - m.y) < CELL * 0.6;
      const dist = Math.abs(this.px - m.x) / CELL;
      if (sameRow && dist < 3.4 && Math.random() < 0.012) {
        m.charge = 0.55;
        return;
      }
    }

    m.repath -= dt;
    if (m.repath <= 0) {
      m.repath = 0.45;
      this.repath(m);
    }

    const speed =
      (m.ghost ? 1.05 : m.kind === "imp" ? 2.2 : 2.7) *
      CELL *
      Math.min(1 + this.round * 0.05, 1.4);

    if (m.ghost) {
      const dx = this.px - m.x;
      const dy = this.py - m.y;
      const len = Math.hypot(dx, dy) || 1;
      m.x += (dx / len) * speed * dt;
      m.y += (dy / len) * speed * dt;
    } else if (m.path.length) {
      const next = m.path[0];
      const tx = (next.c + 0.5) * CELL;
      const ty = (next.r + 0.5) * CELL;
      const dx = tx - m.x;
      const dy = ty - m.y;
      const len = Math.hypot(dx, dy);
      if (len < 2.5) m.path.shift();
      else {
        m.x += (dx / len) * speed * dt;
        m.y += (dy / len) * speed * dt;
      }
    }

    if (Math.hypot(m.x - this.px, m.y - this.py) < CELL * 0.55) this.killPlayer();
  }

  checkFlame(m: Critter) {
    const reach = 3 * CELL;
    const y = m.y;
    const x0 = m.x;
    const x1 = m.x + m.flameDir * reach;
    const inX =
      this.px > Math.min(x0, x1) - 8 && this.px < Math.max(x0, x1) + 8;
    if (inX && Math.abs(this.py - y) < CELL * 0.5) this.killPlayer();
  }

  lanceHits() {
    const reach = 2.3 * CELL;
    for (const m of this.critters) {
      if (m.dead) continue;
      const proj =
        (m.x - this.px) * this.facing.x + (m.y - this.py) * this.facing.y;
      const t = Math.max(0, Math.min(1, proj / reach));
      const lx = this.px + this.facing.x * reach * t;
      const ly = this.py + this.facing.y * reach * t;
      if (Math.hypot(m.x - lx, m.y - ly) < CELL * 0.5) {
        m.dead = true;
        const depth = Math.floor(m.y / CELL);
        const pts = (100 + depth * 25) * (m.kind === "imp" ? 1.5 : 1);
        this.score += Math.round(pts);
        this.particles.burst(m.x, m.y, "#9FE0B0", 14, 140);
        this.pushHud();
      }
    }
  }

  updateCrates(dt: number) {
    for (const b of this.crates) {
      if (b.gone) continue;
      if (b.state === "rest") {
        const below = key(b.c, b.r + 1);
        const supported =
          b.r + 1 >= ROWS ||
          this.soil.has(below) ||
          this.crates.some(
            (o) => !o.gone && o !== b && o.c === b.c && o.r === b.r + 1 && o.state !== "fall",
          );
        const playerUnder =
          Math.floor(this.px / CELL) === b.c &&
          Math.floor(this.py / CELL) === b.r + 1;
        if (!supported && !playerUnder) {
          b.state = "wobble";
          b.timer = 0.6;
        }
      } else if (b.state === "wobble") {
        b.timer -= dt;
        if (b.timer <= 0) {
          b.state = "fall";
          b.fell = 0;
        }
      } else if (b.state === "fall") {
        b.y += 7.5 * CELL * dt;
        const newRow = Math.floor((b.y + CELL) / CELL);
        // crush checks
        for (const m of this.critters) {
          if (
            !m.dead &&
            Math.floor(m.x / CELL) === b.c &&
            m.y > b.y &&
            m.y < b.y + CELL * 1.2
          ) {
            m.dead = true;
            this.score += 200;
            this.particles.burst(m.x, m.y, "#C9A14E", 16, 150);
            this.pushHud();
          }
        }
        if (
          Math.floor(this.px / CELL) === b.c &&
          this.py > b.y &&
          this.py < b.y + CELL * 1.1
        )
          this.killPlayer();

        const blockedBelow =
          newRow >= ROWS ||
          this.soil.has(key(b.c, newRow)) ||
          this.crates.some(
            (o) => !o.gone && o !== b && o.c === b.c && o.r === newRow && o.state === "rest",
          );
        if (blockedBelow) {
          const landedRow = newRow - 1;
          b.fell = landedRow - b.r;
          b.r = landedRow;
          b.y = landedRow * CELL;
          if (b.fell >= 2) {
            b.gone = true;
            this.score += 250;
            this.particles.burst(
              (b.c + 0.5) * CELL,
              (b.r + 0.5) * CELL,
              "#C9A14E",
              20,
              170,
            );
            this.pushHud();
          } else {
            b.state = "rest";
          }
        }
      }
    }
  }

  killPlayer() {
    if (this.deadTimer > 0) return;
    this.lives--;
    this.deadTimer = 1.2;
    this.particles.burst(this.px, this.py, "#E3C77E", 26, 190, 0.8);
    this.pushHud();
  }

  /* ---------------------------------------------------------- rendering */

  render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, W, H);

    // deck row
    ctx.fillStyle = "#16291F";
    ctx.fillRect(0, 0, W, CELL);
    ctx.strokeStyle = "rgba(201,161,78,0.25)";
    ctx.lineWidth = 1;
    for (let c = 0; c < COLS; c += 2) {
      ctx.strokeRect(c * CELL + 0.5, 4.5, CELL * 2 - 1, CELL - 9);
    }

    // soil strata + dug
    for (let r = 1; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const band = Math.min(Math.floor((r - 1) / 3), 3);
        ctx.fillStyle = this.soil.has(key(c, r)) ? STRATA[band] : DUG;
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    // buried salvage glints
    this.nuggets.forEach((k) => {
      const [c, r] = k.split(",").map(Number);
      if (!this.soil.has(k)) return;
      const x = (c + 0.5) * CELL;
      const y = (r + 0.5) * CELL;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "rgba(227,199,126,0.55)";
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
    });

    // crates
    for (const b of this.crates) {
      if (b.gone) continue;
      const wob =
        b.state === "wobble" ? Math.sin(this.time * 40) * 2.5 : 0;
      const y = b.state === "fall" ? b.y : b.r * CELL;
      ctx.fillStyle = "#3B2A20";
      ctx.fillRect(b.c * CELL + 3 + wob, y + 3, CELL - 6, CELL - 6);
      ctx.strokeStyle = "#C9A14E";
      ctx.lineWidth = 2;
      ctx.strokeRect(b.c * CELL + 5 + wob, y + 5, CELL - 10, CELL - 10);
      ctx.beginPath();
      ctx.moveTo(b.c * CELL + 5 + wob, y + 5);
      ctx.lineTo(b.c * CELL + CELL - 5 + wob, y + CELL - 5);
      ctx.stroke();
    }

    if (this.state === "playing" || this.state === "paused") {
      this.drawCritters();
      this.drawPlayer();
    }
    this.particles.draw(ctx);

    if (this.banner.ttl > 0 && this.state === "playing") {
      ctx.fillStyle = "#E3C77E";
      ctx.font = "700 26px Fraunces, Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(this.banner.text, W / 2, CELL * 0.7 + 8);
    }
  }

  drawPlayer() {
    const { ctx } = this;
    if (this.deadTimer > 0 && Math.floor(this.deadTimer * 10) % 2 === 0) return;

    // steam lance
    if (this.lance > 0) {
      const reach = 2.3 * CELL;
      ctx.strokeStyle = "rgba(220,240,230,0.9)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.lineTo(this.px + this.facing.x * reach, this.py + this.facing.y * reach);
      ctx.stroke();
      ctx.strokeStyle = "rgba(160,220,200,0.5)";
      ctx.lineWidth = 9;
      ctx.stroke();
    }

    ctx.fillStyle = "#2F5240";
    ctx.fillRect(this.px - 8, this.py - 4, 16, 13);
    ctx.fillStyle = "#E3C77E";
    ctx.beginPath();
    ctx.arc(this.px, this.py - 7, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#10130E";
    const ex = this.facing.x * 2;
    ctx.fillRect(this.px - 2 + ex, this.py - 9, 1.8, 2.6);
    ctx.fillRect(this.px + 1 + ex, this.py - 9, 1.8, 2.6);
  }

  drawCritters() {
    const { ctx } = this;
    for (const m of this.critters) {
      if (m.dead) continue;
      ctx.globalAlpha = m.ghost ? 0.5 : 1;
      if (m.kind === "mite") {
        ctx.fillStyle = "#D85A4A";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#D85A4A";
        ctx.lineWidth = 2;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(m.x + 7 * s, m.y + 3);
          ctx.lineTo(m.x + 12 * s, m.y + 8);
          ctx.stroke();
        }
        ctx.fillStyle = "#10130E";
        ctx.fillRect(m.x - 4, m.y - 3, 2.4, 2.4);
        ctx.fillRect(m.x + 2, m.y - 3, 2.4, 2.4);
      } else {
        const charging = m.charge > 0 && Math.floor(this.time * 14) % 2 === 0;
        ctx.fillStyle = charging ? "#F0A030" : "#8E3B2C";
        ctx.fillRect(m.x - 9, m.y - 8, 18, 16);
        ctx.fillStyle = "#10130E";
        ctx.fillRect(m.x - 5, m.y - 4, 3, 3);
        ctx.fillRect(m.x + 2, m.y - 4, 3, 3);
        if (m.flame > 0) {
          const fx = m.x + m.flameDir * 10;
          ctx.fillStyle = "rgba(240,160,48,0.9)";
          for (let i = 0; i < 3; i++) {
            const seg = fx + m.flameDir * i * CELL * 0.95;
            ctx.beginPath();
            ctx.moveTo(seg, m.y - 7 + i);
            ctx.lineTo(seg + m.flameDir * CELL * 0.9, m.y);
            ctx.lineTo(seg, m.y + 7 - i);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    }
  }
}

interface ChalkProp {
  signedIn: boolean;
  action: (formData: FormData) => Promise<void>;
}

export function BoilerDig({ chalk }: { chalk?: ChalkProp }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BoilerDigGame | null>(null);
  const [hud, setHud] = useState<HudState>({
    score: 0,
    high: 0,
    lives: 3,
    stage: "B1",
    state: "attract",
  });
  const coarse = useCoarsePointer();

  useEffect(() => {
    const game = new BoilerDigGame(canvasRef.current!, { onHud: setHud });
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  const hold = (d: Dir) => () => {
    if (gameRef.current) gameRef.current.want = d;
  };
  const release = () => {
    if (gameRef.current) gameRef.current.want = STOP;
  };

  return (
    <Cabinet
      title="Boiler Dig"
      tagline="Carve the soot. Drop the cargo."
      accent="#9FE0B0"
      hud={hud}
      controls={[
        "Arrows or WASD to dig",
        "Space vents the steam lance",
        "Loose cargo falls — stand clear",
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
            <div
              className="grid w-44 grid-cols-3 gap-2"
              style={{ gridTemplateAreas: '". up ." "left down right"' }}
            >
              {(
                [
                  ["up", "▲", UP],
                  ["left", "◀", LEFT],
                  ["down", "▼", DOWN],
                  ["right", "▶", RIGHT],
                ] as [string, string, Dir][]
              ).map(([area, label, d]) => (
                <button
                  key={area}
                  type="button"
                  style={{ gridArea: area }}
                  className="h-11 rounded-md border border-brass/40 bg-card/60 text-base text-gold-light active:bg-card"
                  onPointerDown={hold(d)}
                  onPointerUp={release}
                  onPointerLeave={release}
                  aria-label={`Dig ${area}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => gameRef.current?.fire()}
              className="h-16 w-16 rounded-full border border-gold-light/60 bg-card/60 font-display text-[10px] font-bold tracking-[0.14em] text-gold-light uppercase active:bg-card"
            >
              Steam
            </button>
          </div>
        ) : undefined
      }
    >
      <canvas
        ref={canvasRef}
        className="block w-full touch-none"
        style={{ aspectRatio: `${W} / ${H}` }}
        aria-label="Boiler Dig game screen"
      />
    </Cabinet>
  );
}
