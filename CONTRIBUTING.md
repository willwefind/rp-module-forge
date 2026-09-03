# Contributing to RP Module Forge

Thanks for helping maintain the traveler network.

RP Module Forge welcomes engineering contributions and content contributions. You do **not** need to adopt an in-world persona to participate; the lore layer is optional presentation, not a gatekeeping device.

## Good contribution targets

- world packs and localized presentation;
- identity / permission profiles;
- generic capability contracts;
- expert cognitive lenses;
- Traveler Forum threads and curated notes;
- Prompt Engine and manifest validation;
- Web App UI, accessibility, import/export, and local-first behavior;
- SillyTavern integration;
- tests, examples, documentation, and migration tooling.

## Project invariants

Every contribution must preserve:

1. **No omniscience.** A module may improve analysis; it may not invent current-world facts.
2. **Identity controls permission.** The host may only observe, request, command, allocate, publish, or conceal what the configured identity can plausibly do.
3. **Experts are lenses.** Expert packs change questions and evaluation, not the host persona.
4. **The host decides.** Major irreversible choices remain explicit user decisions.
5. **Evidence stays typed.** Fact, claim, inference, hypothesis, and unknown are not interchangeable.
6. **One core, many skins.** Generic capability meaning lives in core; world packs own names, examples, experts, and lore.
7. **One engine, many surfaces.** Web App and integrations reuse the same core and Prompt Engine.
8. **Traveler anecdotes are not truth.** Runtime advice must respect review state, applicability, provenance, and reliability.
9. **No secrets in public history.** Never commit API keys, tokens, private RP logs, passwords, or identifying personal data.

## Adding Traveler Forum material

A forum contribution should state, where possible:

- world pack;
- applicable identity or identities;
- capability / system;
- situation tags;
- post type (`blood-and-tears`, `verified-practice`, `question`, etc.);
- reliability and review state;
- what the lesson does **not** prove;
- failure modes or counterexamples.

Runtime injection is stricter than display. Raw posts can be entertaining and useful without being eligible for automatic advice.

See [`docs/TRAVELER_FORUM_SPEC.md`](docs/TRAVELER_FORUM_SPEC.md).

## Adding a new world pack

A pack should provide presentation and content, not fork core semantics. It may rename `red-team` as an in-world system, but it may not redefine what red-team analysis means or weaken permission/evidence rules.

Before adding a pack, document:

- pack ID and compatibility version;
- identity defaults and risks;
- mappings from generic capability IDs to pack-facing labels;
- expert lenses;
- Traveler Forum boards / content conventions;
- examples and UI language.

## Maintainer-log convention

Substantial changes may receive two records:

```text
Git commit:
feat(core): add identity permission profiles

Maintainer lore:
【第110次维护记录】不是所有老乡都能调户部的账
```

The lore entry adds voice; the Git commit, PR, tests, migration notes, and security impact remain authoritative engineering records.

See [`docs/MAINTAINER_LOG.md`](docs/MAINTAINER_LOG.md).

## Before opening a PR

- keep generic logic out of world-pack presentation files;
- add or update validation where behavior changes;
- state whether the change is specified, implemented, validated, integrated, or stable;
- document schema or manifest migration if IDs change;
- do not claim an integration or test exists until it actually does;
- keep commits conventional and searchable.
