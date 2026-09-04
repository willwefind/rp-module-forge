import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveAgenda,
  resolveAgendaAssembly,
  resolveAgendaForIdentity
} from "../.test-dist/agendaRoutes.js";
import { normalizeCanonicalConfig } from "../.test-dist/canonicalNormalization.js";
import { generateCanonicalCompactPrompt } from "../.test-dist/promptBuilder.js";

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
      { id: "power-expert", label: "Power", strengths: [] },
      { id: "leisure-expert", label: "Leisure", strengths: [] }
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
        id: "leisure",
        label: "Leisure",
        kind: "leisure",
        summary: "Generic wealthy leisure wording about succession and state order.",
        suggestedStartingIdentities: [],
        capabilityOverlay: [{ id: "readiness-logistics", mode: "on-demand" }],
        expertOverlay: [{ id: "power-expert", weight: "primary" }],
        focusQuestions: ["How do you preserve wealth?"],
        identityFacets: [
          {
            identities: ["servant"],
            label: "Small pleasures",
            summary: "Protect rest, small comforts, friends and discretionary time.",
            focusQuestions: ["How much time is actually yours?"],
            capabilityOverlay: [
              { id: "readiness-logistics", mode: "on-demand" },
              { id: "red-team", mode: "on-demand" }
            ],
            expertOverlay: [{ id: "leisure-expert", weight: "primary" }]
          }
        ]
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

test("identity facet rescales route wording and replaces route overlays without changing the stable route id", () => {
  const pack = testPack();
  const resolved = resolveAgendaForIdentity(pack, "servant", "leisure");
  const assembly = resolveAgendaAssembly(pack, "servant", "leisure");

  assert.equal(resolved.id, "leisure");
  assert.equal(resolved.label, "Small pleasures");
  assert.equal(resolved.summary.includes("small comforts"), true);
  assert.deepEqual(resolved.focusQuestions, ["How much time is actually yours?"]);
  assert.deepEqual(resolved.expertOverlay, [{ id: "leisure-expert", weight: "primary" }]);
  assert.equal(assembly.experts.some((item) => item.id === "power-expert"), false);
  assert.equal(assembly.experts.find((item) => item.id === "leisure-expert").weight, "primary");
  assert.equal(pack.identities[0].permissionProfile.id, "test:servant:v1");
  assert.equal(pack.identities[0].permissionProfile.command.length, 0);
});

test("compact prompt uses the identity-scaled route instead of leaking high-status route wording", () => {
  const pack = testPack();
  const assembly = resolveAgendaAssembly(pack, "servant", "leisure");
  const config = canonicalConfig({
    agenda: { routeId: "leisure" },
    capabilities: assembly.capabilities,
    experts: assembly.experts
  });
  const prompt = generateCanonicalCompactPrompt(config, pack);

  assert.equal(prompt.includes("Small pleasures"), true);
  assert.equal(prompt.includes("Protect rest, small comforts, friends and discretionary time."), true);
  assert.equal(prompt.includes("How much time is actually yours?"), true);
  assert.equal(prompt.includes("succession and state order"), false);
  assert.equal(config.identity.permissionProfile, "test:servant:v1");
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
