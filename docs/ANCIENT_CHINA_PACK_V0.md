# Ancient China Pack V0.1

Status: **first-party world-pack specification**  
Pack ID: `ancient-china`  
Last updated: 2026-09-03

## 1. Pack promise

Ancient China is the first official content pack for RP Module Forge. It provides an in-world vocabulary, identity model, expert lenses, traveler knowledge, and examples for high-power governance, military command, local administration, commerce, ordinary life, and low-permission survival.

It is not a universal historical simulator and does not claim that one model fits every dynasty, region, institution, gender system, or social group. A scenario-specific session patch must state important deviations.

## 2. Fiction

Across many successful and failed transmigration runs, travelers have maintained a mutual-aid network: **天道降维互助论坛**. Its members refine assistance methods, argue over bad assumptions, attach bitter field notes, and occasionally rescue a later traveler from repeating the same disaster.

The pack presents generic assistance capabilities as systems maintained by this community. Its historical expert packs abstract methods from figures such as Zhang Juzheng or Wang Yangming; the figures are not summoned, simulated as authorities, or used to overwrite the host.

## 3. Pack layers

```text
Identity Layer
   Who is the host, and what can they know or do?

Capability Layer
   Which generic reasoning operations are available?

Expert Layer
   Which cognitive lenses shape the questions and trade-offs?

Traveler Forum Layer
   Which field experiences, disputes, and curated notes are relevant?

Runtime UI Layer
   How do these systems appear and activate inside the RP?
```

## 4. Identity layer

Identity changes permissions, information quality, risk, and useful recommendations. It must never be reduced to a title shown beside an otherwise identical plan.

| Identity | Typical reach | Central limitation | Common risks | Likely recommendations |
| --- | --- | --- | --- | --- |
| Emperor | Can order central organs and allocate major resources | Information is filtered; commands may be distorted in execution | coup, fiscal collapse, bureaucratic resistance, legitimacy shock | 考成台, 鱼鳞算盘, 朋党谱, 民声池, 御前反对席 |
| Heir | Access to court education and networks; limited formal command | Authority is conditional and politically sensitive | suspicion, factional capture, premature exposure | 知行镜, 朋党谱, 民声池, 老乡遗言库 |
| Regent / Powerful Minister | High administrative reach; variable legitimacy | Power depends on coalition and office boundaries | purge, backlash, implementation sabotage | 考成台, 知行镜, 朋党谱, 御前反对席 |
| General | Strong military command; limited court and fiscal control | Supply and political authorization may sit elsewhere | starvation, mutiny, false reporting, court suspicion | 烽燧图, 考成台, 知行镜, 御前反对席 |
| Local Official | Local administrative tools and records | Capacity, information, and patronage are bounded | local elite resistance, false accounts, scapegoating | 考成台, 鱼鳞算盘, 民声池, 朋党谱 |
| Scholar | Literacy, discourse, and some elite access | Usually lacks command and budget authority | censorship, patron dependence, social retaliation | 知行镜, 民声池, 朋党谱, 老乡遗言库 |
| Merchant | Commercial information and resource networks | Official coercive power is low and legal security varies | confiscation, default, transport loss, political exposure | 鱼鳞算盘, 朋党谱, 民声池, 老乡遗言库 |
| Commoner | Household, neighborhood, occupational, and local knowledge | Formal access and protection are limited | hunger, conscription, violence, debt | 民声池, 老乡遗言库; other capabilities only at local scale |
| Servant / Bonded Attendant | Close observation of a household or institution | Formal authority is extremely low; questions can be dangerous | punishment, exposure, loss of shelter, retaliation | 知行镜, 朋党谱, 老乡遗言库; stealth and survival framing |

These are defaults, not immutable history. A pack identity profile should support scenario overrides without granting implausible authority by accident.

### 4.1 Permission-first example

The question “grain figures do not add up” must produce different next steps:

- an emperor may order cross-office reconciliation, but must consider coordinated falsification;
- a local official may inspect bounded local records and supply chains;
- a merchant may compare prices, receipts, route losses, and counterparties;
- a servant may only notice behavioral or storage anomalies and may be unable to ask directly without danger.

The module is the same; permissible evidence-gathering is not.

## 5. The eight core systems

