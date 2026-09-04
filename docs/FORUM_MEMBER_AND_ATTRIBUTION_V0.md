# Forum Member & Attribution V0 · 老乡不等于“遗言作者”

Status: **product / community / lore identity proposal**  
Last updated: 2026-09-04

## 1. Vocabulary correction

The curated runtime-facing knowledge layer is presented consistently as **【老乡经验库】**. The label does not imply that a contributor has died.

Reason: leaving useful experience does not imply the contributor is dead. A forum member may be:

- currently living through a transmigration identity;
- finished with one identity but still existing elsewhere;
- missing or status unknown;
- returned from a world;
- a traveler-in-training who has not crossed yet;
- a professional traveler;
- an employee of a fictional temporal / interworld administration;
- a real community contributor whose material was reviewed into the archive.

The stable Core capability id remains `curated-practitioner-knowledge`; this is a presentation correction, not a machine-ID migration.

## 2. Member kind is not provenance

Forum-facing member identity and engineering provenance are separate dimensions.

Example:

```text
forum member kind: 时空总局·档案员
forum display name: 时空总局·档案员 #4831
provenance: community-contribution
real source: @some-github-user / Discussion #42
```

A lore role never hides or replaces source provenance.

## 3. Proposed forum member kinds

The forum may present, among others:

- `traveler` — ordinary traveler / 穿越者;
- `traveler-reserve` — 穿越者预备役;
- `active-traveler` — 在途穿越者;
- `professional-traveler` — 职业穿越者;
- `temporal-bureau-field` — 时空总局·外勤;
- `temporal-bureau-archive` — 时空总局·档案;
- `temporal-bureau-logistics` — 时空总局·后勤;
- `module-maintainer` — 模块维修工 / 维护组;
- `community-member` — 真人社区成员 when no lore role is chosen.

These are forum/lore presentation classes, not permissions inside an RP world.

## 4. Presence / worldline status

Do not collapse every historical author into `alive` / `dead`.

Suggested lore states:

- `active` — 当前仍活跃;
- `in-transit` — 在途 / 任务中;
- `identity-ended` — 该次穿越身份已终止; this does **not** assert the traveler themself ceased to exist;
- `returned` — 已返回 / 已结束任务;
- `missing` — 失联;
- `unknown` — 状态未知;
- `archive-only` — 仅有档案记录, no claim about current status.

For the example `大虞·永宁帝`, a valid note is:

> 永宁帝身份于永宁三年殉国；该穿越者后续状态未知。

It is not valid to infer “the traveler is dead” unless the lore explicitly establishes that stronger claim.

## 5. Real community attribution

Every imported real contribution preserves:

```text
real attribution
- GitHub handle
- source Discussion URL / number

forum attribution
- preset lore signature OR reviewed custom signature
- consent choice
```

The product may show only the forum signature in immersive reading mode while preserving the real source link in provenance details.

## 6. Preset signatures

Initial preset bases:

- 匿名老乡;
- 穿越者预备役;
- 在途穿越者;
- 职业穿越者;
- 时空总局·外勤员;
- 时空总局·档案员;
- 时空总局·后勤员;
- 模块维修工.

A UI may propose a numeric suffix, for example:

```text
穿越者预备役 · #4831
```

The browser-generated number is only a **candidate**. Before repository import, maintainers check uniqueness / continuity and may canonicalize it.

If a contributor wants one stable lore identity across multiple posts, a reviewed contributor registry may later map their GitHub identity to one approved forum member id and display signature.

## 7. Custom signatures

Custom signatures are allowed.

Import path:

```text
user enters custom forum signature
→ Discussion keeps real GitHub source
→ maintainer checks attribution / impersonation / privacy / obvious abuse
→ approve, request change, or fall back to preset/anonymous
→ imported repository forum data stores approved display identity + source provenance
```

Approval is about presentation and provenance safety, not judging whether a contributor is “good enough” to participate.

## 8. Consent choices

A Discussion submission should eventually be able to express:

- keep my GitHub handle visible in product;
- use an approved lore alias, keep GitHub only in provenance details;
- show an anonymous/preset traveler identity, keep source privately/publicly traceable through the original Discussion as appropriate;
- do not import this post into repository lore / runtime data.

No real contribution enters the product archive merely because it was posted publicly.

## 9. Reliability remains separate

Member kind, presence status, emotional tone, popularity, and tragic fate do not determine reliability.

A professional traveler may be wrong. A pre-traveler may notice a contradiction. A missing traveler may have left an excellent method. A highly reacted-to Discussion is not automatically runtime-safe.
