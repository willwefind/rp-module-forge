import test from "node:test";
import assert from "node:assert/strict";
import { retrieveCuratedForumNotes, FORUM_WORLDLINE_STATUSES } from "../.test-dist/travelerForum.js";
import { validateTravelerForumData } from "../.test-dist/travelerForumValidation.js";

function note(overrides = {}) {
  return {
    id: "ck-test-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "ledger-evidence-crosscheck",
    lesson: "先区分账面余额、实物库存与不可支用额度。",
    appliesTo: {
      identities: ["local-official"],
      situations: ["suspect-ledgers"]
    },
    exclusions: [],
    reliability: "corroborated",
    failureModes: [],
    sourceThreads: ["tf-test-001"],
    reviewStatus: "approved-for-runtime",
    version: 1,
    ...overrides
  };
}

function thread(overrides = {}) {
  return {
    id: "tf-1",
    schemaVersion: 1,
    worldPack: "ancient-china",
    node: "test",
    title: "test",
    postType: "question",
    author: { displayMode: "anonymous", travelerId: "anonymous-1" },
    body: "test",
    appliesTo: { identities: [], capabilities: [], situations: [] },
    reliability: "unknown",
    reviewStatus: "approved-for-display",
    provenance: { kind: "maintainer-seed", reference: "seed:test", consentToLoreCredit: false },
    replies: [],
    createdAt: "2026-09-04",
    updatedAt: "2026-09-04",
    ...overrides
  };
}

function reply(overrides = {}) {
  return {
    id: "reply-1",
    threadId: "tf-1",
    parentReplyId: null,
    replyType: "correction",
    author: { displayMode: "anonymous", travelerId: "anonymous-2" },
    body: "test",
    reliability: "plausible",
    reviewStatus: "approved-for-display",
    ...overrides
  };
}

function query(overrides = {}) {
  return {
    worldPack: "ancient-china",
    identity: "local-official",
    capabilities: ["ledger-evidence-crosscheck"],
    situations: ["suspect-ledgers"],
    exclusions: [],
    minimumReliability: "plausible",
    maxNotes: 6,
    ...overrides
  };
}

test("retrieves only runtime-approved notes matching world, identity, capability, situation, and reliability", () => {
  const result = retrieveCuratedForumNotes([
    note(),
    note({ id: "ck-display-only", reviewStatus: "approved-for-display" }),
    note({ id: "ck-wrong-identity", appliesTo: { identities: ["servant"], situations: ["suspect-ledgers"] } }),
    note({ id: "ck-wrong-capability", capability: "red-team" }),
    note({ id: "ck-wrong-situation", appliesTo: { identities: ["local-official"], situations: ["military-mobilization"] } }),
    note({ id: "ck-too-weak", reliability: "anecdotal" })
  ], query());

  assert.deepEqual(result.map((item) => item.id), ["ck-test-001"]);
  assert.match(result[0].reasonRetrieved, /identity=local-official/);
  assert.match(result[0].reasonRetrieved, /review=approved-for-runtime/);
});

test("superseded and deprecated notes never auto-inject", () => {
  const result = retrieveCuratedForumNotes([
    note({ id: "ck-superseded", reviewStatus: "superseded" }),
    note({ id: "ck-deprecated", reliability: "deprecated" })
  ], query({ minimumReliability: "unknown" }));

  assert.deepEqual(result, []);
});

test("explicit exclusions can make an otherwise matching note ineligible", () => {
  const result = retrieveCuratedForumNotes([
    note({ exclusions: ["wartime-emergency"] })
  ], query({ exclusions: ["wartime-emergency"] }));

  assert.deepEqual(result, []);
});

test("conflicting eligible notes are both preserved and linked instead of averaged", () => {
  const result = retrieveCuratedForumNotes([
    note({ id: "ck-a", conflictsWith: ["ck-b"] }),
    note({ id: "ck-b", lesson: "先查实物，再决定是否追账。", conflictsWith: ["ck-a"] })
  ], query());

  assert.deepEqual(result.map((item) => item.id), ["ck-a", "ck-b"]);
  assert.deepEqual(result[0].conflictWith, ["ck-b"]);
  assert.deepEqual(result[1].conflictWith, ["ck-a"]);
});

