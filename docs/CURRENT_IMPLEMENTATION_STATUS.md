# Current Implementation Status

Last updated: 2026-09-03

This file exists to keep the public repository honest while V0.1 specifications move ahead of the initial code skeleton.

## Implemented now

- pnpm monorepo skeleton;
- `packages/core` birth-version compatibility types and early Prompt Builder;
- V0.1 canonical TypeScript config contract, including the eight stable generic capability IDs;
- guarded legacy migration for the current Ancient China birth-version identities and module IDs, with explicit split / absorbed / manual-review warnings;
- `packages/pack-ancient-china` early roles, provisional modules, and expert data;
- `apps/web` minimal Vite + TypeScript visual builder;
- identity-based recommendation demo;
- one-line export;
- compact prompt export;
- legacy manifest export;
- planned SillyTavern integration directory.

## Specified but not yet fully implemented

- full identity/permission profiles and permission checking;
- migration of Ancient China pack data from provisional module IDs to the eight canonical capability IDs;
- Web App assembly and manifest export using `CanonicalForgeConfig`;
- resident / on-demand / disabled activation behavior beyond the canonical config types and migration defaults;
- fact / claim / inference / hypothesis / unknown data flow;
- deterministic config validation and normalization beyond the guarded birth-version migrator;
- full-prompt exporter;
- Traveler Forum thread/reply/curated-note data models and retrieval;
- all eight Ancient China system UIs;
- token-mode behavior;
- formal migration / compatibility test harness and CI;
- SillyTavern runtime behavior.

## Current migration boundary

The Core package now contains the V0.1 canonical config types and a guarded migration path for the current birth-version Ancient China configuration.

The migration intentionally does not pretend every old module has a lossless one-to-one replacement:

- `administration` → `accountability-execution`;
- `fiscal` → `ledger-evidence-crosscheck`;
- `logistics` → `readiness-logistics`;
- `motives` splits into `claim-action-consistency` + `multiplex-relationship-graph`;
- `intelligence`, `survival`, and `status` are absorbed into V0.1 evidence/runtime or identity-permission semantics rather than preserved as selectable core capabilities;
- `resources` requires manual review because V0.1 currently has no lossless single capability equivalent.

The Web App, Prompt Builder, and Ancient China pack still consume the birth-version `ForgeConfig` / provisional module model. Do not treat manifests as stable until those surfaces move onto the canonical contract and the migration behavior has committed automated tests.

## Validation performed for the M1 start

- strict TypeScript type-check of the updated Core source;
- local migration fixtures for emperor and servant birth-version configurations;
- verified that servant migration does not gain `ledger-evidence-crosscheck` merely from identity migration;
- verified that `omniscience = false` and `hostFinalDecision = true` survive migration.

This is proportionate local validation, not a substitute for the repository test harness that M1 still needs to add.

## Status vocabulary

- **specified** — accepted in documentation;
- **implemented** — exists in code;
- **validated** — backed by tests or proportionate manual evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.
