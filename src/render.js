import { clamp } from "./core.js";
import { reachable, canShoot, same } from "./modes/tactics.js";
import { directions } from "./modes/puzzle.js";
export const W = 1000,
  H = 620;
export const tacticalLayout = { x: 194, y: 82, cell: 68, cols: 9, rows: 7 };
export const puzzleLayout = { x: 280, y: 85, cell: 88, cols: 5, rows: 5 };
function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function circle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
function polygon(ctx, x, y, r, n, color, angle = 0) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n + angle;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
function label(
  ctx,
  text,
  x,
  y,
  color = "#a9b6cb",
  size = 12,
  align = "center",
) {
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px ui-monospace, monospace`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}
function backdrop(ctx, color = "#101c29") {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) {
    const x = (i * 137.13) % W,
      y = (i * 83.9) % H;
    circle(ctx, x, y, i % 5 === 0 ? 1.2 : 0.6, "#405063");
  }
  const g = ctx.createRadialGradient(500, 300, 20, 500, 300, 500);
  g.addColorStop(0, "#43536a19");
  g.addColorStop(1, "#080d1800");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
export function actionCamera(s) {
  return {
    x: clamp(s.camera.x, W / 2, 1800 - W / 2) - W / 2,
    y: clamp(s.camera.y, H / 2, 1200 - H / 2) - H / 2,
  };
}
function crystal(ctx, x, y, color = "#9b8bfc", size = 18) {
  ctx.save();
  ctx.translate(x, y);
  polygon(ctx, 0, 6, size + 4, 4, "#0005");
  ctx.beginPath();
  ctx.moveTo(0, -size * 1.4);
  ctx.lineTo(size * 0.6, 0);
  ctx.lineTo(0, size * 0.5);
  ctx.lineTo(-size * 0.6, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  line(ctx, 0, -size * 1.4, 0, size * 0.5, "#ffffff70", 1);
  ctx.restore();
}
function operator(ctx, x, y, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  circle(ctx, 0, 8, 17, "#0005");
  circle(ctx, 0, 0, 19, "#83f0cc18");
  polygon(ctx, 0, 0, 15, 6, "#172d39", Math.PI / 6);
  ctx.strokeStyle = "#9bf4d6";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#d8f8ee";
  ctx.fillRect(-6, -8, 12, 14);
  ctx.fillStyle = "#183c43";
  ctx.fillRect(-5, -6, 10, 5);
  line(ctx, -9, 8, -12, 14, "#8fcec0", 3);
  line(ctx, 9, 8, 12, 14, "#8fcec0", 3);
  ctx.restore();
}
function sentinel(ctx, x, y, hp) {
  circle(ctx, x, y + 8, 18, "#0004");
  polygon(ctx, x, y, 18, 4, "#512e52");
  polygon(ctx, x, y, 13, 4, "#b45476");
  line(ctx, x - 7, y, x + 7, y, "#ffd5ce", 3);
  for (let i = 0; i < hp; i++) ctx.fillRect(x - 7 + i * 6, y - 24, 4, 3);
}
export function drawAction(
  ctx,
  s,
  { reducedMotion = false, contrast = false } = {},
) {
  backdrop(ctx, s.hybrid ? "#172028" : "#171c2c");
  const camera = actionCamera(s);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (let x = 0; x < 1800; x += 80) line(ctx, x, 0, x, 1200, "#7582930b");
  for (let y = 0; y < 1200; y += 80) line(ctx, 0, y, 1800, y, "#7582930b");
  // Seeded-looking geological strata use stable integer coordinates, never random frame noise.
  for (let i = 0; i < 140; i++) {
    const x = (i * 173.7 + s.seed) % 1800,
      y = (i * 101.3) % 1200;
    polygon(
      ctx,
      x,
      y,
      3 + (i % 7),
      5,
      i % 3 === 0 ? "#63757a20" : "#69768e12",
      i,
    );
  }
  ctx.strokeStyle = "#7a82994d";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 1760, 1160);
  for (const wall of s.walls) {
    ctx.fillStyle = "#080d1855";
    ctx.fillRect(wall.x + 8, wall.y + 12, wall.w, wall.h);
    ctx.fillStyle = "#30394b";
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.fillStyle = "#3b485b";
    ctx.fillRect(wall.x, wall.y, wall.w, 9);
    line(ctx, wall.x, wall.y, wall.x + wall.w, wall.y, "#8292a766", 2);
    for (let j = 0; j < wall.w; j += 40)
      line(
        ctx,
        wall.x + j,
        wall.y + 12,
        wall.x + j + 15,
        wall.y + wall.h - 12,
        "#79839613",
      );
  }
  const pulse = reducedMotion ? 0 : Math.sin(s.time * 2) * 4;
  if (s.hybrid) {
    circle(ctx, 900, 600, 90, "#94f0d909");
    polygon(ctx, 900, 606, 52, 6, "#080f1970");
    polygon(ctx, 900, 600, 46, 6, "#283c4a", Math.PI / 6);
    ctx.strokeStyle = "#85d9c5";
    ctx.lineWidth = 2;
    ctx.stroke();
    crystal(ctx, 900, 591, "#a1ead3", 25);
    label(ctx, "REACTOR", 900, 667, "#a4d5ca", 11);
    ctx.fillStyle = "#3b4e58";
    ctx.fillRect(864, 677, 72, 4);
    ctx.fillStyle = "#92dec2";
    ctx.fillRect(864, 677, 72 * clamp(s.core.hp / 180, 0, 1), 4);
    for (const node of s.nodes)
      if (node.amount > 0) {
        circle(ctx, node.x, node.y, 25, "#ca92d713");
        crystal(ctx, node.x, node.y, "#d09ccb", 16);
      }
  } else {
    const active =
      s.collected === 3 && s.wave >= s.rules.waves && !s.enemies.length;
    circle(ctx, 900, 600, 68 + pulse, active ? "#af94f51b" : "#8290bb09");
    ctx.beginPath();
    ctx.ellipse(900, 588, 42, 60, 0, 0, Math.PI * 2);
    ctx.strokeStyle = active ? "#bfb1ff" : "#65618d";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(900, 588, 33, 50, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "#baa2ff40";
    ctx.lineWidth = 2;
    ctx.stroke();
    label(
      ctx,
      active ? "EXTRACTION OPEN" : "RIFT GATE",
      900,
      682,
      "#b6a7df",
      11,
    );
    for (const shard of s.shards) {
      circle(ctx, shard.x, shard.y, 34 + pulse, "#c5a6ff14");
      crystal(ctx, shard.x, shard.y, "#c1a5ff", 22);
      label(ctx, "SHARD", shard.x, shard.y + 41, "#bfb0d8", 10);
    }
  }
  for (const t of s.turrets) {
    polygon(ctx, t.x, t.y, 22, 6, "#293e42");
    polygon(ctx, t.x, t.y, 13, 6, "#8ec8b7");
    line(ctx, t.x, t.y, t.x, t.y - 25, "#cdfae9", 6);
    circle(ctx, t.x, t.y, 5, "#263d42");
  }
  for (const b of s.bullets) {
    line(ctx, b.x - b.vx * 0.013, b.y - b.vy * 0.013, b.x, b.y, "#b2fbe1", 3);
    circle(ctx, b.x, b.y, 3, "#ebfff7");
  }
  for (const e of s.enemies) sentinel(ctx, e.x, e.y, e.hp);
  for (const p of s.particles) {
    circle(ctx, p.x, p.y, (0.5 - p.life) * 45, "#f8beae44");
  }
  if (s.player.invulnerable > 0) {
    circle(ctx, s.player.x, s.player.y, 27, "#a0f8d942");
  }
  operator(ctx, s.player.x, s.player.y);
  // Ring and color are supplementary; HP and enemy counts also exist as readable DOM text.
  ctx.restore();
  const targets = s.hybrid
    ? [{ ...s.core, label: "REACTOR" }]
    : s.shards.length
      ? s.shards.map((sh) => ({ ...sh, label: "SHARD" }))
      : [{ ...s.portal, label: "GATE" }];
  for (const t of targets) {
    const x = t.x - camera.x,
      y = t.y - camera.y;
    if (x < 25 || x > W - 25 || y < 25 || y > H - 25) {
      const px = clamp(x, 38, W - 38),
        py = clamp(y, 38, H - 55);
      polygon(ctx, px, py, 7, 3, "#c4adff", Math.atan2(y - H / 2, x - W / 2));
      label(ctx, t.label, px, py + 22, "#d8c9ee", 9);
    }
  }
  // Compact world map, all dimensions bounded.
  ctx.fillStyle = "#090f1ad9";
  ctx.fillRect(842, 491, 140, 110);
  ctx.strokeStyle = "#64708655";
  ctx.strokeRect(842, 491, 140, 110);
  const map = (p, c, r = 2) =>
    circle(ctx, 851 + (p.x / 1800) * 122, 505 + (p.y / 1200) * 80, r, c);
  s.walls.forEach((w) => {
    ctx.fillStyle = "#586173";
    ctx.fillRect(
      851 + (w.x / 1800) * 122,
      505 + (w.y / 1200) * 80,
      (w.w / 1800) * 122,
      (w.h / 1200) * 80,
    );
  });
  s.enemies.forEach((e) => map(e, "#e793a7"));
  s.shards.forEach((sh) => map(sh, "#b9a2ff", 3));
  map(s.core, "#94caba", 3);
  map(s.player, "#ffffff", 3);
  label(ctx, "SECTOR MAP", 910, 591, "#a5b6c7", 8);
  if (contrast) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }
}
export function drawTactics(ctx, s) {
  backdrop(ctx, "#151f29");
  const { x: ox, y: oy, cell: c } = tacticalLayout;
  label(ctx, "SECTOR 07  /  COMMAND GRID", W / 2, 37, "#879aab", 12);
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 9; x++) {
      const px = ox + x * c,
        py = oy + y * c,
        p = { x, y };
      const move =
        s.ap > 0 && reachable(s, s.player, p, 2) && !same(p, s.player);
      ctx.fillStyle = move ? "#295049" : "#1f2e3b";
      ctx.fillRect(px + 2, py + 2, c - 4, c - 4);
      ctx.strokeStyle = move ? "#75b89c55" : "#78879912";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2, py + 2, c - 4, c - 4);
      if (move) circle(ctx, px + c / 2, py + c / 2, 3, "#8ad3b6");
      if (s.walls.some((w) => same(w, p))) {
        ctx.fillStyle = "#556979";
        ctx.fillRect(px + 10, py + 12, c - 20, c - 20);
        ctx.fillStyle = "#77909a";
        ctx.fillRect(px + 10, py + 12, c - 20, 7);
        line(ctx, px + 17, py + 29, px + c - 17, py + 29, "#9db1b050", 2);
        label(ctx, "▰", px + c / 2, py + c / 2 + 12, "#354754", 20);
      }
      if (same(p, s.cursor)) {
        ctx.strokeStyle = "#ead7a4";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 4, py + 4, c - 8, c - 8);
      }
    }
  for (const e of s.enemies) {
    const x = ox + e.x * c + c / 2,
      y = oy + e.y * c + c / 2;
    if (canShoot(s, s.player, e)) {
      ctx.strokeStyle = "#e68e9b";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 27, y - 27, 54, 54);
    }
    sentinel(ctx, x, y, e.hp);
  }
  operator(ctx, ox + s.player.x * c + c / 2, oy + s.player.y * c + c / 2);
  for (let x = 0; x < 9; x++)
    label(
      ctx,
      String.fromCharCode(65 + x),
      ox + x * c + c / 2,
      oy - 14,
      "#6f8798",
      10,
    );
  for (let y = 0; y < 7; y++)
    label(ctx, "" + (y + 1), ox - 18, oy + y * c + c / 2 + 4, "#6f8798", 10);
  label(
    ctx,
    "● MOVE   ◇ SENTINEL   ▰ COVER   □ SELECTION",
    W / 2,
    599,
    "#9bb8ba",
    11,
  );
}
export function drawPuzzle(ctx, s, { reducedMotion = false } = {}) {
  backdrop(ctx, "#12242a");
  const { x: ox, y: oy, cell: c } = puzzleLayout;
  label(ctx, "THE SIGNAL FLOWS FROM THE UPPER LEFT", W / 2, 37, "#93b6b4", 11);
  for (let i = 0; i < 25; i++) {
    const x = ox + (i % 5) * c,
      y = oy + Math.floor(i / 5) * c,
      cx = x + c / 2,
      cy = y + c / 2,
      powered = s.powered.includes(i);
    ctx.fillStyle = powered ? "#21443f" : "#1c3239";
    ctx.fillRect(x + 4, y + 4, c - 8, c - 8);
    ctx.strokeStyle = powered ? "#82d2b74d" : "#566c732d";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 4, y + 4, c - 8, c - 8);
    for (const d of directions)
      if (s.tiles[i] & d.bit) {
        line(
          ctx,
          cx,
          cy,
          cx + (d.x * c) / 2,
          cy + (d.y * c) / 2,
          "#0b1921",
          13,
        );
        line(
          ctx,
          cx,
          cy,
          cx + (d.x * c) / 2,
          cy + (d.y * c) / 2,
          powered ? "#93e7c8" : "#68818b",
          5,
        );
      }
    circle(ctx, cx, cy, 12, powered ? "#7cd8b8" : "#3c5964");
    circle(ctx, cx, cy, 5, powered ? "#dafbef" : "#77939a");
    if (i === 0) {
      circle(ctx, cx, cy, 20, "#99eac41c");
      label(ctx, "SOURCE", cx, y + 19, "#c4ffdf", 8);
    }
    if (s.cursor === i) {
      ctx.strokeStyle = "#f4ddad";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 7, y + 7, c - 14, c - 14);
    }
  }
  label(ctx, "ROTATE · CONNECT · RESTORE", W / 2, 575, "#b2d1c3", 11);
}
