import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { retrieveCuratedForumNotes } from "@rpmf/core";
import { ancientChinaForumArchive } from "@rpmf/pack-ancient-china";
import {
  categories,
  discussionURL,
  filterTopics,
  forgeHref,
  highlightHtml,
  initialForumState,
  parseHashState,
  repliesOf,
  resolveTopicId,
  searchNotes,
  searchText,
  searchTopics,
  serializeHashState,
  snippetAround,
  sourceFileFor,
  topicHref
} from "../src/forum/model.ts";
import { realms } from "../src/forum/worlds.ts";

const archive = ancientChinaForumArchive;
const YONGNING = "tf-ancient-china-yongning-first-year";

test("forum search hits body text and reply text from the unified archive", () => {
  const byReply = filterTopics(archive, { ...initialForumState, q: "那盏灯后来还了" });
  assert.deepEqual(byReply.map((item) => item.id), [YONGNING]);
  const byBody = filterTopics(archive, { ...initialForumState, q: "我明日——" });
  assert.deepEqual(byBody.map((item) => item.id), ["tf-ancient-china-revived-literate-servant"]);
  const bySeedBody = filterTopics(archive, { ...initialForumState, q: "六七个数字穿了一件大衣" });
  assert.deepEqual(bySeedBody.map((item) => item.id), ["tf-ancient-china-000003"]);
  assert.ok(searchText(byReply[0], repliesOf(archive, YONGNING)).includes("那盏灯后来还了"));
});

test("the forum UI and the Runtime reference the same topic ids from the same archive object", () => {
  const forumTopic = filterTopics(archive, { ...initialForumState, q: "亡国之君" })[0];
  assert.equal(forumTopic.id, YONGNING);
  assert.equal(topicHref("/rp-module-forge/", forumTopic.id), `/rp-module-forge/#topic=${YONGNING}`);
  const retrieved = retrieveCuratedForumNotes(archive.curatedNotes, {
    worldPack: "ancient-china",
    identity: "local-official",
    capabilities: ["ledger-evidence-crosscheck"],
    minimumReliability: "corroborated"
  });
  for (const note of retrieved) {
    for (const source of note.sourceThreads) {
      assert.ok(archive.threads.some((thread) => thread.id === source));
      assert.equal(resolveTopicId(archive, source), source);
    }
  }
  const attachment = archive.threads.find((thread) => thread.moduleAttachment)!;
  assert.equal(forgeHref("/rp-module-forge/", attachment.id), `/rp-module-forge/forge/?topic=${attachment.id}`);
});

test("legacy V3 hash links resolve to the stable archive id; unknown ids resolve to nothing", () => {
  assert.equal(resolveTopicId(archive, "yongning-first-year"), YONGNING);
  assert.equal(resolveTopicId(archive, YONGNING), YONGNING);
  assert.equal(resolveTopicId(archive, "tf-ancient-china-000001"), "tf-ancient-china-000001");
  assert.equal(resolveTopicId(archive, "nope"), null);
});

test("tabs and realms partition the archive honestly", () => {
  const all = filterTopics(archive, initialForumState);
  assert.equal(all.length, archive.threads.length);
  const modules = filterTopics(archive, { ...initialForumState, tab: "modules" });
  assert.ok(modules.length >= 1 && modules.every((thread) => thread.postType === "module-release"));
  const knowledge = filterTopics(archive, { ...initialForumState, tab: "knowledge" });
  assert.ok(knowledge.length >= 2 && knowledge.every((thread) => thread.postType === "knowledge-card"));
  const meta = filterTopics(archive, { ...initialForumState, realm: "meta" });
  const world = filterTopics(archive, { ...initialForumState, realm: "eastern" });
  assert.equal(meta.length + world.length, all.length);
  assert.ok(meta.every((thread) => thread.node === "meta") && world.every((thread) => thread.node !== "meta"));
  const featured = filterTopics(archive, { ...initialForumState, tab: "featured" });
  assert.ok(featured.every((thread) => thread.featured));
});

test("every archive topic points at a real source file in the repository", () => {
  for (const thread of archive.threads) {
    const url = sourceFileFor(thread);
    const relative = url.replace("https://github.com/willwefind/rp-module-forge/blob/main/", "");
    assert.ok(existsSync(new URL(`../../../${relative}`, import.meta.url)), relative);
  }
});

test("all seven discussion links use the real form slugs and carry only the category and a public title", () => {
  assert.equal(categories.length, 7);
  for (const [slug] of categories) {
    assert.ok(existsSync(new URL(`../../../.github/DISCUSSION_TEMPLATE/${slug}.yml`, import.meta.url)), slug);
    const url = new URL(discussionURL(slug, "一篇公开档案 & 勘误"));
    assert.equal(url.hostname, "github.com");
    assert.equal(url.pathname, "/willwefind/rp-module-forge/discussions/new");
    assert.equal(url.searchParams.get("category"), slug);
    assert.deepEqual([...url.searchParams.keys()], ["category", "title"]);
  }
  assert.throws(() => discussionURL("unknown"));
});

test("only one realm and one pack are open; everything else renders as planned", () => {
  const openRealms = realms.filter((realm) => realm.open);
  assert.equal(openRealms.length, 1);
  assert.deepEqual(openRealms[0].packs.filter((pack) => pack.open).map((pack) => pack.id), ["ancient-china"]);
  assert.ok(realms.filter((realm) => !realm.open).length >= 3);
});

