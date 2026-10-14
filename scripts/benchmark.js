import { performance } from "node:perf_hooks";
import { cpus, platform, arch, totalmem } from "node:os";
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
import { launchOptions } from "./browser.js";
import {
  createAction,
  stepAction,
  actionCommand,
} from "../src/modes/action.js";
import { normalizeRules } from "../src/core.js";
import { actionPilot } from "./scenarios.js";
const result = {
  measuredAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: platform(),
    arch: arch(),
    cpu: cpus()[0]?.model,
    logicalCPUs: cpus().length,
    hostMemoryBytes: totalmem(),
    note: "Shared sandbox; host resources are not guaranteed allocations. Headless Linux results are not mobile/GPU/other-browser claims.",
  },
  simulation: [],
  browser: [],
  assets: [],
};
for (const hybrid of [false, true]) {
  let count = 0,
    expeditions = 0;
  const start = performance.now();
  for (let seed = 1; seed <= 100; seed++) {
    const state = createAction(normalizeRules({ seed }), hybrid),
      pilot = actionPilot(hybrid);
    for (let i = 0; i < 12000 && state.status === "playing"; i++) {
      const input = pilot(state);
      if (input.build) actionCommand(state, "build");
      stepAction(state, 1 / 60, input);
      count++;
    }
    if (state.status === "won") expeditions++;
  }
  const ms = performance.now() - start;
  result.simulation.push({
    mode: hybrid ? "frontier" : "rift",
    seeds: 100,
    completed: expeditions,
    steps: count,
    totalMilliseconds: ms,
    microsecondsPerStep: (ms / count) * 1000,
  });
}
const browser = await chromium.launch(await launchOptions());
result.environment.browser = browser.version();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:5173");
for (const title of [
  "Rift Runner",
  "Bastion Protocol",
  "Signal Garden",
  "Frontier Zero",
]) {
  await page
    .getByRole("button", { name: `Explore ${title}`, exact: true })
    .click();
  await page.getByRole("button", { name: "Launch expedition" }).click();
  const measured = await page.evaluate(async () => {
    const { modes } = await import("/src/registry.js");
    const snapshot = window.__forge.snapshot(),
      mode = modes.find((m) => m.id === snapshot.mode),
      ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 1000;
    ctx.canvas.height = 620;
    const costs = [];
    for (let i = 0; i < 300; i++) {
      const before = performance.now();
      mode.draw(ctx, snapshot.state, {});
      costs.push(performance.now() - before);
    }
    costs.sort((a, b) => a - b);
    const times = [];
    await new Promise((resolve) => {
      let previous = 0;
      function tick(now) {
        if (previous) times.push(now - previous);
        previous = now;
        if (times.length < 180) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
    times.sort((a, b) => a - b);
    return {
      mode: mode.id,
      drawSamples: costs.length,
      drawMeanMs: costs.reduce((a, b) => a + b, 0) / costs.length,
      drawP95Ms: costs[Math.floor(costs.length * 0.95)],
      rafSamples: times.length,
      rafMedianMs: times[90],
      rafP95Ms: times[171],
      jsHeapUsedBytes: performance.memory?.usedJSHeapSize ?? null,
      note: "Draw timing measures Canvas command submission on detached 1000×620 canvas, not full GPU completion. RAF measured with the live mode running for 180 frames.",
    };
  });
  result.browser.push(measured);
  await page.getByRole("button", { name: "Save & leave" }).click();
}
await browser.close();
function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = dir + "/" + n;
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}
for (const file of files("dist")) {
  const content = readFileSync(file);
  result.assets.push({
    file,
    bytes: content.length,
    gzipBytes: gzipSync(content).length,
  });
}
result.totalBuildBytes = result.assets.reduce((n, f) => n + f.bytes, 0);
writeFileSync(
  "docs/research/performance.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
