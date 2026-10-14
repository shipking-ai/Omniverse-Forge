# Omniverse Forge

**One universe. Four playable worlds. An open foundation for more.**

Omniverse Forge is a real, local-first browser game platform—not an engine collection or a static concept page. Its first vertical slice includes three different simulation architectures and one integrated survival/construction hybrid, connected by a shared launcher, profile, settings, and saves.

## Play locally

Requires **Node.js 22.17+** (tested on 22.22.3) and npm.

```bash
npm ci --ignore-scripts
npm run dev
# Open the URL printed by Vite (port 5173).
```

The server binds to `0.0.0.0` and permits Arena's `*.e2b.app` preview hosts. No API keys, account, backend, remote fonts, or runtime CDN are required. The live preview in this workspace is already running.

```bash
npm run build       # static website in dist/
npm run preview     # serve the production build on port 4173
npm test            # deterministic gameplay, schema, registry, and save tests
npm run test:e2e     # real Chromium input, including full completion of all modes
npm run benchmark   # start npm run dev and build first; writes measured results
npm run inventory   # regenerate installed package inventory and notices
npm run check:secrets # guard against runner credentials entering deliverables
```

`dist/`, browser binaries, `node_modules/`, and test scratch files are intentionally not committed. Deploy **only `dist/`**, including its license/notice files. On non-Linux test hosts, install Playwright's Chromium (`npx playwright install chromium`) or set `CHROMIUM_EXECUTABLE_PATH`. The bundled fallback is for Linux only. See [test setup](docs/TEST_REPORT.md).

## The playable worlds

| World | Architecture | What you do |
|---|---|---|
| **Rift Runner** | Fixed-step real-time action | Explore a seeded sector, collect three shards, defeat every wave, return to the portal. |
| **Bastion Protocol** | Turn-based tactical grid | Spend action points on movement and ranged attacks; use cover and defeat four sentinels. |
| **Signal Garden** | Discrete graph puzzle | Rotate a procedurally generated network until every node is connected with no open ends. |
| **Frontier Zero** | Action + resources + construction + tower defense | Mine crystals, spend ore on autonomous turrets, fight waves, protect the reactor. |

**Action controls:** WASD / arrows to move, Space to auto-aim/fire, pointer to aim/fire, Shift to dash. Frontier: E to mine, B to build. Action keys are remappable; touch buttons are available. **Grid controls:** pointer, or arrows + Enter. All modes have instructions, objectives, victory/defeat, restart, and local save/resume. Esc pauses.

The **Forge lab** configures Frontier's seed, difficulty, wave count, and construction. It imports/exports bounded, data-only JSON rulesets and rejects incompatible clock combinations. It does **not** generate arbitrary new genre implementations.

## Current scope, honestly

- Four complete short expeditions; all can be completed through actual browser input.
- Cosmetic XP, levels, best scores, local active-session checkpoints.
- Original procedural SVG art, Canvas game graphics, and Web Audio effects.
- Audio, difficulty, reduced-motion, contrast, text-size, and input settings.
- **106 design-registry genre entries:** 8 with implemented mechanic subsets, 2 partial, 96 planned. These are not 106 playable game modes.
- **59 official repositories inspected**, with retained evidence and explicit review limits.
- **0 third-party runtime packages; 4 direct development/test dependencies.**

Not implemented: multiplayer, 3D, general-purpose ECS/editor, cloud accounts, arbitrary executable mods, local LLMs, full roguelite metaprogression, localization, gamepad support, or complete nonvisual gameplay accessibility. Browser testing is Chromium/Linux; Safari, Firefox, real mobile hardware and human audio evaluation remain unverified.

## Engineering evidence and handoff

| Deliverable | Document |
|---|---|
| Research findings, methodology, gaps | [Research report](docs/RESEARCH.md) |
| All candidates, licenses, choices | [Technology matrix](docs/TECHNOLOGY_MATRIX.md) · [Per-project ledger](docs/research/LEDGER.md) |
| Boundaries, state flow, mode/plugin contract | [Architecture](docs/ARCHITECTURE.md) |
| Genre coverage and compatibility roadmap | [Genre roadmap](docs/GENRES.md) · [Machine-readable registry](docs/genre-registry.json) |
| Executed tests, regressions, limitations | [Test report](docs/TEST_REPORT.md) |
| Measurements and performance caveats | [Performance report](docs/PERFORMANCE.md) |
| Software/asset terms and attribution | [License register](docs/LICENSE_REGISTER.md) · [Third-party notices](docs/THIRD_PARTY_NOTICES.txt) |
| Dependency manifests | [CycloneDX SBOM](docs/dependencies.cdx.json) · [Installed inventory](docs/dependency-inventory.json) |
| Security boundaries and hardening | [Security](docs/SECURITY.md) |
| Ranked extension plan | [Next steps](docs/NEXT_STEPS.md) |

## Project layout

```text
src/main.js          Application lifecycle, menus, input, persistence integration
src/registry.js      Four trusted mode plugins + compatibility checks
src/genres.js        Genre design registry, requirements and conflict policies
src/modes/           Pure action, tactics, and graph-puzzle simulation
src/render.js        Original Canvas 2D renderers and camera transforms
src/core.js          Seeded random, collision, bounded navigation, rule validation
src/storage.js       Versioned, validated local save/profile/settings schema
src/audio.js         Original procedural audio; silent fallback
public/art/          Original generated SVG illustrations
scripts/             Research, art, notices, test browser, QA pilots, benchmarks
tests/              Node tests and Playwright browser tests
docs/               Design, evidence, license and verification records
```

## License

Original source, art, icons and sound-generation code: **MIT**, [LICENSE](LICENSE). Research excerpts and development dependencies retain their own terms. No researched engine code or game assets were copied into the runtime.

This is an independent project, not affiliated with NVIDIA Omniverse or any researched engine. Trademark/name clearance is outstanding before commercial release.
