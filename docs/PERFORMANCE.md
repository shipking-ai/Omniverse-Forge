# Measured performance report

Measured **2026-10-14T14:56:30.329Z** with the actual implementation. Raw data and artifact byte counts: [performance.json](research/performance.json). Reproduce with `npm run build`, a running `npm run dev`, and `npm run benchmark`.

## Environment and methodology

- Node v22.22.3; linux/x64.
- CPU reported by host: Intel(R) Xeon(R) Processor @ 2.60GHz; 2 logical CPUs; approximately 3.85 GiB host memory. Shared-sandbox allocations/load are not guaranteed.
- Chromium 153.0.8010.0, headless Linux, 1440×1000 viewport; logical Canvas 1000×620.
- Each action simulation: 100 standard-difficulty seeds, normal movement/combat/construction controllers, fixed 1/60-second simulation steps. No rendering during the Node benchmark.
- Each renderer: 300 synchronous Canvas command-submission samples on a detached canvas, then 180 live requestAnimationFrame intervals. These are not GPU-completion, input-to-photon or perceptual smoothness measurements.
- Browser heap values are exposed by a coarse/bucketed browser API; they are **not** a trustworthy precise memory measurement. No memory-leak/soak claim is made.

## Simulation results

| Mode | Completed seeded expeditions | Simulated steps | Wall-clock time | Mean per-step time |
|---|---:|---:|---:|---:|
| rift | 100 / 100 | 157,752 | 1233.8 ms | 7.82 µs |
| frontier | 100 / 100 | 223,348 | 1226.7 ms | 5.49 µs |

These 200 scenario runs are additional benchmark evidence, not 200 separately declared test cases. Controller knowledge makes them skilled/repeatable play, not representative human completion times.

## Rendering and live frame pacing

| Mode | Mean Canvas submission | p95 submission | Median live frame interval | p95 live frame interval |
|---|---:|---:|---:|---:|
| rift | 1.89 ms | 0.50 ms | 16.70 ms | 16.80 ms |
| bastion | 2.78 ms | 1.10 ms | 16.70 ms | 16.80 ms |
| signal | 2.42 ms | 0.20 ms | 16.70 ms | 16.70 ms |
| frontier | 2.48 ms | 0.40 ms | 16.70 ms | 16.70 ms |

A roughly 16.7 ms median interval is consistent with a 60 Hz animation callback on this host; it is **not** a guaranteed 60 FPS on user hardware. Means can exceed p95 submission costs because a small tail of expensive samples dominates the average. JIT, queue flushing and scheduling are possible causes, not profiled conclusions. The detached-canvas loop is a microbenchmark, not a maximum-load gameplay benchmark. No unsupported GPU fidelity/scalability conclusions are drawn.

## Artifact size

- Complete uncompressed `dist/`: **178,059 bytes** (173.9 KiB), including original illustrations and license notices.
- JavaScript gzip: **23,934 bytes** (23.4 KiB).
- CSS gzip: **8,078 bytes** (7.9 KiB).
- Gzip was measured with Node zlib. Actual transfer size depends on hosting compression, caching and headers. Not all art must load at first paint; cards use lazy image loading.
- No third-party game-runtime package, remote font, audio file, model weight or native SDK download. Vite's generated module-preload helper remains in the compiled bundle with its MIT notice preserved.
- 4 direct build/test/format packages; 39 installed package entries including transitives on this host. These are **not** part of the runtime download.

## Current bounds and trade-offs

Fixed world size (1800×1200), four cover rectangles, a 5×5 puzzle, a 9×7 tactical grid, 2–5 configurable waves, at most eight turrets, projectile lifetimes and finite entity arrays keep work bounded. Navigation uses a 30×20 grid and recalculates on a timer. The architecture intentionally has no unbounded chunk streaming, global ECS scans across a universe, or arbitrary untrusted scripts.

The full artifact is small and the measured default workloads are inexpensive. Still unmeasured: large maps, many agents, long-session heap growth, real mobile thermals, screen-reader interaction, network latency, shader/GPU workloads, 3D and native engines. The 59 researched repositories were not benchmarked merely because their metadata was inspected.
