# Product Definition V0.1

Status: **normative product baseline**  
Scope: product truth, user promise, boundaries, and V0.1 acceptance criteria  
Last updated: 2026-09-04

## 1. Product statement

**天道降维互助论坛 is the primary product world and interaction shell.**

It is an open-source traveler community where people can browse and contribute threads, replies, corrections, blood-and-tears reports, module releases, maintainer notices, and reviewed reusable knowledge for AI roleplay (AIRP) and text roleplay.

`RP Module Forge` is a first-party tool maintained inside that forum ecosystem. It is the module workshop used to inspect, adapt, assemble, export, and maintain portable assistance systems shared through forum module-release topics.

The forum and the Forge consume the same shared Core contracts. Runtime integrations extend those contracts into RP clients; they do not redefine the product.

## 2. Product truths

These statements are binding for V0.1 design and implementation:

1. **Forum-first.** The primary user world is 天道降维互助论坛. The current standalone builder becomes the module workshop, not the permanent home-page identity.
2. **AIRP/RP generality.** The Core is not tied to a single story, character, model provider, or historical setting.
3. **World packs, not hard-coded worlds.** Ancient China is the first official pack, not the product's permanent boundary.
4. **One shared system.** Forum module attachments, the Forge workshop, manifests, Prompt Engine and integrations must reuse shared Core meaning rather than maintain separate long-term rule sets.
5. **First-party SillyTavern path.** SillyTavern is the first planned official runtime integration and must reuse the shared Core.
6. **No omniscience.** Methods may be preloaded; current-world facts may not be.
7. **Identity determines permission.** Recommendations and outputs must respect what the host can plausibly observe, request, order, access, allocate, publish, conceal and survive doing.
8. **Agenda is intent, not authority.** A desired future route may change long-term recommendations but cannot prepay a future identity or permission profile.
9. **Experts are lenses.** Expert packs offer questions, heuristics, trade-offs and failure modes. They do not impersonate the historical figure or overwrite the host's personality.
10. **The host decides.** The system may warn, compare or recommend, but never silently turns advice into a character decision.
11. **Traveler Forum is a first-class subsystem.** It has a data model, provenance, review states, reply chains, retrieval rules and a curated knowledge layer.
12. **Forum browsing is meta-layer access, not in-world authority.** A servant may browse emperor topics. Reading a forum post never grants the RP character access to imperial records or actions.
13. **Module releases are special forum topics.** They remain discussable, versioned community posts with one structured module attachment rather than living in a disconnected marketplace.
14. **Open-source collaboration enters the lore.** Contributions may be presented as traveler submissions while ordinary engineering records remain complete and readable.
15. **Simplified Chinese first during V0.1 shaping.** Human-facing product copy is stabilized in `zh-CN` before Traditional Chinese and English are synchronized; machine identifiers remain language-neutral.

## 3. User promise

A forum visitor should be able to discover what earlier travelers tried, what failed, which experiences were reviewed, and which reusable modules may fit the current RP.

When adapting a module, the user should be able to express:

> “Who am I in this world, what can I realistically know and do, where do I want this character's life to go, which forms of assistance do I want, how should they behave, and how much context can I afford?”

The system should return a portable assistance configuration that behaves consistently across supported exports and integrations.

It should improve the quality of questions, evidence handling, operational reasoning and consequence simulation without solving the setting by fiat.

## 4. Primary users

- roleplayers who want structured assistance without losing character agency;
- forum readers looking for reusable traveler experience, module releases, corrections and failure reports;
- scenario and world builders who want reusable system rules rather than one-off prompts;
- SillyTavern users who want the same configured system to become available during play;
- pack authors who want to add identities, modules, expert lenses and lore without forking the Core;
- contributors who want to submit forum content or module improvements with visible provenance and review state;
- maintainers who want community knowledge contributions to be both reviewable data and part of the world fiction.

## 5. Primary user flows

### 5.1 Forum discovery flow

1. Enter 天道降维互助论坛.
2. Browse a primary section / node or the latest / featured stream.
3. Scan dense topic rows by type, title, node, tags, reliability and activity.
4. Open ordinary threads, corrections, maintainer posts or module releases.
5. Optionally use current-session identity / Agenda context to personalize recommendations.
6. Browse other sections freely regardless of current RP identity.

