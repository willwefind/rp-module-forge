import type {
  CanonicalWorldPack,
  ExpertDefinition,
  WorldPack
} from "@rpmf/core";

const experts: ExpertDefinition[] = [
  { id: "zhang-juzheng", label: "张居正", strengths: ["行政执行", "财政纪律", "考成与责任链"], caution: "可能高估中枢正式权力的可执行性。" },
  { id: "wang-yangming", label: "王阳明", strengths: ["人心判断", "知行统一", "军政现场机变"], caution: "不得把行为线索直接升级为已知动机。" },
  { id: "qi-jiguang", label: "戚继光", strengths: ["练兵", "后勤", "军纪", "编制与实战"], caution: "军事最优不等于政治或民生成本可接受。" },
  { id: "sun-tzu", label: "孙武", strengths: ["战略框架", "敌我态势", "欺骗与成本"], caution: "抽象战略不得越过当前证据面。" },
  { id: "fan-li", label: "范蠡", strengths: ["商业资源", "时机", "政治退出与风险分散"], caution: "机会判断不得忽略非市场约束。" },
  { id: "hai-rui", label: "海瑞", strengths: ["法度", "廉政", "地方治理中的制度摩擦"], caution: "道德清晰不等于方案可执行。" },
  { id: "guan-zhong", label: "管仲", strengths: ["国家能力", "财政", "政治经济与资源配置"], caution: "宏观优化需要显式保留分配与群体代价。" }
];

