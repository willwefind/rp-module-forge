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

Product copy:

> 这里的老乡是真的。  
> 反馈 Bug、分享你的开局、投稿模块、讲血泪史，或者提议新的世界包，都可以从这里进入真实社区。

Live destination:

```text
https://github.com/willwefind/rp-module-forge/discussions
```

The product must visually distinguish real-community discussion from fictional / archive forum material.

## 3. Initial GitHub Discussions category plan

Keep the first set small and cross-world:

- **天道公告** — maintainer announcements;
- **反馈与点子** — product feedback, UX issues, feature ideas;
- **RP 实战回报** — real play reports, failures, surprising outcomes;
- **模块投稿** — proposed modules, revisions, compatibility findings;
- **世界包提案** — new worlds, identity sets, expert pools and pack content;
- **求助与问答** — usage and contributor questions.

Do not create one real Discussion category per fictional World Pack at the beginning. Real traffic should prove when a separate category is useful.

Until the category set is manually refined, the live Discussions page itself is already a valid external communication bridge.

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

Examples:

- `@catcat233` as public attribution and `南梁·跑路失败三次的账房先生` as lore alias;
- public attribution plus `匿名老乡 #2048` in product lore;
- public handle in both places only with explicit consent.

## 5. Import / review path

Nothing from GitHub Discussions automatically becomes runtime knowledge.

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

A real community post may be excellent lore without being reliable runtime advice.

## 6. Provenance display

Product-facing content should make source class visible without destroying immersion.

Suggested badges:

- `档案角色 / 维护组创作`
- `维护组创世种子`
- `真实社区贡献 · 已获授权`
- `维护组整理导入`

For real contributions, preserve a source Discussion link where appropriate.

## 7. Moderation boundary

GitHub Discussions is the account and moderation layer during Phase 1.

The project should not implement its own passwords, recovery email, blocking, spam detection, notification delivery or account moderation until a concrete need appears that GitHub Discussions cannot satisfy.

Project maintainers still control what enters repository-backed forum data and curated runtime knowledge.

## 8. Free-first infrastructure rule

Do not buy infrastructure because future scale sounds exciting.

Revisit native auth / database only when real use demonstrates one or more constraints:

- many interested users do not have or will not use GitHub accounts;
- GitHub discussion UX materially blocks participation;
- product-native posting / replies / notifications become central;
- moderation or reputation requirements exceed the bridge model;
- the project has sustained activity that justifies operating account infrastructure.

Until then, free-first wins.

## 9. Future hosting principle

Forum presentation must not assume frontend, auth and data live on the same host.

A later architecture may keep static/frontend hosting separate from auth/data services. No paid VPS or hosted database should be adopted before the need is demonstrated and free / low-cost alternatives are exhausted.

## 10. Immediate sequence after bridge activation

1. keep the live `天道外部通信口` link visible in the forum shell and README;
2. refine GitHub Discussions categories when convenient;
3. add contributor attribution / lore-alias guidance;
4. keep community-to-repository import manual and reviewed;
5. later consider read-only community discovery inside the product only if API, attribution and moderation behavior remain safe;
6. do not build custom accounts merely to make the project look more complete.
