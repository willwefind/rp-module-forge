# Product Definition V0.1

Status: **normative product baseline**  
Scope: product truth, user promise, boundaries, and V0.1 acceptance criteria  
Last updated: 2026-09-03

## 1. Product statement

RP Module Forge is an open-source visual builder for assembling portable assistance systems for AI roleplay (AIRP) and text roleplay.

The product turns reusable world-pack content, identity permissions, capability modules, expert lenses, Traveler Forum knowledge, runtime rules, and session-specific context into a canonical configuration and several prompt outputs.

The **Web App is the primary product**, not a demo for a plugin. Integrations extend the same system into runtime environments; they do not redefine it.

## 2. Product truths

These statements are binding for V0.1 design and implementation:

1. **AIRP/RP generality.** The core is not tied to a single story, character, model provider, or historical setting.
2. **Web-first.** The Web App is the authoritative assembly and export surface.
3. **World packs, not hard-coded worlds.** Ancient China is the first official pack, not the product's permanent boundary.
4. **First-party SillyTavern path.** SillyTavern is the first planned official runtime integration and must reuse the shared core.
5. **No omniscience.** Methods may be preloaded; current-world facts may not be.
6. **Identity determines permission.** Recommendations and outputs must respect what the host can plausibly observe, request, order, access, and survive doing.
7. **Experts are lenses.** Expert packs offer questions, heuristics, trade-offs, and failure modes. They do not impersonate the historical figure or overwrite the host's personality.
8. **The host decides.** The system may warn, compare, or recommend, but never silently turns advice into a character decision.
9. **Traveler Forum is a first-class subsystem.** It has a data model, provenance, review states, reply chains, retrieval rules, and a curated knowledge layer.
10. **Open-source collaboration enters the lore.** Contributions may be presented as traveler submissions, while ordinary engineering records remain complete and readable.

## 3. User promise

A user should be able to express:

> “Who am I in this world, what can I realistically know and do, which forms of assistance do I want, how should they behave, and how much context can I afford?”

The Forge should return a portable system that behaves consistently across supported exports and integrations.

It should improve the quality of questions, evidence handling, operational reasoning, and consequence simulation without solving the setting by fiat.

## 4. Primary users

- roleplayers who want structured assistance without losing character agency;
- scenario and world builders who want reusable system rules rather than one-off prompts;
- SillyTavern users who want the same configured system to become available during play;
- pack authors who want to add identities, modules, expert lenses, and lore without forking the core;
- maintainers who want community knowledge contributions to be both reviewable data and part of the world fiction.

## 5. Core user flow

1. Select a world pack.
2. Select or define the host identity.
3. Review the resulting permission profile and risk boundaries.
4. Review recommended capabilities and the reasons for each recommendation.
5. Enable, disable, or mark capabilities as on-demand.
6. Add optional expert lenses.
7. Configure Traveler Forum retrieval and display behavior.
8. Choose runtime and token-budget rules.
9. Add a session patch containing only facts the current RP has established.
10. Export one or more formats.

The interface must distinguish a recommendation from a forced dependency. It must also explain when an option is unavailable because of identity, evidence, or runtime limits.

## 6. Canonical product objects

| Object | Answers | Owned by |
| --- | --- | --- |
| World pack | How is the system named, contextualized, and illustrated in this setting? | Pack |
| Identity profile | What may this host observe, access, request, command, spend, and risk? | Core contract + pack data |
| Capability module | What reasoning operation is available? | Core contract + pack presentation |
| Expert lens | Which method, questions, strengths, and blind spots influence analysis? | Pack data |
| Traveler Forum | Which field experiences exist, how reliable are they, and how are they retrieved? | Core contract + pack content |
| Runtime rules | When are systems active, what do they consume, and what do they return? | Core |
| Session patch | What has this particular RP established? | User/session |
| Canonical config | What exact portable system did the user assemble? | Core |
| Export | How is the same configuration represented for a target context? | Prompt Engine / adapter |

## 7. V0.1 outputs

All outputs must derive from the same normalized configuration:

- **One-line invocation** for sessions that already contain the full rules.
- **Compact injection prompt** for constrained context windows.
- **Full setting + injection prompt** for first setup or maximum clarity.
- **Machine-readable manifest** for import, export, diffing, migration, and integrations.

An output formatter may omit detail for size, but it may not change the meaning of permissions, non-omniscience, or host authority.

## 8. Trust and agency contract

The system must distinguish at least:

- **established fact** — explicitly present in accepted RP context or user input;
- **reported claim** — attributed but not independently verified;
- **inference** — reasoned from available evidence;
- **hypothesis** — plausible but weakly supported;
- **unknown** — absent or insufficiently supported.

When evidence is insufficient, the useful output is not a fabricated answer. It is:

- what is known;
- what conflicts;
- what remains unknown;
- which evidence would discriminate between explanations;
- which evidence-gathering actions are permitted and safe for the host.

The system must not:

- reveal facts merely because a module's theme implies them;
- turn an inference into a hidden-world fact;
- grant an identity powers it does not hold;
- make irreversible character choices without an explicit user decision;
- present expert advice as a command from the real historical person;
- treat a Traveler Forum anecdote as universal truth.

## 9. V0.1 scope

V0.1 includes:

- the public monorepo and shared TypeScript core skeleton;
- the Web App as primary assembly surface;
- canonical configuration and output contracts;
- the Ancient China Pack as the first official pack;
- identity/permission, capability, expert-lens, Traveler Forum, and runtime specifications;
- one-line, compact, full, and manifest export targets;
- a documented first-party SillyTavern integration boundary.

## 10. Non-goals for V0.1

- account system or cloud sync;
- hosted database;
- API-key collection, relay, or storage;
- model proxy or built-in model service;
- automatic reading of private chats by the Web App;
- autonomous character control;
- automatic truth extraction from an RP transcript;
- support for every world genre;
- claiming historical reconstruction or professional governance advice;
- a reputation or voting economy for forum contributors.

## 11. V0.1 acceptance criteria

V0.1 is product-valid when all of the following are true:

1. A user can build and export an Ancient China configuration from the Web App.
2. Emperor, general, local official, merchant/commoner, and servant-style starts produce materially different permission boundaries and recommendations.
3. Every enabled Ancient China system maps to a generic core capability ID.
4. The same config produces semantically consistent one-line, compact, full, and manifest exports.
5. Outputs always include non-omniscience, evidence-state, and host-final-decision rules.
6. Expert lenses can be enabled or removed without replacing the host persona.
7. Traveler Forum entries carry provenance and reliability state; only eligible curated notes are automatically injected.
8. On-demand capabilities can be expanded and withdrawn without rebuilding the whole configuration.
9. Imported manifests are validated and fail clearly when incompatible.
10. The SillyTavern adapter design consumes shared core contracts and requires no second model API key.

## 12. Validation scenario

Use one shared political or resource crisis and run it through at least four identities:

- emperor;
- general;
- local official;
- servant or other low-permission role.

The available evidence, safe questions, executable actions, recommended modules, and risk warnings must differ. If all four receive essentially the same plan with different flavor text, the architecture has failed.

## 13. Status language

Documentation, code, and releases must use these labels consistently:

- **specified** — described by an accepted contract;
- **implemented** — present in code;
- **validated** — covered by proportionate automated or manual evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.

“Specified” never implies “implemented.” V0.1 is allowed to be incomplete, but it is not allowed to be ambiguous about what currently works.
