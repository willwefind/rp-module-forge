# Runtime System Specification V0.1

Status: **normative behavior specification**  
Last updated: 2026-09-03

## 1. Purpose

This specification defines how an assembled RP Module Forge system behaves after export or integration into an RP session.

The runtime is a decision-support protocol. It is not an autonomous narrator, a hidden-world database, or a replacement for the host character.

## 2. Runtime surfaces

### 2.1 Prompt runtime

In V0.1, a user exports rules from the Web App and places them into the external model or RP client of their choice. That external model applies the rules.

### 2.2 Integrated runtime

The planned SillyTavern adapter will manage the same configuration during play: showing active systems, applying token policy, expanding on-demand capabilities, and injecting rules through approved platform mechanisms.

The adapter should use the model already configured in the active SillyTavern session. It must not require a second model API key.

## 3. Invariants

Every runtime and every export format must preserve:

1. `omniscience = false`;
2. identity permission checks before proposed information gathering or action;
3. explicit separation of facts, claims, inferences, hypotheses, and unknowns;
4. experts as optional cognitive lenses rather than personas;
5. Traveler Forum knowledge as contextual advice rather than current-world truth;
6. the host's final authority over decisions;
7. session patches cannot weaken these invariants.

These are system rules, not user-toggleable style preferences.

## 4. Evidence states

| State | Definition | Runtime language |
| --- | --- | --- |
| Fact | Established by accepted RP context or explicit user input | “已知 / established” |
| Claim | Reported by a source but not independently verified | “据称 / reported” |
| Inference | Reasoned from evidence with a visible chain | “推断 / inferred” |
| Hypothesis | One plausible explanation among others | “假设 / possible” |
| Unknown | Missing or too weak to classify | “未知 / insufficient evidence” |

An inference never upgrades itself to fact. Only new accepted context can change evidence state.

## 5. Activation modes

Each capability is configured as:

- **resident** — its compact trigger and output contract remain present;
- **on-demand** — its full rule block appears only for a matching event or explicit user request;
- **disabled** — it must not shape output or consume prompt budget.

The runtime should report temporary activation and withdrawal:

```text
【御前反对席已临时展开】
触发：宿主正在评估一项高影响、难以撤回的政策。
```

```text
【御前反对席已收回】
保留：结论、残余风险与待验证预警信号。
```

Withdrawal removes expanded instructions, not established session facts or host-approved conclusions.

## 6. Token modes

| Mode | Behavior | Intended use |
| --- | --- | --- |
| Light | invariants, identity summary, terse module triggers and outputs | tight context or long-running chat |
| Standard | full permission summary, active contracts, evidence labels, concise forum retrieval | default |
| Full | lore, complete contracts, expert comparison, forum context, detailed UI protocol | initial setup, audits, complex scenes |

Token mode changes detail, never safety semantics. `Light` may say less; it may not become omniscient or omit host authority.

## 7. Event pipeline

For each relevant user request or RP event:

1. **Read bounded context.** Use only the context supplied to the runtime.
2. **Classify evidence.** Separate facts, claims, inferences, hypotheses, and unknowns.
3. **Identify the host.** Load current identity and scenario overrides.
4. **Apply the permission gate.** Determine what the host may observe, request, command, allocate, publish, or conceal.
5. **Match capabilities.** Activate resident capabilities and eligible on-demand ones.
6. **Check required inputs.** If absent, return missing-information guidance rather than fabricate.
7. **Apply expert lenses.** Ask lens-specific questions; preserve disagreement.
8. **Retrieve forum knowledge.** Use applicability, reliability, review, and token filters.
9. **Analyze.** Produce bounded findings and alternatives.
10. **Red-team when triggered.** Attack high-impact or brittle plans without taking control.
11. **Offer permitted options.** Separate advice from executable host choices.
12. **Return control.** Ask for or await the host's decision.
13. **Ingest feedback.** Treat only accepted new RP outcomes as updates to world state.

## 8. Permission gate

Before suggesting an action, runtime checks:

- Does the host have access to the required place, person, record, or resource?
- Can the host request this without pretending to command it?
- Can the host issue the order directly?
- Can the host bear the social, legal, political, or physical risk?
- Is a lower-risk evidence-gathering step available?
- Would the action expose knowledge the host should not possess?

If an action is outside permission, output one of:

- a permitted alternative;
- a dependency on another actor;
- a risk warning and explicit user decision point;
- “no safe permitted action is currently supported.”

## 9. Capability triggers and minimum outputs

### 9.1 `accountability-execution` / 【考成台】

**Trigger:** a plan, order, policy, task, delay, blame dispute, or execution failure.

**Requires:** declared task or outcome plus at least one actor or office.

**Output:**

- objective;
- responsibility chain;
- promises and observable actions;
- execution breaks;
- missing evidence;
- permitted next check;
- confidence.

### 9.2 `claim-action-consistency` / 【知行镜】

**Trigger:** conflict between speech, behavior, incentives, or timing.

**Output:**

- stated position;
- observed behavior;
- mismatch;
- at least one benign and one adversarial explanation when plausible;
- discriminating evidence;
- confidence.

It must not label motive as fact.

### 9.3 `ledger-evidence-crosscheck` / 【鱼鳞算盘】

