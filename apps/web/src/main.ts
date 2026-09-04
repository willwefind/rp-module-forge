import "./style.css";
import {
  generateCanonicalCompactPrompt,
  generateCanonicalManifest,
  generateCanonicalOneLiner,
  normalizeCanonicalConfig,
  resolveAgendaAssembly,
  resolveAgendaForIdentity,
  resolveCapabilityFacet,
  resolveIdentityPlaybook,
  retrieveCuratedForumNotes,
  type CanonicalForgeConfig,
  type CapabilityMode,
  type CoreCapabilityId,
  type ExpertWeight,
  type ForumInjectionPolicy,
  type ForumReliability,
  type TokenMode
} from "@rpmf/core";
import { ancientChinaForumData } from "@rpmf/pack-ancient-china";
import { ancientChinaPackV01 } from "@rpmf/pack-ancient-china/canonical";
import { maintainerLoreEntries, type MaintainerLoreEntry } from "./maintainerLog";
import {
  UI_LOCALE,
  boardLabels,
  formatNormalizationIssue,
  forumPolicyLabels,
  localizeBoard,
  localizeTravelerId,
  postTypeLabels,
  provenanceLabels,
  reliabilityLabels,
  tokenModeLabels
} from "./locales/zh-CN";

const pack = ancientChinaPackV01;
const forumData = ancientChinaForumData;
const app = document.querySelector<HTMLDivElement>("#app")!;

