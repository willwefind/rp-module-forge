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
