export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function randomInt(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}
export function circleRect(x, y, r, b) {
  return (
    Math.hypot(x - clamp(x, b.x, b.x + b.w), y - clamp(y, b.y, b.y + b.h)) < r
  );
}
export function moveBody(body, dx, dy, walls, width, height, r = 16) {
  const x = clamp(body.x + dx, r, width - r);
  if (!walls.some((w) => circleRect(x, body.y, r, w))) body.x = x;
  const y = clamp(body.y + dy, r, height - r);
  if (!walls.some((w) => circleRect(body.x, y, r, w))) body.y = y;
}
export const finite = (x, min = -1e6, max = 1e6) =>
  typeof x === "number" && Number.isFinite(x) && x >= min && x <= max;
export const validPoint = (p) => p && finite(p.x) && finite(p.y);
export function normalizeRules(input = {}) {
  const v = input && typeof input === "object" ? input : {};
  return {
    seed: Math.round(clamp(Number(v.seed) || 2701, 1, 999999)),
    difficulty: ["explorer", "standard", "veteran"].includes(v.difficulty)
      ? v.difficulty
      : "standard",
    waves: Math.round(clamp(Number(v.waves) || 3, 2, 5)),
    turrets: v.turrets !== false,
  };
}
export const difficultyFactor = (rules) =>
  ({ explorer: 0.65, standard: 1, veteran: 1.35 })[rules.difficulty] || 1;
export const statusValid = (s) => ["playing", "won", "lost"].includes(s.status);
export function finish(s, status, message) {
  if (s.status === "playing") {
    s.status = status;
    s.message = message;
  }
}
// Bounded four-neighbor BFS for the small obstacle maps. Recast/Rapier are not required.
// Returns cell centers after the start. Clearance uses the same collision primitive as movement.
export function gridPath(
  from,
  to,
  walls,
  width = 1800,
  height = 1200,
  cell = 60,
  radius = 17,
) {
  const cols = Math.ceil(width / cell),
    rows = Math.ceil(height / cell),
    count = cols * rows;
  const center = (i) => ({
    x: ((i % cols) + 0.5) * cell,
    y: (Math.floor(i / cols) + 0.5) * cell,
  });
  const blocked = Array.from({ length: count }, (_, i) => {
    const p = center(i);
    return walls.some((w) => circleRect(p.x, p.y, radius, w));
  });
  const nearest = (point) => {
    let best = -1,
      score = Infinity;
    for (let i = 0; i < count; i++)
      if (!blocked[i]) {
        const d = distance(point, center(i));
        if (d < score) {
          score = d;
          best = i;
        }
      }
    return best;
  };
  const start = nearest(from),
    goal = nearest(to);
  if (start < 0 || goal < 0) return [];
  const previous = new Int16Array(count).fill(-1),
    queue = [start];
  previous[start] = start;
  let head = 0;
  while (head < queue.length) {
    const i = queue[head++];
    if (i === goal) break;
    const x = i % cols,
      y = Math.floor(i / cols);
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      const n = ny * cols + nx;
      if (!blocked[n] && previous[n] < 0) {
        previous[n] = i;
        queue.push(n);
      }
    }
  }
  if (previous[goal] < 0) return [];
  const path = [];
  for (let i = goal; i !== start; i = previous[i]) path.push(center(i));
  path.push(center(start));
  return path.reverse();
}
export function clearSegment(from, to, walls, radius = 17) {
  const length = distance(from, to),
    steps = Math.ceil(length / 20);
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps,
      y = from.y + ((to.y - from.y) * i) / steps;
    if (walls.some((w) => circleRect(x, y, radius, w))) return false;
  }
  return true;
}
