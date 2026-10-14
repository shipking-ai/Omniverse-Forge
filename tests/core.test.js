import { test } from "node:test";
import assert from "node:assert/strict";
import {
  rng,
  clamp,
  normalizeRules,
  moveBody,
  circleRect,
} from "../src/core.js";
import { modes, validateCombination } from "../src/registry.js";
import {
  defaultSave,
  loadSave,
  writeSave,
  validateSession,
  sanitizeSettings,
  award,
  SAVE_KEY,
} from "../src/storage.js";
const memory = () => {
  let data = {};
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => (data[k] = v) };
};
test("seeded RNG is reproducible and bounded", () => {
  const a = rng(2701),
    b = rng(2701);
  for (let i = 0; i < 1000; i++) {
    const x = a();
    assert.equal(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});
test("different seeds generate different worlds", () =>
  assert.notEqual(rng(1)(), rng(2)()));
test("rules normalize untrusted input to a bounded schema", () =>
  assert.deepEqual(
    normalizeRules({
      seed: Infinity,
      waves: 1e9,
      difficulty: "god",
      turrets: 0,
      script: "alert(1)",
    }),
    { seed: 999999, waves: 5, difficulty: "standard", turrets: true },
  ));
test("null rules use safe defaults", () =>
  assert.deepEqual(normalizeRules(null), normalizeRules()));
test("collision blocks walls but permits sliding", () => {
  const p = { x: 30, y: 50 };
  moveBody(p, 40, 30, [{ x: 60, y: 20, w: 40, h: 100 }], 200, 200, 10);
  assert.equal(p.x, 30);
  assert.equal(p.y, 80);
});
test("collision keeps player inside bounds", () => {
  const p = { x: 50, y: 50 };
  moveBody(p, -999, 999, [], 100, 100, 10);
  assert.deepEqual(p, { x: 10, y: 90 });
});
test("circle-rectangle corner intersection works", () => {
  assert.ok(circleRect(19, 19, 2, { x: 20, y: 20, w: 10, h: 10 }));
  assert.equal(circleRect(17, 17, 2, { x: 20, y: 20, w: 10, h: 10 }), false);
});
test("all four plugins conform to the lifecycle contract", () => {
  assert.equal(modes.length, 4);
  assert.equal(new Set(modes.map((m) => m.id)).size, 4);
  for (const m of modes) {
    for (const f of ["create", "step", "command", "hud", "draw", "validate"])
      assert.equal(typeof m[f], "function");
    const s = m.create(normalizeRules());
    assert.ok(m.validate(s), m.id);
    assert.equal(m.hud(s).length, 4);
    assert.ok(
      validateSession({ mode: m.id, state: JSON.parse(JSON.stringify(s)) }),
    );
  }
});
test("hybrid compatibility accepts shared real-time systems", () =>
  assert.equal(
    validateCombination(["survival", "building", "tower-defense"], {
      turrets: true,
    }).valid,
    true,
  ));
test("mixed clocks require explicit arbitration", () => {
  assert.equal(
    validateCombination(["action", "turn-based-strategy"]).valid,
    false,
  );
  assert.equal(
    validateCombination(["action", "turn-based-strategy"], {
      clock: "turn-based",
    }).valid,
    true,
  );
});
test("tower defense rejects missing construction", () =>
  assert.equal(
    validateCombination(["survival", "tower-defense"], { turrets: false })
      .valid,
    false,
  ));
test("save roundtrip preserves all plugin states", () => {
  for (const m of modes) {
    const storage = memory(),
      s = defaultSave();
    s.session = { mode: m.id, state: m.create(normalizeRules()) };
    assert.equal(writeSave(s, storage), true);
    assert.deepEqual(loadSave(storage).data, s);
  }
});
test("corrupt JSON is recoverable", () => {
  const storage = memory();
  storage.setItem(SAVE_KEY, "{bad");
  const r = loadSave(storage);
  assert.match(r.error, /could not be read/);
  assert.equal(r.data.xp, 0);
});
test("unsupported save version is recoverable", () => {
  const storage = memory();
  storage.setItem(SAVE_KEY, JSON.stringify({ version: 90 }));
  assert.ok(loadSave(storage).error);
});
test("oversized saves are rejected", () => {
  const storage = memory();
  storage.setItem(SAVE_KEY, " ".repeat(500001));
  assert.ok(loadSave(storage).error);
});
test("denied storage degrades without crashing", () => {
  const storage = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("quota");
    },
  };
  assert.equal(writeSave(defaultSave(), storage), false);
  assert.ok(loadSave(storage).error);
});
test("hostile and malformed sessions cannot enter a mode", () => {
  assert.equal(validateSession({ mode: "__proto__", state: {} }), null);
  assert.equal(
    validateSession({ mode: "rift", state: { type: "action" } }),
    null,
  );
  const state = modes[0].create(normalizeRules());
  state.enemies = Array(201).fill({ x: 0, y: 0 });
  assert.equal(validateSession({ mode: "rift", state }), null);
});
test("invalid nested projectile data is rejected", () => {
  const state = modes[0].create(normalizeRules());
  state.bullets = [{ x: 0, y: 0, vx: Infinity, vy: 1, life: 1 }];
  assert.equal(validateSession({ mode: "rift", state }), null);
});
test("hybrid state cannot masquerade as another mode", () => {
  const state = modes[3].create(normalizeRules());
  assert.equal(validateSession({ mode: "rift", state }), null);
});
test("unsupported settings and duplicate keys reset safely", () => {
  const s = sanitizeSettings({
    volume: 8,
    textScale: 2,
    difficulty: "no",
    keys: { up: "Space", fire: "Space", left: "<script>" },
  });
  assert.equal(s.volume, 1);
  assert.equal(s.textScale, 1);
  assert.equal(s.difficulty, "standard");
  assert.equal(s.keys.up, "KeyW");
  assert.equal(s.keys.left, "KeyA");
});
test("only successful expeditions earn cosmetic XP and best scores", () => {
  const s = defaultSave();
  assert.equal(award(s, "signal", { status: "lost" }), 0);
  assert.equal(
    award(s, "signal", { status: "won", type: "puzzle", moves: 40 }),
    120,
  );
  award(s, "signal", { status: "won", type: "puzzle", moves: 50 });
  assert.equal(s.best.signal, 40);
  assert.equal(s.completed.signal, 2);
  assert.equal(s.xp, 240);
});

import { genres, capabilityGaps } from "../src/genres.js";
test("genre registry has unique entries and covers all requested genre families", () => {
  assert.equal(new Set(genres.map((g) => g.id)).size, genres.length);
  for (const id of [
    "action",
    "metroidvania",
    "mmorpg",
    "4x",
    "physics-sandbox",
    "musical-performance",
    "social-deduction",
    "scientific",
    "unconventional",
  ])
    assert.ok(genres.some((g) => g.id === id));
  assert.ok(genres.length > 100);
});
test("only implemented genre capabilities are promised by mode plugins", () => {
  for (const g of genres.filter((g) => g.status === "implemented"))
    for (const id of g.modes)
      assert.deepEqual(
        capabilityGaps([g.id], modes.find((m) => m.id === id).capabilities),
        [],
        g.id,
      );
});
test("unknown genres and missing capabilities produce explicit failures", () => {
  assert.equal(validateCombination(["action", "made-up-engine"]).valid, false);
  assert.ok(capabilityGaps(["mmorpg"], ["grid"]).includes("networking"));
});
