# RP Module Forge · Concept Prototype V0 Handoff

> Status: concept prototype / historical design artifact  
> Engineering truth source: **current V0.1 specifications in this repository**  
> Do not treat this prototype as production code or as the final visual design.

## 1. Why this file exists

`prototypes/rp-module-forge-concept-v0.html` preserves the earliest interactive concept for RP Module Forge.

It exists so that a new ChatGPT session, Codex session, Claude/Ciel session, contributor, or maintainer can quickly understand the product's original interaction idea without reconstructing it from chat history.

The prototype is intentionally a single-file HTML/CSS/JS document. It can be opened directly in a browser and has no build step.

It is a **design fossil**, not a production implementation.

---

## 2. What the prototype was trying to prove

The prototype tested one central idea:

**RP assistance should be assembled from the host character's world, identity, permissions, capabilities, expert reasoning lenses, and reusable traveler experience — not from one giant omniscient prompt.**

The conceptual flow is:

```text
World Pack
  ↓
Identity / Permission Layer
  ↓
Capability Systems
  ↓
Expert Reasoning Lenses
  ↓
Traveler Forum / Legacy Knowledge
  ↓
Runtime Rules
  ↓
Prompt / Integration Output
```

The Ancient China pack was the first test environment because it makes permission, information asymmetry, bureaucracy, logistics, factional politics, and evidence quality extremely visible.

---

## 3. The eight Ancient China systems shown in the prototype

The prototype contains these eight named systems:

### 【考成台】
Administrative execution and accountability.

Tracks:
- who is responsible,
- who signed,
- who delayed,
- where the responsibility chain breaks,
- whether reported completion matches actual execution.

### 【知行镜】
Claim-action consistency.

Compares:
- public statements,
- observable behavior,
- delays,
- proxies / students / allies,
- contradictions between stated support and real execution.

### 【鱼鳞算盘】
Ledger and evidence cross-checking.

Used for:
- taxation,
- land,
- population,
- grain,
- storage,
- trade,
- logistics,
- detecting inconsistent data.

Important boundary:

It does **not** reveal hidden truth.

It should say:

```text
Current data is insufficient.
These sources conflict.
To verify the hypothesis, obtain A / B / C.
```

### 【朋党谱】
Dynamic political relationship graph.

Relationships may include:
- teacher / student,
- marriage,
- hometown,
- examination cohort,
- commercial interest,
- ideological alliance,
- temporary alliance,
- private grievance.

A “faction” is not assumed to be a permanent entity.

### 【烽燧图】
Military and logistics reasoning.

It emphasizes:
- actually deployable troops,
- food endurance,
- horse availability,
- unpaid salary,
- command delay,
- training quality,
- commander relationships,
- real obedience.

The canonical joke from the concept stage:

> “以后再让我看见‘号称二十万大军’我就杀人。先给我算每天吃多少粮。”

### 【民声池】
Segmented public sentiment.

It explicitly rejects a single global “public support = 72%” number.

Possible groups include:
- capital-city opinion,
- scholars,
- merchants,
- soldiers,
- disaster refugees,
- local gentry,
- clans,
- local communities.

### 【御前反对席】
Ancient China presentation of a broader **Red Team** capability.

Before a major decision, it asks:

**“If I were your opponent, how would I break this order?”**

This is now understood as a likely **cross-world Core capability** that merely receives Ancient China naming and presentation inside the pack.

### 【老乡经验库】
Ancient China presentation of the broader Traveler Forum / Legacy layer.

Possible note classes:
- verified guidance,
- blood-and-tears note,
- grudge note,
- unverified trick,
- maintainer argument.

This eventually evolved into the larger **Traveler Forum / 老乡论坛层** concept.

---

## 4. Identity is not cosmetic

A foundational rule established during prototype design:

**Identity determines access, authority, responsibility, and available action paths.**

The same situation should produce different options for different identities.

For example:

```text
Emperor
→ may order an investigation.

Local official
→ may inspect local records, petition upward, or infer from local data.

Servant
→ may not have lawful access to the records at all.
→ survival, relationship mapping, and indirect information paths come first.
```

This led to one of the maintenance principles later expressed as:

> “不是所有老乡都能调户部的账。”

The prototype includes several role buttons to make this difference visible.

---

