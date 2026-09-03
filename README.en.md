# RP Module Forge

**A visual builder for portable, non-omniscient assistance systems in AI and text roleplay.**

[简体中文](README.md) · [Product definition](docs/PRODUCT_V0.md) · [Architecture](docs/ARCHITECTURE.md) · [Ancient China Pack](docs/ANCIENT_CHINA_PACK_V0.md)

RP Module Forge helps roleplayers assemble an in-world support system from reusable parts:

> **Traveler Forum · Maintainer notice**
> A fellow traveler submitted a new blood-and-tears note.
> The failure has been distilled into a reusable module so the next traveler does not have to repeat it.

That is not just flavor text: **open-source collaboration is part of the project fiction.** Real issues, pull requests, reviews, corrections, and fixes may appear in-world as traveler questions, replies, errata, and maintainer records while ordinary Git history remains fully readable.

- a **world pack** that supplies setting-aware language and content;
- an **identity and permission profile** that limits what the host can know and do;
- **capability modules** for evidence, logistics, relationships, red-teaming, and more;
- **expert lenses** that provide methods of thought without overwriting the character;
- a **Traveler Forum** knowledge layer built from field notes, disputes, and hard-earned failures;
- **runtime rules** that tell an external model when and how to use the selected systems.

The Web App is the product's primary surface. The first official world pack is **Ancient China**, and **SillyTavern** is the first planned first-party runtime integration.

> The system is not omniscient. It may organize evidence, expose contradictions, identify missing information, and simulate consequences. It may not invent current-world facts, hidden relationships, private ledgers, or secret intentions.

## What it is — and is not

RP Module Forge is more than a character-card or prose-prompt generator. A single canonical configuration can describe the host identity, available permissions, enabled capabilities, expert lenses, forum policy, runtime behavior, and session-specific patch.

It does **not** replace the host character's personality or judgment. Experts are cognitive lenses, never possession, impersonation, or personality overlays. Recommendations remain recommendations; the host makes the final decision.

In V0.1, the Web App assembles and exports rules for use in an external RP client or model. It does not read private chats, relay API keys, proxy model traffic, or run a model of its own.

## Product model

```text
World Pack
   + Identity / Permission Profile
   + Capability Modules
   + Expert Lenses
   + Traveler Forum Policy
   + Runtime Rules
   + Session Patch
              ↓
        Canonical Config
              ↓
         Prompt Engine
      ↙       ↓       ↘
 one-line   prompts   manifest
```

The same core must power every surface. Integrations consume the canonical configuration and Prompt Engine; they do not create a second rules engine.

## Ancient China: the first world pack

The Ancient China Pack gives eight cross-world core capabilities an in-world interface:

| Ancient China name | Core capability | Purpose |
| --- | --- | --- |
| 【考成台】 | Accountability & Execution | Trace responsibility, commitments, delay, and execution breaks. |
| 【知行镜】 | Claim–Action Consistency | Compare declared positions with observable behavior. |
| 【鱼鳞算盘】 | Ledger & Evidence Cross-check | Test fiscal, population, land, storage, and trade figures across sources. |
| 【朋党谱】 | Multiplex Relationship Graph | Model overlapping ties, interests, alliances, and enmities without reducing people to one faction score. |
| 【烽燧图】 | Readiness & Logistics | Separate nominal strength from deployable capacity, supply, time, and route constraints. |
| 【民声池】 | Plural Stakeholder Signals | Preserve conflicting voices and sampling bias instead of producing one universal popularity score. |
| 【御前反对席】 | Red Team Engine | Ask how an opponent, bureaucracy, market, or unintended incentive could defeat a plan. |
| 【老乡遗言库】 | Curated Practitioner Knowledge | Inject reviewed lessons distilled from Traveler Forum threads. |

These Chinese names belong to the pack's presentation and lore. Their underlying contracts live in the generic core so future packs can provide their own names, examples, and aesthetics.

## Traveler Forum

Traveler Forum is a first-class subsystem, not a random quote generator. It has two linked layers:

1. **Forum threads** preserve voice, disagreement, replies, failure reports, and provenance.
2. **Curated knowledge** turns reviewed lessons into compact, reusable notes suitable for prompt injection. In the Ancient China Pack, this layer appears as 【老乡遗言库】 within **天道降维互助论坛**.

Open-source collaboration is part of the fiction: a contribution may appear in-world as a traveler submitting a new field note. The lore never replaces ordinary engineering records, review, attribution, or Git history.

See [Traveler Forum Specification](docs/TRAVELER_FORUM_SPEC.md).

## Outputs

All exports derive from the same canonical configuration:

1. **One-line invocation** — a minimal reminder for a session that already knows the system.
2. **Compact injection prompt** — the active permissions, modules, evidence rules, and decision boundary.
3. **Full setting + injection prompt** — fiction, runtime protocol, module contracts, guardrails, and session patch.
4. **Machine-readable manifest** — a portable configuration for the Web App and integrations.

## Repository map

```text
apps/web/                    Primary visual builder
packages/core/               Types, validation, normalization, Prompt Engine
packages/pack-ancient-china/ First-party world-pack content
integrations/sillytavern/    Planned first-party runtime adapter
docs/                        Product and system specifications
```

Start with:

- [Product Definition V0.1](docs/PRODUCT_V0.md)
- [Architecture V0.1](docs/ARCHITECTURE.md)
- [Ancient China Pack V0.1](docs/ANCIENT_CHINA_PACK_V0.md)
- [Traveler Forum Specification](docs/TRAVELER_FORUM_SPEC.md)
- [Runtime System Specification](docs/RUNTIME_SYSTEM_SPEC.md)
- [Prompt Output Specification](docs/PROMPT_OUTPUT_SPEC.md)
- [Maintainer Log](docs/MAINTAINER_LOG.md)
- [Current Implementation Status](docs/CURRENT_IMPLEMENTATION_STATUS.md)
- [Roadmap](docs/ROADMAP.md)

## Local development

Requirements: Node.js 20+ and pnpm 10.15.0.

```bash
pnpm install
pnpm dev
```

On Windows PowerShell, use `pnpm.cmd` if script execution policy blocks `pnpm.ps1`:

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Validation:

```bash
pnpm typecheck
pnpm build
```

## Status

**Public V0.1 — architecture and contracts are being stabilized.**

The repository currently contains an early Web App and shared-package skeleton. The documents define the V0.1 target contract; a documented capability should not be assumed implemented until it is represented in code and validation.

## Contributing

Contributions may add identities, capabilities, expert lenses, Traveler Forum material, runtime behavior, or future world packs. Contributions must preserve:

- non-omniscience and explicit uncertainty;
- identity-based permission limits;
- expert-lens boundaries;
- host-final-decision authority;
- the separation of generic core logic from world-pack presentation;
- the separation of lore-facing logs from ordinary engineering facts.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the current repository workflow.

## License

MIT
