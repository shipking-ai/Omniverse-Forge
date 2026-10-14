# Research report

## Scope and method

Research and implementation were performed on **2026-10-14** in the supplied repository. The initial checkout contained only a README. Node 22.22.3, npm 10.9.8, Python 3.11.2, git and authenticated GitHub CLI were available. There was no native game SDK or system Chromium installation.

Outbound access is restricted to GitHub/codeload/API and npm/Python registries. **GitLab, Codeberg, general official websites, academic indexes, browser CDN downloads, and package mirrors were not accessible research channels in this environment.** Official GitHub mirrors and repository-contained documentation were the practical primary sources. No exhaustive-world claim is made.

1. Start with the requested engine list, add complementary specialists across physics, AI, networking, asset production, audio, localization, scripting, development and online services.
2. Fetch repository metadata, README, detected license file, and latest GitHub release through read-only `gh api` calls. Retain source URLs, file hashes, timestamps, content excerpts and endpoint errors in [evidence.json](research/evidence.json).
3. Sample three open issue/PR entries for each of six shortlisted engine/tool repositories. This is a maintenance/limitation signal, **not** a comprehensive issue or security audit.
4. Follow nonstandard license paths for Bevy, Cocos2d-x, NvCloth, Aseprite and Luanti. Keep [supplemental source evidence](research/supplemental-licenses.json).
5. Verify current direct package versions, licenses and Node constraints with npm registry queries; pin the selected versions in the lockfile. Inspect the browser package's scripts before installation. Install with lifecycle scripts disabled.
6. Evaluate actual deployment constraints, then choose the smallest foundation that supports three independent simulation architectures. Build before expanding the report indefinitely.
7. Investigate additional references when concrete questions arise: Chromium delivery under restricted networking, and existing survival/automation/transport/space hybrids.
8. Record dispositions, estimates and unknowns in the [matrix](TECHNOLOGY_MATRIX.md) and [per-project ledger](research/LEDGER.md); never count a proposed adapter as integrated.

**Count:** 59 unique repositories have successful metadata inspections plus README/license/release queries. Some license/release endpoints returned errors; these were not treated as absent licensing or abandoned maintenance. The collector queried 53 initial candidates and later added six useful references/tooling candidates. Early incorrect repository paths were corrected and are not counted. This is a repository-level survey, not 59 built, audited or integrated projects.

The complete reproducible collection procedure is `scripts/research.py`, `scripts/supplement-research.py`, and `scripts/research-report.py`. README/license excerpts in the main evidence are capped at 16,000 characters each. The ledger explicitly preserves unknown hardware requirements, transitive dependencies and untested platform support.

## Main discoveries and decisions

### 1. Choose a platform boundary, not an engine pile

