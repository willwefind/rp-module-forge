# Prompt Output Specification V0.1

Status: **normative output contract**  
Last updated: 2026-09-03

All export formats derive from the same normalized canonical configuration. A shorter formatter may remove detail, but it may not weaken identity permissions, evidence semantics, `omniscience = false`, expert-lens boundaries, or host-final-decision authority.

## 1. Shared semantic envelope

Every prompt export must preserve, at minimum:

- world pack and host identity;
- permission boundary;
- enabled capability IDs / pack-facing names;
- capability activation mode where relevant;
- expert lenses as methods, not personas;
- evidence states: fact / claim / inference / hypothesis / unknown;
- Traveler Forum policy when enabled;
- non-omniscience;
- host-final-decision;
- current-session patch only as supplied context, never as a way to weaken invariants.

## 2. One-line invocation

Use when the active session already contains the full contract.

It should identify the configured system and restate the irreducible invariants.

Example:

```text
$当前已装载【中国古代·地方官辅助系统】；常驻【考成台】【知行镜】，按需启用【鱼鳞算盘】【御前反对席】。系统不凭空获得当前世界情报，事实/推断分离，行动受身份权限约束，最终裁决由宿主完成。
```

The one-line form may not become a magic incantation that silently restores omitted rules unless those rules are already present in the session.

## 3. Compact injection prompt

Target: ordinary long-running RP or constrained context.

Must include:

1. identity and permission summary;
2. resident and on-demand capabilities;
3. compact trigger/output rules;
4. active expert-lens questions;
5. evidence-state rule;
6. Traveler Forum injection policy;
7. non-omniscience;
8. host-final-decision;
9. concise session patch.

It should omit decorative lore before it omits semantics.

## 4. Full setting + injection prompt

Use for first setup, debugging, audits, complex scenes, or a model that has never seen the system.

May include:

- module fiction / world-pack presentation;
- complete identity permission profile;
- capability purpose, triggers, required inputs, outputs, failure behavior, and token class;
- expert strengths, characteristic questions, and blind spots;
- Traveler Forum provenance/reliability rules and eligible notes;
- runtime lifecycle and response envelope;
- red-team behavior;
- themed UI language;
- session patch;
- forbidden behavior examples.

The full form is still assistance, not autonomous character control.

## 5. Manifest

The manifest is the portable source of truth for the Web App and integrations.

Target shape:

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
    { "id": "zhang-juzheng", "weight": "primary" }
  ],
  "travelerForum": {
    "enabled": true,
    "autoInject": "curated-only",
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

Stable manifests store generic IDs. World-pack display names such as 【御前反对席】 are resolved at presentation time.

## 6. Token modes

- **Light:** invariants, identity summary, terse triggers and outputs.
- **Standard:** default permission and capability contracts, concise forum retrieval.
- **Full:** full lore, expert comparison, forum context, and UI protocol.

Token mode changes verbosity, not meaning.

## 7. Formatter tests

Given the same normalized config:

- all formats must agree on identity and permissions;
- all formats must agree on enabled capability IDs;
- all formats must keep `omniscience = false`;
- all formats must preserve host-final-decision;
- expert removal must not change host persona;
- shorter formats must never upgrade claims or inferences to facts;
- unsupported manifest versions must fail clearly rather than partially load.
