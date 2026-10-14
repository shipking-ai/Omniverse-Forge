# Architecture and extension contract

## Principle

The platform shares **lifecycle, input routing, accessibility preferences, rulesets, persistence and cosmetic progression**, not one universal gameplay loop. Modes own their simulation state and rules. This is a small trusted-plugin architecture in one browser process, not a general game engine, microservice collection, or arbitrary module marketplace.

```text
Browser DOM shell (main.js)
 ├─ launcher / mode onboarding / field guide / profile
 ├─ settings and remappable input → semantic commands
 ├─ Forge lab → validated JSON rules → compatibility check
 ├─ one requestAnimationFrame loop
 │   ├─ bounded fixed timestep (60 Hz, ≤6 steps/frame)
 │   ├─ active mode.step(state, dt, input)
 │   ├─ active mode.draw(context, state, settings)
 │   └─ HUD / result → XP exactly once per active lifecycle
 ├─ storage.js → versioned localStorage snapshot
 └─ audio.js → one lazily activated Web Audio context

registry.js / genres.js
 ├─ Rift: action.js (movement, combat, collision, shards, extraction)
 ├─ Bastion: tactics.js (AP, grid reachability, cover, enemy turns)
 ├─ Signal: puzzle.js (bitmask conduits, graph connectivity, rotations/undo)
 └─ Frontier: action.js + resources + construction + turret AI + reactor waves

core.js: seeded RNG, normalization, collision, bounded navigation
render.js: pure Canvas draw functions, camera and pointer-coordinate transforms
```

## Why these architectures

- **Action** proves real-time input, fixed-step simulation, broadphase-bounded collision, world camera and AI.
- **Tactics** proves command-driven, turn-based authority; no realtime updates are required for combat.
- **Logic puzzle** proves deterministic graph generation, discrete state transitions, undo and a different failure condition.
- **Hybrid** reuses action movement/combat while adding an actual resource economy and construction. Mining and kills yield ore; ore creates turrets; turrets fire the same projectiles and protect the same reactor. It is not a link to another demo.

## Trusted mode interface

Mode definitions in `src/registry.js` have:

```js
{
  id: 'unique-stable-id',
  title: 'Human-readable title',
  genres: ['registry-genre-id'],
  capabilities: ['implemented-capability'],
  create(rules) { return serializableInitialState; },
  step(state, dtSeconds, semanticInput) { /* bounded realtime update */ },
  command(state, action, payload) { /* one discrete validated action */ },
  draw(context2D, state, accessibilitySettings) { /* no state mutation */ },
  hud(state) { return [{label: 'OBJECTIVE', value: '...'}]; },
  validate(untrustedSavedState) { return boolean; }
  // onboarding, art, tags, objective, hints and duration are presentation metadata
}
```

**State** must be JSON-serializable and contain `version`, `type`, normalized `rules`, `status` (`playing`, `won`, `lost`), `time` and a bounded `message`. No DOM/audio/renderer handles enter saves. Validators must bound arrays, validate nested numbers, and reject malformed structures. Renderers must treat settings as preferences, not authoritative game rules.

**Semantic input** for real-time modes is `{up,down,left,right,fire,aim}`. Keyboard/pointer/touch map to it in the shell. Discrete actions include `dash`, `interact`, `build`, `select`, `cursor`, `end-turn`, `undo`. The UI only exposes actions the selected mode supports. Arrows and Esc remain reserved accessibility/navigation defaults.

**Timing:** a single animation loop accumulates up to 0.1 seconds/frame and runs at most six 1/60-second simulation steps. Individual action updates clamp dt to 0.05 seconds. Visibility loss and window blur pause. A resumed tab does not receive minutes of catch-up damage. Puzzle/tactics commands do not depend on render framerate; their displayed elapsed time is observational only.

**World/camera:** action worlds are 1800×1200; logical render space is 1000×620, scaled responsively with pointer coordinates mapped back. Camera follows the player and clamps to world bounds. Grid modes use fixed layouts and selection cursors. No free-look or 3D camera is claimed.

**Physics/navigation:** circles slide against axis-aligned rectangles and world edges. A shared line-clearance check and bounded four-neighbor BFS guide enemies around cover, recomputed at limited intervals. Spawn clearance prevents agents starting inside rocks. This is not continuous rigid-body physics, CCD, fluid or ragdoll simulation.

**Procedural content:** integer seeded RNG; action obstacle dimensions/wave spawns; puzzle generation builds a connected spanning tree then scrambles orientations. An original solution is kept for deterministic QA, not exposed as a player hint. Tactics currently has one reusable cover map and limited seeded enemy placement, not a broad tactical map generator.

## Lifecycle, ownership and cleanup

