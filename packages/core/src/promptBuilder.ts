import type {
  CanonicalForgeConfig,
  CanonicalWorldPack,
  CapabilityMode,
  ForgeConfig,
  WorldPack
} from "./types.js";

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

function modeLabel(mode: CapabilityMode): string {
  if (mode === "resident") return "常驻";
  if (mode === "on-demand") return "按需";
  return "关闭";
}

export function generateCanonicalOneLiner(
  config: CanonicalForgeConfig,
  pack: CanonicalWorldPack
): string {
  const identity = pack.identities.find((item) => item.id === config.identity.id);
  const activeCapabilities = config.capabilities
    .filter((selection) => selection.mode !== "disabled")
    .map((selection) => {
      const definition = pack.capabilities.find((item) => item.id === selection.id);
      return `${definition?.label ?? selection.id}（${modeLabel(selection.mode)}）`;
    });
  const expertLabels = config.experts.map((selection) => {
    const expert = pack.experts.find((item) => item.id === selection.id);
    return expert?.label ?? selection.id;
  });

  return `$当前已装载【${pack.label}·${identity?.label ?? config.identity.id}辅助系统】；启用${activeCapabilities.join("、") || "基础证据规则"}，专家认知镜头：${expertLabels.join("、") || "无固定镜头"}。所有分析受当前身份权限约束，不凭空获得隐藏事实，最终裁决由宿主完成。`;
}

export function generateCanonicalCompactPrompt(
  config: CanonicalForgeConfig,
  pack: CanonicalWorldPack
): string {
  const identity = pack.identities.find((item) => item.id === config.identity.id);
  const profile = identity?.permissionProfile;

  const capabilityLines = config.capabilities
    .filter((selection) => selection.mode !== "disabled")
    .map((selection) => {
      const definition = pack.capabilities.find((item) => item.id === selection.id);
      return `- ${definition?.label ?? selection.id} [${modeLabel(selection.mode)}]：${definition?.description ?? "使用通用 Core 契约。"}`;
    });

  const expertLines = config.experts.map((selection) => {
    const expert = pack.experts.find((item) => item.id === selection.id);
    const caution = expert?.caution ? `；注意：${expert.caution}` : "";
    return `- ${expert?.label ?? selection.id} [${selection.weight === "primary" ? "主镜头" : "辅镜头"}]：${expert?.strengths.join("；") ?? "按已注册专家契约使用"}${caution}`;
  });

  const permissionLines = profile ? [
    `可观察：${profile.observe.join("；") || "无额外声明"}`,
    `可接触：${profile.access.join("；") || "无额外声明"}`,
    `可请求：${profile.request.join("；") || "无额外声明"}`,
    `可命令：${profile.command.join("；") || "无"}`,
    `可调配：${profile.allocate.join("；") || "无"}`,
    `公开表达：${profile.publish.join("；") || "无额外声明"}`,
    `隐蔽行动：${profile.conceal.join("；") || "无"}`,
    `主要风险：${profile.risks.join("；") || "按当前情境判断"}`
  ] : ["权限档案缺失：不得自行补齐权限，应停止越权行动建议。"];

  const patchLines = [
    ...(config.sessionPatch.facts.length ? ["已接受事实：", ...config.sessionPatch.facts.map((item) => `- ${item}`)] : []),
    ...(config.sessionPatch.claims.length ? ["待核说法：", ...config.sessionPatch.claims.map((item) => `- ${item}`)] : []),
    ...(config.sessionPatch.notes ? ["其他本局说明：", config.sessionPatch.notes] : [])
  ];

  return [
    "【RP Module Forge｜V0.1 Canonical Runtime】",
    `世界适配：${pack.label} (${pack.id}@${pack.version})`,
    `宿主身份：${identity?.label ?? config.identity.id}`,
    `权限档案：${config.identity.permissionProfile}`,
    identity?.summary ? `身份摘要：${identity.summary}` : "",
    "",
    "【身份权限】",
    ...permissionLines,
    "",
    "【能力系统】",
    ...(capabilityLines.length ? capabilityLines : ["- 未启用可选能力；仍必须遵守全局证据与权限规则。"]),
    "",
    "【专家认知镜头】",
    ...(expertLines.length ? expertLines : ["- 无固定专家镜头。"]),
    "",
    "【Traveler Forum】",
    `状态：${config.travelerForum.enabled ? "开启" : "关闭"}`,
    `注入策略：${config.travelerForum.autoInject}`,
    `最低可靠度：${config.travelerForum.minimumReliability}`,
    `显示原帖链接：${config.travelerForum.showThreadLinks ? "是" : "否"}`,
    "",
    "【运行规则】",
    `Token 模式：${config.runtime.tokenMode}`,
    `激活策略：${config.runtime.activationPolicy}`,
    `显示证据状态：${config.runtime.showEvidenceState ? "是" : "否"}`,
    "1. omniscience = false：不得凭空知道当前世界隐藏事实。",
    "2. 先区分事实、据称、推断、假设与未知，再进行分析。",
    "3. 任何取证或行动建议都必须先经过身份权限检查。",
    "4. 专家只是认知镜头，不接管宿主人格或决定。",
    "5. Traveler Forum 经验不得覆盖当前世界证据。",
    "6. hostFinalDecision = true：最终重大决定始终由宿主作出。",
    "7. 本局补丁不能削弱以上不变量。",
    ...(patchLines.length ? ["", "【本局补丁】", ...patchLines] : [])
  ].filter(Boolean).join("\n");
}

export function generateCanonicalManifest(config: CanonicalForgeConfig): string {
  return JSON.stringify(config, null, 2);
}
