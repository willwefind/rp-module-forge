import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveCapabilityFacet,
  resolveIdentityPlaybook
} from "../.test-dist/identityPlaybooks.js";

function pack(overrides = {}) {
  return {
    id: "test-pack",
    version: "0.1",
    label: "Test Pack",
    capabilities: [
      { id: "accountability-execution", label: "Base accountability", description: "Base description" },
      { id: "red-team", label: "Base red team", description: "Base red description" }
    ],
    experts: [],
    identities: [
      {
        id: "servant",
        label: "Servant",
        summary: "Low permission",
        permissionProfile: {
          id: "test:servant:v1",
          observe: ["assigned area"],
          access: ["assigned room"],
          request: ["task-related questions"],
          command: [],
          allocate: ["own items"],
          publish: [],
          conceal: ["ordinary privacy"],
          risks: ["punishment"]
        },
        recommendedCapabilities: [],
        recommendedExperts: []
      }
    ],
    ...overrides
  };
}

const lowPermissionPlaybook = {
  id: "low-permission-survival",
  label: "Low-permission survival",
  summary: "Survive without inventing authority",
  identities: ["servant"],
  capabilityDefaults: [
    { id: "accountability-execution", mode: "on-demand" },
    { id: "red-team", mode: "on-demand" }
  ],
  expertDefaults: [],
  facets: [
    {
      capability: "accountability-execution",
      label: "Task ledger",
      description: "Track who assigned what without gaining command authority.",
      questions: ["Who gave the instruction?"],
      examples: ["Conflicting household orders"]
    }
  ]
};

test("packs without playbooks fall back without changing identity behavior", () => {
  const resolved = resolveIdentityPlaybook(pack(), "servant");
  assert.equal(resolved.identity.id, "servant");
  assert.equal(resolved.playbook, null);
});

test("a single matching playbook resolves by identity even before explicit default ids are migrated", () => {
  const resolved = resolveIdentityPlaybook(pack({ playbooks: [lowPermissionPlaybook] }), "servant");
  assert.equal(resolved.playbook.id, "low-permission-survival");
  assert.equal(resolved.identity.permissionProfile.command.length, 0);
});

test("playbook facets change presentation without replacing the stable Core capability id", () => {
  const testPack = pack({ playbooks: [lowPermissionPlaybook] });
  const facet = resolveCapabilityFacet(testPack, "servant", "accountability-execution");

  assert.equal(facet.label, "Task ledger");
  assert.equal(facet.capability, "accountability-execution");
  assert.equal(testPack.identities[0].permissionProfile.command.length, 0);
});

test("ambiguous implicit playbooks fail closed to base presentation", () => {
  const second = { ...lowPermissionPlaybook, id: "another-servant-playbook", label: "Another" };
  const resolved = resolveIdentityPlaybook(pack({ playbooks: [lowPermissionPlaybook, second] }), "servant");
  assert.equal(resolved.playbook, null);
});

test("an explicit default playbook resolves only when it actually declares that identity", () => {
  const testPack = pack({
    identities: [{ ...pack().identities[0], defaultPlaybook: "wrong-playbook" }],
    playbooks: [{ ...lowPermissionPlaybook, id: "wrong-playbook", identities: ["emperor"] }]
  });
  const resolved = resolveIdentityPlaybook(testPack, "servant");
  assert.equal(resolved.playbook, null);
});
