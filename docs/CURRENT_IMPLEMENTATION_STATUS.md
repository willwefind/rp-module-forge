# Current Implementation Status

Last updated: 2026-09-06

This file exists to keep the public repository honest while V0.1 specifications move ahead of the initial code skeleton.

## Product surfaces (since 2026-09-06)

- `/` — **天道降维互助论坛**, the primary product (`apps/web/index.html` → `src/forum/`): realm / world-pack / node navigation, 首页 / 精华 / 模块仓 / 老乡经验库 / 维护组 tabs, body + reply search, topic dialog with provenance, archive gaps, related threads and module attachments, seven Chinese Discussion category links, 日间 / 夜间 / 护眼 themes, local profile cabinet;
- `/forge/` — **RP Module Forge 模块工坊**, the first-party workshop (`apps/web/forge/index.html` → `src/forge/`): reads the shared active profile, `?topic=<id>` shows a module attachment and can apply its capability / expert lens combination without changing identity or writing any profile;
- `/prototypes/forum-first-concept-v3.html` — the V3 prototype kept as a **historical snapshot**; its content is no longer maintained;
- the display name of the first pack is **东方古代 → 架空王朝**; the machine id remains `ancient-china` (`worldPack.id`, permission-profile ids, package name) until a dedicated migration.

## Implemented now

