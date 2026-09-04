# Product Definition V0.1

Status: **normative product baseline**  
Scope: product truth, user promise, boundaries, and V0.1 acceptance criteria  
Last updated: 2026-09-04

## 1. Product statement

**天道降维互助论坛 is the primary product world and interaction shell.**

It is an open-source traveler community for AI roleplay (AIRP) and text roleplay. Users can browse authored traveler threads, replies, corrections, blood-and-tears reports, module releases, maintainer notices and reviewed reusable knowledge.

`RP Module Forge` is a first-party tool inside that forum ecosystem. It is the module workshop used to inspect, adapt, assemble, export and maintain portable assistance systems shared through module-release topics.

The forum, Forge and runtime integrations consume the same shared Core meaning. They do not maintain separate long-term rule systems.

## 2. Product truths

These statements are binding for V0.1:

1. **Forum-first.** 天道降维互助论坛 is the product world; the standalone builder becomes the module workshop rather than the permanent homepage identity.
2. **AIRP/RP generality.** Core is not tied to one story, one character, one model provider or one world.
3. **Realm and World Pack are separate concepts.** A Realm is broad navigation / presentation affinity; a World Pack owns concrete identities, permissions, experts, modules, forum nodes and runtime assumptions.
4. **First open path:** `东方古代 → 架空王朝`.
5. **武侠 / 修仙 are separate future World Packs**, not cosmetic tags on 架空王朝.
6. **Machine IDs remain stable until migrated.** The first pack currently keeps the engineering id `ancient-china`; human presentation uses `架空王朝`.
7. **One shared system.** Forum module attachments, Forge, manifests, Prompt Engine and integrations reuse shared Core contracts.
8. **First-party SillyTavern path.** SillyTavern is the first planned official runtime integration and must reuse shared Core.
9. **No omniscience.** Methods may be preloaded; current-world hidden facts may not be invented.
10. **Identity determines current permission.** Recommendations must respect what the host can plausibly observe, access, request, command, allocate, publish, conceal and survive doing.
11. **Agenda is intent, not authority.** A future route changes attention and recommendations but never prepays a future identity or permission profile.
12. **Experts are lenses.** They provide questions, heuristics, trade-offs and failure modes; they do not overwrite host personality or act as summoned historical authorities.
13. **The host decides.** Advice never silently becomes a character decision.
14. **Traveler Forum is first-class data.** It has provenance, review state, replies, reliability and curated runtime knowledge.
15. **Forum browsing is meta-layer access.** A servant may read emperor topics; reading never grants imperial in-world access.
16. **Module releases are forum topics with structured attachments**, not a disconnected marketplace.
17. **Real community and lore are distinct but bridgeable.** GitHub Discussions is the Phase 1 real-community entrance; imported material requires consent, provenance and review.
18. **Simplified Chinese first.** V0.1 stabilizes zh-CN human presentation before Traditional Chinese and English; machine identifiers stay language-neutral.
19. **Free-first infrastructure.** Do not add paid hosting, custom auth or a dedicated forum database before real usage demonstrates the need.

## 3. World navigation model

The forum navigation model is:

```text
天道总坛
└── 世界域 / Realm
    └── 世界包 / World Pack
        └── 分区 / Node
```

Initial product taxonomy:

```text
东方古代
├── 架空王朝       ← first open pack
├── 武侠江湖       ← planned
├── 修仙宗门       ← planned
└── 志怪异闻       ← planned

西方幻想          ← future Realm
未来科幻          ← future Realm
工业幻想          ← future Realm
原始世界          ← future Realm
```

Unopened spaces must remain visibly unopened rather than being filled with fake forum history.

See `docs/MULTIWORLD_FORUM_ARCHITECTURE_V0.md`.

## 4. User promise

A forum visitor should be able to discover what earlier travelers tried, what failed, what remains disputed, which experiences were reviewed, and which reusable modules may fit the current RP.

When adapting a module, the user should be able to express:

