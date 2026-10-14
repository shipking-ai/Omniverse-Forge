// Inspect deliverables without printing credential values or their hashes.
// This is a local guard, not a comprehensive secret scanner or security audit.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
const secrets = Object.entries(process.env)
  .filter(
    ([key, value]) =>
      /TOKEN|PASSWORD|SECRET|PRIVATE_KEY/i.test(key) && value.length >= 16,
  )
  .map(([, value]) => Buffer.from(value));
const files = new Set(
  execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
    encoding: "utf8",
  })
    .trim()
    .split("\n"),
);
const matches = [];
for (const path of files) {
  if (!path || !existsSync(path) || !statSync(path).isFile()) continue;
  const content = readFileSync(path);
  if (secrets.some((value) => content.includes(value))) matches.push(path);
}
if (matches.length) {
  console.error(
    "Credential material found in deliverable files (values withheld):",
    matches,
  );
  process.exitCode = 1;
} else {
  console.log(
    "No current runner credential values found in deliverable files.",
  );
}
