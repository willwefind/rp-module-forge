import test from "node:test";
import assert from "node:assert/strict";
import {
  CORE_CAPABILITY_IDS,
  FORUM_MEMBER_KINDS,
  FORUM_POST_TYPES,
  FORUM_WORLDLINE_STATUSES,
  retrieveCuratedForumNotes,
  validateTravelerForumData,
  type ForumAuthor
} from "@rpmf/core";
import { ancientChinaForumArchive, ancientChinaForumData, ancientChinaForumNodes } from "../src/forumArchive.ts";
import { ancientChinaPackV01 } from "../src/canonicalPack.ts";
// The retired V3 prototype archive is kept as a historical snapshot; the
// production source must contain everything it contained.
// @ts-expect-error plain ESM prototype module without types
import { topics as v3Topics } from "../../../prototypes/forum-v3/content.mjs";

type V3Reply = { author: string; text: string; time: string; status: string };
type V3Topic = {
  id: string;
  title: string;
  author: string;
  status: string;
  tags: string[];
  body: string[];
  replies: V3Reply[];
  gap?: string;
  related?: string[];
  module?: boolean;
  knowledge?: boolean;
  featured?: boolean;
};

const archive = ancientChinaForumArchive;
const pack = ancientChinaPackV01;
const v3 = v3Topics as V3Topic[];
const v3Id = (slug: string) => `tf-ancient-china-${slug}`;
const repliesOf = (threadId: string) => archive.replies.filter((reply) => reply.threadId === threadId);
const thread = (id: string) => {
  const found = archive.threads.find((item) => item.id === id);
  if (!found) throw new Error(`missing thread ${id}`);
  return found;
};
const includes = (list: readonly string[], value: string | undefined, label: string) =>
  assert.ok(value !== undefined && list.includes(value), `${label}: ${value}`);

test("the deprecated alias and the archive are the same object, so UI and Runtime cannot drift", () => {
  assert.equal(ancientChinaForumData, ancientChinaForumArchive);
});

test("reference integrity: unique ids; every reply / source / related / node / attachment reference resolves", () => {
  assert.deepEqual(validateTravelerForumData(archive), []);
  assert.equal(new Set(archive.threads.map((item) => item.id)).size, archive.threads.length);
  assert.equal(new Set(archive.replies.map((item) => item.id)).size, archive.replies.length);
  assert.equal(new Set(archive.curatedNotes.map((item) => item.id)).size, archive.curatedNotes.length);
  for (const note of archive.curatedNotes) {
    for (const source of note.sourceThreads) assert.ok(archive.threads.some((item) => item.id === source), source);
    for (const source of note.sourceReplies ?? []) assert.ok(archive.replies.some((item) => item.id === source), source);
  }
  for (const item of archive.threads) {
    for (const related of item.relatedThreads ?? []) assert.ok(archive.threads.some((other) => other.id === related), related);
    assert.ok(ancientChinaForumNodes.some((node) => node.id === item.node), item.node);
  }
});

test("every applicability, author and vocabulary value points at something that exists", () => {
  const identityIds = new Set(pack.identities.map((item) => item.id));
  const authors: ForumAuthor[] = [...archive.threads.map((item) => item.author), ...archive.replies.map((item) => item.author)];
  for (const item of archive.threads) {
    includes(FORUM_POST_TYPES, item.postType, "post type");
    for (const identity of item.appliesTo.identities) assert.ok(identityIds.has(identity), identity);
    for (const capability of item.appliesTo.capabilities) includes(CORE_CAPABILITY_IDS, capability, "capability");
    assert.equal(item.worldPack, pack.id);
  }
  for (const reply of archive.replies) includes(FORUM_POST_TYPES, reply.replyType, "reply type");
  for (const author of authors) {
    assert.ok(author.displayName, author.travelerId);
    includes(FORUM_MEMBER_KINDS, author.memberKind, "member kind");
    includes(FORUM_WORLDLINE_STATUSES, author.worldlineStatus, "worldline status");
    assert.ok(author.statusLabel, author.travelerId);
  }
});

test("only the module-release topic carries an attachment and it references real pack entities", () => {
  const withAttachment = archive.threads.filter((item) => item.moduleAttachment);
  assert.deepEqual(withAttachment.map((item) => item.id), [v3Id("emperor-module108")]);
  const attachment = withAttachment[0].moduleAttachment!;
  assert.equal(withAttachment[0].postType, "module-release");
  assert.equal(attachment.worldPack, pack.id);
  assert.ok(pack.identities.some((item) => item.id === attachment.suggestedIdentity));
  for (const capability of attachment.capabilities) includes(CORE_CAPABILITY_IDS, capability, "attachment capability");
  for (const expert of attachment.experts) assert.ok(pack.experts.some((item) => item.id === expert), expert);
  assert.ok(attachment.experts.length > 0);
});

