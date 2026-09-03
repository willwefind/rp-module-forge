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
- deterministic canonical normalizer for schema/world-pack/version/identity checks, permission-profile derivation, duplicate resolution, stable capability/expert ordering, disabled-forum normalization, and runtime-invariant enforcement;
- Core permission-gate primitive returning `permitted`, `denied`, or `needs-context` from explicit profile scopes or accepted session overrides; capability selection itself never grants authority;
- Web App assembly using `CanonicalForgeConfig`, including capability activation modes, expert weights, Traveler Forum policy, token mode, evidence-state display, and invariant runtime flags;
- Web App exports now pass through the Core canonical normalizer and surface current access/command bounds plus validation state before output;
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

- permission-gate integration into the full event pipeline and machine-readable per-capability permission requirements;
- recommended-default resolution and richer incompatibility/redundancy diagnostics beyond the current deterministic canonical normalizer;
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

Before any Web App export, the current config is normalized against the loaded world pack. A stale or privileged `permissionProfile` string is not trusted: the normalizer derives the profile from the selected canonical identity. Unsupported schema/world-pack/version/identity inputs and weakened runtime invariants fail closed.

The Core permission gate is deliberately evidence-based rather than semantic guesswork. A capability may request an `access`, `request`, `command`, `allocate`, `publish`, `conceal`, or `observe` step, but it cannot grant that permission. Permission requires an exact declared profile scope or an explicit accepted session-context override. The full runtime event pipeline still needs to call this gate for every permission-sensitive capability action.

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

The clean normalization / permission-gate feature commit is `f7c78ccf151cdda32be6360b1db27fa2513fa770`. Its tree is identical to commit `080363385d2d37f7468c677e869566cf26ca76cb`, which GitHub Actions run `33780443544` validated before history cleanup:

- `pnpm install --frozen-lockfile` — passed;
- `pnpm typecheck` — passed;
- `pnpm test` — passed;
- `pnpm build` — passed.

The committed tests now cover:

- servant non-escalation during legacy migration;
- fail-closed unknown identities and world packs;
- split/absorbed/manual-review migration semantics;
- stable canonical capability/expert ordering and idempotent normalization;
- correction of stale or privileged permission-profile IDs from the selected identity;
- deterministic duplicate resolution and disabled-forum normalization;
- fail-closed runtime safety invariants;
- capability selection not granting access authority;
- exact profile-scope authorization, made-up scope denial, and blank-override rejection;
- explicit accepted session-context permission without mutating the base identity profile;
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