[Godot](https://github.com/godotengine/godot), [Bevy](https://github.com/bevyengine/bevy), [O3DE](https://github.com/o3de/o3de), [Defold](https://github.com/defold/defold), [GDevelop](https://github.com/4ian/GDevelop), [SDL](https://github.com/libsdl-org/SDL), [raylib](https://github.com/raysan5/raylib), [MonoGame](https://github.com/MonoGame/MonoGame), [libGDX](https://github.com/libgdx/libgdx), and [Cocos2d-x](https://github.com/cocos2d/cocos2d-x) address overlapping application/runtime ownership. Their language toolchains, content systems, renderer lifecycles and input loops are not interchangeable plugins.

For this browser-only 2D slice, native toolchain complexity would reduce the amount of tested gameplay delivered. Godot remains a credible **separate native application target**, sharing versioned content/profile schemas where feasible. It is not embedded inside this browser runtime. A future native mode must choose an explicit export/IPC boundary and cannot assume raw scene or physics state portability.

### 2. Browser engine alternatives are strong—but not mandatory

| Foundation | Strength for this project | Current cost/limitation | Decision |
|---|---|---|---|
| [Babylon.js](https://github.com/BabylonJS/Babylon.js) | Integrated web 3D rendering/scene infrastructure | Unnecessary 3D/GPU systems for a 2D grid/action slice | Future 3D adapter candidate |
| [Three.js](https://github.com/mrdoob/three.js) | Flexible web rendering, scene/asset ecosystem | Not a gameplay framework; requires separate input/physics/rules | Preferred first 3D renderer experiment, not integrated |
| [PlayCanvas engine](https://github.com/playcanvas/engine) | Web-oriented 3D engine | Open engine is distinct from hosted editor/service terms | Alternate future adapter |
| [Phaser](https://github.com/phaserjs/phaser) | Browser 2D scenes, input, assets and rendering | Overlaps the small fixed-step and grid kernels; migration needs a measurable benefit | Strong alternative, deferred rather than rejected on quality |
| [PixiJS](https://github.com/pixijs/pixijs) | GPU 2D display/rendering | Does not supply tactical or puzzle rules; no measured need to replace Canvas | Renderer replacement if profiling requires it |
| Canvas 2D + Web Audio | Already present in the deployment target; zero runtime packages | No 3D/editor/large ECS; manually implemented bounded collision and pathfinding | **Current foundation** |

This is a deliberate scope selection, not a claim that Canvas beats these engines on fidelity or scalability. [Vite](https://github.com/vitejs/vite) is build/development infrastructure only; [Playwright](https://github.com/microsoft/playwright) and [Sparticuz Chromium](https://github.com/Sparticuz/chromium) are test infrastructure only.

### 3. Existing integrations teach useful boundaries

[React Three Fiber](https://github.com/pmndrs/react-three-fiber) is an existing integration of React scene ownership and Three rendering—not justification for adding React to an otherwise framework-free game. [Colyseus](https://github.com/colyseus/colyseus) supplies room/server patterns rather than client-side “multiplayer” decorations. [Nakama](https://github.com/heroiclabs/nakama) supplies backend concerns but requires real deployment, persistence and authority decisions. These were investigated rather than reimplemented as fake multiplayer controls.

[Rapier](https://github.com/dimforge/rapier), [Matter.js](https://github.com/liabru/matter-js), [Jolt](https://github.com/jrouwe/JoltPhysics) and [PhysX](https://github.com/NVIDIA-Omniverse/PhysX) are alternatives for a **single authoritative physics domain**. Running two collision solvers against the same entities is not interoperability. Circle/rectangle collision plus bounded grid navigation are adequate for this slice. [Recast](https://github.com/recastnavigation/recastnavigation) is a later navmesh pipeline candidate; it would be wasteful for four axis-aligned obstacles.

### 4. Open repositories do not imply unrestricted open-source distribution

The source files resolve details that badges alone miss:

- **Bevy:** [README licensing](https://github.com/bevyengine/bevy#license) and [MIT file](https://github.com/bevyengine/bevy/blob/main/LICENSE-MIT) establish MIT/Apache dual licensing, despite GitHub returning a single dominant license. Example assets can have other terms.
- **O3DE:** [license overview](https://github.com/o3de/o3de/blob/development/LICENSE.txt) permits Apache/MIT selection while separately identifying third-party and Qt obligations. No imported O3DE components here.
- **Defold:** [custom license](https://github.com/defold/defold/blob/dev/LICENSE.txt), section 4(a), restricts commercialization as a game-engine product. Do not relabel it as standard Apache merely because the text resembles Apache. Commercial game production and engine redistribution are different questions.
- **Aseprite:** [EULA](https://github.com/aseprite/aseprite/blob/main/EULA.txt) restricts redistribution and source use. It is **source available**, not an unrestricted open-source asset-editor dependency. Not used.
- **NvCloth:** [actual license](https://github.com/NVIDIAGameWorks/NvCloth/blob/master/NvCloth/license.txt) is NVIDIA Source Code License (1-Way Commercial), not automatically the license of PhysX. OSI status and legal fit were not established; not used.
- **Sentry server:** [license](https://github.com/getsentry/sentry/blob/master/LICENSE.md) is FSL with future Apache conversion. Current server code is not ordinary Apache-licensed software. Client SDK terms are a separate question.
- **Luanti:** [README](https://github.com/luanti-org/luanti), [code license](https://github.com/luanti-org/luanti/blob/master/COPYING.LESSER), and [asset register](https://github.com/luanti-org/luanti/blob/master/LICENSE.txt) distinguish LGPL engine code from several CC/Apache media terms.
- **Tiled:** [license overview](https://github.com/mapeditor/tiled/blob/master/COPYING) distinguishes GPL editor/plugins and BSD libraries/tools. An original exported map is not automatically GPL because the editor is.

Source links should be interpreted with the retained snapshot and source SHA, since upstream branches can change. This is engineering due diligence, not legal advice.

### 5. Successful hybrid games combine meaningful systems

Useful source-backed precedents, studied as references without copying their code or assets:

- [Cataclysm: Dark Days Ahead](https://github.com/CleverRaven/Cataclysm-DDA): its README describes turn-based survival in a persistent procedural world with vehicles and scavenging. The source/content license includes CC-BY-SA and component exceptions; not conventional MIT-style reuse.
- [Mindustry](https://github.com/Anuken/Mindustry): explicitly describes automation, tower defense and RTS together. It supports treating production and defense as one connected simulation, rather than unrelated buttons.
- [OpenTTD](https://github.com/OpenTTD/OpenTTD): transport simulation/economy demonstrates the transport-tycoon niche and the importance of separating engine licensing from proprietary original game assets.
- [Endless Sky](https://github.com/endless-sky/endless-sky): trading, exploration, ships and combat demonstrate shared economies between different player activities. Its asset copyright file is separate from GPL source licensing.

These informed the genre design registry and the real resource-to-turret-to-defense loop in Frontier. Additional niche entries not tied to one of these sources are explicitly design taxonomy, not research-verified implemented modules.

### 6. Art/audio and AI are separate licensing and operational domains

[Blender](https://github.com/blender/blender), [Krita](https://github.com/KDE/krita), [Tiled](https://github.com/mapeditor/tiled) and [LDtk](https://github.com/deepnight/ldtk) are suitable **offline tools** with interchange files, not runtime engines to embed. No third-party artwork is shipped: all five illustrations, favicon, UI icons, gameplay drawings and sound-generation code are original.

[llama.cpp](https://github.com/ggml-org/llama.cpp), [MLX](https://github.com/ml-explore/mlx), [OpenHands](https://github.com/OpenHands/OpenHands), [bolt.diy](https://github.com/stackblitz-labs/bolt.diy), and [Malmo](https://github.com/microsoft/malmo) cover distinct inference/development/research roles. A permissive inference runtime does **not** license model weights, generated assets or provider access. No weights, paid service integration or generated executable community code is included.

## Coverage and remaining research gaps

Covered at survey depth: all specifically named engine candidates; browser rendering; rigid bodies and specialized cloth; ECS; navigation/behavior trees; local inference; authoritative rooms/backends and native rollback/UDP; voxel/noise; narrative authoring; art/level editors; native/browser audio; build/QA; data services; localization; WASM runtimes; agentic developer tooling; scientific experimentation; and existing hybrid games.

**Gaps requiring further investigation:** Vulkan/DirectX translation implementation details; GI/ray tracing/neural rendering; soft-body/fluid/destruction solvers; high-fidelity vehicles/robotics; skeletal/mocap processing; accessible nonvisual gameplay frameworks; dedicated accessibility hardware; academic validation; large-scale MMO orchestration/security; distributed mod hosting; and per-platform console export terms. GLFW, bgfx, Filament, wgpu, OpenXR and additional specialist candidates were not individually verified in this pass and are **not** counted in the 59.

Exact hardware minima, every transitive dependency and asset term, latest issue health, build reproducibility, ABI compatibility and performance of the **unselected** projects remain unknown. Only the selected toolchain was installed and the actual game was executed. See [test evidence](TEST_REPORT.md), [performance measurements](PERFORMANCE.md), and [ranked next steps](NEXT_STEPS.md).
