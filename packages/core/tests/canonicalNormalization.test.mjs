import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCanonicalConfig } from "../.test-dist/canonicalNormalization.js";

const pack = {
  id: "ancient-china",
  version: "0.1",
  label: "中国古代适配包",
  capabilities: [
    { id: "accountability-execution", label: "考成台", description: "test" },
    { id: "claim-action-consistency", label: "知行镜", description: "test" },
    { id: "ledger-evidence-crosscheck", label: "鱼鳞算盘", description: "test" },
    { id: "multiplex-relationship-graph", label: "朋党谱", description: "test" },
    { id: "readiness-logistics", label: "烽燧图", description: "test" },
    { id: "plural-stakeholder-signals", label: "民声池", description: "test" },
    { id: "red-team", label: "御前反对席", description: "test" },
    { id: "curated-practitioner-knowledge", label: "老乡经验库", description: "test" }
  ],
  identities: [
    {
      id: "servant",
      label: "奴婢 / 仆役",
      summary: "低权限",
      permissionProfile: {
        id: "ancient-china:servant:v1",
        observe: ["本职活动范围内所见"],
        access: ["被指派进入的任务区域"],
        request: ["本职相关询问"],
        command: [],
        allocate: ["个人物品"],
        publish: [],
        conceal: ["普通自保"],
        risks: ["惩罚"]
      },
      recommendedCapabilities: [],
      recommendedExperts: []
    }
  ],
  experts: [
    { id: "wang-yangming", label: "王阳明", strengths: ["test"] },
    { id: "zhang-juzheng", label: "张居正", strengths: ["test"] }
  ]
};

function config(overrides = {}) {
  return {
    schemaVersion: 1,
    worldPack: { id: "ancient-china", version: "0.1" },
    identity: { id: "servant", permissionProfile: "ancient-china:servant:v1" },
    capabilities: [
      { id: "red-team", mode: "on-demand" },
      { id: "ledger-evidence-crosscheck", mode: "disabled" },
      { id: "claim-action-consistency", mode: "resident" }
    ],
    experts: [
      { id: "zhang-juzheng", weight: "secondary" },
      { id: "wang-yangming", weight: "primary" }
    ],
    travelerForum: {
      enabled: true,
      autoInject: "curated-only",
      showThreadLinks: true,
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

test("normalization produces stable capability and expert ordering", () => {
  const result = normalizeCanonicalConfig(config(), pack);
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.config.capabilities.map((item) => item.id), [
    "claim-action-consistency",
    "ledger-evidence-crosscheck",
    "red-team"
  ]);
  assert.deepEqual(result.config.experts.map((item) => item.id), [
    "wang-yangming",
    "zhang-juzheng"
  ]);
  assert.deepEqual(normalizeCanonicalConfig(result.config, pack).config, result.config);
});

test("identity derives its permission profile instead of trusting a stale or privileged id", () => {
  const result = normalizeCanonicalConfig(config({
    identity: { id: "servant", permissionProfile: "ancient-china:emperor:v1" }
  }), pack);

  assert.equal(result.errors.length, 0);
  assert.equal(result.config.identity.permissionProfile, "ancient-china:servant:v1");
  assert.ok(result.warnings.some((item) => item.code === "permission-profile-corrected"));
});

test("duplicate explicit selections normalize deterministically to the last value", () => {
  const result = normalizeCanonicalConfig(config({
    capabilities: [
      { id: "red-team", mode: "disabled" },
      { id: "red-team", mode: "on-demand" }
    ]
  }), pack);

  assert.deepEqual(result.config.capabilities, [{ id: "red-team", mode: "on-demand" }]);
  assert.ok(result.warnings.some((item) => item.code === "duplicate-capability"));
});

test("disabled forum cannot retain auto-injection or thread links", () => {
  const result = normalizeCanonicalConfig(config({
    travelerForum: {
      enabled: false,
      autoInject: "curated-plus-links",
      showThreadLinks: true,
      minimumReliability: "plausible"
    }
  }), pack);

  assert.deepEqual(result.config.travelerForum, {
    enabled: false,
    autoInject: "off",
    showThreadLinks: false,
    minimumReliability: "plausible"
  });
});

test("runtime safety invariants fail closed", () => {
  const omniscient = normalizeCanonicalConfig(config({
    runtime: {
      tokenMode: "standard",
      activationPolicy: "event-driven",
      showEvidenceState: true,
      hostFinalDecision: true,
      omniscience: true
    }
  }), pack);
  const noHostDecision = normalizeCanonicalConfig(config({
    runtime: {
      tokenMode: "standard",
      activationPolicy: "event-driven",
      showEvidenceState: true,
      hostFinalDecision: false,
      omniscience: false
    }
  }), pack);

  assert.equal(omniscient.config, null);
  assert.equal(noHostDecision.config, null);
  assert.ok(omniscient.errors.some((item) => item.code === "runtime-invariant"));
  assert.ok(noHostDecision.errors.some((item) => item.code === "runtime-invariant"));
});

test("unsupported world pack, version, or identity is fatal", () => {
  assert.equal(normalizeCanonicalConfig(config({ worldPack: { id: "space", version: "0.1" } }), pack).config, null);
  assert.equal(normalizeCanonicalConfig(config({ worldPack: { id: "ancient-china", version: "9.9" } }), pack).config, null);
  assert.equal(normalizeCanonicalConfig(config({ identity: { id: "emperor", permissionProfile: "x" } }), pack).config, null);
});
