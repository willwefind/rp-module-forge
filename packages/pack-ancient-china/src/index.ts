import type { WorldPack } from "@rpmf/core";

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
  experts: [
    { id: "zhang-juzheng", label: "张居正", strengths: ["行政执行", "财政纪律", "考成与责任链"] },
    { id: "wang-yangming", label: "王阳明", strengths: ["人心判断", "知行统一", "军政现场机变"] },
    { id: "qi-jiguang", label: "戚继光", strengths: ["练兵", "后勤", "军纪", "编制与实战"] },
    { id: "sun-tzu", label: "孙武", strengths: ["战略框架", "敌我态势", "欺骗与成本"] },
    { id: "fan-li", label: "范蠡", strengths: ["商业资源", "时机", "政治退出与风险分散"] },
    { id: "hai-rui", label: "海瑞", strengths: ["法度", "廉政", "地方治理中的制度摩擦"] },
    { id: "guan-zhong", label: "管仲", strengths: ["国家能力", "财政", "政治经济与资源配置"] }
  ]
};
