# Forum-First Information Architecture V0

Status: **product / information-architecture proposal for V0.1**  
Last updated: 2026-09-04

## 1. Product truth

The product world is **天道降维互助论坛**.

`RP Module Forge` is not the outer shell of that forum. It is one first-party tool maintained inside the forum ecosystem: a module workshop used to inspect, adapt, assemble, export, and maintain assistance modules shared by travelers.

The primary mental model is therefore:

```text
天道降维互助论坛
├── 主题 / 回复 / 分区 / 标签
├── 模块发布主题
│   └── 模块附件
│       └── RP Module Forge 装配器
├── 老乡遗言库
├── 维护组公告 / 维护记录
└── 当前本局身份档案与推荐
```

The current Web builder remains valid engineering work, but its final product role changes from **home page** to **module workshop / assembly surface**.

## 2. Why forum-first

The founding fiction already speaks in forum-native language:

- travelers leave blood-and-tears posts, corrections, grudges, arguments, case reports, and module releases;
- modules have authors, versions, tags, applicability, warnings, provenance, and community history;
- maintainer records are already written as lore-facing public posts;
- curated runtime knowledge is explicitly derived from forum material rather than fabricated as timeless system truth.

A configuration dashboard as the first screen hides that world. A forum-first shell makes the lore, data model, and interaction model reinforce one another.

## 3. Reference patterns

This architecture borrows structure, not visual skin.

### Discourse — community navigation + topic list

Reference: https://meta.discourse.org/categories

Useful pattern:

- persistent category / tag navigation;
- dense topic list as the primary content surface;
- topic detail carries replies, metadata and chronology;
- sidebars can hold stable community navigation without turning every destination into a giant card.

### V2EX — one primary node

Reference: https://www.v2ex.com/help/node

V2EX gives each topic one primary Node so classification remains simple and understandable.

RP Module Forge adopts the same principle conceptually: each forum topic has **one primary section / node**. Cross-cutting meaning belongs in tags rather than multiple simultaneous primary categories.

### Stack Overflow — cross-cutting tags

Reference: https://stackoverflow.com/help/tagging

Tags connect topics across their primary category and support filtering/discovery. In our forum, tags may represent:

- starting identity;
- development route;
- capability family;
- situation;
- reliability / review state where appropriate;
- content form such as module-release.

Tags do not grant permissions and do not replace the canonical identity or Agenda stored in a module attachment.

### Hacker News — scan density

Reference: https://news.ycombinator.com/

The lesson is not to imitate its typography. The lesson is that a forum list should remain highly scannable. The default screen should show many meaningful topic rows, not a small number of oversized SaaS cards.

## 4. Primary navigation

V0 proposal:

```text
首页 / 最新 / 精华 / 模块仓 / 老乡遗言库 / 维护组
```

Primary sections / nodes for the Ancient China pack may include:

```text
天道公告
皇帝专区
官场与地方
军旅与边关
商贾与行旅
士林与文艺
普通人生
低权限求生
宫廷与家宅
世界包 / 模块开发
```

These are forum presentation categories, not Core permission classes.

A servant may browse `皇帝专区`. A current RP identity restricts in-world actions and automatic runtime applicability; it does **not** become a meta-forum paywall.

## 5. Topic types

Ordinary forum topics share one dense list language and may display a small type seal:

- 求助
- 血泪帖
- 案例回报
- 勘误
- 经验核验
- 记仇帖
- 维护组争论
- 模块发布
- 维护公告
- 已封存

Type is not the primary category. A module release can live in `皇帝专区`, `低权限求生`, `士林与文艺`, etc.

## 6. Module release is a special forum topic

A module should not live in a separate marketplace UI disconnected from the forum.

A module release topic contains normal forum material:

```text
标题
作者留言
回复 / 勘误 / 版本争论
主要专区
标签
版本
可靠度 / 维护状态
来源与变更历史
```

and one structured **模块附件**:

```text
适配世界包
建议起始身份
路线适配
能力组合
专家镜头
论坛注入策略
风险 / 权限说明
版本
规范配置
```

The attachment may expose actions such as:

```text
看看它会干什么
装进本局
按当前身份重新适配
只取部分能力
打开模块工坊
```

`RP Module Forge` opens here as an assembly drawer / dedicated workshop page.

## 7. Current-session card

The forum shell may show a compact **本局小档案**:

```text
当前身份：奴婢 / 仆役
当前路线：偷得浮生 / 小日子
当前权限：极低（summary only）
已装辅助：5
```

This card exists to personalize discovery and module compatibility.

It may influence:

- recommended topics;
- default filters;
- module compatibility hints;
- Traveler Forum curated-note retrieval;
- the pre-filled RP Module Forge assembly.

It must not:

- hide unrelated forum sections by default;
- grant new in-world permission;
- treat a future Agenda as current authority;
- claim that forum posts are current-world facts.

## 8. Desktop information hierarchy

Preferred desktop structure:

```text
┌──────────────────────────────────────────────────────────────────┐
│ brand / global nav / search / theme / current-session indicator  │
├──────────────┬──────────────────────────────────┬────────────────┤
│ sections     │ topic stream                     │ session /      │
│ saved nodes  │ dense rows                       │ workshop rail  │
│ tags         │ pinned / latest / module posts   │ maintenance    │
└──────────────┴──────────────────────────────────┴────────────────┘
```

The center column is primary. Side rails support navigation and current-session context.

Avoid dashboard-card inflation: topic rows should use dividers, type seals, metadata, tags and restrained surface shifts rather than one large rounded card per topic.

## 9. Mobile information hierarchy

On narrow screens:

- top bar remains compact;
- section navigation becomes a drawer or horizontal compact control;
- topic stream stays first;
- current-session card becomes a collapsible strip;
- module attachment opens as a bottom sheet / full-screen drawer;
- theme selector remains reachable without opening settings.

The mobile experience must preserve scan density rather than converting every topic into a tall social-media card.

## 10. Maintainer log in the forum

The current lore feed belongs naturally under:

```text
天道公告 / 维护组
```

Each lore entry can render as a topic-like maintenance notice:

```text
【第119次维护记录】数据库可以讲机器话，门口牌匾别中英夹生。
```

`docs/MAINTAINER_LOG.md` remains the single source of truth. The Web product may derive the lore layer from it; engineering records remain repository documentation.

## 11. Existing V0.1 systems mapped into the forum shell

| Existing work | Forum-first role |
| --- | --- |
| Identity | current-session context + compatibility |
| Permission profile | in-world action boundary; not forum browsing ACL |
| Identity Playbook | identity-scale module presentation |
| Agenda | long-term route / recommendation axis |
| Capability selection | module attachment + workshop assembly |
| Expert lenses | module attachment + workshop assembly |
| Traveler Forum threads | native forum topics |
| Curated notes | 老乡遗言库 |
| Maintainer lore | 维护组 / 天道公告 |
| Canonical manifest | machine attachment / export |
| Current Web builder | RP Module Forge workshop |

## 12. Acceptance criteria before production rearrangement

The forum-first concept is ready to replace the current dashboard shell only when the prototype demonstrates:

1. dense, readable topic scanning on desktop and mobile;
2. clear primary-node + tag distinction;
3. a module release that still feels like a forum post;
4. a module attachment that can lead into the existing Forge without visual rupture;
5. current identity / Agenda context without turning the forum into an in-world permission wall;
6. maintainer lore fitting naturally into the same ecology;
7. day / night / eye-care themes using one semantic token model;
8. Simplified Chinese-first presentation with machine identifiers hidden from ordinary reading surfaces.

Until then, the current canonical builder remains the production preview and the forum-first page remains a concept prototype.