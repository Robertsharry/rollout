/**
 * Builds the static Pokédex dataset from PokéAPI — run once, commit the JSON.
 * 27 requests total (9 generations + 18 types). No runtime API dependency.
 *
 * Run: node scripts/build-pokedex.mjs
 * Output: lib/pokedex-data.json  →  [{ i, n, g, t }]  (id, name, gen, types)
 */
import { writeFileSync } from "node:fs";

const MAX_ID = 1025;

const SPECIAL_NAMES = {
  "mr-mime": "Mr. Mime",
  "mr-rime": "Mr. Rime",
  "mime-jr": "Mime Jr.",
  "ho-oh": "Ho-Oh",
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  "porygon-z": "Porygon-Z",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "tapu-koko": "Tapu Koko",
  "tapu-lele": "Tapu Lele",
  "tapu-bulu": "Tapu Bulu",
  "tapu-fini": "Tapu Fini",
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "flabebe": "Flabébé",
  "great-tusk": "Great Tusk",
  "scream-tail": "Scream Tail",
  "brute-bonnet": "Brute Bonnet",
  "flutter-mane": "Flutter Mane",
  "slither-wing": "Slither Wing",
  "sandy-shocks": "Sandy Shocks",
  "iron-treads": "Iron Treads",
  "iron-bundle": "Iron Bundle",
  "iron-hands": "Iron Hands",
  "iron-jugulis": "Iron Jugulis",
  "iron-moth": "Iron Moth",
  "iron-thorns": "Iron Thorns",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
  "roaring-moon": "Roaring Moon",
  "iron-valiant": "Iron Valiant",
  "walking-wake": "Walking Wake",
  "iron-leaves": "Iron Leaves",
  "gouging-fire": "Gouging Fire",
  "raging-bolt": "Raging Bolt",
  "iron-boulder": "Iron Boulder",
  "iron-crown": "Iron Crown",
};

function displayName(slug) {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

const idFromUrl = (url) => Number(url.split("/").filter(Boolean).pop());

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

// generations → species ids
const genOf = new Map();
for (let g = 1; g <= 9; g++) {
  const data = await getJson(`https://pokeapi.co/api/v2/generation/${g}`);
  for (const s of data.pokemon_species) {
    const id = idFromUrl(s.url);
    if (id <= MAX_ID) genOf.set(id, { gen: g, slug: s.name });
  }
  console.log(`gen ${g}: ${data.pokemon_species.length} species`);
}

// types → mon ids (base forms only, id <= MAX_ID)
const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy",
];
const typesOf = new Map();
for (const t of TYPES) {
  const data = await getJson(`https://pokeapi.co/api/v2/type/${t}`);
  for (const entry of data.pokemon) {
    const id = idFromUrl(entry.pokemon.url);
    if (id > MAX_ID) continue;
    if (!typesOf.has(id)) typesOf.set(id, []);
    // slot keeps primary/secondary order honest
    typesOf.get(id)[entry.slot - 1] = t;
  }
  console.log(`type ${t}: tallied`);
}

const dex = [];
for (let id = 1; id <= MAX_ID; id++) {
  const species = genOf.get(id);
  const types = (typesOf.get(id) ?? []).filter(Boolean);
  if (!species || types.length === 0) {
    console.warn(`MISSING data for #${id}`);
    continue;
  }
  dex.push({ i: id, n: displayName(species.slug), g: species.gen, t: types });
}

writeFileSync("lib/pokedex-data.json", JSON.stringify(dex));
console.log(`wrote lib/pokedex-data.json — ${dex.length} Pokémon`);