### 5.2 Module adaptation flow

1. Open a module-release topic.
2. Read author notes, replies, corrections, version history and provenance.
3. Inspect the structured module attachment.
4. Compare its original identity / route assumptions with the current session.
5. Choose to install as-is, adapt to the current identity / Agenda, or take only selected capabilities.
6. Open RP Module Forge when detailed assembly is needed.
7. Review current permission boundaries, capability modes and expert lenses.
8. Normalize and export one or more formats.

### 5.3 Contribution / maintenance flow

1. Submit or revise a forum thread, reply, module release or correction.
2. Preserve provenance and review state.
3. Keep raw community material separate from curated runtime knowledge.
4. If material is approved for reuse, derive a curated note or module revision without rewriting the original history.
5. Record meaningful product / architecture changes in both conventional Git history and the lore-facing maintainer log.

## 6. Canonical product objects

| Object | Answers | Owned by |
| --- | --- | --- |
| Forum node / section | What is this topic primarily about? | Forum / pack presentation |
| Forum tag | Which identities, routes, situations or topics help discover this content? | Forum presentation / content |
| Forum thread / reply | What did a traveler report, argue, ask or correct? | Forum data |
| Module release topic | Which reusable assistance package is being discussed and versioned? | Forum data + module attachment |
| Module attachment | What exact assistance configuration / defaults are offered? | Core contract + pack data |
| World pack | How is the system named, contextualized and illustrated in this setting? | Pack |
| Identity profile | What may this host observe, access, request, command, allocate and risk? | Core contract + pack data |
| Identity Playbook | How are stable capabilities translated to this identity's scale of agency? | Pack presentation |
| Agenda | Where does the host want to go long-term? | User intent + pack route data |
| Capability module | What reasoning operation is available? | Core contract + pack presentation |
| Expert lens | Which method, questions, strengths and blind spots influence analysis? | Pack data |
| Traveler Forum curated note | Which reviewed field experience is eligible for runtime retrieval? | Core contract + pack content |
| Runtime rules | When are systems active, what do they consume and what do they return? | Core |
| Session patch | What has this particular RP established? | User / session |
| Canonical config | What exact portable assistance system did the user assemble? | Core |
| Export | How is the same configuration represented for a target context? | Prompt Engine / adapter |

## 7. Forum information architecture

V0 primary navigation:

```text
首页 / 最新 / 精华 / 模块仓 / 老乡遗言库 / 维护组
```

Ancient China primary nodes may include:

```text
天道公告
皇帝专区
官场与地方
军旅与边关
商贾与行旅
士林与文艺
普通人生
低权限求生
宫廷与家宅
世界包 / 模块开发
```

Each topic has one primary node. Cross-cutting discovery uses tags.

A node is a content classification, not a permission grant.

See `docs/FORUM_FIRST_INFORMATION_ARCHITECTURE_V0.md` for the detailed prototype model.

## 8. Module release contract

A module release remains a forum post and therefore may contain:

- title;
- author message;
- primary node;
- tags;
- replies / corrections;
- version / maintenance state;
- provenance / reliability information where relevant.

It additionally carries a structured module attachment that may contain:

- target world pack;
- suggested starting identities;
- route assumptions / adaptation hints;
- capability defaults;
- expert-lens defaults;
- Traveler Forum policy;
- safety / permission notes;
- canonical config or derivable normalized config;
- version metadata.

The attachment may open RP Module Forge for detailed adaptation.

## 9. V0.1 outputs

All machine / prompt outputs must derive from the same normalized configuration:

- **One-line invocation** for sessions that already contain the full rules.
- **Compact injection prompt** for constrained context windows.
- **Full setting + injection prompt** for first setup or maximum clarity.
- **Machine-readable manifest** for import, export, diffing, migration and integrations.

An output formatter may omit detail for size, but it may not change the meaning of permissions, non-omniscience, Agenda intent or host authority.

## 10. Trust and agency contract

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
- turn a future Agenda into current authority;
- make irreversible character choices without an explicit user decision;
- present expert advice as a command from the real historical person;
- treat a Traveler Forum anecdote as universal truth;
- confuse forum-browsing access with in-world access.

