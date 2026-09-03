# Maintainer Log / 穿越者老乡维护组日志

This log records meaningful product and architecture changes in two layers:

1. **Lore layer** — the voice of the traveler maintainer community.
2. **Engineering layer** — ordinary facts required to understand, review, test, and migrate the change.

The lore layer makes open-source maintenance part of the world. It never replaces Git history, pull requests, issues, release notes, security notices, or migration instructions.

## 【第109次重构记录】V0.1 产品真相归档

Date: 2026-09-03

> Dawn：发现皇帝模组无法适配奴婢开局。  
> Sol：确认问题存在。此前维护者过度假设宿主持有行政权。  
> 维护组复核后，又发现“专家附身”“模块自带答案”“把论坛当随机吐槽”等陈年隐患。  
>  
> 修复：新增身份权限层；专家改为认知镜头；老乡论坛升格为正式数据子系统；所有能力必须服从不全知与宿主裁决。  
>  
> 【Sol 批注：以后谁再让奴婢改革全国税制，我就把他的 PR 打回来。】

### Engineering record

- **Category:** product and architecture baseline
- **Scope:** README, product definition, architecture, Ancient China Pack, Traveler Forum, runtime system
- **Decision:** the Web App is the primary product; AIRP/RP is the general domain; Ancient China is the first world pack; SillyTavern is the first planned first-party integration.
- **Invariants:** non-omniscience, identity-based permissions, experts as lenses, host-final-decision.
- **Subsystem change:** Traveler Forum becomes a first-class two-layer subsystem: authored threads plus curated runtime knowledge.
- **Capability change:** eight Ancient China systems now map to generic core capability IDs.
- **Compatibility:** documentation target is ahead of parts of the current implementation; no claim of completed runtime integration.
- **Migration:** future manifests should persist generic IDs and resolve pack labels at display time.
- **Validation required:** multi-identity scenario test, export-invariant test, forum eligibility fixtures, on-demand runtime lifecycle test.

## 【第110次维护记录】不是所有老乡都能调户部的账。

Date: 2026-09-03

> 出生版把一部分身份与能力直接绑在旧 ID 上，久而久之，就像默认每个穿越老乡都揣着户部钥匙。  
> 维护组现已把这批旧身份数据收回通用 Core 契约：先认“你是谁”，再决定“你能看什么、能做什么”。  
> 世界包继续负责称呼与皮肤，权限边界不再藏在旧时代的名字里。

### Engineering record

- **Category:** refactor / schema migration
- **Scope:** legacy core IDs, identity data, V0.1 Core Contract
- **Engineering translation:** 把出生版旧 ID 和身份数据正式迁移到 V0.1 Core Contract。
- **Decision:** canonical identity and capability data must resolve through the V0.1 generic core contract instead of relying on birth-version IDs or world-pack labels as implicit permissions.
- **Behavior change:** none yet in runtime; this record establishes the migration target. After implementation, permissions will derive from explicit identity data and core contracts instead of presentation labels.
- **Compatibility:** planned migration; legacy identifiers require explicit normalization to their V0.1 canonical equivalents before manifests can be considered stable.
- **Schema impact:** planned migration from old identity/capability identifiers into the V0.1 Core Contract representation.
- **Privacy/security impact:** the target design reduces accidental over-permission caused by identity labels carrying implicit authority.
- **Validation required:** legacy-ID migration tests and identity-permission behavior checks against the V0.1 contract before this migration can be marked validated.

## 【第111次维护记录】祖传图纸入档，现行律例另册。

Date: 2026-09-03

> 维护组翻旧箱时发现，最初那张能点能动的祖传图纸还漂在仓库之外。  
> 留着它，是为了记住这座房子最初为什么这样起梁；收进档案房，是为了以后谁都能找到。  
> 但图纸归图纸，现行律例归现行律例：V0.1 specs 仍是工程事实。  
>  
> 【Sol 批注：可以拿祖传图纸考古，不许拿它直接报建。】

