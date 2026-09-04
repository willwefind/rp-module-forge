# Character Agenda / Development Route Specification V0.1

Status: **normative product / world-pack assembly specification**  
Last updated: 2026-09-04

## 1. Why this layer exists

Identity is a starting position, not a life sentence.

Two hosts with the same current identity may want completely different stories:

- one emperor wants durable good governance;
- another wants coercive personal rule;
- another mainly wants pleasure without immediate collapse;
- another wants to abdicate and disappear;
- one servant wants only to survive;
- another wants to enter officialdom;
- another wants military advancement;
- another wants court or household power;
- another wants wealth, poetry, painting, or eventually the throne.

Therefore expert recommendations and capability defaults MUST NOT be determined by identity alone.

## 2. The four distinct axes

```text
Identity
  where the host is now; current permissions and risks

Identity Playbook
  how generic Core capabilities are translated to the host's current scale of agency

Agenda / Development Route
  where the host wants to go; long-term priorities and desired trajectory

Current Event / Situation
  what is happening now; may temporarily activate capabilities or expert lenses
```

These axes may influence each other, but they are not interchangeable.

## 3. Hard rule: aspiration is not authority

Selecting a route MUST NOT mutate the current permission profile.

Examples:

- a servant selecting `throne-seeking` remains a servant for permission checks;
- a commoner selecting `military-ascent` does not gain command or military-record access;
- an emperor selecting `retreat-and-seclusion` does not automatically lose current imperial authority or political obligations;
- a scholar selecting `commerce-wealth` does not automatically own capital, warehouses, or a merchant network.

A route may change what the system watches, what intermediate gates it names, which Core capabilities are recommended, and which expert lenses are useful. Actual authority changes only when accepted RP context changes the host's identity or supplies an explicit bounded session authorization.

## 4. Why Agenda is persisted but Playbook is not

V0.1 treats Identity Playbooks as pack-owned presentation / assembly defaults. The same canonical identity and Core capability IDs can deterministically recover the default playbook.

Agenda is user intent. It materially changes long-term assistance and expert recommendations and therefore SHOULD travel with the manifest.

V0.1 stores:

```json
{
  "agenda": {
    "routeId": "arts-and-letters",
    "customGoal": "I want to become a painter and avoid official life."
  }
}
```

`agenda` remains optional for birth-version / early V0.1 compatibility. New first-party Web manifests persist it.

## 5. Route ownership

World packs own route labels, examples, route-specific capability overlays, and route-specific expert recommendations.

Core owns:

- the generic `AgendaSelection` and `AgendaDefinition` contracts;
- deterministic route lookup;
- deterministic combination of identity-playbook defaults with route overlays;
- validation that a persisted route exists in the loaded pack;
- the invariant that route data is not a permission source.

## 6. No hard identity eligibility gate

A route may contain `suggestedStartingIdentities`, but this field is recommendation metadata only.

It MUST NOT be interpreted as an eligibility or permission list.

A servant may choose a throne-seeking route. A ruler may choose an artistic or retirement route. A merchant may choose officialdom. A scholar may choose commerce. The system's job is to make the path legible from the current position, not to forbid an unusual story because it is uncommon.

## 7. Recommendation composition

V0.1 recommendation order:

1. resolve the current identity;
2. resolve its Identity Playbook, if any;
3. take playbook capability / expert defaults (or identity defaults when no playbook exists);
4. overlay the selected Agenda route;
5. preserve current permission profile unchanged;
6. allow the user to manually edit the resulting capability modes and expert weights;
7. at runtime, a current event may later request temporary capability or expert activation without rewriting the long-term Agenda.

### 7.1 Capability overlay

Agenda may change recommended modes or add useful Core capabilities. It does not change the stable capability ID or the identity-scale Playbook facet.

Example:

A servant on `throne-seeking` can still see `readiness-logistics` through the servant-scale presentation 【活路与储备图】. The route can make relationship mapping and red-team analysis more prominent, but it does not suddenly relabel the same host as an emperor.

### 7.2 Expert overlay

Expert lenses are no longer identity attachments.