- pnpm monorepo skeleton;
- Vite multi-page build (`index.html` + `forge/index.html`) with base-relative links, so refreshes under the Pages base path do not 404; topics are addressed by `#topic=<id>` and legacy V3 slugs still resolve;
- pack-owned unified forum archive `ancientChinaForumArchive` (`packages/pack-ancient-china/src/forumArchive.ts` assembling `src/forum/{nodes,members,seed,curatedNotes}.ts` and `src/forum/topics/<slug>.ts`): 9 nodes, 28 members, 40 threads (18 founding seed threads + 22 V3 topics migrated verbatim, one file per topic), 102 replies, 10 curated runtime notes — one source for the forum UI, search, attachments, related threads, the workshop and curated-note retrieval; no third JSON, no build-time copy, no title keys, no Chinese as a canonical id;
- Core forum vocabulary extended for the archive: post types (retrospective, serial, good-news, chat, module-release, knowledge-card, community-gateway, maintenance-record, revived-thread, archive-note, author-update), member kinds, worldline statuses (`identity-ended` is explicitly not death), provenance reference prefixes, `archiveTime`, `featured`, `reviewNote`, `archiveGap`, `relatedThreads`, `moduleAttachment`; validation covers node / related-thread / source-reply / attachment integrity;
- canonical local profile `LocalRpProfile` v5 (`apps/web/src/profile/store.ts`, key `td-profile-store-v5`): `identityId` / `agenda.routeId` must exist in the loaded pack, permission is derived from the identity and never stored, private `notes` never leave the browser; deterministic v3 / v4 migration through `legacyLabels.ts`, unmappable values become `requiresReview` with the original wording kept, the old copy stays until the new store is saved; corrupt or blocked storage falls back to a read-only recovery mode without overwriting; JSON import checks the version, fails closed, and offers merge-skip / merge-overwrite / replace with confirmation;
- forum and workshop read and write the same active profile; the workshop only writes on an explicit, confirmed 「写回档案」;
- V0.1 canonical TypeScript config contract with eight stable generic capability IDs;
- guarded birth-version migration for the four identities and provisional module IDs that existed in the first Ancient China code skeleton;
- executable migration regression tests covering direct/split/absorbed/manual-review mappings and fail-closed identity/world-pack handling;
- GitHub Actions CI for frozen install, typecheck, tests, and build;
- GitHub Pages deployment workflow publishing the forum at `/`, the workshop at `/forge/` and the prototype snapshots under `/prototypes/`;
- `packages/pack-ancient-china` canonical V0.1 presentation for all eight capabilities;
- nine Ancient China identity definitions with explicit permission profiles and canonical capability/expert recommendations;
- Identity Playbook Core contracts and deterministic resolution/fallback helpers;
- nine Ancient China default Identity Playbooks spanning imperial governance, military/local administration, scholarship, commerce, household livelihood, and low-permission survival;
- identity-scale capability facets that can change labels, descriptions, questions, and examples while preserving the same stable Core capability ID;
- Character Agenda / Development Route Core contracts plus deterministic identity-playbook + route recommendation composition;
- 13 Ancient China route presets covering open-ended play, governance, iron rule, pleasure, official or military ascent, throne-seeking, court/household struggle, commerce, arts, retirement, survival, and custom goals;
- identity-scaled Agenda facets: the same stable route ID may change its human-facing label, summary, focus questions, capability overlay, and expert overlay for the current identity without changing permission;
- five additional route-oriented expert lenses: 武则天、苏轼、李清照、顾恺之、陶渊明;
- route-aware and identity-scaled capability/expert defaults in the Web App, while every route preserves the current identity permission profile;
- route suggestions are hints only: any identity may select any route, including servant → throne-seeking or emperor → retirement / arts;
- new Web manifests persist optional `agenda.routeId` and trimmed `agenda.customGoal`; unknown persisted routes fail canonical normalization;
- playbook- and agenda-aware one-line / compact prompt output, with explicit separation between current authority and desired future trajectory;
- Simplified Chinese (`zh-CN`) is now the primary V0.1 product presentation locale;
- ordinary Web controls, route previews, expert hints, forum badges, reliability labels, validation text, and human-readable prompt output are presented coherently in Simplified Chinese instead of exposing internal enum values;
- stable canonical IDs, JSON field names, route IDs, permission-profile IDs, and runtime enum values remain language-neutral and are still available in the machine manifest;
- the Web App reads `docs/MAINTAINER_LOG.md` at build time and extracts only the lore blockquotes into an in-product maintainer timeline, avoiding a second manually copied log source;
- current identity × route expert hints use the same identity-scaled Agenda resolver as recommendation assembly and prompt output;
- visible Web App explanation that birth-version `status` now lives in the always-on permission foundation and `intelligence` in the always-on evidence/non-omniscience foundation;
- canonical compact prompt, one-line output, and manifest serializers;
- deterministic canonical normalizer for schema/world-pack/version/identity/agenda checks, permission-profile derivation, duplicate resolution, stable capability/expert ordering, disabled-forum normalization, and runtime-invariant enforcement;
- Core permission-gate primitive returning `permitted`, `denied`, or `needs-context` from explicit profile scopes or accepted session overrides; capability or route selection itself never grants authority;
- Web App assembly using `CanonicalForgeConfig`, including agenda, capability activation modes, expert weights, Traveler Forum policy, token mode, evidence-state display, and invariant runtime flags;
- Web App exports pass through the Core canonical normalizer and surface current access/command bounds plus validation state before output;
- Traveler Forum thread, reply, curated-note, provenance, reliability, review-state, conflict, retrieval-query, and retrieved-note data contracts;
- deterministic curated-note retrieval filtered by world pack, identity, enabled capability, optional situation/exclusion labels, review status, and minimum reliability;
- fail-closed exclusion of raw/pending/display-only/superseded/deprecated material from automatic curated-note retrieval;
- conflict preservation for eligible curated notes instead of silent averaging;
- Traveler Forum reference-integrity validation for thread/reply/source/conflict links;
- all archive content is maintainer-authored (`seed:ancient-china-forum-v0.1` / `seed:ancient-china-forum-v3-archive`), never simulated community history; counts shown in the UI are real stored counts, never decoration;
- workshop Traveler Forum panel showing identity-relevant raw threads separately from currently retrievable curated-note candidates, with source-thread links back into the forum;
- birth-version config, pack, and prompt exports retained temporarily for migration compatibility;
- planned SillyTavern integration directory.

## Specified but not yet fully implemented

