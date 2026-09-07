import type { TravelerForumCuratedNote, TravelerForumData, TravelerForumReply, TravelerForumThread } from "@rpmf/core";

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
  return searchTopics(archive, state).map((result) => result.thread);
}

// ---------------------------------------------------------------------------
// Search hits (U1): where a query matched, so the reader can land on the floor
// ---------------------------------------------------------------------------

export type SearchHitKind = "title" | "author" | "tag" | "body" | "reply" | "note";

export type SearchHit = {
  kind: SearchHitKind;
  /** Thread the hit belongs to (for notes: the note's first source thread, if any). */
  threadId: string | null;
  replyId?: string;
  /** 1-based floor number for reply hits. */
  floor?: number;
  noteId?: string;
  snippet: string;
};

export type TopicSearchResult = { thread: TravelerForumThread; hits: SearchHit[] };
export type NoteSearchResult = { note: TravelerForumCuratedNote; hits: SearchHit[] };

export const QUERY_LIMIT = 100;

export function normalizeQuery(q: string): string {
  return q.trim().slice(0, QUERY_LIMIT).toLowerCase();
}

/** A short window around the first match; whitespace collapsed. Falls back to the head of the text. */
export function snippetAround(text: string, q: string, radius = 28): string {
  const flat = text.replace(/\s+/g, " ").trim();
  const index = q ? flat.toLowerCase().indexOf(q) : -1;
  if (index < 0) return flat.length > radius * 2 ? `${flat.slice(0, radius * 2)}…` : flat;
  const start = Math.max(0, index - radius);
  const end = Math.min(flat.length, index + q.length + radius);
  return `${start > 0 ? "…" : ""}${flat.slice(start, end)}${end < flat.length ? "…" : ""}`;
}

/** Every place a normalized query matches inside one thread, in reading order. */
export function topicHits(archive: TravelerForumData, thread: TravelerForumThread, q: string): SearchHit[] {
  if (!q) return [];
  const hits: SearchHit[] = [];
  const has = (text: string | undefined) => !!text && text.toLowerCase().includes(q);
  if (has(thread.title)) hits.push({ kind: "title", threadId: thread.id, snippet: thread.title });
  const author = thread.author.displayName ?? thread.author.travelerId;
  if (has(author) || has(thread.author.statusLabel)) hits.push({ kind: "author", threadId: thread.id, snippet: `${author}${thread.author.statusLabel ? ` · ${thread.author.statusLabel}` : ""}` });
  for (const tag of thread.tags ?? []) if (has(tag)) hits.push({ kind: "tag", threadId: thread.id, snippet: tag });
  if (has(thread.body)) hits.push({ kind: "body", threadId: thread.id, snippet: snippetAround(thread.body, q) });
  repliesOf(archive, thread.id).forEach((reply, index) => {
    const replyAuthor = reply.author.displayName ?? reply.author.travelerId;
    if (has(reply.body) || has(replyAuthor)) {
      hits.push({ kind: "reply", threadId: thread.id, replyId: reply.id, floor: index + 1, snippet: snippetAround(has(reply.body) ? reply.body : replyAuthor, q) });
    }
  });
  return hits;
}

/** Threads matching the filters; with a query, only threads that have at least one hit. */
export function searchTopics(archive: TravelerForumData, state: ForumState): TopicSearchResult[] {
  const q = normalizeQuery(state.q);
  const results: TopicSearchResult[] = [];
  for (const thread of archive.threads) {
    if (!inRealm(thread, state.realm) || (state.node !== "all" && state.node !== thread.node) || !inTab(thread, state.tab)) continue;
    const hits = topicHits(archive, thread, q);
    if (q && !hits.length) continue;
    results.push({ thread, hits });
  }
  return results;
}

/** Curated notes whose lesson, applicability or failure modes match the query. */
export function searchNotes(archive: TravelerForumData, rawQuery: string): NoteSearchResult[] {
  const q = normalizeQuery(rawQuery);
  if (!q) return [];
  const results: NoteSearchResult[] = [];
  for (const note of archive.curatedNotes) {
    const hits: SearchHit[] = [];
    const threadId = note.sourceThreads[0] ?? null;
    const push = (kind: SearchHitKind, text: string) => hits.push({ kind, threadId, noteId: note.id, snippet: snippetAround(text, q) });
    if (note.lesson.toLowerCase().includes(q)) push("note", note.lesson);
    const applies = note.appliesTo as { identities?: string[]; situations?: string[] };
    for (const item of [...(applies.identities ?? []), ...(applies.situations ?? [])]) if (item.toLowerCase().includes(q)) push("note", `适用：${item}`);
    for (const mode of note.failureModes ?? []) if (mode.toLowerCase().includes(q)) push("note", `失效方式：${mode}`);
    if (hits.length) results.push({ note, hits });
  }
  return results;
}