document.documentElement.lang = UI_LOCALE;
document.title = "RP Module Forge｜简体中文预览";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.innerHTML = `
  <div class="shell">
    <section class="hero">
      <div class="muted">公开预览 V0.1 · ${pack.label} · 当前界面语言：简体中文</div>
      <h1>RP Module Forge</h1>
      <p><a href="${import.meta.env.BASE_URL}prototypes/forum-first-concept-v3.html">🏮 返回天道降维互助论坛 · V3 试玩版</a></p>
      <p>给文字角色扮演装配可移植的角色辅助系统。身份回答“你现在是谁、能做什么”，发展路线回答“你想往哪里走”；同一个开局，也可以拥有完全不同的人生。</p>
    </section>

    <div class="grid">
      <section class="card">
        <h2>1. 宿主身份、处境与权限</h2>
        <select id="identity"></select>
        <p id="identitySummary" class="muted"></p>
        <div id="playbookPreview" class="invariant-note"></div>
        <div id="permissionPreview" class="invariant-note"></div>
        <p class="muted">底层律例始终存在：旧出生版的“礼法身份”已经进入不可关闭的身份权限层；“情报拼图”已经进入不可关闭的证据状态与不全知规则。</p>
      </section>

      <section class="card">
        <h2>2. 人生志向 / 发展路线</h2>
        <label>
          <span class="muted">当前想往哪里走</span>
          <select id="agenda"></select>
        </label>
        <label>
          <span class="muted">路线补充目标（可选）</span>
          <textarea id="agendaGoal" placeholder="例如：不是想做权臣，只想攒够钱带妹妹离开主家；或者想当一个只画猫不入仕的画家……"></textarea>
        </label>
        <div id="agendaPreview" class="invariant-note"></div>
        <p class="muted">路线可以很远：奴婢可以想称帝，皇帝也可以想归隐。路线会按当前身份重新解释，但只改变长期关注点、默认能力与专家镜头，不预支未来权限。</p>
      </section>

      <section class="card">
        <h2>3. 运行设置</h2>
        <label>
          <span class="muted">信息密度</span>
          <select id="tokenMode">
            <option value="light">${tokenModeLabels.light}</option>
            <option value="standard" selected>${tokenModeLabels.standard}</option>
            <option value="full">${tokenModeLabels.full}</option>
          </select>
        </label>
        <label class="inline-toggle">
          <input id="showEvidenceState" type="checkbox" checked />
          <span>显示证据状态</span>
        </label>
        <div class="invariant-note">固定规则：禁止全知 · 宿主保留最终裁决权 · 任何行动先检查当前身份权限</div>
      </section>

      <section class="card">
        <h2>4. 老乡论坛运行设置</h2>
        <label class="inline-toggle">
          <input id="forumEnabled" type="checkbox" checked />
          <span>启用天道降维互助论坛</span>
        </label>
        <label>
          <span class="muted">自动注入策略</span>
          <select id="forumPolicy">
            <option value="off">${forumPolicyLabels.off}</option>
            <option value="curated-only" selected>${forumPolicyLabels["curated-only"]}</option>
            <option value="curated-plus-links">${forumPolicyLabels["curated-plus-links"]}</option>
            <option value="manual">${forumPolicyLabels.manual}</option>
          </select>
        </label>
        <label>
          <span class="muted">最低可靠度</span>
          <select id="forumReliability">
            <option value="plausible">${reliabilityLabels.plausible}</option>
            <option value="contested">${reliabilityLabels.contested}</option>
            <option value="corroborated" selected>${reliabilityLabels.corroborated}</option>
          </select>
        </label>
        <label class="inline-toggle">
          <input id="showThreadLinks" type="checkbox" checked />
          <span>显示来源帖链接</span>
        </label>
      </section>

      <section class="card span-2">
        <h2>5. 能力系统</h2>
        <p class="muted">底层仍是同一批稳定核心能力。身份处境方案决定“在你现在的位置，这把工具怎么用”；发展路线只覆盖默认组合，不给角色凭空加官、加钱或加权限。</p>
        <div id="capabilities" class="settings-list"></div>
      </section>

      <section class="card span-2">
        <h2>6. 专家认知镜头</h2>
        <p class="muted">专家不和身份焊死：当前处境提供基线，长期路线决定主要镜头，未来遇到具体事件时还可以临时召唤别的专家。</p>
        <div id="experts" class="settings-list"></div>
      </section>

      <section class="card span-2 forum-shell">
        <div class="forum-heading">
          <div>
            <div class="muted">7. 天道降维互助论坛</div>
            <h2>老乡们真的留下过东西</h2>
          </div>
          <div class="forum-stats">${forumData.threads.length} 原帖 · ${forumData.replies.length} 回复 · ${forumData.curatedNotes.length} 条老乡经验库</div>
        </div>
        <p class="muted">这里展示的是仓库里真实存在的创世数据，不是角色扮演时由模型临场伪造的“历史帖子”。原帖可以有偏见、争吵和馊主意；只有通过审核、可靠度与适用性筛选的老乡经验库条目，才有资格进入运行时辅助。</p>
        <div class="forum-grid">
          <div>
            <div class="forum-subhead">当前身份可读原帖</div>
            <div id="forumThreads" class="forum-list"></div>
          </div>
          <div>
            <div class="forum-subhead">当前装配可检索的【老乡经验库】</div>
            <div class="muted forum-help">这是检索候选预览。发展路线目前还没有进入论坛适用性筛选；现阶段仍按身份、能力与可靠度匹配。</div>
            <div id="forumCurated" class="forum-list"></div>
          </div>
        </div>
      </section>

      <section class="card span-2 maintainer-shell">
        <div class="forum-heading">
          <div>
            <div class="muted">8. 穿越者老乡维护组</div>
            <h2>我们一路是怎么把祖传问题修掉的</h2>
          </div>
          <div class="forum-stats">${maintainerLoreEntries.length} 条公开维护记录</div>
        </div>
        <p class="muted">这里只同步展示维护日志的中文版故事层。普通工程事实、验证记录和迁移说明仍以仓库里的完整维护日志为准。</p>
        <div id="maintainerLog" class="maintainer-log"></div>
        <a class="text-link" href="https://github.com/willwefind/rp-module-forge/blob/main/docs/MAINTAINER_LOG.md" target="_blank" rel="noreferrer">查看完整维护日志与工程记录 ↗</a>
      </section>

      <section class="card span-2">
        <h2>9. 本局补充</h2>
        <textarea id="sessionPatch" placeholder="例如：本局采用虚构王朝；宿主已知北疆战事；某项制度与常见历史默认不同……"></textarea>
        <p class="muted">这里暂存自由说明。结构化的“已知事实 / 待核说法”编辑器会在后续继续补齐。</p>
      </section>

      <section class="card span-2">
        <h2>10. 规范配置校验</h2>
        <div id="normalizationStatus" class="invariant-note"></div>
        <p class="muted">所有导出都会先经过核心规范化检查。机器配置继续使用稳定、语言中立的字段；普通产品界面不直接暴露这些内部标识。</p>
      </section>
    </div>

    <div class="actions">
      <button class="primary" id="auto">按身份 + 路线恢复推荐</button>
      <button id="oneLine">一句话版</button>
      <button id="compact">简版提示词</button>
      <button id="manifest">规范配置清单（JSON）</button>
    </div>

    <section class="card">
      <h2>输出预览</h2>
      <div id="output" class="output"></div>
    </section>
  </div>
`;

