import { FORUM_PROVENANCE_REFERENCE_PREFIX, type TravelerForumData } from "./travelerForum.js";

export type TravelerForumDataIssue = {
  code:
    | "duplicate-id"
    | "missing-thread"
    | "missing-reply"
    | "reply-thread-mismatch"
    | "reply-not-listed"
    | "missing-source-thread"
    | "missing-source-reply"
    | "missing-conflict-note"
    | "self-conflict"
    | "missing-node"
    | "missing-related-thread"
    | "self-related"
    | "empty-gap-note"
    | "provenance-reference-mismatch"
    | "attachment-world-mismatch";
  entityId: string;
  message: string;
};

function duplicateIds(ids: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates].sort();
}

export function validateTravelerForumData(data: TravelerForumData): TravelerForumDataIssue[] {
  const issues: TravelerForumDataIssue[] = [];
  const threadById = new Map(data.threads.map((thread) => [thread.id, thread]));
  const replyById = new Map(data.replies.map((reply) => [reply.id, reply]));
  const noteById = new Map(data.curatedNotes.map((note) => [note.id, note]));
  const nodeIds = data.nodes ? new Set(data.nodes.map((node) => node.id)) : null;

  for (const id of duplicateIds(data.threads.map((thread) => thread.id))) {
    issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate thread id: ${id}` });
  }
  for (const id of duplicateIds(data.replies.map((reply) => reply.id))) {
    issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate reply id: ${id}` });
  }
  for (const id of duplicateIds(data.curatedNotes.map((note) => note.id))) {
    issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate curated-note id: ${id}` });
  }
  if (data.nodes) {
    for (const id of duplicateIds(data.nodes.map((node) => node.id))) {
      issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate node id: ${id}` });
    }
  }

  const listedReplies = new Set<string>();
  for (const thread of data.threads) {
    if (nodeIds && !nodeIds.has(thread.node)) {
      issues.push({ code: "missing-node", entityId: thread.id, message: `Thread ${thread.id} uses unknown node ${thread.node}` });
    }

    const expectedPrefix = FORUM_PROVENANCE_REFERENCE_PREFIX[thread.provenance.kind];
    if (!expectedPrefix || !thread.provenance.reference.startsWith(expectedPrefix)) {
      issues.push({
        code: "provenance-reference-mismatch",
        entityId: thread.id,
        message: `Thread ${thread.id} provenance ${thread.provenance.kind} must reference ${expectedPrefix ?? "a known prefix"}`
      });
    }

    if (thread.archiveGap && !thread.archiveGap.note.trim()) {
      issues.push({ code: "empty-gap-note", entityId: thread.id, message: `Thread ${thread.id} declares an archive gap without a reason` });
    }

    for (const relatedId of thread.relatedThreads ?? []) {
      if (relatedId === thread.id) {
        issues.push({ code: "self-related", entityId: thread.id, message: `Thread ${thread.id} cannot relate to itself` });
      } else if (!threadById.has(relatedId)) {
        issues.push({ code: "missing-related-thread", entityId: thread.id, message: `Thread ${thread.id} relates to missing thread ${relatedId}` });
      }
    }

    if (thread.moduleAttachment && thread.moduleAttachment.worldPack !== thread.worldPack) {
      issues.push({
        code: "attachment-world-mismatch",
        entityId: thread.id,
        message: `Thread ${thread.id} attachment targets ${thread.moduleAttachment.worldPack} but the thread belongs to ${thread.worldPack}`
      });
    }

    for (const replyId of thread.replies) {
      listedReplies.add(replyId);
      const reply = replyById.get(replyId);
      if (!reply) {
        issues.push({
          code: "missing-reply",
          entityId: thread.id,
          message: `Thread ${thread.id} references missing reply ${replyId}`
        });
      } else if (reply.threadId !== thread.id) {
        issues.push({
          code: "reply-thread-mismatch",
          entityId: reply.id,
          message: `Reply ${reply.id} belongs to ${reply.threadId} but is listed by ${thread.id}`
        });
      }
    }
  }

  for (const reply of data.replies) {
    if (!threadById.has(reply.threadId)) {
      issues.push({
        code: "missing-thread",
        entityId: reply.id,
        message: `Reply ${reply.id} references missing thread ${reply.threadId}`
      });
    } else if (!listedReplies.has(reply.id)) {
      issues.push({
        code: "reply-not-listed",
        entityId: reply.id,
        message: `Reply ${reply.id} is stored but thread ${reply.threadId} does not list it, so the visible count would lie`
      });
    }
  }

  for (const note of data.curatedNotes) {
    for (const sourceThread of note.sourceThreads) {
      if (!threadById.has(sourceThread)) {
        issues.push({
          code: "missing-source-thread",
          entityId: note.id,
          message: `Curated note ${note.id} references missing source thread ${sourceThread}`
        });
      }
    }

    for (const sourceReply of note.sourceReplies ?? []) {
      if (!replyById.has(sourceReply)) {
        issues.push({
          code: "missing-source-reply",
          entityId: note.id,
          message: `Curated note ${note.id} references missing source reply ${sourceReply}`
        });
      }
    }

    for (const conflictId of note.conflictsWith ?? []) {
      if (conflictId === note.id) {
        issues.push({
          code: "self-conflict",
          entityId: note.id,
          message: `Curated note ${note.id} cannot conflict with itself`
        });
      } else if (!noteById.has(conflictId)) {
        issues.push({
          code: "missing-conflict-note",
          entityId: note.id,
          message: `Curated note ${note.id} references missing conflict note ${conflictId}`
        });
      }
    }
  }

  return issues.sort((a, b) => a.entityId.localeCompare(b.entityId) || a.code.localeCompare(b.code));
}
