export interface Requisition {
  number: string;
  name: string;
  role: string;
  primary: string;
  secondary: string;
  grenade: string;
  armor: string;
  stratagems: string[];
  whyItHolds: string;
  fieldNote: string;
}

export interface Front {
  slug: string;
  enemy: string;
  title: string;
  doctrine: string;
  requisitions: Requisition[];
}

export const FRONTS: Front[] = [
  {
    slug: "terminids",
    enemy: "Terminids",
    title: "The Bug Front",
    doctrine:
      "Terminids win by volume and proximity. Your kit needs one answer that never stops firing, one answer to heavy chitin, and the discipline to keep moving. Fire damage keeps earning its keep here, and anything that watches your back while you reload is worth its weight.",
    requisitions: [
      {
        number: "T-01",
        name: "The Lawnmower",
        role: "Crowd control",
        primary: "Incendiary Breaker",
        secondary: "Redeemer",
        grenade: "Incendiary",
        armor: "Light, Engineering or Medic passive",
        stratagems: [
          "Stalwart",
          "Guard Dog Rover",
          "Eagle Napalm Strike",
          "Gatling Sentry",
        ],
        whyItHolds:
          "Chaff dies to sustained fire and burning ground. The Stalwart reloads on the move, the Rover covers your six, and napalm turns breaches into toll booths.",
        fieldNote:
          "Runs hot on Hellmire — the fire tornadoes do not care whose side fire is on. Trade the napalm for a sentry and keep your distance honest.",
      },
      {
        number: "T-02",
        name: "Big Game Permit",
        role: "Heavy killer",
        primary: "Breaker",
        secondary: "Grenade Pistol",
        grenade: "Stun",
        armor: "Medium, Fortified passive",
        stratagems: [
          "Quasar Cannon",
          "Orbital Railcannon Strike",
          "Eagle 500kg Bomb",
          "Shield Generator Pack",
        ],
        whyItHolds:
          "Stun a Charger and the Quasar takes its head off at leisure. The Railcannon answers Bile Titans you cannot kite, and the 500kg closes nests on the way out.",
        fieldNote:
          "Discipline item: the Quasar has a long exhale between shots. Count it out loud if you have to — the house has heard worse on comms.",
      },
    ],
  },
  {
    slug: "automatons",
    enemy: "Automatons",
    title: "The Bot Front",
    doctrine:
      "Automatons win at range with rockets and patience. Cover is your second armor bar, explosive resistance is the passive that pays rent, and every kit needs a clean answer to Hulks, gunships, and fabricators. Trade at distance; the bots are happy to trade up close.",
    requisitions: [
      {
        number: "A-01",
        name: "The Creek Special",
        role: "Mid range trade",
        primary: "Scorcher",
        secondary: "Senator",
        grenade: "Impact",
        armor: "Medium, Fortified passive",
        stratagems: [
          "Autocannon",
          "Eagle Airstrike",
          "Orbital Laser",
          "Orbital Railcannon Strike",
        ],
        whyItHolds:
          "The Autocannon opens Hulk vents, pops fabricators from across the map, and never asks for a backpack slot twice — because it is the backpack. The Laser is your break glass button for drops.",
        fieldNote:
          "Named for Malevelon Creek, where the trees shoot back. In jungle visibility, sentries hear what you cannot see — consider trading the Railcannon for an EMS Mortar.",
      },
      {
        number: "A-02",
        name: "Hull Down",
        role: "Anti armor overwatch",
        primary: "Dominator",
        secondary: "Redeemer",
        grenade: "Stun",
        armor: "Medium, Fortified passive",
        stratagems: [
          "Quasar Cannon",
          "Shield Generator Pack",
          "Eagle Airstrike",
          "Orbital Railcannon Strike",
        ],
        whyItHolds:
          "The Quasar deletes Hulks, tanks, and cannon towers from outside their comfort zone while the shield pack eats the rocket you did not see. Pick a ridge, do your work, relocate.",
        fieldNote:
          "On cold worlds like Vandalon IV the Quasar charges slower than your patience. Bring the count down by firing from cover, not from hope.",
      },
    ],
  },
  {
    slug: "illuminate",
    enemy: "Illuminate",
    title: "The Squid Front",
    doctrine:
      "The newest front, and the house book is still being written in pencil. What holds so far: the Voteless come as a tide and die to chained or area damage, the Harvesters fall when you work the leg joints, and shields beat beams. Expect this page to be revised between patches.",
    requisitions: [
      {
        number: "I-01",
        name: "Crowd Work",
        role: "Voteless management",
        primary: "Sickle",
        secondary: "Redeemer",
        grenade: "Incendiary",
        armor: "Light, Medic passive",
        stratagems: [
          "Arc Thrower",
          "Guard Dog Rover",
          "Orbital Gatling Barrage",
          "Gatling Sentry",
        ],
        whyItHolds:
          "The tide does not flank, it arrives. Arc chains and sustained fire hold a line all night, and the Sickle never runs dry while you mind your heat.",
        fieldNote:
          "City fights reward corners and chokes. Pick a doorway and make it famous.",
      },
      {
        number: "I-02",
        name: "Tripod Insurance",
        role: "Harvester answer",
        primary: "Scorcher",
        secondary: "Grenade Pistol",
        grenade: "Impact",
        armor: "Medium, Engineering passive",
        stratagems: [
          "Quasar Cannon",
          "Shield Generator Pack",
          "Eagle Airstrike",
          "Orbital Precision Strike",
        ],
        whyItHolds:
          "Work the leg joints and the giant comes down to your level. Your shield outlasts their beam in an honest argument, and precision work handles whatever they leave parked.",
        fieldNote:
          "Do not duel a Harvester in the open with small arms. The house will not refund the reinforcement.",
      },
    ],
  },
];

export interface KnownTheater {
  planet: string;
  front: string;
  note: string;
}

export const KNOWN_THEATERS: KnownTheater[] = [
  {
    planet: "Malevelon Creek",
    front: "Automatons",
    note: "Jungle visibility, laser fire in the trees. The Creek is a memory and a warning: bring sentries, leave the open ground.",
  },
  {
    planet: "Hellmire",
    front: "Terminids",
    note: "Fire tornadoes roam on their own schedule. Fire resistant armor earns its slot; everything else just runs.",
  },
  {
    planet: "Tien Kwan",
    front: "Automatons",
    note: "Where the Exosuits come from. When the war map lights up here, the whole house answers the call.",
  },
];
