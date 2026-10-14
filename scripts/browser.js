// Linux-only registry-delivered Chromium fallback for network-restricted test environments.
// Browser code and libraries remain in ignored node_modules/.cache; never in the web build.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
export async function launchOptions() {
  if (process.env.CHROMIUM_EXECUTABLE_PATH)
    return { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH };
  if (process.platform !== "linux") return {};
  const { default: chromium } = await import("@sparticuz/chromium");
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const lib = resolve(root, ".cache/chromium");
  if (!existsSync(resolve(lib, "lib/libnspr4.so"))) {
    mkdirSync(lib, { recursive: true });
    const file = resolve(
      root,
      "node_modules/@sparticuz/chromium/bin/al2023.tar.br",
    );
    const tar = resolve(root, ".cache/al2023.tar");
    writeFileSync(tar, brotliDecompressSync(readFileSync(file)));
    // Extract only the pinned package's known library subtree, not user-supplied archives.
    execFileSync("tar", ["xf", tar, "-C", lib]);
  }
  return {
    executablePath: await chromium.executablePath(),
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"],
    env: {
      PATH: process.env.PATH || "/usr/bin:/bin",
      HOME: process.env.HOME || "/tmp",
      FONTCONFIG_PATH: process.env.FONTCONFIG_PATH || "/tmp/fonts",
      LANG: "en_US.UTF-8",
      LD_LIBRARY_PATH:
        resolve(lib, "lib") +
        (process.env.LD_LIBRARY_PATH ? ":" + process.env.LD_LIBRARY_PATH : ""),
    },
  };
}