## 5. Expert packs are not personalities

The earliest seed idea involved a Zhang Juzheng + Wang Yangming dual-core emperor module.

That idea later evolved.

The current rule is:

**Expert packs are reasoning lenses, not personality replacement, possession, or omniscient historical authority.**

Example:

**Zhang Juzheng lens**
- responsibility,
- finance,
- execution,
- assessment,
- institutional distortion.

**Wang Yangming lens**
- motive,
- claim-action gap,
- timing,
- real executor,
- minimum effective action.

Experts may disagree.

The host character still decides.

---

## 6. The no-omniscience rule

This rule is more important than any individual module.

RP Module Forge must not collapse roleplay by revealing hidden facts merely because a system is enabled.

Bad:

```text
【户部贪官名单已载入】
```

Preferred:

```text
【财政账目交叉验算框架已加载】
【注意：本模块提高的是发现矛盾的能力，不是凭空获得事实】
【当前可用数据不足】
【请给我账本】
```

The system should:

1. identify anomalies,
2. distinguish anomaly from proof,
3. tell the host what evidence is missing,
4. suggest ways to obtain that evidence within identity permissions,
5. simulate possible consequences,
6. leave the decision to the host.

---

## 7. Traveler Forum / 老乡论坛层

The prototype includes small forum-style notes because the project discovered a strong thematic and structural match:

**open-source collaboration itself can become part of the fiction.**

A GitHub contribution can map naturally to an in-world event:

> “有位老乡提交了一条新的血泪批注。”

A real pull request adding a survival note can be represented in the product as a new traveler contribution.

Possible future forum data fields include:

```text
id
worldPack
identityScope
systemScope
noteType
reliability
body
replies
maintainer / contributor
status
```

The forum should eventually have two conceptual layers:

1. **Curated knowledge**
   - stable,
   - reusable,
   - appropriate for prompt/runtime injection.

2. **Original forum posts**
   - personal tone,
   - argument,
   - failure stories,
   - jokes,
   - disagreement.

Ancient China’s forum identity is:

**天道降维互助论坛**

Other world packs may use different fictional skins while sharing the same underlying data structure.

---

## 8. What became official V0.1 product direction

The following concepts from the prototype were promoted into the project's formal direction:

- Web App is the main product surface.
- RP/AIRP use is platform-agnostic.
- Ancient China is the first world pack, not the whole product.
- Identity controls information and authority.
- Capability modules are composable.
- Expert packs are reasoning lenses.
- The system is not omniscient.
- The host makes final major decisions.
- Traveler Forum is a real product/data layer.
- Open-source contribution can participate in project lore.
- SillyTavern is the first-party runtime integration target.
- The same canonical config should eventually support multiple output forms.

Consult current repository specs for exact V0.1 contracts.

---

## 9. What the prototype does NOT define

Do not infer the following from the HTML prototype:

- final frontend framework,
- final component hierarchy,
- final visual design,
- final IDs,
- final schema names,
- final runtime protocol,
- final SillyTavern implementation,
- final prompt contract,
- final storage model,
- final module recommendation algorithm.

The HTML uses lightweight local JavaScript only to demonstrate interaction.

It is intentionally disposable.

---

## 10. How a future session should use this artifact

Recommended instruction to a new session:

> First read `docs/PROTOTYPE_HANDOFF.md`, then open `prototypes/rp-module-forge-concept-v0.html` to understand the original interaction concept. After that, treat the current V0.1 specification documents as engineering truth. Preserve the design principles, not the prototype's temporary implementation details.

The most important principle to preserve is:

> **The system should create better questions, better evidence paths, and better decision structure — not replace the character with an answer machine.**

---

## 11. Maintainer culture

Development logs may intentionally use two layers:

### Lore layer

```text
【第110次维护记录】
不是所有老乡都能调户部的账。
```

### Engineering translation

```text
Migrate birth-version legacy IDs and identity data
to the V0.1 Core Contract.
```

This is not merely decoration.

RP Module Forge deliberately allows the maintenance process, contributor culture, Traveler Forum, and fictional worldbuilding to reinforce each other.

---

## 12. Prototype file

Open:

`prototypes/rp-module-forge-concept-v0.html`

No build step is required.

---

*RP Module Forge · Concept V0 preservation note*
