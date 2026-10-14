import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { launchOptions } from "./browser.js";
const browser = await chromium.launch(await launchOptions());
const report = {
  measuredAt: new Date().toISOString(),
  browser: browser.version(),
  checks: [],
  errors: [],
  success: false,
};
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
page.on("pageerror", (error) => report.errors.push(error.message));
const requests = [];
page.on("request", (request) => requests.push(request.url()));
try {
  const response = await page.goto("http://127.0.0.1:4173");
  assert.equal(response.status(), 200);
  assert.equal(await page.locator(".world-card").count(), 4);
  report.checks.push(
    "Built static launcher returns HTTP 200 and displays four playable worlds",
  );
  assert.equal(await page.evaluate(() => typeof window.__forge), "undefined");
  report.checks.push("Development diagnostic API is absent from production");
  mkdirSync("docs/screenshots", { recursive: true });
  await page.screenshot({
    path: "docs/screenshots/overview.png",
    fullPage: true,
  });
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
    assert.ok(await page.locator("#game").isVisible());
    assert.equal(await page.locator(".hud-item").count(), 4);
    await page.keyboard.press("Escape");
    assert.ok(
      await page.getByRole("button", { name: "Resume expedition" }).isVisible(),
    );
    await page.getByRole("button", { name: "Resume expedition" }).click();
    await page.getByRole("button", { name: "Save & leave" }).click();
    report.checks.push(
      `${title} production start, HUD, pause, resume, save and return`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "docs/screenshots/mobile.png",
    fullPage: true,
  });
  report.checks.push(
    "390×844 mobile launcher has no horizontal overflow; actual screenshot captured",
  );
  assert.equal(
    requests.filter((url) => !url.startsWith("http://127.0.0.1:4173/")).length,
    0,
  );
  report.checks.push(
    "Production smoke makes only same-origin asset requests; no remote runtime services",
  );
  for (const path of ["LICENSE.txt", "NOTICE.txt", "VITE-LICENSE.txt"])
    assert.equal(
      (await page.request.get(`http://127.0.0.1:4173/${path}`)).status(),
      200,
    );
  report.checks.push(
    "Project license, distribution notice and Vite helper license are served",
  );
  assert.deepEqual(report.errors, []);
  report.checks.push("No browser page errors during production smoke");
  report.success = true;
} catch (error) {
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  await browser.close();
  writeFileSync(
    "docs/research/production-smoke.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