`start()` creates or validates/resumes one state, assigns one Canvas context, attaches handlers to that canvas and resets input. `Save & leave` writes a checkpoint then releases the active reference; detached canvas handlers are garbage-collectable. No per-mode timers or independent render loops survive navigation. Web Audio has a single context and disconnects finished oscillator nodes.

`checkResult()` is guarded per active lifecycle. A win yields 120 XP (180 for Frontier); no second award is issued by later frames. Loss yields no XP. Level `1 + floor(xp/360)` is cosmetic and all modes are available immediately. Save manipulation is possible and acceptable for this untrusted local-only profile; it cannot be an online leaderboard authority.

There is no dynamic import of user-selected URLs, no `eval`, no arbitrary script loader. If new resource-heavy plugins are introduced, extend the contract with `mount()/dispose()` and enforce cleanup tests before allowing them in the registry. The current canvas modules need neither.

## Save system

Key: `omniverse-forge:v1`.

```json
{
  "version": 1,
  "xp": 120,
  "completed": {"signal": 1},
  "best": {"signal": 34},
  "settings": {"volume": 0.35, "difficulty": "standard", "keys": {}},
  "session": {"mode": "rift", "state": {"type": "action"}}
}
```

The example is abbreviated; an actual session must pass its plugin validator. Maximum raw save size: 500 KB. Only known completion/best keys are restored. Invalid sessions are dropped while recoverable profile/settings fields are preserved. Invalid JSON/version starts a fresh profile with a warning. Storage getter/access/quota failures do not stop play. Snapshot saves occur every five seconds, on pause/leave and pagehide. A crashed/terminated browser may lose up to five seconds; persistence is per origin/browser, not cloud synchronization or guaranteed durable storage.

Schema changes need a migration or a version bump. The save includes puzzle undo/solution and AI navigation data; neither is trusted competitive information.

## Rulesets and compatibility

`normalizeRules()` whitelists seed 1–999999, difficulty explorer/standard/veteran, waves 2–5, and a construction boolean. The lab imports at most 8 KB and requires `{format:'omniverse-rules',version:1,mode:'frontier',rules:{...}}`. Unknown fields are ignored, not executed. Export writes exactly that data schema.

`genres.js` records 106 design entries, requirements, status and candidate clock family. `capabilityGaps()` detects unmet requirements. `validateCombination()` rejects unknown genres, incompatible real-time/turn-based clock requests without an explicit policy, and tower defense without construction. The current UI **rejects** the mixed-clock case: it does not implement the theoretical arbitration choices. Other listed policies are architecture guidance, not a generic executable genre compiler.

## Add a mode without rewriting the game

1. Create `src/modes/my-mode.js`: pure create/step/command/HUD/validation functions.
2. Add its renderer (or a carefully scoped new render module) and original/licensed artwork.
3. Register a stable mode ID, capability set, genres, controls, objectives, and result conditions.
4. Extend shell input/action presentation if the new mode needs a new semantic command. Do not make shell input contain its game rules.
5. Register save/profile IDs in `storage.js` (the profile currently intentionally whitelists the four shipping IDs). Introduce migrations as needed.
6. Implement terminal-state and bounded-save tests, deterministic seeds, restart, legal-input completion and browser UI tests.
7. Regenerate source inventory, notices, SBOM and genre export. Run the documented build/test/performance gates.

The contract is extensible, but the four-mode profile whitelist and shell command widgets still require small explicit registrations. This is not a zero-code/no-touch plugin installer.

## Future adapter boundaries (not implemented)

| Boundary | Interchange | Trade-off / admission gate |
|---|---|---|
| Three/Babylon renderer | Mode-owned scene adapter; transforms and glTF | Separate renderer disposal, context-loss recovery and GPU measurements |
| Rapier/Matter physics | Fixed-step body commands and immutable transform snapshots | One authority, deterministic tests; avoid coupling renderer objects to bodies |
| Tiled/LDtk | Validated JSON content → internal scene schema | Asset paths, object counts and tile dimensions must be bounded |
| Ink/Yarn | Compiled dialogue data + variable/event interface | Verify runtime/compiler/license versions separately |
| Colyseus/Nakama | Typed commands/snapshots over server transport | Implement server authority/authentication, rate limiting, reconciliation and integration tests first |
| Godot/Bevy native modes | Separate application/export; content/profile transfer or explicit IPC | Port rules intentionally; no nested engine, no assumed raw-state compatibility |
| Local inference | Worker or separate process with bounded request/response schema | Optional install, resource/time limits, model provenance and privacy review |
| Executable community mods | Future isolated Worker/WASM realm plus quotas | JSON rules today; do not equate `postMessage` or WASM alone with a secure sandbox |

No engine, multiplayer adapter, local model, or external content tool in this table is currently integrated.
