import type { CoreCapabilityId, ForumReliability } from "./types";

export const FORUM_POST_TYPES = [
  "verified-practice",
  "blood-and-tears",
  "grudge-note",
  "unverified-trick",
  "question",
  "correction",
  "maintainer-argument",
  "case-report"
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

export type ForumAuthor = {
  displayMode: "anonymous" | "consented-credit";
  travelerId: string;
  displayName?: string;
};

export type ForumProvenance = {
  kind: "maintainer-seed" | "community-contribution" | "maintainer-import";
  reference: string;
  consentToLoreCredit: boolean;
};

export type ForumApplicability = {
  identities: string[];
  capabilities: CoreCapabilityId[];
  situations: string[];
};

export type TravelerForumThread = {
  id: string;
  schemaVersion: 1;
  worldPack: string;
  board: string;
  title: string;
  postType: ForumPostType;
  author: ForumAuthor;
  body: string;
  appliesTo: ForumApplicability;
  reliability: ForumReliability;
  reviewStatus: ForumReviewStatus;
  provenance: ForumProvenance;
  replies: string[];
  createdAt: string;
  updatedAt: string;
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
  reviewStatus: ForumReviewStatus;
  version: number;
  conflictsWith?: string[];
  supersedes?: string[];
};

export type TravelerForumData = {
  threads: TravelerForumThread[];
  replies: TravelerForumReply[];
  curatedNotes: TravelerForumCuratedNote[];
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
