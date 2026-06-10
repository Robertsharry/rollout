export interface StarterLine {
  name: string;
  dexId: number;
  types: string[];
  /** Slug of a written field guide, when one exists. */
  guideSlug?: string;
}

export interface StarterGeneration {
  gen: number;
  region: string;
  games: string;
  starters: StarterLine[];
}

/** Every starter trio, Kanto through Paldea. Guides roll out wing by wing. */
export const GENERATIONS: StarterGeneration[] = [
  {
    gen: 1,
    region: "Kanto",
    games: "Red, Blue & Yellow",
    starters: [
      { name: "Bulbasaur", dexId: 1, types: ["Grass", "Poison"], guideSlug: "bulbasaur-line" },
      { name: "Charmander", dexId: 4, types: ["Fire"], guideSlug: "charmander-line" },
      { name: "Squirtle", dexId: 7, types: ["Water"], guideSlug: "squirtle-line" },
    ],
  },
  {
    gen: 2,
    region: "Johto",
    games: "Gold, Silver & Crystal",
    starters: [
      { name: "Chikorita", dexId: 152, types: ["Grass"] },
      { name: "Cyndaquil", dexId: 155, types: ["Fire"] },
      { name: "Totodile", dexId: 158, types: ["Water"] },
    ],
  },
  {
    gen: 3,
    region: "Hoenn",
    games: "Ruby, Sapphire & Emerald",
    starters: [
      { name: "Treecko", dexId: 252, types: ["Grass"] },
      { name: "Torchic", dexId: 255, types: ["Fire"] },
      { name: "Mudkip", dexId: 258, types: ["Water"] },
    ],
  },
  {
    gen: 4,
    region: "Sinnoh",
    games: "Diamond, Pearl & Platinum",
    starters: [
      { name: "Turtwig", dexId: 387, types: ["Grass"] },
      { name: "Chimchar", dexId: 390, types: ["Fire"] },
      { name: "Piplup", dexId: 393, types: ["Water"] },
    ],
  },
  {
    gen: 5,
    region: "Unova",
    games: "Black & White",
    starters: [
      { name: "Snivy", dexId: 495, types: ["Grass"] },
      { name: "Tepig", dexId: 498, types: ["Fire"] },
      { name: "Oshawott", dexId: 501, types: ["Water"] },
    ],
  },
  {
    gen: 6,
    region: "Kalos",
    games: "X & Y",
    starters: [
      { name: "Chespin", dexId: 650, types: ["Grass"] },
      { name: "Fennekin", dexId: 653, types: ["Fire"] },
      { name: "Froakie", dexId: 656, types: ["Water"] },
    ],
  },
  {
    gen: 7,
    region: "Alola",
    games: "Sun & Moon",
    starters: [
      { name: "Rowlet", dexId: 722, types: ["Grass", "Flying"] },
      { name: "Litten", dexId: 725, types: ["Fire"] },
      { name: "Popplio", dexId: 728, types: ["Water"] },
    ],
  },
  {
    gen: 8,
    region: "Galar",
    games: "Sword & Shield",
    starters: [
      { name: "Grookey", dexId: 810, types: ["Grass"] },
      { name: "Scorbunny", dexId: 813, types: ["Fire"] },
      { name: "Sobble", dexId: 816, types: ["Water"] },
    ],
  },
  {
    gen: 9,
    region: "Paldea",
    games: "Scarlet & Violet",
    starters: [
      { name: "Sprigatito", dexId: 906, types: ["Grass"] },
      { name: "Fuecoco", dexId: 909, types: ["Fire"] },
      { name: "Quaxly", dexId: 912, types: ["Water"] },
    ],
  },
];

export const STARTER_COUNT = GENERATIONS.length * 3;
