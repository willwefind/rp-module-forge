# Architecture V0.1

Status: **normative target architecture**  
Last updated: 2026-09-03

## 1. Architectural objective

RP Module Forge must support many worlds and runtimes without duplicating its rules. The architecture therefore separates generic reasoning contracts from world-specific presentation and separates configuration from runtime delivery.

The core owns meaning. A world pack owns names, content, examples, and aesthetics. An integration owns transport and host-platform lifecycle.

## 2. System overview

```text
                         AUTHORING

 World Pack ───────────────┐
 Identity Profile ─────────┤
 Capability Selection ─────┤
 Expert Lenses ────────────┤
 Traveler Forum Policy ────┤
 Runtime / Token Rules ────┤
 Session Patch ────────────┘
             │
             ▼
      Canonical Config
             │
      validate + normalize
             │
             ▼
        Prompt Engine
      ┌──────┼────────┬─────────┐
      ▼      ▼        ▼         ▼
   one-line compact   full    manifest

                         DELIVERY

     Web export                 Runtime adapter
                                    │
                           SillyTavern (first-party)
                                    │
                       active chat's existing model
```

## 3. Layer model

### 3.1 Core contracts

`packages/core` owns:

- type definitions and stable IDs;
- schema validation and migration;
- config normalization and default resolution;
- permission and compatibility checks;
- capability activation contracts;
- evidence-state and uncertainty rules;
- Prompt Engine and output formatters;
- token-budget policies;
- adapter-facing runtime events.

The core must not contain Ancient China UI names such as 【考成台】 or lore-specific assumptions such as imperial authority.

### 3.2 World packs

A world pack supplies:

- pack metadata and compatibility version;
- identities and permission/risk profiles;
- localized labels and descriptions for generic capabilities;
- setting-specific expert lenses;
- Traveler Forum boards, posts, and curated notes;
- examples, terminology, UI skin metadata, and recommended configurations.

A pack may recommend capabilities, but it may not redefine a core capability's safety semantics.

### 3.3 Web App

`apps/web` is the primary product surface. It must:

- guide the assembly flow;
- explain recommendations and conflicts;
- preview normalized configuration and exports;
- import/export manifests locally;
- avoid requiring an account or backend for V0.1;
- avoid reading unrelated local or private chat data.

### 3.4 Runtime integrations

An integration consumes the shared core and adapts it to a host platform. It may:

- observe only the host-approved context provided by that platform;
- display active modules and evidence state;
- inject compact or full runtime rules;
- temporarily expand on-demand modules;
- withdraw temporary rules after the event;
- export updates back to a manifest.

It may not silently grant permissions, reinterpret evidence rules, store model credentials, or maintain a forked capability engine.

## 4. Canonical configuration

The manifest is the portable source of truth. The current TypeScript skeleton may implement only a subset; this is the V0.1 target shape:

```json
{
  "schemaVersion": 1,
  "worldPack": {
    "id": "ancient-china",
    "version": "0.1"
  },
  "identity": {
    "id": "local-official",
    "permissionProfile": "ancient-china:local-official:v1"
  },
  "capabilities": [
    { "id": "accountability-execution", "mode": "resident" },
    { "id": "ledger-evidence-crosscheck", "mode": "on-demand" },
    { "id": "red-team", "mode": "on-demand" }
  ],
  "experts": [
    { "id": "zhang-juzheng", "weight": "primary" },
    { "id": "wang-yangming", "weight": "secondary" }
  ],
  "travelerForum": {
    "enabled": true,
    "autoInject": "curated-only",
    "showThreadLinks": true,
    "minimumReliability": "corroborated"
  },
  "runtime": {
    "tokenMode": "standard",
    "activationPolicy": "event-driven",
    "showEvidenceState": true,
    "hostFinalDecision": true,
    "omniscience": false
  },
  "sessionPatch": {
    "facts": [],
    "claims": [],
    "notes": ""
  }
}
```

### 4.1 Stable IDs and display labels

- Stable IDs are lowercase kebab-case and language-neutral.
- Display labels belong to locale or world-pack data.
- A saved manifest stores IDs, not presentation text.
- Renaming 【御前反对席】 must not change the identity of `red-team`.
- Deprecated IDs require an explicit migration path.

### 4.2 Normalization

Normalization must be deterministic:

1. validate schema and versions;
2. resolve world pack and identity;
3. derive permission profile;
4. apply recommended defaults only when the user has not made an explicit choice;
5. detect incompatible or redundant options;
6. preserve explicit user choices where safe;
7. produce a canonical ordering for stable diffs;
8. emit warnings separately from fatal errors.

## 5. Identity and permission model

Identity is a capability boundary, not a flavor label. A permission profile should express at least:

| Dimension | Meaning |
| --- | --- |
| observe | Information normally visible to the identity |
| access | Records, places, people, or tools the identity can reach |
| request | Information or action the identity may ask others for |
| command | Actions the identity can directly order |
| allocate | Resources the identity may commit |
| publish | Statements the identity can safely make in public |
| conceal | Actions that can plausibly be performed discreetly |
| risk | Expected consequences when boundaries are crossed |

