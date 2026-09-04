# Forum Content Scale V0 · 帖子不能只剩标题和两句话

Status: **content / data-quality proposal**  
Last updated: 2026-09-04

V3 review implementation: 22 independently authored topics and 82 stored replies (after the 2026-09-04 second wave), full body/reply search, explicit interrupted content, per-topic provenance and exact loaded/stored counts. The previous 428-floor decoration has no verifiable backing and is removed. See [review record](FORUM_V3_REVIEW.md); the larger production corpus remains a future phase.

## 1. Problem

The founding repository seed proved that forum data can exist without runtime fabrication, but it is still deliberately small: many bodies are short and reply chains are sparse.

A production forum cannot show `428 回复` and then open into two sentences unless it explicitly says the rest of the archive is unavailable / unloaded.

Topic metadata and visible content must tell the same truth.

## 2. Length diversity, not universal long-form

Do not make every post equally long.

A healthy corpus should include:

- panic / micro posts: ~20–120 Chinese characters;
- ordinary questions / reports: ~150–600 characters;
- substantial case reports: ~600–1800 characters;
- long retrospectives / guides / serials: ~1800–6000+ characters;
- interrupted posts whose shortness is part of their history.

The point is believable variation, not a minimum word-count contest.

## 3. Reply depth

Replies also need varied depth:

- one-line jokes / warnings;
- clarifying questions;
- arguments spanning several floors;
- later corrections;
- personal recognition of the author;
- maintainer annotations years later;
- revival by a traveler centuries later.

A featured historical thread should usually have enough representative replies to establish its social life, not just one maintainer footnote.

## 4. Count integrity

For every topic, distinguish:

```text
storedReplyCount     — replies actually present in repository/community data
reportedArchiveCount — optional historical total known from an archive index
loadedReplyCount     — replies currently rendered by paginated UI
```

Rules:

1. never invent a large visible count merely for atmosphere;
2. if `reportedArchiveCount > storedReplyCount`, the UI must say why the difference exists;
3. pagination may render only a subset, but the underlying total must come from real stored/source metadata;
4. search/index counters must not imply content exists when it does not;
5. deleted/lost archive gaps may be represented explicitly as gaps.

Example:

```text
档案索引：428 楼
当前已加载：1–20 楼
第 213–227 楼：档案损坏
```

This is valid if those counts/gaps are part of the topic data.

## 5. The 永宁帝 fixture

`《穿成亡国之君的第一年：我做对了什么、做错了什么》` is a useful acceptance fixture because it tests:

- long reflective body;
- interrupted ending;
- author identity ending without asserting traveler death;
- hundreds-of-years chronology;
- many later replies;
- emotional force created by forum structure rather than narrator exposition.

Its lore annotation should prefer:

> 永宁帝身份于永宁三年殉国；该穿越者后续状态未知。

not:

> 作者已死亡。

unless that stronger fact is actually established.

## 6. Founding corpus expansion

Before forum-first becomes the production homepage, expand the current seed in waves rather than bulk-filling generic prose.

Recommended sequence:

### Wave A — anchor threads

Deepen 8–12 memorable anchor threads across different identities / emotions. Give them complete bodies and meaningful reply chains.

### Wave B — breadth

Add many shorter ordinary posts so the forum is not composed only of cinematic lore pieces.

### Wave C — longitudinal history

Add edits, revivals, corrections, author-status notes, cross-links and module derivations so threads feel like they existed over time.

### Wave D — real community

Import approved GitHub Discussions material without rewriting everyone into one house voice.

## 7. Content provenance

Generated founding content is still `maintainer-seed` and must not pretend to be real users.

Real-community material is `community-contribution` and preserves source/consent metadata.

A large-looking forum must never fake a large real community.

## 8. Search result quality

Search should index enough actual body/reply text to return meaningful matches. Titles/tags-only search is acceptable for a concept prototype but not the final forum experience.

Future search facets may include realm, pack, node, member kind, author, identity, Agenda, capability, topic type, reliability and time.

## 9. Acceptance criteria

Before production forum migration:

- no featured topic has a misleading reply/view count;
- anchor threads have enough body and replies to justify their prominence;
- topic lengths visibly vary;
- reply voices visibly vary;
- interrupted/missing content is represented as an explicit state;
- author identity ending is separate from traveler existence;
- real-community imports retain their original voice and provenance;
- the current 18/20 canonical founding seed and 22/82 V3 archive are treated as a beginning, not a finished corpus.