const identitySelect = document.querySelector<HTMLSelectElement>("#identity")!;
const identitySummary = document.querySelector<HTMLParagraphElement>("#identitySummary")!;
const playbookPreview = document.querySelector<HTMLDivElement>("#playbookPreview")!;
const permissionPreview = document.querySelector<HTMLDivElement>("#permissionPreview")!;
const agendaSelect = document.querySelector<HTMLSelectElement>("#agenda")!;
const agendaGoal = document.querySelector<HTMLTextAreaElement>("#agendaGoal")!;
const agendaPreview = document.querySelector<HTMLDivElement>("#agendaPreview")!;
const capabilitiesEl = document.querySelector<HTMLDivElement>("#capabilities")!;
const expertsEl = document.querySelector<HTMLDivElement>("#experts")!;
const tokenMode = document.querySelector<HTMLSelectElement>("#tokenMode")!;
const showEvidenceState = document.querySelector<HTMLInputElement>("#showEvidenceState")!;
const forumEnabled = document.querySelector<HTMLInputElement>("#forumEnabled")!;
const forumPolicy = document.querySelector<HTMLSelectElement>("#forumPolicy")!;
const forumReliability = document.querySelector<HTMLSelectElement>("#forumReliability")!;
const showThreadLinks = document.querySelector<HTMLInputElement>("#showThreadLinks")!;
const forumThreads = document.querySelector<HTMLDivElement>("#forumThreads")!;
const forumCurated = document.querySelector<HTMLDivElement>("#forumCurated")!;
const maintainerLog = document.querySelector<HTMLDivElement>("#maintainerLog")!;
const sessionPatch = document.querySelector<HTMLTextAreaElement>("#sessionPatch")!;
const normalizationStatus = document.querySelector<HTMLDivElement>("#normalizationStatus")!;
const output = document.querySelector<HTMLDivElement>("#output")!;

for (const identity of pack.identities) {
  const option = document.createElement("option");
  option.value = identity.id;
  option.textContent = identity.label;
  identitySelect.append(option);
}

for (const agenda of pack.agendas ?? []) {
  const option = document.createElement("option");
  option.value = agenda.id;
  option.textContent = agenda.label;
  agendaSelect.append(option);
}
agendaSelect.value = "open-road";

for (const capability of pack.capabilities) {
  const row = document.createElement("div");
  row.className = "setting-row";
  row.dataset.capabilityRow = capability.id;

  const copy = document.createElement("div");
  copy.className = "setting-copy";
  copy.innerHTML = `<strong data-capability-label>${capability.label}</strong><div class="muted" data-capability-description>${capability.description}</div><div class="muted" data-capability-lineage></div>`;

  const select = document.createElement("select");
  select.dataset.capability = capability.id;
  select.className = "mode-select";
  select.innerHTML = `
    <option value="disabled">关闭</option>
    <option value="resident">常驻</option>
    <option value="on-demand">按需</option>
  `;

  row.append(copy, select);
  capabilitiesEl.append(row);
}

for (const expert of pack.experts) {
  const row = document.createElement("div");
  row.className = "setting-row";
  row.dataset.expertRow = expert.id;

  const copy = document.createElement("div");
  copy.className = "setting-copy";
  copy.innerHTML = `<strong>${expert.label}</strong><div class="muted">${expert.strengths.join(" · ")}${expert.caution ? `｜注意：${expert.caution}` : ""}</div><div class="muted" data-expert-route></div>`;

  const select = document.createElement("select");
  select.dataset.expert = expert.id;
  select.className = "mode-select";
  select.innerHTML = `
    <option value="off">关闭</option>
    <option value="primary">主镜头</option>
    <option value="secondary">辅镜头</option>
  `;

  row.append(copy, select);
  expertsEl.append(row);
}

function capabilitySelects() {
  return [...capabilitiesEl.querySelectorAll<HTMLSelectElement>("select[data-capability]")];
}

function expertSelects() {
  return [...expertsEl.querySelectorAll<HTMLSelectElement>("select[data-expert]")];
}

function selectedIdentity() {
  return pack.identities.find((item) => item.id === identitySelect.value)!;
}

function selectedPlaybook() {
  return resolveIdentityPlaybook(pack, identitySelect.value)?.playbook ?? null;
}

