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
│       └── 老乡遗言库
└── 当前本局身份档案与推荐
```

The current standalone builder remains valid engineering work, but its final product role is **module workshop**, not homepage.

## 2. Realm → Pack → Node

Do not flatten every future world into one giant sidebar.

The browsing hierarchy is:

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

## 3. Primary forum navigation

Inside the current context, V0 proposes:

```text
首页 / 最新 / 精华 / 模块仓 / 老乡遗言库 / 维护组
```

天道总坛 remains globally reachable and contains cross-world maintenance / contribution surfaces.

## 4. One primary Node + cross-cutting tags

Each topic has one primary Node inside one World Pack.

Cross-cutting meaning belongs in tags, such as:

- starting identity;
- development route;
- capability family;
- situation;
- reliability / review state;
- content form such as module-release.

Tags aid discovery. They do not grant permissions and do not replace canonical identity / Agenda data.

## 5. Forum browsing is meta-layer access

A servant may browse 皇帝专区.

A 架空王朝 player may browse future 武侠 / 修仙 spaces once they exist.

Browsing never mutates the active RP identity, permission profile, World Pack or installed modules.

Cross-pack installation always requires explicit compatibility / adaptation.

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

A module remains a normal discussable forum thread with:

```text
标题
作者留言
回复 / 勘误 / 版本争论
主要分区
标签
版本
可靠度 / 维护状态
来源与变更历史
```

and one structured **模块附件** containing, as relevant:

```text
目标 Realm / World Pack
建议起始身份
路线适配
能力组合
专家镜头
论坛注入策略
风险 / 权限说明
版本
规范配置
```

Attachment actions may include:

```text
看看它会干什么
装进本局
按当前身份重新适配
只取部分能力
打开模块工坊
```

## 8. Current-session card

The forum shell may show:

```text
当前世界域：东方古代
当前世界包：架空王朝
当前身份：奴婢 / 仆役
当前路线：偷得浮生 / 小日子
当前权限：极低（summary only）
已装辅助：5
```

This context may influence recommendation / compatibility hints but must not hide unrelated forum content or create permission.

## 9. Search scopes

The UI should be able to grow toward:

```text
当前世界包
当前世界域
全部世界
天道总坛
```

Default search follows the active World Pack. Global search stays one explicit action away.

## 10. Maintainer log

Maintainer lore belongs naturally under 天道总坛 / 维护组 and may also surface as topic-like notices in world streams when relevant.

`docs/MAINTAINER_LOG.md` remains the single source of truth for the lore layer; engineering records remain repository documentation.

## 11. Real community bridge

The forum exposes **【天道外部通信口】** as a clearly real-community surface.

Phase 1 destination is GitHub Discussions:

```text
https://github.com/willwefind/rp-module-forge/discussions
```

Real posts remain distinct from authored archive lore. Import into product content requires provenance, consent and review.

See `docs/COMMUNITY_BRIDGE_V0.md`.

## 12. Theme contract

The shell supports:

- 日间｜纸白档案;
- 夜间｜夜档;
- 护眼｜青笺.

Realm / Pack motifs may decorate the shell but cannot override accessibility-critical semantic colors.

## 13. Desktop hierarchy

Preferred desktop layout:

```text
brand / search / theme
Realm selector
Pack selector
forum nav
────────────────────────────────────────────────────
Pack nodes     dense topic stream      session / tools
                                   +   community bridge
```

The center topic stream remains primary.

## 14. Mobile hierarchy

On narrow screens:

- Realm / Pack selectors remain compact and scrollable;
- Node navigation becomes horizontal or drawer-based;
- topic stream remains first;
- current-session information collapses;
- module attachments open as bottom sheet / full-screen drawer;
- theme selector remains reachable.

## 15. Acceptance criteria before production rearrangement

The forum-first shell is ready to replace the current dashboard homepage only when it demonstrates:

1. dense readable topic scanning on desktop and mobile;
2. Realm → Pack → Node distinction;
3. 架空王朝 as one Pack, not the definition of all Eastern ancient worlds;
4. 武侠 / 修仙 as separate future packs;
5. primary Node + tag distinction;
6. a module release that still feels like a forum thread;
7. module attachment → Forge transition without rule duplication;
8. current identity / Agenda context without turning forum browsing into an in-world permission wall;
9. maintainer lore fitting naturally into the same ecology;
10. live real-community bridge clearly distinguished from archive content;
11. day / night / eye-care themes using one semantic token model;
12. Simplified Chinese-first presentation with machine IDs hidden from ordinary reading surfaces.

Until then, the current canonical builder remains the production preview and forum-first pages remain concept prototypes.
