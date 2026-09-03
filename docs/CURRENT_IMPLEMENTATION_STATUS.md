# Current Implementation Status

Last updated: 2026-09-04

This file exists to keep the public repository honest while V0.1 specifications move ahead of the initial code skeleton.

## Implemented now

- pnpm monorepo skeleton;
- V0.1 canonical TypeScript config contract with eight stable generic capability IDs;
- guarded birth-version migration for the four identities and provisional module IDs that existed in the first Ancient China code skeleton;
- executable migration regression tests covering direct/split/absorbed/manual-review mappings and fail-closed identity/world-pack handling;
- GitHub Actions CI for frozen install, typecheck, tests, and build;
- GitHub Pages deployment workflow for the primary Web App;
- `packages/pack-ancient-china` canonical V0.1 presentation for all eight capabilities;
- nine Ancient China identity definitions with explicit permission profiles and canonical capability/expert recommendations;
- canonical compact prompt, one-line output, and manifest serializers;
- Web App assembly using `CanonicalForgeConfig`, including capability activation modes, expert weights, Traveler Forum policy, token mode, evidence-state display, and invariant runtime flags;
- Traveler Forum thread, reply, curated-note, provenance, reliability, review-state, conflict, retrieval-query, and retrieved-note data contracts;
- deterministic curated-note retrieval filtered by world pack, identity, enabled capability, optional situation/exclusion labels, review status, and minimum reliability;
- fail-closed exclusion of raw/pending/display-only/superseded/deprecated material from automatic curated-note retrieval;
- conflict preservation for eligible curated notes instead of silent averaging;
- Traveler Forum reference-integrity validation for thread/reply/source/conflict links;
- Ancient China founding forum seed: 18 authored threads, 14 replies, and 10 curated runtime notes, all marked as maintainer seed rather than simulated community history;
- Web App Traveler Forum browser showing identity-relevant raw threads separately from currently retrievable curated-note candidates;
- birth-version config, pack, and prompt exports retained temporarily for migration compatibility;
- planned SillyTavern integration directory.

## Specified but not yet fully implemented

- runtime permission checking against permission profiles;
- deterministic canonical config validation and normalization beyond the guarded birth-version migrator;
- structured fact / claim / inference / hypothesis / unknown data flow in the Web App;
- structured session-patch editors for facts and claims;
- token-mode-specific prompt detail behavior beyond config/UI selection;
- full-prompt exporter;
- event/situation classification that supplies runtime Traveler Forum situation labels automatically;
- token-budget, duplication, and contradiction policy beyond the current deterministic result limit and explicit conflict preservation;
- contribution/review/moderation workflow for accepting real community forum submissions;
- session-only AI-generated forum chatter as an explicitly synthetic presentation layer;
- runtime activation/withdrawal behavior for on-demand capabilities;
- SillyTavern runtime behavior;
- removal of birth-version compatibility exports after a bounded migration window.

## Current migration boundary

The primary Web App now emits the V0.1 canonical configuration. The Ancient China pack now separates stable Core capability IDs from world-pack display names and carries explicit identity permission profiles.

The Traveler Forum now has a real repository-backed data layer. Raw threads are display/lore material and are not automatically injected. Runtime retrieval consumes only curated notes that pass review and applicability filters.

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

The clean forum feature commit is `465bd07d24a3f81e88dca3003c4b0dd661ae31a8`. Its tree is identical to the code tree validated by GitHub Actions run `33778216290` before history cleanup:

- `pnpm install --frozen-lockfile` — passed;
- `pnpm typecheck` — passed;
- `pnpm test` — passed;
- `pnpm build` — passed.

The committed tests cover:

- servant non-escalation during legacy migration;
- fail-closed unknown identities and world packs;
- split/absorbed/manual-review migration semantics;
- curated-note eligibility by world, identity, capability, situation, review status, and reliability;
- exclusion of superseded/deprecated notes;
- explicit applicability exclusions;
- preservation of conflicting eligible notes;
- deterministic result ordering and limits;
- broken Traveler Forum thread/reply/source/conflict references.

## Status vocabulary

- **specified** — accepted in documentation;
- **implemented** — exists in code;
- **validated** — backed by tests or proportionate manual evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.