function selectedAgenda() {
  return resolveAgendaForIdentity(pack, identitySelect.value, agendaSelect.value);
}

function enabledCapabilityIds(): CoreCapabilityId[] {
  return capabilitySelects()
    .filter((select) => select.value !== "disabled")
    .map((select) => select.dataset.capability as CoreCapabilityId);
}

function renderIdentityAndCapabilityPresentation() {
  const identity = selectedIdentity();
  const playbook = selectedPlaybook();

  playbookPreview.textContent = playbook
    ? `身份处境方案｜${playbook.label}：${playbook.summary}`
    : "当前世界包没有提供专用身份处境方案，将使用基础能力说明。";

  const risks = identity.permissionProfile.risks.join("、") || "按当前情境判断";
  identitySummary.textContent = `${identity.summary}｜主要风险：${risks}`;

  const access = identity.permissionProfile.access.length
    ? identity.permissionProfile.access.join("；")
    : "无普通接触权限";
  const command = identity.permissionProfile.command.length
    ? identity.permissionProfile.command.join("；")
    : "无普通命令权";
  permissionPreview.textContent = `权限边界｜可接触：${access}｜可命令：${command}｜身份处境方案、发展路线与能力启用都不会扩张这些边界。`;

  for (const capability of pack.capabilities) {
    const row = capabilitiesEl.querySelector<HTMLDivElement>(`[data-capability-row="${capability.id}"]`)!;
    const label = row.querySelector<HTMLElement>("[data-capability-label]")!;
    const description = row.querySelector<HTMLElement>("[data-capability-description]")!;
    const lineage = row.querySelector<HTMLElement>("[data-capability-lineage]")!;
    const facet = resolveCapabilityFacet(pack, identity.id, capability.id);

    label.textContent = facet?.label ?? capability.label;
    description.textContent = facet?.description ?? capability.description;
    lineage.textContent = facet
      ? `同源核心能力：${capability.label}｜处境问题：${facet.questions.slice(0, 2).join(" / ")}`
      : "使用当前世界包的基础能力说明。";
  }
}

function renderAgenda() {
  const identity = selectedIdentity();
  const agenda = selectedAgenda();

  for (const option of [...agendaSelect.options]) {
    const baseDefinition = pack.agendas?.find((item) => item.id === option.value);
    if (!baseDefinition) continue;
    const scaledDefinition = resolveAgendaForIdentity(pack, identity.id, baseDefinition.id) ?? baseDefinition;
    const hinted = baseDefinition.suggestedStartingIdentities.includes(identity.id);
    option.textContent = `${scaledDefinition.label}${hinted ? " · 此身份常见" : ""}`;
  }

  agendaPreview.textContent = agenda
    ? `路线｜${agenda.label}：${agenda.summary}${agenda.caution ? `｜边界：${agenda.caution}` : ""}｜焦点：${agenda.focusQuestions.slice(0, 2).join(" / ")}`
    : "当前路线未注册；系统不会擅自替宿主推断长期目标。";

  const routeExpertWeights = new Map((agenda?.expertOverlay ?? []).map((item) => [item.id, item.weight]));
  for (const expert of pack.experts) {
    const row = expertsEl.querySelector<HTMLDivElement>(`[data-expert-row="${expert.id}"]`)!;
    const hint = row.querySelector<HTMLElement>("[data-expert-route]")!;
    const weight = routeExpertWeights.get(expert.id);
    hint.textContent = weight
      ? `当前身份 × 路线推荐：${weight === "primary" ? "主镜头" : "辅镜头"}`
      : "";
  }
}

function applyRecommendations() {
  const identity = selectedIdentity();
  const assembly = resolveAgendaAssembly(pack, identity.id, agendaSelect.value);
  const capabilityDefaults = assembly?.capabilities ?? selectedPlaybook()?.capabilityDefaults ?? identity.recommendedCapabilities;
  const expertDefaults = assembly?.experts ?? selectedPlaybook()?.expertDefaults ?? identity.recommendedExperts;

  for (const select of capabilitySelects()) select.value = "disabled";
  for (const recommendation of capabilityDefaults) {
    const select = capabilitySelects().find((item) => item.dataset.capability === recommendation.id);
    if (select) select.value = recommendation.mode;
  }

  for (const select of expertSelects()) select.value = "off";
  for (const recommendation of expertDefaults) {
    const select = expertSelects().find((item) => item.dataset.expert === recommendation.id);
    if (select) select.value = recommendation.weight;
  }

  renderIdentityAndCapabilityPresentation();
  renderAgenda();
}

