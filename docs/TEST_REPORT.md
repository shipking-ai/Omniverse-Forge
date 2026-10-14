# Executed test report

Final report generated 2026-10-14T15:02:32.569Z. See the timestamped raw files below; no pending or interrupted run is counted as a pass.

## Results

| Executed verification | Result | Evidence |
|---|---|---|
| Clean locked installation: `npm ci --ignore-scripts` | Completed successfully on Node 22.22.3 / Linux x64 | Actual command executed in workspace; 39 packages installed |
| Source formatting: `npm run format:check` | Passed | Prettier 3.9.10; final check executed |
| Node gameplay/integration tests | **57 / 57 passed**, 0 failures | [unit-results.txt](research/unit-results.txt) |
| Playwright browser tests | **14 passed**, 0 failed, 0 skipped, 0 flaky | [browser-results.json](research/browser-results.json) |
| Production build: `npm run build` | Completed successfully | Vite 8.3.4; actual `dist/` served and tested |
| Production smoke | **Passed**, 10 completed checks; 0 page errors | [production-smoke.json](research/production-smoke.json) |
| Dependency advisories: `npm audit --json` | **0 known vulnerabilities reported** | [npm-audit.json](research/npm-audit.json); not a full security proof |
| Performance and seeded scenario run | Measured, not estimated | [Performance report](PERFORMANCE.md), [performance.json](research/performance.json) |

**Test count:** 71 tests in the Node/Playwright suites, 71 passed. The 10 production smoke checks, seed loops, assertions, and benchmark iterations are reported separately—not used to inflate the suite test count.

The browser suite's final recorded run started **2026-10-14T15:01:13.373Z** and took **79.0 seconds**. The Linux browser was Chromium **153.0.8010.0**, delivered by the pinned registry package because browser CDNs and the system package mirror were unavailable. This is a custom Playwright executable, not a claim that Playwright's stock Chromium/Firefox/WebKit builds were all tested.

## Coverage actually executed

### Pure logic / integration (57 Node tests)

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

### Actual browser input (14 Playwright tests)

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

- Built static launcher returns HTTP 200 and displays four playable worlds
- Development diagnostic API is absent from production
- Rift Runner production start, HUD, pause, resume, save and return
- Bastion Protocol production start, HUD, pause, resume, save and return
- Signal Garden production start, HUD, pause, resume, save and return
- Frontier Zero production start, HUD, pause, resume, save and return
- 390×844 mobile launcher has no horizontal overflow; actual screenshot captured
- Production smoke makes only same-origin asset requests; no remote runtime services
- Project license, distribution notice and Vite helper license are served
- No browser page errors during production smoke

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

One final verification rerun was interrupted before completion; it was not treated as passing. The later background rerun completed all 14 browser tests successfully and is the report retained above.

## Outstanding / unverified

- Firefox, Safari/WebKit, Windows/macOS execution, actual mobile devices, gamepad and assistive hardware.
- Human usability, sound quality/mixing and complete screen-reader gameplay accessibility. Canvas aria labels do not make spatial real-time play nonvisually accessible.
- Long-session memory soak, device thermal throttling and large-world/GPU performance.
- Exhaustive balancing across all custom seeds, 2–5 waves and three difficulties. Tested seeded controller completions are standard/default wave settings, not a guarantee for every ruleset/player.
- Storage durability after OS/browser eviction; origin-to-origin migration and cloud saves.
- Arbitrary plugins, external assets, multiplayer, LLMs and native engine adapters: absent, so no tests are claimed for them.
- The GitHub Actions workflow is authored but **not executed remotely in this session**. No CI success, commit, push, or PR is claimed.

## Reproduce

`npm ci --ignore-scripts && npm run format:check && npm test && npm run build && npm run test:e2e`.

The browser runner starts Vite when needed; the full suite takes roughly a minute because two expeditions use actual wall-clock gameplay. Linux uses `scripts/browser.js`. Other systems need `npx playwright install chromium` or `CHROMIUM_EXECUTABLE_PATH`; that path is untested here.

For production: start `npm run preview`, then `node scripts/production-smoke.js`. For performance: run the dev server and build, then `npm run benchmark`. Reports and raw evidence are retained in `docs/research/`.
