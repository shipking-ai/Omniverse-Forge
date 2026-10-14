import {
  rng,
  randomInt,
  clamp,
  distance,
  moveBody,
  circleRect,
  finish,
  difficultyFactor,
  finite,
  validPoint,
  statusValid,
  gridPath,
  clearSegment,
} from "../core.js";
const WIDTH = 1800,
  HEIGHT = 1200;
export function createAction(rules, hybrid = false) {
  const random = rng(rules.seed);
  const walls = [];
  // Keep a broad walkable cross through the world; corner obstacles never seal objectives.
  for (const [x, y] of [
    [300, 270],
    [1220, 220],
    [280, 790],
    [1260, 780],
  ])
    walls.push({
      x: x + random() * 55,
      y: y + random() * 55,
      w: 120 + random() * 100,
      h: 90 + random() * 70,
    });
  const s = {
    version: 1,
    type: "action",
    hybrid,
    rules,
    status: "playing",
    time: 0,
    player: { x: 900, y: 730, hp: 100, invulnerable: 0, dash: 0, fire: 0 },
    core: { x: 900, y: 600, hp: 180 },
    walls,
    enemies: [],
    bullets: [],
    particles: [],
    nodes: [],
    turrets: [],
    shards: [],
    ore: hybrid ? 3 : 0,
    collected: 0,
    kills: 0,
    wave: 0,
    nextWave: hybrid ? 12 : 2,
    seed: rules.seed,
    message: hybrid
      ? "Mine crystals with E. Build your first turret with B."
      : "Recover the three shards. Hold Space to pulse-fire.",
    notice: 5,
    portal: { x: 900, y: 600 },
    camera: { x: 900, y: 730 },
    shotCount: 0,
  };
  if (!hybrid)
    s.shards = [
      { x: 180, y: 600 },
      { x: 1580, y: 590 },
      { x: 920, y: 160 },
    ];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI * 2) / 10;
    s.nodes.push({
      x: 900 + Math.cos(a) * randomInt(random, 250, 500),
      y: 600 + Math.sin(a) * randomInt(random, 240, 420),
      amount: 2,
    });
  }
  return s;
}
function announce(s, message) {
  s.message = message;
  s.notice = 3;
}
function spawnWave(s) {
  s.wave++;
  const rand = rng(s.seed + s.wave * 91);
  const count = s.hybrid ? 4 + s.wave * 2 : 3 + s.wave;
  for (let i = 0; i < count; i++) {
    let point;
    for (let attempt = 0; attempt < 100; attempt++) {
      const a = rand() * Math.PI * 2;
      point = {
        x: clamp(s.player.x + Math.cos(a) * 590, 40, WIDTH - 40),
        y: clamp(s.player.y + Math.sin(a) * 520, 40, HEIGHT - 40),
      };
      if (!s.walls.some((w) => circleRect(point.x, point.y, 24, w))) break;
    }
    if (s.walls.some((w) => circleRect(point.x, point.y, 24, w)))
      point = { x: 60, y: 60 };
    s.enemies.push({
      ...point,
      hp: s.wave === 3 ? 3 : 2,
      attack: 0,
      phase: rand() * 10,
      path: [],
      navTimer: 0,
    });
  }
  announce(s, `Wave ${s.wave} incoming · ${count} sentinels`);
}
function fire(s, from, target, friendly = true) {
  const a = Math.atan2(target.y - from.y, target.x - from.x);
  s.bullets.push({
    x: from.x,
    y: from.y,
    vx: Math.cos(a) * 650,
    vy: Math.sin(a) * 650,
    life: 1.3,
    friendly,
  });
  s.shotCount++;
}
function closest(from, list) {
  return list.reduce(
    (best, e) => (!best || distance(from, e) < distance(from, best) ? e : best),
    null,
  );
}
export function actionCommand(s, action) {
  if (s.status !== "playing") return;
  if (action === "interact" && s.hybrid) {
    const node = closest(
      s.player,
      s.nodes.filter((n) => n.amount > 0),
    );
    if (node && distance(node, s.player) < 90) {
      s.ore += node.amount;
      node.amount = 0;
      announce(s, "Crystal harvested · +2 ore");
    } else announce(s, "Move closer to a crystal to mine it.");
  }
  if (action === "build" && s.hybrid) {
    if (!s.rules.turrets)
      return announce(s, "Construction is disabled in this ruleset.");
    if (s.ore < 3)
      return announce(s, "A turret costs 3 ore. Mine a crystal with E.");
    if (s.turrets.length >= 8)
      return announce(s, "Outpost at capacity · 8 turrets.");
    if (
      distance(s.player, s.core) < 65 ||
      s.turrets.some((t) => distance(t, s.player) < 60)
    )
      return announce(s, "Leave more room between structures.");
    s.ore -= 3;
    s.turrets.push({ x: s.player.x, y: s.player.y, cooldown: 0 });
    announce(s, "Sentry online · automatic defense active");
  }
  if (action === "dash" && s.player.dash <= 0) {
    s.player.dash = 2;
    s.player.invulnerable = 0.28;
  }
}
export function stepAction(s, dt, input = {}) {
  if (s.status !== "playing") return;
  dt = clamp(dt, 0, 0.05);
  s.time += dt;
  s.notice = Math.max(0, s.notice - dt);
  const p = s.player;
  p.invulnerable = Math.max(0, p.invulnerable - dt);
  p.dash = Math.max(0, p.dash - dt);
  p.fire -= dt;
  const x = (input.right ? 1 : 0) - (input.left ? 1 : 0),
    y = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const len = Math.hypot(x, y) || 1;
  const speed = p.dash > 1.75 ? 620 : 240;
  moveBody(
    p,
    (x / len) * speed * dt,
    (y / len) * speed * dt,
    s.walls,
    WIDTH,
    HEIGHT,
  );
  s.camera.x += (p.x - s.camera.x) * Math.min(1, dt * 9);
  s.camera.y += (p.y - s.camera.y) * Math.min(1, dt * 9);
  if (input.fire && p.fire <= 0) {
    const target = input.aim ||
      closest(p, s.enemies) || { x: p.x, y: p.y - 50 };
    fire(s, p, target);
    p.fire = 0.2;
  }
  if (!s.enemies.length && s.wave < s.rules.waves) {
    s.nextWave -= dt;
    if (s.nextWave <= 0) {
      spawnWave(s);
      s.nextWave = s.hybrid ? 7 : 3;
    }
  }
  const factor = difficultyFactor(s.rules);
  for (const e of s.enemies) {
    e.attack -= dt;
    const target = s.hybrid && distance(e, p) > 220 ? s.core : p;
    const d = distance(e, target) || 1;
    const speed = (65 + s.wave * 8) * factor;
    if (d > 30) {
      e.navTimer = (e.navTimer || 0) - dt;
      if (e.navTimer <= 0) {
        e.path = clearSegment(e, target, s.walls)
          ? []
          : gridPath(e, target, s.walls);
        e.navTimer = 0.8;
      }
      while (e.path?.length && distance(e, e.path[0]) < 9) e.path.shift();
      const waypoint = e.path?.[0] || target,
        remaining = distance(e, waypoint) || 1,
        travel = Math.min(speed * dt, remaining);
      moveBody(
        e,
        ((waypoint.x - e.x) / remaining) * travel,
        ((waypoint.y - e.y) / remaining) * travel,
        s.walls,
        WIDTH,
        HEIGHT,
        15,
      );
    }
    if (d < 40 && e.attack <= 0) {
      if (target === s.core || p.invulnerable <= 0) {
        target.hp -= 8 * factor;
        if (target === p) p.invulnerable = 0.5;
      }
      e.attack = 0.8;
    }
  }
  for (const t of s.turrets) {
    t.cooldown -= dt;
    const target = closest(t, s.enemies);
    if (t.cooldown <= 0 && target && distance(t, target) < 380) {
      fire(s, t, target);
      t.cooldown = 0.55;
    }
  }
  for (const b of s.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (s.walls.some((w) => circleRect(b.x, b.y, 4, w))) b.life = 0;
    if (b.life > 0) {
      const e = s.enemies.find((e) => e.hp > 0 && distance(e, b) < 24);
      if (e) {
        e.hp--;
        b.life = 0;
        for (let i = 0; i < 4; i++)
          s.particles.push({ x: e.x, y: e.y, life: 0.25 + i * 0.06 });
      }
    }
  }
  const dead = s.enemies.filter((e) => e.hp <= 0);
  s.kills += dead.length;
  if (s.hybrid) s.ore += dead.length;
  s.enemies = s.enemies.filter((e) => e.hp > 0);
  s.bullets = s.bullets.filter((b) => b.life > 0);
  s.particles = s.particles.filter((p) => {
    p.life -= dt;
    return p.life > 0;
  });
  s.shards = s.shards.filter((shard) => {
    if (distance(p, shard) < 36) {
      s.collected++;
      announce(s, `Rift shard recovered · ${s.collected}/3`);
      return false;
    }
    return true;
  });
  if (p.hp <= 0)
    finish(
      s,
      "lost",
      "Operator down. Your next expedition starts with what you learned.",
    );
  else if (s.hybrid && s.core.hp <= 0)
    finish(
      s,
      "lost",
      "The reactor went dark. Build closer to the core and intercept the next wave.",
    );
  else if (!s.enemies.length && s.wave >= s.rules.waves) {
    if (s.hybrid)
      finish(
        s,
        "won",
        "Outpost secured. A new light at the edge of the universe.",
      );
    else if (s.collected === 3 && distance(p, s.portal) < 72)
      finish(s, "won", "Rift stabilized. You brought every shard home.");
    else if (s.notice <= 0)
      s.message =
        s.collected === 3
          ? "The portal is open. Return to the center."
          : "The sentinels are gone. Recover the remaining shards.";
  }
}
export function actionHUD(s) {
  return [
    { label: "INTEGRITY", value: `${Math.max(0, Math.ceil(s.player.hp))}%` },
    {
      label: s.hybrid ? "REACTOR" : "SHARDS",
      value: s.hybrid
        ? `${Math.max(0, Math.ceil(s.core.hp / 1.8))}%`
        : `${s.collected} / 3`,
    },
    { label: "WAVE", value: `${s.wave} / ${s.rules.waves}` },
    {
      label: s.hybrid ? "ORE" : "SENTINELS",
      value: s.hybrid ? s.ore : s.kills,
    },
  ];
}
export function validateAction(s) {
  return (
    s?.type === "action" &&
    statusValid(s) &&
    typeof s.hybrid === "boolean" &&
    validPoint(s.player) &&
    validPoint(s.core) &&
    validPoint(s.camera) &&
    validPoint(s.portal) &&
    ["hp", "invulnerable", "dash", "fire"].every((k) => finite(s.player[k])) &&
    finite(s.core.hp) &&
    [
      "time",
      "ore",
      "collected",
      "kills",
      "wave",
      "nextWave",
      "seed",
      "shotCount",
      "notice",
    ].every((k) => finite(s[k])) &&
    typeof s.message === "string" &&
    s.message.length < 500 &&
    [
      "walls",
      "enemies",
      "bullets",
      "nodes",
      "turrets",
      "shards",
      "particles",
    ].every(
      (k) =>
        Array.isArray(s[k]) && s[k].length <= 200 && s[k].every(validPoint),
    ) &&
    s.walls.every((w) => finite(w.w, 1, 500) && finite(w.h, 1, 500)) &&
    s.enemies.every(
      (e) =>
        finite(e.hp) &&
        finite(e.attack) &&
        finite(e.phase) &&
        (e.navTimer === undefined || finite(e.navTimer)) &&
        (e.path === undefined ||
          (Array.isArray(e.path) &&
            e.path.length <= 600 &&
            e.path.every(validPoint))),
    ) &&
    s.bullets.every((b) => ["vx", "vy", "life"].every((k) => finite(b[k]))) &&
    s.nodes.every((n) => finite(n.amount, 0, 20)) &&
    s.turrets.every((t) => finite(t.cooldown)) &&
    s.particles.every((p) => finite(p.life))
  );
}
