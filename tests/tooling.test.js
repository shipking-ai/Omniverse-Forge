import { test } from "node:test";
import assert from "node:assert/strict";
import { launchOptions } from "../scripts/browser.js";

test("browser launch/report configuration never serializes the runner credential environment", async () => {
  const options = await launchOptions();
  const allowed = new Set([
    "PATH",
    "HOME",
    "FONTCONFIG_PATH",
    "LANG",
    "LD_LIBRARY_PATH",
  ]);
  for (const key of Object.keys(options.env || {})) {
    assert.ok(
      allowed.has(key),
      "Only explicitly approved non-secret environment keys may enter browser reports",
    );
  }
  for (const key of [
    "GITHUB_TOKEN",
    "GH_TOKEN",
    "AWS_SECRET_ACCESS_KEY",
    "ARENA_TOKEN",
  ]) {
    assert.equal(Object.hasOwn(options.env || {}, key), false);
  }
});
