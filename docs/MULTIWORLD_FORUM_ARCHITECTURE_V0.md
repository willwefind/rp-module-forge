# Multiworld Forum Architecture V0

Status: **product / information-architecture proposal**  
Last updated: 2026-09-04

## 1. Product-scale assumption

天道降维互助论坛 must be able to grow from one Ancient China space into a very large multiworld network without redesigning the shell.

Potential future world spaces include, without committing to an implementation order:

- 星际 / space opera;
- 魔法 / high magic;
- 西幻 / western fantasy;
- 原始 / prehistoric or tribal survival;
- 中世纪 / medieval;
- 赛博朋克 / cyberpunk;
- 蒸汽时代 / steampunk;
- cultivation / xianxia;
- post-apocalypse and other later packs.

Ancient China is the first open world space, not the forum's permanent category model.

## 2. Two navigation levels

Do not flatten every future world's sections into one giant sidebar.

The forum has two levels:

```text
天道总坛
└── 世界空间 / World Space
    ├── 中国古代
    │   ├── 皇帝专区
    │   ├── 官场与地方
    │   ├── 军旅与边关
    │   └── ...
    ├── 星际
    │   ├── 舰队 / 航行
    │   ├── 殖民地 / 空间站
    │   └── ...
    ├── 魔法
    └── ...
```

The user first chooses a world space; the node list then changes to that world's own presentation taxonomy.

## 3. 天道总坛

Some material is cross-world and belongs above any single pack:

- 天道公告;
- 维护组记录;
- 天道外部通信口 / real-community bridge;
- world-pack development;
- contributor guidance;
- cross-world module design discussion;
- product / Core changes that affect every pack.

A world-specific forum should not duplicate these topics merely to appear self-contained.

## 4. World-space registration

A world pack may provide forum presentation data such as:

```text
worldSpaceId
label
summary
node definitions
default tags
pack accent / motif tokens
recommended discovery filters
```

These are presentation and discovery data. They do not alter Core permission semantics.

World-space labels may be localized. Stable identifiers remain language-neutral.

## 5. Search scopes

Search must scale with the forum rather than become unusable once many worlds exist.

The intended scopes are:

- 当前世界 — search the active world space;
- 全部世界 — search every installed/public world space;
- 天道总坛 — maintenance, meta, contributor, and cross-world material;
- optional filters for topic type, identity, Agenda route, capability, reliability, author, and module status.

The default search scope should follow the user's current world space but make cross-world search one explicit action away.

## 6. Topic identity

Every world-specific topic should carry one world-space association plus one primary node.

Cross-cutting meaning belongs in tags.

Conceptually:

```text
worldSpace: ancient-china
node: low-permission-survival
tags: servant, leisure, arts, corroborated
```

A topic should not need to be copied into multiple nodes or multiple worlds just to be discoverable.

## 7. Cross-world modules

Most early modules should target one world pack because names, identities, risks, experts, examples, and forum knowledge are pack-specific.

A later module may be declared cross-world only when the shared behavior is genuinely portable. Cross-world support must not be inferred merely because two packs use the same Core capability IDs.

The safe model is:

```text
shared Core behavior
+ world-pack-specific presentation / permissions / examples
```

rather than one universal module pretending every world's social structure is interchangeable.

## 8. Current-session context

The current-session card should include the active world space alongside identity and Agenda:

```text
当前世界：中国古代
当前身份：奴婢 / 仆役
当前路线：偷得浮生 / 小日子
```

Changing forum world space does not automatically rewrite the current RP session. Browsing 星际 while the current RP is 中国古代 is allowed; installing or adapting content across worlds requires an explicit compatibility step.

## 9. Theme behavior across worlds

日间 / 夜间 / 护眼 are global readability modes and remain available in every world space.

A world pack may supply restrained accent/motif overrides, but it must not replace the semantic meaning of:

- text contrast;
- warning / danger / success states;
- focus indication;
- evidence reliability;
- accessibility-critical tokens.

Example: a cyberpunk pack may change decorative accent cues while the user remains in 护眼 mode. The product should not force a neon dark theme merely because the world is cyberpunk.

## 10. Scale rule

The forum shell must assume hundreds of nodes and many thousands of topics over time.

Therefore:

- do not render every world and every node simultaneously;
- keep topic lists dense and filterable;
- keep stable IDs separate from display labels;
- let packs register presentation rather than hard-code world names into Core;
- design pagination / virtualized retrieval before the data volume requires it;
- keep forum authored data separate from curated runtime knowledge.

## 11. V0 acceptance fixture

Before production migration, the forum-first prototype should demonstrate at least:

1. a visible current-world selector;
2. Ancient China as one world space rather than the whole forum;
3. several future world spaces shown as unopened / planned without pretending content exists;
4. search wording that can later support current-world vs all-world scopes;
5. a global community / maintainer area that does not belong to Ancient China;
6. no permission escalation when browsing another world or another identity's area.
