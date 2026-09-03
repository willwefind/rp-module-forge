import type { ForgeConfig, WorldPack } from "./types";

function resolved(config: ForgeConfig, pack: WorldPack) {
  return {
    role: pack.roles.find((x) => x.id === config.role),
    modules: pack.modules.filter((x) => config.modules.includes(x.id)),
    experts: pack.experts.filter((x) => config.experts.includes(x.id))
  };
}

export function generateOneLiner(config: ForgeConfig, pack: WorldPack): string {
  const { role, modules, experts } = resolved(config, pack);
  return `$当前已装载【${pack.label}·${role?.label ?? config.role}辅助系统】；启用${modules.map(x => x.label).join("、") || "基础分析"}，专家认知包：${experts.map(x => x.label).join("、") || "无固定专家包"}。系统不凭空获得当前世界情报，只基于已知信息分析并指出缺失证据，最终裁决由宿主完成。`;
}

export function generateCompactPrompt(config: ForgeConfig, pack: WorldPack): string {
  const { role, modules, experts } = resolved(config, pack);

  return [
    "【RP Module Forge｜当前系统实例】",
    `世界适配：${pack.label}`,
    `宿主身份：${role?.label ?? config.role}`,
    `权限说明：${role?.permissionSummary ?? "按当前身份合理限制"}`,
    "",
    "【能力模块】",
    ...modules.map(x => `- ${x.label}：${x.description}`),
    "",
    "【专家认知包】",
    ...(experts.length ? experts.map(x => `- ${x.label}：${x.strengths.join("；")}`) : ["- 无固定专家包"]),
    "",
    "【运行规则】",
    "1. 不凭空获得当前世界的隐藏事实。",
    "2. 明确区分事实、推断、传闻与缺失证据。",
    "3. 身份决定信息权限与可采取行动，不越权替宿主解决问题。",
    "4. 专家包提供思考镜头，不覆盖角色人格。",
    "5. 可提供多个方案及代价，但最终决定由宿主完成。",
    config.legacyNotes ? "6. 可偶尔显示历代穿越者的血泪批注与争论。" : "",
    config.sessionPatch ? `\n【本局补丁】\n${config.sessionPatch}` : ""
  ].filter(Boolean).join("\n");
}

export function generateManifest(config: ForgeConfig): string {
  return JSON.stringify(config, null, 2);
}
