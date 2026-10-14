import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeRules, distance } from "../src/core.js";
import {
  createAction,
  stepAction,
  actionCommand,
} from "../src/modes/action.js";
import {
  createTactics,
  tacticsCommand,
  reachable,
  canShoot,
  lineOfSight,
} from "../src/modes/tactics.js";
import {
  createPuzzle,
  puzzleCommand,
  network,
  rotate,
} from "../src/modes/puzzle.js";
const rules = normalizeRules();
test("procedural environments are deterministic", () =>
  assert.deepEqual(createAction(rules), createAction(rules)));
test("diagonal movement has normalized speed", () => {
  const a = createAction(rules),
    b = createAction(rules);
  stepAction(a, 0.05, { right: true });
  stepAction(b, 0.05, { right: true, down: true });
  assert.ok(
    Math.abs(
      distance(a.player, { x: 900, y: 730 }) -
        distance(b.player, { x: 900, y: 730 }),
    ) < 0.001,
  );
});
test("large frame deltas are capped", () => {
  const s = createAction(rules);
  stepAction(s, 5, { right: true });
  assert.equal(s.time, 0.05);
  assert.equal(s.player.x, 912);
});
test("dash has a cooldown and accelerates movement", () => {
  const s = createAction(rules);
  actionCommand(s, "dash");
  stepAction(s, 0.05, { right: true });
  assert.equal(s.player.x, 931);
  actionCommand(s, "dash");
  assert.equal(s.player.dash, 1.95);
});
test("collecting shards removes them and counts once", () => {
  const s = createAction(rules);
  Object.assign(s.player, s.shards[0]);
  stepAction(s, 1 / 60, {});
  stepAction(s, 1 / 60, {});
  assert.equal(s.collected, 1);
  assert.equal(s.shards.length, 2);
});
test("combat bullets damage enemies and record kills", () => {
  const s = createAction(rules);
  s.enemies = [{ x: 950, y: 730, hp: 2, attack: 0, phase: 0 }];
  for (let i = 0; i < 60; i++) stepAction(s, 1 / 60, { fire: true });
  assert.equal(s.kills, 1);
  assert.ok(s.shotCount > 0);
});
test("walls stop player projectiles", () => {
  const s = createAction(rules);
  s.walls = [{ x: 930, y: 680, w: 20, h: 100 }];
  s.enemies = [{ x: 985, y: 730, hp: 20, attack: 100, phase: 0 }];
  for (let i = 0; i < 15; i++)
    stepAction(s, 1 / 60, { fire: true, aim: { x: 1100, y: 730 } });
  assert.equal(s.enemies[0].hp, 20);
});
test("mining requires proximity and deposits finite resources", () => {
  const s = createAction(rules, true);
  actionCommand(s, "interact");
  assert.equal(s.ore, 3);
  Object.assign(s.player, s.nodes[0]);
  actionCommand(s, "interact");
  assert.equal(s.ore, 5);
  actionCommand(s, "interact");
  assert.equal(s.ore, 5);
});
test("construction consumes ore and enforces spacing", () => {
  const s = createAction(rules, true);
  actionCommand(s, "build");
  assert.equal(s.turrets.length, 1);
  assert.equal(s.ore, 0);
  s.ore = 3;
  actionCommand(s, "build");
  assert.equal(s.turrets.length, 1);
  assert.equal(s.ore, 3);
});
test("disabled construction cannot create turrets", () => {
  const s = createAction({ ...rules, turrets: false }, true);
  actionCommand(s, "build");
  assert.equal(s.turrets.length, 0);
});
test("turrets autonomously attack in range", () => {
  const s = createAction(rules, true);
  actionCommand(s, "build");
  s.enemies = [{ x: 950, y: 760, hp: 2, attack: 99, phase: 0 }];
  for (let i = 0; i < 90; i++) stepAction(s, 1 / 60, {});
  assert.equal(s.kills, 1);
  assert.equal(s.ore, 1);
});
test("reactor and player destruction both produce losses", () => {
  for (const who of ["core", "player"]) {
    const s = createAction(rules, true);
    s[who].hp = 0;
    stepAction(s, 1 / 60, {});
    assert.equal(s.status, "lost");
  }
});
test("rift requires every objective before extraction", () => {
  const s = createAction(rules);
  s.player.x = 900;
  s.player.y = 600;
  s.wave = 3;
  stepAction(s, 1 / 60, {});
  assert.equal(s.status, "playing");
  s.collected = 3;
  stepAction(s, 1 / 60, {});
  assert.equal(s.status, "won");
});
test("hybrid victory requires a living reactor and cleared waves", () => {
  const s = createAction(rules, true);
  s.wave = 3;
  stepAction(s, 1 / 60, {});
  assert.equal(s.status, "won");
  const hp = s.player.hp;
  stepAction(s, 100, {});
  assert.equal(s.player.hp, hp);
});
test("tactics range uses paths, not through-wall Manhattan distance", () => {
  const s = createTactics(rules);
  s.player = { x: 2, y: 2, hp: 12 };
  assert.equal(reachable(s, s.player, { x: 4, y: 2 }, 2), false);
  assert.equal(reachable(s, s.player, { x: 2, y: 3 }, 2), true);
});
test("tactics cover blocks both attack directions", () => {
  const s = createTactics(rules);
  assert.equal(lineOfSight(s, { x: 2, y: 1 }, { x: 4, y: 1 }), false);
  assert.equal(canShoot(s, { x: 2, y: 1 }, { x: 4, y: 1 }), false);
  assert.equal(canShoot(s, { x: 4, y: 1 }, { x: 2, y: 1 }), false);
});
test("tactics valid actions spend AP; invalid actions do not", () => {
  const s = createTactics(rules);
  tacticsCommand(s, "select", { x: 1, y: 2 });
  assert.equal(s.ap, 1);
  tacticsCommand(s, "select", { x: 3, y: 2 });
  assert.equal(s.ap, 1);
  tacticsCommand(s, "select", { x: 1, y: 1 });
  assert.equal(s.ap, 0);
  tacticsCommand(s, "select", { x: 1, y: 0 });
  assert.equal(s.player.y, 1);
});
test("end turn drives enemy AI and replenishes action points", () => {
  const s = createTactics(rules);
  s.ap = 0;
  const previous = JSON.stringify(s.enemies);
  tacticsCommand(s, "end-turn");
  assert.equal(s.ap, 2);
  assert.equal(s.turn, 2);
  assert.notEqual(JSON.stringify(s.enemies), previous);
});
test("tactics can lose through enemy actions", () => {
  const s = createTactics(rules);
  for (let i = 0; i < 50 && s.status === "playing"; i++)
    tacticsCommand(s, "end-turn");
  assert.equal(s.status, "lost");
});
test("defeating last sentinel wins tactics", () => {
  const s = createTactics(rules);
  s.enemies = [{ x: 2, y: 3, hp: 1 }];
  tacticsCommand(s, "select", { x: 2, y: 3 });
  assert.equal(s.status, "won");
});
test("puzzle rotation is a four-element cycle", () => {
  for (let i = 1; i < 16; i++)
    assert.equal(rotate(rotate(rotate(rotate(i)))), i);
});
test("100 procedural networks have valid connected solutions and scrambled starts", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const s = createPuzzle({ ...rules, seed });
    assert.ok(network(s.solution).solved);
    assert.equal(network(s.tiles).solved, false);
  }
});
test("50 seeded puzzles can be completed through legal rotations within budget", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const s = createPuzzle({ ...rules, seed });
    for (let i = 0; i < 25; i++)
      for (let n = 0; s.tiles[i] !== s.solution[i] && n < 4; n++)
        puzzleCommand(s, "select", i);
    assert.equal(s.status, "won");
    assert.ok(s.moves <= 75);
  }
});
test("puzzle undo restores exact previous network and cost", () => {
  const s = createPuzzle(rules),
    tiles = [...s.tiles];
  puzzleCommand(s, "select", 2);
  puzzleCommand(s, "undo");
  assert.deepEqual(s.tiles, tiles);
  assert.equal(s.moves, 0);
});
test("puzzle budget creates a real loss and terminal state", () => {
  const s = createPuzzle(rules);
  for (let i = 0; i < s.budget; i++) puzzleCommand(s, "select", 0);
  assert.equal(s.status, "lost");
  const tiles = [...s.tiles];
  puzzleCommand(s, "select", 1);
  assert.deepEqual(s.tiles, tiles);
});
test("puzzle ignores malformed selection indices", () => {
  const s = createPuzzle(rules);
  for (const i of [-1, 25, NaN, "0"]) puzzleCommand(s, "select", i);
  assert.equal(s.moves, 0);
});
test("puzzle reverse is inverse rotation at one action cost", () => {
  const s = createPuzzle(rules),
    before = s.tiles[5];
  puzzleCommand(s, "select", 5);
  puzzleCommand(s, "reverse", 5);
  assert.equal(s.tiles[5], before);
  assert.equal(s.moves, 2);
});
test("restarting each architecture with the same rules reproduces state", () => {
  for (const create of [createAction, createTactics, createPuzzle])
    assert.deepEqual(create(rules), create(rules));
});

