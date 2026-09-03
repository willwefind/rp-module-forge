import type { IdentityPlaybookDefinition } from "@rpmf/core";

export const ancientChinaPlaybooks: IdentityPlaybookDefinition[] = [
  {
    id: "imperial-governance",
    label: "中枢治理与失真控制",
    summary: "围绕诏令、责任链、账目、关系网络与政策风险组织信息；默认假设宿主有高行政触达，但仍受证据和执行失真约束。",
    identities: ["emperor"],
    capabilityDefaults: [
      { id: "accountability-execution", mode: "resident" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "plural-stakeholder-signals", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "zhang-juzheng", weight: "primary" },
      { id: "wang-yangming", weight: "secondary" }
    ],
    facets: [
      { capability: "accountability-execution", label: "考成台", description: "把政策、诏令和官署任务拆成责任人、节点、回报与执行断点。", questions: ["谁真正负责？", "命令在哪一层开始失真？"], examples: ["一项新政在三省六部与地方之间卡住"] },
      { capability: "red-team", label: "御前反对席", description: "从官僚执行、财政、政治联盟和意外激励角度攻击高影响方案。", questions: ["谁有能力让这项政策表面执行、实际落空？"], examples: ["一道看似无害的新税制会如何被地方变形"] }
    ]
  },
  {
    id: "heir-court-survival",
    label: "东宫继承政治与暴露控制",
    summary: "重点不是替储君提前当皇帝，而是辨别宫廷信号、人情网络、师傅属官的行为与自身暴露风险。",
    identities: ["heir"],
    capabilityDefaults: [
      { id: "claim-action-consistency", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "plural-stakeholder-signals", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "wang-yangming", weight: "primary" },
      { id: "zhang-juzheng", weight: "secondary" }
    ],
    facets: [
      { capability: "claim-action-consistency", label: "知行镜 · 宫廷察行", description: "比较师傅、属官、亲贵与宫人说法和实际动作，不把恭顺直接当忠诚。", questions: ["谁在公开支持，私下却减少接触？", "什么变化可能只是礼制而不是敌意？"], examples: ["一位长期亲近的师傅突然开始回避单独见面"] },
      { capability: "multiplex-relationship-graph", label: "东宫人情谱", description: "梳理师生、婚姻、外戚、同年、恩怨与临时利益，不把任何人固定成单一党羽。", questions: ["这个人对谁有多重依赖？"], examples: ["同一位官员既是老师门生又与外戚联姻"] },
      { capability: "red-team", label: "疑忌预演", description: "反推一次表态、结交或越界行动会怎样被父皇、群臣或对手解释。", questions: ["如果这件事被最恶意地解读，会变成什么罪名？"], examples: ["储君公开替一名被贬官员说话"] }
    ]
  },
  {
    id: "regent-power-balance",
    label: "权责执行与合法性平衡",
    summary: "把高行政触达和脆弱合法性同时纳入分析，防止把事实权力误写成无限正式权限。",
    identities: ["regent-powerful-minister"],
    capabilityDefaults: [
      { id: "accountability-execution", mode: "resident" },
      { id: "claim-action-consistency", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "plural-stakeholder-signals", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "zhang-juzheng", weight: "primary" },
      { id: "wang-yangming", weight: "secondary" }
    ],
    facets: [
      { capability: "accountability-execution", label: "权责考成", description: "区分正式职权、事实控制与他人替你执行的链条。", questions: ["谁是在服从职衔，谁是在服从你的个人势力？"], examples: ["一项命令只有亲信系统愿意执行"] },
      { capability: "red-team", label: "倒台预演", description: "从清算、联盟崩塌、合法性与消极执行角度攻击方案。", questions: ["如果你的政治保护明天消失，这项制度还能站住吗？"], examples: ["通过私人威望推进一项绕过常规程序的改革"] }
    ]
  },
  {
    id: "military-command",
    label: "军令、补给与战场不确定性",
    summary: "关注可用兵力、粮饷、运输、军令链、部属行为与败局预警，不把名义兵力当真实能力。",
    identities: ["general"],
    capabilityDefaults: [
      { id: "readiness-logistics", mode: "resident" },
      { id: "accountability-execution", mode: "resident" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "claim-action-consistency", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "qi-jiguang", weight: "primary" },
      { id: "sun-tzu", weight: "secondary" }
    ],
    facets: [
      { capability: "accountability-execution", label: "军令簿", description: "追踪军令、传令、部属职责、回报节点与执行中断。", questions: ["军令送到谁手里时发生了变化？"], examples: ["前锋称未收到撤退命令"] },
      { capability: "ledger-evidence-crosscheck", label: "粮饷算盘", description: "核对军需、粮饷、马匹、运输损耗与实际领用记录。", questions: ["账面粮草与前线实收差多少？"], examples: ["军需官称粮足三十日，但各营领用记录对不上"] },
      { capability: "red-team", label: "败局推演", description: "从断粮、误报、路线、指挥冲突与敌方反制角度找最先会断的点。", questions: ["哪一个前提一旦错，整个计划会最快崩？"], examples: ["计划建立在一条冬季山路始终畅通的假设上"] }
    ]
  },
  {
    id: "local-governance",
    label: "到任治理与地方执行链",
    summary: "把县库、属吏、豪强、乡里、上级压力与有限资源放在同一张地方尺度的图上。",
    identities: ["local-official"],
    capabilityDefaults: [
      { id: "accountability-execution", mode: "resident" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "plural-stakeholder-signals", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "hai-rui", weight: "primary" },
      { id: "zhang-juzheng", weight: "secondary" }
    ],
    facets: [
      { capability: "accountability-execution", label: "差役考成", description: "拆解本衙门差事、属吏责任、催办和上报链。", questions: ["谁名义负责，谁实际上控制这件事？"], examples: ["修堤款拨了，但工程一直没有动"] },
      { capability: "ledger-evidence-crosscheck", label: "县库算盘", description: "核对本地税粮、仓储、田亩、人口与运输记录，只使用依法可接触材料。", questions: ["县库空的是账、物，还是可动用额度？"], examples: ["到任第三天发现县库账面正常但实物不足"] },
      { capability: "plural-stakeholder-signals", label: "乡里众声", description: "区分士绅、商户、佃户、差役、流民等不同群体的信号。", questions: ["谁没有出现在你能听见的渠道里？"], examples: ["所有里正都说今年收成很好"] },
      { capability: "red-team", label: "翻车预演", description: "从豪强阻力、执行层阳奉阴违、财政与上级甩锅角度攻击地方方案。", questions: ["谁可以让这项措施只在纸面成功？"], examples: ["一项清丈方案依赖本地胥吏自报数据"] }
    ]
  },
  {
    id: "scholar-network-navigation",
    label: "言路、人脉与声誉风险",
    summary: "帮助士人在没有正式命令权的前提下理解言行、师友网络、舆论渠道与表达风险。",
    identities: ["scholar"],
    capabilityDefaults: [
      { id: "claim-action-consistency", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "plural-stakeholder-signals", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "wang-yangming", weight: "primary" }
    ],
    facets: [
      { capability: "multiplex-relationship-graph", label: "师友人情谱", description: "梳理师承、同年、同乡、姻亲、声誉与资助关系。", questions: ["这段关系是理念一致，还是彼此需要？"], examples: ["一位前辈既提携你又希望你公开站队"] },
      { capability: "plural-stakeholder-signals", label: "士林风向", description: "辨别书院、乡里、官场外围与公开文本中的不同声音。", questions: ["你听到的是士林意见，还是某一个圈子的意见？"], examples: ["同一篇文章在京城与本乡得到完全不同反应"] },
      { capability: "red-team", label: "言路反推", description: "反推一封信、一篇文章或一次结交会带来的审查、声誉与依附风险。", questions: ["这句话被截出来单独传播时会变成什么？"], examples: ["准备公开批评一项地方政策"] }
    ]
  },
  {
    id: "merchant-operation",
    label: "本钱、商路与伙伴风险",
    summary: "围绕自有账册、货物流、信用、路线、雇员与交易伙伴组织决策，不假设拥有官府强制权。",
    identities: ["merchant"],
    capabilityDefaults: [
      { id: "ledger-evidence-crosscheck", mode: "resident" },
      { id: "readiness-logistics", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "claim-action-consistency", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [
      { id: "fan-li", weight: "primary" },
      { id: "guan-zhong", weight: "secondary" }
    ],
    facets: [
      { capability: "ledger-evidence-crosscheck", label: "行商算盘", description: "核对自有账、货物、价格、合同、欠款和交易伙伴提供的记录。", questions: ["利润来自真实价差，还是把坏账和损耗藏起来了？"], examples: ["一条商路账面利润突然异常漂亮"] },
      { capability: "readiness-logistics", label: "商路盘", description: "盘点库存、运输、现金、信用、季节、路线和替代供应。", questions: ["这批货如果晚十天到，现金流先在哪断？"], examples: ["雨季前要不要压重金走一条更短的山路"] },
      { capability: "multiplex-relationship-graph", label: "商路人情谱", description: "区分合伙、赊欠、担保、同乡、官面关系与竞争。", questions: ["谁是交易伙伴，谁其实只是借你做人情？"], examples: ["同一牙人同时替你和竞争商号撮合"] },
      { capability: "red-team", label: "赔本预演", description: "从违约、没收、路线中断、价格反转和信用崩塌角度攻击交易计划。", questions: ["哪一种失败会让你没有第二次机会？"], examples: ["把大半身家压在一批需要官署放行的货上"] }
    ]
  },
  {
    id: "household-livelihood",
    label: "家计、生计与避险",
    summary: "把普通人的钱、粮、技能、债务、路线、家人、邻里和风险变成可以实际行动的局部问题，而不是把宿主当成被治理对象。",
    identities: ["commoner"],
    capabilityDefaults: [
      { id: "readiness-logistics", mode: "resident" },
      { id: "ledger-evidence-crosscheck", mode: "on-demand" },
      { id: "multiplex-relationship-graph", mode: "on-demand" },
      { id: "claim-action-consistency", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [],
    facets: [
      { capability: "accountability-execution", label: "差事与承诺簿", description: "追踪雇工、租约、欠债、口头承诺和家庭分工，不需要任何官署权力。", questions: ["谁答应了什么？有没有可验证的交付？"], examples: ["雇主连续三次说下旬结工钱"] },
      { capability: "ledger-evidence-crosscheck", label: "家计算盘", description: "核对收入、粮价、债务、租税、存粮和日常消耗，只使用自己能知道的账。", questions: ["这个月真正还能动用多少粮钱？"], examples: ["粮价上涨后家里还能撑多少天"] },
      { capability: "readiness-logistics", label: "活路图", description: "盘点食物、钱、工具、技能、家人、路线、时间和临时住处，用于过冬、迁徙、避灾或换活计。", questions: ["如果三天后必须离开，现在最缺的是什么？", "谁不能被落下？"], examples: ["河水上涨，可能需要带家人暂时离村"] },
      { capability: "multiplex-relationship-graph", label: "亲邻互助谱", description: "梳理亲属、邻里、雇主、行会、债主与互助关系。", questions: ["谁能真正帮忙，谁的帮助会形成新的债？"], examples: ["想借一辆车带老人离开，但每个可借对象都有代价"] },
      { capability: "plural-stakeholder-signals", label: "街坊风向", description: "观察邻里、集市、雇工和行路人的局部信号，不假装自己掌握全县民情。", questions: ["大家是真的不担心，还是不敢公开谈？"], examples: ["集市突然有很多人在买盐和粮"] },
      { capability: "red-team", label: "避祸反推", description: "从治安、征役、债务、灾荒和路线失败角度反推自己的计划。", questions: ["这条活路最可能在哪一步把一家人困住？"], examples: ["准备借高利贷渡过一个月青黄不接"] },
      { capability: "curated-practitioner-knowledge", label: "老乡活命帖", description: "检索普通人尺度的生计、迁徙、灾荒和低资源失败案例。", questions: ["有没有和当前资源条件相近的旧案例？"], examples: ["前辈老乡如何处理临时迁徙和证件/路引问题"] }
    ]
  },
  {
    id: "low-permission-survival",
    label: "差事、主家关系与低权限生存",
    summary: "把奴婢 / 仆役的近距离观察优势与极低正式权限同时保留，重点是安全完成差事、判断关系、保存资源、识别暴露和寻找活路。",
    identities: ["servant"],
    capabilityDefaults: [
      { id: "claim-action-consistency", mode: "resident" },
      { id: "multiplex-relationship-graph", mode: "resident" },
      { id: "readiness-logistics", mode: "resident" },
      { id: "accountability-execution", mode: "on-demand" },
      { id: "red-team", mode: "on-demand" },
      { id: "curated-practitioner-knowledge", mode: "on-demand" }
    ],
    expertDefaults: [],
    facets: [
      { capability: "accountability-execution", label: "差事簿", description: "记录谁吩咐了什么、何时交接、出了错会追到谁；目标是避免背上不属于自己的锅。", questions: ["这件差事是谁亲口交代的？", "中间有没有别人改过话？"], examples: ["两位主子先后给了互相冲突的吩咐"] },
      { capability: "claim-action-consistency", label: "察言观行镜", description: "比较主家、管事、同伴的说法和动作，识别危险变化而不假装读心。", questions: ["谁嘴上说没事，却开始收走钥匙或清点人手？"], examples: ["管事说只是例行清点，却突然不让任何人出院"] },
      { capability: "ledger-evidence-crosscheck", label: "份例算盘", description: "只核对自己被允许接触的份例、领用、物件、库存和短缺记录；不会替你打开主家私账。", questions: ["你亲手领到的数量和被记在你名下的数量一致吗？"], examples: ["库房说你领了十斤炭，但你只拿到六斤"] },
      { capability: "multiplex-relationship-graph", label: "主家人情谱", description: "梳理主子、管事、嬷嬷、同伴、亲随之间谁听谁的、谁护谁、谁会迁怒。", questions: ["谁能替你说话？谁帮你一次会让你欠下更大的东西？"], examples: ["两个管事表面平级，但所有人真正怕的是其中一个"] },
      { capability: "readiness-logistics", label: "活路与储备图", description: "盘点钱、食物、衣物、可携带物、时间、路线、庇护对象和能求助的人，用于自保或被迫离开。", questions: ["如果今晚不能回原住处，你能撑到明天吗？", "哪些东西拿走会立刻暴露？"], examples: ["听见可能要大规模发卖下人的风声"] },
      { capability: "plural-stakeholder-signals", label: "院内风向", description: "观察不同房、不同差事和不同层级仆役的局部变化，不把小院风声当天下民意。", questions: ["谁突然沉默了？谁开始提前处理自己的东西？"], examples: ["厨房、门房和车马房同时出现异常调动"] },
      { capability: "red-team", label: "危局反推", description: "先假设你的行动被发现，再推演最可能的暴露链、惩罚与更安全替代。", questions: ["如果这一步被最坏的人看见，会发生什么？", "有没有更低风险的取证或等待方式？"], examples: ["想偷看一封不属于自己的信来确认猜测"] },
      { capability: "curated-practitioner-knowledge", label: "低权限生存帖", description: "检索经过审核的仆役、侍从和其他低权限老乡旧帖，重点看失败条件和适用边界。", questions: ["这个旧帖的宿主权限和你真的一样低吗？"], examples: ["前辈提醒：知道秘密和能拿秘密做事是两回事"] }
    ]
  }
];