### Engineering record

- **Category:** docs
- **Scope:** `docs/PROTOTYPE_HANDOFF.md`, `prototypes/rp-module-forge-concept-v0.html`, maintainer documentation
- **Problem:** the earliest interactive concept existed outside the repository, so future sessions and contributors could either lose the original interaction intent or mistake reconstructed memories for project history.
- **Decision:** preserve Concept Prototype V0 and its handoff as historical design artifacts while explicitly keeping the current V0.1 specifications as the engineering source of truth.
- **Behavior change:** none; this commit does not change runtime, schema, Prompt Engine, or Web App behavior.
- **Compatibility:** compatible; no production contract changes.
- **Schema impact:** none.
- **Privacy/security impact:** none; the preserved artifacts contain project design material only and no private transcript, credentials, or user data.
- **Validation:** the handoff names the specification precedence explicitly; the prototype remains a self-contained single-file HTML/CSS/JS artifact with no build step.
- **Follow-up:** use the prototype to recover interaction principles and test invariants, not its temporary IDs, state model, visual hierarchy, or recommendation algorithm.

## 【第112次维护记录】旧路引可以带，新户籍不能瞎填。

Date: 2026-09-03

> M1 开工，维护组开始给出生版配置换发 V0.1 路引。  
> 能确认的一对一旧名直接迁；一项旧模块其实塞了两套职责的，当场拆开写明；已经升格成通用律例的，不再硬装回“模块”盒子里。  
> 对不上号的旧东西先扣在复核桌上，宁可留一条“待人工确认”，也不替后来的老乡编造祖籍。  
>  
> 【Sol 批注：迁移最忌讳“差不多得了”。差不多，就是下一任维护者的血泪帖。】

### Engineering record

- **Category:** refactor / schema migration
- **Scope:** `packages/core/src/types.ts`, `packages/core/src/legacyMigration.ts`, core exports, implementation status
- **Problem:** the birth-version `ForgeConfig` stores world pack, role, modules, experts, legacy notes, and session patch in a provisional shape; several old module IDs either combine multiple V0.1 responsibilities or represent semantics that now belong to identity permissions and global runtime invariants.
- **Decision:** add the V0.1 canonical TypeScript contract and the eight stable generic capability IDs while temporarily retaining the birth-version `ForgeConfig` for the current Web App. Add a guarded Ancient China legacy migrator that records direct, split, absorbed, and manual-review mappings instead of forcing false one-to-one conversions.
- **Behavior change:** no Web App or Prompt Builder behavior changes yet. Callers may now migrate current birth-version Ancient China configs into a `CanonicalForgeConfig`; lossy or ambiguous transitions return warnings and `requiresReview`.
- **Compatibility:** additive and compatible for current consumers; the legacy type remains exported during migration. Canonical manifests are not yet declared stable.
- **Schema impact:** introduces typed V0.1 world-pack refs, identity refs, capability selections and activation modes, expert weights, Traveler Forum policy, runtime policy, session patch structure, permission-profile dimensions, and canonical config shape.
- **Migration notes:** `administration` → `accountability-execution`; `fiscal` → `ledger-evidence-crosscheck`; `logistics` → `readiness-logistics`; `motives` splits into `claim-action-consistency` + `multiplex-relationship-graph`; `intelligence`, `survival`, and `status` are absorbed into V0.1 runtime/evidence or identity-permission semantics; `resources` remains manual-review because there is no lossless single V0.1 capability equivalent.
- **Privacy/security impact:** migration fails closed for unknown identities/world packs and does not infer privileged permission profiles. `omniscience = false` and `hostFinalDecision = true` remain literal runtime invariants in the canonical type.
- **Validation:** strict TypeScript type-check passed locally; emperor and servant migration fixtures were executed locally; the servant fixture did not acquire `ledger-evidence-crosscheck`, and both runtime invariants remained intact. Repository-level automated migration tests and CI are still pending.
- **Follow-up:** add the committed test harness; migrate Ancient China pack content, Prompt Builder, and Web App onto canonical IDs/config; implement full permission profiles and deterministic validation/normalization.

