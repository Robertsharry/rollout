import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

export interface EvolutionStage {
  name: string;
  dexId: number;
  method: string;
}

export interface StatBlock {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonGuide {
  slug: string;
  title: string;
  starter: string;
  dexId: number;
  types: string[];
  summary: string;
  updated: string;
  difficulty: string;
  evolutions: EvolutionStage[];
  stats: StatBlock;
  content: string;
}

const GUIDES_DIR = path.join(process.cwd(), "content", "pokemon");

/** Official artwork served from the PokéAPI sprite CDN. */
export function artworkUrl(dexId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;
}

function parseGuide(slug: string, raw: string): PokemonGuide {
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    starter: data.starter,
    dexId: data.dexId,
    types: data.types ?? [],
    summary: data.summary ?? "",
    updated: data.updated ?? "",
    difficulty: data.difficulty ?? "",
    evolutions: data.evolutions ?? [],
    stats: data.stats,
    content,
  };
}

export async function getPokemonGuides(): Promise<PokemonGuide[]> {
  const files = await fs.readdir(GUIDES_DIR);
  const guides = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(GUIDES_DIR, file), "utf8");
        return parseGuide(file.replace(/\.mdx$/, ""), raw);
      }),
  );
  return guides.sort((a, b) => a.dexId - b.dexId);
}

export async function getPokemonGuide(
  slug: string,
): Promise<PokemonGuide | null> {
  try {
    const raw = await fs.readFile(path.join(GUIDES_DIR, `${slug}.mdx`), "utf8");
    return parseGuide(slug, raw);
  } catch {
    return null;
  }
}
