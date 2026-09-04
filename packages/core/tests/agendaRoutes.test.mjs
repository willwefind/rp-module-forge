import test from "node:test";
import assert from "node:assert/strict";
import { resolveAgenda, resolveAgendaAssembly } from "../.test-dist/agendaRoutes.js";
import { normalizeCanonicalConfig } from "../.test-dist/canonicalNormalization.js";

function testPack() {
  return {
    id: "test-pack",
    version: "0.1",
    label: "Test Pack",
    capabilities: [
      { id: "accountability-execution", label: "Accountability", description: "" },
      { id: "multiplex-relationship-graph", label: "Relationships", description: "" },
      { id: "readiness-logistics", label: "Readiness", description: "" },
      { id: "red-team", label: "Red Team", description: "" }
    ],
    experts: [
      { id: "baseline-expert", label: "Baseline", strengths: [] },
      { id: "power-expert", label: "Power", strengths: [] }
    ],
    identities: [
      {
        id: "servant",
        label: "Servant",
        summary: "Low permission",
        defaultPlaybook: "servant-life",
        permissionProfile: {
          id: "test:servant:v1",
          observe: ["assigned area"],
          access: ["assigned room"],
          request: ["task questions"],
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
    playbooks: [
      {
        id: "servant-life",
        label: "Servant life",
        summary: "Current-position baseline",
        identities: ["servant"],
        capabilityDefaults: [
          { id: "readiness-logistics", mode: "resident" },
          { id: "red-team", mode: "on-demand" }
        ],
        expertDefaults: [{ id: "baseline-expert", weight: "primary" }],
        facets: []
      }
    ],
    agendas: [
      {
        id: "throne-seeking",
        label: "Seek the throne",
        kind: "power",
        summary: "A distant aspiration",
        suggestedStartingIdentities: [],
        capabilityOverlay: [
          { id: "multiplex-relationship-graph", mode: "resident" },
          { id: "red-team", mode: "resident" }
        ],
        expertOverlay: [{ id: "power-expert", weight: "primary" }],
        focusQuestions: ["What is the next real gate?"],
        caution: "Aspiration is not authority."
      },
      {
        id: "custom",
        label: "Custom",
        kind: "custom",
        summary: "Custom route",
        suggestedStartingIdentities: [],
        capabilityOverlay: [],
        expertOverlay: [],
        focusQuestions: []
      }
    ]
  };
}

function canonicalConfig(overrides = {}) {
  return {
    schemaVersion: 1,
    worldPack: { id: "test-pack", version: "0.1" },
    identity: { id: "servant", permissionProfile: "test:servant:v1" },
    agenda: { routeId: "throne-seeking" },
    capabilities: [
      { id: "readiness-logistics", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "red-team", mode: "resident" }
    ],
    experts: [{ id: "power-expert", weight: "primary" }],
    travelerForum: {
      enabled: false,
      autoInject: "off",
      showThreadLinks: false,
      minimumReliability: "corroborated"
    },
    runtime: {
      tokenMode: "standard",
      activationPolicy: "event-driven",
      showEvidenceState: true,
      hostFinalDecision: true,
      omniscience: false
    },
    sessionPatch: { facts: [], claims: [], notes: "" },
    ...overrides
  };
}

test("agenda overlays current-position defaults without changing identity permissions", () => {
  const pack = testPack();
  const result = resolveAgendaAssembly(pack, "servant", "throne-seeking");

  assert.equal(result.agenda.id, "throne-seeking");
  assert.equal(result.capabilities.find((item) => item.id === "readiness-logistics").mode, "resident");
  assert.equal(result.capabilities.find((item) => item.id === "multiplex-relationship-graph").mode, "resident");
  assert.equal(result.capabilities.find((item) => item.id === "red-team").mode, "resident");
  assert.equal(pack.identities[0].permissionProfile.command.length, 0);
  assert.equal(pack.identities[0].permissionProfile.id, "test:servant:v1");
});

test("route primary expert demotes an unrelated baseline primary instead of pretending both are primary", () => {
  const result = resolveAgendaAssembly(testPack(), "servant", "throne-seeking");
  assert.deepEqual(result.experts, [
    { id: "baseline-expert", weight: "secondary" },
    { id: "power-expert", weight: "primary" }
  ]);
});

test("no agenda preserves the identity playbook baseline", () => {
  const result = resolveAgendaAssembly(testPack(), "servant");
  assert.equal(result.agenda, null);
  assert.deepEqual(result.capabilities, [
    { id: "readiness-logistics", mode: "resident" },
    { id: "red-team", mode: "on-demand" }
  ]);
  assert.deepEqual(result.experts, [{ id: "baseline-expert", weight: "primary" }]);
});

test("unknown agenda does not silently become a valid route and canonical normalization fails closed", () => {
  const pack = testPack();
  assert.equal(resolveAgenda(pack, "not-real"), null);

  const normalized = normalizeCanonicalConfig(
    canonicalConfig({ agenda: { routeId: "not-real" } }),
    pack
  );
  assert.equal(normalized.config, null);
  assert.equal(normalized.errors.some((item) => item.code === "unknown-agenda"), true);
});

test("custom agenda goal is trimmed and persisted without changing permission profile", () => {
  const pack = testPack();
  const normalized = normalizeCanonicalConfig(
    canonicalConfig({ agenda: { routeId: "custom", customGoal: "  become a painter, not an official  " } }),
    pack
  );

  assert.equal(normalized.config.agenda.customGoal, "become a painter, not an official");
  assert.equal(normalized.config.identity.permissionProfile, "test:servant:v1");
});