- permission-gate integration into the full event pipeline and machine-readable per-capability permission requirements;
- event-driven temporary expert activation / withdrawal without rewriting the persisted long-term Agenda;
- route-aware Traveler Forum applicability and contribution metadata;
- route stages / milestones for long transitions such as servant → official → minister or commoner → soldier → general;
- accepted-RP identity-transition handling that changes permission profiles only when the current-world identity actually changes;
- explanation UI for every recommendation (“why this module / expert?”);
- cross-identity usefulness fixtures that execute the same crisis through emperor, local official, merchant, commoner, and servant perspectives;
- broader same-identity multi-route fixtures beyond the current Core route-composition and identity-scaled prompt tests;
- explicit playbook selection when a pack offers more than one valid playbook for one identity;
- richer incompatibility/redundancy diagnostics beyond the current deterministic canonical normalizer;
- structured fact / claim / inference / hypothesis / unknown data flow in the Web App;
- structured session-patch editors for facts and claims;
- token-mode-specific prompt detail behavior beyond config/UI selection;
- full-prompt exporter;
- event/situation classification that supplies runtime Traveler Forum situation labels automatically;
- token-budget, duplication, and contradiction policy beyond the current deterministic result limit and explicit conflict preservation;
- contribution/review/moderation workflow for accepting real community forum submissions; no authorized real Discussion has been imported into the archive yet;
- one-click "install this module attachment into my profile": applying an attachment in the workshop changes capabilities / expert lenses only and never writes a profile;
- real Discussion reply counts or interaction numbers inside the forum (deliberately not shown; the community-gateway topic links out instead);
- renaming the machine id `ancient-china` to match the display name 架空王朝;
- session-only AI-generated forum chatter as an explicitly synthetic presentation layer;
- runtime activation/withdrawal behavior for on-demand capabilities;
- Traditional Chinese (`zh-Hant`) and English (`en`) presentation plus a language selector; these are intentionally deferred until Simplified Chinese terminology and product flows stabilize;
- cross-locale regression fixtures proving locale changes presentation only and never canonical IDs, permissions, Agenda, expert weights, or forum eligibility;
- SillyTavern runtime behavior;
- removal of birth-version compatibility exports after a bounded migration window.

## Current assembly boundary

The primary Web App now has four separate character-assistance concepts instead of treating identity as a complete life plan:

1. **Identity** — where the host is now and which permission profile applies;
2. **Identity Playbook** — how stable Core capabilities are translated to the host's current scale of agency;
3. **Agenda / Development Route** — where the host wants to go and which long-term capability/expert recommendations are useful;
4. **Current Event / Situation** — specified as the future temporary activation layer for immediate problems.

The first product-level correction for the emperor-first birth prototype remains implemented through Identity Playbooks. A playbook recomposes the same Core capabilities around the selected identity's scale of agency. For example, `readiness-logistics` may appear as military readiness for a general, 商路盘 for a merchant, 活路图 for a commoner, or 活路与储备图 for a servant. These are facets of one Core capability, not separate engines.

Agenda is also scaled by current identity where needed. A shared route such as `pleasure-and-stability` remains one stable route in the manifest, but its servant-facing interpretation can emphasize rest, small personal resources, free time and exposure risk while its emperor-facing interpretation can discuss delegation, succession and political stability. The route ID is shared; the life-scale presentation and recommendation overlay may differ. No Agenda facet contains permission data.

Playbooks are intentionally not persisted in `CanonicalForgeConfig`: they are pack-owned presentation / assembly defaults recoverable from the canonical identity. Agenda is different because it is user intent and materially changes long-term assistance. New Web manifests therefore persist an optional `agenda` object while birth-version / early V0.1 manifests without it remain readable.

Agenda is never a permission source. A servant may select `throne-seeking`, `military-ascent`, `official-ascent`, `arts-and-letters`, or any other route and still passes every permission check as a servant until accepted RP context actually changes the identity. Conversely, an emperor selecting `retreat-and-seclusion` does not instantly lose existing authority, obligations, enemies, or political exposure.

Before any Web App export, the current config is normalized against the loaded world pack. A stale or privileged `permissionProfile` string is not trusted: the normalizer derives the profile from the selected canonical identity. Unsupported schema/world-pack/version/identity/agenda inputs and weakened runtime invariants fail closed.

The Core permission gate is deliberately evidence-based rather than semantic guesswork. A capability may request an `access`, `request`, `command`, `allocate`, `publish`, `conceal`, or `observe` step, but it cannot grant that permission. Permission requires an exact declared profile scope or an explicit accepted session-context override. The full runtime event pipeline still needs to call this gate for every permission-sensitive capability action.

The Traveler Forum has a real repository-backed data layer. Raw threads are display/lore material and are not automatically injected. Runtime retrieval consumes only curated notes that pass review and applicability filters. Route-aware forum applicability is not yet implemented and is labelled as such in the Web App.

Since 2026-09-06 the forum is the product surface and the workshop is a tool inside it. Both read the same pack-owned archive and the same local profile store. A profile records what the reader chose (world pack, identity id, route id, optional custom goal, private notes) and nothing about what they may do: permission is always re-derived from the canonical identity in the loaded pack. Browsing any node, applying a module attachment in the workshop, or importing a backup never grants authority; the only write path from the workshop is the explicit, confirmed write-back.

## Presentation / localization boundary

