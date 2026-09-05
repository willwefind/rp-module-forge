import type { TravelerForumCuratedNote } from "@rpmf/core";

/**
 * Reviewed runtime knowledge. Only entries here can be auto-retrieved by the
 * Runtime; forum topics of type knowledge-card are display-layer summaries.
 * Every sourceThreads id must exist in the archive (validated by tests).
 */
export const curatedNotes: TravelerForumCuratedNote[] = [
  {
    id: "ck-ancient-china-local-treasury-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "ledger-evidence-crosscheck",
    lesson: "在把库空归因于贪墨之前，区分账面余额、实物库存、已 earmark 的不可支用资源、欠收与不可达储备，并记录各自来源和时间点。",
    appliesTo: { identities: ["local-official", "emperor", "regent-powerful-minister"], situations: ["empty-treasury", "suspect-ledgers"] },
    exclusions: ["immediate-physical-threat"],
    reliability: "corroborated",
    failureModes: ["多份记录可能协同造假", "实地盘点可能超出当前身份权限"],
    sourceThreads: ["tf-ancient-china-000001"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-nominal-force-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "readiness-logistics",
    lesson: "军力数字至少拆成名义、可到达、可持续、有效和实际服从指挥的规模；补给消耗与时间约束必须单列。",
    appliesTo: { identities: ["general", "emperor", "regent-powerful-minister"], situations: ["military-mobilization", "campaign-planning"] },
    exclusions: [],
    reliability: "corroborated",
    failureModes: ["数字来源可能口径不一", "可用兵力会随时间快速变化"],
    sourceThreads: ["tf-ancient-china-000003", "tf-ancient-china-000004"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-dangerous-knowledge-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "multiplex-relationship-graph",
    lesson: "低权限角色在处理敏感信息前，先列出因信息受损的人、已知自己知情的人、潜在保护者和暴露渠道，再选择权限内的低风险下一步。",
    appliesTo: { identities: ["servant", "commoner", "scholar", "merchant"], situations: ["dangerous-knowledge", "investigation-risk", "whistleblowing"] },
    exclusions: ["immediate-escape-required"],
    reliability: "corroborated",
    failureModes: ["风险主体可能判断错误", "过度谨慎可能错过窗口"],
    sourceThreads: ["tf-ancient-china-000005", "tf-ancient-china-000018"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-segmented-signals-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "plural-stakeholder-signals",
    lesson: "公共反应按群体、地点、渠道和时间拆分；沉默既不能自动算支持，也不能自动算恐惧。",
    appliesTo: { identities: ["emperor", "local-official", "scholar", "merchant", "heir"], situations: ["public-reaction", "policy-resistance", "elite-opinion"] },
    exclusions: [],
    reliability: "corroborated",
    failureModes: ["可观察群体可能严重偏样", "渠道之间可能互相复制谣言"],
    sourceThreads: ["tf-ancient-china-000002", "tf-ancient-china-000014"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-execution-chain-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "accountability-execution",
    lesson: "命令下达不等于目标实现。记录责任人、转交节点、资源来源、验收条件和外部可观察结果，避免把行文或登记当成完成。",
    appliesTo: { identities: ["emperor", "regent-powerful-minister", "local-official", "general"], situations: ["policy-execution", "implementation-gap", "paper-compliance"] },
    exclusions: [],
    reliability: "corroborated",
    failureModes: ["验收指标本身可能被游戏化", "责任链可能绕开非正式执行者"],
    sourceThreads: ["tf-ancient-china-000009", "tf-ancient-china-000011"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-behavior-change-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "claim-action-consistency",
    lesson: "把行为变化当作需要解释的信号，而不是动机结论；至少保留一个 benign 与一个 adversarial 解释，并寻找能区分它们的证据。",
    appliesTo: { identities: ["servant", "commoner", "heir", "scholar", "regent-powerful-minister"], situations: ["behavior-change", "access-restriction", "competing-advisers"] },
    exclusions: [],
    reliability: "corroborated",
    failureModes: ["可选解释可能不完整", "证据路径可能受身份权限限制"],
    sourceThreads: ["tf-ancient-china-000007", "tf-ancient-china-000010"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-trade-total-cost-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "ledger-evidence-crosscheck",
    lesson: "比较商路和货源时，把进价之外的损耗、路税、押运、等待、坏账、季节和政治风险列入总成本。",
    appliesTo: { identities: ["merchant"], situations: ["trade-route", "price-comparison"] },
    exclusions: [],
    reliability: "corroborated",
    failureModes: ["非货币风险难精确折价", "历史成本可能不代表下一程"],
    sourceThreads: ["tf-ancient-china-000012"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-household-liquidity-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "curated-practitioner-knowledge",
    lesson: "家庭危机先做短期生存盘点：食物、现金、药物、出行能力、债务与可求助关系；不要把所有可交换资源机械转换成单一物资。",
    appliesTo: { identities: ["commoner", "servant", "merchant"], situations: ["famine", "household-crisis"] },
    exclusions: ["market-fully-collapsed"],
    reliability: "plausible",
    failureModes: ["市场中断会改变现金价值", "家庭成员风险差异可能很大"],
    sourceThreads: ["tf-ancient-china-000015"],
    reviewStatus: "approved-for-runtime",
    version: 1
  },
  {
    id: "ck-ancient-china-heir-build-own-channel-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "multiplex-relationship-graph",
    lesson: "储君面对竞争顾问时，可优先建立一条不完全依赖单一派系的独立信息渠道，以降低被单一关系网过滤的风险。",
    appliesTo: { identities: ["heir"], situations: ["succession-politics", "competing-advisers"] },
    exclusions: ["explicit-ban-on-private-retinue"],
    reliability: "contested",
    failureModes: ["建立独立渠道本身可能被视为结党", "新渠道也可能迅速被渗透"],
    sourceThreads: ["tf-ancient-china-000010"],
    reviewStatus: "approved-for-runtime",
    version: 1,
    conflictsWith: ["ck-ancient-china-heir-use-existing-channel-001"]
  },
  {
    id: "ck-ancient-china-heir-use-existing-channel-001",
    schemaVersion: 1,
    worldPack: "ancient-china",
    capability: "multiplex-relationship-graph",
    lesson: "储君权力脆弱时，优先利用已有合法师傅与属官渠道可能比另建信息网更安全；先比较政治暴露成本。",
    appliesTo: { identities: ["heir"], situations: ["succession-politics", "competing-advisers"] },
    exclusions: ["existing-channel-captured"],
    reliability: "contested",
    failureModes: ["合法渠道可能已被某方控制", "过度依赖会加深信息过滤"],
    sourceThreads: ["tf-ancient-china-000010"],
    reviewStatus: "approved-for-runtime",
    version: 1,
    conflictsWith: ["ck-ancient-china-heir-build-own-channel-001"]
  }
];
