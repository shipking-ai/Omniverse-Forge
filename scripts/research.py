"""Read-only official GitHub evidence collection. Never executes candidate code."""
import concurrent.futures, subprocess, json, base64, datetime, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
# repo | category | disposition | architecture assessment (not upstream guarantees)
rows='''godotengine/godot|Engine|Optional module|Full native 2D/3D editor; separate export and shared JSON saves, not embedded; high port cost
bevyengine/bevy|Engine|Research candidate|Rust ECS renderer; WASM viable but compiler/toolchain cost exceeds slice
 o3de/o3de|Engine|Rejected for slice|Large native 3D stack; high hardware and build cost
 defold/defold|Engine|Research candidate|Compact Lua engine; custom license needs separate legal review
4ian/GDevelop|Engine|External tool|Visual authoring; export boundary rather than nested engine
libsdl-org/SDL|Engine|Optional module|Native input/window/audio layer; C toolchain and separate runtime
raysan5/raylib|Engine|Optional module|Small C rendering API; native/WASM alternative; requires port
MonoGame/MonoGame|Engine|Optional module|C sharp game framework; separate managed runtime and asset pipeline
libgdx/libgdx|Engine|Optional module|Java framework; JVM/HTML backend separate from JS shell
cocos2d/cocos2d-x|Engine|Rejected for slice|C++ 2D engine overlaps lightweight web slice; maintenance must be checked
BabylonJS/Babylon.js|Rendering|Adapter|Web 3D engine; promising future 3D mode behind canvas lifecycle
mrdoob/three.js|Rendering|Adapter|WebGL/WebGPU renderer; lighter future 3D boundary; gameplay supplied separately
playcanvas/engine|Engine|Adapter|Web 3D engine; distinguish open engine from hosted editor service
phaserjs/phaser|Engine|Research candidate|Strong browser 2D framework; overlaps small custom simulation and renderer
pixijs/pixijs|Rendering|Adapter|GPU 2D renderer if Canvas2D profiling justifies replacement
pmndrs/react-three-fiber|Integration|Research candidate|Verified existing React/Three integration; unnecessary React dependency here
dimforge/rapier|Physics|Adapter|Rust/WASM rigid body physics; optional worker with own collision authority
liabru/matter-js|Physics|Adapter|JS 2D rigid bodies; not needed for circles and tile collisions
jrouwe/JoltPhysics|Physics|Optional module|Native rigid bodies; WASM binding review needed
NVIDIA-Omniverse/PhysX|Physics|Research candidate|Native physics; GPU and platform constraints require validation
NVIDIAGameWorks/NvCloth|Physics|Research candidate|Specialized cloth simulation; native-only integration review
recastnavigation/recastnavigation|AI|Adapter|Navmesh pipeline; future 3D navigation not needed for current grid
BehaviorTree/BehaviorTree.CPP|AI|Optional module|Native behavior trees through service or native module, not JS embedding
ggerganov/llama.cpp|AI|Research candidate|Local model inference; model weights separately licensed and memory-heavy
ml-explore/mlx|AI|Research candidate|Apple-focused ML research tooling; not portable browser baseline
colyseus/colyseus|Networking|Optional module|Existing authoritative JS rooms; server cost and reconciliation required
heroiclabs/nakama|Online services|Optional module|Auth/persistence/matchmaking backend; database and operations boundary
networkprotocol/netcode|Networking|Research candidate|Encrypted UDP protocol; no direct browser UDP support
pond3r/ggpo|Networking|Research candidate|Rollback SDK; deterministic simulation and native binding required
Luanti-org/luanti|World generation|Optional module|Voxel game platform; exchange assets/maps not engine embedding
Auburn/FastNoiseLite|World generation|Adapter|Portable noise library; not required for small seeded maps
SanderMertens/flecs|Gameplay|Research candidate|ECS runtime C/C++; unnecessary native bridge for slice
skypjack/entt|Gameplay|Research candidate|C++ ECS; overlaps mode-owned JS state
yarnspinnerTool/YarnSpinner|Narrative|Adapter|Dialogue tooling/runtime; format import or native module
inkle/ink|Narrative|Adapter|Narrative authoring; JS runtime is separate inkjs package, verify before integration
blender/blender|Art|External tool|glTF creation offline; tool GPL distinct from original exported assets
aseprite/aseprite|Art|Rejected for distribution|Source-available editor, not assumed OSI open source; no assets copied
KDE/krita|Art|External tool|Raster authoring offline; original exported art separately licensed
mapeditor/tiled|Content pipeline|External tool|JSON tile maps; future schema adapter with validation
deepnight/ldtk|Content pipeline|External tool|Level editor JSON; alternate to Tiled, no runtime nesting
kcat/openal-soft|Audio|Optional module|Native spatial audio with LGPL distribution obligations
jarikomppa/soloud|Audio|Adapter|Native/WASM audio engine; Web Audio suffices now
goldfire/howler.js|Audio|Adapter|Browser audio wrapper; overlaps current procedural Web Audio needs
vitejs/vite|Developer tooling|Core|Build/dev-only dependency; browser source remains engine-independent
microsoft/playwright|QA|Core|Browser integration tests; test-only browser tooling
getsentry/sentry|Operations|Rejected for slice|Service operational overhead and current license require review; no telemetry
supabase/supabase|Online services|Optional module|Postgres service boundary; per-package terms and hosting not equivalent
projectfluent/fluent.js|Localization|Adapter|Localization grammar; catalog adapter planned
i18next/i18next|Localization|Adapter|Alternate localization runtime; redundant with Fluent until requirements grow
bytecodealliance/wasmtime|Modding|Research candidate|Native WASM sandbox; browser content-only mods safer for slice
stackblitz-labs/bolt.diy|Emerging tools|External tool|AI-assisted project generation; provider/model terms separate; no untrusted execution
OpenHands/OpenHands|Emerging tools|External tool|Agentic coding tool; per-directory licensing and execution isolation need review
microsoft/malmo|Scientific simulation|Research candidate|Minecraft AI experimentation; separate game licensing, legacy dependencies and maintenance constraints
Sparticuz/chromium|QA|Core|Registry-delivered Linux Chromium for tests only; bundled browser and font terms separate from wrapper MIT
CleverRaven/Cataclysm-DDA|Reference game|Research candidate|Survival roguelike reference; study mechanics, no game code or assets copied
OpenTTD/OpenTTD|Reference game|Research candidate|Transport business simulation reference; GPL and base asset packs distinct
Anuken/Mindustry|Reference game|Research candidate|Factory automation plus tower defense reference; validates genre hybrid precedent, no code copied
endless-sky/endless-sky|Reference game|Research candidate|Space exploration trading combat reference; engine GPL and assets individually licensed
prettier/prettier|Developer tooling|Core|Development-only source formatter; deterministic style checks, not shipped runtime'''
items=[]
for row in rows.splitlines():
 r,c,d,a=row.strip().split('|'); items.append(dict(repo=r,category=c,classification=d,assessment=a))