> “我现在是谁、现实能知道和做到什么、想把这个角色的人生带到哪里、希望哪些辅助存在、它们什么时候工作、我愿意花多少上下文？”

The system should return a portable assistance configuration that behaves consistently across supported exports and integrations.

It should improve questions, evidence handling, operational reasoning and consequence simulation without solving the setting by fiat.

## 5. Primary users

- roleplayers who want structured assistance without losing character agency;
- forum readers looking for traveler experience, corrections and reusable modules;
- scenario / world builders who want reusable rules rather than one-off prompts;
- SillyTavern users who want the configured system available during play;
- World Pack authors adding identities, modules, experts and lore without forking Core;
- real community contributors submitting play reports, modules, world proposals or corrections;
- maintainers reviewing community material and preserving both lore history and engineering truth.

## 6. Primary flows

### 6.1 Forum discovery

1. Enter 天道降维互助论坛.
2. Choose Realm and World Pack, or remain in 天道总坛.
3. Browse a Node, latest stream, featured content, module warehouse or curated knowledge.
4. Search current Pack by default; later optionally widen search to Realm / all worlds / 总坛.
5. Open ordinary threads, corrections, maintainer records or module releases.
6. Use current-session context for recommendations without turning forum browsing into an in-world permission wall.

### 6.2 Module adaptation

1. Open a module-release topic.
2. Read author notes, replies, corrections, version history and provenance.
3. Inspect the structured module attachment.
4. Compare its original World Pack / identity / Agenda assumptions with the current session.
5. Install as-is only when compatible, otherwise adapt or take selected capabilities.
6. Open RP Module Forge for detailed assembly.
7. Review permission boundaries, capability modes and expert lenses.
8. Normalize and export.

### 6.3 Real-community contribution

1. Enter **天道外部通信口** → GitHub Discussions.
2. Submit feedback, RP reports, module ideas, world-pack proposals or questions.
3. Keep GitHub attribution separate from optional lore alias.
4. Confirm source / consent / presentation identity before importing into product lore.
5. Review again before any reusable claim enters 老乡经验库.

Nothing from a real Discussion auto-injects into runtime knowledge.

## 7. Canonical product objects

| Object | Answers | Owned by |
| --- | --- | --- |
| Realm | Which broad world family is being browsed? | Forum presentation |
| World Pack | Which concrete setting rules, identities and presentation are active? | Pack + Core contract |
| Forum Node | What is this topic primarily about inside a Pack? | Pack / forum presentation |
| Forum tag | Which cross-cutting identities, routes or situations aid discovery? | Forum content |
| Forum thread / reply | What did a traveler report, argue, ask or correct? | Forum data |
| Module release topic | Which reusable assistance package is discussed and versioned? | Forum data + attachment |
| Module attachment | What exact assistance defaults are offered? | Core + Pack |
| Identity profile | What may the current host observe, access, request, command, allocate and risk? | Core + Pack |
| Identity Playbook | How are stable capabilities translated to this identity's scale? | Pack presentation |
| Agenda | Where does the host want to go long-term? | User intent + Pack route data |
| Capability | What reusable reasoning operation is available? | Core + Pack presentation |
| Expert lens | Which method and blind spots shape analysis? | Pack data |
| Curated note | Which reviewed field experience is eligible for runtime retrieval? | Core + Pack content |
| Runtime rules | When and how do systems activate? | Core |
| Session patch | What has this RP established? | User / session |
| Canonical config | What portable assistance system was assembled? | Core |
| Export | How is that configuration represented for a target context? | Prompt Engine / adapter |

## 8. First World Pack

The first open Pack is **东方古代 → 架空王朝**.

Its current implementation lives under the historical package path `packages/pack-ancient-china/` and machine id `ancient-china`. Product-facing UI must say **架空王朝**. A future ID migration must be explicit and tested rather than mixed into UI renaming.

See `docs/FICTIONAL_DYNASTY_PACK_V0.md`.

## 9. Trust and agency contract

The system distinguishes at least:

- established fact;
- reported claim;
- inference;
- hypothesis;
- unknown.

