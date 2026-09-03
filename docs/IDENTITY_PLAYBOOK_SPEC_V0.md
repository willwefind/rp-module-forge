# Identity Playbook Specification V0.1

Status: **normative world-pack presentation / assembly specification**  
Last updated: 2026-09-04

## 1. Purpose

An Identity Playbook translates generic Core capabilities into a useful scale of agency for one or more world-pack identities.

It exists because a stable capability such as `accountability-execution`, `readiness-logistics`, or `red-team` can be useful to an emperor, merchant, commoner, or servant while requiring radically different questions, examples, defaults, and presentation.

A playbook is not a permission profile, not a hidden rules engine, and not a second manifest schema.

## 2. Invariants

Every playbook implementation must preserve:

1. **Core IDs stay stable.** A facet may rename or reframe a capability for presentation; it may not create a new identity for that capability.
2. **Permissions remain authoritative.** Playbooks cannot grant `observe`, `access`, `request`, `command`, `allocate`, `publish`, or `conceal` rights.
3. **No omniscience.** A playbook cannot make setting information available merely because that information would be useful.
4. **Manifest remains canonical.** V0.1 manifests continue to persist capability IDs and modes, not presentation labels.
5. **Fallback is safe.** A pack without playbooks still works with its base capability presentation.
6. **Ambiguity fails closed.** If an identity maps to multiple implicit playbooks and has no explicit default, Core must fall back to base presentation rather than guess.
7. **Expert lenses remain lenses.** Playbook expert defaults do not turn experts into personas.
8. **Host retains final authority.** Playbooks alter assistance framing, never the host's decision ownership.

## 3. Contract

Core defines the generic structure; world packs own the content.

```ts
export type CapabilityFacet = {
  capability: CoreCapabilityId;
  label: string;
  description: string;
  questions: string[];
  examples: string[];
};

export type IdentityPlaybookDefinition = {
  id: string;
  label: string;
  summary: string;
  identities: string[];
  capabilityDefaults: CapabilitySelection[];
  expertDefaults: ExpertSelection[];
  facets: CapabilityFacet[];
};
```

`IdentityDefinition.defaultPlaybook` may explicitly name a playbook. During the V0.1 migration window, a pack may omit the explicit field when exactly one playbook declares that identity.

## 4. Resolution

For a selected identity:

1. resolve the identity from the loaded world pack;
2. if `defaultPlaybook` is present, use it only when the referenced playbook exists and declares that identity;
3. otherwise, if exactly one playbook declares that identity, use that playbook;
4. otherwise, resolve no playbook and use base capability presentation / identity recommendations.

Resolution must not inspect permission scopes to choose a more powerful playbook.

## 5. What a playbook may change

A playbook may change:

- capability default modes;
- expert default weights;
- user-facing capability labels or subtitles;
- descriptions;
- characteristic questions;
- examples;
- the explanation for why a capability is useful to this identity.

A playbook may not change:

- permission profiles;
- runtime invariants;
- evidence semantics;
- Core capability IDs;
- forum review / reliability rules;
- the current world's facts.

## 6. Capability facets

A facet is an identity-scale view of an existing capability.

Example: `readiness-logistics` may appear as:

- emperor / central government: state readiness and mobilization;
- general: 【烽燧图】 military readiness and supply;
- merchant: 商路盘 — inventory, cash, route, season, and substitutes;
- commoner: 活路图 — food, money, tools, dependents, route, time, and shelter;
- servant: 活路与储备图 — portable resources, safe routes, exposure, and people who may help.

These are not separate engines.

## 7. Foundation layers are not playbooks

Two useful birth-version modules were intentionally moved out of the selectable capability layer:

- `status` → identity / permission foundation;
- `intelligence` → evidence-state / bounded-context foundation.

The Web App should surface these foundations visibly so users do not interpret their removal from the capability list as lost functionality.

`survival` and `resources` are initially treated as playbook-level compositions rather than restored as one-to-one Core capabilities. Cross-identity tests must fail before new Core IDs are added for them.

## 8. Ancient China V0.1 default playbooks

The first pack seeds:

- `imperial-governance`
- `heir-court-survival`
- `regent-power-balance`
- `military-command`
- `local-governance`
- `scholar-network-navigation`
- `merchant-operation`
- `household-livelihood`
- `low-permission-survival`

The commoner and servant playbooks are acceptance-critical because the birth-version product was originally centered on imperial governance.

## 9. Web App behavior

When a playbook resolves, the Web App should:

1. show the playbook label and summary beside the selected identity;
2. apply playbook capability / expert defaults when the user requests recommended configuration;
3. show facet labels and descriptions while retaining the stable Core ID;
4. make the base system lineage visible where useful;
5. keep permission boundaries visible in the same screen;
6. export the normalized canonical config, not a playbook-expanded parallel manifest.

## 10. Prompt behavior

Canonical prompt output should derive presentation from the resolved playbook while keeping runtime rules generic.

The prompt should explicitly state that the playbook changes framing and defaults, not authority.

If no playbook resolves, prompt generation falls back to base pack capability presentation.

## 11. Acceptance tests

Required tests include:

- a pack without playbooks falls back safely;
- exactly one matching playbook resolves deterministically;
- ambiguous implicit playbooks fall back rather than guessing;
- a facet keeps the same Core capability ID;
- playbook resolution does not mutate permission profiles;
- the same scenario yields meaningfully different questions / permitted actions for emperor, local official, merchant, commoner, and servant;
- low-permission playbooks never transform useful analysis into invented access or command authority.

## 12. V0.1 manifest boundary

Playbook selection is currently an assembly / presentation concern and is not persisted in `CanonicalForgeConfig`.

If future runtime behavior needs to preserve a non-default playbook across clients, that requirement must be reviewed explicitly before adding a persisted playbook reference or bumping manifest schema/version rules.
