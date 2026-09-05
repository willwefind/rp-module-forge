// Finds every `*.test.ts` under packages/*/tests and apps/*/tests and runs
// them with `node --test` plus the TypeScript hooks. Kept explicit so it
// behaves the same on Node 20 (no glob support in --test) and on Windows.
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function collect(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collect(full, out);
    else if (entry.name.endsWith(".test.ts")) out.push(full);
  }
}

const files = [];
for (const group of ["packages", "apps"]) {
  const groupDir = join(root, group);
  if (!existsSync(groupDir)) continue;
  for (const entry of readdirSync(groupDir, { withFileTypes: true })) {
    const tests = join(groupDir, entry.name, "tests");
    if (entry.isDirectory() && existsSync(tests)) collect(tests, files);
  }
}

if (!files.length) {
  console.error("No TypeScript test files found.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--import", new URL("./ts-test-loader.mjs", import.meta.url).href, "--test", ...files.sort()],
  { stdio: "inherit", cwd: root }
);
process.exit(result.status ?? 1);
