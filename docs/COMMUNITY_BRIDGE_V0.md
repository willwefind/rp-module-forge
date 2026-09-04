# Community Bridge V0 · 天道外部通信口

Status: **community / product proposal — Phase 1 bridge enabled**  
Last updated: 2026-09-04

## 1. Goal

The product forum contains authored traveler history, but real users should also have a low-cost way to become part of the project community.

The first public bridge is **GitHub Discussions**, not a custom account system.

Current Phase 1 infrastructure:

```text
GitHub Pages        — product / forum presentation
GitHub repository   — code / reviewed data / maintainer history
GitHub Discussions  — real human discussion and submissions
```

Repository state was verified on 2026-09-04 with `has_discussions: true`.

No dedicated forum database, password system, mail service, custom auth server or VPS is required for this phase.

## 2. Product entry

The real-world entry is:

**【天道外部通信口】**

> 这里的老乡是真的。  
> 反馈 Bug、分享你的开局、投稿模块、讲血泪史、复现旧帖，或者提议新的世界包，都可以从这里进入真实社区。

Live destination:

```text
https://github.com/willwefind/rp-module-forge/discussions
```

The product must visually distinguish real-community discussion from fictional / archive forum material.

## 3. Chinese GitHub Discussions categories

GitHub category names / descriptions / emojis are customizable. Phase 1 should use a small Chinese set rather than mirror every fictional forum node:

- **📣 天道公告** — announcement;
- **💡 反馈与点子** — open-ended;
- **🎭 RP 实战回报** — open-ended;
- **🧩 模块投稿** — open-ended;
- **🌌 世界包提案** — open-ended;
- **🧪 经验复现与勘误** — open-ended;
- **🙋 求助与问答** — Q&A.

Do not create one real Discussion category per fictional World Pack until traffic proves it useful.

After category slugs are known, add structured discussion forms under `.github/DISCUSSION_TEMPLATE/`.

## 4. Real identity vs forum identity

Never silently turn a real contributor's GitHub account into an in-world persona.

Keep two separate concepts:

```text
real attribution
- GitHub handle / source Discussion

forum presentation identity
- preset lore signature
- reviewed custom lore signature
- anonymous traveler identity
- or public GitHub handle with explicit consent
```

Initial preset signature bases may include:

- 匿名老乡;
- 穿越者预备役;
- 在途穿越者;
- 职业穿越者;
- 时空总局·外勤员;
- 时空总局·档案员;
- 时空总局·后勤员;
- 模块维修工.

The UI may propose a numeric suffix such as `穿越者预备役 · #4831`; final repository import checks/canonicalizes the display identity.

Custom aliases are allowed after lightweight review for attribution, impersonation, privacy and obvious abuse. Approval never replaces the real source link.

See `docs/FORUM_MEMBER_AND_ATTRIBUTION_V0.md`.

## 5. Import / review path

Nothing from GitHub Discussions automatically becomes runtime knowledge.

```text
real discussion / submission
        ↓
confirm source + attribution preference + consent
        ↓
maintainer review
        ↓
optional authored / imported forum thread
(provenance = community-contribution)
        ↓
separate review if reusable knowledge exists
        ↓
optional curated note / 老乡经验库
```

A real community post may be excellent forum material without being reliable runtime advice.

## 6. Provenance display

Suggested badges:

- `档案角色 / 维护组创作`;
- `维护组创世种子`;
- `真实社区贡献 · 已获授权`;
- `维护组整理导入`.

For real contributions, preserve a source Discussion link.

## 7. Posting / replies / evaluation

Phase 1 real interaction lives on GitHub Discussions:

- users can open new discussions;
- users can comment/reply;
- users can use GitHub reactions;
- the product forum may link archive threads to a real Discussion for modern evaluation / correction / play reports.

Do not mutate an old archive post because a modern reader disagrees. Preserve the archive and attach a new discussion layer.

Popularity is not reliability and never directly promotes a post into 【老乡经验库】.

See `docs/FORUM_INTERACTION_AND_DISCUSSIONS_V0.md`.

## 8. Moderation boundary

GitHub Discussions is the account and moderation layer during Phase 1.

The project should not implement its own passwords, recovery email, blocking, spam detection, notification delivery or account moderation until GitHub materially blocks the intended experience.

Project maintainers still control what enters repository-backed forum data and curated runtime knowledge.

## 9. Free-first infrastructure rule

Do not buy infrastructure because future scale sounds exciting.

Revisit native auth / database only when real use demonstrates one or more constraints:

- many interested users do not have or will not use GitHub accounts;
- GitHub discussion UX materially blocks participation;
- product-native posting / replies / notifications become central;
- moderation or reputation requirements exceed the bridge model;
- sustained activity justifies operating account infrastructure.

Until then, free-first wins.

## 10. Future hosting principle

Forum presentation must not assume frontend, auth and data live on the same host.

A later architecture may keep static/frontend hosting separate from auth/data services. No paid VPS or hosted database should be adopted before need is demonstrated and free / low-cost alternatives are exhausted.

## 11. Immediate sequence

1. keep `天道外部通信口` visible;
2. rename/create the Chinese Discussions categories;
3. inspect their final slugs and add category forms;
4. add signature / consent fields to those forms;
5. keep community-to-repository import manual and reviewed;
6. later consider read-only Discussion metadata sync into Pages;
7. do not build native accounts merely to make the project look more complete.