test("no fake visible counts: the only reply count is the stored reply list; no view / like / reaction fields", () => {
  const keys = new Set<string>();
  JSON.stringify(archive, (key, value) => {
    if (key) keys.add(key);
    return value;
  });
  assert.deepEqual([...keys].filter((key) => /count$/i.test(key) || /^(views?|likes?|reactions?|upvotes?|hotness|floors?)$/i.test(key)), []);
  for (const item of archive.threads) {
    const stored = repliesOf(item.id);
    assert.equal(item.replies.length, stored.length, item.id);
    assert.deepEqual(item.replies, stored.map((reply) => reply.id));
  }
});

test("every interrupted, damaged or unfinished topic says why; the 永宁帝 retrospective is explicitly interrupted", () => {
  const gaps = archive.threads.filter((item) => item.archiveGap);
  assert.ok(gaps.length >= 4);
  for (const item of gaps) assert.ok(item.archiveGap!.note.trim().length > 10, item.id);
  const yongning = thread(v3Id("yongning-first-year"));
  assert.equal(yongning.archiveGap?.kind, "interrupted");
  assert.match(yongning.archiveGap?.note ?? "", /未发现续篇/);
  assert.ok(yongning.body.endsWith("其余的……"));
  assert.equal(thread(v3Id("revived-literate-servant")).archiveGap?.kind, "damaged-source");
  assert.equal(thread(v3Id("deputy-diary-one")).archiveGap?.kind, "missing-continuation");
  assert.equal(thread(v3Id("border-day17")).archiveGap?.kind, "missing-continuation");
});

test("member status is not traveler death: 永宁帝 is identity-ended with the traveler unknown, and no label claims a death", () => {
  const yongning = thread(v3Id("yongning-first-year"));
  assert.equal(yongning.author.worldlineStatus, "identity-ended");
  assert.match(yongning.author.statusLabel ?? "", /穿越者后续未知/);
  const labels = [...archive.threads.map((item) => item.author.statusLabel), ...archive.replies.map((item) => item.author.statusLabel)];
  for (const label of labels) assert.doesNotMatch(label ?? "", /死亡|已故|已死/);
  const statuses = new Set([...archive.threads, ...archive.replies].map((item) => item.author.worldlineStatus));
  for (const status of ["identity-ended", "in-transit", "active", "unknown", "returned", "not-yet-crossed", "archive-only"]) {
    assert.ok(statuses.has(status as never), status);
  }
});

test("initial migration parity: all 22 V3 topics and 82 replies exist verbatim on top of the 18 / 20 seed and 10 notes", () => {
  assert.equal(v3.length, 22);
  assert.equal(v3.reduce((sum, item) => sum + item.replies.length, 0), 82);
  for (const topic of v3) {
    const item = thread(v3Id(topic.id));
    assert.equal(item.title, topic.title);
    assert.equal(item.body, topic.body.join("\n\n"));
    assert.equal(item.author.displayName, topic.author);
    assert.equal(item.author.statusLabel, topic.status);
    assert.deepEqual(item.tags, topic.tags);
    assert.equal(Boolean(item.featured), Boolean(topic.featured));
    assert.equal(Boolean(item.archiveGap), Boolean(topic.gap));
    if (topic.gap) assert.equal(item.archiveGap!.note, topic.gap);
    assert.deepEqual(item.relatedThreads ?? [], (topic.related ?? []).map(v3Id));
    assert.equal(Boolean(item.moduleAttachment), Boolean(topic.module));
    assert.equal(item.postType === "knowledge-card", Boolean(topic.knowledge));
    const stored = repliesOf(item.id);
    assert.equal(stored.length, topic.replies.length, item.id);
    stored.forEach((reply, index) => {
      assert.equal(reply.body, topic.replies[index].text);
      assert.equal(reply.author.displayName, topic.replies[index].author);
      assert.equal(reply.author.statusLabel, topic.replies[index].status);
      assert.equal(reply.archiveTime, topic.replies[index].time);
    });
  }
  assert.equal(archive.threads.filter((item) => item.provenance.reference === "seed:ancient-china-forum-v0.1").length, 18);
  assert.equal(archive.threads.filter((item) => item.provenance.reference === "seed:ancient-china-forum-v3-archive").length, 22);
  assert.equal(archive.threads.length, 40);
  assert.equal(archive.replies.length, 102);
  assert.equal(archive.curatedNotes.length, 10);
});

