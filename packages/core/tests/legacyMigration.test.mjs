import test from "node:test";
import assert from "node:assert/strict";
import { migrateLegacyForgeConfig } from "../.test-dist/legacyMigration.js";

function legacy(overrides = {}) {
  return {
    schemaVersion: 1,
    worldPack: "ancient-china",
    role: "emperor",
    modules: [],
    experts: [],
    legacyNotes: false,
    omniscience: false,
    hostFinalDecision: true,
    sessionPatch: "",
    ...overrides
  };
}

function capabilityIds(result) {
  return result.config?.capabilities.map((item) => item.id) ?? [];
}

test("migrates direct, split, absorbed, and forum semantics without inventing IDs", () => {
  const result = migrateLegacyForgeConfig(legacy({
    modules: ["administration", "fiscal", "motives", "intelligence"],
    experts: ["zhang-juzheng"],
    legacyNotes: true
  }));

  assert.deepEqual(result.errors, []);
  assert.deepEqual(capabilityIds(result), [
    "accountability-execution",
    "ledger-evidence-crosscheck",
    "claim-action-consistency",
    "multiplex-relationship-graph",
    "curated-practitioner-knowledge"
  ]);
  assert.equal(result.config?.travelerForum.autoInject, "curated-only");
  assert.equal(result.config?.travelerForum.minimumReliability, "corroborated");
  assert.equal(result.requiresReview, true);
  assert.ok(result.warnings.some((warning) => warning.code === "split-module" && warning.legacyId === "motives"));
  assert.ok(result.warnings.some((warning) => warning.code === "absorbed-module" && warning.legacyId === "intelligence"));
});

test("servant migration does not gain ledger authority by identity", () => {
  const result = migrateLegacyForgeConfig(legacy({
    role: "servant",
    modules: ["survival", "status", "intelligence"]
  }));

  assert.deepEqual(result.errors, []);
  assert.equal(result.config?.identity.permissionProfile, "ancient-china:servant:v1");
  assert.equal(capabilityIds(result).includes("ledger-evidence-crosscheck"), false);
  assert.equal(result.config?.runtime.omniscience, false);
  assert.equal(result.config?.runtime.hostFinalDecision, true);
});

test("unknown identity fails closed", () => {
  const result = migrateLegacyForgeConfig(legacy({ role: "mystery-minister" }));

  assert.equal(result.config, null);
  assert.equal(result.requiresReview, true);
  assert.deepEqual(result.errors.map((error) => error.code), ["unknown-identity"]);
});

test("unsupported world pack fails closed", () => {
  const result = migrateLegacyForgeConfig(legacy({ worldPack: "space-opera" }));

  assert.equal(result.config, null);
  assert.equal(result.requiresReview, true);
  assert.deepEqual(result.errors.map((error) => error.code), ["unsupported-world-pack"]);
});

test("resource management remains manual review instead of receiving a guessed capability", () => {
  const result = migrateLegacyForgeConfig(legacy({ modules: ["resources"] }));

  assert.deepEqual(result.errors, []);
  assert.deepEqual(capabilityIds(result), []);
  assert.equal(result.requiresReview, true);
  assert.ok(result.warnings.some((warning) => warning.code === "manual-review-module" && warning.legacyId === "resources"));
});
