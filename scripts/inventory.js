import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const entries = [];
const notices = [
  "OMNIVERSE FORGE — THIRD-PARTY DEVELOPMENT TOOL NOTICES\n\nNo npm runtime dependency is included in the browser app.\nThe following installed build/test packages retain their upstream licenses.\nThis inventory covers npm packages on this platform, not the complete Chromium binary.\nBrowser/OS/font redistribution requires its own notices; do not distribute node_modules as game assets.\n",
];
for (const [path, meta] of Object.entries(lock.packages)) {
  if (!path || !existsSync(path + "/package.json")) continue;
  const p = JSON.parse(readFileSync(path + "/package.json", "utf8")),
    licenses = readdirSync(path).filter((name) =>
      /^(licen[sc]e|copying|notice)(\.|$|-)/i.test(name),
    );
  entries.push({
    name: p.name,
    version: p.version,
    path,
    license: p.license || "UNRESOLVED",
    scope: "development-only",
    repository: p.repository?.url || p.repository || null,
    source: meta.resolved,
    integrity: meta.integrity,
    noticeFiles: licenses,
  });
  notices.push(
    `\n${"=".repeat(72)}\n${p.name}@${p.version} — ${p.license || "UNRESOLVED"}\n`,
  );
  for (const file of licenses) {
    try {
      notices.push(
        `\n--- ${file} ---\n${readFileSync(path + "/" + file, "utf8")}\n`,
      );
    } catch {}
  }
  if (!licenses.length)
    notices.push(
      "No top-level notice file found; review package metadata and upstream before redistribution.\n",
    );
}
writeFileSync(
  "docs/dependency-inventory.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      directDevelopment: lock.packages[""].devDependencies,
      runtime: [],
      installedPackageCount: entries.length,
      packages: entries,
    },
    null,
    2,
  ) + "\n",
);
writeFileSync(
  "docs/THIRD_PARTY_NOTICES.txt",
  notices
    .join("")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .trimEnd() + "\n",
);
console.log(
  `Inventoried ${entries.length} installed development packages; ${Object.keys(lock.packages[""].devDependencies).length} direct, 0 runtime.`,
);
