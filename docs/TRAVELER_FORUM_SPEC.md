# Traveler Forum Specification V0.1

Status: **normative subsystem specification**  
Ancient China presentation: **天道降维互助论坛**  
Last updated: 2026-09-03

## 1. Purpose

Traveler Forum is a structured knowledge and collaboration layer for field experience: successes, failures, disputes, corrections, and context-sensitive warnings contributed by maintainers and community members.

It is designed to serve three functions at once:

1. preserve the voice and history of practical RP knowledge;
2. create reviewable, reusable knowledge for runtime assistance;
3. let open-source contribution activity participate in the project's fiction without obscuring engineering facts.

## 2. Non-goals

Traveler Forum is not:

- a random joke or quote generator;
- a universal truth database;
- a reputation leaderboard;
- a substitute for source review;
- a mechanism for revealing facts absent from the current RP;
- permission to copy a contributor's identity into lore without consent;
- a replacement for issues, pull requests, commits, changelogs, or release notes.

## 3. Two-layer model

### 3.1 Forum thread layer

The thread layer preserves authored context:

- original post;
- replies and nested disagreement;
- author display choice or anonymous traveler ID;
- applicable world pack, identities, capabilities, and situations;
- provenance and contribution reference;
- reliability and review state;
- corrections, supersession, and moderation history.

Threads are readable lore and source material. They are not automatically prompt-safe.

### 3.2 Curated knowledge layer

Curated notes are bounded claims distilled from one or more reviewed threads. They contain:

- a concise lesson;
- explicit applicability and exclusions;
- evidence/reliability state;
- known failure modes;
- source thread IDs;
- a reason the note may be retrieved;
- review and version information.

In Ancient China, this runtime-facing knowledge layer is presented as 【老乡遗言库】.

## 4. Core entities

### 4.1 Thread

```json
{
  "id": "tf-ancient-china-00018472",
  "schemaVersion": 1,
  "worldPack": "ancient-china",
  "board": "local-governance",
  "title": "县库第三天空了，先查什么？",
  "postType": "blood-and-tears",
  "author": {
    "displayMode": "anonymous",
    "travelerId": "anonymous-047"
  },
  "body": "……",
  "appliesTo": {
    "identities": ["local-official"],
    "capabilities": ["ledger-evidence-crosscheck", "multiplex-relationship-graph"],
    "situations": ["empty-treasury", "suspect-ledgers"]
  },
  "reliability": "contested",
  "reviewStatus": "reviewed-with-caveats",
  "provenance": {
    "kind": "community-contribution",
    "reference": "pull-or-commit-reference",
    "consentToLoreCredit": false
  },
  "replies": ["tf-reply-00018472-01"],
  "createdAt": "2026-09-03",
  "updatedAt": "2026-09-03"
}
```

### 4.2 Reply

```json
{
  "id": "tf-reply-00018472-01",
  "threadId": "tf-ancient-china-00018472",
  "parentReplyId": null,
  "replyType": "correction",
  "author": {
    "displayMode": "anonymous",
    "travelerId": "anonymous-112"
  },
  "body": "先区分账面空、实物空和不可支用。",
  "reliability": "plausible",
  "reviewStatus": "pending"
}
```

### 4.3 Curated note

```json
{
  "id": "ck-ancient-china-local-treasury-001",
  "schemaVersion": 1,
  "worldPack": "ancient-china",
  "capability": "ledger-evidence-crosscheck",
  "lesson": "Before assigning blame for an empty treasury, distinguish book balance, physical stock, earmarked funds, arrears, and inaccessible reserves.",
  "appliesTo": {
    "identities": ["local-official", "regent", "emperor"],
    "situations": ["empty-treasury", "suspect-ledgers"]
  },
  "exclusions": ["does-not-identify-a-culprit"],
  "reliability": "corroborated",
  "failureModes": ["records may be coordinated", "physical inspection may exceed host permission"],
  "sourceThreads": ["tf-ancient-china-00018472"],
  "reviewStatus": "approved-for-runtime",
  "version": 1
}
```

## 5. Controlled vocabularies

### 5.1 Post types

- `verified-practice` — a bounded practice with sufficient supporting review;
- `blood-and-tears` — a failure lesson with contextual value;
- `grudge-note` — emotionally valuable but likely biased;
- `unverified-trick` — plausible, not established;
- `question` — seeks help or missing knowledge;
- `correction` — challenges a claim or scope;
- `maintainer-argument` — preserves design disagreement;
- `case-report` — describes a scenario and outcome.

