# Community Bridge V0 · 天道外部通信口

Status: **community / product proposal**  
Last updated: 2026-09-04

## 1. Goal

The product forum contains authored traveler history, but real users should also have a low-cost way to become part of the project community.

The first public bridge is **GitHub Discussions**, not a custom account system.

This keeps the first community phase compatible with the project's free-first infrastructure principle:

```text
GitHub Pages        — product / forum presentation
GitHub repository   — code / reviewed data / maintainer history
GitHub Discussions  — real human discussion and submissions
```

No dedicated forum database, password system, mail service, or VPS is required for this phase.

## 2. Product entry

The forum should expose a clearly real-world entry named:

**【天道外部通信口】**

Suggested product copy:

> 这里的老乡是真的。  
> 反馈 Bug、分享你的开局、投稿模块、讲血泪史，或者提议新的世界包，都可以从这里进入真实社区。

The entry must visually distinguish real-community discussion from fictional/archive forum material.

## 3. Proposed GitHub Discussions categories

Keep the first set small and general enough to survive future world packs:

- **天道公告** — maintainer announcements; announcement-style category;
- **反馈与点子** — product feedback, UX issues, feature ideas;
- **RP 实战回报** — real play reports, failure stories, surprising outcomes;
- **模块投稿** — proposed modules, module revisions, compatibility findings;
- **世界包提案** — new world directions, identity sets, expert pools, pack content;
- **求助与问答** — usage questions and contributor questions.

Do not create one GitHub Discussion category per fictional world at the beginning. Use labels/titles/templates until real traffic proves that a world deserves its own category.

## 4. Real identity vs forum identity

Never silently turn a real contributor's GitHub account into an in-world persona.

Keep two separate concepts:

```text
real attribution
- GitHub handle / source discussion

forum presentation identity
- chosen lore alias
- anonymous traveler ID
- or explicit permission to use the public handle
```

A contributor can choose, for example:

- `@catcat233` as public attribution and `南梁·跑路失败三次的账房先生` as lore alias;
- public attribution plus `匿名老乡 #2048` in the product;
- public handle in both places, only with explicit consent.

## 5. Import / review path

Nothing from GitHub Discussions should automatically become runtime knowledge.

The intended pipeline is:

```text
real discussion / submission
        ↓
confirm source + attribution preference + consent
        ↓
maintainer review
        ↓
optional authored forum thread
(provenance = community-contribution)
        ↓
separate review if reusable knowledge exists
        ↓
optional curated note / 老乡遗言库
```

A real community post may be valuable lore without being reliable runtime advice.

## 6. Provenance display

Product-facing forum content must make source class visible without ruining immersion.

Suggested badges:

- `档案角色 / 维护组创作`
- `维护组创世种子`
- `真实社区贡献 · 已获授权`
- `维护组整理导入`

For real contributions, preserve a source link where appropriate.

## 7. Moderation boundary

GitHub Discussions is the moderation/account layer during Phase 1.

The project should not implement its own passwords, recovery email, blocking, spam detection, notification delivery, or account moderation until there is a concrete need that GitHub Discussions cannot satisfy.

Project maintainers still control what is copied into the repository-backed forum data and curated knowledge layer.

## 8. When to consider a native account system

Do not graduate to custom accounts merely because a custom forum sounds more complete.

Revisit native auth/database only when real use demonstrates one or more of these constraints:

- many interested users do not have or will not use GitHub accounts;
- GitHub's discussion UX materially blocks the intended community experience;
- product-native posting/replies/notifications become central rather than optional;
- moderation or reputation requirements exceed the bridge model;
- the project has enough sustained activity to justify operating account infrastructure.

Until then, free-first wins.

## 9. Future hosting principle

The forum presentation should not assume its data must live on the same host as its frontend.

A later architecture may keep static/frontend hosting separate from auth/data services. No paid VPS or hosted database should be adopted before the need is demonstrated and the free/low-cost alternatives are exhausted.

## 10. Immediate implementation sequence

1. enable GitHub Discussions on the public repository;
2. create the small category set above;
3. add the real `天道外部通信口` link to the forum shell and README;
4. add contributor attribution / lore-alias guidance;
5. keep community-to-repository import manual and reviewed;
6. only later automate read-only discovery if the API and moderation model remain safe.
