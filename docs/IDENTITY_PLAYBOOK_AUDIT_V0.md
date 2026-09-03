# Identity Playbook Audit V0

Status: design audit / pre-implementation decision
Last updated: 2026-09-04

## 1. Why this audit exists

The V0.1 Core migration correctly separated generic capabilities from Ancient China presentation and identity permissions. However, the current Ancient China experience still inherits a high-authority bias from the earliest emperor-first prototype.

The problem is not primarily that low-permission identities need weaker wording for the same imperial actions. The problem is that the current product surface has only two visible layers:

1. identity / permission profile;
2. selectable generic capabilities with one global Ancient China label and description.

That is insufficient to explain how the same capability becomes useful at radically different scales of agency.

Example: `accountability-execution` is generic enough to reason about a policy, military order, merchant contract, household obligation, or servant task. Yet its current Ancient China presentation, 【考成台】, strongly suggests administrative supervision. `red-team` is generic, but 【御前反对席】 is explicitly court-facing. `readiness-logistics` can reason about a household's food, travel, tools, time, and escape options, but 【烽燧图】 reads as military command.

This creates a product-level mismatch even when the Core permission model is technically correct.

## 2. What the birth version was already telling us

The birth-version pack recommended different modules for low-permission identities:

- servant: `survival`, `status`, `motives`, `intelligence`;
- commoner: `survival`, `resources`, `status`, `intelligence`.

During M1 these old modules were not migrated one-to-one because their semantics no longer belong to one selectable Core capability:

- `status` became identity / permission semantics;
- `intelligence` became evidence-state and non-omniscience semantics;
- `survival` spans permission, risk, relationships, readiness, red-team reasoning, and forum knowledge;
- `resources` spans ledgers, operational readiness, relationships, skills, exchange value, and scenario context.

That migration decision remains correct. The missing piece is the user-facing layer that recomposes generic capabilities around an identity's actual situation.

## 3. Diagnosis by identity

| Identity | Current fit | Main problem |
| --- | --- | --- |
| Emperor | strong | original design center; labels and examples feel native |
| Heir | medium | court-network tools fit, but personal exposure / constrained agency needs stronger framing |
| Regent / powerful minister | strong | governance and coalition tools fit naturally |
| General | strong-medium | logistics and execution fit; some labels remain civil-administrative |
| Local official | strong | current capability catalog maps well to bounded governance |
| Scholar | medium | relationship / claims fit; current catalog under-expresses livelihood, exposure, and limited agency |
| Merchant | medium | ledger / relationship fit; operational resource and route planning should be more visible |
| Commoner | weak | current recommendations collapse to stakeholder signals + forum knowledge; household agency is under-modeled in the UI |
| Servant / bonded attendant | weak | observation and relationship analysis exist, but survival, task/blame, resource, route, and exposure planning are not presented as a coherent toolset |

## 4. Decision: add a pack-owned Identity Playbook layer

Add an **Identity Playbook** layer between identity permissions and capability presentation.

A playbook is not a new authority source and is not persisted as a replacement for the canonical capability list. It is a world-pack-owned assembly/presentation preset that answers:

- What is this identity usually trying to protect, accomplish, or understand?
- Which generic capabilities are useful at this scale of agency?
- What should each capability be called or subtitled for this situation?
- Which questions, examples, and outputs make sense for this identity?
- Which actions remain outside permission even when the reasoning tool is enabled?

The canonical manifest continues to persist stable Core capability IDs and modes. A playbook must never grant permission.

## 5. Proposed playbooks for the first nine identities

Initial default playbooks:

- `imperial-governance` — 皇帝：中枢治理与失真控制
- `heir-court-survival` — 储君：继承政治、师傅属官与暴露控制
- `regent-power-balance` — 摄政 / 权臣：行政执行与合法性平衡
- `military-command` — 将军：军令、补给、部属与战场不确定性
- `local-governance` — 地方官：到任治理、地方账目、豪强与执行链
- `scholar-network-navigation` — 士人：言路、人脉、声誉与有限行动空间
- `merchant-operation` — 商贾：本钱、账目、商路、伙伴与风险分散
- `household-livelihood` — 普通人：家计、生计、迁徙、征役与社区互助
- `low-permission-survival` — 奴婢 / 仆役：差事、察言观色、主家关系、暴露风险、物资与活路

These are defaults, not immutable historical classes. Future packs or scenarios may provide multiple playbooks for one identity.

## 6. Capability facets instead of fake new Core IDs

A playbook may provide a **capability facet** for a Core capability. A facet changes presentation and focus, not capability identity or permission.