def api(p):
 p=subprocess.run(['gh','api',p],capture_output=True,text=True,timeout=35)
 if p.returncode: return {'error':p.stderr.strip()[:400]}
 try:return json.loads(p.stdout)
 except:return {'error':'Invalid JSON'}
def textobj(o):
 if 'error' in o:return o
 try:t=base64.b64decode(o.get('content','')).decode('utf-8','replace')
 except:t=''
 return {'url':o.get('html_url'),'path':o.get('path'),'sha':o.get('sha'),'text':t[:16000]}
def inspect(item):
 r=item['repo']; m=api('repos/'+r)
 item['metadata']={k:m.get(k) for k in ['full_name','html_url','description','language','license','archived','disabled','pushed_at','updated_at','open_issues_count','default_branch']}
 if 'error' in m:item['error']=m['error'];return item
 item['readme']=textobj(api('repos/'+r+'/readme'))
 item['license_file']=textobj(api('repos/'+r+'/license'))
 rel=api('repos/'+r+'/releases/latest')
 item['latest_release']={k:rel.get(k) for k in ['tag_name','published_at','html_url','prerelease','body']} if 'error' not in rel else rel
 if r in ['godotengine/godot','BabylonJS/Babylon.js','mrdoob/three.js','phaserjs/phaser','vitejs/vite','microsoft/playwright']:
  issues=api('repos/'+r+'/issues?state=open&per_page=3')
  item['issue_sample']=[{k:i.get(k) for k in ['title','html_url','created_at']} for i in issues] if isinstance(issues,list) else issues
 print(r, item['metadata']['license'],flush=True)
 return item
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(inspect,items))
output={'collected_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'Official GitHub REST metadata, README, license endpoint, latest release; six candidate issue samples. Truncation 16000 characters per README/license. No candidate code executed.','projects':results}
(ROOT/'docs/research/evidence.json').write_text(json.dumps(output,indent=2))
print('Recorded',len(results),'candidates;',sum('error' not in r for r in results),'successful repository inspections',flush=True)
