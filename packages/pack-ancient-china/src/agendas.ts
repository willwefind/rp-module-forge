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
    summary: "把享受生活本身当成正当目标，同时看清为了维持这种生活真正不能失去的安全、资源、关系与自由。",
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
    focusQuestions: ["你真正想享受的是什么，而不是别人替你定义的富贵？", "怎样的代价会反过来毁掉这份自由和舒服？"],
    identityFacets: [
      {
        identities: ["emperor", "heir", "regent-powerful-minister"],
        summary: "不把治理成就当人生唯一目标；在不让人身安全、权力交接、财政与身边关系失控的前提下，为自己保留真正想过的生活。",
        focusQuestions: ["哪些责任必须有人接住，才能让你真的有闲？", "哪些享乐会制造新的财政、继承或宫廷风险？"],
        expertOverlay: [
          { id: "su-shi", weight: "primary" },
          { id: "fan-li", weight: "secondary" }
        ]
      },
      {
        identities: ["general", "local-official"],
        summary: "不把职位表现当人生全部；在不让职责失守、人身与家计被拖垮的前提下，争取可持续的休息、爱好、亲友和生活空间。",
        focusQuestions: ["哪些职责必须亲自守，哪些可以合理交接？", "你想保住的生活会不会被职位风险随时吞掉？"],
        expertOverlay: [
          { id: "su-shi", weight: "primary" },
          { id: "tao-yuanming", weight: "secondary" }
        ]
      },
      {
        identities: ["merchant"],
        summary: "让赚钱服务于生活，而不是让生意吞掉生活；在不掏空本钱、信用和退路的前提下安排消费、闲暇、旅行、收藏与人情。",
        focusQuestions: ["你赚到什么程度才算够，而不是永远再多一点？", "哪些享受在消耗现金，哪些其实在消耗信用或自由？"],
        expertOverlay: [
          { id: "fan-li", weight: "primary" },
          { id: "su-shi", weight: "secondary" }
        ]
      },
      {
        identities: ["scholar"],
        summary: "不把功名和声誉当唯一正事；在生计、名声与现实责任允许的范围里，为读书、交游、山水、酒食、写作与闲暇留位置。",
        focusQuestions: ["你想要的是功名带来的生活，还是那种生活本身？", "哪些名声与人情会把闲适重新变成另一种差事？"],
        expertOverlay: [
          { id: "su-shi", weight: "primary" },
          { id: "li-qingzhao", weight: "secondary" }
        ]
      },
      {
        identities: ["commoner"],
        label: "享乐 / 小日子路线",
        summary: "不把“活着”压缩成只剩劳作和避祸；在有限钱粮、时间和家庭责任里，争取能反复拥有的休息、吃喝、节庆、爱好、朋友与舒服日子。",
        focusQuestions: ["哪一种快乐最便宜、最稳定、最不容易被夺走？", "为了这一点舒服，你真正愿意拿多少时间、钱粮或人情去换？"],
        expertOverlay: [
          { id: "su-shi", weight: "primary" },
          { id: "li-qingzhao", weight: "secondary" }
        ]
      },
      {
        identities: ["servant"],
        label: "偷得浮生 / 小日子路线",
        summary: "不默认你要上进、夺权或立功。目标就是在极低正式权限下，尽量争取属于自己的睡眠、吃穿、小钱、朋友、爱好与可支配时间，同时别因为偷闲、擅动物品或失职把自己送进险局。",
        focusQuestions: ["一天里真正属于你的时间有多少，怎样才能多保住一点？", "什么小享受不会留下明显把柄，也不会透支你明天的安全？"],
        caution: "享乐不等于系统替宿主偷取主家财物、逃避明确差事或假定拥有自由支配权；所有行动仍按当前身份权限与本局事实判断。",
        capabilityOverlay: [
          { id: "readiness-logistics", mode: "on-demand" },
          { id: "claim-action-consistency", mode: "on-demand" },
          { id: "multiplex-relationship-graph", mode: "on-demand" },
          { id: "red-team", mode: "on-demand" }
        ],
        expertOverlay: [
          { id: "su-shi", weight: "primary" },
          { id: "li-qingzhao", weight: "secondary" }
        ]
      }
    ]
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
    summary: "离开当前高占用的位置或生活结构，把资产、家人、落脚地、生计和被重新卷入的风险一起安排好。",
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
    focusQuestions: ["你真正想退出的是什么：职位、关系、义务、危险，还是某种生活方式？", "退出以后靠什么生活、保护谁、住在哪里？"],
    caution: "归隐是发展目标，不自动撤销当前身份、债务、政治敌意、依附关系或家庭责任。",
    identityFacets: [
      {
        identities: ["emperor", "heir", "regent-powerful-minister", "general", "local-official"],
        summary: "把退出权力、职位或高风险责任，与交接、资产、家人、生计和被重新卷入的风险一起安排。",
        focusQuestions: ["你是在辞去职位，还是要真正切断别人继续利用你的理由？", "交接以后还有谁能把你重新拖回去？"]
      },
      {
        identities: ["scholar", "merchant", "commoner"],
        summary: "离开现在消耗你的职业、圈子或生活方式，重新安排住处、生计、家人、人情债与未来节奏。",
        focusQuestions: ["你真正想摆脱的是哪一种消耗？", "换一种生活后，稳定收入、住处和家人安排靠什么接上？"]
      },
      {
        identities: ["servant"],
        label: "离开主家 / 换活法路线",
        summary: "目标不是“辞官”，而是尽可能安全地离开当前依附关系或差事结构，寻找新的住处、生计、庇护与身份落点。",
        focusQuestions: ["你现在有没有合法或现实可行的离开路径？", "离开主家后第一晚住哪、靠什么吃饭、谁可能追索你？"],
        caution: "想离开不等于当前已经自由身；赎身、放籍、逃离、转卖或改换差事的现实条件必须按本局制度与证据分别判断。",
        expertOverlay: [
          { id: "tao-yuanming", weight: "primary" },
          { id: "li-qingzhao", weight: "secondary" }
        ]
      }
    ]
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