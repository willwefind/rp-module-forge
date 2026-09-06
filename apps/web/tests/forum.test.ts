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
  initialForumState,
  repliesOf,
  resolveTopicId,
  searchText,
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
