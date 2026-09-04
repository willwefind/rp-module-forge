# Multiworld Forum Architecture V0

Status: **product / information-architecture proposal**  
Last updated: 2026-09-04

## 1. Product-scale assumption

天道降维互助论坛 must be able to grow into a very large cross-world network without redesigning the shell whenever a new setting appears.

The earlier `中国古代` world-space label was too narrow and mixed two different concepts: a broad cultural / genre family and one concrete pack implementation.

The forum therefore uses three product navigation levels:

```text
天道总坛
└── 世界域 / Realm
    └── 世界包 / World Pack
        └── 分区 / Node
```

A Realm is broad navigation and visual affinity. A World Pack owns actual identities, permissions, expert pools, capability presentation, forum nodes, modules, examples, and runtime assumptions.

## 2. Example realm tree

The initial proposal is intentionally extensible:

```text
天道总坛
├── 东方古代
│   ├── 架空王朝       ← first open pack
│   ├── 武侠江湖       ← planned
│   ├── 修仙宗门       ← planned
│   └── 志怪异闻       ← planned
├── 西方幻想
│   ├── 中世纪王国
│   ├── 高魔世界
│   └── 黑暗奇幻
├── 未来科幻
│   ├── 星际
│   ├── 赛博朋克
│   └── 后人类 / 人工智能社会
├── 工业幻想
│   └── 蒸汽时代
└── 原始世界
    └── 部落 / 史前生存等未来 pack
```

This tree is a navigation plan, not a promise that every listed pack already exists.

## 3. Why 武侠 / 修仙 are separate packs

`架空王朝`, `武侠江湖`, and `修仙宗门` may share broad Eastern-ancient aesthetic or cultural references, but they do not share the same social ontology.

For example:

- a dynasty pack may center formal office, household status, taxation, military command, court politics and bureaucratic records;
- a wuxia pack may center sect affiliation, martial reputation, jianghu obligations, escorts, clans, manuals and informal enforcement;
- a xianxia pack may add cultivation realms, sect hierarchy, spiritual resources, inheritances, lifespan asymmetry and non-state power centers.

Shared Core capability IDs do not imply shared permissions or presentation.

A `servant` in one pack must never inherit the same permission model merely because another pack also has a low-status household role.

## 4. First open pack naming

The first product-facing pack is now:

**东方古代 → 架空王朝**

The existing repository package and machine identifiers still use the historical engineering name `ancient-china` during V0.1:

```text
packages/pack-ancient-china/
worldPack.id = ancient-china
permission profiles = ancient-china:...
```

This is a temporary compatibility condition, not the intended product label.

Do not silently rename these stable identifiers in place. A later migration must explicitly define:

- old id → new id mapping;
- permission-profile id migration;
- forum provenance/world-pack migration;
- import compatibility;
- deterministic tests.

Until that migration exists, human presentation says `架空王朝`; machine contracts may still say `ancient-china`.

## 5. 天道总坛

Cross-world material belongs above every pack:

- 天道公告;
- 维护组记录;
- 天道外部通信口 / real-community bridge;
- world-pack development;
- contributor guidance;
- cross-world module design discussion;
- product / Core changes that affect every pack.

World packs should not duplicate these topics merely to appear self-contained.

## 6. Realm registration

A Realm may provide presentation metadata such as:

```text
realmId
localized label
summary
available pack references
restrained realm accent / motif suggestions
```

Realm metadata is navigation and presentation only. It cannot define permissions or runtime truth.

## 7. World-pack forum registration

A World Pack may provide:

```text
worldPackId
realmId
localized label
summary
node definitions
default tags
pack accent / motif tokens
recommended discovery filters
```

World Pack content may define identities, permissions, expert lenses, playbooks, Agenda routes, module defaults and forum seed data through the existing pack/Core contracts.

## 8. Search scopes

Search must scale beyond one pack.

Intended scopes:

- **当前世界包** — default; search the active pack;
- **当前世界域** — search sibling packs in the current Realm;
- **全部世界** — search every installed/public pack;
- **天道总坛** — search maintenance, contributor and cross-world material;
- optional filters for topic type, identity, Agenda, capability, reliability, author, provenance and module status.

The user should never need to flatten every node from every world into one sidebar just to search globally.

## 9. Topic identity

Every world-specific topic belongs to exactly one World Pack and one primary Node.

Conceptually:

```text
realm: eastern-ancient
worldPack: fictional-dynasty
node: low-permission-survival
tags: servant, leisure, arts, corroborated
```

The exact future stable IDs are not yet normative; this example describes structure only.

Cross-cutting meaning belongs in tags. A topic should not be duplicated into several packs merely for discoverability.

## 10. Cross-world modules

Most early modules should target one World Pack because names, identities, risks, experts, examples and forum knowledge are pack-specific.

A module may become cross-world only when its shared behavior is genuinely portable.

Safe model:

```text
shared Core behavior
+ explicit per-pack presentation / permission / expert / example adaptation
```

Unsafe model:

```text
same Core capability ids
→ therefore the whole module works unchanged everywhere
```

## 11. Current-session context

The session card should distinguish Realm and World Pack:

```text
当前世界域：东方古代
当前世界包：架空王朝
当前身份：奴婢 / 仆役
当前路线：偷得浮生 / 小日子
```

Changing forum Realm or Pack while browsing does not rewrite the RP session.

Installing or adapting content from another Pack requires an explicit compatibility step.

## 12. Theme behavior across realms

日间 / 夜间 / 护眼 remain global readability modes.

A Realm or World Pack may supply restrained decorative accents, but it must not replace accessibility-critical meaning such as:

- text contrast;
- focus indication;
- warning / danger / success states;
- evidence reliability;
- review state semantics.

A cyberpunk pack must not force the user into a neon dark theme; a xianxia pack must not replace every surface with glowing parchment.

## 13. Scale rule

The shell should assume many Realms, many Packs, hundreds of Nodes and many thousands of topics over time.

Therefore:

- render one Realm / Pack context at a time;
- keep topic lists dense and filterable;
- keep stable IDs separate from display labels;
- let packs register presentation instead of hard-coding names into Core;
- design pagination / virtualized retrieval before data volume requires it;
- keep authored forum data separate from curated runtime knowledge;
- keep future unopened spaces visibly unopened rather than filling them with fake history.

## 14. V0 acceptance fixture

Before production migration, the forum-first prototype should demonstrate:

1. a visible Realm selector;
2. a visible Pack selector inside the active Realm;
3. `东方古代 → 架空王朝` as the current first open path;
4. 武侠 / 修仙 as separate planned packs rather than tags on 架空王朝;
5. several other future Realms shown without pretending their content exists;
6. search wording that can later support pack / realm / global scopes;
7. a global community / maintainer area outside every pack;
8. no permission escalation from browsing another Realm, Pack or identity area.
