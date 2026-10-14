// A design registry, NOT a claim that every entry is implemented.
// Runtime availability belongs to the four mode plugins in registry.js.
const families = [
  [
    "Action",
    [
      "action",
      "adventure",
      "platformer",
      "metroidvania",
      "first-person-shooter",
      "third-person-shooter",
      "fighting",
      "beat-em-up",
      "hack-and-slash",
      "character-action",
      "stealth",
      "survival",
      "horror",
      "psychological-horror",
      "immersive-sim",
      "extraction-shooter",
    ],
    ["movement", "collision", "combat"],
    "real-time",
  ],
  [
    "Role playing",
    [
      "role-playing",
      "mmorpg",
      "action-rpg",
      "tactical-rpg",
      "jrpg",
      "creature-collector",
    ],
    ["progression", "inventory", "quests"],
    "either",
  ],
  [
    "Strategy",
    [
      "strategy",
      "real-time-strategy",
      "turn-based-strategy",
      "grand-strategy",
      "4x",
      "tactical-combat",
      "auto-battler",
      "tower-defense",
      "tower-offense",
    ],
    ["agents", "economy", "navigation"],
    "either",
  ],
  [
    "Simulation",
    [
      "simulation",
      "life-simulation",
      "farming",
      "colony-management",
      "city-building",
      "god-game",
      "automation",
      "transport-tycoon",
    ],
    ["simulation", "resources", "persistence"],
    "real-time",
  ],
  [
    "Sandbox",
    [
      "sandbox",
      "open-world",
      "crafting",
      "building",
      "voxel",
      "physics-sandbox",
    ],
    ["world", "interaction", "persistence"],
    "real-time",
  ],
  [
    "Vehicles",
    [
      "racing",
      "driving",
      "flight-simulation",
      "space-simulation",
      "vehicle-combat",
      "space-trading",
    ],
    ["vehicle-dynamics", "camera", "collision"],
    "real-time",
  ],
  [
    "Sports",
    ["sports", "wrestling", "martial-arts", "competitive"],
    ["rules", "collision", "scoring"],
    "real-time",
  ],
  [
    "Music",
    ["rhythm", "music", "dance", "musical-performance"],
    ["audio-clock", "timing", "input-latency"],
    "real-time",
  ],
  [
    "Puzzles & tabletop",
    [
      "puzzle",
      "logic",
      "word",
      "trivia",
      "board",
      "card",
      "tabletop",
      "deckbuilder",
      "nonogram",
      "programming-puzzle",
      "escape-room",
    ],
    ["grid", "rules", "undo"],
    "turn-based",
  ],
  [
    "Procedural challenges",
    ["roguelike", "roguelite", "dungeon-crawler", "procedural-challenge"],
    ["procedural", "run-lifecycle", "progression"],
    "either",
  ],
  [
    "Narrative",
    [
      "visual-novel",
      "interactive-fiction",
      "branching-narrative",
      "detective",
      "walking-simulator",
    ],
    ["dialogue", "choices", "persistence"],
    "either",
  ],
  [
    "Learning",
    [
      "educational",
      "serious",
      "historical",
      "scientific",
      "training-simulation",
    ],
    ["domain-model", "assessment", "accessibility"],
    "either",
  ],
  [
    "Social",
    [
      "party",
      "social-deduction",
      "cooperative",
      "competitive-multiplayer",
      "massively-multiplayer",
    ],
    ["networking", "identity", "authority"],
    "either",
  ],
  [
    "Economy",
    ["idle", "incremental", "clicker", "management", "tycoon", "economic"],
    ["economy", "persistence", "time"],
    "either",
  ],
  [
    "Arcade",
    ["arcade", "retro", "bullet-hell", "shoot-em-up", "score-attack"],
    ["movement", "scoring", "run-lifecycle"],
    "real-time",
  ],
  [
    "Experimental",
    [
      "experimental",
      "abstract",
      "artistic",
      "generative",
      "unconventional",
      "asymmetric-multiplayer",
    ],
    ["custom-rules"],
    "either",
  ],
];
const implementations = {
  action: ["rift", "frontier"],
  survival: ["frontier"],
  building: ["frontier"],
  "tower-defense": ["frontier"],
  "tactical-combat": ["bastion"],
  "turn-based-strategy": ["bastion"],
  puzzle: ["signal"],
  logic: ["signal"],
};
const partial = {
  roguelite: ["rift"],
  "procedural-challenge": ["rift", "signal"],
};
const requirements = {
  action: ["movement", "collision", "combat"],
  survival: ["combat", "resources"],
  building: ["construction", "resources"],
  "tower-defense": ["waves", "construction"],
  "tactical-combat": ["grid", "turns", "line-of-sight"],
  "turn-based-strategy": ["grid", "turns"],
  puzzle: ["grid", "puzzle", "undo"],
  logic: ["grid", "puzzle"],
  mmorpg: ["networking", "authority", "persistence", "quests", "progression"],
  rhythm: ["audio-clock", "timing", "input-latency"],
};
export const genres = families.flatMap(([family, names, required, clock]) =>
  names.map((id) => ({
    id,
    name: id
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    family,
    required: requirements[id] || required,
    clock:
      id === "turn-based-strategy" || id === "tactical-combat"
        ? "turn-based"
        : id === "real-time-strategy"
          ? "real-time"
          : clock,
    status: implementations[id]
      ? "implemented"
      : partial[id]
        ? "partial"
        : "planned",
    modes: implementations[id] || partial[id] || [],
  })),
);
export const genreById = (id) => genres.find((g) => g.id === id);
export function capabilityGaps(ids, available) {
  return [
    ...new Set(
      ids.flatMap((id) => genreById(id)?.required || ["unknown-genre"]),
    ),
  ].filter((c) => !available.includes(c));
}
export const combinationRules = [
  {
    id: "clock-ownership",
    conflict: ["real-time", "turn-based"],
    resolution:
      "Select one authoritative simulation clock, or isolate subgames with a transition. The current lab rejects mixed clocks.",
  },
  {
    id: "camera-ownership",
    conflict: ["first-person", "top-down"],
    resolution:
      "Choose a camera adapter per active scene; do not stack controllers.",
  },
  {
    id: "physics-ownership",
    conflict: ["grid", "continuous-rigid-body"],
    resolution:
      "One authority owns entity positions. Use synchronized view state, not two collision solvers.",
  },
  {
    id: "network-authority",
    conflict: ["local-save", "server-authority"],
    resolution:
      "Local profile scores are untrusted. A future server must validate commands and own rewards.",
  },
  {
    id: "rhythm-timing",
    conflict: ["audio-clock", "variable-frame-time"],
    resolution:
      "Schedule against Web Audio time and measure latency before a rhythm integration.",
  },
];
