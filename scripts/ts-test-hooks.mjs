// Module hooks that let `node --test` run TypeScript test files against the
// workspace sources on Node 20+, without a bundler or a test-framework
// dependency. Transpilation uses the `typescript` package that packages/core
// already declares; nothing new is installed.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../packages/core/package.json", import.meta.url));
const ts = require("typescript");

/**
 * Repository convention: sibling TypeScript files are imported with a `.js`
 * extension (`export * from "./types.js"`). Retry with `.ts` when the `.js`
 * file does not exist.
 */
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" && specifier.endsWith(".js")) {
      return next(`${specifier.slice(0, -3)}.ts`, context);
    }
    throw error;
  }
}

export async function load(url, context, next) {
  if (!url.endsWith(".ts")) return next(url, context);
  const fileName = fileURLToPath(url);
  const source = await readFile(fileName, "utf8");
  const { outputText } = ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true
    }
  });
  return { format: "module", source: outputText, shortCircuit: true };
}