All eight systems are official Ancient China presentations of generic capability contracts.

### 5.1 【考成台】

- **Core ID:** `accountability-execution`
- **Generic capability:** Accountability & Execution Engine
- **Purpose:** decompose a policy or order into owner, duty, commitment, deadline, evidence, hand-off, delay, and responsibility break.
- **Does not:** assign hidden guilt or invent an official's actions.
- **Typical output:** responsibility chain, observed status, obstruction hypotheses, missing proof, permitted intervention.
- **Pack flavor:** administrative registers, memorials, seals, office boundaries, and the accumulated suspicion of maintainers who have watched too many orders vanish between capital and county.

### 5.2 【知行镜】

- **Core ID:** `claim-action-consistency`
- **Generic capability:** Claim–Action Consistency Analyzer
- **Purpose:** compare stated support, observable behavior, incentives, timing, and downstream effects.
- **Does not:** read minds or equate inconsistency with treason.
- **Typical output:** public claim, observed actions, inconsistency, alternative explanations, confidence, next discriminating evidence.
- **Pack flavor:** “what was said” versus “what was actually done,” without pretending motive is already proven.

### 5.3 【鱼鳞算盘】

- **Core ID:** `ledger-evidence-crosscheck`
- **Generic capability:** Ledger & Evidence Cross-check
- **Purpose:** compare quantitative or categorical records across independent sources and time periods.
- **Does not:** see through accounts at a glance or convert anomaly into proof of corruption.
- **Typical output:** consistency score or qualitative status, anomalies, benign explanations, manipulation hypotheses, missing cross-checks.
- **Candidate sources:** land, population, tax grain, storage, transport, prices, deeds, salt, labor, military supply.

### 5.4 【朋党谱】

- **Core ID:** `multiplex-relationship-graph`
- **Generic capability:** Multiplex Relationship Graph
- **Purpose:** represent simultaneous ties and issue-dependent coalitions.
- **Does not:** compress a person into a single faction, loyalty number, or permanent alliance.
- **Edge types:** teacher/student, marriage, native-place, examination cohort, material interest, ideological affinity, temporary alliance, personal grievance, patronage, command.
- **Typical output:** nodes, typed edges, evidence state, issue-specific alignment, possible bridge actors, unknown links.

### 5.5 【烽燧图】

- **Core ID:** `readiness-logistics`
- **Generic capability:** Operational Readiness & Logistics Model
- **Purpose:** distinguish nominal assets from deployable, sustainable, effective capacity.
- **Does not:** know real troop counts, enemy plans, or route conditions without evidence.
- **Typical dimensions:** nominal strength, available strength, effective strength, food days, fodder, pay arrears, transport losses, route length, weather, mobilization time, command reliability.
- **Pack rule:** “claimed two hundred thousand” is a reported claim until composition and supply are supported.

### 5.6 【民声池】

- **Core ID:** `plural-stakeholder-signals`
- **Generic capability:** Plural Stakeholder Signal Pool
- **Purpose:** preserve conflicting signals across groups, locations, channels, and time.
- **Does not:** create a universal public-opinion score or assume a visible speaker represents a whole group.
- **Typical output:** stakeholder segment, observed signal, source/channel, sample bias, direction, intensity, confidence, missing voices.
- **Pack rule:** internal variation must remain visible; silence may mean absence, fear, filtering, or lack of access.

### 5.7 【御前反对席】

- **Core ID:** `red-team`
- **Generic capability:** Red Team Engine
- **Purpose:** attack a plan from adversarial, bureaucratic, logistical, incentive, and unintended-consequence perspectives.
- **Does not:** take control of the decision or invent an opponent's exact private plan.
- **Typical output:** attack path, prerequisite, likelihood/confidence, early warning sign, mitigation, residual risk.
- **Cross-world note:** this is explicitly a generic core capability. A starship, guild, or modern bureaucracy can provide a different skin for the same contract.

### 5.8 【老乡遗言库】

- **Core ID:** `curated-practitioner-knowledge`
- **Generic capability:** Curated Practitioner Knowledge
- **Purpose:** retrieve reviewed, bounded lessons derived from Traveler Forum material.
- **Does not:** treat anecdotes as facts about the current world or inject unreviewed posts automatically.
- **Typical output:** lesson, applicability, reliability, failure modes, source thread, reason retrieved.
- **Subsystem relation:** it is the curated runtime-facing layer of Traveler Forum, not the whole forum.

