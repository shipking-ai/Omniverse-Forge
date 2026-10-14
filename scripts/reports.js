import { readFileSync, writeFileSync } from "node:fs";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const unit = readFileSync("docs/research/unit-results.txt", "utf8");
const number = (label) =>
  Number(unit.match(new RegExp(`^# ${label} (\\d+)$`, "m"))?.[1] ?? 0);
const browser = read("docs/research/browser-results.json");
const production = read("docs/research/production-smoke.json");
const perf = read("docs/research/performance.json");
const inventory = read("docs/dependency-inventory.json");
const evidence = read("docs/research/evidence.json");
const audit = read("docs/research/npm-audit.json");
const testReport = `# Executed test report

Final report generated ${new Date().toISOString()}. See the timestamped raw files below; no pending or interrupted run is counted as a pass.

## Results

| Executed verification | Result | Evidence |
|---|---|---|
| Clean locked installation: \`npm ci --ignore-scripts\` | Completed successfully on Node 22.22.3 / Linux x64 | Actual command executed in workspace; 39 packages installed |
| Source formatting: \`npm run format:check\` | Passed | Prettier 3.9.10; final check executed |
| Node gameplay/integration tests | **${number("pass")} / ${number("tests")} passed**, ${number("fail")} failures | [unit-results.txt](research/unit-results.txt) |
| Playwright browser tests | **${browser.stats.expected} passed**, ${browser.stats.unexpected} failed, ${browser.stats.skipped} skipped, ${browser.stats.flaky} flaky | [browser-results.json](research/browser-results.json) |
| Production build: \`npm run build\` | Completed successfully | Vite 8.3.4; actual \`dist/\` served and tested |
| Production smoke | **${production.success ? "Passed" : "FAILED"}**, ${production.checks.length} completed checks; ${production.errors.length} page errors | [production-smoke.json](research/production-smoke.json) |
| Dependency advisories: \`npm audit --json\` | **${audit.metadata.vulnerabilities.total} known vulnerabilities reported** | [npm-audit.json](research/npm-audit.json); not a full security proof |
| Performance and seeded scenario run | Measured, not estimated | [Performance report](PERFORMANCE.md), [performance.json](research/performance.json) |

**Test count:** ${number("tests") + browser.stats.expected + browser.stats.unexpected} tests in the Node/Playwright suites, ${number("pass") + browser.stats.expected} passed. The ${production.checks.length} production smoke checks, seed loops, assertions, and benchmark iterations are reported separately—not used to inflate the suite test count.

The browser suite's final recorded run started **${browser.stats.startTime}** and took **${(browser.stats.duration / 1000).toFixed(1)} seconds**. The Linux browser was Chromium **${production.browser}**, delivered by the pinned registry package because browser CDNs and the system package mirror were unavailable. This is a custom Playwright executable, not a claim that Playwright's stock Chromium/Firefox/WebKit builds were all tested.

## Coverage actually executed

### Pure logic / integration (${number("tests")} Node tests)

- Seed reproducibility, random bounds, rule normalization and unsupported inputs.
- Circle/rectangle collision, edge bounds, sliding, normalized diagonal movement, capped delta and dash cooldown.
- Four mode contract checks, serializable initial state, mode-specific save validation.
- Full save round trips for every mode, invalid JSON/version/oversize/session recovery, denied/quota storage.
- Key allowlisting, duplicate remap rejection and XP/best-score rules.
- Combat hits, projectiles blocked by cover, mining proximity, finite deposits, ore costs, construction spacing and autonomous turret fire.
- Player/reactor defeat, multi-objective extraction and terminal-state behavior.
- Tactical path range, blocked shots, AP accounting, enemy turns, legal full victory and defeat.
- Puzzle four-rotation identity, 100 generated connected solutions/scrambled starts, 50 legal-rotation solutions, undo, reverse, bounds and budget defeat.
- Collision-clear navigation around cover; 20 seeded action and 20 seeded hybrid expeditions completed using ordinary commands/inputs.
- All 106 genre IDs are unique; required families covered; implemented capabilities align with mode declarations; unknown genres and incompatible combinations rejected.

### Actual browser input (${browser.stats.expected} Playwright tests)

1. Main menu, search, filters, onboarding and launching.
2. Real action movement, shooting, dash, pause and resume.
3. Save/leave/reload/resume preserves mode, seed, position and collection progress.
4. Settings persist; duplicate keys rejected; remapped movement works.
5. Hybrid lab rejects conflicting clocks, rejects invalid imports, applies seed/waves and builds a turret for ore.
6. Signal completed by actual tile clicks; XP awarded; restart resets the run.
7. Tactical clicks, keyboard grid selection, enemy turns and loss/recovery.
8. Restart cancel/confirm preserves or resets the correct state.
9. Corrupt save and throwing localStorage getter recover without page errors.
10. 390×844 viewport: no horizontal overflow; on-screen movement input works.
11. Rules export triggers a real download; validated import updates controls.
12. Entire tactical expedition won through legal grid clicks/end-turn buttons.
13. Entire Rift expedition won through real movement/fire keyboard input, all 15 sentinels defeated and 3 shards collected before extraction.
14. Entire Frontier expedition won through real movement/fire/build keyboard input, 24 sentinels defeated and the reactor kept alive.

QA controllers read **read-only development snapshots** to choose their next legal input. They do not teleport the player, edit HP, remove enemies or force a win. Puzzle automation uses the deterministic generated solution as its test oracle; this tests execution/win flow, not a human's puzzle-solving experience. The development diagnostics do not exist in the production bundle.

### Production smoke

${production.checks.map((check) => "- " + check).join("\n")}

Actual production screenshots: [desktop](screenshots/overview.png), [mobile](screenshots/mobile.png). They document the executed app, not replace it. Desktop and mobile images were visually inspected; full-page screenshots capture the fixed bottom navigation at its viewport position. Real hardware/manual human playtesting and audio listening were not performed.

## Defects encountered and fixed

- **Initial build:** an unnecessary empty data-URL CSS import was interpreted as a file by PostCSS. Removed it; repeated builds pass.
- **Browser launch:** missing NSS/NSPR system libraries. Used the pinned Chromium package's bundled Linux libraries; kept all binaries out of the game artifact.
- **Browser process shutdown:** the package's single-process argument set produced slow/hanging shutdown in this host. Reduced to necessary container launch flags; subsequent suites close normally without disabling web security.
- **Hybrid final-wave blocker:** a sentinel could spawn inside an obstacle or remain stuck at cover. Added spawn clearance and bounded pathfinding; unit regression coverage plus 100-seed benchmark completions for each action mode now pass.
- **Storage denial:** accessing localStorage as a default argument could throw before error handling. Moved access inside the guarded block; browser regression test passes.
- **Grid focus:** command buttons could retain focus and swallow follow-up keyboard selection. Return focus to the playfield for continuing commands; keyboard browser test passes.
- **Mobile navigation labels:** hidden visual labels left icon-only controls without useful names. Explicit accessible button names added.
- **Formatting:** one initial formatter pass needed a second pass on the browser test file; final check is clean.

- **Test-report environment leakage:** a launch configuration spread the runner environment into the JSON report. Removed the environment dump, replaced it with an explicit non-secret allowlist, added a regression test and checked deliverable files for current credential values. No commit or push occurred.

One final verification rerun was interrupted before completion; it was not treated as passing. The later background rerun completed all ${browser.stats.expected} browser tests successfully and is the report retained above.

## Outstanding / unverified

- Firefox, Safari/WebKit, Windows/macOS execution, actual mobile devices, gamepad and assistive hardware.
- Human usability, sound quality/mixing and complete screen-reader gameplay accessibility. Canvas aria labels do not make spatial real-time play nonvisually accessible.
- Long-session memory soak, device thermal throttling and large-world/GPU performance.
- Exhaustive balancing across all custom seeds, 2–5 waves and three difficulties. Tested seeded controller completions are standard/default wave settings, not a guarantee for every ruleset/player.
- Storage durability after OS/browser eviction; origin-to-origin migration and cloud saves.
- Arbitrary plugins, external assets, multiplayer, LLMs and native engine adapters: absent, so no tests are claimed for them.
- The GitHub Actions workflow is authored but **not executed remotely in this session**. No CI success, commit, push, or PR is claimed.

## Reproduce

\`npm ci --ignore-scripts && npm run format:check && npm test && npm run build && npm run test:e2e\`.

The browser runner starts Vite when needed; the full suite takes roughly a minute because two expeditions use actual wall-clock gameplay. Linux uses \`scripts/browser.js\`. Other systems need \`npx playwright install chromium\` or \`CHROMIUM_EXECUTABLE_PATH\`; that path is untested here.

For production: start \`npm run preview\`, then \`node scripts/production-smoke.js\`. For performance: run the dev server and build, then \`npm run benchmark\`. Reports and raw evidence are retained in \`docs/research/\`.
`;
writeFileSync("docs/TEST_REPORT.md", testReport);
const js = perf.assets
  .filter((a) => a.file.endsWith(".js"))
  .reduce((n, a) => n + a.gzipBytes, 0);
