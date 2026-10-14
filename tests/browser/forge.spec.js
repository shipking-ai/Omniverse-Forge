import { test, expect } from "@playwright/test";
import { createPuzzle, rotate } from "../../src/modes/puzzle.js";
import { normalizeRules } from "../../src/core.js";
const launch = async (page, title) => {
  await page
    .getByRole("button", { name: `Explore ${title}`, exact: true })
    .click();
  await page.getByRole("button", { name: "Launch expedition" }).click();
  await expect(page.locator("#game")).toBeVisible();
};
const snapshot = (page) => page.evaluate(() => window.__forge.snapshot());
const tile = async (page, x, y, layout) => {
  const b = await page.locator("#game").boundingBox();
  await page.mouse.click(
    b.x + ((layout.x + (x + 0.5) * layout.cell) / 1000) * b.width,
    b.y + ((layout.y + (y + 0.5) * layout.cell) / 620) * b.height,
  );
};
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("launcher, filtering, search, navigation, and onboarding are functional", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await expect(
    page.getByRole("heading", { name: "Welcome to your universe." }),
  ).toBeVisible();
  await expect(page.locator(".world-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Puzzle", exact: true }).click();
  await expect(page.locator(".world-card:visible")).toHaveCount(1);
  await page.getByRole("button", { name: "All worlds", exact: true }).click();
  await page.getByRole("searchbox").fill("frontier");
  await expect(page.locator(".world-card:visible")).toHaveCount(1);
  await page.getByRole("searchbox").fill("unknown galaxy");
  await expect(page.locator(".empty-search")).toBeVisible();
  await page.getByRole("searchbox").fill("");
  await launch(page, "Rift Runner");
  await expect(page.locator(".hud-item")).toHaveCount(4);
  expect(errors).toEqual([]);
});
test("real action input moves, shoots, dashes, pauses, and resumes", async ({
  page,
}) => {
  await launch(page, "Rift Runner");
  const before = await snapshot(page);
  await page.keyboard.down("KeyD");
  await page.waitForTimeout(300);
  await page.keyboard.up("KeyD");
  expect((await snapshot(page)).state.player.x).toBeGreaterThan(
    before.state.player.x + 20,
  );
  await page.keyboard.down("Space");
  await page.waitForTimeout(400);
  await page.keyboard.up("Space");
  expect((await snapshot(page)).state.shotCount).toBeGreaterThan(0);
  await page.keyboard.press("ShiftLeft");
  expect((await snapshot(page)).state.player.dash).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  const paused = await snapshot(page);
  await page.waitForTimeout(250);
  expect((await snapshot(page)).state.time).toEqual(paused.state.time);
  await page.getByRole("button", { name: "Resume expedition" }).click();
  expect((await snapshot(page)).paused).toEqual(false);
});
test("save and reload resumes exact seed, mode, position, and progress", async ({
  page,
}) => {
  await launch(page, "Rift Runner");
  await page.keyboard.down("KeyD");
  await page.waitForTimeout(150);
  await page.keyboard.up("KeyD");
  await page.getByRole("button", { name: "Save & leave" }).click();
  const saved = await page.evaluate(() => window.__forge.profile().session);
  await page.reload();
  await page.locator("#continue-session").click();
  const current = await snapshot(page);
  expect(current.mode).toBe("rift");
  expect(current.state.rules.seed).toBe(saved.state.rules.seed);
  expect(current.state.player.x).toBe(saved.state.player.x);
  expect(current.state.collected).toBe(saved.state.collected);
});
test("settings persist, remapping rejects duplicates, and remapped movement works", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Open settings", exact: true })
    .click();
  await page.locator("#setting-reducedMotion").check();
  await page.locator("#setting-textScale").check();
  await page.locator("#setting-sound").uncheck();
  await page.locator('[data-bind="up"]').click();
  await page.keyboard.press("KeyD");
  await expect(page.locator("#bind-notice")).toContainText("already assigned");
  await page.keyboard.press("KeyI");
  await expect(page.locator('[data-bind="up"]')).toHaveText("I");
  await page.getByRole("button", { name: "All set" }).click();
  await page.reload();
  await expect(page.locator("body")).toHaveClass(/reduced-motion/);
  await launch(page, "Rift Runner");
  const old = (await snapshot(page)).state.player.y;
  await page.keyboard.down("KeyI");
  await page.waitForTimeout(200);
  await page.keyboard.up("KeyI");
  expect((await snapshot(page)).state.player.y).toBeLessThan(old);
  expect(
    (await page.evaluate(() => window.__forge.profile())).settings.sound,
  ).toBe(false);
});
test("hybrid construction, rules import validation, and incompatible clock rejection", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Forge lab", exact: true }).click();
  await page.locator("#lab-turns").check();
  await expect(page.locator("#launch-custom")).toBeDisabled();
  await expect(page.locator("#compatibility")).toContainText("Choose a clock");
  await page.locator("#lab-turns").uncheck();
  await page.locator("#lab-seed").fill("42");
  await page.locator("#lab-waves").selectOption("2");
  await page.locator("#import-rules").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"script":"alert(1)"}'),
  });
  await expect(page.locator("#toast")).toContainText("Not a supported");
  await page.locator("#launch-custom").click();
  await page.getByRole("button", { name: "Launch expedition" }).click();
  expect((await snapshot(page)).state.rules.seed).toBe(42);
  await page.keyboard.press("KeyB");
  const state = (await snapshot(page)).state;
  expect(state.turrets).toHaveLength(1);
  expect(state.ore).toBe(0);
  await expect(page.locator("#game-message")).toContainText("Sentry online");
});
test("signal puzzle completes via real tile clicks, awards XP, and restarts", async ({
  page,
}) => {
  await launch(page, "Signal Garden");
  const reference = createPuzzle(normalizeRules());
  const layout = { x: 280, y: 85, cell: 88 };
  for (let i = 0; i < 25; i++) {
    let n = 0;
    while (reference.tiles[i] !== reference.solution[i] && n++ < 4) {
      await tile(page, i % 5, Math.floor(i / 5), layout);
      reference.tiles[i] = rotate(reference.tiles[i]);
    }
  }
  await expect(page.locator("#game-overlay")).toContainText(
    "EXPEDITION COMPLETE",
  );
  expect((await snapshot(page)).state.status).toBe("won");
  const profile = await page.evaluate(() => window.__forge.profile());
  expect(profile.xp).toBe(120);
  expect(profile.completed.signal).toBe(1);
  await page.getByRole("button", { name: "Explore again" }).click();
  expect((await snapshot(page)).state.moves).toBe(0);
  expect((await snapshot(page)).state.status).toBe("playing");
});
test("tactics click actions, keyboard selection, enemy turns, and loss flow work", async ({
  page,
}) => {
  await launch(page, "Bastion Protocol");
  await tile(page, 1, 2, { x: 194, y: 82, cell: 68 });
  expect((await snapshot(page)).state.ap).toBe(1);
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Enter");
  expect((await snapshot(page)).state.player.x).toBe(0);
  for (let i = 0; i < 50; i++) {
    if ((await snapshot(page)).state.status !== "playing") break;
    await page.getByRole("button", { name: "End turn" }).click();
  }
  await expect(page.locator("#game-overlay")).toContainText("EXPEDITION ENDED");
  await page.getByRole("button", { name: "Back to your universe" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome to your universe." }),
  ).toBeVisible();
});
test("restart confirmation preserves rules but resets active state", async ({
  page,
}) => {
  await launch(page, "Signal Garden");
  await page.keyboard.press("Enter");
  expect((await snapshot(page)).state.moves).toBe(1);
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await page.getByRole("button", { name: "Keep exploring" }).click();
  expect((await snapshot(page)).state.moves).toBe(1);
  expect((await snapshot(page)).paused).toBe(false);
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await page
    .getByRole("button", { name: "Restart expedition", exact: true })
    .click();
  expect((await snapshot(page)).state.moves).toBe(0);
});
test("corrupt save and denied localStorage recover without page errors", async ({
  page,
}) => {
  await page.evaluate(() =>
    localStorage.setItem("omniverse-forge:v1", "{broken"),
  );
  await page.reload();
  await expect(page.locator("#toast")).toContainText("could not be read");
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("denied", "SecurityError");
      },
    }),
  );
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Welcome to your universe." }),
  ).toBeVisible();
  await launch(page, "Signal Garden");
  expect(errors).toEqual([]);
});
test("mobile layout has no horizontal overflow and touch play works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".hero")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await launch(page, "Frontier Zero");
  const before = (await snapshot(page)).state.player.x;
  const button = page.getByRole("button", { name: "Move right", exact: true });
  await button.dispatchEvent("pointerdown", { pointerId: 1 });
  await page.waitForTimeout(150);
  await button.dispatchEvent("pointerup", { pointerId: 1 });
  expect((await snapshot(page)).state.player.x).toBeGreaterThan(before);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("rules export downloads bounded data, valid import applies configuration", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Forge lab", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export rules" }).click();
  expect((await download).suggestedFilename()).toBe("frontier-rules.json");
  await page.locator("#import-rules").setInputFiles({
    name: "rules.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        format: "omniverse-rules",
        version: 1,
        mode: "frontier",
        rules: {
          seed: 123,
          waves: 5,
          difficulty: "explorer",
          turrets: false,
        },
      }),
    ),
  });
  await expect(page.locator("#lab-seed")).toHaveValue("123");
  await expect(page.locator("#lab-difficulty")).toHaveValue("explorer");
  await expect(page.locator("#lab-turrets")).not.toBeChecked();
});

