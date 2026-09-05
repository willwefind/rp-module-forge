import type { CoreCapabilityId, ForumReliability } from "./types";

/**
 * Post / reply kinds. The first eight are the founding seed vocabulary; the
 * rest were added when the V3 archive became the production forum source so
 * that one enum can describe every stored topic and floor.
 */
export const FORUM_POST_TYPES = [
  "verified-practice",
  "blood-and-tears",
  "grudge-note",
  "unverified-trick",
  "question",
  "correction",
  "maintainer-argument",
  "case-report",
  "retrospective",
  "serial",
  "good-news",
  "chat",
  "module-release",
  "knowledge-card",
  "community-gateway",
  "maintenance-record",
  "revived-thread",
  "archive-note",
  "author-update"
] as const;

export type ForumPostType = (typeof FORUM_POST_TYPES)[number];

export const FORUM_REVIEW_STATUSES = [
  "draft",
  "pending",
  "changes-requested",
  "reviewed-with-caveats",
  "approved-for-display",
  "approved-for-runtime",
  "rejected",
  "superseded"
] as const;

export type ForumReviewStatus = (typeof FORUM_REVIEW_STATUSES)[number];

/** Forum-facing member classes. Presentation only; never an RP permission. */
export const FORUM_MEMBER_KINDS = [
  "traveler",
  "traveler-reserve",
  "active-traveler",
  "professional-traveler",
  "temporal-bureau-field",
  "temporal-bureau-archive",
  "temporal-bureau-logistics",
  "module-maintainer",
  "community-member"
] as const;

export type ForumMemberKind = (typeof FORUM_MEMBER_KINDS)[number];

/**
 * Presence / worldline status of a forum member at the time of a post.
 * `identity-ended` means one transmigration identity finished; it never
 * asserts that the traveler themself ceased to exist. There is deliberately
 * no `dead` state.
 */
export const FORUM_WORLDLINE_STATUSES = [
  "active",
  "in-transit",
  "identity-ended",
  "returned",
  "missing",
  "unknown",
  "not-yet-crossed",
  "archive-only"
] as const;

export type ForumWorldlineStatus = (typeof FORUM_WORLDLINE_STATUSES)[number];

export type ForumAuthor = {
  displayMode: "anonymous" | "lore-signature" | "consented-credit";
  /** Stable member id inside the archive, e.g. `member-6201`. */
  travelerId: string;
  /** Forum signature shown in the reading surface. */
  displayName?: string;
  memberKind?: ForumMemberKind;
  worldlineStatus?: ForumWorldlineStatus;
  /** Human status wording as it appeared in the archive, e.g. 在途 · 已报平安. */
  statusLabel?: string;
};

export type ForumProvenanceKind = "maintainer-seed" | "community-contribution" | "maintainer-import";

export type ForumProvenance = {
  kind: ForumProvenanceKind;
  /**
   * Machine reference whose prefix must match the kind:
   * `seed:` for maintainer-seed, `github-discussion:` for community-contribution,
   * `import:` for maintainer-import. The validator enforces this so seed lore
   * and real community material can never be confused.
   */
  reference: string;
  consentToLoreCredit: boolean;
};

export const FORUM_PROVENANCE_REFERENCE_PREFIX: Readonly<Record<ForumProvenanceKind, string>> = {
  "maintainer-seed": "seed:",
  "community-contribution": "github-discussion:",
  "maintainer-import": "import:"
};

export type ForumApplicability = {
  identities: string[];
  capabilities: CoreCapabilityId[];
  situations: string[];
};

/** One forum section inside a world pack (or the meta board). */
export type ForumNode = {
  id: string;
  label: string;
  realm: "world" | "meta";
};

export type ForumArchiveGapKind =
  | "interrupted"
  | "missing-continuation"
  | "damaged-source"
  | "unverifiable-count-removed";

export type ForumArchiveGap = {
  kind: ForumArchiveGapKind;
  /** Why the archive is incomplete, in reader-facing words. Required. */
  note: string;
};

/**
 * Structured attachment on a module-release topic. It points at pack entities
 * by stable id; it never installs anything and never carries permissions.
 */
export type ForumModuleAttachment = {
  label: string;
  version: string;
  worldPack: string;
  suggestedIdentity: string;
  capabilities: CoreCapabilityId[];
  experts: string[];
  note: string;
};