const css = perf.assets
  .filter((a) => a.file.endsWith(".css"))
  .reduce((n, a) => n + a.gzipBytes, 0);
const performanceReport = `# Measured performance report

Measured **${perf.measuredAt}** with the actual implementation. Raw data and artifact byte counts: [performance.json](research/performance.json). Reproduce with \`npm run build\`, a running \`npm run dev\`, and \`npm run benchmark\`.

## Environment and methodology

- Node ${perf.environment.node}; ${perf.environment.platform}/${perf.environment.arch}.
- CPU reported by host: ${perf.environment.cpu}; ${perf.environment.logicalCPUs} logical CPUs; approximately ${(perf.environment.hostMemoryBytes / 1024 ** 3).toFixed(2)} GiB host memory. Shared-sandbox allocations/load are not guaranteed.
- Chromium ${perf.environment.browser}, headless Linux, 1440×1000 viewport; logical Canvas 1000×620.
- Each action simulation: 100 standard-difficulty seeds, normal movement/combat/construction controllers, fixed 1/60-second simulation steps. No rendering during the Node benchmark.
- Each renderer: 300 synchronous Canvas command-submission samples on a detached canvas, then 180 live requestAnimationFrame intervals. These are not GPU-completion, input-to-photon or perceptual smoothness measurements.
- Browser heap values are exposed by a coarse/bucketed browser API; they are **not** a trustworthy precise memory measurement. No memory-leak/soak claim is made.

## Simulation results

| Mode | Completed seeded expeditions | Simulated steps | Wall-clock time | Mean per-step time |
|---|---:|---:|---:|---:|
${perf.simulation.map((s) => `| ${s.mode} | ${s.completed} / ${s.seeds} | ${s.steps.toLocaleString("en-US")} | ${s.totalMilliseconds.toFixed(1)} ms | ${s.microsecondsPerStep.toFixed(2)} µs |`).join("\n")}

These ${perf.simulation.reduce((n, s) => n + s.seeds, 0)} scenario runs are additional benchmark evidence, not ${perf.simulation.reduce((n, s) => n + s.seeds, 0)} separately declared test cases. Controller knowledge makes them skilled/repeatable play, not representative human completion times.

## Rendering and live frame pacing

| Mode | Mean Canvas submission | p95 submission | Median live frame interval | p95 live frame interval |
|---|---:|---:|---:|---:|
${perf.browser.map((b) => `| ${b.mode} | ${b.drawMeanMs.toFixed(2)} ms | ${b.drawP95Ms.toFixed(2)} ms | ${b.rafMedianMs.toFixed(2)} ms | ${b.rafP95Ms.toFixed(2)} ms |`).join("\n")}

A roughly 16.7 ms median interval is consistent with a 60 Hz animation callback on this host; it is **not** a guaranteed 60 FPS on user hardware. Means can exceed p95 submission costs because a small tail of expensive samples dominates the average. JIT, queue flushing and scheduling are possible causes, not profiled conclusions. The detached-canvas loop is a microbenchmark, not a maximum-load gameplay benchmark. No unsupported GPU fidelity/scalability conclusions are drawn.

## Artifact size

- Complete uncompressed \`dist/\`: **${perf.totalBuildBytes.toLocaleString("en-US")} bytes** (${(perf.totalBuildBytes / 1024).toFixed(1)} KiB), including original illustrations and license notices.
- JavaScript gzip: **${js.toLocaleString("en-US")} bytes** (${(js / 1024).toFixed(1)} KiB).
- CSS gzip: **${css.toLocaleString("en-US")} bytes** (${(css / 1024).toFixed(1)} KiB).
- Gzip was measured with Node zlib. Actual transfer size depends on hosting compression, caching and headers. Not all art must load at first paint; cards use lazy image loading.
- No third-party game-runtime package, remote font, audio file, model weight or native SDK download. Vite's generated module-preload helper remains in the compiled bundle with its MIT notice preserved.
- ${Object.keys(inventory.directDevelopment).length} direct build/test/format packages; ${inventory.installedPackageCount} installed package entries including transitives on this host. These are **not** part of the runtime download.

## Current bounds and trade-offs

Fixed world size (1800×1200), four cover rectangles, a 5×5 puzzle, a 9×7 tactical grid, 2–5 configurable waves, at most eight turrets, projectile lifetimes and finite entity arrays keep work bounded. Navigation uses a 30×20 grid and recalculates on a timer. The architecture intentionally has no unbounded chunk streaming, global ECS scans across a universe, or arbitrary untrusted scripts.

The full artifact is small and the measured default workloads are inexpensive. Still unmeasured: large maps, many agents, long-session heap growth, real mobile thermals, screen-reader interaction, network latency, shader/GPU workloads, 3D and native engines. The ${evidence.projects.length} researched repositories were not benchmarked merely because their metadata was inspected.
`;
writeFileSync("docs/PERFORMANCE.md", performanceReport);
console.log(
  `Wrote test report (${number("pass")} Node + ${browser.stats.expected} browser passes) and measured performance report.`,
);