Example servant facets:

| Core capability | Current global skin | Low-permission facet example |
| --- | --- | --- |
| `accountability-execution` | 【考成台】 | 差事、交接、谁吩咐了什么、出了错会追到谁 |
| `claim-action-consistency` | 【知行镜】 | 察言观行：谁嘴上说安全，行动上却在清场 |
| `ledger-evidence-crosscheck` | 【鱼鳞算盘】 | 份例、物件、库存、领取与短缺；仅限可接触记录 |
| `multiplex-relationship-graph` | 【朋党谱】 | 主家关系、谁听谁的、谁能替谁说话、谁会迁怒 |
| `readiness-logistics` | 【烽燧图】 | 活路与储备：钱、食物、衣物、路线、时间、可求助的人 |
| `plural-stakeholder-signals` | 【民声池】 | 院内 / 街坊风向与沉默信号；不假装代表“民意” |
| `red-team` | 【御前反对席】 | 危局反推：如果这一步被发现，最坏会从哪里发生 |
| `curated-practitioner-knowledge` | 【老乡遗言库】 | 低权限生存旧帖与失败案例 |

The UI does not need to erase the shared system lineage. It may show a playbook-facing label first and the underlying Core/system lineage second.

## 7. Re-evaluating `survival`, `status`, `resources`, and `intelligence`

Do not restore the four birth-version modules as-is.

### `status`

Keep as foundational identity / permission semantics. It cannot be safely disabled by the user.

Expose it visibly in the UI as a permanent boundary/guide rather than pretending it vanished.

### `intelligence`

Keep as foundational evidence-state / bounded-context semantics. It is a runtime invariant, not an optional intelligence superpower.

Expose the evidence layer visibly so users understand where the old utility went.

### `survival`

Treat first as a playbook-level composition of permission, claim/action analysis, relationships, readiness, red-team, and curated knowledge.

Only create a new generic Core capability if cross-identity scenario tests show a coherent survival operation that cannot be expressed by those capabilities without duplication.

### `resources`

Treat first as a playbook-level composition of ledger cross-check, readiness/logistics, relationship leverage, and scenario facts.

Only create a new generic Core resource capability if tests show a stable operation that is distinct from accounting, logistics/readiness, and relationship mapping.

## 8. Required architecture changes

Before declaring Ancient China V0.2 playable:

1. define a pack-owned `IdentityPlaybookDefinition` contract;
2. allow identity definitions to reference a default playbook;
3. allow playbooks to provide capability defaults and capability facets;
4. keep playbook selection out of the permission gate;
5. keep the canonical manifest's stable capability IDs unchanged unless runtime semantics genuinely require a persisted playbook ID;
6. surface always-on identity/permission and evidence layers in the Web App;
7. change recommendations to be playbook-derived rather than a flat identity-only list;
8. add cross-identity scenario fixtures that test usefulness, not only non-escalation.

## 9. Acceptance scenarios

At minimum, run the same problem through emperor, local official, merchant, commoner, and servant perspectives.

### Scenario A — grain figures do not add up

The same `ledger-evidence-crosscheck` capability should produce:

- emperor: cross-office reconciliation and reporting-chain checks;
- local official: bounded local books, granary, transport, and subordinate reconciliation;
- merchant: receipts, prices, route loss, counterparties, and own inventory;
- commoner: household price/quantity changes and locally observable shortages without invented official records;
- servant: assigned stores, portions, visible stock movement, and safe escalation choices only if permitted.

### Scenario B — an apparently safe patron is behaving strangely

Use claim/action + relationship graph + red-team at different permission levels. The servant should receive safe observation and exposure-risk reasoning, not an imperial investigation plan.

### Scenario C — sudden departure may become necessary

Use readiness/logistics + relationships + forum knowledge. A commoner or servant should be able to reason about food, money, route, timing, dependents, shelter, and social help without requiring a new military logistics metaphor.

## 10. What not to do

- Do not make a separate Core for every social class.
- Do not solve the problem only by weakening wording after an imperial plan has already been generated.
- Do not let a playbook grant access, command, resources, or hidden knowledge.
- Do not proliferate new Core capability IDs before composition tests fail.
- Do not assume one Ancient China display name must fit every identity if the underlying Core ID is already stable.

## 11. Immediate implementation order

1. add playbook and capability-facet types;
2. seed nine default Ancient China playbooks;
3. migrate Web App recommendations/presentation to the selected identity's default playbook;
4. expose always-on permission/evidence foundations;
5. add cross-identity usefulness tests;
6. only then decide whether the Core capability catalog itself is missing a stable operation.