export const ancientChinaPackV01: CanonicalWorldPack = {
  id: "ancient-china",
  version: "0.1",
  label: "中国古代适配包",
  capabilities: [
    { id: "accountability-execution", label: "考成台", description: "拆解责任、承诺、交接、拖延与执行断点；不凭空判定谁在甩锅。" },
    { id: "claim-action-consistency", label: "知行镜", description: "比较表态、行为、激励与时序；言行不一不是动机或罪责的证明。" },
    { id: "ledger-evidence-crosscheck", label: "鱼鳞算盘", description: "交叉核对田亩、人口、税粮、仓储、贸易与其他账目；异常不等于贪腐。" },
    { id: "multiplex-relationship-graph", label: "朋党谱", description: "记录师生、姻亲、同乡、利益、理念、临时联盟与私怨等重叠关系。" },
    { id: "readiness-logistics", label: "烽燧图", description: "区分名义规模、可调动规模、有效能力、补给、时间与路线约束。" },
    { id: "plural-stakeholder-signals", label: "民声池", description: "保留不同群体、地区、渠道与时间上的冲突信号，不生成万能民心值。" },
    { id: "red-team", label: "御前反对席", description: "从对手、执行层、后勤、激励与意外后果角度攻击方案；不替宿主作决定。" },
    { id: "curated-practitioner-knowledge", label: "老乡遗言库", description: "调用经过审校、适用边界明确的 Traveler Forum 经验，不把轶事当当前世界事实。" }
  ],
  identities: [
    {
      id: "emperor",
      label: "皇帝",
      summary: "中枢最高权力，但信息高度过滤，命令仍会被执行层扭曲。",
      permissionProfile: {
        id: "ancient-china:emperor:v1",
        observe: ["正式奏报、朝会与经合法渠道呈送的中枢信息"],
        access: ["可经制度渠道调阅多数中央机关记录；具体密级与场景仍需本局补丁确认"],
        request: ["要求官署复核、补报、会审或提供额外证据"],
        command: ["在本局制度允许范围内向中央与地方官署下达正式命令"],
        allocate: ["在制度与现实资源约束内调配重大公共资源"],
        publish: ["发布诏令、公开立场与正式政策"],
        conceal: ["通过可信渠道进行有限度秘密核查；不得凭身份获得未提供的隐秘事实"],
        risks: ["信息失真", "官僚抵抗", "政变", "财政崩溃", "合法性冲击"]
      },
      recommendedCapabilities: [
        { id: "accountability-execution", mode: "resident" },
        { id: "ledger-evidence-crosscheck", mode: "on-demand" },
        { id: "multiplex-relationship-graph", mode: "resident" },
        { id: "plural-stakeholder-signals", mode: "on-demand" },
        { id: "red-team", mode: "on-demand" }
      ],
      recommendedExperts: [
        { id: "zhang-juzheng", weight: "primary" },
        { id: "wang-yangming", weight: "secondary" }
      ]
    },
    {
      id: "heir",
      label: "储君 / 皇嗣",
      summary: "接近中枢教育与人脉，但正式权力有限且每次越界都具有政治含义。",
      permissionProfile: {
        id: "ancient-china:heir:v1",
        observe: ["被允许接触的宫廷信息、教育材料与公开奏议"],
        access: ["储君府、师傅与获准接触的宫廷网络"],
        request: ["通过师傅、属官或许可渠道请求解释与材料"],
        command: ["仅对明确隶属自身且本局允许的人员发出有限命令"],
        allocate: ["仅使用明确归属自身府邸或获批资源"],
        publish: ["在礼制与政治边界内表达立场"],
        conceal: ["有限私人询问；任何秘密组织行动都需要显式场景依据"],
        risks: ["猜忌", "派系绑架", "过早暴露", "继承政治反噬"]
      },
      recommendedCapabilities: [
        { id: "claim-action-consistency", mode: "resident" },
        { id: "multiplex-relationship-graph", mode: "resident" },
        { id: "plural-stakeholder-signals", mode: "on-demand" },
        { id: "curated-practitioner-knowledge", mode: "on-demand" }
      ],
      recommendedExperts: [
        { id: "wang-yangming", weight: "primary" },
        { id: "zhang-juzheng", weight: "secondary" }
      ]
    },
    {
      id: "regent-powerful-minister",
      label: "摄政 / 权臣",
      summary: "行政触达高，但权力来源与合法性边界需要被持续核验。",
      permissionProfile: {
        id: "ancient-china:regent-powerful-minister:v1",
        observe: ["职责范围内奏报、官署材料与政治网络信号"],
        access: ["与实际职权相匹配的中央官署和记录"],
        request: ["要求下属、盟友或相关官署提供材料与执行回报"],
        command: ["仅在正式或事实职权边界内发令"],
        allocate: ["调度职责范围内预算、人力与政治资本"],
        publish: ["以合法职衔发布职责范围内决定"],
        conceal: ["有限政治协调；超越职权的秘密行动必须显式标注风险与依据"],
        risks: ["清算", "合法性反噬", "执行层消极抵抗", "联盟崩解"]
      },
      recommendedCapabilities: [
        { id: "accountability-execution", mode: "resident" },
        { id: "claim-action-consistency", mode: "resident" },
        { id: "multiplex-relationship-graph", mode: "resident" },
        { id: "red-team", mode: "on-demand" }
      ],
      recommendedExperts: [
        { id: "zhang-juzheng", weight: "primary" },
        { id: "wang-yangming", weight: "secondary" }
      ]
    },
    {
      id: "general",
      label: "将军",
      summary: "军中权限较高，朝堂、财政与地方民政权限通常有限。",
      permissionProfile: {
        id: "ancient-china:general:v1",
        observe: ["军中编制、训练、补给、战报与获准情报"],
        access: ["所辖军营、军令链和职责范围内军需记录"],
        request: ["向上级、地方或军需系统请求授权、补给与情报"],
        command: ["指挥明确隶属或临时受节制的军队"],
        allocate: ["调配获批军需、兵力和运输能力"],
        publish: ["发布职责范围内军令与必要公告"],
        conceal: ["在军事权限内保护计划与行动细节"],
        risks: ["粮断", "兵变", "虚报", "指挥失误", "朝廷猜忌"]
      },
      recommendedCapabilities: [
        { id: "readiness-logistics", mode: "resident" },
        { id: "accountability-execution", mode: "resident" },
        { id: "claim-action-consistency", mode: "on-demand" },
        { id: "red-team", mode: "on-demand" }
      ],
      recommendedExperts: [
        { id: "qi-jiguang", weight: "primary" },
        { id: "sun-tzu", weight: "secondary" }
      ]
    },
    {
      id: "local-official",
      label: "地方官",
      summary: "能接触本地行政工具与记录，但能力、信息与上级支持都受边界约束。",
      permissionProfile: {
        id: "ancient-china:local-official:v1",
        observe: ["本地职责范围内公开情况、来文、账册与执行反馈"],
        access: ["本衙门和依法可调取的本地记录；不得自动访问中央密档"],
        request: ["向属吏、地方机构、上级与相关群体请求材料或协作"],
        command: ["指挥明确隶属本地行政链条的执行事项"],
        allocate: ["在法定与现实额度内调配地方资源"],
        publish: ["发布职责范围内告示、行政决定与上报材料"],
        conceal: ["进行有限内部核查；越权秘密调查需显式风险"],
        risks: ["豪强阻力", "假账", "能力不足", "上级甩锅", "地方冲突"]
      },
      recommendedCapabilities: [
        { id: "accountability-execution", mode: "resident" },
        { id: "ledger-evidence-crosscheck", mode: "on-demand" },
        { id: "plural-stakeholder-signals", mode: "on-demand" },
        { id: "multiplex-relationship-graph", mode: "resident" }
      ],
      recommendedExperts: [
        { id: "hai-rui", weight: "primary" },
        { id: "zhang-juzheng", weight: "secondary" }
      ]
    },
    {
      id: "scholar",
      label: "士人 / 读书人",
      summary: "识字、能参与舆论与部分精英网络，但通常没有预算和行政命令权。",
      permissionProfile: {
        id: "ancient-china:scholar:v1",
        observe: ["公开文本、社交网络、学术与地方舆论信号"],
        access: ["个人、人情与学术网络允许进入的场所和材料"],
        request: ["通过师友、同年、乡里或公开渠道询问信息"],
        command: [],
        allocate: ["个人财物、时间与自有社会资本"],
        publish: ["在本局审查与社会风险允许范围内写作、议论或上书"],
        conceal: ["私人通信与低风险观察；不得假设拥有官署密档"],
        risks: ["审查", "依附关系", "声誉损失", "社会报复"]
      },
      recommendedCapabilities: [
        { id: "claim-action-consistency", mode: "resident" },
        { id: "plural-stakeholder-signals", mode: "on-demand" },
        { id: "multiplex-relationship-graph", mode: "resident" },
        { id: "curated-practitioner-knowledge", mode: "on-demand" }
      ],
      recommendedExperts: [
        { id: "wang-yangming", weight: "primary" }
      ]
    },
    {
      id: "merchant",
      label: "商贾",
      summary: "掌握商业与运输网络信息，但正式强制权力低，法律安全随场景变化。",
      permissionProfile: {
        id: "ancient-china:merchant:v1",
        observe: ["价格、货物流、合同、同行与路线相关公开或交易信息"],
        access: ["自有账册、仓储、商路与交易伙伴主动提供的材料"],
        request: ["向伙伴、牙行、运输者与可接触官署请求交易相关信息"],
        command: ["仅指挥明确受雇或属于自身经营体系的人员"],
        allocate: ["自有资金、货物、信用与经营资源"],
        publish: ["商业报价、契约与在制度允许范围内的公开信息"],
        conceal: ["依法或符合情境的商业机密；不得据此获得官府隐秘情报"],
        risks: ["没收", "违约", "运输损失", "政治暴露", "信用崩塌"]
      },
      recommendedCapabilities: [
        { id: "ledger-evidence-crosscheck", mode: "resident" },
        { id: "multiplex-relationship-graph", mode: "resident" },
        { id: "plural-stakeholder-signals", mode: "on-demand" },
        { id: "curated-practitioner-knowledge", mode: "on-demand" }
      ],
      recommendedExperts: [
        { id: "fan-li", weight: "primary" },
        { id: "guan-zhong", weight: "secondary" }
      ]
    },
    {
      id: "commoner",
      label: "普通人",
      summary: "正式权力低，主要依靠家庭、邻里、职业技能与有限资源。",
      permissionProfile: {
        id: "ancient-china:commoner:v1",
        observe: ["家庭、邻里、职业与公共空间中正常可见的信息"],
        access: ["个人财物、家庭与社区允许进入的空间"],
        request: ["向家人、邻里、雇主、行会或公开机构提出合理请求"],
        command: [],
        allocate: ["个人或家庭明确掌握的资源"],
        publish: ["在社会与制度风险允许范围内表达自身经历和诉求"],
        conceal: ["个人隐私与普通自保行为"],
        risks: ["生计", "征役", "治安", "灾荒", "债务"]
      },
      recommendedCapabilities: [
        { id: "plural-stakeholder-signals", mode: "on-demand" },
        { id: "curated-practitioner-knowledge", mode: "on-demand" }
      ],
      recommendedExperts: []
    },
    {
      id: "servant",
      label: "奴婢 / 仆役",
      summary: "可能近距离观察家庭或机构，但正式权限极低，提问本身都可能制造危险。",
      permissionProfile: {
        id: "ancient-china:servant:v1",
        observe: ["本职活动范围内亲眼所见、亲耳所闻的日常行为与环境变化"],
        access: ["被指派进入的房间、物品与任务区域；不包含主家私账或官署记录的自动访问权"],
        request: ["在身份关系允许时询问与本职工作直接相关的事情"],
        command: [],
        allocate: ["个人物品与明确交付自己处置的少量资源"],
        publish: ["仅在社会风险允许范围内表达个人信息；公开指控风险极高"],
        conceal: ["符合日常行为范围的小规模自保与信息保护；不得假设秘密调查能力"],
        risks: ["惩罚", "身份暴露", "失去庇护", "报复", "资源匮乏"]
      },
      recommendedCapabilities: [
        { id: "claim-action-consistency", mode: "resident" },
        { id: "multiplex-relationship-graph", mode: "resident" },
        { id: "curated-practitioner-knowledge", mode: "on-demand" }
      ],
      recommendedExperts: []
    }
  ],
  experts
};

