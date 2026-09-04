# Forum-First Information Architecture V0

Status: **product / information-architecture proposal for V0.1**  
Last updated: 2026-09-04

## 1. Product truth

The product world is **天道降维互助论坛**.

`RP Module Forge` is one first-party tool maintained inside that forum ecosystem: a module workshop used to inspect, adapt, assemble, export and maintain assistance modules shared by travelers.

```text
天道降维互助论坛
├── 天道总坛
│   ├── 维护组 / 公告
│   ├── 世界包开发
│   └── 天道外部通信口（真实社区）
├── 世界域 / Realm
│   └── 世界包 / World Pack
│       ├── 主题 / 回复 / 分区 / 标签
│       ├── 模块发布主题
│       │   └── 模块附件
│       │       └── RP Module Forge
│       └── 老乡经验库
└── 当前本局档案 / 推荐 / 兼容性
```

The current standalone builder remains valid engineering work, but its final product role is **module workshop**, not homepage.

## 2. Realm → Pack → Node

Browsing hierarchy:

```text
天道总坛
→ 世界域
→ 世界包
→ 分区 / Node
→ 主题
```

Current first open path:

```text
东方古代
└── 架空王朝
    ├── 皇帝专区
    ├── 官场与地方
    ├── 军旅与边关
    ├── 商贾与行旅
    ├── 士林与文艺
    ├── 普通人生
    ├── 低权限求生
    └── 宫廷与家宅
```

Planned sibling packs under 东方古代 include **武侠江湖 / 修仙宗门 / 志怪异闻**. They are separate packs because their social authority, resources and identities may differ radically.

See `docs/MULTIWORLD_FORUM_ARCHITECTURE_V0.md`.

## 3. Primary navigation

Inside the current context:

```text
首页 / 最新 / 精华 / 模块仓 / 老乡经验库 / 维护组
```

`老乡经验库` is the reviewed reusable knowledge layer. The name does not imply that authors are dead.

## 4. One primary Node + cross-cutting tags

Each topic has one primary Node inside one World Pack.

Cross-cutting meaning belongs in tags such as identity, development route, capability, situation, reliability, author/member kind and content form.

Tags aid discovery. They do not grant permissions and do not replace canonical identity / Agenda data.

## 5. Forum browsing is meta-layer access

A servant may browse 皇帝专区. A 架空王朝 player may browse future 武侠 / 修仙 spaces once they exist.

Browsing never mutates the active RP identity, permission profile, World Pack or installed modules. Cross-pack installation always requires explicit compatibility / adaptation.

## 6. Topic types

Topic rows may use small type marks such as:

- 求助;
- 血泪帖;
- 案例回报;
- 勘误;
- 经验核验;
- 记仇帖;
- 维护组争论;
- 模块发布;
- 维护公告;
- 已封存.

The list should remain dense enough to scan many topics rather than turning every thread into a large SaaS card.

## 7. Module release is a special forum topic

A module remains a normal discussable forum thread with title, author message, replies/corrections, primary node, tags, version, reliability/maintenance state and provenance.

It additionally carries one structured module attachment containing the target Realm/World Pack, suggested starting identity, route adaptation, capabilities, expert lenses, forum policy, permission/risk notes, version and canonical config.

Attachment actions may include:

```text
看看它会干什么
装进本局
按当前身份重新适配
只取部分能力
打开模块工坊
```

## 8. Current-session profiles / 本局档案

The forum shell supports multiple local RP profiles rather than one static card.

Example:

```text
档案：婢女小日子线
世界域：东方古代
世界包：架空王朝
身份：奴婢 / 仆役
路线：偷得浮生 / 小日子
```

Phase 1 stores profiles in browser `localStorage`. A single GitHub community account may have many unrelated RP profiles.

Switching the active profile may influence recommendations and module compatibility; it must not change what forum sections the user is allowed to browse.

Later add JSON import/export before considering cloud sync.

## 9. Search scopes

The UI should grow toward:

```text
当前世界包
当前世界域
全部世界
天道总坛
```

Default search follows the active World Pack. Global search stays one explicit action away.

## 10. Maintainer log

Maintainer lore belongs naturally under 天道总坛 / 维护组 and may also surface as topic-like notices in world streams when relevant.

`docs/MAINTAINER_LOG.md` remains the single source of truth for maintainer lore; engineering records remain repository documentation.

## 11. Real community bridge

The forum exposes **【天道外部通信口】** as a clearly real-community surface.

Phase 1 destination:

```text
https://github.com/willwefind/rp-module-forge/discussions
```

Users may open topics, reply and react there. Real posts remain distinct from authored archive lore. Import into product content requires provenance, consent and review.

See `docs/COMMUNITY_BRIDGE_V0.md` and `docs/FORUM_INTERACTION_AND_DISCUSSIONS_V0.md`.

## 12. Archive posts + modern evaluation

An archive post is historical/versioned content. Modern community evaluation should attach a Discussion layer rather than silently rewrite the archived body.

Useful product actions include:

```text
参与评议
提交勘误
实战复现
去真人讨论区回复
```

Popularity never directly determines runtime reliability or eligibility for 【老乡经验库】.

## 13. Author/member diversity

Forum authors may be current travelers, traveler reserves, professional travelers, fictional temporal-bureau employees, maintainers, historical identities, missing travelers or reviewed real-community contributors.

A historical identity ending is not equivalent to claiming the underlying traveler is dead.

See `docs/FORUM_MEMBER_AND_ATTRIBUTION_V0.md`.

## 14. Content scale integrity

Topic metadata must match actual/source-backed content. A thread may show hundreds of replies only when the total exists in stored/source metadata; paginated UI should show loaded/total counts and explicit archive gaps.

See `docs/FORUM_CONTENT_SCALE_V0.md`.

## 15. Theme contract

The shell supports:

- 日间｜纸白档案;
- 夜间｜夜档;
- 护眼｜青笺.

Realm / Pack motifs may decorate the shell but cannot override accessibility-critical semantic colors.

## 16. Desktop hierarchy

Preferred desktop layout:

```text
brand / search / theme / active RP profile
Realm selector
Pack selector
forum nav
────────────────────────────────────────────────────
Pack nodes     dense topic stream      profile / tools
                                   +   real community
```

The center topic stream remains primary.

## 17. Mobile hierarchy

On narrow screens:

- Realm / Pack selectors remain compact and scrollable;
- RP profile switch stays reachable;
- Node navigation becomes horizontal or drawer-based;
- topic stream remains first;
- current-session details collapse;
- topic/module details open as full-screen drawer/bottom sheet;
- theme selector remains reachable.

## 18. Acceptance criteria before production rearrangement

The forum-first shell is ready to replace the current dashboard homepage only when it demonstrates:

1. dense readable topic scanning on desktop and mobile;
2. Realm → Pack → Node distinction;
3. 架空王朝 as one Pack, not all Eastern ancient worlds;
4. 武侠 / 修仙 as separate future packs;
5. module release → Forge transition without rule duplication;
6. multiple local RP profile switching;
7. current identity/Agenda context without forum permission walls;
8. live GitHub Discussions bridge for posting/replies/evaluation;
9. reviewed signatures/provenance for real community imports;
10. 老乡经验库 language that does not imply contributor death;
11. honest topic/reply counts and richer thread bodies;
12. maintainer lore fitting naturally into the same ecology;
13. day/night/eye-care semantic themes;
14. Simplified-Chinese-first presentation with machine IDs hidden from ordinary reading surfaces.

Until then, the current canonical builder remains the production preview and forum-first pages remain concept prototypes.