## 11. Theme / presentation contract

The forum-first product must support three presentation themes:

- **日间｜纸白档案**;
- **夜间｜夜档**;
- **护眼｜青笺**.

They must use one semantic token system and preserve the same information hierarchy and state meanings.

Theme preference is local presentation state and must not enter the canonical RP manifest.

See `docs/THEME_SYSTEM_V0.md`.

## 12. V0.1 scope

V0.1 includes:

- the public monorepo and shared TypeScript Core skeleton;
- forum-first product / information-architecture specification and concept prototype;
- the existing Web App retained as the current canonical module-workshop implementation while the new shell is validated;
- canonical configuration and output contracts;
- the Ancient China Pack as the first official pack;
- identity / permission, Identity Playbook, Agenda, capability, expert-lens, Traveler Forum and runtime specifications;
- repository-backed founding Traveler Forum seed data;
- one-line, compact, full and manifest export targets;
- a documented first-party SillyTavern integration boundary;
- Simplified Chinese-first presentation policy;
- day / night / eye-care theme contract.

## 13. Non-goals for V0.1

- account system or cloud sync;
- hosted database;
- pretending the founding forum seed is already a large real user community;
- API-key collection, relay or storage;
- model proxy or built-in model service;
- automatic reading of private chats by the Web App;
- autonomous character control;
- automatic truth extraction from an RP transcript;
- support for every world genre;
- claiming historical reconstruction or professional governance advice;
- a reputation / voting economy for contributors before contribution and moderation semantics are established;
- shipping Traditional Chinese / English product copies before Simplified Chinese terminology is stable.

## 14. V0.1 acceptance criteria

V0.1 is product-valid when all of the following are true:

1. The forum-first shell can present dense topics, primary nodes, tags, module-release topics, maintainer notices and the curated-knowledge entry point coherently.
2. A module-release topic can open a module attachment and lead into RP Module Forge without inventing a separate rule system.
3. A user can build and export an Ancient China configuration through the Forge workshop.
4. Emperor, general, local official, merchant / commoner and servant-style starts produce materially different permission boundaries and recommendations.
5. The same identity can pursue materially different Agenda routes without permission escalation.
6. Every enabled Ancient China system maps to a generic Core capability ID.
7. The same config produces semantically consistent one-line, compact, full and manifest exports.
8. Outputs always include non-omniscience, evidence-state and host-final-decision rules.
9. Expert lenses can be enabled or removed without replacing the host persona.
10. Traveler Forum entries carry provenance and reliability state; only eligible curated notes are automatically injected.
11. Forum browsing does not inherit in-world permission restrictions.
12. Day, night and eye-care themes preserve readable contrast and the same semantic state meanings.
13. On-demand capabilities can be expanded and withdrawn without rebuilding the whole configuration.
14. Imported manifests are validated and fail clearly when incompatible.
15. The SillyTavern adapter design consumes shared Core contracts and requires no second model API key.

## 15. Validation scenarios

### Cross-identity crisis

Use one shared political or resource crisis and run it through at least:

- emperor;
- general;
- local official;
- merchant / commoner;
- servant or another low-permission role.

The available evidence, safe questions, executable actions, recommended capabilities and risk warnings must differ. If all receive essentially the same plan with different flavor text, the architecture has failed.

### Same-identity route divergence

Use one identity and compare materially different Agenda routes, for example:

- emperor: governance vs pleasure vs retirement;
- servant: survival vs official ascent vs arts vs throne-seeking.

The long-term questions and expert / capability recommendations should differ while the current permission profile remains unchanged.

### Forum / in-world boundary

A low-permission host should be able to read an emperor-section module post at the forum meta layer while the module adaptation step still refuses to grant emperor-only access or command rights.

## 16. Status language

Documentation, code and releases must use these labels consistently:

- **specified** — described by an accepted contract;
- **implemented** — present in code;
- **validated** — covered by proportionate automated or manual evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.

“Specified” never implies “implemented.” V0.1 is allowed to be incomplete, but it is not allowed to be ambiguous about what currently works.