/** Splits text into plain / matched segments so the renderer can escape each and wrap matches. */
export function splitByQuery(text: string, rawQuery: string): { text: string; match: boolean }[] {
  const q = normalizeQuery(rawQuery);
  if (!q) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const segments: { text: string; match: boolean }[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const index = lower.indexOf(q, cursor);
    if (index < 0) break;
    if (index > cursor) segments.push({ text: text.slice(cursor, index), match: false });
    segments.push({ text: text.slice(index, index + q.length), match: true });
    cursor = index + q.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false });
  return segments;
}

export function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

/** Escaped HTML with `<mark>` around every query match. Archive text is never injected raw. */
export function highlightHtml(text: string, rawQuery: string): string {
  return splitByQuery(text, rawQuery)
    .map((segment) => (segment.match ? `<mark>${escapeHtml(segment.text)}</mark>` : escapeHtml(segment.text)))
    .join("");
}

// ---------------------------------------------------------------------------
// URL state (U1): public reading state lives in the hash, nothing private
// ---------------------------------------------------------------------------

export type ForumLocation = ForumState & { topic: string | null; reply: number | null };

const REALMS: ForumRealm[] = ["all", "meta", "eastern"];
const TABS: ForumTab[] = ["all", "featured", "modules", "knowledge", "maintainer"];

/**
 * Parses `#q=…&realm=…&node=…&tab=…&topic=…&reply=N`. The legacy `#topic=<id>`
 * form is the same grammar. Unknown keys are ignored, bad values fall back to
 * defaults, and a malformed encoding never throws: it reports `malformed`.
 */
export function parseHashState(hash: string): { location: ForumLocation; malformed: boolean } {
  const location: ForumLocation = { ...initialForumState, topic: null, reply: null };
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!body) return { location, malformed: false };
  let malformed = false;
  const read = (raw: string | null) => {
    if (raw === null) return null;
    try {
      return decodeURIComponent(raw.replace(/\+/g, " "));
    } catch {
      malformed = true;
      return null;
    }
  };
  for (const pair of body.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const key = read(eq < 0 ? pair : pair.slice(0, eq));
    const value = read(eq < 0 ? "" : pair.slice(eq + 1));
    if (key === null || value === null) continue;
    switch (key) {
      case "q":
        location.q = value.trim().slice(0, QUERY_LIMIT);
        break;
      case "realm":
        if ((REALMS as string[]).includes(value)) location.realm = value as ForumRealm;
        else malformed = true;
        break;
      case "tab":
        if ((TABS as string[]).includes(value)) location.tab = value as ForumTab;
        else malformed = true;
        break;
      case "node":
        if (/^[a-z0-9-]{1,40}$/.test(value)) location.node = value;
        else malformed = true;
        break;
      case "topic":
        if (/^[a-z0-9-]{1,80}$/.test(value)) location.topic = value;
        else malformed = true;
        break;
      case "reply": {
        const floor = Number(value);
        if (Number.isInteger(floor) && floor > 0 && floor < 10000) location.reply = floor;
        else malformed = true;
        break;
      }
      default:
        break;
    }
  }
  if (location.reply !== null && !location.topic) location.reply = null;
  return { location, malformed };
}

/** Only non-default keys are written, so a plain topic link stays `#topic=<id>`. */
export function serializeHashState(location: ForumLocation): string {
  const parts: string[] = [];
  const put = (key: string, value: string) => parts.push(`${key}=${encodeURIComponent(value)}`);
  if (location.q.trim()) put("q", location.q.trim().slice(0, QUERY_LIMIT));
  if (location.realm !== "all") put("realm", location.realm);
  if (location.node !== "all") put("node", location.node);
  if (location.tab !== "all") put("tab", location.tab);
  if (location.topic) put("topic", location.topic);
  if (location.topic && location.reply) put("reply", String(location.reply));
  return parts.length ? `#${parts.join("&")}` : "";
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