Permission checks occur before a capability proposes an evidence-gathering or execution step. The same `red-team` capability can therefore serve an emperor and a servant while producing radically different actionable options.

## 6. Capability contract

Every capability must declare:

- stable ID and version;
- purpose and non-purpose;
- activation triggers;
- required and optional inputs;
- evidence-state expectations;
- processing steps or required questions;
- output fields;
- permission-sensitive actions;
- uncertainty and refusal behavior;
- token cost class;
- pack-provided labels/examples.

Capability modes:

- `resident` — compact rules remain available throughout the session;
- `on-demand` — expanded only when a matching event or explicit request occurs;
- `disabled` — absent from runtime output.

## 7. Expert-lens contract

An expert lens contains:

- a method summary;
- characteristic questions;
- strengths and preferred evidence;
- known blind spots and tensions;
- compatible capability recommendations;
- an optional comparison or synthesis format.

It must not contain instructions to speak as, become, or dominate the host character. Multiple lenses may disagree. A synthesis reports the disagreement and leaves the decision to the host.

## 8. Traveler Forum architecture

Traveler Forum is split into:

```text
Raw / authored thread
   ├─ original post
   ├─ replies and disagreements
   ├─ provenance
   └─ review state
          │
          ▼ human review / curation
Curated knowledge note
   ├─ bounded claim
   ├─ applicability
   ├─ reliability
   ├─ failure modes
   └─ source thread IDs
          │
          ▼ retrieval policy
Runtime injection or optional old-thread display
```

Raw threads are valuable for voice and context but are not automatically trusted. Curated notes are compact and eligible for injection only under the configured reliability and applicability rules.

See [TRAVELER_FORUM_SPEC.md](TRAVELER_FORUM_SPEC.md).

## 9. Prompt Engine

The Prompt Engine receives only normalized configuration and target-output options. It must:

- preserve identity permissions and safety invariants across all formats;
- distinguish facts, claims, inferences, hypotheses, and unknowns;
- include active capability contracts at the selected token detail;
- include expert lenses as methods, not personas;
- include only eligible Traveler Forum knowledge;
- make the host-final-decision rule explicit;
- prevent the session patch from changing system invariants;
- produce deterministic output where inputs are equal.

Output adapters may shorten, reorder, or format material, but may not weaken non-omniscience or permission rules.

## 10. Runtime lifecycle

```text
context arrives
      ↓
classify facts / claims / unknowns
      ↓
apply identity permission gate
      ↓
match event to active capabilities
      ↓
expand resident or on-demand contracts
      ↓
analyze + state uncertainty
      ↓
optional expert comparison / red team
      ↓
offer permitted options
      ↓
host decides
      ↓
record accepted world feedback as new context
```

Runtime rules are defined in [RUNTIME_SYSTEM_SPEC.md](RUNTIME_SYSTEM_SPEC.md).

## 11. SillyTavern boundary

The planned first-party adapter should use the model already configured by SillyTavern. It should not request or store a second API key.

Conceptual path:

```text
approved current-chat context
          ↓
RP Module Forge adapter
          ↓
shared config + Prompt Engine
          ↓
targeted context injection
          ↓
the chat's existing model
```

The adapter may offer a sidebar for current systems, token mode, temporary activation, and evidence-state visibility. Exact injection targets remain an integration decision and must be documented before implementation.

## 12. Dependency rules

Allowed:

```text
apps/web ────────────────→ packages/core
apps/web ────────────────→ world packs
world packs ─────────────→ packages/core types
integrations/* ──────────→ packages/core
```

Forbidden:

- `packages/core` importing a world pack;
- a world pack importing the Web App;
- an integration copying or reimplementing Prompt Engine logic;
- content entries mutating core permission or evidence semantics;
- UI labels serving as persistent identifiers.

## 13. Privacy and local-first boundary

For V0.1:

- configuration and export can remain local;
- no account is required;
- no model credential is collected;
- no chat is read without an explicit integration and host-approved scope;
- exported manifests should not contain private transcript text by default;
- session patches are user-controlled and should warn before including sensitive content.

## 14. Failure behavior

The system fails closed when:

- a manifest version is unsupported;
- a world pack or identity is missing;
- a capability conflicts with permission invariants;
- a required input is absent;
- evidence does not support a requested conclusion;
- a forum note is ineligible for automatic injection.

Failure output should say what is missing, what remains usable, and what the user can do next. It should never fill a gap with invented setting facts.

## 15. Required architectural tests

- config normalization is deterministic;
- every pack label resolves to a stable core ID;
- permission profiles materially alter action suggestions;
- all four export formats preserve safety invariants;
- expert removal does not change host identity;
- ineligible forum posts never enter automatic injection;
- on-demand modules expand and withdraw without state leakage;
- imports reject unsupported versions with a useful error;
- a runtime adapter can consume core output without pack-specific branching.