## 【第113次维护记录】户籍册归户籍册，匾额归匾额。

Date: 2026-09-03

> 新户籍终于不再拿门口牌匾当身份证。  
> 【鱼鳞算盘】还是那个一眼就认得出的名字，但账房里真正登记的是 `ledger-evidence-crosscheck`；换个世界、换块匾，底下那条能力契约也不会跟着改姓。  
> 皇帝、地方官、商贾、士人、奴婢各自领了明确权限档案；同一把工具到了不同人手里，能查什么、能问谁、能做到哪一步，不再靠一句称号暗中猜。  
>  
> 【Sol 批注：从今天起，谁再拿 UI 文案当数据库主键，我先请他去档案房抄一百遍 Core ID。】

### Engineering record

- **Category:** feature / refactor / validation
- **Scope:** canonical Core pack contracts, Ancient China pack, Prompt Builder, Web App, migration tests, GitHub Actions CI
- **Problem:** the birth-version UI and pack still treated role labels and provisional modules as the primary assembly model even after the V0.1 Core Contract had been specified. There was also no committed executable regression harness protecting legacy migration behavior.
- **Decision:** add canonical world-pack/identity/capability presentation types; implement all eight Ancient China capability presentations and nine explicit identity permission profiles; keep the birth-version pack only as a compatibility export; add canonical prompt/manifest output; migrate the primary Web App to `CanonicalForgeConfig`; add an executable no-dependency migration test harness and CI.
- **Behavior change:** the Web App now assembles identity permission refs, capability activation modes (`resident` / `on-demand` / `disabled`), expert weights, Traveler Forum policy, token mode, evidence-state visibility, and canonical manifest output. Ancient China labels are presentation data over stable Core IDs rather than persisted capability identities.
- **Compatibility:** additive migration path. Birth-version `ForgeConfig`, `WorldPack`, Ancient China legacy export, and legacy prompt functions remain available temporarily; the primary Web App no longer emits the birth-version manifest.
- **Schema impact:** canonical pack types now include explicit identity definitions, permission profiles, capability presentations, and expert recommendations. New manifests use canonical world-pack refs, identity permission-profile refs, stable capability IDs, activation modes, and runtime/forum config.
- **Privacy/security impact:** low-permission identities receive explicit access/command/allocation boundaries; canonical runtime invariants remain `omniscience = false` and `hostFinalDecision = true`; legacy migration fails closed on unknown world packs or identities.
- **Validation:** GitHub Actions run `33775446092` succeeded on Node.js 20 for commit `7a8a251466cc7efe1fbeda4e056fa8862a51ca9b`; frozen install, workspace typecheck, migration tests, and full build all passed.
- **References:** commits `ed3c860b9903847bc4072668627bf94b79f38b97`, `32ae8e21ebbb3a888b1a2f0a9e41b8c047f237d3`, `7a8a251466cc7efe1fbeda4e056fa8862a51ca9b`; CI run `33775446092`.
- **Follow-up:** implement deterministic canonical validation/normalization and runtime permission checks; add structured facts/claims editing and evidence-state flow; make token modes materially change prompt detail; implement Traveler Forum data/retrieval; remove birth-version compatibility exports only after the migration window is explicitly closed.

## 【第114次维护记录】老乡终于不是现编的了。

Date: 2026-09-04

> 有人问：论坛里的穿越者老乡留言，是不是全靠 AIRP 时让 AI 当场编？  
> 维护组看了一眼只有开关、没有人的论坛，决定停止表演“这里以后会很热闹”。  
> 于是第一批老乡正式入住仓库：有人算错过粮，有人被漂亮奏报骗过，有人只想提醒奴婢先活过今晚；还有一位坚持穿夜行衣翻墙进户部，现已被维护组连人带帖一起封存。  
> 原帖可以嘴硬、犯错、记仇、互相抬杠；但能进入 Runtime 的【老乡遗言库】，必须另过审核、可靠度与适用边界。  
>  
> 【Sol 批注：老乡可以胡说，数据库不可以装作他没胡说过。】

