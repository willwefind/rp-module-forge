import type { TravelerForumData, TravelerForumReply, TravelerForumThread } from "@rpmf/core";

export const DISCUSSIONS = "https://github.com/willwefind/rp-module-forge/discussions";
export const REPO_BLOB = "https://github.com/willwefind/rp-module-forge/blob/main";

/** [category slug, title, description]. Slugs equal the Discussion Form file names. */
export const categories = [
  ["rp-实战回报", "🎭 RP 实战回报", "开局、转折、翻车与后来才懂的事。"],
  ["模块投稿", "🧩 模块投稿", "分享模块组合、适用身份与使用边界。"],
  ["世界包提案", "🌌 世界包提案", "提出新世界；提案不代表世界包已开放。"],
  ["经验复现与勘误", "🧪 经验复现与勘误", "带着条件、反例或补充材料回来。"],
  ["求助与问答", "🙋 求助与问答", "使用、配置和贡献问题，向真人老乡请教。"],
  ["反馈与点子", "💡 反馈与点子", "哪里别扭、哪里想多走一步，告诉维护组。"],
  ["天道公告", "📣 天道公告", "维护组发布；普通成员请使用反馈或问答分类。"]
] as const;

export type CategorySlug = (typeof categories)[number][0];

/** Only the category and a public title ever travel to GitHub. */
export function discussionURL(slug: string, title = ""): string {
  if (!categories.some((category) => category[0] === slug)) throw new Error("未知分类");
  const url = new URL(`${DISCUSSIONS}/new`);
  url.searchParams.set("category", slug);
  if (title) url.searchParams.set("title", `【档案评议】${title}`);
  return url.href;
}

export type ForumRealm = "all" | "meta" | "eastern";
export type ForumTab = "all" | "featured" | "modules" | "knowledge" | "maintainer";

export type ForumState = {
  realm: ForumRealm;
  node: string;
  tab: ForumTab;
  q: string;
};

export const initialForumState: ForumState = { realm: "all", node: "all", tab: "all", q: "" };

export function repliesOf(archive: TravelerForumData, threadId: string): TravelerForumReply[] {
  const thread = archive.threads.find((item) => item.id === threadId);
  if (!thread) return [];
  const byId = new Map(archive.replies.map((reply) => [reply.id, reply]));
  return thread.replies.map((id) => byId.get(id)).filter((reply): reply is TravelerForumReply => Boolean(reply));
}

export function bodyParagraphs(body: string): string[] {
  return body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

/** Everything a reader could reasonably search: title, signature, status, tags, body, every floor. */
export function searchText(thread: TravelerForumThread, replies: readonly TravelerForumReply[]): string {
  return [
    thread.title,
    thread.author.displayName ?? thread.author.travelerId,
    thread.author.statusLabel ?? "",
    ...(thread.tags ?? []),
    thread.body,
    ...replies.flatMap((reply) => [reply.author.displayName ?? reply.author.travelerId, reply.body])
  ]
    .join(" ")
    .toLowerCase();
}

function inRealm(thread: TravelerForumThread, realm: ForumRealm) {
  if (realm === "all") return true;
  return realm === "meta" ? thread.node === "meta" : thread.node !== "meta";
}

function inTab(thread: TravelerForumThread, tab: ForumTab) {
  switch (tab) {
    case "all":
      return true;
    case "featured":
      return Boolean(thread.featured);
    case "modules":
      return thread.postType === "module-release";
    case "knowledge":
      return thread.postType === "knowledge-card";
    case "maintainer":
      return thread.node === "meta";
  }
}

export function filterTopics(archive: TravelerForumData, state: ForumState): TravelerForumThread[] {
  const q = state.q.trim().toLowerCase();
  return archive.threads.filter(
    (thread) =>
      inRealm(thread, state.realm) &&
      (state.node === "all" || state.node === thread.node) &&
      inTab(thread, state.tab) &&
      (!q || searchText(thread, repliesOf(archive, thread.id)).includes(q))
  );
}

/**
 * Resolves a `#topic=` hash. Accepts the stable archive id and, for links
 * shared from the retired V3 prototype, the bare slug (`yongning-first-year`).
 */
export function resolveTopicId(archive: TravelerForumData, raw: string): string | null {
  const candidates = [raw, `tf-ancient-china-${raw}`];
  return candidates.find((id) => archive.threads.some((thread) => thread.id === id)) ?? null;
}

/** Repository file that holds this topic's source text. */
export function sourceFileFor(thread: TravelerForumThread): string {
  const seed = /^tf-ancient-china-\d{6}$/.test(thread.id);
  const file = seed ? "seed.ts" : `topics/${thread.id.replace(/^tf-ancient-china-/, "")}.ts`;
  return `${REPO_BLOB}/packages/pack-ancient-china/src/forum/${file}`;
}

/** The workshop lives under the same base path; a topic id lets it show the attachment context. */
export function forgeHref(base: string, topicId?: string): string {
  const root = base.endsWith("/") ? base : `${base}/`;
  return topicId ? `${root}forge/?topic=${encodeURIComponent(topicId)}` : `${root}forge/`;
}

export function topicHref(base: string, topicId: string): string {
  const root = base.endsWith("/") ? base : `${base}/`;
  return `${root}#topic=${encodeURIComponent(topicId)}`;
}