test("retrieval is deterministic and respects maxNotes", () => {
  const result = retrieveCuratedForumNotes([
    note({ id: "ck-z", reliability: "plausible" }),
    note({ id: "ck-b", reliability: "corroborated" }),
    note({ id: "ck-a", reliability: "corroborated" })
  ], query({ maxNotes: 2 }));

  assert.deepEqual(result.map((item) => item.id), ["ck-a", "ck-b"]);
});

test("forum data validation catches broken references and duplicate ids", () => {
  const issues = validateTravelerForumData({
    threads: [thread({ replies: ["reply-missing"] })],
    replies: [reply({ id: "reply-orphan", threadId: "tf-missing" })],
    curatedNotes: [
      note({ id: "ck-broken", sourceThreads: ["tf-missing"], sourceReplies: ["reply-missing"], conflictsWith: ["ck-missing"] })
    ]
  });

  assert.deepEqual(issues.map((issue) => issue.code).sort(), [
    "missing-conflict-note",
    "missing-reply",
    "missing-source-reply",
    "missing-source-thread",
    "missing-thread"
  ]);
});

test("a stored reply that its thread does not list is reported so visible counts stay honest", () => {
  const issues = validateTravelerForumData({
    threads: [thread({ replies: [] })],
    replies: [reply()],
    curatedNotes: []
  });
  assert.deepEqual(issues.map((issue) => issue.code), ["reply-not-listed"]);
});

test("archive-layer fields are validated: node registry, related threads, gap reasons, attachment world", () => {
  const issues = validateTravelerForumData({
    nodes: [{ id: "known", label: "已知分区", realm: "world" }],
    threads: [
      thread({ id: "tf-a", node: "unknown-node", relatedThreads: ["tf-a", "tf-missing"], archiveGap: { kind: "interrupted", note: "   " } }),
      thread({
        id: "tf-b",
        node: "known",
        moduleAttachment: {
          label: "x",
          version: "1",
          worldPack: "other-pack",
          suggestedIdentity: "emperor",
          capabilities: [],
          experts: [],
          note: "x"
        }
      })
    ],
    replies: [],
    curatedNotes: []
  });

  assert.deepEqual(issues.map((issue) => `${issue.entityId}:${issue.code}`), [
    "tf-a:empty-gap-note",
    "tf-a:missing-node",
    "tf-a:missing-related-thread",
    "tf-a:self-related",
    "tf-b:attachment-world-mismatch"
  ]);
});

test("provenance references must carry the prefix of their kind so seed lore and community imports cannot be confused", () => {
  const issues = validateTravelerForumData({
    threads: [
      thread({ id: "tf-seed", provenance: { kind: "maintainer-seed", reference: "github-discussion:12", consentToLoreCredit: false } }),
      thread({ id: "tf-community", provenance: { kind: "community-contribution", reference: "seed:fake", consentToLoreCredit: true } }),
      thread({ id: "tf-ok-seed", provenance: { kind: "maintainer-seed", reference: "seed:test", consentToLoreCredit: false } }),
      thread({ id: "tf-ok-community", provenance: { kind: "community-contribution", reference: "github-discussion:12", consentToLoreCredit: true } })
    ],
    replies: [],
    curatedNotes: []
  });

  assert.deepEqual(issues.map((issue) => issue.entityId), ["tf-community", "tf-seed"]);
  assert.ok(issues.every((issue) => issue.code === "provenance-reference-mismatch"));
});

test("worldline vocabulary has an identity-ended state but no death state", () => {
  assert.ok(FORUM_WORLDLINE_STATUSES.includes("identity-ended"));
  assert.ok(FORUM_WORLDLINE_STATUSES.includes("unknown"));
  assert.ok(!FORUM_WORLDLINE_STATUSES.some((status) => /dead|deceased|died/.test(status)));
});
