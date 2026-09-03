import test from "node:test";
import assert from "node:assert/strict";
import { retrieveCuratedForumNotes } from "../.test-dist/travelerForum.js";
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
    threads: [
      {
        id: "tf-1",
        schemaVersion: 1,
        worldPack: "ancient-china",
        board: "test",
        title: "test",
        postType: "question",
        author: { displayMode: "anonymous", travelerId: "anonymous-1" },
        body: "test",
        appliesTo: { identities: [], capabilities: [], situations: [] },
        reliability: "unknown",
        reviewStatus: "approved-for-display",
        provenance: { kind: "maintainer-seed", reference: "seed:test", consentToLoreCredit: false },
        replies: ["reply-missing"],
        createdAt: "2026-09-04",
        updatedAt: "2026-09-04"
      }
    ],
    replies: [
      {
        id: "reply-orphan",
        threadId: "tf-missing",
        parentReplyId: null,
        replyType: "correction",
        author: { displayMode: "anonymous", travelerId: "anonymous-2" },
        body: "test",
        reliability: "plausible",
        reviewStatus: "approved-for-display"
      }
    ],
    curatedNotes: [
      note({ id: "ck-broken", sourceThreads: ["tf-missing"], conflictsWith: ["ck-missing"] })
    ]
  });

  assert.deepEqual(issues.map((issue) => issue.code).sort(), [
    "missing-conflict-note",
    "missing-reply",
    "missing-source-thread",
    "missing-thread"
  ]);
});
