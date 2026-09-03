import test from "node:test";
import assert from "node:assert/strict";
import { checkPermission } from "../.test-dist/permissionGate.js";

const servantProfile = {
  id: "ancient-china:servant:v1",
  observe: ["本职活动范围内亲眼所见、亲耳所闻的日常行为与环境变化"],
  access: ["被指派进入的房间、物品与任务区域；不包含主家私账或官署记录的自动访问权"],
  request: ["在身份关系允许时询问与本职工作直接相关的事情"],
  command: [],
  allocate: ["个人物品与明确交付自己处置的少量资源"],
  publish: ["仅在社会风险允许范围内表达个人信息；公开指控风险极高"],
  conceal: ["符合日常行为范围的小规模自保与信息保护；不得假设秘密调查能力"],
  risks: ["惩罚", "身份暴露", "失去庇护", "报复", "资源匮乏"]
};

test("enabling a capability never grants access by itself", () => {
  const decision = checkPermission(servantProfile, {
    dimension: "access",
    target: "户部账册",
    capability: "ledger-evidence-crosscheck"
  });

  assert.equal(decision.status, "needs-context");
  assert.equal(decision.source, null);
  assert.match(decision.reason, /cannot|Supply|before treating/i);
});

test("an exact declared profile scope can authorize a bounded action", () => {
  const scope = servantProfile.access[0];
  const decision = checkPermission(servantProfile, {
    dimension: "access",
    target: "今日被指派清扫的内院房间",
    basis: { kind: "profile-scope", scope }
  });

  assert.equal(decision.status, "permitted");
  assert.equal(decision.source, "profile");
  assert.equal(decision.matchedScope, scope);
});

test("a made-up profile scope is denied", () => {
  const decision = checkPermission(servantProfile, {
    dimension: "access",
    target: "户部库房",
    capability: "ledger-evidence-crosscheck",
    basis: { kind: "profile-scope", scope: "可随时调阅户部全部账册" }
  });

  assert.equal(decision.status, "denied");
  assert.equal(decision.source, null);
});

test("empty ordinary authority fails closed when no session override exists", () => {
  const decision = checkPermission(servantProfile, {
    dimension: "command",
    target: "命令县衙封库",
    capability: "accountability-execution"
  });

  assert.equal(decision.status, "denied");
  assert.match(decision.reason, /capability selection cannot create/i);
});

test("accepted session context may provide a bounded situational permission without mutating base identity", () => {
  const decision = checkPermission(servantProfile, {
    dimension: "access",
    target: "主家当面交到手里的这一册账簿",
    capability: "ledger-evidence-crosscheck",
    basis: { kind: "session-override", reference: "本局事实：主人明确命宿主核对这一册账簿" }
  });

  assert.equal(decision.status, "permitted");
  assert.equal(decision.source, "session-override");
  assert.equal(servantProfile.id, "ancient-china:servant:v1");
});

test("blank session override cannot be used as a permission bypass", () => {
  const decision = checkPermission(servantProfile, {
    dimension: "access",
    target: "户部账册",
    basis: { kind: "session-override", reference: "   " }
  });

  assert.equal(decision.status, "needs-context");
  assert.equal(decision.source, null);
});