When evidence is insufficient, the useful output is what is known, what conflicts, what remains unknown, what evidence would discriminate, and which evidence-gathering actions are permitted and safe.

The system must not:

- fabricate hidden facts because a module theme implies them;
- turn inference into world truth;
- grant powers the identity does not hold;
- turn future Agenda into current authority;
- make irreversible character choices without user decision;
- present expert advice as a command from the real historical figure;
- treat forum anecdotes as universal truth;
- confuse forum browsing with in-world access;
- treat real-community contributions as runtime-approved merely because they are public.

## 10. Theme / presentation contract

Forum-first product supports:

- **日间｜纸白档案**;
- **夜间｜夜档**;
- **护眼｜青笺**.

Themes share one semantic token model and never alter canonical RP state.

Realm / Pack accents may decorate surfaces but cannot override accessibility-critical meaning.

## 11. V0.1 scope

V0.1 includes:

- public monorepo and shared TypeScript Core;
- forum-first information architecture and concept prototypes;
- Realm → World Pack navigation model;
- existing Forge retained as current canonical module-workshop implementation while the forum shell is validated;
- `东方古代 → 架空王朝` as the first open Pack;
- identity / permission, Playbook, Agenda, capability, expert, forum and runtime contracts;
- repository-backed forum seed data;
- one-line, compact, full and manifest exports;
- day / night / eye-care themes;
- Simplified Chinese-first presentation;
- GitHub Discussions as the Phase 1 real-community bridge;
- documented first-party SillyTavern boundary.

## 12. Non-goals for V0.1

- custom account system or password database;
- paid hosted forum infrastructure without demonstrated need;
- pretending seed data is already a large real community;
- automatic ingestion of GitHub Discussions into lore or runtime knowledge;
- API-key collection, relay or model proxy;
- automatic reading of private chats;
- autonomous character control;
- support for every world genre immediately;
- claiming historical reconstruction or professional governance advice;
- shipping zh-Hant / English presentation before zh-CN terminology stabilizes.

## 13. Acceptance criteria

V0.1 is product-valid when:

1. forum shell presents dense topics, Realm / Pack navigation, Nodes, tags, module releases, maintainer notices and curated knowledge coherently;
2. `东方古代 → 架空王朝` is clearly a Pack path, not the whole forum taxonomy;
3. 武侠 / 修仙 appear as separate future Packs rather than sharing dynasty permissions by default;
4. a module-release topic can open an attachment and lead into Forge without inventing a second rule system;
5. emperor, general, local official, merchant / commoner and servant starts produce materially different permission boundaries and recommendations;
6. the same identity may pursue different Agenda routes without permission escalation;
7. stable Core capabilities remain language / world neutral;
8. one-line, compact, full and manifest exports preserve the same permissions and invariants;
9. forum browsing never inherits in-world permission restrictions;
10. only eligible curated notes may auto-inject;
11. day / night / eye-care themes preserve semantics and readable contrast;
12. GitHub Discussions is reachable as a clearly real-community surface;
13. community material requires consent / provenance / review before repository or runtime use;
14. imported manifests fail clearly when incompatible;
15. SillyTavern integration consumes shared Core and requires no second model API key.

## 14. Validation fixtures

### Cross-identity crisis

Run one shared crisis through emperor, general, local official, merchant/commoner and servant. Evidence, safe questions, executable actions, recommended capabilities and risks must differ.

### Same-identity route divergence

Compare one identity across materially different Agenda routes. Recommendations change; current permission does not.

### Cross-pack boundary

A user browsing a future 武侠 or 修仙 Pack while the active RP is 架空王朝 must not silently migrate identity, permissions or installed modules.

### Forum / in-world boundary

A low-permission host may read emperor topics while adaptation still refuses emperor-only actions.

### Real-community boundary

A GitHub Discussion may be visible and valuable without becoming a curated runtime note.

## 15. Status language

Use consistently:

- **specified** — accepted contract;
- **implemented** — present in code;
- **validated** — covered by proportionate evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.

Specified never implies implemented.