V0.1 currently treats Simplified Chinese as the source product locale. The ordinary Web surface should read as a coherent Simplified Chinese product; internal enum values and stable IDs are not ordinary UI copy.

The canonical machine contract remains language-neutral. Changing future locale must never translate or mutate stable IDs, permission profiles, route selections, capability modes, expert weights, runtime invariants, or forum eligibility. The detailed sequencing policy is in `docs/LOCALIZATION_STRATEGY_V0.md`.

The in-product maintainer timeline is derived from the lore blockquotes in `docs/MAINTAINER_LOG.md`. Engineering records are deliberately not copied into the product surface and remain in the repository documentation.

## Birth-version compatibility boundary

The birth-version compatibility layer remains intentionally narrow:

- legacy identities: `emperor`, `general`, `servant`, `commoner`;
- `administration` → `accountability-execution`;
- `fiscal` → `ledger-evidence-crosscheck`;
- `logistics` → `readiness-logistics`;
- `motives` splits into `claim-action-consistency` + `multiplex-relationship-graph`;
- `intelligence` is absorbed into V0.1 evidence/non-omniscience semantics;
- `status` is absorbed into the always-on identity/permission foundation;
- `survival` is re-expressed as playbook-level composition across permission, relationships, readiness, red-team, and curated knowledge rather than restored as one guessed Core ID;
- `resources` is re-expressed through playbook composition across ledger, readiness, relationships, and scenario context; the old one-to-one migration remains manual-review because no single current Core capability is lossless.

New canonical identities and Agenda routes are not backported into the birth-version format. New manifests should use canonical IDs directly.

## Validation in repository

The Forum-first production migration (2026-09-06) landed as three squash commits, each validated by GitHub Actions `validate` (`pnpm install --frozen-lockfile && pnpm typecheck && pnpm test && pnpm build`, Node 20):

- `4a9e38a466cf0cf4be01f58f3bcc4f968e73f3b2` `refactor(forum): unify archive and runtime forum source (#1)` — run `33935437571`;
- `6ac2d6842ae7855de4447f3148cf19e34b2f89ec` `feat(web): promote forum-first shell to primary product (#2)` — run `34029427778`;
- `387104c5d27ca4ab25265bff3a5207bd2b559c32` `feat(web): share canonical local profiles across forum and forge (#3)` — run `34030600221`.

On `main` after the third merge, CI run `34030642244` and GitHub Pages deploy run `34030642241` both passed; the live root, `/forge/` and the prototype snapshot were checked in a browser afterwards.

The TypeScript test suites (`packages/*/tests/**/*.test.ts`, `apps/web/tests/**/*.test.ts`) run on `node --test` through `scripts/run-ts-tests.mjs` without new dependencies: 16 archive tests (integrity, vocabulary, no fabricated counts, gaps, identity-ended ≠ death, 22 / 82 parity with the V3 snapshot, curated-note retrieval, conflicts, provenance), 7 forum-shell tests (filters, reply search, legacy slug resolution, base-relative links) and 9 profile tests (persistence, unknown ids rejected, v4 → v5 and v3 migration, `requiresReview`, corrupt storage recovery, import fail-closed and modes, notes never in Discussion URLs), plus the 39 Core tests and the 7 prototype tests.

The earlier Simplified Chinese Web / lore-feed feature tree was validated before history cleanup by GitHub Actions run `33835505335` on commit `902222bac4d4b3491036cce733167a62df20ac46`:

- `pnpm install --frozen-lockfile` — passed;
- `pnpm typecheck` — passed;
- `pnpm test` — passed;
- `pnpm build` — passed.

The same Web build was deployed successfully by GitHub Pages run `33835505395`.

The committed tests also cover the earlier identity-scaled Agenda correction, including a generated compact-prompt regression that prevents servant + pleasure from falling back to succession/state-order framing while preserving the servant permission profile.

The wider test suite covers:

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
- playbook-less pack fallback;
- deterministic single-playbook resolution;
- ambiguous implicit playbook fail-closed fallback;
- capability facets preserving their stable Core capability ID and identity permission profile;
- Agenda overlays changing recommendations without mutating the current identity permission profile;
- identity-scaled Agenda facets preserving stable route identity while changing route-scale presentation/recommendations;
- deterministic demotion of an unrelated baseline primary expert when a route introduces a new primary;
- no-Agenda fallback preserving the Identity Playbook baseline;
- unknown persisted Agenda IDs failing canonical normalization;
- custom Agenda goal trimming / persistence without privilege escalation;
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