### Engineering record

- **Category:** feature / pack-content / validation
- **Scope:** Traveler Forum Core contracts and retrieval, Ancient China forum seed data, Web App forum browser, regression tests
- **Problem:** V0.1 already specified Traveler Forum as a first-class subsystem, but the implementation only exposed configuration switches. Without repository-backed thread/reply/curated-note data, runtime forum material would have to be fabricated at session time or remain empty.
- **Decision:** implement typed thread, reply, curated-note, provenance, reliability, review-state and conflict models; add deterministic curated-note retrieval and reference-integrity validation; seed Ancient China with 18 maintainer-authored threads, 14 replies and 10 curated runtime notes; expose raw-thread browsing and curated-candidate preview as visibly separate layers in the Web App.
- **Behavior change:** users can now browse identity-relevant forum posts that physically exist in the repository. Runtime candidates are derived only from curated notes matching the current world pack, identity, enabled capability, minimum reliability and optional situation/exclusion labels. Raw posts are never auto-injected by this retrieval path.
- **Compatibility:** additive; existing canonical manifests and birth-version compatibility exports remain readable. Traveler Forum config fields keep their existing shape.
- **Schema impact:** adds forum entity contracts for authors, provenance, applicability, post/review types, thread/reply/curated-note records, retrieval queries/results, conflict links and integrity issues.
- **Content provenance:** all founding posts use `maintainer-seed` provenance and anonymous traveler IDs. They are not presented as pre-existing real community contributions. Future real contributor identities require the consent rules already defined in the forum specification.
- **Privacy/security impact:** raw, pending, display-only, superseded and deprecated material is ineligible for automatic curated retrieval; unknown or weak material cannot become current-world fact merely by appearing in the forum; the deliberately bad “night raid on the Ministry of Revenue” post remains visible only as superseded/deprecated archive material.
- **Validation:** the clean feature commit is `465bd07d24a3f81e88dca3003c4b0dd661ae31a8`. Its code tree was validated by GitHub Actions run `33778216290` before history cleanup: frozen install, workspace typecheck, all Core tests and full build passed. Tests cover eligibility, reliability, exclusions, conflict preservation, deterministic ordering and broken forum references.
- **Follow-up:** feed real event/situation labels into retrieval; implement contribution/review/moderation flow; add token-budget and contradiction policy; keep any future AI-generated forum chatter explicitly `session-only` / synthetic so it can never masquerade as repository history.

## 【第115次维护记录】拿着算盘，不等于拿着钥匙。

Date: 2026-09-04

> 维护组这回终于把一件看似显而易见、实际上最容易被模型偷偷越过去的事钉死了：会用【鱼鳞算盘】，不代表你就能进户部。  
> 能力只负责告诉宿主“该核对什么、缺什么证据、下一步可以怎么问”；身份权限才决定“你到底能不能看、能不能拿、能不能命令别人去做”。  
> 奴婢当然可以开算盘。算盘可以老老实实回答：“还缺账本。”它不可以顺手补一句：“户部大门已为你打开。”  
> 同时，新户籍每次出门前都要过一遍规范化：世界包、身份、权限档案、模块顺序和 Runtime 不变量逐项核验，脏数据可以修的修，越过底线的一律不放行。  
>  
> 【Sol 批注：会算账的是脑子，能进账房的是身份。别混。】

### Engineering record

