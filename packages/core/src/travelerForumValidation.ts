import type { TravelerForumData } from "./travelerForum";

export type TravelerForumDataIssue = {
  code:
    | "duplicate-id"
    | "missing-thread"
    | "missing-reply"
    | "reply-thread-mismatch"
    | "missing-source-thread"
    | "missing-conflict-note"
    | "self-conflict";
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

  for (const id of duplicateIds(data.threads.map((thread) => thread.id))) {
    issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate thread id: ${id}` });
  }
  for (const id of duplicateIds(data.replies.map((reply) => reply.id))) {
    issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate reply id: ${id}` });
  }
  for (const id of duplicateIds(data.curatedNotes.map((note) => note.id))) {
    issues.push({ code: "duplicate-id", entityId: id, message: `Duplicate curated-note id: ${id}` });
  }

  for (const thread of data.threads) {
    for (const replyId of thread.replies) {
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
