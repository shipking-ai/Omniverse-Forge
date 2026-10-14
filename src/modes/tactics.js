import {
  rng,
  randomInt,
  distance,
  finish,
  difficultyFactor,
  finite,
  statusValid,
} from "../core.js";
export const COLS = 9,
  ROWS = 7;
export const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export const same = (a, b) => a.x === b.x && a.y === b.y;
const inside = (p) =>
  Number.isInteger(p.x) &&
  Number.isInteger(p.y) &&
  p.x >= 0 &&
  p.x < COLS &&
  p.y >= 0 &&
  p.y < ROWS;
export function createTactics(rules) {
  const random = rng(rules.seed);
  const walls = [
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 4 },
    { x: 3, y: 5 },
    { x: 6, y: 2 },
    { x: 6, y: 4 },
  ];
  return {
    version: 1,
    type: "tactics",
    rules,
    status: "playing",
    player: { x: 1, y: 3, hp: Math.round(12 / difficultyFactor(rules)) },
    walls,
    enemies: [
      { x: 7, y: 1, hp: 2 },
      { x: 7, y: 3, hp: 2 },
      { x: 7, y: 5, hp: 2 },
      { x: 5, y: randomInt(random, 0, 1), hp: 2 },
    ],
    ap: 2,
    turn: 1,
    kills: 0,
    cursor: { x: 1, y: 3 },
    message: "Your move. Green tiles are reachable; red targets are in range.",
    log: [],
    time: 0,
  };
}
export function reachable(s, from, to, max = 2) {
  if (
    !inside(to) ||
    s.walls.some((w) => same(w, to)) ||
    s.enemies.some((e) => same(e, to))
  )
    return false;
  let queue = [{ ...from, d: 0 }],
    seen = new Set([`${from.x},${from.y}`]);
  while (queue.length) {
    const p = queue.shift();
    if (same(p, to)) return true;
    if (p.d >= max) continue;
    for (const [x, y] of [
      [p.x + 1, p.y],
      [p.x - 1, p.y],
      [p.x, p.y + 1],
      [p.x, p.y - 1],
    ]) {
      const n = { x, y },
        k = `${x},${y}`;
      if (
        inside(n) &&
        !seen.has(k) &&
        !s.walls.some((w) => same(w, n)) &&
        !s.enemies.some((e) => same(e, n))
      ) {
        seen.add(k);
        queue.push({ ...n, d: p.d + 1 });
      }
    }
  }
  return false;
}
export function lineOfSight(s, a, b) {
  // Supercover-style sampling: cover blocks both player and enemy ranged attacks.
  const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) * 8;
  for (let i = 1; i < steps; i++) {
    const x = Math.round(a.x + ((b.x - a.x) * i) / steps),
      y = Math.round(a.y + ((b.y - a.y) * i) / steps);
    if (s.walls.some((w) => w.x === x && w.y === y)) return false;
  }
  return true;
}
export function canShoot(s, from, to) {
  return manhattan(from, to) <= 3 && lineOfSight(s, from, to);
}
export function tacticsCommand(s, action, payload) {
  if (s.status !== "playing") return;
  if (action === "cursor") {
    s.cursor = {
      x: Math.max(0, Math.min(COLS - 1, s.cursor.x + payload.x)),
      y: Math.max(0, Math.min(ROWS - 1, s.cursor.y + payload.y)),
    };
    return;
  }
  if (action === "select") {
    const point = payload || s.cursor;
    if (!inside(point)) return;
    s.cursor = { ...point };
    if (s.ap <= 0) {
      s.message = "No action points left. End your turn.";
      return;
    }
    const target = s.enemies.find((e) => same(e, point));
    if (target) {
      if (!canShoot(s, s.player, target)) {
        s.message = "Target blocked or out of range (3 tiles).";
        return;
      }
      target.hp--;
      s.ap--;
      s.message = "Direct hit · −1 sentinel integrity";
      if (target.hp <= 0) {
        s.enemies = s.enemies.filter((e) => e !== target);
        s.kills++;
      }
    } else if (!same(s.player, point) && reachable(s, s.player, point, 2)) {
      s.player.x = point.x;
      s.player.y = point.y;
      s.ap--;
      s.message = "Operator repositioned.";
    } else {
      s.message =
        "Choose a green tile within two steps, or a sentinel in range.";
    }
    if (!s.enemies.length)
      finish(s, "won", "Sector clear. Precision beats overwhelming force.");
  }
  if (action === "end-turn") {
    for (const e of s.enemies) {
      if (!canShoot(s, e, s.player)) {
        const candidates = [
          [e.x + 1, e.y],
          [e.x - 1, e.y],
          [e.x, e.y + 1],
          [e.x, e.y - 1],
        ]
          .map(([x, y]) => ({ x, y }))
          .filter(
            (p) =>
              inside(p) &&
              !s.walls.some((w) => same(w, p)) &&
              !s.enemies.some((other) => same(other, p)) &&
              !same(p, s.player),
          );
        candidates.sort(
          (a, b) => manhattan(a, s.player) - manhattan(b, s.player),
        );
        if (candidates[0]) Object.assign(e, candidates[0]);
      }
      if (canShoot(s, e, s.player)) s.player.hp--;
    }
    s.turn++;
    s.ap = 2;
    s.message = `Turn ${s.turn} · Choose your next move.`;
    if (s.player.hp <= 0)
      finish(
        s,
        "lost",
        "Operator offline. Use cover to break enemy lines of sight.",
      );
  }
}
export function tacticsHUD(s) {
  return [
    { label: "INTEGRITY", value: Math.max(0, s.player.hp) },
    { label: "ACTION POINTS", value: `${s.ap} / 2` },
    { label: "TURN", value: s.turn },
    { label: "SENTINELS", value: `${s.kills} / 4` },
  ];
}
export function validateTactics(s) {
  return (
    s?.type === "tactics" &&
    statusValid(s) &&
    inside(s.player || {}) &&
    finite(s.player.hp) &&
    inside(s.cursor || {}) &&
    ["ap", "turn", "kills", "time"].every((k) => finite(s[k])) &&
    Array.isArray(s.walls) &&
    s.walls.length <= 20 &&
    s.walls.every(inside) &&
    Array.isArray(s.enemies) &&
    s.enemies.length <= 10 &&
    s.enemies.every((e) => inside(e) && finite(e.hp)) &&
    typeof s.message === "string" &&
    s.message.length < 500
  );
}