import { actionPilot, tacticalPilot } from "../../scripts/scenarios.js";
test("tactics full expedition is winnable via real grid clicks and end-turn buttons", async ({
  page,
}) => {
  await launch(page, "Bastion Protocol");
  for (let i = 0; i < 100; i++) {
    const s = (await snapshot(page)).state;
    if (s.status !== "playing") break;
    const [cmd, p] = tacticalPilot(s);
    if (cmd === "end-turn")
      await page.getByRole("button", { name: "End turn" }).click();
    else await tile(page, p.x, p.y, { x: 194, y: 82, cell: 68 });
  }
  await expect(page.locator("#game-overlay")).toContainText(
    "EXPEDITION COMPLETE",
  );
  expect(
    (await page.evaluate(() => window.__forge.profile())).completed.bastion,
  ).toBe(1);
});
for (const [title, hybrid] of [
  ["Rift Runner", false],
  ["Frontier Zero", true],
])
  test(`${title} full expedition finishes through actual keyboard gameplay`, async ({
    page,
  }) => {
    test.setTimeout(150000);
    await launch(page, title);
    const pilot = actionPilot(hybrid),
      down = new Set();
    const map = {
      fire: "Space",
      up: "KeyW",
      down: "KeyS",
      left: "KeyA",
      right: "KeyD",
    };
    for (let i = 0; i < 1000; i++) {
      const s = (await snapshot(page)).state;
      if (s.status !== "playing") break;
      const input = pilot(s);
      for (const [action, key] of Object.entries(map)) {
        if (input[action] && !down.has(key)) {
          await page.keyboard.down(key);
          down.add(key);
        } else if (!input[action] && down.has(key)) {
          await page.keyboard.up(key);
          down.delete(key);
        }
      }
      if (input.build) await page.keyboard.press("KeyB");
      await page.waitForTimeout(100);
    }
    for (const key of down) await page.keyboard.up(key);
    await expect(page.locator("#game-overlay")).toContainText(
      "EXPEDITION COMPLETE",
    );
    const s = (await snapshot(page)).state;
    expect(s.kills).toBe(hybrid ? 24 : 15);
    if (hybrid) expect(s.turrets.length).toBeGreaterThan(0);
    else expect(s.collected).toBe(3);
  });
