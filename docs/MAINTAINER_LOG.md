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