test("the 永宁帝 retrospective keeps its long body, eight real floors and cross-era replies; lengths still vary", () => {
  const yongning = thread(v3Id("yongning-first-year"));
  assert.ok(yongning.body.length > 1800);
  assert.equal(repliesOf(yongning.id).length, 8);
  assert.ok(repliesOf(yongning.id).some((reply) => reply.archiveTime?.includes("归档后")));
  const lengths = archive.threads.map((item) => item.body.length);
  assert.ok(lengths.some((n) => n < 200) && lengths.some((n) => n >= 600) && lengths.some((n) => n > 1800));
});

test("full-text material lives in one source: a phrase that only occurs in a reply resolves to exactly one thread", () => {
  const hits = archive.threads.filter((item) =>
    item.body.includes("那盏灯后来还了") || repliesOf(item.id).some((reply) => reply.body.includes("那盏灯后来还了"))
  );
  assert.deepEqual(hits.map((item) => item.id), [v3Id("yongning-first-year")]);
});

test("ten curated notes, all runtime-approved, each citing threads the forum UI can open", () => {
  assert.equal(archive.curatedNotes.length, 10);
  for (const note of archive.curatedNotes) {
    assert.equal(note.reviewStatus, "approved-for-runtime");
    assert.ok(note.sourceThreads.length > 0);
    for (const source of note.sourceThreads) assert.equal(thread(source).reviewStatus, "approved-for-display");
  }
});

test("retrieval for a local official with ledger capability returns the treasury lesson only", () => {
  const result = retrieveCuratedForumNotes(archive.curatedNotes, {
    worldPack: pack.id,
    identity: "local-official",
    capabilities: ["ledger-evidence-crosscheck"],
    minimumReliability: "corroborated"
  });
  assert.deepEqual(result.map((note) => note.id), ["ck-ancient-china-local-treasury-001"]);
});

test("the two contested heir notes are both retrieved and linked as conflicts, never averaged", () => {
  const result = retrieveCuratedForumNotes(archive.curatedNotes, {
    worldPack: pack.id,
    identity: "heir",
    capabilities: ["multiplex-relationship-graph"],
    minimumReliability: "contested"
  });
  const heirNotes = result.filter((note) => note.id.includes("heir"));
  assert.deepEqual(heirNotes.map((note) => note.id).sort(), [
    "ck-ancient-china-heir-build-own-channel-001",
    "ck-ancient-china-heir-use-existing-channel-001"
  ]);
  for (const note of heirNotes) assert.equal(note.conflictWith.length, 1);
});

test("display-only knowledge cards are not runtime notes and link back to their source threads", () => {
  const cards = archive.threads.filter((item) => item.postType === "knowledge-card");
  assert.deepEqual(cards.map((item) => item.id).sort(), [v3Id("knowledge-accounting"), v3Id("knowledge-first-errand")]);
  for (const card of cards) {
    assert.equal(card.reviewStatus, "approved-for-display");
    assert.ok((card.relatedThreads?.length ?? 0) > 0);
  }
});

test("provenance: everything is maintainer seed with a seed: reference; nothing pretends to be a community contribution", () => {
  for (const item of archive.threads) {
    assert.equal(item.provenance.kind, "maintainer-seed");
    assert.ok(item.provenance.reference.startsWith("seed:"));
    assert.equal(item.provenance.consentToLoreCredit, false);
  }
  const references = new Set(archive.threads.map((item) => item.provenance.reference));
  assert.deepEqual([...references].sort(), ["seed:ancient-china-forum-v0.1", "seed:ancient-china-forum-v3-archive"]);
});

test("a community import with a seed reference, or a seed with a discussion reference, is rejected by validation", () => {
  const [sample] = archive.threads;
  const issues = validateTravelerForumData({
    nodes: archive.nodes,
    threads: [
      { ...sample, id: "tf-x-1", replies: [], provenance: { kind: "community-contribution", reference: "seed:fake", consentToLoreCredit: true } },
      { ...sample, id: "tf-x-2", replies: [], provenance: { kind: "maintainer-seed", reference: "github-discussion:1", consentToLoreCredit: false } }
    ],
    replies: [],
    curatedNotes: []
  });
  assert.deepEqual(issues.map((issue) => issue.code), ["provenance-reference-mismatch", "provenance-reference-mismatch"]);
});