- **Category:** feature / validation / security-boundary
- **Scope:** Core canonical normalization, permission gate, Web App export path, regression tests, README navigation
- **Problem:** canonical configs were assembled by the Web App but were not yet passed through a deterministic Core normalizer before export, and permission profiles existed as descriptive data without an executable fail-closed gate. This left room for stale permission-profile IDs, duplicated selections, weakened runtime invariants, or future capability code accidentally treating “enabled tool” as “granted authority.”
- **Decision:** add a deterministic canonical normalizer and a permission-gate primitive. The normalizer validates schema/world-pack/version/identity, derives the permission profile from the selected identity, resolves duplicates deterministically, fixes canonical ordering, normalizes disabled forum behavior, and rejects weakened runtime invariants. The permission gate requires an exact declared profile scope or explicit accepted session-context override and returns `permitted`, `denied`, or `needs-context`; capability selection is never an authorization source.
- **Behavior change:** all Web App exports now pass through Core normalization. The Web App visibly exposes current `access` / `command` bounds and canonical validation state. A low-permission identity may enable analytical capabilities without silently acquiring the records, places, resources, or command authority those capabilities might prefer to use.
- **Compatibility:** additive and compatible for existing V0.1 configs that already satisfy current invariants. Stale mismatched permission-profile IDs are normalized to the identity’s current profile with a warning; unsupported world pack/version/identity values and weakened runtime invariants fail closed.
- **Schema impact:** no manifest schema-version bump. Adds Core normalization result/issue types and permission request/decision/basis types; existing `CanonicalForgeConfig` remains the persisted V0.1 shape.
- **Privacy/security impact:** reduces privilege escalation through stale manifests or capability-driven action suggestions. Session overrides must cite accepted RP context and do not mutate the base identity profile. Blank overrides and invented profile scopes cannot authorize an action.
- **Validation:** clean feature commit `f7c78ccf151cdda32be6360b1db27fa2513fa770` has the same feature tree as pre-cleanup commit `080363385d2d37f7468c677e869566cf26ca76cb`, validated by GitHub Actions run `33780443544`: frozen install, workspace typecheck, all Core tests, and full build passed.
- **References:** `f7c78ccf151cdda32be6360b1db27fa2513fa770`; CI run `33780443544`.
- **Follow-up:** require every permission-sensitive capability action in the runtime event pipeline to call the gate; add machine-readable permission requirements to capability contracts; implement structured evidence states and session facts/claims so accepted context grants can be audited rather than carried as free text.

## 【第116次维护记录】不是每个老乡都坐在龙椅上。

Date: 2026-09-04

> Dawn 忽然盯着【考成台】【御前反对席】看了半天，问了一个把维护组集体问沉默的问题：这些东西对我们现有的默认身份真的友好吗？  
> 大家回头翻出生版，发现最早的奴婢明明拿的是“低权限生存、礼法身份、人心博弈、情报拼图”，普通人拿的是“低权限生存、资源经营、礼法身份、情报拼图”。  
> M1 把这些旧模块拆回更正确的 Core 语义没有错：礼法进了权限层，情报进了证据层；错的是拆完以后，我们忘了把低权限角色真正需要的使用体验重新组装回来。  
> 于是维护组新增“身份处境方案 / Identity Playbook”：同一套 Core，不同身份可以有不同默认组合、牌匾、问题和例子。普通人终于拿回家计、迁徙和避险；奴婢终于拿回差事、主家关系、储备和活路。  
>  
> 【Sol 批注：Core ID 中立，不等于所有老乡都得举着“御前”牌匾上班。】

### Engineering record

