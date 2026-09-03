# Current Implementation Status

Last updated: 2026-09-03

This file exists to keep the public repository honest while V0.1 specifications move ahead of the initial code skeleton.

## Implemented now

- pnpm monorepo skeleton;
- V0.1 canonical TypeScript config contract with eight stable generic capability IDs;
- guarded birth-version migration for the four identities and provisional module IDs that existed in the first Ancient China code skeleton;
- executable migration regression tests covering direct/split/absorbed/manual-review mappings and fail-closed identity/world-pack handling;
- GitHub Actions CI for frozen install, typecheck, tests, and build;
- `packages/pack-ancient-china` canonical V0.1 presentation for all eight capabilities;
- nine Ancient China identity definitions with explicit permission profiles and canonical capability/expert recommendations;
- canonical compact prompt, one-line output, and manifest serializers;
- Web App assembly using `CanonicalForgeConfig`, including capability activation modes, expert weights, Traveler Forum policy, token mode, evidence-state display, and invariant runtime flags;
- birth-version config, pack, and prompt exports retained temporarily for migration compatibility;
- planned SillyTavern integration directory.

## Specified but not yet fully implemented

- runtime permission checking against permission profiles;
- deterministic canonical validation and normalization beyond the guarded birth-version migrator;
- structured fact / claim / inference / hypothesis / unknown data flow in the Web App;
- structured session-patch editors for facts and claims;
- token-mode-specific prompt detail behavior beyond config/UI selection;
- full-prompt exporter;
- Traveler Forum thread/reply/curated-note data models and retrieval;
- runtime activation/withdrawal behavior for on-demand capabilities;
- SillyTavern runtime behavior;
- removal of birth-version compatibility exports after a bounded migration window.

## Current migration boundary

The primary Web App now emits the V0.1 canonical configuration. The Ancient China pack now separates stable Core capability IDs from world-pack display names and carries explicit identity permission profiles.

The birth-version compatibility layer remains intentionally narrow:

- legacy identities: `emperor`, `general`, `servant`, `commoner`;
- `administration` → `accountability-execution`;
- `fiscal` → `ledger-evidence-crosscheck`;
- `logistics` → `readiness-logistics`;
- `motives` splits into `claim-action-consistency` + `multiplex-relationship-graph`;
- `intelligence`, `survival`, and `status` are absorbed into V0.1 evidence/runtime or identity-permission semantics rather than preserved as selectable core capabilities;
- `resources` requires manual review because V0.1 currently has no lossless single capability equivalent.

New canonical identities such as `local-official`, `merchant`, and `scholar` are not backported into the birth-version format. New manifests should use canonical IDs directly.

## Validation in repository

GitHub Actions run `33775446092` completed successfully on Node.js 20 for commit `7a8a251466cc7efe1fbeda4e056fa8862a51ca9b`:

- `pnpm install --frozen-lockfile` — passed;
- `pnpm typecheck` — passed;
- `pnpm test` — passed;
- `pnpm build` — passed.

The committed migration tests verify servant non-escalation, fail-closed unknown identities/world packs, split/absorbed semantics, and the manual-review resource case.

## Status vocabulary

- **specified** — accepted in documentation;
- **implemented** — exists in code;
- **validated** — backed by tests or proportionate manual evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.
