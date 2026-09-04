# 架空王朝 Pack V0.1

Status: **first-party world-pack specification**  
Product Realm: **东方古代**  
Product label: **架空王朝**  
Current machine ID: `ancient-china`  
Last updated: 2026-09-04

## 1. Pack promise

`架空王朝` is the first open World Pack under the **东方古代** Realm.

It supports AIRP / text RP involving imperial courts, heirs, powerful ministers, military command, local government, merchants, scholars, ordinary households, servants and other low-permission starts.

It is intentionally fictionalizable. The pack may borrow institutional vocabulary, historical expert lenses and social patterns from Chinese history, but it is **not** a reconstruction of one real dynasty and must not present one historical template as universally correct.

Scenario-specific institutions, gender rules, inheritance rules, household status, geography and technology belong in the session context / world setting.

## 2. Why the product label changed

The earlier product label `中国古代` was too narrow and did two jobs at once:

1. it named a broad cultural / historical family;
2. it named one concrete pack with emperor / bureaucracy / household / military assumptions.

Those are now separated:

```text
东方古代（Realm）
├── 架空王朝（this pack）
├── 武侠江湖（planned separate pack）
├── 修仙宗门（planned separate pack）
└── 志怪异闻（planned separate pack）
```

武侠 and 修仙 must not merely be tags on the dynasty pack because their authority structures, resources, risks and identities may differ radically.

## 3. Machine compatibility note

The repository currently uses the historical engineering identifiers:

```text
package path: packages/pack-ancient-china/
worldPack.id: ancient-china
permission profiles: ancient-china:...
```

These identifiers are not translated display labels.

During this checkpoint, the primary canonical presentation label is changed to **架空王朝适配包**, while stable machine IDs remain unchanged.

A future ID migration must be explicit and deterministic. It must cover manifests, permission-profile IDs, forum data, legacy imports and tests. Do not rename IDs opportunistically in UI work.

## 4. Identity model

The current canonical identities are:

- 皇帝;
- 储君 / 皇嗣;
- 摄政 / 权臣;
- 将军;
- 地方官;
- 士人 / 读书人;
- 商贾;
- 普通人;
- 奴婢 / 仆役.

Identity determines current authority and exposure risk. Agenda / development route does not prepay future permissions.

## 5. Stable Core capabilities and pack presentation

The pack currently presents eight generic Core capabilities as:

| 架空王朝名称 | Core ID |
| --- | --- |
| 【考成台】 | `accountability-execution` |
| 【知行镜】 | `claim-action-consistency` |
| 【鱼鳞算盘】 | `ledger-evidence-crosscheck` |
| 【朋党谱】 | `multiplex-relationship-graph` |
| 【烽燧图】 | `readiness-logistics` |
| 【民声池】 | `plural-stakeholder-signals` |
| 【御前反对席】 | `red-team` |
| 【老乡遗言库】 | `curated-practitioner-knowledge` |

These labels belong to this pack. Other packs may reuse the Core operations under completely different names and examples.

## 6. Identity Playbooks and Agenda

A stable Core capability is re-framed to the host's current scale through Identity Playbooks.

Examples:

- `accountability-execution` may appear as imperial execution tracking for a ruler, local task chains for an official, or a **差事簿** for a servant;
- `readiness-logistics` may be military readiness for a general or an **活路与储备图** for a low-permission household role.

Agenda is a separate axis describing where the character wants to go. The same identity may pursue governance, pleasure, retirement, commerce, arts, military ascent, court struggle, throne-seeking or a custom route.

Agenda presentation may be identity-scaled. A servant choosing pleasure gets a low-permission daily-life framing rather than succession and state-order language.

## 7. Expert lenses

Expert lenses are methods, not summoned personas and not moral authorities.

The current pack draws on historical figures including 张居正、王阳明、戚继光、孙武、范蠡、海瑞、管仲 and route-specific additions such as 武则天、苏轼、李清照、顾恺之、陶渊明.

A future 武侠 or 修仙 pack may reuse none, some, or different lenses. Expert selection follows identity context + Agenda + event relevance rather than being welded permanently to a starting title.

## 8. Traveler Forum

The pack owns repository-backed authored threads, replies and curated notes for the 架空王朝 space.

Forum posts may be biased, wrong, emotional, funny, unfinished or contradicted. Only separately reviewed curated notes may become runtime retrieval candidates.

The forum meta layer is not an in-world permission wall: a servant may read an emperor thread. Adapting a module still uses the servant's current permission profile.

## 9. Validation rule

A shared crisis must produce materially different useful behavior for at least:

- 皇帝;
- 将军;
- 地方官;
- 商贾 / 普通人;
- 奴婢 / another low-permission role.

Within one identity, materially different Agenda routes must also change long-term questions and recommendations without changing current authority.

If every role receives the same plan with renamed nouns, the pack has failed.

## 10. Related specifications

- `docs/ARCHITECTURE.md`
- `docs/IDENTITY_PLAYBOOK_SPEC_V0.md`
- `docs/CHARACTER_AGENDA_SPEC_V0.md`
- `docs/TRAVELER_FORUM_SPEC.md`
- `docs/FORUM_AUTHORING_STYLE_V0.md`
- `docs/MULTIWORLD_FORUM_ARCHITECTURE_V0.md`
