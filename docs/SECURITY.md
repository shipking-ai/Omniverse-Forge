# Security and trust boundaries

## What ships

A static, client-only game. No account service, telemetry, analytics, credentials, cloud saves, multiplayer transport, remote model, or remote content loader. No secrets are requested or stored. Browser-facing URLs are same-origin relative paths. Vite accepts only its defaults and the `.e2b.app` preview suffix, not arbitrary external hosts.

## Implemented controls

- Settings, rules and saves use explicit field whitelists and numeric bounds.
- Raw local saves larger than 500 KB and ruleset files larger than 8 KB are rejected.
- Only four known mode IDs and supported schema versions can resume.
- Mode validators bound nested arrays/numbers and reject malformed projectile/path/grid state.
- Action input key names match a restricted allowlist; duplicates and reserved menu keys are rejected.
- Imported rulesets are parsed JSON, not JavaScript; unknown fields cannot execute code.
- User-derived displayed values pass textContent or HTML escaping. No user HTML is rendered.
- No `eval`, script URL imports, plugin network fetching, shell execution or file extraction is exposed to players.
- Background/blur auto-pause, bounded fixed-step updates, limited turrets and wave count prevent runaway catch-up work.
- Storage getters, reads/writes, malformed JSON, quota and audio-unavailable conditions have safe fallbacks.
- One audio context, ended oscillators disconnected; one animation loop for all modes.
- Browser diagnostic snapshots exist only behind `import.meta.env.DEV`; production tree-shaking removes them. They are read-only clones, not a game-state mutation API.
- Test-browser launch configuration uses only an explicit non-secret environment allowlist; it does not spread runner credentials into JSON reports. A regression test and `npm run check:secrets` guard this boundary.
- Locked packages, `npm ci --ignore-scripts`, npm audit, SBOM, license notices, reproducible build/tests.

## Supply-chain execution

Research fetches public metadata/documentation only. No candidate repository was cloned and executed. Direct npm package metadata and the Chromium wrapper's script metadata were inspected; lifecycle scripts were disabled. Native binaries inside selected packages are still trusted upstream build artifacts, not source-audited proofs.

The Linux test helper decompresses only the pinned browser package's bundled archive, with `tar` arguments supplied as an argument array. This is **not** a general player-provided archive importer. Its browser uses `--no-sandbox` only in the isolated automated-test environment to satisfy container constraints. It does not disable web security. Never use that helper as a general untrusted browsing service or production browser host.

## Audit result

The executed `npm audit --json` report is retained in `research/npm-audit.json`. At the final recorded run it reports **0 known vulnerabilities**. This means no registry advisories were reported for the audited package graph at that time. It does **not** establish zero security defects, scan Chromium's full binary, validate every research candidate, or replace security testing.

## Residual risks / limitations

- localStorage is unencrypted, origin-scoped and editable. Cosmetic scores are untrusted, can be lost, and must not be used as server authority.
- Content remains a local trusted-code platform; arbitrary executable community mods are **not supported**, not “secure because WASM.”
- Research license/maintenance checks are not dependency security audits.
- No authentication, authorization, DDoS mitigation, abuse prevention, anti-cheat, multiplayer reconciliation or server input validation is implemented, because there is no server.
- No arbitrary asset URL/image/model import; expanding that boundary requires MIME/path checks, decompression limits, CORS strategy and resource quotas.
- Full screen-reader play, gamepad, reduced cognitive-load research and accessibility certification are not complete.
- Developer preview is not a hardened public production service. Serve only `dist/` in production.

## Recommended production hosting headers

A static host should set MIME types, `X-Content-Type-Options: nosniff`, HTTPS, a suitable Permissions-Policy and a tested CSP. Current original images and modules can use same-origin sources. The app uses dynamic inline style values, so a strict no-inline-style CSP requires refactoring or a deliberate style policy; do not paste a policy that silently breaks the UI. The Arena preview intentionally remains iframe-embeddable. A production site's `frame-ancestors` policy should match its real embedding requirements.

Security reports should avoid including credentials or private browser saves. Prefer a minimal reproduction, affected mode, seed and schema version.
