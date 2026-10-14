import json,re,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
e=json.loads((root/'docs/research/evidence.json').read_text());sup=json.loads((root/'docs/research/supplemental-licenses.json').read_text())['files']
overrides={
'bevyengine/bevy':('MIT OR Apache-2.0','Open source; commercial use with notices; crate and example-asset exceptions'),
'o3de/o3de':('Apache-2.0 OR MIT','Open source; commercial use with notices; third-party copyleft components separate'),
'defold/defold':('Defold License 1.0 (custom)','Source available / not unrestricted open source: section 4(a) bars commercializing the engine as a Game Engine Product; game use distinct'),
'4ian/GDevelop':('MIT for engine/editor/extensions','Open source core; commercial use with notices; trademarks and hosted services separate'),
'MonoGame/MonoGame':('Ms-PL','Open source; commercial use; source redistribution must retain Ms-PL; patent and trademark clauses'),
'cocos2d/cocos2d-x':('MIT (main engine)','Open source core; commercial use with notices; separate dependency/artwork licenses'),
'NVIDIAGameWorks/NvCloth':('NVIDIA Source Code License (1-Way Commercial)','Custom source license; redistribution and patent-termination clauses; OSI status not established in this review'),
'Luanti-org/luanti':('LGPL-2.1-or-later code; multiple asset licenses','Open source code; commercial use subject to LGPL obligations; distributed textures/sounds include CC-BY-SA, CC-BY, Apache'),
'SanderMertens/flecs':('MIT','Open source; commercial use with notices; upstream multi-author copyright retained'),
'blender/blender':('GPL family; per-file terms','Open source tool; commercial use allowed, distributing modified program invokes GPL; exported original art is distinct'),
'aseprite/aseprite':('Aseprite EULA + component exceptions','Source available, not OSI open source; source personal-use/contribution restriction; no redistribution of editor under EULA'),
'KDE/krita':('GPL-3.0 license file; per-file version review','Open source tool; commercial use under GPL terms; exported original assets distinct'),
'mapeditor/tiled':('GPL editor/plugins; BSD libtiled/tools','Open source; commercial use permitted under relevant component license; JSON output distinct'),
'kcat/openal-soft':('LGPL / Library GPL 2 license text','Open source; commercial use subject to library redistribution/relinking obligations; check per-file version before linking'),
'jarikomppa/soloud':('Zlib core + third-party exceptions','Open source; commercial use; keep source notices and audit bundled codecs/backends'),
'getsentry/sentry':('FSL-1.1-ALv2 (current code)','Source available with future Apache conversion; current code is not ordinary unrestricted Apache software'),
'CleverRaven/Cataclysm-DDA':('CC-BY-SA-3.0 + component exceptions','Freely reusable/share-alike source and content, but CC is not a conventional software license; source/assets require separate careful compliance'),
'OpenTTD/OpenTTD':('GPL-2.0 + component exceptions','Open source; commercial use under GPL; original proprietary TTD asset files are not supplied under GPL'),
'Sparticuz/chromium':('MIT wrapper; browser bundle separate','Open source wrapper; commercial use with notices; Chromium, fonts and NSS dependencies have separate licenses')}
# Integration planning requirements, not a claim these stacks were built or certified here.
plans='''godotengine/godot|Desktop, mobile, web exports|Editor/export templates; C++ build only if modifying engine|High
bevyengine/bevy|Native desktop, WASM web targets|Rust/Cargo, graphics backend and WASM toolchain|High
o3de/o3de|Native desktop 3D stack|CMake, C++ toolchain, large 3P cache and GPU-capable workstation|Very high
defold/defold|Desktop, mobile, HTML5 exports|Defold editor and build pipeline, Lua authoring|High
4ian/GDevelop|Web, desktop/mobile exports|Editor/runtime export pipeline; optional service terms separate|Medium
libsdl-org/SDL|Cross-platform native/windowing targets|C toolchain, platform window/input/audio backends|High
raysan5/raylib|Desktop, web/native target families|C compiler; Emscripten for browser builds|Medium
MonoGame/MonoGame|Desktop/mobile managed game targets|.NET SDK, platform packages, content builder|High
libgdx/libgdx|Desktop, Android, iOS/HTML backends|JDK/Gradle; backend-specific transpilation/native tools|High
cocos2d/cocos2d-x|Desktop and mobile C++ targets|CMake, native SDKs; dated branch dependency audit|High
BabylonJS/Babylon.js|WebGL/WebGPU-capable browsers|JS package; GPU renderer, glTF assets and lifecycle adapter|Medium
mrdoob/three.js|WebGL/WebGPU-capable browsers|JS package; camera, renderer, GLTFLoader; gameplay supplied separately|Medium
playcanvas/engine|Modern web browsers|JS engine; asset pipeline; hosted editor services distinct|Medium
phaserjs/phaser|Desktop/mobile browsers, third-party wrappers|JS/TS runtime package; Canvas/WebGL backend|Medium
pixijs/pixijs|Modern web browsers|JS/TS runtime, graphics backend and asset loader|Medium
pmndrs/react-three-fiber|React web/native renderer targets|React, Three.js and compatible peer versions|High
dimforge/rapier|Rust native and WASM bindings|Rust toolchain or separately verified JS/WASM package|Medium
liabru/matter-js|JavaScript browser/native JS hosts|JS module; fixed-step body synchronization|Low
jrouwe/JoltPhysics|Native 3D physics targets|C++/CMake; separate JS binding for web|High
NVIDIA-Omniverse/PhysX|Native simulation targets; optional GPU paths|Native toolchain; GPU/platform-specific features not assumed universal|High
NVIDIAGameWorks/NvCloth|Native cloth simulation|C++ SDK/backends; hardware and license review required|High
recastnavigation/recastnavigation|Portable native navigation libraries|C++ build, navmesh generation; separate WASM binding for web|Medium
BehaviorTree/BehaviorTree.CPP|Native AI/robotics applications|C++ build; optional tooling/network packages|High
ggerganov/llama.cpp|Native inference with several compute backends|Compiler, model file, backend libraries; RAM/VRAM depends on model|High
ml-explore/mlx|Apple-oriented ML stack|Supported Apple/MLX environment; portability beyond README not verified|High
colyseus/colyseus|JS clients and Node server|Authoritative server, room lifecycle, transport and persistence choices|Medium
heroiclabs/nakama|Server with platform clients|Server process, database, client SDK, hosting/operations|High
networkprotocol/netcode|Native UDP clients/servers|Native build, crypto dependency, sockets; browser gateway needed|High
pond3r/ggpo|Native rollback integration|Native SDK, deterministic snapshots and input synchronization|High
Luanti-org/luanti|Windows, Linux, macOS native documented|Native engine, Lua game/mod content; separate application export|High
Auburn/FastNoiseLite|Multiple native and managed language ports|Select one language port; original seeded generator adequate now|Low
SanderMertens/flecs|Native ECS targets|C/C++ compilation, JS binding if used in browser|High
skypjack/entt|C++ applications|C++ headers/toolchain; no JS runtime integration supplied|High
yarnspinnerTool/YarnSpinner|Narrative authoring / managed runtimes|Compiler and runtime integration; engine adapter choice|Medium
inkle/ink|Narrative authoring / runtime ports|Ink compiler; separate inkjs verification for web runtime|Medium
blender/blender|Desktop content creation|Blender install; GPU/RAM scaled to scene; export glTF, no tool embedding|Low
aseprite/aseprite|Desktop pixel-art authoring|Licensed editor install; never distribute its restricted program|Low
KDE/krita|Desktop raster art authoring|Editor install; original exports only|Low
mapeditor/tiled|Desktop map authoring|Qt-based editor; validated JSON/TMX import adapter|Low
deepnight/ldtk|Desktop level authoring|Editor; validated level JSON import|Low
kcat/openal-soft|Native audio backends|C/C++ library build; platform audio driver and LGPL compliance|High
jarikomppa/soloud|Native and web audio targets|C++ or WASM build, chosen audio backend|Medium
goldfire/howler.js|Desktop/mobile browser audio|JS wrapper; browser Web Audio/HTML audio support|Low
vitejs/vite|Node development hosts, static browser output|Node 20.19+ or 22.12+ per registry; this project needs 22.17+ for test tooling|Low
microsoft/playwright|Node test hosts; Chromium/Firefox/WebKit drivers|Node >=20 per registry; browser binaries/system libraries|Low
getsentry/sentry|Self-hosted server and client SDKs|Service stack, storage and operations; SDK license is not server license|High
supabase/supabase|Server services, web/native clients|Postgres/auth/storage services, hosting; per-component audit|High
projectfluent/fluent.js|JavaScript localization|Message catalogs, runtime adapters and localized layout testing|Low
i18next/i18next|JavaScript localization|Message catalog and optional framework/plugin adapters|Low
bytecodealliance/wasmtime|Native WebAssembly hosts|Runtime, WASI policies, resource limits; not a browser plugin loader|High
stackblitz-labs/bolt.diy|Web developer tooling|Node toolchain; model/API provider optional and separately licensed|Medium
OpenHands/OpenHands|Agentic development environment|Isolated execution, model provider, per-directory/service audit|High
microsoft/malmo|Minecraft-linked AI research environment|Game/runtime licenses, legacy dependencies; not a browser inference package|Very high
Sparticuz/chromium|Linux headless test host only|Node 22.17+ or 24+; bundled browser, NSS libraries; no web deployment inclusion|Low
CleverRaven/Cataclysm-DDA|Linux, macOS, Windows, BSD recipes|C++ toolchain and assets; reference study only|High
OpenTTD/OpenTTD|Linux, macOS, Windows supported|Native compiler, SDL/Cocoa/Win32 backends, separately licensed base assets|High
Anuken/Mindustry|Desktop and Android recipes|Java/Gradle and Android SDK for Android; reference only|High
endless-sky/endless-sky|Linux, macOS, Windows documented|Native toolchain/GPU runtime; per-asset copyright register|High
prettier/prettier|Node developer hosts|Node >=14 per registry; development-only formatting|Low'''
plan={}
for row in plans.splitlines():
 r,p,d,c=row.split('|');plan[r]=(p,d,c)
