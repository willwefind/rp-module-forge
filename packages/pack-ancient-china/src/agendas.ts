import type { AgendaDefinition } from "@rpmf/core";

export const ancientChinaAgendas: AgendaDefinition[] = [
  {
    id: "open-road",
    label: "未定路线 / 先活着看看",
    kind: "open-ended",
    summary: "不预设最终身份或价值方向，保留当前处境方案，只让事件本身推动能力与专家镜头。",
    suggestedStartingIdentities: [],
    capabilityOverlay: [],
    expertOverlay: [],
    focusQuestions: ["你眼下最想保住什么？", "哪件事如果发生，会改变你对未来的想法？"]
  },
  {
    id: "benevolent-rule",
    label: "明君 / 治世路线",
    kind: "governance",
    summary: "把治理质量、执行能力、财政可持续、不同群体代价与长期合法性放在一起，而不是只追求短期服从。",
    suggestedStartingIdentities: ["emperor", "heir", "regent-powerful-minister", "local-official"],
    capabilityOverlay: [
      { id: "accountability-execution", mode: "resident" },
      { id: "plural-stakeholder-signals", mode: "resident" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "zhang-juzheng", weight: "primary" },
      { id: "hai-rui", weight: "secondary" }
    ],
    focusQuestions: ["这项政绩是谁真正承担成本？", "制度离开你的个人意志后还能不能运行？"],
    caution: "“明君”是宿主的目标标签，不代表系统把任何政策自动判定为善政。"
  },
  {
    id: "iron-rule",
    label: "铁腕统治 / 暴君叙事",
    kind: "power",
    summary: "服务于高压控制、集中权力或暴君型叙事目标，但持续暴露恐惧统治、执行反噬、财政代价与联盟脆弱性。",
    suggestedStartingIdentities: ["emperor", "regent-powerful-minister", "general"],
    capabilityOverlay: [
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "accountability-execution", mode: "resident" },
      { id: "red-team", mode: "resident" },
      { id: "claim-action-consistency", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "sun-tzu", weight: "primary" },
      { id: "guan-zhong", weight: "secondary" }
    ],
    focusQuestions: ["服从来自制度、利益、恐惧还是暂时无力反抗？", "哪一条控制链最可能在你看不见的地方变成假服从？"],
    caution: "路线描述宿主的叙事目标，不把残酷或高压手段包装成无代价最优解。"
  },
  {
    id: "pleasure-and-stability",
    label: "享乐 / 富贵闲人路线",
    kind: "leisure",
    summary: "目标不是最大化政绩，而是在不把自身安全、资产、继承与基本秩序炸掉的前提下尽量享受生活。",
    suggestedStartingIdentities: ["emperor", "heir", "regent-powerful-minister", "merchant"],
    capabilityOverlay: [
      { id: "readiness-logistics", mode: "on-demand" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "su-shi", weight: "primary" },
      { id: "fan-li", weight: "secondary" }
    ],
    focusQuestions: ["你真正想享受的是什么，而不是别人替你定义的富贵？", "怎样的享乐成本会反过来毁掉自由和安全？"]
  },
  {
    id: "official-ascent",
    label: "科举 / 入仕 / 官场上升",
    kind: "career",
    summary: "围绕资格、名声、师友、举荐、职位门槛与官场行为积累，目标是进入或上升于文官体系。",
    suggestedStartingIdentities: ["scholar", "commoner", "merchant", "servant"],
    capabilityOverlay: [
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "claim-action-consistency", mode: "resident" },
      { id: "accountability-execution", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "zhang-juzheng", weight: "primary" },
      { id: "wang-yangming", weight: "secondary" }
    ],
    focusQuestions: ["离下一道真实门槛还缺资格、作品、人脉还是钱？", "哪些捷径会制造长期依附或暴露？"],
    caution: "想当官不等于现在拥有官员权限；所有行动仍按当前身份检查。"
  },
  {
    id: "military-ascent",
    label: "从军 / 掌兵 / 将领路线",
    kind: "career",
    summary: "从当前身份出发积累军事技能、可信度、部属关系、补给理解与正式军职机会。",
    suggestedStartingIdentities: ["commoner", "servant", "scholar", "general"],
    capabilityOverlay: [
      { id: "readiness-logistics", mode: "resident" },
      { id: "accountability-execution", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "qi-jiguang", weight: "primary" },
      { id: "sun-tzu", weight: "secondary" }
    ],
    focusQuestions: ["下一步需要的是武艺、军籍、战功、信任还是补给能力？", "你现在能接触的军事信息到底到哪一层？"],
    caution: "远期目标不会提前生成军令权或军情访问权。"
  },
  {
    id: "throne-seeking",
    label: "夺权 / 称帝路线",
    kind: "power",
    summary: "把称帝视为远期叙事目标，关注权力来源、联盟、资源、合法性、军事依赖、暴露与阶段门槛。",
    suggestedStartingIdentities: ["heir", "regent-powerful-minister", "general", "local-official"],
    capabilityOverlay: [
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "claim-action-consistency", mode: "resident" },
      { id: "red-team", mode: "resident" },
      { id: "readiness-logistics", mode: "on-demand" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "sun-tzu", weight: "primary" },
      { id: "wu-zetian", weight: "secondary" }
    ],
    focusQuestions: ["你现在真正控制的是什么，而不是你希望别人服从什么？", "从当前身份到下一阶段，最先需要改变的是资源、职位、联盟还是合法性？"],
    caution: "这是路线规划，不是权限升级。当前身份的 permission profile 始终优先。"
  },
  {
    id: "court-household-struggle",
    label: "宫斗 / 宅斗 / 内廷权力",
    kind: "power",
    summary: "聚焦家庭与宫廷内部的亲疏、资源、信息、礼法、依附和声誉竞争，不把所有关系自动阴谋化。",
    suggestedStartingIdentities: ["heir", "servant", "emperor"],
    capabilityOverlay: [
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "claim-action-consistency", mode: "resident" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "wu-zetian", weight: "primary" },
      { id: "wang-yangming", weight: "secondary" }
    ],
    focusQuestions: ["谁依赖谁提供资源、名分、信息或庇护？", "这个动作如果被解释成越礼、争宠或结党，会产生什么后果？"]
  },
  {
    id: "commerce-wealth",
    label: "经商 / 致富 / 产业路线",
    kind: "wealth",
    summary: "从当前可控制资源出发积累资本、信用、商路、技能与可持续收入，而不是默认已有大商号。",
    suggestedStartingIdentities: ["merchant", "commoner", "servant", "scholar"],
    capabilityOverlay: [
      { id: "ledger-evidence-crosscheck", mode: "resident" },
      { id: "readiness-logistics", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "fan-li", weight: "primary" },
      { id: "guan-zhong", weight: "secondary" }
    ],
    focusQuestions: ["第一笔可重复的收入从哪里来？", "你承担得起哪一种失败，哪一种会直接清零？"]
  },
  {
    id: "arts-and-letters",
    label: "诗人 / 画家 / 文艺路线",
    kind: "creative",
    summary: "把创作、技法、作品传播、赞助、师友网络、材料和生计放在同一条发展线上。",
    suggestedStartingIdentities: ["scholar", "commoner", "merchant", "servant", "heir"],
    capabilityOverlay: [
      { id: "claim-action-consistency", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "on-demand" },
      { id: "plural-stakeholder-signals", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "su-shi", weight: "primary" },
      { id: "gu-kaizhi", weight: "secondary" },
      { id: "li-qingzhao", weight: "secondary" }
    ],
    focusQuestions: ["你现在最想练的是技法、作品、名声还是靠创作活下去？", "谁能看到你的作品，谁能提供材料、空间或赞助？"]
  },
  {
    id: "retreat-and-seclusion",
    label: "归隐 / 辞官 / 退场路线",
    kind: "retirement",
    summary: "把退出权力、重新安排资产与家人、选择落脚地、维持生计和降低被重新卷入的风险作为核心。",
    suggestedStartingIdentities: ["emperor", "heir", "regent-powerful-minister", "general", "local-official", "scholar", "merchant"],
    capabilityOverlay: [
      { id: "readiness-logistics", mode: "resident" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" }
    ],
    expertOverlay: [
      { id: "tao-yuanming", weight: "primary" },
      { id: "fan-li", weight: "secondary" }
    ],
    focusQuestions: ["你是在辞去职位，还是要真正切断别人继续利用你的理由？", "退场后靠什么生活、保护谁、住在哪里？"],
    caution: "归隐是发展目标，不自动撤销当前身份、债务、政治敌意或家庭责任。"
  },
  {
    id: "survive-and-protect",
    label: "求生 / 保家 / 先别死",
    kind: "survival",
    summary: "不追求宏大上升，把人身安全、家人、庇护、食物、路线、债务与暴露控制放在第一位。",
    suggestedStartingIdentities: ["servant", "commoner", "scholar", "merchant"],
    capabilityOverlay: [
      { id: "readiness-logistics", mode: "resident" },
      { id: "red-team", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertOverlay: [],
    focusQuestions: ["最坏情况下今晚住哪、吃什么、谁会追你？", "哪些东西必须保住，哪些可以立刻放弃？"]
  },
  {
    id: "custom",
    label: "自定义路线",
    kind: "custom",
    summary: "由宿主自由描述想成为怎样的人、想过怎样的生活或想完成什么长期目标；不自动附送任何权限。",
    suggestedStartingIdentities: [],
    capabilityOverlay: [],
    expertOverlay: [],
    focusQuestions: ["你想成为谁？", "什么结果对你来说算成功？", "你明确不想付出什么代价？"],
    caution: "自定义目标必须作为意图处理，不能被提升为当前世界事实或既得权限。"
  }
];