function config(): CanonicalForgeConfig {
  const identity = selectedIdentity();
  const enabledForum = forumEnabled.checked;
  const customGoal = agendaGoal.value.trim();

  return {
    schemaVersion: 1,
    worldPack: { id: pack.id, version: pack.version },
    identity: {
      id: identity.id,
      permissionProfile: identity.permissionProfile.id
    },
    agenda: {
      routeId: agendaSelect.value,
      ...(customGoal ? { customGoal } : {})
    },
    capabilities: capabilitySelects().map((select) => ({
      id: select.dataset.capability as CanonicalForgeConfig["capabilities"][number]["id"],
      mode: select.value as CapabilityMode
    })),
    experts: expertSelects()
      .filter((select) => select.value !== "off")
      .map((select) => ({
        id: select.dataset.expert!,
        weight: select.value as ExpertWeight
      })),
    travelerForum: {
      enabled: enabledForum,
      autoInject: (enabledForum ? forumPolicy.value : "off") as ForumInjectionPolicy,
      showThreadLinks: enabledForum && showThreadLinks.checked,
      minimumReliability: forumReliability.value as ForumReliability
    },
    runtime: {
      tokenMode: tokenMode.value as TokenMode,
      activationPolicy: "event-driven",
      showEvidenceState: showEvidenceState.checked,
      hostFinalDecision: true,
      omniscience: false
    },
    sessionPatch: {
      facts: [],
      claims: [],
      notes: sessionPatch.value.trim()
    }
  };
}

function normalizedConfig(): CanonicalForgeConfig | null {
  const result = normalizeCanonicalConfig(config(), pack);
  if (!result.config) {
    normalizationStatus.textContent = `✕ 规范配置校验失败｜${result.errors.map(formatNormalizationIssue).join("｜")}`;
    return null;
  }

  normalizationStatus.textContent = result.warnings.length
    ? `✓ 配置可安全规范化；${result.warnings.map(formatNormalizationIssue).join("｜")}`
    : "✓ 规范配置已通过校验；身份、路线、权限档案与固定运行规则一致，发展路线不会预支未来权限。";
  return result.config;
}

function renderForum() {
  const identity = selectedIdentity();
  const visibleThreads = forumData.threads
    .filter((thread) => thread.appliesTo.identities.length === 0 || thread.appliesTo.identities.includes(identity.id))
    .filter((thread) => !["draft", "pending", "changes-requested", "rejected"].includes(thread.reviewStatus))
    .slice(0, 8);

  forumThreads.innerHTML = visibleThreads.length
    ? visibleThreads.map((thread) => {
        const replies = forumData.replies.filter((reply) => reply.threadId === thread.id).slice(0, 2);
        const archived = thread.reviewStatus === "superseded" || thread.reliability === "deprecated";
        return `
          <article class="forum-post ${archived ? "is-archived" : ""}">
            <div class="forum-meta">
              <span class="badge">${postTypeLabels[thread.postType] ?? "老乡帖"}</span>
              <span class="badge">${reliabilityLabels[thread.reliability]}</span>
              <span>${escapeHtml(localizeTravelerId(thread.author.travelerId))}</span>
              <span>${escapeHtml(localizeBoard(thread.board))}</span>
            </div>
            <h3>${escapeHtml(thread.title)}</h3>
            <p>${escapeHtml(thread.body)}</p>
            ${replies.length ? `<div class="reply-stack">${replies.map((reply) => `<div class="forum-reply"><strong>${escapeHtml(localizeTravelerId(reply.author.travelerId))}</strong>：${escapeHtml(reply.body)}</div>`).join("")}</div>` : ""}
            <div class="forum-origin">${archived ? "已封存 · " : ""}${provenanceLabels[thread.provenance.kind] ?? "来源已记录"}</div>
          </article>
        `;
      }).join("")
    : `<div class="forum-empty">这个身份暂时没有匹配的原帖。</div>`;

  if (!forumEnabled.checked) {
    forumCurated.innerHTML = `<div class="forum-empty">老乡论坛运行辅助已关闭。原帖仍可浏览，但不会产生自动检索候选。</div>`;
    return;
  }

  const retrieved = retrieveCuratedForumNotes(forumData.curatedNotes, {
    worldPack: pack.id,
    identity: identity.id,
    capabilities: enabledCapabilityIds(),
    minimumReliability: forumReliability.value as ForumReliability,
    maxNotes: 6
  });

  forumCurated.innerHTML = retrieved.length
    ? retrieved.map((note) => {
        const facet = resolveCapabilityFacet(pack, identity.id, note.capability);
        const definition = pack.capabilities.find((item) => item.id === note.capability);
        const capabilityLabel = facet?.label ?? definition?.label ?? "当前能力";
        return `
          <article class="curated-note">
            <div class="forum-meta">
              <span class="badge">${reliabilityLabels[note.reliability]}</span>
              <span class="badge">已审核可用于运行辅助</span>
              <span>${escapeHtml(capabilityLabel)}</span>
            </div>
            <p>${escapeHtml(note.lesson)}</p>
            ${note.conflictWith.length ? `<div class="conflict-note">⚖ 当前还有 ${note.conflictWith.length} 条已审核意见与此条存在已知冲突；运行时必须保留分歧。</div>` : ""}
            <div class="forum-origin">命中原因：当前身份匹配 · 已启用相关能力 · 可靠度达到设定门槛</div>
          </article>
        `;
      }).join("")
    : `<div class="forum-empty">当前身份、已启用能力与最低可靠度组合下，没有可自动检索的老乡经验库条目。可以切换能力或降低可靠度查看候选。</div>`;
}