Post type is not reliability. A vivid blood-and-tears note may still be unverified.

### 5.2 Reliability

- `unknown` — not assessed;
- `anecdotal` — one account with limited verification;
- `plausible` — coherent and contextually possible;
- `contested` — substantive disagreement remains;
- `corroborated` — supported by multiple independent sources or repeat cases;
- `deprecated` — previously used but no longer recommended.

### 5.3 Review status

- `draft`
- `pending`
- `changes-requested`
- `reviewed-with-caveats`
- `approved-for-display`
- `approved-for-runtime`
- `rejected`
- `superseded`

Only `approved-for-runtime` curated notes are eligible for automatic injection.

## 6. Retrieval

Retrieval is an applicability filter, not a popularity contest.

Required filters:

1. world pack compatibility;
2. capability or event match;
3. identity applicability;
4. reliability threshold;
5. review status;
6. explicit exclusions;
7. token budget;
8. duplication and contradiction handling.

Each retrieved item must have a machine-readable `reasonRetrieved`, for example:

```text
Matched local-official + suspect-ledgers + 鱼鳞算盘; corroborated; approved-for-runtime.
```

When two eligible notes conflict, runtime output must preserve the conflict or select neither. It must not silently average them into false certainty.

## 7. Injection policy

Available policies:

- `off` — no forum material;
- `curated-only` — inject eligible curated notes only;
- `curated-plus-links` — inject curated notes and optionally show source thread references;
- `manual` — retrieve candidates but require explicit user selection.

Raw thread bodies must not be automatically injected by default. A thread may be displayed as lore while its claims remain ineligible for runtime advice.

Every injected note must remain subordinate to current-session evidence and identity permissions.

## 8. Contribution-to-lore mapping

Examples:

| Repository event | Optional lore rendering |
| --- | --- |
| PR adds a reviewed note | 有位老乡提交了一条新的批注。 |
| review requests evidence | 维护组要求补交来源与适用边界。 |
| correction is merged | 原帖已追加勘误，后来的老乡请以新版本为准。 |
| entry is deprecated | 此法已被多次事故证伪，封存但不抹除。 |

Rules:

- the ordinary PR/commit/issue reference must remain available;
- lore wording must not hide breaking changes, migration steps, security impact, or validation status;
- contributor handles are used in lore only with explicit consent;
- otherwise use a generated anonymous traveler ID;
- lore IDs and Git identities are separate data;
- rejected or reverted content must not appear as approved wisdom.

## 9. Review checklist

A reviewer checks:

- Is the lesson bounded to a world, identity, capability, and situation?
- Does it distinguish observation from inference?
- Does it claim hidden current-world facts?
- Does it grant an identity unrealistic access or authority?
- Are reliability and provenance honest?
- Are plausible counterexamples or failure modes recorded?
- Is the wording safe to inject without turning anecdote into command?
- Does it duplicate, contradict, or supersede an existing note?
- Has the contributor chosen how they may be credited in lore?

## 10. Moderation and correction

- Preserve corrections and supersession history rather than silently rewriting old debate.
- Remove secrets, personal data, credentials, or content the contributor was not authorized to publish.
- Store the minimum provenance necessary for review.
- Separate content moderation from reliability assessment.
- A popular or entertaining post is not automatically reliable.
- A maintainer may approve display while refusing runtime injection.

## 11. Display requirements

The UI should show, at minimum:

- traveler ID or consented display credit;
- type;
- applicable identity and capability;
- reliability;
- review state when not runtime-approved;
- source thread or curated-note relationship;
- whether the item is an original post, reply, correction, or distilled note.

Example:

```text
【匿名-047 · 血泪批注】
适用：将军 / 边军主帅
关联：烽燧图
可靠度：已交叉印证

“谁再拿‘号称二十万’跟我说事，我先让他把一天粮耗算出来。”

为什么出现：当前事件涉及名义兵力与补给能力不一致。
```

## 12. V0.1 minimum implementation

V0.1 is sufficient when it supports:

- thread, reply, and curated-note data models;
- controlled reliability and review states;
- filters by world pack, identity, capability, and situation;
- `curated-only` and `manual` injection policies;
- source-thread references;
- anonymous-by-default lore attribution;
- deterministic validation fixtures for eligible, ineligible, conflicting, and superseded notes.