// ---------------------------------------------------------------------------
// U1 · search hits land on the floor, notes are searchable, URL state is public and safe
// ---------------------------------------------------------------------------

test("U1: a reply phrase reports the exact floor, a body phrase reports the body, a title phrase the title", () => {
  const [lamp] = searchTopics(archive, { ...initialForumState, q: "那盏灯后来还了" });
  assert.equal(lamp.thread.id, YONGNING);
  const replies = repliesOf(archive, YONGNING);
  const expectedFloor = replies.findIndex((reply) => reply.body.includes("那盏灯后来还了")) + 1;
  assert.deepEqual(lamp.hits.map((hit) => [hit.kind, hit.floor]), [["reply", expectedFloor]]);
  assert.equal(expectedFloor, 3, "acceptance path: 「那盏灯后来还了」 lands on floor 3");
  assert.equal(lamp.hits[0].replyId, replies[2].id);
  assert.ok(lamp.hits[0].snippet.includes("那盏灯后来还了"));

  const [body] = searchTopics(archive, { ...initialForumState, q: "我明日——" });
  assert.equal(body.hits[0].kind, "body");
  const [title] = searchTopics(archive, { ...initialForumState, q: "亡国之君" });
  assert.ok(title.hits.some((hit) => hit.kind === "title"));
  assert.equal(searchTopics(archive, { ...initialForumState, q: "这句话档案里绝对没有" }).length, 0);
  assert.equal(searchTopics(archive, initialForumState).length, archive.threads.length, "no query → every thread, no hits");
  assert.ok(searchTopics(archive, initialForumState).every((result) => result.hits.length === 0));
});

test("U1: deep floors are found too, and the search is case-insensitive on Latin text", () => {
  const deep = archive.threads.filter((thread) => thread.replies.length >= 6);
  assert.ok(deep.length >= 1, "at least one thread has six or more floors");
  const thread = deep[0];
  const target = repliesOf(archive, thread.id)[5];
  const phrase = target.body.slice(0, 8);
  const hits = searchTopics(archive, { ...initialForumState, q: phrase }).find((result) => result.thread.id === thread.id)!.hits;
  assert.ok(hits.some((hit) => hit.kind === "reply" && hit.floor === 6));
  const upper = searchTopics(archive, { ...initialForumState, q: "RP" });
  const lower = searchTopics(archive, { ...initialForumState, q: "rp" });
  assert.deepEqual(upper.map((result) => result.thread.id), lower.map((result) => result.thread.id));
});

test("U1: curated notes are searchable by lesson, applicability and failure mode, with exact counts", () => {
  const note = archive.curatedNotes[0];
  const byLesson = searchNotes(archive, note.lesson.slice(2, 8));
  assert.ok(byLesson.some((result) => result.note.id === note.id));
  const withFailure = archive.curatedNotes.find((item) => item.failureModes.length)!;
  const byFailure = searchNotes(archive, withFailure.failureModes[0].slice(0, 6));
  assert.ok(byFailure.some((result) => result.note.id === withFailure.id && result.hits.some((hit) => hit.snippet.startsWith("失效方式："))));
  const byIdentity = searchNotes(archive, withFailure.appliesTo.identities[0] ?? "servant");
  assert.ok(byIdentity.every((result) => result.hits.length >= 1));
  assert.deepEqual(searchNotes(archive, ""), []);
  assert.deepEqual(searchNotes(archive, "这句话经验卡里绝对没有"), []);
});

test("U1: highlighting escapes archive text and never injects raw HTML", () => {
  const html = highlightHtml("<b>那盏灯</b> & 灯", "灯");
  assert.equal(html, "&lt;b&gt;那盏<mark>灯</mark>&lt;/b&gt; &amp; <mark>灯</mark>");
  assert.equal(highlightHtml("<script>alert(1)</script>", "<script>"), "<mark>&lt;script&gt;</mark>alert(1)&lt;/script&gt;");
  assert.equal(highlightHtml("plain", ""), "plain");
  assert.ok(snippetAround("a".repeat(200) + "灯" + "b".repeat(200), "灯").length < 80);
});

test("U1: hash state round-trips, keeps the legacy #topic= form, ignores junk and never throws on bad encoding", () => {
  const location = { realm: "eastern" as const, node: "emperor", tab: "featured" as const, q: "那盏灯 后来", topic: YONGNING, reply: 3 };
  const hash = serializeHashState(location);
  assert.deepEqual(parseHashState(hash), { location, malformed: false });
  assert.equal(serializeHashState({ ...initialForumState, topic: YONGNING, reply: null }), `#topic=${YONGNING}`);
  assert.equal(serializeHashState({ ...initialForumState, topic: null, reply: null }), "");
  const legacy = parseHashState("#topic=yongning-first-year");
  assert.equal(resolveTopicId(archive, legacy.location.topic!), YONGNING);
  assert.equal(legacy.location.reply, null);
  const junk = parseHashState("#q=%E0%A4%A&realm=mars&tab=all&reply=3&secret=notes&topic=../x");
  assert.equal(junk.malformed, true);
  assert.equal(junk.location.realm, "all");
  assert.equal(junk.location.topic, null);
  assert.equal(junk.location.reply, null, "reply without a valid topic is dropped");
  assert.ok(!JSON.stringify(junk.location).includes("secret"));
  assert.doesNotThrow(() => parseHashState("#%%%&&&==="));
  assert.equal(parseHashState("#reply=-1&topic=" + YONGNING).malformed, true);
  assert.equal(parseHashState("#q=" + "x".repeat(500)).location.q.length, 100);
});