**Trigger:** accounts, counts, budgets, land, population, stocks, flows, prices, or suspiciously smooth figures.

**Output:**

- source list and periods;
- comparable fields;
- consistency or mismatch;
- benign explanations;
- manipulation hypotheses;
- cross-checks still needed;
- permission-aware acquisition path.

Anomaly never equals guilt.

### 9.4 `multiplex-relationship-graph` / 【朋党谱】

**Trigger:** coalitions, influence, appointment, obstruction, loyalty, betrayal, or issue-dependent alignment.

**Output:**

- relevant actors;
- typed relationships;
- evidence state per edge;
- current issue alignment;
- alternative interpretations;
- high-value unknown links.

No universal faction or loyalty score is allowed.

### 9.5 `readiness-logistics` / 【烽燧图】

**Trigger:** mobilization, conflict, travel, project execution, supply, capacity, or readiness.

**Output:**

- nominal resources;
- available resources;
- effective resources;
- consumption and replenishment;
- time and route constraints;
- bottleneck;
- assumptions and confidence.

Missing numbers remain missing; ranges require stated assumptions.

### 9.6 `plural-stakeholder-signals` / 【民声池】

**Trigger:** public reaction, legitimacy, morale, demand, resistance, rumor, or stakeholder response.

**Output:**

- stakeholder segments;
- signals and channels;
- sampling/filter bias;
- change over time where supported;
- internal disagreement;
- missing or silent groups.

No single total-sentiment score is allowed.

### 9.7 `red-team` / 【御前反对席】

**Trigger:** explicit request; high-impact decision; irreversible action; single-point plan; strong consensus with weak evidence; repeated failure.

**Output:**

- attack or failure path;
- prerequisites;
- early warning signals;
- mitigation;
- residual risk;
- what would falsify the attack hypothesis.

Red-team output tests a plan; it does not establish that an adversary will choose that path.

### 9.8 `curated-practitioner-knowledge` / 【老乡经验库】

**Trigger:** an eligible note matches world, identity, capability, situation, and configured reliability.

**Output:**

- bounded lesson;
- why it matched;
- applicability and exclusions;
- reliability;
- source thread reference when enabled.

It must not inject raw pending posts as advice.

## 10. Expert-lens runtime behavior

Experts modify questions and evaluation, not the host voice.

Allowed:

```text
【张居正镜头】谁负责，资源从何而来，如何验收，执行层会在哪里扭曲？
【王阳明镜头】谁真正会行动，谁只在表态，最小有效行动是什么？
```

Forbidden:

```text
“你现在就是张居正。”
“张居正接管角色并替宿主作出决定。”
```

When lenses disagree, runtime renders separate findings before synthesis. Synthesis identifies the trade-off; it does not erase dissent.

## 11. Standard response envelope

Runtime-capable outputs should be able to render the following structure, with sections omitted only when irrelevant:

```text
【本轮触发】
系统、触发原因、当前身份、Token 模式

【证据面】
已知事实：
据称信息：
推断 / 假设：
仍然未知：

【系统分析】
发现、矛盾、备选解释、置信度

【权限检查】
可直接执行：
可请求但不可命令：
高风险或不可达：

【可选行动】
选项、预期收益、成本、风险、所需证据

【反对席 / 老乡批注】
仅在触发且符合策略时出现

【宿主裁决】
等待宿主选择；不自动行动
```

The envelope is a semantic contract, not mandatory visual styling.

## 12. Session patch

A session patch may provide:

- accepted setting facts;
- named actors and known relationships;
- current resources;
- scenario-specific permission overrides;
- user preferences for display and token budget.

It may not:

- set `omniscience` to true;
- disable host-final-decision;
- redefine an inference as a fact without source context;
- grant platform access the integration does not have;
- convert an expert lens into persona control.

Conflicting patch data should be surfaced, not silently merged.

## 13. SillyTavern first-party behavior target

The adapter should eventually support:

- importing a Forge manifest;
- displaying active resident/on-demand systems;
- selecting Light, Standard, or Full mode;
- temporarily expanding a capability;
- injecting the normalized prompt through a documented target;
- showing why a module or forum note was activated;
- removing temporary instructions after the event;
- never storing or requesting a second API key;
- respecting explicit user control over which chat context is processed.

V0.1 documentation does not claim these behaviors are already implemented.

## 14. Failure and uncertainty messages

Preferred failure shape:

```text
【无法完成判断】
缺少：近三期实收、仓储出入、运输损耗。
当前仅能确认：奏报数字彼此不一致。
不能确认：贪墨、责任人或真实库存。
在当前身份权限内，可先取得：公开交接簿与本地价格变化。
```

The runtime should be useful at the boundary of knowledge, not merely refuse or hallucinate.

## 15. Runtime acceptance tests

- the same event under four identities yields different permitted actions;
- absent evidence produces unknowns and acquisition steps, not invented facts;
- every inference has visible support and confidence;
- on-demand activation and withdrawal are explicit;
- token modes preserve all invariants;
- experts never change the host persona;
- forum notes honor review and applicability filters;
- red-team analysis cannot make an irreversible choice;
- new world state is accepted only from explicit RP feedback or user input;
- the SillyTavern adapter can operate without a second API credential.