export type TravelerForumThread = {
  id: string;
  schemaVersion: 1;
  worldPack: string;
  /** Primary forum node id. */
  node: string;
  title: string;
  postType: ForumPostType;
  author: ForumAuthor;
  /** Paragraphs separated by blank lines; single newlines are soft breaks. */
  body: string;
  appliesTo: ForumApplicability;
  reliability: ForumReliability;
  reviewStatus: ForumReviewStatus;
  provenance: ForumProvenance;
  /** Stored reply ids in floor order. The visible count is always this length. */
  replies: string[];
  createdAt: string;
  updatedAt: string;
  /** Display tags for scanning; never a permission or applicability source. */
  tags?: string[];
  /** Narrative time label, e.g. 王朝档案 / 约三百年前 · 叙事时间. */
  archiveTime?: string;
  featured?: boolean;
  /** Maintainer review wording shown in lists, e.g. 复盘样本 · 不自动进入经验库. */
  reviewNote?: string;
  archiveGap?: ForumArchiveGap;
  relatedThreads?: string[];
  moduleAttachment?: ForumModuleAttachment;
};

export type TravelerForumReply = {
  id: string;
  threadId: string;
  parentReplyId: string | null;
  replyType: ForumPostType;
  author: ForumAuthor;
  body: string;
  reliability: ForumReliability;
  reviewStatus: ForumReviewStatus;
  /** Narrative time label relative to the thread, e.g. 归档后第九年. */
  archiveTime?: string;
};

export type TravelerForumCuratedNote = {
  id: string;
  schemaVersion: 1;
  worldPack: string;
  capability: CoreCapabilityId;
  lesson: string;
  appliesTo: {
    identities: string[];
    situations: string[];
  };
  exclusions: string[];
  reliability: ForumReliability;
  failureModes: string[];
  sourceThreads: string[];
  /** Optional specific floors the lesson was distilled from. */
  sourceReplies?: string[];
  reviewStatus: ForumReviewStatus;
  version: number;
  conflictsWith?: string[];
  supersedes?: string[];
};

export type TravelerForumData = {
  threads: TravelerForumThread[];
  replies: TravelerForumReply[];
  curatedNotes: TravelerForumCuratedNote[];
  /** Node registry. When present, every thread node must resolve here. */
  nodes?: ForumNode[];
};

export type TravelerForumQuery = {
  worldPack: string;
  identity: string;
  capabilities: CoreCapabilityId[];
  situations?: string[];
  exclusions?: string[];
  minimumReliability: ForumReliability;
  maxNotes?: number;
};

export type RetrievedCuratedNote = TravelerForumCuratedNote & {
  reasonRetrieved: string;
  conflictWith: string[];
};

const RELIABILITY_RANK: Readonly<Record<Exclude<ForumReliability, "deprecated">, number>> = {
  unknown: 0,
  anecdotal: 1,
  plausible: 2,
  contested: 3,
  corroborated: 4
};

function meetsReliability(value: ForumReliability, minimum: ForumReliability) {
  if (value === "deprecated" || minimum === "deprecated") return false;
  return RELIABILITY_RANK[value] >= RELIABILITY_RANK[minimum];
}

function overlaps(left: readonly string[], right: readonly string[]) {
  return left.some((item) => right.includes(item));
}

export function retrieveCuratedForumNotes(
  notes: readonly TravelerForumCuratedNote[],
  query: TravelerForumQuery
): RetrievedCuratedNote[] {
  const situations = query.situations ?? [];
  const exclusions = query.exclusions ?? [];
  const maxNotes = Math.max(0, query.maxNotes ?? 6);

  const eligible = notes.filter((note) => {
    if (note.worldPack !== query.worldPack) return false;
    if (note.reviewStatus !== "approved-for-runtime") return false;
    if (!meetsReliability(note.reliability, query.minimumReliability)) return false;
    if (note.appliesTo.identities.length && !note.appliesTo.identities.includes(query.identity)) return false;
    if (!query.capabilities.includes(note.capability)) return false;
    if (situations.length && note.appliesTo.situations.length && !overlaps(note.appliesTo.situations, situations)) return false;
    if (exclusions.length && overlaps(note.exclusions, exclusions)) return false;
    return true;
  });

  eligible.sort((a, b) => {
    const aRank = a.reliability === "deprecated" ? -1 : RELIABILITY_RANK[a.reliability];
    const bRank = b.reliability === "deprecated" ? -1 : RELIABILITY_RANK[b.reliability];
    return bRank - aRank || a.id.localeCompare(b.id);
  });

  const selected = eligible.slice(0, maxNotes);
  const selectedIds = new Set(selected.map((note) => note.id));

  return selected.map((note) => {
    const matchedSituations = note.appliesTo.situations.filter((item) => situations.includes(item));
    const reasonParts = [
      `world=${query.worldPack}`,
      `identity=${query.identity}`,
      `capability=${note.capability}`,
      `reliability=${note.reliability}`,
      "review=approved-for-runtime"
    ];
    if (matchedSituations.length) reasonParts.push(`situations=${matchedSituations.join(",")}`);

    return {
      ...note,
      reasonRetrieved: reasonParts.join("; "),
      conflictWith: (note.conflictsWith ?? []).filter((id) => selectedIds.has(id))
    };
  });
}