function renderLoreEntry(entry: MaintainerLoreEntry): string {
  return `
    <article class="maintainer-entry">
      <div class="maintainer-index">第 ${entry.number} 次${entry.kind}</div>
      <h3>${escapeHtml(entry.title)}</h3>
      <div class="maintainer-date">${escapeHtml(entry.date)}</div>
      <div class="maintainer-lines">${entry.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
    </article>
  `;
}

function renderMaintainerLog() {
  const recent = maintainerLoreEntries.slice(0, 5);
  const older = maintainerLoreEntries.slice(5);

  maintainerLog.innerHTML = `
    <div class="maintainer-list">${recent.map(renderLoreEntry).join("")}</div>
    ${older.length ? `
      <details class="maintainer-older">
        <summary>展开更早的 ${older.length} 条维护记录</summary>
        <div class="maintainer-list">${older.map(renderLoreEntry).join("")}</div>
      </details>
    ` : ""}
  `;
}

function renderCompact() {
  const normalized = normalizedConfig();
  output.textContent = normalized
    ? generateCanonicalCompactPrompt(normalized, pack)
    : "当前装配未通过规范配置校验，已停止导出。";
}

function refreshForumAndPrompt() {
  renderForum();
  renderCompact();
}

identitySelect.addEventListener("change", () => {
  applyRecommendations();
  refreshForumAndPrompt();
});
agendaSelect.addEventListener("change", () => {
  applyRecommendations();
  refreshForumAndPrompt();
});
agendaGoal.addEventListener("input", renderCompact);
document.querySelector("#auto")!.addEventListener("click", () => {
  applyRecommendations();
  refreshForumAndPrompt();
});
for (const select of capabilitySelects()) select.addEventListener("change", refreshForumAndPrompt);
for (const select of expertSelects()) select.addEventListener("change", renderCompact);
tokenMode.addEventListener("change", renderCompact);
showEvidenceState.addEventListener("change", renderCompact);
forumEnabled.addEventListener("change", refreshForumAndPrompt);
forumReliability.addEventListener("change", refreshForumAndPrompt);
forumPolicy.addEventListener("change", renderCompact);
showThreadLinks.addEventListener("change", renderCompact);
sessionPatch.addEventListener("input", renderCompact);

document.querySelector("#oneLine")!.addEventListener("click", () => {
  const normalized = normalizedConfig();
  output.textContent = normalized
    ? generateCanonicalOneLiner(normalized, pack)
    : "当前装配未通过规范配置校验，已停止导出。";
});
document.querySelector("#compact")!.addEventListener("click", renderCompact);
document.querySelector("#manifest")!.addEventListener("click", () => {
  const normalized = normalizedConfig();
  output.textContent = normalized
    ? generateCanonicalManifest(normalized)
    : "当前装配未通过规范配置校验，已停止导出。";
});

applyRecommendations();
renderForum();
renderMaintainerLog();
renderCompact();
