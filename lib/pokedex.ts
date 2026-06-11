import rawDex from "@/lib/pokedex-data.json";

export interface DexMon {
  /** National dex number. */
  i: number;
  /** Display name. */
  n: string;
  /** Generation 1–9. */
  g: number;
  /** One or two types, primary first. */
  t: string[];
}

export const DEX: DexMon[] = rawDex as DexMon[];

export const MON_BY_ID = new Map(DEX.map((m) => [m.i, m]));

export const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy",
] as const;

export type TypeName = (typeof ALL_TYPES)[number];

/** Display colors per type — tuned to sit on the bottle green felt. */
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A28C", fire: "#E5823A", water: "#5B96D9", electric: "#E5C53A",
  grass: "#6BBF59", ice: "#7FCFCF", fighting: "#C04A3C", poison: "#9A5A9E",
  ground: "#D0A95B", flying: "#9FA8DB", psychic: "#E16A92", bug: "#9CB53A",
  rock: "#B0A04A", ghost: "#6F5E9C", dragon: "#6F5EE0", dark: "#6E5A4B",
  steel: "#A8A8C0", fairy: "#E29AD9",
};

/**
 * The attacking type chart (current rules, Fairy included).
 * x2 = super effective, x05 = resisted, x0 = no effect.
 */
const CHART: Record<TypeName, { x2: TypeName[]; x05: TypeName[]; x0: TypeName[] }> = {
  normal: { x2: [], x05: ["rock", "steel"], x0: ["ghost"] },
  fire: { x2: ["grass", "ice", "bug", "steel"], x05: ["fire", "water", "rock", "dragon"], x0: [] },
  water: { x2: ["fire", "ground", "rock"], x05: ["water", "grass", "dragon"], x0: [] },
  electric: { x2: ["water", "flying"], x05: ["electric", "grass", "dragon"], x0: ["ground"] },
  grass: { x2: ["water", "ground", "rock"], x05: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"], x0: [] },
  ice: { x2: ["grass", "ground", "flying", "dragon"], x05: ["fire", "water", "ice", "steel"], x0: [] },
  fighting: { x2: ["normal", "ice", "rock", "dark", "steel"], x05: ["poison", "flying", "psychic", "bug", "fairy"], x0: ["ghost"] },
  poison: { x2: ["grass", "fairy"], x05: ["poison", "ground", "rock", "ghost"], x0: ["steel"] },
  ground: { x2: ["fire", "electric", "poison", "rock", "steel"], x05: ["grass", "bug"], x0: ["flying"] },
  flying: { x2: ["grass", "fighting", "bug"], x05: ["electric", "rock", "steel"], x0: [] },
  psychic: { x2: ["fighting", "poison"], x05: ["psychic", "steel"], x0: ["dark"] },
  bug: { x2: ["grass", "psychic", "dark"], x05: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"], x0: [] },
  rock: { x2: ["fire", "ice", "flying", "bug"], x05: ["fighting", "ground", "steel"], x0: [] },
  ghost: { x2: ["psychic", "ghost"], x05: ["dark"], x0: ["normal"] },
  dragon: { x2: ["dragon"], x05: ["steel"], x0: ["fairy"] },
  dark: { x2: ["psychic", "ghost"], x05: ["fighting", "dark", "fairy"], x0: [] },
  steel: { x2: ["ice", "rock", "fairy"], x05: ["fire", "water", "electric", "steel"], x0: [] },
  fairy: { x2: ["fighting", "dragon", "dark"], x05: ["fire", "poison", "steel"], x0: [] },
};

/** Damage multiplier for one attacking type into one defending type. */
function single(attacking: TypeName, defending: TypeName): number {
  const row = CHART[attacking];
  if (row.x0.includes(defending)) return 0;
  if (row.x2.includes(defending)) return 2;
  if (row.x05.includes(defending)) return 0.5;
  return 1;
}

/** Multiplier for an attacking type into a full typing (one or two types). */
export function effectiveness(attacking: TypeName, defending: string[]): number {
  return defending.reduce((acc, d) => acc * single(attacking, d as TypeName), 1);
}

export interface TeamReport {
  /** Attacking types that hit several members for 2x or worse, with counts. */
  weakSpots: { type: TypeName; count: number; worst: number }[];
  /** Attacking types that several members resist or ignore. */
  walls: { type: TypeName; count: number }[];
  /** Defending types nobody on the team hits super effectively with STAB. */
  gaps: TypeName[];
}

export function analyzeTeam(team: DexMon[]): TeamReport {
  const weakSpots: TeamReport["weakSpots"] = [];
  const walls: TeamReport["walls"] = [];

  // Thresholds shrink with the squad so a one or two member draft
  // still gets a useful read instead of silence.
  const weakAt = Math.min(2, Math.max(team.length, 1));
  const wallAt = Math.min(3, Math.max(team.length, 1));

  for (const attacking of ALL_TYPES) {
    let weakCount = 0;
    let worst = 1;
    let resistCount = 0;
    for (const mon of team) {
      const mult = effectiveness(attacking, mon.t);
      if (mult >= 2) {
        weakCount++;
        worst = Math.max(worst, mult);
      }
      if (mult <= 0.5) resistCount++;
    }
    if (weakCount >= weakAt) weakSpots.push({ type: attacking, count: weakCount, worst });
    if (resistCount >= wallAt) walls.push({ type: attacking, count: resistCount });
  }

  const covered = new Set<TypeName>();
  for (const mon of team) {
    for (const stab of mon.t) {
      for (const target of CHART[stab as TypeName]?.x2 ?? []) covered.add(target);
    }
  }
  const gaps = ALL_TYPES.filter((t) => !covered.has(t));

  weakSpots.sort((a, b) => b.worst - a.worst || b.count - a.count);
  walls.sort((a, b) => b.count - a.count);

  return { weakSpots, walls, gaps: team.length === 0 ? [] : gaps };
}

/** 96px pixel sprite — tiny files, period charm. */
export function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
