import type {
  CanonicalForgeConfig,
  CanonicalWorldPack,
  CapabilityMode,
  ForgeConfig,
  WorldPack
} from "./types.js";
import { resolveCapabilityFacet, resolveIdentityPlaybook } from "./identityPlaybooks.js";
import { resolveAgenda } from "./agendaRoutes.js";

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
  const resolvedPlaybook = resolveIdentityPlaybook(pack, config.identity.id);
  const identity = resolvedPlaybook?.identity ?? pack.identities.find((item) => item.id === config.identity.id);
  const playbook = resolvedPlaybook?.playbook;
  const agenda = resolveAgenda(pack, config.agenda?.routeId);
  const activeCapabilities = config.capabilities
    .filter((selection) => selection.mode !== "disabled")
    .map((selection) => {
      const definition = pack.capabilities.find((item) => item.id === selection.id);
      const facet = resolveCapabilityFacet(pack, config.identity.id, selection.id);
      return `${facet?.label ?? definition?.label ?? selection.id}（${modeLabel(selection.mode)}）`;
    });
  const expertLabels = config.experts.map((selection) => {
    const expert = pack.experts.find((item) => item.id === selection.id);
    return expert?.label ?? selection.id;
  });
  const routeLabel = agenda?.label ?? config.agenda?.customGoal ?? "未指定长期路线";

  return `$当前已装载【${pack.label}·${identity?.label ?? config.identity.id}辅助系统${playbook ? `｜${playbook.label}` : ""}】；发展路线：${routeLabel}；启用${activeCapabilities.join("、") || "基础证据规则"}，专家认知镜头：${expertLabels.join("、") || "无固定镜头"}。路线描述想去哪里，不改变当前身份权限；系统不凭空获得隐藏事实，最终裁决由宿主完成。`;
}

export function generateCanonicalCompactPrompt(
  config: CanonicalForgeConfig,
  pack: CanonicalWorldPack
): string {
  const resolvedPlaybook = resolveIdentityPlaybook(pack, config.identity.id);
  const identity = resolvedPlaybook?.identity ?? pack.identities.find((item) => item.id === config.identity.id);
  const playbook = resolvedPlaybook?.playbook;
  const agenda = resolveAgenda(pack, config.agenda?.routeId);
  const profile = identity?.permissionProfile;

  const capabilityLines = config.capabilities
    .filter((selection) => selection.mode !== "disabled")
    .map((selection) => {
      const definition = pack.capabilities.find((item) => item.id === selection.id);
      const facet = resolveCapabilityFacet(pack, config.identity.id, selection.id);
      const label = facet?.label ?? definition?.label ?? selection.id;
      const description = facet?.description ?? definition?.description ?? "使用通用 Core 契约。";
      const lineage = facet && definition && facet.label !== definition.label ? `（Core呈现谱系：${definition.label}）` : "";
      return `- ${label} [${modeLabel(selection.mode)}]${lineage}：${description}`;
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

  const agendaLines = agenda ? [
    `路线：${agenda.label}`,
    `路线说明：${agenda.summary}`,
    ...(config.agenda?.customGoal ? [`宿主补充目标：${config.agenda.customGoal}`] : []),
    ...(agenda.focusQuestions.length ? ["路线焦点：", ...agenda.focusQuestions.map((item) => `- ${item}`)] : []),
    ...(agenda.caution ? [`路线边界：${agenda.caution}`] : [])
  ] : config.agenda?.customGoal
    ? [`自定义目标：${config.agenda.customGoal}`]
    : ["路线：未指定；不要替宿主假设长期人生目标。"];

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
    playbook ? `身份处境方案：${playbook.label}` : "",
    playbook?.summary ? `处境重点：${playbook.summary}` : "",
    "",
    "【人生志向 / 发展路线】",
    ...agendaLines,
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
    "3. 任何取证或行动建议都必须先经过当前身份权限检查。",
    "4. 身份处境方案只改变默认组合、问题尺度与呈现，不授予任何权限。",
    "5. 人生路线描述宿主想去哪里；它不能预支未来身份、职位、资源或权力。",
    "6. 专家只是认知镜头；专家推荐随路线和事件变化，不接管宿主人格或决定。",
    "7. Traveler Forum 经验不得覆盖当前世界证据。",
    "8. hostFinalDecision = true：最终重大决定始终由宿主作出。",
    "9. 本局补丁不能削弱以上不变量。",
    ...(patchLines.length ? ["", "【本局补丁】", ...patchLines] : [])
  ].filter(Boolean).join("\n");
}

export function generateCanonicalManifest(config: CanonicalForgeConfig): string {
  return JSON.stringify(config, null, 2);
}