def license_info(p):
 r=p['repo']
 if r in overrides:return overrides[r]
 spdx=(p['metadata'].get('license')or{}).get('spdx_id','Unresolved')
 if spdx in ['MIT','Apache-2.0','BSD-3-Clause','Zlib']:
  return spdx,'Open source; commercial use allowed with license/notice obligations'+('; explicit patent grant/termination applies' if spdx=='Apache-2.0' else '')
 if spdx.startswith('GPL'):return spdx,'Open source; commercial use permitted subject to copyleft source/distribution obligations; assets separate'
 return spdx,'Unresolved: inspect component and per-file terms before integration; not shipped'
def safe(t):return str(t or 'Not exposed by API').replace('|','/').replace('\n',' ')
headers=['# Open-source capability and integration matrix','',f"Evidence collected: **{e['collected_at']}**. **{len(e['projects'])} unique repositories** have successful metadata inspections, README and license/release queries. Endpoint errors and truncated responses are preserved, not treated as proof of absence.",'','**Reading this matrix:** “Core” means directly used development tooling, not a runtime engine. Adapter/optional/external classifications describe proposed boundaries, not completed integrations. Cost is a project-specific engineering estimate, not a benchmark. Dominant language is GitHub metadata, not a complete language inventory. Detailed platform/dependency notes and unknowns follow in the ledger.','', '| Project / official repository | Category / capability | Dominant language | License assessment | Last push / latest GitHub release | Disposition / estimated cost |', '|---|---|---|---|---|---|']
ledger=['# Research ledger — per-project evidence and decisions','',f"Snapshot: {e['collected_at']}. Reproduce with `python scripts/research.py` then `python scripts/supplement-research.py` and `python scripts/research-report.py`.",'','Verification depth: fetched official repository metadata, README text (up to 16,000 characters), root detected license text (up to 16,000), and latest GitHub release record. Six shortlisted repositories also have a three-item open issue sample; GitHub’s issues endpoint can include pull requests. These samples are not a security audit. Five nonstandard license paths were fetched separately. Repository dependency graphs and every individual source file were **not** audited. No upstream build/install scripts were executed.','']
for n,p in enumerate(e['projects'],1):
 r=p['repo'];m=p['metadata'];lic,perm=license_info(p);platform,deps,cost=plan[r];release=p.get('latest_release',{});tag=release.get('tag_name') or 'No latest-release response';date=(m.get('pushed_at')or'unknown')[:10];url=m.get('html_url') or 'https://github.com/'+r
 # Maintenance signals are observations; never infer support/SLA from activity alone.
 headers.append(f"| [{r}]({url}) | {p['category']}: {safe(m.get('description'))[:145]} | {m.get('language')} | {safe(lic)} | {date} / {safe(tag)} | {p['classification']} / {cost} |")
 source=p.get('readme',{}).get('url') or url+'/blob/'+(m.get('default_branch')or'main')+'/README.md';licenseurl=p.get('license_file',{}).get('url')
 supplement=next((x for x in sup if x.get('repo')==r),None)
 if supplement:licenseurl=supplement['url']
 ledger += [f"## {n:02d}. {r}",'',f"- **Official repository:** {url}",f"- **Purpose/capabilities (upstream description):** {m.get('description')}",f"- **Language:** {m.get('language')} (dominant repository language, verified metadata).",f"- **Platform family / candidate target:** {platform}. Summary from upstream README and project positioning; exact version/export matrix is not certified here.",f"- **License / commercial permissions:** {lic}. {perm}.",f"- **License evidence:** {licenseurl or 'Root license endpoint did not resolve; treat terms as unresolved until further review.'}",f"- **Maintenance evidence:** archived={m.get('archived')}; pushed={m.get('pushed_at')}; open issues={m.get('open_issues_count')}. Push activity is not a maintenance guarantee.",f"- **Latest GitHub release response:** {tag}; published {release.get('published_at','unavailable')}; {release.get('html_url','see retained endpoint error in evidence.json')}. GitHub latest-release endpoint can differ from registry versions and nightly channels.",f"- **Integration prerequisites (planning estimate):** {deps}.",f"- **Hardware:** not installed/benchmarked as an upstream runtime; numeric CPU/RAM/GPU minimum unresolved. Only local browser/tooling is empirically measured in PERFORMANCE.md.",f"- **Disposition / difficulty:** {p['classification']}; {cost}.",f"- **Compatibility, overlap, known constraints and decision:** {p['assessment']}.",f"- **Source README:** {source}"]
 snippets=[line.strip() for line in p.get('readme',{}).get('text','').splitlines() if re.search(r'platform|Windows|Linux|macOS|license|dependenc|require|experimental|production|unstable',line,re.I) and len(line.strip())>15]
 if snippets:ledger += ['- **Selected upstream README evidence (quotes; context in evidence.json):**']+['  > '+line[:500] for line in snippets[:5]]
 if p.get('issue_sample'):ledger+=['- **Issue/PR sample inspected:**']+[f"  - [{i['title']}]({i['html_url']})" for i in p['issue_sample'] if isinstance(i,dict)]
 ledger += ['- **Unresolved before adoption:** exact transitive dependency/asset license closure, supported-version compatibility, current vulnerabilities, platform-specific hardware limits, and workload performance. Not shipped unless identified as current tooling.','']
(root/'docs/TECHNOLOGY_MATRIX.md').write_text('\n'.join(headers)+'\n\nSee [per-project ledger](research/LEDGER.md), [raw evidence](research/evidence.json), [supplementary license evidence](research/supplemental-licenses.json), and [license register](LICENSE_REGISTER.md).\n')
(root/'docs/research/LEDGER.md').write_text('\n'.join(line.rstrip() for line in ledger).rstrip()+'\n')