## 6. Core versus pack ownership

| Concern | Core owns | Ancient China Pack owns |
| --- | --- | --- |
| capability identity | stable ID and contract | Chinese system name, description, examples |
| evidence semantics | fact/claim/inference/hypothesis/unknown | period-appropriate source examples |
| permission enforcement | dimensions and validation | identity defaults and social risks |
| expert behavior | lens boundaries | historical lens content |
| forum lifecycle | schema, review, retrieval | 天道降维互助论坛 boards and entries |
| runtime modes | resident/on-demand/disabled | UI language and themed notices |

## 7. Expert layer

Initial expert lenses:

| Lens | Strengths | Required caution |
| --- | --- | --- |
| Zhang Juzheng | administrative execution, fiscal discipline, responsibility chains | may overweight central capacity or formal control |
| Wang Yangming | motive, action, field judgment, smallest effective step | may overread intention from behavior without enough alternatives |
| Qi Jiguang | training, formations, logistics, discipline, practical readiness | military optimization may ignore court legitimacy or civilian cost |
| Sun Tzu | strategic posture, deception, relative advantage, cost | abstraction may outrun available operational facts |
| Fan Li | commerce, timing, exit, diversification | opportunity framing may underweight non-market constraints |
| Hai Rui | legality, integrity, institutional friction | moral clarity does not guarantee implementability |
| Guan Zhong | state capacity, political economy, resource allocation | macro optimization can conceal distributional harm |

### 7.1 Double-lens example

`zhang-juzheng + wang-yangming` may render:

- **太岳案 / institutional lens:** responsibility, finance, incentives, milestones, controls;
- **Yangming案 / human-action lens:** who will act, who will perform agreement, what sequence changes behavior;
- **joint synthesis:** what should happen institutionally, how people are likely to respond, and the smallest permitted first step.

The synthesis must preserve disagreement and uncertainty. It is not a merged super-personality.

## 8. Traveler Forum layer

The pack's Traveler Forum is named **天道降维互助论坛**.

Initial board candidates:

- 帝王与中枢
- 军政与边镇
- 地方治理
- 商贾经营
- 低权限生存
- 宫廷求生
- 江湖与门派
- 维护组争论区

Content types may include verified practice, blood-and-tears note, grudge note, unverified trick, correction, and maintainer argument. Reliability and review state remain explicit.

Example display:

> 【关联论坛旧帖：#18472】  
> “有没有人救救我，我是县令，刚到任第三天县库空的。”  
> 可靠度：争议中 · 适用身份：地方官 · 关联系统：鱼鳞算盘 / 朋党谱

## 9. Runtime UI language

Example compact panel:

```text
当前系统
━━━━━━━━━━
● 考成台       常驻
● 知行镜       常驻
○ 鱼鳞算盘     按需
○ 御前反对席   按需

证据状态：不足
Token 模式：标准
宿主裁决：开启（不可关闭）
```

The UI may be theatrical; the evidence labels may not be.

## 10. Pack hard rules

1. No system contains a hidden database of the current RP world.
2. An anomaly is not proof of corruption, conspiracy, disloyalty, or deceit.
3. Relationships require typed evidence and may change by issue.
4. Public sentiment remains plural and source-dependent.
5. Nominal military numbers are not deployable strength.
6. Expert lenses never become the host persona.
7. Low-permission identities are not offered imperial actions with different wording.
8. Traveler anecdotes do not override current-world evidence.
9. The host makes the final decision.

## 11. Pack acceptance tests

- every Chinese system name resolves to exactly one core capability ID;
- removing pack presentation leaves the generic capability contract intact;
- one crisis generates meaningfully different permitted actions across identities;
- every example labels facts, claims, inferences, and unknowns correctly;
- no expert output contains personality takeover instructions;
- forum retrieval respects role, module, reliability, and applicability filters;
- no `民声池` output collapses all groups into one number;
- no `朋党谱` output reduces relationships to a single faction label;
- no `烽燧图` output treats nominal strength as combat-ready strength;
- no `鱼鳞算盘` output treats an anomaly as guilt.
