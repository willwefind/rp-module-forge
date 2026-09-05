import type {
  ForumAuthor,
  ForumPostType,
  ForumReliability,
  ForumWorldlineStatus,
  TravelerForumReply,
  TravelerForumThread
} from "@rpmf/core";
import { forumMembers, type ForumMemberKey } from "./members.js";

export const WORLD_PACK_ID = "ancient-china";
const ARCHIVE_DATE = "2026-09-04";

/** Founding seed wave (short threads that the curated runtime notes cite). */
export const seedProvenance = {
  kind: "maintainer-seed" as const,
  reference: "seed:ancient-china-forum-v0.1",
  consentToLoreCredit: false
};

/** V3 archive wave (long-form topics promoted from the forum-first prototype). */
export const archiveProvenance = {
  kind: "maintainer-seed" as const,
  reference: "seed:ancient-china-forum-v3-archive",
  consentToLoreCredit: false
};

/** Human status wording -> machine worldline status. Unknown wording throws at load time. */
const WORLDLINE_BY_LABEL: Readonly<Record<string, ForumWorldlineStatus>> = {
  "该次身份已终止 · 穿越者后续未知": "identity-ended",
  "在途 · 已报平安": "in-transit",
  "在途": "in-transit",
  "在途 · 第四十天": "in-transit",
  "任务中": "in-transit",
  "当前仍活跃": "active",
  "状态未知 · 应作者要求改挂": "unknown",
  "状态未知": "unknown",
  "已返回": "returned",
  "仅有档案记录": "archive-only",
  "维护中": "active",
  "尚未穿越": "not-yet-crossed"
};

export function worldlineStatusFor(statusLabel: string): ForumWorldlineStatus {
  const status = WORLDLINE_BY_LABEL[statusLabel];
  if (!status) throw new Error(`Unknown forum status label: ${statusLabel}`);
  return status;
}

/** A registered member at a given moment, e.g. member("6201", "在途 · 第四十天"). */
export function member(key: ForumMemberKey, statusLabel: string): ForumAuthor {
  return { ...forumMembers[key], worldlineStatus: worldlineStatusFor(statusLabel), statusLabel };
}

/** Founding-seed authors: anonymous-NNN travelers and maintainer-NNN members. */
export function anonymous(travelerId: string): ForumAuthor {
  if (travelerId.startsWith("maintainer-")) {
    return {
      displayMode: "lore-signature",
      travelerId,
      displayName: `维护组成员 · #${travelerId.replace(/^maintainer-/, "")}`,
      memberKind: "module-maintainer",
      worldlineStatus: "active",
      statusLabel: "维护中"
    };
  }
  return {
    displayMode: "anonymous",
    travelerId,
    displayName: `匿名老乡 ${travelerId.replace(/^anonymous-/, "")}`,
    memberKind: "traveler",
    worldlineStatus: "archive-only",
    statusLabel: "仅有档案记录"
  };
}

const REPLY_RELIABILITY: Partial<Record<ForumPostType, ForumReliability>> = {
  "verified-practice": "plausible",
  "correction": "plausible",
  "case-report": "anecdotal",
  "question": "unknown",
  "chat": "unknown",
  "author-update": "anecdotal",
  "archive-note": "corroborated",
  "maintainer-argument": "corroborated"
};

export type FloorSpec = {
  replyType: ForumPostType;
  author: ForumAuthor;
  body: string;
  archiveTime: string;
};

/**
 * One stored floor. Defaults mirror the archive convention: same archive
 * period, status "仅有档案记录" unless the member's status at that moment is known.
 */
export function floor(
  replyType: ForumPostType,
  memberKey: ForumMemberKey,
  body: string,
  archiveTime = "同一档案期",
  statusLabel = "仅有档案记录"
): FloorSpec {
  return { replyType, author: member(memberKey, statusLabel), body, archiveTime };
}

export type ArchiveTopicSpec = Omit<
  TravelerForumThread,
  "id" | "schemaVersion" | "worldPack" | "reviewStatus" | "provenance" | "replies" | "createdAt" | "updatedAt"
>;

export type ArchiveTopic = { thread: TravelerForumThread; replies: TravelerForumReply[] };

/**
 * Builds one archive topic with stable ids derived from its slug:
 * thread `tf-ancient-china-<slug>`, floors `tf-reply-<slug>-NN` in stored
 * order. New floors are appended; never renumber a historical floor.
 */
export function archiveTopic(slug: string, spec: ArchiveTopicSpec, floors: FloorSpec[]): ArchiveTopic {
  const id = `tf-ancient-china-${slug}`;
  const replies: TravelerForumReply[] = floors.map((item, index) => ({
    id: `tf-reply-${slug}-${String(index + 1).padStart(2, "0")}`,
    threadId: id,
    parentReplyId: null,
    replyType: item.replyType,
    author: item.author,
    body: item.body,
    reliability: REPLY_RELIABILITY[item.replyType] ?? "unknown",
    reviewStatus: "approved-for-display",
    archiveTime: item.archiveTime
  }));
  const thread: TravelerForumThread = {
    id,
    schemaVersion: 1,
    worldPack: WORLD_PACK_ID,
    reviewStatus: "approved-for-display",
    provenance: archiveProvenance,
    createdAt: ARCHIVE_DATE,
    updatedAt: ARCHIVE_DATE,
    ...spec,
    replies: replies.map((reply) => reply.id)
  };
  return { thread, replies };
}