import { actionPilot, tacticalPilot } from "../scripts/scenarios.js";
import { gridPath, circleRect, clearSegment } from "../src/core.js";
test("action navigation finds a collision-clear path around cover", () => {
  const walls = [{ x: 240, y: 120, w: 180, h: 360 }],
    path = gridPath({ x: 180, y: 300 }, { x: 540, y: 300 }, walls, 720, 600);
  assert.ok(path.length > 0);
  assert.ok(path.every((p) => !walls.some((w) => circleRect(p.x, p.y, 17, w))));
  assert.equal(
    clearSegment({ x: 180, y: 300 }, { x: 540, y: 300 }, walls),
    false,
  );
  for (let i = 1; i < path.length; i++)
    assert.equal(clearSegment(path[i - 1], path[i], walls), true);
});
test("20 seeded action expeditions finish through ordinary movement and combat", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const s = createAction({ ...rules, seed }),
      pilot = actionPilot(false);
    for (let i = 0; i < 12000 && s.status === "playing"; i++)
      stepAction(s, 1 / 60, pilot(s));
    assert.equal(
      s.status,
      "won",
      `seed ${seed}: ${s.enemies.length} enemies, ${s.collected} shards`,
    );
    assert.equal(s.kills, 15);
  }
});
test("20 seeded hybrid expeditions finish through ordinary movement, fire, and construction", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const s = createAction({ ...rules, seed }, true),
      pilot = actionPilot(true);
    for (let i = 0; i < 12000 && s.status === "playing"; i++) {
      const input = pilot(s);
      if (input.build) actionCommand(s, "build");
      stepAction(s, 1 / 60, input);
    }
    assert.equal(s.status, "won", `seed ${seed}: ${s.enemies.length} enemies`);
    assert.ok(s.turrets.length > 0);
    assert.equal(s.kills, 24);
    assert.ok(s.core.hp > 0);
  }
});
test("complete tactics expedition succeeds through legal move/attack/end-turn commands", () => {
  const s = createTactics(rules);
  for (let i = 0; i < 100 && s.status === "playing"; i++)
    tacticsCommand(s, ...tacticalPilot(s));
  assert.equal(s.status, "won");
  assert.equal(s.kills, 4);
  assert.ok(s.player.hp > 0);
});