An Agenda may promote different experts for the same identity. When a route introduces a new primary expert, an unrelated baseline primary is demoted to secondary rather than silently producing several competing primaries.

Manual user selection still wins after recommendation restoration.

## 8. Expert routing examples

Same identity, different routes:

| Current identity | Route | Likely expert emphasis |
| --- | --- | --- |
| Emperor | 明君 / 治世 | 张居正 primary; 海瑞 secondary |
| Emperor | 铁腕 / 暴君叙事 | 孙武 primary; 管仲 secondary |
| Emperor | 享乐 / 富贵闲人 | 苏轼 primary; 范蠡 secondary |
| Emperor | 归隐 / 退场 | 陶渊明 primary; 范蠡 secondary |
| Servant | 入仕上升 | 张居正 primary; 王阳明 secondary |
| Servant | 从军掌兵 | 戚继光 primary; 孙武 secondary |
| Servant | 宫斗 / 宅斗 | 武则天 primary; 王阳明 secondary |
| Servant | 经商致富 | 范蠡 primary; 管仲 secondary |
| Servant | 诗文书画 | 苏轼 primary; 顾恺之 / 李清照 secondary |
| Servant | 夺权称帝 | 孙武 primary; 武则天 secondary |

These are cognitive lenses, not summoned personas and not guarantees of success.

## 9. Ancient China V0.1 seed routes

The first-party pack currently seeds:

- `open-road` — 未定路线 / 先活着看看
- `benevolent-rule` — 明君 / 治世路线
- `iron-rule` — 铁腕统治 / 暴君叙事
- `pleasure-and-stability` — 享乐 / 富贵闲人路线
- `official-ascent` — 科举 / 入仕 / 官场上升
- `military-ascent` — 从军 / 掌兵 / 将领路线
- `throne-seeking` — 夺权 / 称帝路线
- `court-household-struggle` — 宫斗 / 宅斗 / 内廷权力
- `commerce-wealth` — 经商 / 致富 / 产业路线
- `arts-and-letters` — 诗人 / 画家 / 文艺路线
- `retreat-and-seclusion` — 归隐 / 辞官 / 退场路线
- `survive-and-protect` — 求生 / 保家 / 先别死
- `custom` — 自定义路线

These are starting presets, not an exhaustive taxonomy of possible lives.

## 10. Custom goals

A user may refine any route with free text or choose the `custom` route.

Custom goal text is intent, not evidence. It MUST NOT be promoted to a fact about the world or a granted resource.

Examples:

- “I want to earn enough to buy my sister's freedom, not become an official.”
- “I want to paint cats and never sit the examinations.”
- “I want the throne eventually, but I refuse to harm my current household.”

A custom route with no text is allowed but should emit a warning that the long-term intent is intentionally unspecified.

## 11. Current-event expert activation

Agenda controls long-term recommendation emphasis. It MUST NOT permanently monopolize the expert panel.

Future runtime event routing should support temporary expert activation. Examples:

- a benevolent emperor facing a military logistics crisis may temporarily activate Qi Jiguang;
- an artist dealing with a patronage dispute may temporarily activate Fan Li or a relationship lens;
- a merchant caught in court politics may temporarily activate a political-power lens.

Temporary event experts should be visibly temporary and should withdraw when the event no longer needs them.

## 12. Forum relation

V0.1 forum retrieval currently filters by identity, capability, reliability, and situation labels where supplied. Agenda-aware forum applicability is not yet implemented.

Future forum records may include route / goal applicability, but route tags MUST remain advisory context rather than permission.

## 13. Acceptance tests

- the same identity can select multiple routes with different expert recommendations;
- route selection never mutates identity permission profile;
- a low-permission identity may select a high-ambition route without acquiring high-permission actions;
- an emperor can select a low-power / retirement / artistic route without the system forcing governance as the sole objective;
- unknown persisted route IDs fail canonical normalization;
- custom route goal text is trimmed and preserved;
- route overlays preserve stable Core capability IDs;
- a route primary expert deterministically demotes an unrelated baseline primary;
- packs without Agenda data continue to operate with identity / playbook defaults;
- future event-specific expert activation does not rewrite the persisted long-term route.
