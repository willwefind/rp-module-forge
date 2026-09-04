# Localization Strategy V0

Status: **product / presentation policy**  
Last updated: 2026-09-04

## 1. Current source locale

During V0.1 product shaping, the primary Web App ships and is reviewed in **Simplified Chinese (`zh-CN`) first**.

Traditional Chinese (`zh-Hant`) and English (`en`) are intentionally deferred until the product structure, terminology, route catalog, expert framing, forum presentation, and runtime copy are stable enough to translate without repeatedly maintaining three drifting versions.

This is a sequencing decision, not a language-support limitation.

## 2. Human presentation vs machine contract

Human-facing presentation and machine-facing identifiers must stay separate.

The Simplified Chinese product surface should not expose internal English identifiers merely because the canonical contract uses them. Examples include capability IDs, permission-profile IDs, route IDs, review-state values, reliability enum values, and runtime flags.

Those identifiers remain language-neutral in code and manifests. They MUST NOT be translated into Chinese database keys or persisted labels.

Therefore:

- UI labels, help text, status text, forum badges, route explanations, expert hints, and human-readable prompts are localized;
- canonical JSON field names and stable IDs remain unchanged;
- the machine manifest may contain English-language-neutral identifiers by design;
- a future locale switch changes presentation, not canonical meaning.

## 3. V0.1 Simplified Chinese acceptance rule

The ordinary Web App surface should read as one coherent Simplified Chinese product.

Allowed visible exceptions are limited to:

- the product brand `RP Module Forge`;
- explicit machine formats such as `JSON` when the user intentionally opens a machine-facing export;
- external proper names where translation would be misleading.

Ordinary controls should not mix labels such as `Runtime`, `Canonical`, `Core capability`, `Curated only`, `Plausible`, or `approved-for-runtime` into Chinese sentences.

## 4. Prompt output

The primary human-readable one-line and compact prompt outputs follow the current product locale. For the V0.1 Simplified Chinese phase they should avoid leaking machine enum values and internal IDs.

Canonical manifests remain language-neutral and are not treated as prose localization targets.

## 5. Maintainer lore

The Web App may surface the lore layer of `docs/MAINTAINER_LOG.md` as product-facing history.

`docs/MAINTAINER_LOG.md` remains the single source of truth. The Web App should derive its lore feed from that file rather than maintain a second manually copied log.

Only the short lore-facing blockquotes belong in the product timeline. Engineering records remain in the repository documentation.

## 6. Translation order after V0.1 stabilizes

When the Simplified Chinese product surface is stable enough to freeze terminology:

1. inventory all human-facing strings and pack-owned presentation content;
2. move remaining inline copy behind an explicit locale boundary where needed;
3. create Traditional Chinese (`zh-Hant`) presentation from the frozen Simplified Chinese terminology map;
4. create English (`en`) presentation from the same semantic source, not by translating machine IDs;
5. run cross-locale fixtures verifying that changing locale never changes canonical IDs, permissions, capability modes, Agenda selections, expert weights, or forum eligibility.

## 7. Non-goals for the current checkpoint

This checkpoint does not attempt to ship a language selector or complete Traditional Chinese / English translations.

The goal is to make the Simplified Chinese version coherent first while preserving a clean boundary that lets later locales reuse the same canonical configuration.
