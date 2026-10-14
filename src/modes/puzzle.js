import { rng, randomInt, finish, statusValid, finite } from "../core.js";
export const SIZE = 5;
export const directions = [
  { x: 0, y: -1, bit: 1, opposite: 4 },
  { x: 1, y: 0, bit: 2, opposite: 8 },
  { x: 0, y: 1, bit: 4, opposite: 1 },
  { x: -1, y: 0, bit: 8, opposite: 2 },
];
export const rotate = (mask) => ((mask << 1) & 15) | ((mask >> 3) & 1);
export function network(tiles) {
  const powered = new Set([0]),
    queue = [0];
  let leaks = 0;
  while (queue.length) {
    const i = queue.shift(),
      x = i % SIZE,
      y = Math.floor(i / SIZE);
    for (const d of directions) {
      if (!(tiles[i] & d.bit)) continue;
      const nx = x + d.x,
        ny = y + d.y;
      if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) {
        leaks++;
        continue;
      }
      const j = ny * SIZE + nx;
      if (!(tiles[j] & d.opposite)) {
        leaks++;
        continue;
      }
      if (!powered.has(j)) {
        powered.add(j);
        queue.push(j);
      }
    }
  }
  return {
    powered: [...powered],
    leaks,
    solved: powered.size === SIZE * SIZE && leaks === 0,
  };
}
export function createPuzzle(rules) {
  const random = rng(rules.seed),
    solution = Array(SIZE * SIZE).fill(0),
    visited = new Set([0]);
  function visit(i) {
    const x = i % SIZE,
      y = Math.floor(i / SIZE);
    const dirs = [...directions]
      .map((d) => ({ d, r: random() }))
      .sort((a, b) => a.r - b.r)
      .map((o) => o.d);
    for (const d of dirs) {
      const nx = x + d.x,
        ny = y + d.y,
        j = ny * SIZE + nx;
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && !visited.has(j)) {
        visited.add(j);
        solution[i] |= d.bit;
        solution[j] |= d.opposite;
        visit(j);
      }
    }
  }
  visit(0);
  let tiles = solution.map((m) => {
    for (let n = randomInt(random, 0, 3); n > 0; n--) m = rotate(m);
    return m;
  });
  if (network(tiles).solved) tiles[0] = rotate(tiles[0]);
  return {
    version: 1,
    type: "puzzle",
    rules,
    status: "playing",
    tiles,
    solution,
    moves: 0,
    budget:
      rules.difficulty === "veteran"
        ? 75
        : rules.difficulty === "explorer"
          ? 180
          : 120,
    cursor: 0,
    history: [],
    ...network(tiles),
    message: "Rotate the conduits. Bring every node into the light.",
    time: 0,
  };
}
export function puzzleCommand(s, action, payload) {
  if (s.status !== "playing") return;
  if (action === "cursor") {
    const x = ((s.cursor % SIZE) + payload.x + SIZE) % SIZE,
      y = (Math.floor(s.cursor / SIZE) + payload.y + SIZE) % SIZE;
    s.cursor = y * SIZE + x;
    return;
  }
  if (action === "undo") {
    const previous = s.history.pop();
    if (previous) {
      s.tiles = previous;
      s.moves--;
      Object.assign(s, network(s.tiles));
      s.message = "Last rotation undone.";
    }
    return;
  }
  if (action === "select" || action === "reverse") {
    const i = payload ?? s.cursor;
    if (!Number.isInteger(i) || i < 0 || i >= SIZE * SIZE) return;
    s.cursor = i;
    s.history.push([...s.tiles]);
    if (s.history.length > 180) s.history.shift();
    for (let k = 0; k < (action === "reverse" ? 3 : 1); k++)
      s.tiles[i] = rotate(s.tiles[i]);
    s.moves++;
    Object.assign(s, network(s.tiles));
    s.message = `${s.powered.length} of 25 nodes connected · ${s.leaks} open connector${s.leaks === 1 ? "" : "s"} on the powered network`;
    if (s.solved)
      finish(s, "won", "A perfect connection. The garden is alive again.");
    else if (s.moves >= s.budget)
      finish(
        s,
        "lost",
        "The signal faded. Restart the same network and try a new route.",
      );
  }
}
export function puzzleHUD(s) {
  return [
    { label: "POWERED", value: `${s.powered.length} / 25` },
    { label: "ROTATIONS", value: `${s.moves} / ${s.budget}` },
    { label: "OPEN ENDS", value: s.leaks },
    { label: "NETWORK", value: s.solved ? "ONLINE" : "OFFLINE" },
  ];
}
const validTiles = (a) =>
  Array.isArray(a) &&
  a.length === 25 &&
  a.every((v) => Number.isInteger(v) && v >= 1 && v <= 15);
export function validatePuzzle(s) {
  return (
    s?.type === "puzzle" &&
    statusValid(s) &&
    validTiles(s.tiles) &&
    validTiles(s.solution) &&
    ["moves", "budget", "cursor", "leaks", "time"].every((k) =>
      finite(s[k], 0, 10000),
    ) &&
    Number.isInteger(s.cursor) &&
    s.cursor < 25 &&
    Array.isArray(s.powered) &&
    s.powered.length <= 25 &&
    s.powered.every((i) => Number.isInteger(i) && i >= 0 && i < 25) &&
    Array.isArray(s.history) &&
    s.history.length <= 180 &&
    s.history.every(validTiles) &&
    typeof s.message === "string" &&
    s.message.length < 500
  );
}