/**
 * Birth-version pack retained temporarily so old ForgeConfig consumers and
 * migration fixtures keep working during M1. New surfaces should use
 * ancientChinaPackV01.
 */
export const ancientChinaPack: WorldPack = {
  id: "ancient-china",
  label: "中国古代适配包",
  roles: [
    {
      id: "emperor",
      label: "皇帝",
      permissionSummary: "中枢最高权力，但受信息失真、官僚执行与政治后果约束",
      risks: ["政变", "财政崩溃", "外患", "官僚失灵"],
      recommendedModules: ["administration", "fiscal", "motives", "intelligence"],
      recommendedExperts: ["zhang-juzheng", "wang-yangming"]
    },
    {
      id: "general",
      label: "将军",
      permissionSummary: "军中权限较高，朝堂与财政权限有限",
      risks: ["粮断", "兵变", "谗言", "指挥失误"],
      recommendedModules: ["logistics", "motives", "intelligence", "resources"],
      recommendedExperts: ["qi-jiguang", "sun-tzu", "wang-yangming"]
    },
    {
      id: "servant",
      label: "奴婢 / 仆役",
      permissionSummary: "正式权限极低，行动依赖主家结构、信任与隐蔽空间",
      risks: ["惩罚", "身份暴露", "失去庇护", "资源匮乏"],
      recommendedModules: ["survival", "status", "motives", "intelligence"],
      recommendedExperts: []
    },
    {
      id: "commoner",
      label: "普通人",
      permissionSummary: "正式权力低，主要依靠家庭、社区、技能与有限资源",
      risks: ["生计", "征役", "治安", "灾荒"],
      recommendedModules: ["survival", "resources", "status", "intelligence"],
      recommendedExperts: []
    }
  ],
  modules: [
    { id: "administration", label: "政务考成", description: "拆解责任链、执行节点、拖延与甩锅路径。" },
    { id: "fiscal", label: "财政穿透", description: "交叉核对税粮、仓储、田亩、贸易与异常账目。" },
    { id: "logistics", label: "兵站后勤", description: "核算真实可用兵力、粮草、马匹、军饷与调度时间。" },
    { id: "motives", label: "人心博弈", description: "分析言行差、动机、联盟、利益与背刺风险。" },
    { id: "intelligence", label: "情报拼图", description: "区分事实、传闻和推断，并指出还缺哪张证据。" },
    { id: "survival", label: "低权限生存", description: "识别危险人物、身份漏洞、禁区与逃生路径。" },
    { id: "status", label: "礼法身份", description: "判断当前阶层能说什么、问什么、接触什么与承担什么风险。" },
    { id: "resources", label: "资源经营", description: "盘点金钱、物资、技能、人情、人脉与可交换价值。" }
  ],
  experts
};
