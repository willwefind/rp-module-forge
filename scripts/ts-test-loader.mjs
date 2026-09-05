// Registers the TypeScript test hooks. Used as `node --import ./scripts/ts-test-loader.mjs`.
import { register } from "node:module";

register("./ts-test-hooks.mjs", import.meta.url);
