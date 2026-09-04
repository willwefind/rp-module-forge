# Forum Interaction & GitHub Discussions V0

Status: **product contract; V3 review implementation available**
Last updated: 2026-09-04

Implementation record: [Forum V3 review](FORUM_V3_REVIEW.md). The seven Chinese category slugs and forms are now live in the repository; there is no remaining slug-collection prerequisite.

## 1. Phase-1 interaction truth

The public forum shell is static-first and free-first. GitHub Discussions is the first real account / posting / reply / reaction layer.

Therefore:

```text
product forum UI
  ├── repository-backed archive threads
  ├── reviewed community imports
  └── actions that hand real participation to GitHub Discussions
```

Do not build a second username/password system yet.

## 2. Can users open new topics?

Yes.

Phase 1 behavior:

- `＋ 发主题` opens an in-site Chinese category chooser;
- the user signs in with GitHub;
- the chosen category opens its corresponding GitHub form, where they submit a real Discussion;
- the Discussion remains the real source of record;
- optional repository/lore import happens only after consent + review.

GitHub supports custom Discussion categories and category forms. The seven forms now live under `.github/DISCUSSION_TEMPLATE/` and ask structured questions before submission.

## 3. Can users reply / comment?

Yes.

For Discussion-origin topics, comments and replies stay on the source Discussion during Phase 1.

For repository-authored archive topics, the historical body should not be rewritten by modern users. A visible action such as:

```text
参与评议 / 勘误 / 实战复现
```

should lead to a real Discussion layer associated with that archive topic.

Later the product may read back public counts / selected comments, but the source Discussion remains authoritative for the real conversation.

## 4. Can users evaluate existing posts?

Yes, but “评价” should not collapse into one universal upvote score.

Useful first-stage signals include:

- 👍 有用 / helped me;
- 🧪 我复现过 / tested in play;
- ⚠️ 适用性存疑;
- 🧯 我踩过这个坑;
- ordinary GitHub reactions and comments.

Phase 1 stores real interaction on GitHub Discussions rather than inventing a local database.

Popularity is not reliability. Reaction counts must never directly promote a post into 【老乡经验库】.

## 5. Archive thread vs live community thread

### Repository archive thread

- authored / reviewed content stored in the repo;
- body and historical replies are versioned project data;
- modern readers may discuss it in an attached real-community Discussion;
- original archive text is not silently mutated by community reactions.

### Live community thread

- originates in GitHub Discussions;
- GitHub account is the real attribution source;
- can later be imported into repository forum data with provenance and consent;
- can later produce a separately reviewed curated note.

## 6. 本局档案切换

The forum account and the RP session profile are different concepts.

One GitHub user may keep many RP profiles:

```text
婢女小日子线
永宁帝线
流浪画师线
某个修仙散修线
```

Phase-1 profile storage is browser-local:

- store profile metadata in `localStorage`;
- switch profiles without login;
- changing profile updates current world pack, identity, Agenda and compatibility hints;
- browsing another pack does not mutate the selected RP profile;
- later add JSON export/import before considering cloud sync.

No RP profile data is posted to GitHub unless the user explicitly chooses to share it.

## 7. Chinese Discussions category plan

GitHub category names, descriptions and emojis are customizable, so the real community can be presented in Chinese.

Recommended first set:

| 中文分类 | GitHub format | 用途 |
| --- | --- | --- |
| 📣 天道公告 | Announcement | 维护组公告、版本与重要变更 |
| 💡 反馈与点子 | Open-ended | UX、功能建议、Bug 体验反馈 |
| 🎭 RP 实战回报 | Open-ended | 开局复盘、血泪史、成功/失败案例 |
| 🧩 模块投稿 | Open-ended | 新模块、改版、兼容性发现 |
| 🌌 世界包提案 | Open-ended | 架空王朝之外的新世界、身份、专家与内容 |
| 🧪 经验复现与勘误 | Open-ended | 对已有档案帖/经验的复现、反例、补充 |
| 🙋 求助与问答 | Q&A | 使用、贡献、设计问题 |

Do not create one category per fictional world yet. GitHub supports up to a bounded category set and real traffic should decide when subdivision is justified.

## 8. Category forms

The seven Chinese categories now have corresponding `.github/DISCUSSION_TEMPLATE/<category-slug>.yml` forms. V3 constructs direct new-discussion URLs from those exact slugs.

Shared fields may include:

- 你想讨论什么;
- 关联世界域 / 世界包;
- 如果是 RP 实战：开局身份 / 路线;
- 是否希望未来被整理进产品论坛;
- 论坛署名方式: preset / custom / GitHub handle;
- 自定义署名（可选）;
- 是否允许保留原文措辞;
- 其他上下文.

The original Discussion remains editable by its author according to GitHub behavior; repository import is a separate reviewed snapshot.

## 9. Interaction links in the product

V0 shell should expose:

- `＋ 发主题` → in-site category chooser → corresponding Discussion form;
- `这里的老乡是真的` → Discussions home;
- `参与评议 / 勘误` → related Discussion or the appropriate category;
- `回复真人讨论` → source Discussion;
- provenance badge / source link for imported real contributions.

Do not pretend a static prototype has written a reaction when it has not.

## 10. Future read-only sync

A later free-first enhancement may use GitHub Actions to periodically materialize public Discussion metadata into static JSON for Pages, for example:

- title;
- category;
- author / approved lore alias;
- comment count;
- reaction counts;
- last activity;
- source URL.

This would make the product forum feel live without introducing a custom database. It must respect GitHub API limits, provenance and deletion/edit behavior.

## 11. Native accounts trigger

Only revisit native auth/database if real use proves GitHub is blocking participation or product-native posting/notifications become central. “A real forum sounds cooler” is not sufficient reason to operate account infrastructure.
