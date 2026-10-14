# Research ledger — per-project evidence and decisions

Snapshot: 2026-10-14T14:32:12.733891+00:00. Reproduce with `python scripts/research.py` then `python scripts/supplement-research.py` and `python scripts/research-report.py`.

Verification depth: fetched official repository metadata, README text (up to 16,000 characters), root detected license text (up to 16,000), and latest GitHub release record. Six shortlisted repositories also have a three-item open issue sample; GitHub’s issues endpoint can include pull requests. These samples are not a security audit. Five nonstandard license paths were fetched separately. Repository dependency graphs and every individual source file were **not** audited. No upstream build/install scripts were executed.

## 01. godotengine/godot

- **Official repository:** https://github.com/godotengine/godot
- **Purpose/capabilities (upstream description):** Godot Engine – Multi-platform 2D and 3D game engine
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop, mobile, web exports. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/godotengine/godot/blob/master/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-14T02:58:15Z; open issues=18867. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 4.7.2-stable; published 2026-08-18T16:12:28Z; https://github.com/godotengine/godot/releases/tag/4.7.2-stable. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Editor/export templates; C++ build only if modifying engine.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Full native 2D/3D editor; separate export and shared JSON saves, not embedded; high port cost.
- **Source README:** https://github.com/godotengine/godot/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ## 2D and 3D cross-platform game engine
  > **[Godot Engine](https://godotengine.org) is a feature-packed, cross-platform
  > be exported with one click to a number of platforms, including the major desktop
  > platforms (Linux, macOS, Windows), mobile platforms (Android, iOS), as well as
  > Web-based platforms and [consoles](https://godotengine.org/consoles).
- **Issue/PR sample inspected:**
  - [[RTL] Fix visible rect calculation for glyphs with negative advance.](https://github.com/godotengine/godot/pull/124475)
  - [SCons: Ensure shader includes are properly regenerated if builders change](https://github.com/godotengine/godot/pull/124474)
  - [Physics query parameter docs: refer to new methods](https://github.com/godotengine/godot/pull/124473)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 02. bevyengine/bevy

- **Official repository:** https://github.com/bevyengine/bevy
- **Purpose/capabilities (upstream description):** A refreshingly simple data-driven game engine built in Rust
- **Language:** Rust (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native desktop, WASM web targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT OR Apache-2.0. Open source; commercial use with notices; crate and example-asset exceptions.
- **License evidence:** https://github.com/bevyengine/bevy/blob/main/LICENSE-MIT
- **Maintenance evidence:** archived=False; pushed=2026-10-13T19:38:07Z; open issues=3519. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v0.20.0; published 2026-10-08T21:41:02Z; https://github.com/bevyengine/bevy/releases/tag/v0.20.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Rust/Cargo, graphics backend and WASM toolchain.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Rust ECS renderer; WASM viable but compiler/toolchain cost exceeds slice.
- **Source README:** https://github.com/bevyengine/bevy/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [![License](https://img.shields.io/badge/license-MIT%2FApache-blue.svg)](https://github.com/bevyengine/bevy#license)
  > For more complex architecture decisions and experimental mad science, please open a [GitHub Discussion](https://github.com/bevyengine/bevy/discussions) so we can brainstorm together effectively!
  > <!-- This next line need to stay exactly as is. It is required for BrowserStack sponsorship. -->
  > Bevy is free, open source and permissively licensed!
  > Except where noted (below and/or in individual files), all code in this repository is dual-licensed under either:
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 03. o3de/o3de

- **Official repository:** https://github.com/o3de/o3de
- **Purpose/capabilities (upstream description):** Open 3D Engine (O3DE) is an Apache 2.0-licensed multi-platform 3D engine that enables developers and content creators to build AAA games, cinema-quality 3D worlds, and high-fidelity simulations without any fees or commercial obligations.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native desktop 3D stack. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0 OR MIT. Open source; commercial use with notices; third-party copyleft components separate.
- **License evidence:** https://github.com/o3de/o3de/blob/development/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-14T12:08:37Z; open issues=3517. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 2605.0; published 2026-05-27T17:01:43Z; https://github.com/o3de/o3de/releases/tag/2605.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** CMake, C++ toolchain, large 3P cache and GPU-capable workstation.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Rejected for slice; Very high.
- **Compatibility, overlap, known constraints and decision:** Large native 3D stack; high hardware and build cost.
- **Source README:** https://github.com/o3de/o3de/blob/development/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > O3DE (Open 3D Engine) is an open-source, real-time, multi-platform 3D engine that enables developers and content creators to build AAA games, cinema-quality 3D worlds, and high-fidelity simulations without any fees or commercial obligations.
  > ### Build requirements and redistributables
  > For the latest details and system requirements, refer to [System Requirements](https://o3de.org/docs/welcome-guide/requirements/) in the documentation.
  > *   Check [System Requirements](https://o3de.org/docs/welcome-guide/requirements/) for other supported versions.
  > *   For the latest version requirements and setup instructions, refer to the [Wwise Audio Engine Gem](https://o3de.org/docs/user-guide/gems/reference/audio/wwise/audio-engine-wwise/) reference in the documentation.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 04. defold/defold

- **Official repository:** https://github.com/defold/defold
- **Purpose/capabilities (upstream description):** Defold is a completely free to use game engine for development of desktop, console, mobile and web games.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop, mobile, HTML5 exports. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Defold License 1.0 (custom). Source available / not unrestricted open source: section 4(a) bars commercializing the engine as a Game Engine Product; game use distinct.
- **License evidence:** https://github.com/defold/defold/blob/dev/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:30:22Z; open issues=921. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 1.14.0; published 2026-10-12T13:24:54Z; https://github.com/defold/defold/releases/tag/1.14.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Defold editor and build pipeline, Lua authoring.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Compact Lua engine; custom license needs separate legal review.
- **Source README:** https://github.com/defold/defold/blob/dev/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ### Platform Specifics
  > ## Complying with licenses
  > A full list of third party software licenses along with information on how to give attribution and include the licenses in your game can be found in the [COMPLYING WITH LICENSES](/COMPLYING_WITH_LICENSES.md) document in the Defold repository on GitHub.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 05. 4ian/GDevelop

- **Official repository:** https://github.com/4ian/GDevelop
- **Purpose/capabilities (upstream description):** 🎮 Open-source, cross-platform 2D/3D/multiplayer game engine designed for everyone.
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Web, desktop/mobile exports. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT for engine/editor/extensions. Open source core; commercial use with notices; trademarks and hosted services separate.
- **License evidence:** https://github.com/4ian/GDevelop/blob/master/LICENSE.md
- **Maintenance evidence:** archived=False; pushed=2026-10-14T13:03:09Z; open issues=633. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v5.6.283; published 2026-09-29T13:19:40Z; https://github.com/4ian/GDevelop/releases/tag/v5.6.283. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Editor/runtime export pipeline; optional service terms separate.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; Medium.
- **Compatibility, overlap, known constraints and decision:** Visual authoring; export boundary rather than nested engine.
- **Source README:** https://github.com/4ian/GDevelop/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > - Find GDevelop games on [gd.games](https://gd.games), the gaming platform for games powered by GDevelop.
  > | `Extensions`  | Built-in extensions for the game engine, providing objects, behaviors and new features. For example, this includes the physics engines running in WebAssembly (Box2D or Jolt Physics for 3D). All the [official and experimental extensions are on this repository](https://github.com/GDevelopApp/GDevelop-extensions). [Community extensions are available here](https://github.com/GDevelopApp/GDevelop-community-list). |
  > Status of the tests and builds: [![macOS and Linux build status](https://circleci.com/gh/4ian/GDevelop.svg?style=shield)](https://app.circleci.com/pipelines/github/4ian/GDevelop) [![Fast tests status](https://gdevelop.semaphoreci.com/badges/GDevelop/branches/master.svg?style=shields)](https://gdevelop.semaphoreci.com/projects/GDevelop) [![Windows Build status](https://ci.appveyor.com/api/projects/status/84uhtdox47xp422x/branch/master?svg=true)](https://ci.appveyor.com/project/4ian/gdevelop/branc
  > - Open-source [extensions (official or experimental)](https://github.com/GDevelopApp/GDevelop-extensions), [community extensions](https://github.com/GDevelopApp/GDevelop-community-list), [examples](https://github.com/GDevelopApp/GDevelop-examples), [tutorials](https://github.com/GDevelopApp/GDevelop-tutorials) are on GitHub.
  > - The Core library, the native and HTML5 game engines, the IDE, and all extensions (respectively `Core`, `GDJS`, `newIDE` and `Extensions` folders) are under the **MIT license**.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 06. libsdl-org/SDL

- **Official repository:** https://github.com/libsdl-org/SDL
- **Purpose/capabilities (upstream description):** Simple DirectMedia Layer
- **Language:** C (dominant repository language, verified metadata).
- **Platform family / candidate target:** Cross-platform native/windowing targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Zlib. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/libsdl-org/SDL/blob/main/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-14T02:16:56Z; open issues=879. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** release-3.4.18; published 2026-10-02T22:43:21Z; https://github.com/libsdl-org/SDL/releases/tag/release-3.4.18. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C toolchain, platform window/input/audio backends.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Native input/window/audio layer; C toolchain and separate runtime.
- **Source README:** https://github.com/libsdl-org/SDL/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Simple DirectMedia Layer (SDL for short) is a cross-platform library
  > This library is distributed under the terms of the zlib license,
  > available in [LICENSE.txt](LICENSE.txt).
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 07. raysan5/raylib

- **Official repository:** https://github.com/raysan5/raylib
- **Purpose/capabilities (upstream description):** A simple and easy-to-use library to enjoy videogames programming
- **Language:** C (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop, web/native target families. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Zlib. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/raysan5/raylib/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T09:38:36Z; open issues=6. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 6.0; published 2026-04-23T09:55:57Z; https://github.com/raysan5/raylib/releases/tag/6.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C compiler; Emscripten for browser builds.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; Medium.
- **Compatibility, overlap, known constraints and decision:** Small C rendering API; native/WASM alternative; requires port.
- **Source README:** https://github.com/raysan5/raylib/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [![License](https://img.shields.io/badge/license-zlib%2Flibpng-blue.svg)](LICENSE)
  > [![Build Windows](https://github.com/raysan5/raylib/actions/workflows/build_windows.yml/badge.svg)](https://github.com/raysan5/raylib/actions/workflows/build_windows.yml)
  > [![Build Linux](https://github.com/raysan5/raylib/actions/workflows/build_linux.yml/badge.svg)](https://github.com/raysan5/raylib/actions/workflows/build_linux.yml)
  > [![Build macOS](https://github.com/raysan5/raylib/actions/workflows/build_macos.yml/badge.svg)](https://github.com/raysan5/raylib/actions/workflows/build_macos.yml)
  > [![Build examples Windows](https://github.com/raysan5/raylib/actions/workflows/build_examples_windows.yml/badge.svg)](https://github.com/raysan5/raylib/actions/workflows/build_examples_windows.yml)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 08. MonoGame/MonoGame

- **Official repository:** https://github.com/MonoGame/MonoGame
- **Purpose/capabilities (upstream description):** One framework for creating powerful cross-platform games.
- **Language:** C# (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop/mobile managed game targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Ms-PL. Open source; commercial use; source redistribution must retain Ms-PL; patent and trademark clauses.
- **License evidence:** https://github.com/MonoGame/MonoGame/blob/develop/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-11T15:21:59Z; open issues=766. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v3.8.6; published 2026-10-07T14:16:03Z; https://github.com/MonoGame/MonoGame/releases/tag/v3.8.6. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** .NET SDK, platform packages, content builder.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** C sharp game framework; separate managed runtime and asset pipeline.
- **Source README:** https://github.com/MonoGame/MonoGame/blob/develop/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > One framework for creating powerful cross-platform games
  > [Supported Platforms](#supported-platforms) •
  > [License](#license)
  > ## Supported Platforms
  > We support a growing list of platforms across the desktop, mobile, and console space. If there is a platform we do not support, please [make a request](https://github.com/MonoGame/MonoGame/issues) or [come help us](CONTRIBUTING.md) add it.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 09. libgdx/libgdx

- **Official repository:** https://github.com/libgdx/libgdx
- **Purpose/capabilities (upstream description):** Desktop/Android/HTML5/iOS Java game development framework
- **Language:** Java (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop, Android, iOS/HTML backends. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/libgdx/libgdx/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T07:39:51Z; open issues=342. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 1.14.2; published 2026-06-05T08:18:26Z; https://github.com/libgdx/libgdx/releases/tag/1.14.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JDK/Gradle; backend-specific transpilation/native tools.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Java framework; JVM/HTML backend separate from JS shell.
- **Source README:** https://github.com/libgdx/libgdx/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ## Cross-platform Game Development Framework
  > **[libGDX](https://libgdx.com) is a cross-platform Java game development framework based on OpenGL (ES), designed for Windows, Linux, macOS, Android, web browsers, and iOS.** It provides a robust and well-established environment for rapid prototyping and iterative development. Unlike other frameworks, libGDX does not impose a specific design or coding style, allowing you the freedom to create games according to your preferences.
  > libGDX is released under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0.html), offering unrestricted usage in both commercial and non-commercial projects. While not mandatory, we appreciate any credit given to libGDX when you release a game or app using it. Check out our [showcase](https://libgdx.com/showcase/) for a selection of popular libGDX-powered games. With libGDX, you gain access to a comprehensive set of tools and features to develop multi-platform 2D and 3D games
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 10. cocos2d/cocos2d-x

- **Official repository:** https://github.com/cocos2d/cocos2d-x
- **Purpose/capabilities (upstream description):** Cocos2d-x is a suite of open-source, cross-platform, game-development tools utilized by millions of developers across the globe. Its core has evolved to serve as the foundation for Cocos Creator 1.x & 2.x.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop and mobile C++ targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT (main engine). Open source core; commercial use with notices; separate dependency/artwork licenses.
- **License evidence:** https://github.com/cocos2d/cocos2d-x/blob/v4/licenses/LICENSE_cocos2d-x.txt
- **Maintenance evidence:** archived=False; pushed=2025-05-09T03:36:03Z; open issues=1604. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** No latest-release response; published unavailable; see retained endpoint error in evidence.json. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** CMake, native SDKs; dated branch dependency audit.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Rejected for slice; High.
- **Compatibility, overlap, known constraints and decision:** C++ 2D engine overlaps lightweight web slice; maintenance must be checked.
- **Source README:** https://github.com/cocos2d/cocos2d-x/blob/v4/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [cocos2d-x][1] is a multi-platform framework for building 2d games, interactive books, demos and other graphical applications.
  > It works on iOS, Android, macOS, Windows and Linux.
  > 2. After cloning the repo, please execute `download-deps.py` to download and install dependencies.
  > * OpenGL ES 2.0 (mobile) / OpenGL 2.1 (desktop) / metal(macos and iOS) based
  > Build Requirements
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 11. BabylonJS/Babylon.js

- **Official repository:** https://github.com/BabylonJS/Babylon.js
- **Purpose/capabilities (upstream description):** Babylon.js is a powerful, beautiful, simple, and open game and rendering engine packed into a friendly JavaScript framework.
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** WebGL/WebGPU-capable browsers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/BabylonJS/Babylon.js/blob/master/license.md
- **Maintenance evidence:** archived=False; pushed=2026-10-14T12:41:34Z; open issues=14. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 9.30.0; published 2026-10-08T07:52:07Z; https://github.com/BabylonJS/Babylon.js/releases/tag/9.30.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS package; GPU renderer, glTF assets and lifecycle adapter.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Web 3D engine; promising future 3D mode behind canvas lifecycle.
- **Source README:** https://github.com/BabylonJS/Babylon.js/blob/master/readme.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > > ⚠️ WARNING: The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.
  > "anotherAwesomeDependency"
  > Building and developing this repository requires Node.js 22.22.2 or newer within
  > or newer. These are development-tool requirements; they do not change the runtime
  > requirements of the published Babylon.js libraries.
- **Issue/PR sample inspected:**
  - [Add source-range residency and split range packs to GaussianSplattingStream](https://github.com/BabylonJS/Babylon.js/pull/18996)
  - [Fix: AssetContainer scene observer not being disposed](https://github.com/BabylonJS/Babylon.js/pull/18993)
  - [Fix KHR_interactivity conformance for updated Khronos edge-case assets](https://github.com/BabylonJS/Babylon.js/pull/18986)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 12. mrdoob/three.js

- **Official repository:** https://github.com/mrdoob/three.js
- **Purpose/capabilities (upstream description):** JavaScript 3D Library.
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** WebGL/WebGPU-capable browsers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/mrdoob/three.js/blob/dev/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:02:04Z; open issues=398. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** r186; published 2026-09-24T14:35:44Z; https://github.com/mrdoob/three.js/releases/tag/r186. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS package; camera, renderer, GLTFLoader; gameplay supplied separately.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** WebGL/WebGPU renderer; lighter future 3D boundary; gameplay supplied separately.
- **Source README:** https://github.com/mrdoob/three.js/blob/dev/README.md
- **Issue/PR sample inspected:**
  - [WebGLBackend: Move `transforms` and `attributes` to `ComputePipeline`.](https://github.com/mrdoob/three.js/pull/35009)
  - [Add VDBLoader and example](https://github.com/mrdoob/three.js/pull/35008)
  - [WebGPURenderer: Share builds between instanced meshes with `referenceAttribute()`.](https://github.com/mrdoob/three.js/pull/35007)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 13. playcanvas/engine

- **Official repository:** https://github.com/playcanvas/engine
- **Purpose/capabilities (upstream description):** Powerful web graphics runtime built on WebGL, WebGPU, WebXR and glTF
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Modern web browsers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/playcanvas/engine/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:11:37Z; open issues=464. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v2.23.2; published 2026-10-09T15:01:02Z; https://github.com/playcanvas/engine/releases/tag/v2.23.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS engine; asset pipeline; hosted editor services distinct.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Web 3D engine; distinguish open engine from hosted editor service.
- **Source README:** https://github.com/playcanvas/engine/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [![License](https://img.shields.io/npm/l/playcanvas)](https://github.com/playcanvas/engine/blob/main/LICENSE)
  > Ensure you have [Node.js 18+](https://nodejs.org) installed. Then, install all of the required Node.js dependencies:
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 14. phaserjs/phaser

- **Official repository:** https://github.com/phaserjs/phaser
- **Purpose/capabilities (upstream description):** Phaser is a fun, free and fast 2D game framework for making HTML5 games for desktop and mobile web browsers, supporting Canvas and WebGL rendering.
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop/mobile browsers, third-party wrappers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/phaserjs/phaser/blob/master/LICENSE.md
- **Maintenance evidence:** archived=False; pushed=2026-08-21T06:56:13Z; open issues=168. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v4.2.1; published 2026-07-09T14:33:40Z; https://github.com/phaserjs/phaser/releases/tag/v4.2.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS/TS runtime package; Canvas/WebGL backend.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; Medium.
- **Compatibility, overlap, known constraints and decision:** Strong browser 2D framework; overlaps small custom simulation and renderer.
- **Source README:** https://github.com/phaserjs/phaser/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > - **Truly cross-platform** - One codebase runs on desktop browsers, mobile browsers, and can be wrapped for native app stores, Steam, YouTube Playables, Discord Activities, and more.
  > Lighting is now as simple as `sprite.setLighting(true)` - no pipeline juggling required. Objects can cast self-shadows based on their own texture, lights have an explicit `z` height value, and lighting works across most game objects including BitmapText, Particles, TileSprite, and both tilemap layer types.
- **Issue/PR sample inspected:**
  - [Fix Shader vertex buffer and VAO cleanup on destroy](https://github.com/phaserjs/phaser/pull/7399)
  - [Fix nullable return types for TilemapLayer getTileAt / getTileAtWorldXY / removeTileAt and related methods (#7396)](https://github.com/phaserjs/phaser/pull/7398)
  - [[4.2.1] BitmapText ignores roundPixels / vertexRoundMode, so it renders blurry at fractional positions](https://github.com/phaserjs/phaser/issues/7397)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 15. pixijs/pixijs

- **Official repository:** https://github.com/pixijs/pixijs
- **Purpose/capabilities (upstream description):** The HTML5 Creation Engine: Create beautiful digital content with the fastest, most flexible 2D WebGL renderer.
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Modern web browsers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/pixijs/pixijs/blob/dev/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-10T15:14:52Z; open issues=384. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v8.22.0; published 2026-10-01T21:48:36Z; https://github.com/pixijs/pixijs/releases/tag/v8.22.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS/TS runtime, graphics backend and asset loader.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** GPU 2D renderer if Canvas2D profiling justifies replacement.
- **Source README:** https://github.com/pixijs/pixijs/blob/dev/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > across all devices and allowing you to create rich, interactive graphics and cross-platform applications using WebGL and WebGPU.
  > **TypeScript 5:** no WebGPU types are built in, so PixiJS adds [`@webgpu/types`](https://github.com/gpuweb/types) for you. No additional setup required.
  > This content is released under the [MIT License](http://opensource.org/licenses/MIT).
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 16. pmndrs/react-three-fiber

- **Official repository:** https://github.com/pmndrs/react-three-fiber
- **Purpose/capabilities (upstream description):** 🇨🇭 A React renderer for Three.js
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** React web/native renderer targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/pmndrs/react-three-fiber/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:04:11Z; open issues=16. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v9.8.1; published 2026-09-24T21:42:50Z; https://github.com/pmndrs/react-three-fiber/releases/tag/v9.8.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** React, Three.js and compatible peer versions.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Verified existing React/Three integration; unnecessary React dependency here.
- **Source README:** https://github.com/pmndrs/react-three-fiber/blob/master/readme.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > # Install dependencies
  > Some configuration may be required to tell the Metro bundler about your assets if you use `useLoader` or Drei abstractions like `useGLTF` and `useTexture`:
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 17. dimforge/rapier

- **Official repository:** https://github.com/dimforge/rapier
- **Purpose/capabilities (upstream description):** 2D and 3D physics engines focused on performance.
- **Language:** Rust (dominant repository language, verified metadata).
- **Platform family / candidate target:** Rust native and WASM bindings. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/dimforge/rapier/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-10T12:08:59Z; open issues=68. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** No latest-release response; published unavailable; see retained endpoint error in evidence.json. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Rust toolchain or separately verified JS/WASM package.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Rust/WASM rigid body physics; optional worker with own collision authority.
- **Source README:** https://github.com/dimforge/rapier/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > <a href="https://opensource.org/licenses/Apache-2.0">
  > <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg">
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 18. liabru/matter-js

- **Official repository:** https://github.com/liabru/matter-js
- **Purpose/capabilities (upstream description):** a 2D rigid body physics engine for the web ▲● ■
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** JavaScript browser/native JS hosts. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/liabru/matter-js/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-09-30T17:14:46Z; open issues=279. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** No latest-release response; published unavailable; see retained endpoint error in evidence.json. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS module; fixed-step body synchronization.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Low.
- **Compatibility, overlap, known constraints and decision:** JS 2D rigid bodies; not needed for circles and tile collisions.
- **Source README:** https://github.com/liabru/matter-js/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [Demos](#demos) ・ [Gallery](#gallery) ・ [Features](#features) ・ [Plugins](#plugins) ・ [Install](#install) ・ [Usage](#usage) ・ [Examples](#examples) ・ [Docs](#documentation) ・ [Wiki](https://github.com/liabru/matter-js/wiki) ・ [References](#references) ・ [License](#license)
  > - World state serialisation (requires [resurrect.js](https://github.com/skeeto/resurrect-js))
  > Alternatively you can download a [stable release](https://github.com/liabru/matter-js/tags) or try the latest experimental [alpha build](https://github.com/liabru/matter-js/tree/master/build) (master) and include the script in your web page:
  > This will install the required build dependencies, then run
  > Matter.js is licensed under [The MIT License (MIT)](https://opensource.org/licenses/MIT)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 19. jrouwe/JoltPhysics

- **Official repository:** https://github.com/jrouwe/JoltPhysics
- **Purpose/capabilities (upstream description):** A multi core friendly rigid body physics and collision detection library. Written in C++. Suitable for games and VR applications. Used by Horizon Forbidden West and Death Stranding 2.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native 3D physics targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/jrouwe/JoltPhysics/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-13T19:34:52Z; open issues=12. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v5.6.0; published 2026-07-11T18:55:00Z; https://github.com/jrouwe/JoltPhysics/releases/tag/v5.6.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++/CMake; separate JS binding for web.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Native rigid bodies; WASM binding review needed.
- **Source README:** https://github.com/jrouwe/JoltPhysics/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ## Supported platforms
  > * Windows x86/x64/ARM64
  > * Linux (tested on Ubuntu) x86/x64/ARM32/ARM64/RISC-V64/LoongArch64/PowerPC64LE
  > * Platform Blue (a popular game console) x64
  > * macOS x64/ARM64
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 20. NVIDIA-Omniverse/PhysX

- **Official repository:** https://github.com/NVIDIA-Omniverse/PhysX
- **Purpose/capabilities (upstream description):** NVIDIA PhysX SDK
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native simulation targets; optional GPU paths. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** BSD-3-Clause. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/NVIDIA-Omniverse/PhysX/blob/main/LICENSE.md
- **Maintenance evidence:** archived=False; pushed=2026-10-09T22:03:09Z; open issues=127. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** ovphysx-0.6.4; published 2026-10-09T18:10:55Z; https://github.com/NVIDIA-Omniverse/PhysX/releases/tag/ovphysx-0.6.4. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Native toolchain; GPU/platform-specific features not assumed universal.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Native physics; GPU and platform constraints require validation.
- **Source README:** https://github.com/NVIDIA-Omniverse/PhysX/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > <summary>Copyright & License</summary>
  > Please also see license files in the root folder and in the respective subfolders.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 21. NVIDIAGameWorks/NvCloth

- **Official repository:** https://github.com/NVIDIAGameWorks/NvCloth
- **Purpose/capabilities (upstream description):** None
- **Language:** C (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native cloth simulation. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** NVIDIA Source Code License (1-Way Commercial). Custom source license; redistribution and patent-termination clauses; OSI status not established in this review.
- **License evidence:** https://github.com/NVIDIAGameWorks/NvCloth/blob/master/NvCloth/license.txt
- **Maintenance evidence:** archived=False; pushed=2024-01-10T17:15:16Z; open issues=17. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.0.0; published 2017-02-15T15:30:21Z; https://github.com/NVIDIAGameWorks/NvCloth/releases/tag/v1.0.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++ SDK/backends; hardware and license review required.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Specialized cloth simulation; native-only integration review.
- **Source README:** https://github.com/NVIDIAGameWorks/NvCloth/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > See ./NvCloth/ReleaseNotes.txt for changes and platform support.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 22. recastnavigation/recastnavigation

- **Official repository:** https://github.com/recastnavigation/recastnavigation
- **Purpose/capabilities (upstream description):** Industry-standard navigation-mesh toolset for games
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Portable native navigation libraries. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Zlib. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/recastnavigation/recastnavigation/blob/main/License.txt
- **Maintenance evidence:** archived=False; pushed=2026-02-27T07:17:13Z; open issues=148. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.6.0; published 2023-05-21T17:52:00Z; https://github.com/recastnavigation/recastnavigation/releases/tag/v1.6.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++ build, navmesh generation; separate WASM binding for web.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Navmesh pipeline; future 3D navigation not needed for current grid.
- **Source README:** https://github.com/recastnavigation/recastnavigation/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > * 🚫 **Dependency-Free** - building Recast & Detour only requires a C++98-compliant compiler
  > Recast & Detour is licensed under the ZLib license. See [License.txt](License.txt) for more.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 23. BehaviorTree/BehaviorTree.CPP

- **Official repository:** https://github.com/BehaviorTree/BehaviorTree.CPP
- **Purpose/capabilities (upstream description):** Behavior Trees Library in C++. Batteries included.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native AI/robotics applications. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/BehaviorTree/BehaviorTree.CPP/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-10T17:58:43Z; open issues=43. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 4.9.0; published 2026-02-11T10:02:09Z; https://github.com/BehaviorTree/BehaviorTree.CPP/releases/tag/4.9.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++ build; optional tooling/network packages.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Native behavior trees through service or native module, not JS embedding.
- **Source README:** https://github.com/BehaviorTree/BehaviorTree.CPP/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ![License MIT](https://img.shields.io/github/license/BehaviorTree/BehaviorTree.CPP?color=blue)
  > [![conan Windows](https://github.com/BehaviorTree/BehaviorTree.CPP/actions/workflows/cmake_windows.yml/badge.svg)](https://github.com/BehaviorTree/BehaviorTree.CPP/actions/workflows/cmake_windows.yml)
  > **BT.CPP** requires a compiler that supports C++17.
  > - **conan** otherwise (Linux/Windows).
  > - **straight cmake** if you want to be personally responsible for dependencies :)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 24. ggerganov/llama.cpp

- **Official repository:** https://github.com/ggml-org/llama.cpp
- **Purpose/capabilities (upstream description):** LLM inference in C/C++
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native inference with several compute backends. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/ggml-org/llama.cpp/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:19:04Z; open issues=2546. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v0.6.0; published 2026-10-05T16:56:22Z; https://github.com/ggml-org/llama.cpp/releases/tag/v0.6.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Compiler, model file, backend libraries; RAM/VRAM depends on model.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Local model inference; model weights separately licensed and memory-heavy.
- **Source README:** https://github.com/ggml-org/llama.cpp/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  > - Plain C/C++ implementation without any dependencies
  > | [IBM zDNN](docs/backend/zDNN.md) | IBM Z & LinuxONE |
  > - [yhirose/cpp-httplib](https://github.com/yhirose/cpp-httplib) - Single-header HTTP server, used by `llama-server` - MIT license
  > - [nlohmann/json](https://github.com/nlohmann/json) - Single-header JSON library, used by various tools/examples - MIT License
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 25. ml-explore/mlx

- **Official repository:** https://github.com/ml-explore/mlx
- **Purpose/capabilities (upstream description):** MLX: An array framework for Apple silicon
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Apple-oriented ML stack. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/ml-explore/mlx/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T09:30:51Z; open issues=115. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v0.32.3; published 2026-09-29T00:37:42Z; https://github.com/ml-explore/mlx/releases/tag/v0.32.3. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Supported Apple/MLX environment; portability beyond README not verified.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Apple-focused ML research tooling; not portable browser baseline.
- **Source README:** https://github.com/ml-explore/mlx/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > To install the CUDA backend on Linux, run:
  > To install a CPU-only Linux package, run:
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 26. colyseus/colyseus

- **Official repository:** https://github.com/colyseus/colyseus
- **Purpose/capabilities (upstream description):** ⚔ Multiplayer Framework for Node.js
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** JS clients and Node server. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/colyseus/colyseus/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-13T21:08:16Z; open issues=16. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 0.18; published 2026-08-25T19:43:34Z; https://github.com/colyseus/colyseus/releases/tag/0.18. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Authoritative server, room lifecycle, transport and persistence choices.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; Medium.
- **Compatibility, overlap, known constraints and decision:** Existing authoritative JS rooms; server cost and reconciliation required.
- **Source README:** https://github.com/colyseus/colyseus/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > available for all major platforms and engines.
  > | Platform | Install | Documentation | Demo |
  > | C / Static Libraries | [Download](https://github.com/colyseus/native-sdk/releases?q=%22Colyseus+Native+SDK+-+Static+Library%22&expanded=true) | [GitHub](https://github.com/colyseus/native-sdk) | [raylib](https://github.com/colyseus/native-sdk/tree/main/platforms/raylib) |
  > - 💙 **Free forever** → MIT licensed, even for commercial games.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 27. heroiclabs/nakama

- **Official repository:** https://github.com/heroiclabs/nakama
- **Purpose/capabilities (upstream description):** Scalable open-source game backend server: multiplayer, matchmaking, leaderboards, chat, and social features for games.
- **Language:** Go (dominant repository language, verified metadata).
- **Platform family / candidate target:** Server with platform clients. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/heroiclabs/nakama/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T13:42:52Z; open issues=122. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v3.41.0; published 2026-09-18T19:51:36Z; https://github.com/heroiclabs/nakama/releases/tag/v3.41.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Server process, database, client SDK, hosting/operations.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Auth/persistence/matchmaking backend; database and operations boundary.
- **Source README:** https://github.com/heroiclabs/nakama/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > <a href="https://github.com/heroiclabs/nakama/blob/master/LICENSE"><img src="https://img.shields.io/github/license/heroiclabs/nakama.svg?colorA=18181B&colorB=825df2" alt="License"></a>
  > Build scalable games and apps with a production ready server used by ambitious game studios and app developers [all around the world](https://heroiclabs.com/customers/). Have a look at the [documentation](https://heroiclabs.com/docs) and join the [developer community](https://forum.heroiclabs.com) for more info.
  > The server is simple to setup and run for local development and can be deployed to any cloud provider. See the [deployment notes](#deployment) for recommendations on how to deploy the project for production. Nakama server requires CockroachDB or another Postgres wire-compatible server as it's database.
  > You can run the servers with native binaries for your platform.
  > There's a number of official [client libraries](https://github.com/heroiclabs) available on GitHub with [documentation](https://heroiclabs.com/docs). The current platform/language support includes: .NET (in C#), Unity engine, JavaScript, Java (with Android), Unreal engine, Godot, Defold, and Swift (with iOS). If you'd like to contribute a client or request one let us know.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 28. networkprotocol/netcode

- **Official repository:** https://github.com/mas-bandwidth/netcode
- **Purpose/capabilities (upstream description):** Secure client/server protocol for multiplayer games built on top of UDP
- **Language:** C (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native UDP clients/servers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** BSD-3-Clause. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/mas-bandwidth/netcode/blob/main/LICENCE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T07:40:00Z; open issues=1. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.4.8; published 2026-09-13T22:27:15Z; https://github.com/mas-bandwidth/netcode/releases/tag/v1.4.8. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Native build, crypto dependency, sockets; browser gateway needed.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Encrypted UDP protocol; no direct browser UDP support.
- **Source README:** https://github.com/mas-bandwidth/netcode/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [BSD 3-Clause license](https://opensource.org/licenses/BSD-3-Clause).
  > The license doesn't require this. It's an official request, and honoring it is appreciated. Fair credit keeps open source honest.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 29. pond3r/ggpo

- **Official repository:** https://github.com/pond3r/ggpo
- **Purpose/capabilities (upstream description):** Good Game, Peace Out Rollback Network SDK
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native rollback integration. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/pond3r/ggpo/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2024-06-26T13:59:55Z; open issues=30. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** No latest-release response; published unavailable; see retained endpoint error in evidence.json. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Native SDK, deterministic snapshots and input synchronization.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Rollback SDK; deterministic simulation and native binding required.
- **Source README:** https://github.com/pond3r/ggpo/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Building GGPO is currently only available on Windows, however efforts are being made to port it to other platforms.
  > Windows builds requires both [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) and [CMake](https://cmake.org/download/).  Make sure you've installed both before starting.  Make sure to add CMake to your path when installing.
  > - Run the `build_windows.cmd` in the root directory of the SDK to generate the Visual Studio 2019 solution files.
  > GGPO is available under The MIT License. This means GGPO is free for commercial and non-commercial use. Attribution is not required, but appreciated.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 30. Luanti-org/luanti

- **Official repository:** https://github.com/luanti-org/luanti
- **Purpose/capabilities (upstream description):** Luanti (formerly Minetest) is an open source voxel game-creation platform with easy modding and game creation
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Windows, Linux, macOS native documented. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** LGPL-2.1-or-later code; multiple asset licenses. Open source code; commercial use subject to LGPL obligations; distributed textures/sounds include CC-BY-SA, CC-BY, Apache.
- **License evidence:** https://github.com/luanti-org/luanti/blob/master/COPYING.LESSER
- **Maintenance evidence:** archived=False; pushed=2026-10-10T12:06:24Z; open issues=1513. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 5.17.0; published 2026-08-20T17:45:51Z; https://github.com/luanti-org/luanti/releases/tag/5.17.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Native engine, Lua game/mod content; separate application export.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Voxel game platform; exchange assets/maps not engine embedding.
- **Source README:** https://github.com/luanti-org/luanti/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > <a href="https://github.com/luanti-org/luanti/actions?query=event%3Apush"><img src="https://github.com/luanti-org/luanti/workflows/linux/badge.svg" alt="Build status"></a>
  > <a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html"><img src="https://img.shields.io/badge/license-LGPLv2.1%2B-blue.svg" alt="License"></a>
  > Where each location is on each platform:
  > * Windows .zip / RUN_IN_PLACE source:
  > * Windows installed:
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 31. Auburn/FastNoiseLite

- **Official repository:** https://github.com/Auburn/FastNoiseLite
- **Purpose/capabilities (upstream description):** Fast Portable Noise Library - C# C++ C Java HLSL GLSL JavaScript Rust Go
- **Language:** Rust (dominant repository language, verified metadata).
- **Platform family / candidate target:** Multiple native and managed language ports. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/Auburn/FastNoiseLite/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-06-21T19:35:59Z; open issues=29. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.1.1; published 2024-03-05T21:15:30Z; https://github.com/Auburn/FastNoiseLite/releases/tag/v1.1.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Select one language port; original seeded generator adequate now.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Low.
- **Compatibility, overlap, known constraints and decision:** Portable noise library; not required for small seeded maps.
- **Source README:** https://github.com/Auburn/FastNoiseLite/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > FastNoise Lite is an extremely portable open source noise generation library with a large selection of noise algorithms. This library focuses on high performance while avoiding platform/language specific features, allowing for easy ports to as many possible languages.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 32. SanderMertens/flecs

- **Official repository:** https://github.com/SanderMertens/flecs
- **Purpose/capabilities (upstream description):** A fast entity component system (ECS) for C & C++
- **Language:** C (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native ECS targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use with notices; upstream multi-author copyright retained.
- **License evidence:** https://github.com/SanderMertens/flecs/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T05:43:19Z; open issues=62. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v4.1.6; published 2026-06-29T02:09:09Z; https://github.com/SanderMertens/flecs/releases/tag/v4.1.6. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C/C++ compilation, JS binding if used in browser.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** ECS runtime C/C++; unnecessary native bridge for slice.
- **Source README:** https://github.com/SanderMertens/flecs/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [![MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://github.com/SanderMertens/flecs/blob/master/LICENSE)
  > - Fast and [portable](#language-bindings) zero dependency [C99 API](https://www.flecs.dev/flecs/group__c.html)
  > - Verified on all major compilers and platforms with [CI](https://github.com/SanderMertens/flecs/actions) running more than 13000 tests
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 33. skypjack/entt

- **Official repository:** https://github.com/skypjack/entt
- **Purpose/capabilities (upstream description):** Gaming meets modern C++ - a fast and reliable entity component system (ECS) and much more
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** C++ applications. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/skypjack/entt/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-13T16:04:14Z; open issues=14. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v4.0.0; published 2026-07-23T12:22:33Z; https://github.com/skypjack/entt/releases/tag/v4.0.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++ headers/toolchain; no JS runtime integration supplied.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** C++ ECS; overlaps mode-owned JS state.
- **Source README:** https://github.com/skypjack/entt/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > doesn't require you to open an issue?<br/>
  > * [Requirements](#requirements)
  > * [License](#license)
  > that the library has been sufficiently tested on every platform that can come to
  > The requirements below are mandatory to compile the tests and to extract the
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 34. yarnspinnerTool/YarnSpinner

- **Official repository:** https://github.com/YarnSpinnerTool/YarnSpinner
- **Purpose/capabilities (upstream description):** The core compiler and engine-agnostic components for Yarn Spinner, the friendly dialogue tool.
- **Language:** C# (dominant repository language, verified metadata).
- **Platform family / candidate target:** Narrative authoring / managed runtimes. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/YarnSpinnerTool/YarnSpinner/blob/main/LICENSE.md
- **Maintenance evidence:** archived=False; pushed=2026-10-14T00:31:56Z; open issues=3. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v3.2.1; published 2026-05-05T02:37:44Z; https://github.com/YarnSpinnerTool/YarnSpinner/releases/tag/v3.2.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Compiler and runtime integration; engine adapter choice.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Dialogue tooling/runtime; format import or native module.
- **Source README:** https://github.com/YarnSpinnerTool/YarnSpinner/blob/main/README.md
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 35. inkle/ink

- **Official repository:** https://github.com/inkle/ink
- **Purpose/capabilities (upstream description):** inkle's open source scripting language for writing interactive narrative.
- **Language:** C# (dominant repository language, verified metadata).
- **Platform family / candidate target:** Narrative authoring / runtime ports. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/inkle/ink/blob/master/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-05-05T11:24:42Z; open issues=371. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.2.1; published 2026-05-05T11:24:42Z; https://github.com/inkle/ink/releases/tag/v1.2.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Ink compiler; separate inkjs verification for web runtime.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Narrative authoring; JS runtime is separate inkjs package, verify before integration.
- **Source README:** https://github.com/inkle/ink/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > **Mac or Linux:** `./inklecate -p myStory.ink`
  > **Windows:** `inklecate.exe -p myStory.ink`
  > ## Build Requirements
  > **Windows (Optional):**
  > * [Visual Studio](https://www.visualstudio.com/) (e.g. Community edition); required to build nuget package with multi-targeting of .NET Framework 3.5
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 36. blender/blender

- **Official repository:** https://github.com/blender/blender
- **Purpose/capabilities (upstream description):** Official mirror of Blender
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop content creation. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** GPL family; per-file terms. Open source tool; commercial use allowed, distributing modified program invokes GPL; exported original art is distinct.
- **License evidence:** https://github.com/blender/blender/blob/main/COPYING
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:31:50Z; open issues=0. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** No latest-release response; published unavailable; see retained endpoint error in evidence.json. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Blender install; GPU/RAM scaled to scene; export glTF, no tool embedding.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; Low.
- **Compatibility, overlap, known constraints and decision:** glTF creation offline; tool GPL distinct from original exported assets.
- **Source README:** https://github.com/blender/blender/blob/main/.github/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Blender as a whole is licensed under the GNU General Public License, Version 3.
  > Individual files may have a different but compatible license.
  > See [blender.org/about/license](https://www.blender.org/about/license) for details.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 37. aseprite/aseprite

- **Official repository:** https://github.com/aseprite/aseprite
- **Purpose/capabilities (upstream description):** Animated sprite editor & pixel art tool (Windows, macOS, Linux)
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop pixel-art authoring. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Aseprite EULA + component exceptions. Source available, not OSI open source; source personal-use/contribution restriction; no redistribution of editor under EULA.
- **License evidence:** https://github.com/aseprite/aseprite/blob/main/EULA.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-14T12:00:17Z; open issues=2025. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.3.18.6; published 2026-09-22T17:28:14Z; https://github.com/aseprite/aseprite/releases/tag/v1.3.18.6. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Licensed editor install; never distribute its restricted program.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Rejected for distribution; Low.
- **Compatibility, overlap, known constraints and decision:** Source-available editor, not assumed OSI open source; no assets copied.
- **Source README:** https://github.com/aseprite/aseprite/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > This program is distributed under three different licenses:
  > our [End-User License Agreement for Aseprite (EULA)](EULA.txt). Please check
  > are distributed under the MIT license
  > [educational license](https://www.aseprite.org/faq/#is-there-an-educational-license)
  > You can get more information about Aseprite license in the
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 38. KDE/krita

- **Official repository:** https://github.com/KDE/krita
- **Purpose/capabilities (upstream description):** Krita is a free and open source cross-platform application that offers an end-to-end solution for creating digital art files from scratch built on the KDE and Qt frameworks.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop raster art authoring. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** GPL-3.0 license file; per-file version review. Open source tool; commercial use under GPL terms; exported original assets distinct.
- **License evidence:** https://github.com/KDE/krita/blob/master/COPYING
- **Maintenance evidence:** archived=False; pushed=2026-10-14T03:11:12Z; open issues=0. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** No latest-release response; published unavailable; see retained endpoint error in evidence.json. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Editor install; original exports only.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; Low.
- **Compatibility, overlap, known constraints and decision:** Raster authoring offline; original exported art separately licensed.
- **Source README:** https://github.com/KDE/krita/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ##### Linux build with debug symbols in Qt and Krita
  > 2) Search for the latest `linux-debug-weekly` job
  > ##### Linux build with ASAN in Qt and Krita
  > 2) Search for the latest `linux-asan-weekly` job
  > ##### Windows build with ASAN in Qt and Krita
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 39. mapeditor/tiled

- **Official repository:** https://github.com/mapeditor/tiled
- **Purpose/capabilities (upstream description):** Flexible level editor
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop map authoring. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** GPL editor/plugins; BSD libtiled/tools. Open source; commercial use permitted under relevant component license; JSON output distinct.
- **License evidence:** https://github.com/mapeditor/tiled/blob/master/COPYING
- **Maintenance evidence:** archived=False; pushed=2026-10-12T13:46:52Z; open issues=840. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.12.2; published 2026-05-27T15:17:56Z; https://github.com/mapeditor/tiled/releases/tag/v1.12.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Qt-based editor; validated JSON/TMX import adapter.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; Low.
- **Compatibility, overlap, known constraints and decision:** JSON tile maps; future schema adapter with validation.
- **Source README:** https://github.com/mapeditor/tiled/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > RPGs, platformers or Breakout clones.
  > [itch.io](https://thorbjorn.itch.io/tiled). Most Linux distributions also
  > ### Signed Releases for macOS and Windows
  > macOS builds are signed by the maintainer, Thorbjørn Lindeijer, who registered
  > Windows installers are using free code signing provided by
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 40. deepnight/ldtk

- **Official repository:** https://github.com/deepnight/ldtk
- **Purpose/capabilities (upstream description):** Modern, lightweight and efficient 2D level editor
- **Language:** Haxe (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop level authoring. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/deepnight/ldtk/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T09:06:31Z; open issues=385. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.5.3; published 2024-01-15T15:18:29Z; https://github.com/deepnight/ldtk/releases/tag/v1.5.3. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Editor; validated level JSON import.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; Low.
- **Compatibility, overlap, known constraints and decision:** Level editor JSON; alternate to Tiled, no runtime nesting.
- **Source README:** https://github.com/deepnight/ldtk/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/deepnight/ldtk/test-windows.yml?label=LDtk%20build)](https://github.com/deepnight/ldtk/actions/workflows/test-windows.yml)
  > ## Installing required stuff
  > - Install required Haxe libs:
  > - Install Electron locally and other dependencies through NPM (**IMPORTANT**: you need to be in the `app` dir):
  > - these *dev* branches might be unstables, or even broken. Therefore, it's not recommended to use, unless you plan to add or fix something on LDtk.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 41. kcat/openal-soft

- **Official repository:** https://github.com/kcat/openal-soft
- **Purpose/capabilities (upstream description):** OpenAL Soft is a software implementation of the OpenAL 3D audio API.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native audio backends. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** LGPL / Library GPL 2 license text. Open source; commercial use subject to library redistribution/relinking obligations; check per-file version before linking.
- **License evidence:** https://github.com/kcat/openal-soft/blob/master/COPYING
- **Maintenance evidence:** archived=False; pushed=2026-10-13T08:46:40Z; open issues=294. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 1.25.2; published 2026-05-12T03:24:55Z; https://github.com/kcat/openal-soft/releases/tag/1.25.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C/C++ library build; platform audio driver and LGPL compliance.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Native spatial audio with LGPL distribution obligations.
- **Source README:** https://github.com/kcat/openal-soft/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > `master` branch CI status : [![GitHub Actions Status](https://github.com/kcat/openal-soft/actions/workflows/ci.yml/badge.svg)](https://github.com/kcat/openal-soft/actions) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kcat/openal-soft?branch=master&svg=true)](https://ci.appveyor.com/api/projects/status/github/kcat/openal-soft?branch=master&svg=true)
  > OpenAL Soft is an LGPL-licensed, cross-platform, software implementation of the OpenAL 3D audio API. It's forked from the open-sourced Windows version available originally from openal.org's SVN repository (now defunct).
  > The default HRTF dataset is derived from the [SADIE II database[(https://www.york.ac.uk/sadie-project/database.html), and is provided under the Apache 2.0 license (see LICENSE.Apache-2.0.txt).
  > ALSA were detected (if your target system uses them). For Windows, make sure
  > You can download and install openal-soft using the [vcpkg](https://github.com/Microsoft/vcpkg) dependency manager:
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 42. jarikomppa/soloud

- **Official repository:** https://github.com/jarikomppa/soloud
- **Purpose/capabilities (upstream description):** Free, easy, portable audio engine for games
- **Language:** C (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native and web audio targets. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Zlib core + third-party exceptions. Open source; commercial use; keep source notices and audit bundled codecs/backends.
- **License evidence:** https://github.com/jarikomppa/soloud/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2024-08-13T04:10:58Z; open issues=121. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** RELEASE_20200207; published 2020-02-07T21:03:51Z; https://github.com/jarikomppa/soloud/releases/tag/RELEASE_20200207. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++ or WASM build, chosen audio backend.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Medium.
- **Compatibility, overlap, known constraints and decision:** Native/WASM audio engine; Web Audio suffices now.
- **Source README:** https://github.com/jarikomppa/soloud/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Zlib/LibPng licensed. Portable. Easy.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 43. goldfire/howler.js

- **Official repository:** https://github.com/goldfire/howler.js
- **Purpose/capabilities (upstream description):** Javascript audio library for the modern web.
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop/mobile browser audio. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/goldfire/howler.js/blob/master/LICENSE.md
- **Maintenance evidence:** archived=False; pushed=2025-11-23T23:49:01Z; open issues=420. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v2.2.4; published 2023-09-19T15:00:30Z; https://github.com/goldfire/howler.js/releases/tag/v2.2.4. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** JS wrapper; browser Web Audio/HTML audio support.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Low.
- **Compatibility, overlap, known constraints and decision:** Browser audio wrapper; overlaps current procedural Web Audio needs.
- **Source README:** https://github.com/goldfire/howler.js/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [howler.js](https://howlerjs.com) is an audio library for the modern web. It defaults to [Web Audio API](http://webaudio.github.io/web-audio-api/) and falls back to [HTML5 Audio](https://html.spec.whatwg.org/multipage/embedded-content.html#the-audio-element). This makes working with audio in JavaScript easy and reliable across all platforms.
  > * No outside dependencies, just pure JavaScript
  > * [License](#license)
  > As a dependency:
  > const {Howl, Howler} = require('howler');
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 44. vitejs/vite

- **Official repository:** https://github.com/vitejs/vite
- **Purpose/capabilities (upstream description):** Next generation frontend tooling. It's fast!
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Node development hosts, static browser output. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/vitejs/vite/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T10:53:31Z; open issues=782. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v8.3.4; published 2026-10-08T12:03:54Z; https://github.com/vitejs/vite/releases/tag/v8.3.4. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Node 20.19+ or 22.12+ per registry; this project needs 22.17+ for test tooling.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Core; Low.
- **Compatibility, overlap, known constraints and decision:** Build/dev-only dependency; browser source remains engine-independent.
- **Source README:** https://github.com/vitejs/vite/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > - A build command that bundles your code with [Rolldown](https://rolldown.rs), pre-configured to output highly optimized static assets for production.
- **Issue/PR sample inspected:**
  - [refactor(plugin-legacy): use JSON import for core-js version](https://github.com/vitejs/vite/pull/23771)
  - [fix: preserve trailing file change events](https://github.com/vitejs/vite/pull/23767)
  - [Port check listens on 0.0.0.0 and :: even for a loopback host, bringing a Windows Firewall prompt](https://github.com/vitejs/vite/issues/23766)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 45. microsoft/playwright

- **Official repository:** https://github.com/microsoft/playwright
- **Purpose/capabilities (upstream description):** Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API.
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Node test hosts; Chromium/Firefox/WebKit drivers. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/microsoft/playwright/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T13:40:13Z; open issues=191. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.64.1; published 2026-10-14T11:51:33Z; https://github.com/microsoft/playwright/releases/tag/v1.64.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Node >=20 per registry; browser binaries/system libraries.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Core; Low.
- **Compatibility, overlap, known constraints and decision:** Browser integration tests; test-only browser tooling.
- **Source README:** https://github.com/microsoft/playwright/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > The [Playwright MCP server](https://github.com/microsoft/playwright-mcp) gives AI agents full browser control through the [Model Context Protocol](https://modelcontextprotocol.io). Agents interact with pages using structured accessibility snapshots — no vision models or screenshots required.
  > |          | Linux | macOS | Windows |
  > Headless and headed execution on all platforms. <sup>1</sup> Uses [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing) by default.
- **Issue/PR sample inspected:**
  - [test: add tests for user activation vs file input interception](https://github.com/microsoft/playwright/pull/43380)
  - [test: emulation overrides are preserved after COOP navigation](https://github.com/microsoft/playwright/pull/43379)
  - [test: setViewportSize with odd device pixel ratio should not stall in Firefox](https://github.com/microsoft/playwright/pull/43378)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 46. getsentry/sentry

- **Official repository:** https://github.com/getsentry/sentry
- **Purpose/capabilities (upstream description):** Developer-first error tracking and performance monitoring
- **Language:** Python (dominant repository language, verified metadata).
- **Platform family / candidate target:** Self-hosted server and client SDKs. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** FSL-1.1-ALv2 (current code). Source available with future Apache conversion; current code is not ordinary unrestricted Apache software.
- **License evidence:** https://github.com/getsentry/sentry/blob/master/LICENSE.md
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:31:00Z; open issues=2263. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 26.9.0; published 2026-09-15T17:19:59Z; https://github.com/getsentry/sentry/releases/tag/26.9.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Service stack, storage and operations; SDK license is not server license.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Rejected for slice; High.
- **Compatibility, overlap, known constraints and decision:** Service operational overhead and current license require review; no telemetry.
- **Source README:** https://github.com/getsentry/sentry/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Sentry is the debugging platform that helps every developer detect, trace, and fix issues. Code breaks, fix it faster.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 47. supabase/supabase

- **Official repository:** https://github.com/supabase/supabase
- **Purpose/capabilities (upstream description):** The Postgres development platform. Supabase gives you a dedicated Postgres database to build your web, mobile, and AI applications.
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Server services, web/native clients. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/supabase/supabase/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:27:43Z; open issues=1163. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.26.08; published 2026-08-07T13:57:57Z; https://github.com/supabase/supabase/releases/tag/v1.26.08. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Postgres/auth/storage services, hosting; per-component audit.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Optional module; High.
- **Compatibility, overlap, known constraints and decision:** Postgres service boundary; per-package terms and hosting not equivalent.
- **Source README:** https://github.com/supabase/supabase/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > [Supabase](https://supabase.com) is the Postgres development platform. We're building the features of Firebase using enterprise-grade open source tools.
  > Supabase is a combination of open source tools. We’re building the features of Firebase using enterprise-grade, open source products. If the tools and communities exist, with an MIT, Apache 2, or equivalent open license, we will use and support that tool. If the tool doesn't exist, we build and open source it ourselves. Supabase is not a 1-to-1 mapping of Firebase. Our aim is to give developers a Firebase-like developer experience using open source tools.
  > Supabase is a [hosted platform](https://supabase.com/dashboard). You can sign up and start using Supabase without installing anything.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 48. projectfluent/fluent.js

- **Official repository:** https://github.com/projectfluent/fluent.js
- **Purpose/capabilities (upstream description):** JavaScript implementation of Project Fluent
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** JavaScript localization. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/projectfluent/fluent.js/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-05-22T11:07:58Z; open issues=82. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** @fluent/dom@0.10.2; published 2025-07-18T13:08:06Z; https://github.com/projectfluent/fluent.js/releases/tag/%40fluent/dom%400.10.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Message catalogs, runtime adapters and localized layout testing.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Low.
- **Compatibility, overlap, known constraints and decision:** Localization grammar; catalog adapter planned.
- **Source README:** https://github.com/projectfluent/fluent.js/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Fluent.js is open-source, licensed under the Apache License, Version 2.0. We
  > Install the dependencies used by all packages, which are managed as
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 49. i18next/i18next

- **Official repository:** https://github.com/i18next/i18next
- **Purpose/capabilities (upstream description):**  i18next: learn once - translate everywhere
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** JavaScript localization. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/i18next/i18next/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:24:54Z; open issues=2. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v26.4.5; published 2026-10-14T14:24:58Z; https://github.com/i18next/i18next/releases/tag/v26.4.5. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Message catalog and optional framework/plugin adapters.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Adapter; Low.
- **Compatibility, overlap, known constraints and decision:** Alternate localization runtime; redundant with Fluent until requirements grow.
- **Source README:** https://github.com/i18next/i18next/blob/master/README.md
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 50. bytecodealliance/wasmtime

- **Official repository:** https://github.com/bytecodealliance/wasmtime
- **Purpose/capabilities (upstream description):** A lightweight WebAssembly runtime that is fast, secure, and standards-compliant
- **Language:** Rust (dominant repository language, verified metadata).
- **Platform family / candidate target:** Native WebAssembly hosts. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** Apache-2.0. Open source; commercial use allowed with license/notice obligations; explicit patent grant/termination applies.
- **License evidence:** https://github.com/bytecodealliance/wasmtime/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:30:56Z; open issues=858. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v49.0.2; published 2026-10-02T16:52:54Z; https://github.com/bytecodealliance/wasmtime/releases/tag/v49.0.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Runtime, WASI policies, resource limits; not a browser plugin loader.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Native WASM sandbox; browser content-only mods safer for slice.
- **Source README:** https://github.com/bytecodealliance/wasmtime/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > The Wasmtime CLI can be installed on Linux and macOS (locally) with a small install
  > Windows or otherwise interested users can download installers and
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 51. stackblitz-labs/bolt.diy

- **Official repository:** https://github.com/stackblitz-labs/bolt.diy
- **Purpose/capabilities (upstream description):** Prompt, run, edit, and deploy full-stack web applications using any LLM you want!
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Web developer tooling. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/stackblitz-labs/bolt.diy/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-13T21:38:47Z; open issues=16. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.0.1; published 2026-10-12T16:49:08Z; https://github.com/stackblitz-labs/bolt.diy/releases/tag/v1.0.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Node toolchain; model/API provider optional and separately licensed.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; Medium.
- **Compatibility, overlap, known constraints and decision:** AI-assisted project generation; provider/model terms separate; no untrusted execution.
- **Source README:** https://github.com/stackblitz-labs/bolt.diy/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > > **Pre-built Desktop Binaries**: Prefer a standalone app? Download binaries for Windows, macOS, and Linux from our [Latest Releases](https://github.com/stackblitz-labs/bolt.diy/releases/latest).
  > # Production build:
  > docker compose --profile production up
  > bolt.diy is also available as a cross-platform desktop application:
  > - **Cross-Platform & Deployments**: Native Electron desktop app, Expo (React Native) support, and direct deployment to Netlify, Vercel, and GitHub Pages.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 52. OpenHands/OpenHands

- **Official repository:** https://github.com/OpenHands/OpenHands
- **Purpose/capabilities (upstream description):** 🙌 OpenHands: AI-Driven Development
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Agentic development environment. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/OpenHands/OpenHands/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:23:13Z; open issues=987. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v1.27.1; published 2026-10-12T19:33:56Z; https://github.com/OpenHands/OpenHands/releases/tag/v1.27.1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Isolated execution, model provider, per-directory/service audit.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** External tool; High.
- **Compatibility, overlap, known constraints and decision:** Agentic coding tool; per-directory licensing and execution isolation need review.
- **Source README:** https://github.com/OpenHands/OpenHands/blob/main/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > code review and dependency updates, then have your personal agents running on your laptop.
  > - Docker: Docker Desktop on macOS/Windows, or Docker Engine/Docker Desktop on Linux.
  > **macOS / Linux:**
  > **Windows (PowerShell / Windows Terminal):** See [README.windows.md](./README.windows.md) for the equivalent commands.
  > **Prerequisites**: Node.js 24 or later, `uv`, and a running Docker Desktop (macOS) or Docker Engine/Desktop (Linux). The user starting Canvas must be able to run `docker` commands.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 53. microsoft/malmo

- **Official repository:** https://github.com/microsoft/malmo
- **Purpose/capabilities (upstream description):** Project Malmo is a platform for Artificial Intelligence experimentation and research built on top of Minecraft. We aim to inspire a new generation of research into challenging new problems presented by this unique environment. --- For installation instructions, scroll down to *Getting Started* below, or visit the project page for more information:
- **Language:** Java (dominant repository language, verified metadata).
- **Platform family / candidate target:** Minecraft-linked AI research environment. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/microsoft/malmo/blob/master/LICENSE.txt
- **Maintenance evidence:** archived=True; pushed=2025-09-03T13:10:21Z; open issues=171. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 0.37.0; published 2018-11-05T09:47:54Z; https://github.com/microsoft/malmo/releases/tag/0.37.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Game/runtime licenses, legacy dependencies; not a browser inference package.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; Very high.
- **Compatibility, overlap, known constraints and decision:** Minecraft AI experimentation; separate game licensing, legacy dependencies and maintenance constraints.
- **Source README:** https://github.com/microsoft/malmo/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > Project Malmö is a platform for Artificial Intelligence experimentation and research built on top of Minecraft. We aim to inspire a new generation of research into challenging new problems presented by this unique environment.
  > [![Join the chat at https://gitter.im/Microsoft/malmo](https://badges.gitter.im/Microsoft/malmo.svg)](https://gitter.im/Microsoft/malmo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/Microsoft/malmo.svg?branch=master)](https://travis-ci.org/Microsoft/malmo) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/Microsoft/malmo/blob/master/LICENSE.txt)
  > If you wish to use the "native" Malmo implementation, either install the "Malmo native Python wheel" (if available for your platform) or a pre-built binary release (more on these options below). Building Malmo yourself from source is always an option!
  > 1. No native code - you don't have to build or install platform dependent code.
  > On common Windows, MacOSX and Linux variants it is possible to use ```pip3 install malmo``` to install Malmo as a python with native code package: [Pip install for Malmo](https://github.com/Microsoft/malmo/blob/master/scripts/python-wheel/README.md). Once installed, the malmo Python module can be used to download source and examples and start up Minecraft with the Malmo game mod.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 54. Sparticuz/chromium

- **Official repository:** https://github.com/Sparticuz/chromium
- **Purpose/capabilities (upstream description):** Chromium for Serverless Platforms
- **Language:** TypeScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Linux headless test host only. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT wrapper; browser bundle separate. Open source wrapper; commercial use with notices; Chromium, fonts and NSS dependencies have separate licenses.
- **License evidence:** https://github.com/Sparticuz/chromium/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-07T08:15:26Z; open issues=25. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v153.0.0; published 2026-09-11T19:06:24Z; https://github.com/Sparticuz/chromium/releases/tag/v153.0.0. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Node 22.17+ or 24+; bundled browser, NSS libraries; no web deployment inclusion.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Core; Low.
- **Compatibility, overlap, known constraints and decision:** Registry-delivered Linux Chromium for tests only; bundled browser and font terms separate from wrapper MIT.
- **Source README:** https://github.com/Sparticuz/chromium/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ## Chromium for Serverless Platforms
  > The main difference, aside from the Chromium version, is the inclusion of some code from https://github.com/alixaxel/lambdafs, while removing it as a dependency. Due to changes in WebGL, the files in `bin/swiftshader.tar.br` must now be extracted to `/tmp` instead of `/tmp/swiftshader`. This required changes in lambdafs.
  > However, maintaining the package became difficult due to the rapid pace of `puppeteer` updates. `@sparticuz/chromium` is not tied to specific `puppeteer` versions and does not include the overrides and hooks found in the original package. It provides only Chromium, the code required to decompress the Brotli package, and a set of predefined arguments tailored for serverless environments.
  > # Puppeteer or Playwright is a production dependency
  > # @sparticuz/chromium can be a DEV dependency IF YOU ARE USING A LAYER. If you are not using a layer, use it as a production dependency!
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 55. CleverRaven/Cataclysm-DDA

- **Official repository:** https://github.com/CleverRaven/Cataclysm-DDA
- **Purpose/capabilities (upstream description):** Cataclysm - Dark Days Ahead. A turn-based survival game set in a post-apocalyptic world.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Linux, macOS, Windows, BSD recipes. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** CC-BY-SA-3.0 + component exceptions. Freely reusable/share-alike source and content, but CC is not a conventional software license; source/assets require separate careful compliance.
- **License evidence:** https://github.com/CleverRaven/Cataclysm-DDA/blob/master/LICENSE.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-14T14:31:53Z; open issues=1805. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 0.I-1; published 2026-09-20T10:46:58Z; https://github.com/CleverRaven/Cataclysm-DDA/releases/tag/0.I-1. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** C++ toolchain and assets; reference study only.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Survival roguelike reference; study mechanics, no game code or assets copied.
- **Source README:** https://github.com/CleverRaven/Cataclysm-DDA/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > **Releases** - [Stable](https://cataclysmdda.org/releases/) | [Experimental](https://cataclysmdda.org/experimental/)
  > Ncurses and tiles versions are available in the [community repos](https://www.archlinux.org/packages/?q=cataclysm-dda).
  > Please read [COMPILING.md](doc/c++/COMPILING.md) - it covers general information and more specific recipes for Linux, OS X, Windows and BSD. See [COMPILER_SUPPORT.md](doc/c++/COMPILER_SUPPORT.md) for details on which compilers we support. And you can always dig for more information in [doc/](https://github.com/CleverRaven/Cataclysm-DDA/tree/master/doc).
  > * Building on Windows with `MSYS2` at [COMPILING-MSYS.md](doc/c++/COMPILING-MSYS.md)
  > * Building on Windows with `vcpkg` at [COMPILING-VS-VCPKG.md](doc/c++/COMPILING-VS-VCPKG.md)
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 56. OpenTTD/OpenTTD

- **Official repository:** https://github.com/OpenTTD/OpenTTD
- **Purpose/capabilities (upstream description):** OpenTTD is an open source simulation game based upon Transport Tycoon Deluxe
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Linux, macOS, Windows supported. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** GPL-2.0 + component exceptions. Open source; commercial use under GPL; original proprietary TTD asset files are not supplied under GPL.
- **License evidence:** https://github.com/OpenTTD/OpenTTD/blob/master/COPYING.md
- **Maintenance evidence:** archived=False; pushed=2026-10-12T14:30:45Z; open issues=407. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 15.3; published 2026-04-04T19:56:48Z; https://github.com/OpenTTD/OpenTTD/releases/tag/15.3. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Native compiler, SDL/Cocoa/Win32 backends, separately licensed base assets.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Transport business simulation reference; GPL and base asset packs distinct.
- **Source README:** https://github.com/OpenTTD/OpenTTD/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > - 1.3) [Supported platforms](#13-supported-platforms)
  > OpenTTD is licensed under the GNU General Public License version 2.0, but includes some 3rd party software under different licenses.
  > OpenTTD is also available for free on [Steam](https://store.steampowered.com/app/1536610/OpenTTD/), [GOG.com](https://www.gog.com/game/openttd), and the [Microsoft Store](https://www.microsoft.com/p/openttd-official/9ncjg5rvrr1c). On some platforms OpenTTD will be available via your OS package manager or a similar service.
  > ## 1.3) Supported platforms
  > OpenTTD has been ported to several platforms and operating systems.
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 57. Anuken/Mindustry

- **Official repository:** https://github.com/Anuken/Mindustry
- **Purpose/capabilities (upstream description):** The automation tower defense RTS
- **Language:** Java (dominant repository language, verified metadata).
- **Platform family / candidate target:** Desktop and Android recipes. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** GPL-3.0. Open source; commercial use permitted subject to copyleft source/distribution obligations; assets separate.
- **License evidence:** https://github.com/Anuken/Mindustry/blob/master/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-11T23:29:51Z; open issues=41. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v160.7; published 2026-10-08T00:20:39Z; https://github.com/Anuken/Mindustry/releases/tag/v160.7. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Java/Gradle and Android SDK for Android; reference only.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Factory automation plus tower defense reference; validates genre hybrid precedent, no code copied.
- **Source README:** https://github.com/Anuken/Mindustry/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ### Linux/Mac OS
  > 1. Install the Android SDK [here.](https://developer.android.com/studio#command-tools) Make sure you're downloading the "Command line tools only", as Android Studio is not required.
  > 3. In the same directory run the command `sdkmanager --licenses` (or `./sdkmanager --licenses` if on linux/mac)
  > 6. Run `gradlew android:assembleDebug` (or `./gradlew` if on linux/mac). This will create an unsigned APK in `android/build/outputs/apk`.
  > If the terminal returns `Permission denied` or `Command not found` on Mac/Linux, run `chmod +x ./gradlew` before running `./gradlew`. *This is a one-time procedure.*
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 58. endless-sky/endless-sky

- **Official repository:** https://github.com/endless-sky/endless-sky
- **Purpose/capabilities (upstream description):** Space exploration, trading, and combat game.
- **Language:** C++ (dominant repository language, verified metadata).
- **Platform family / candidate target:** Linux, macOS, Windows documented. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** GPL-3.0. Open source; commercial use permitted subject to copyleft source/distribution obligations; assets separate.
- **License evidence:** https://github.com/endless-sky/endless-sky/blob/master/license.txt
- **Maintenance evidence:** archived=False; pushed=2026-10-13T16:16:50Z; open issues=929. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** v0.11.2; published 2026-06-27T20:37:33Z; https://github.com/endless-sky/endless-sky/releases/tag/v0.11.2. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Native toolchain/GPU runtime; per-asset copyright register.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Research candidate; High.
- **Compatibility, overlap, known constraints and decision:** Space exploration trading combat reference; engine GPL and assets individually licensed.
- **Source README:** https://github.com/endless-sky/endless-sky/blob/master/README.md
- **Selected upstream README evidence (quotes; context in evidence.json):**
  > ## System Requirements
  > Endless Sky has very minimal system requirements, meaning most systems should be able to run the game. The most restrictive requirement is likely that your device must support at least OpenGL 3.
  > |Linux | Any modern distribution (equivalent of Ubuntu 20.04) |
  > |MacOS | 10.15 |
  > |Windows | XP (5.1) |
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.

## 59. prettier/prettier

- **Official repository:** https://github.com/prettier/prettier
- **Purpose/capabilities (upstream description):** Prettier is an opinionated code formatter.
- **Language:** JavaScript (dominant repository language, verified metadata).
- **Platform family / candidate target:** Node developer hosts. Summary from upstream README and project positioning; exact version/export matrix is not certified here.
- **License / commercial permissions:** MIT. Open source; commercial use allowed with license/notice obligations.
- **License evidence:** https://github.com/prettier/prettier/blob/main/LICENSE
- **Maintenance evidence:** archived=False; pushed=2026-10-14T01:20:37Z; open issues=1442. Push activity is not a maintenance guarantee.
- **Latest GitHub release response:** 3.9.10; published 2026-10-10T08:36:47Z; https://github.com/prettier/prettier/releases/tag/3.9.10. GitHub latest-release endpoint can differ from registry versions and nightly channels.
- **Integration prerequisites (planning estimate):** Node >=14 per registry; development-only formatting.
- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.
- **Disposition / difficulty:** Core; Low.
- **Compatibility, overlap, known constraints and decision:** Development-only source formatter; deterministic style checks, not shipped runtime.
- **Source README:** https://github.com/prettier/prettier/blob/main/README.md
- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.