- **Category:** architecture correction / feature / pack-content
- **Scope:** Core playbook contracts and resolver, Ancient China pack presentation, Prompt Builder, Web App, regression tests, playbook specification and audit
- **Problem:** the generic Core capability IDs were successfully separated from identity permissions, but the Ancient China capability catalog and presentation still inherited an emperor-first product bias. High-authority identities had a coherent toolset while commoner and servant recommendations under-expressed household livelihood, task/blame tracking, resources, routes, exposure, and survival-oriented planning.
- **Decision:** add a pack-owned Identity Playbook layer. A playbook supplies capability/expert defaults and identity-scale capability facets (labels, descriptions, questions, examples) while preserving the same Core IDs and permission profile. Birth-version `status` remains an always-on permission foundation and `intelligence` an always-on evidence foundation; `survival` and `resources` are first re-expressed as playbook-level compositions rather than prematurely restored as guessed one-to-one Core capabilities.
- **Behavior change:** the Web App now resolves one default playbook per Ancient China identity and changes capability defaults/presentation accordingly. Commoner defaults now emphasize household readiness, ledgers, relationships, risk and forum knowledge; servant defaults now emphasize claim/action observation, household relationships, readiness, task/blame tracking, risk and curated low-permission knowledge. One-line and compact prompts use the same playbook facets.
- **Compatibility:** additive. `CanonicalForgeConfig` is unchanged and does not persist playbook IDs in V0.1; old packs without playbooks fall back to base capability presentation and existing identity recommendations.
- **Schema impact:** no canonical manifest schema-version bump. Adds optional world-pack playbook metadata plus Core playbook/facet types and resolution helpers.
- **Privacy/security impact:** playbooks contain no permission fields and cannot authorize access or action. Ambiguous implicit playbook resolution fails closed to base presentation. The existing permission gate and non-omniscience invariants remain authoritative.
- **Validation:** feature commit `a06baa7f1b8bfc86952097dc7d1f371ffa5b6d90` is built from the playbook code tree validated before history cleanup by GitHub Actions run `33782635311`: frozen install, workspace typecheck, Core tests, and full build passed. New tests cover playbook-less fallback, deterministic single-playbook resolution, ambiguous fail-closed fallback, and stable Core IDs / unchanged permission profiles under capability facets.
- **References:** `a06baa7f1b8bfc86952097dc7d1f371ffa5b6d90`; `docs/IDENTITY_PLAYBOOK_SPEC_V0.md`; `docs/IDENTITY_PLAYBOOK_AUDIT_V0.md`; CI run `33782635311`.
- **Follow-up:** run real cross-identity usefulness fixtures for the same crisis across emperor, local official, merchant, commoner and servant; only add new Core capability IDs if those composition tests reveal a stable missing operation.

## Maintainer roles in the founding fiction

- **Dawn** — requirement discovery, world architecture, real RP validation, product judgment.
- **Sol** — system architecture, Prompt Engine, module contracts, maintainer marginalia.

These are project-lore roles and working responsibilities, not an ownership restriction. Public contributors can participate without adopting a persona.

## Entry template

Copy this section for future substantial changes.

```markdown
## 【第___次维护记录】Short lore-facing title

Date: YYYY-MM-DD

> What the traveler maintainers noticed.
> What failed in-world.
> What changed.
> 【Optional marginal note.】

### Engineering record

- **Category:** feature | fix | docs | refactor | security | pack-content
- **Scope:** affected packages, apps, integrations, schemas, or docs
- **Problem:** observable failure or limitation
- **Decision:** what was chosen and why
- **Behavior change:** user-visible effect
- **Compatibility:** breaking | compatible | experimental
- **Schema impact:** none or exact version/migration
- **Privacy/security impact:** none or exact impact
- **Validation:** tests and manual evidence
- **References:** issue / PR / commit / release
- **Follow-up:** bounded remaining work
```

## Logging rules

1. Use lore to add voice, not to hide facts.
2. State breaking changes and migration steps in ordinary engineering language.
3. Do not claim a test, integration, or release exists unless it was actually completed.
4. Preserve disagreement when a decision remains contested.
5. Avoid placing secrets, personal data, private RP transcripts, or model credentials in either layer.
6. Obtain consent before using a contributor's handle as an in-world identity; otherwise use an anonymous traveler ID.
7. Keep Git commit subjects conventional and searchable. The maintainer log may be playful; the repository history must remain useful.
8. One log entry may summarize several commits, but it must link back to the ordinary engineering references when published.

## Suggested commit pairing

The lore log and Git commit can coexist:

```text
Git commit:
feat(core): add identity permission profiles

Maintainer log:
【第110次维护记录】不是所有老乡都能调户部的账
```

This dual style is the project convention from V0.1 onward.