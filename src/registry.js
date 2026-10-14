import { genreById } from "./genres.js";
import {
  createAction,
  stepAction,
  actionCommand,
  actionHUD,
  validateAction,
} from "./modes/action.js";
import {
  createTactics,
  tacticsCommand,
  tacticsHUD,
  validateTactics,
} from "./modes/tactics.js";
import {
  createPuzzle,
  puzzleCommand,
  puzzleHUD,
  validatePuzzle,
} from "./modes/puzzle.js";
import { drawAction, drawTactics, drawPuzzle } from "./render.js";
export const modes = [
  {
    id: "rift",
    number: "01",
    title: "Rift Runner",
    tag: "ACTION · ROGUELITE",
    genres: ["action", "roguelite"],
    color: "#9d8dff",
    image: "rift",
    duration: "2–4 MIN",
    description:
      "A broken world. One way out. Recover the lost shards and fight your way through the rift.",
    objective:
      "Recover all 3 shards, defeat the sentinels, then reach the central portal.",
    controls:
      "Move with WASD or arrow keys. Hold Space to auto-aim, or click to fire toward the pointer. Shift dashes through danger. Walk over shards to collect them.",
    hint: "Keep moving. Your pulse automatically targets the closest sentinel when you hold Space.",
    capabilities: [
      "movement",
      "combat",
      "collision",
      "procedural",
      "progression",
    ],
    create: (r) => createAction(r, false),
    step: stepAction,
    command: actionCommand,
    hud: actionHUD,
    draw: drawAction,
    validate: validateAction,
  },
  {
    id: "bastion",
    number: "02",
    title: "Bastion Protocol",
    tag: "TACTICS · STRATEGY",
    genres: ["tactical-combat", "turn-based-strategy"],
    color: "#edb56d",
    image: "bastion",
    duration: "3–5 MIN",
    description:
      "Every move matters. Outmaneuver the machines in a compact, turn-based battlefield.",
    objective:
      "Eliminate every sentinel before your operator runs out of integrity. You have 2 action points per turn.",
    controls:
      "Click a green tile to move (up to 2 tiles, 1 AP). Click a red sentinel within 3 tiles to fire (1 AP). End your turn to let enemies act. Arrow keys move the selection; Enter activates it.",
    hint: "Cyan cover blocks enemy sight. Shots cannot pass through cover. Spend your two actions, then end the turn.",
    capabilities: ["grid", "turns", "line-of-sight"],
    create: createTactics,
    step: () => {},
    command: tacticsCommand,
    hud: tacticsHUD,
    draw: drawTactics,
    validate: validateTactics,
  },
  {
    id: "signal",
    number: "03",
    title: "Signal Garden",
    tag: "PUZZLE · LOGIC",
    genres: ["puzzle", "logic"],
    color: "#70dcc3",
    image: "signal",
    duration: "2–4 MIN",
    description:
      "Find a little order in the cosmos. Rotate the conduits and bring a sleeping network to life.",
    objective:
      "Connect the source at the upper left to every node. All connectors must meet; no open ends.",
    controls:
      "Click a tile to rotate clockwise. Right-click rotates counterclockwise. Arrow keys select a tile, Enter rotates it. Undo has no penalty. Solve within the rotation budget, or restart with the same seed.",
    hint: "Begin at the source. Illuminated lines show which nodes already have power. A square means that tile is selected.",
    capabilities: ["grid", "puzzle", "undo"],
    create: createPuzzle,
    step: () => {},
    command: puzzleCommand,
    hud: puzzleHUD,
    draw: drawPuzzle,
    validate: validatePuzzle,
  },
  {
    id: "frontier",
    number: "04",
    title: "Frontier Zero",
    tag: "SURVIVAL · BUILDER",
    genres: ["survival", "building", "tower-defense"],
    color: "#f195ab",
    image: "frontier",
    duration: "3–6 MIN",
    description:
      "Make a home at the edge of everything. Gather, build, and defend your outpost together with your machines.",
    objective:
      "Protect the central reactor through every wave. Mine crystals and construct automated turrets.",
    controls:
      "Move with WASD or arrows. Hold Space to fire. Press E near a crystal to mine it. Press B to spend 3 ore on a turret at your position. Shift dashes. The reactor must survive.",
    hint: "Mine between waves. Build turrets around the reactor, then intercept enemies before they get close.",
    capabilities: [
      "movement",
      "combat",
      "collision",
      "resources",
      "construction",
      "waves",
    ],
    create: (r) => createAction(r, true),
    step: stepAction,
    command: actionCommand,
    hud: actionHUD,
    draw: drawAction,
    validate: validateAction,
  },
];
export const modeById = (id) => modes.find((m) => m.id === id);
export function validateCombination(genres, options = {}) {
  const issues = [];
  for (const id of genres)
    if (!genreById(id)) issues.push(`Unknown genre: ${id}`);
  if (
    genres.includes("turn-based-strategy") &&
    genres.includes("action") &&
    !["real-time", "turn-based"].includes(options.clock)
  )
    issues.push(
      "Choose a clock: real-time action and turn-based strategy cannot own the same simulation simultaneously.",
    );
  if (
    genres.includes("survival") &&
    genres.includes("tower-defense") &&
    options.turrets === false
  )
    issues.push(
      "Tower-defense requires construction. Enable turrets or remove tower-defense.",
    );
  return { valid: issues.length === 0, issues };
}
