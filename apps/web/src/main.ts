import "./style.css";
import {
  generateCanonicalCompactPrompt,
  generateCanonicalManifest,
  generateCanonicalOneLiner,
  normalizeCanonicalConfig,
  retrieveCuratedForumNotes,
  type CanonicalForgeConfig,
  type CapabilityMode,
  type CoreCapabilityId,
  type ExpertWeight,
  type ForumInjectionPolicy,
  type ForumReliability,
  type TokenMode
} from "@rpmf/core";
import { ancientChinaForumData, ancientChinaPackV01 } from "@rpmf/pack-ancient-china";

const pack = ancientChinaPackV01;
const forumData = ancientChinaForumData;
const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="shell">
    <section class="hero">
      <div class="muted">Public V0.1 · ${pack.label}</div>
      <h1>RP Module Forge</h1>
      <p>给 AIRP / 文本 RP 装配可移植的角色辅助系统。身份先决定权限边界，再选择通用能力、专家认知镜头与 Runtime 行为；古代名称只是 world pack 的呈现，不再充当数据身份证。</p>
    </section>

    <div class="grid">
      <section class="card">
        <h2>1. 宿主身份与权限</h2>
        <select id="identity"></select>
        <p id="identitySummary" class="muted"></p>
        <div id="permissionPreview" class="invariant-note"></div>
      </section>

      <section class="card">
        <h2>2. Runtime</h2>
        <label>
          <span class="muted">Token 模式</span>
          <select id="tokenMode">
            <option value="light">Light</option>
            <option value="standard" selected>Standard</option>
            <option value="full">Full</option>
          </select>
        </label>
        <label class="inline-toggle">
          <input id="showEvidenceState" type="checkbox" checked />
          <span>显示证据状态</span>
        </label>
        <div class="invariant-note">固定不变量：omniscience = false · hostFinalDecision = true</div>
      </section>

      <section class="card span-2">
        <h2>3. 能力系统</h2>
        <p class="muted">同一个 Core capability 可以在不同 world pack 中换名字；这里显示的是 Ancient China presentation。</p>
        <div id="capabilities" class="settings-list"></div>
      </section>

      <section class="card">
        <h2>4. 专家认知镜头</h2>
        <div id="experts" class="settings-list"></div>
      </section>

      <section class="card">
        <h2>5. Traveler Forum Runtime</h2>
        <label class="inline-toggle">
          <input id="forumEnabled" type="checkbox" checked />
          <span>启用天道降维互助论坛</span>
        </label>
        <label>
          <span class="muted">注入策略</span>
          <select id="forumPolicy">
            <option value="off">Off</option>
            <option value="curated-only" selected>Curated only</option>
            <option value="curated-plus-links">Curated + links</option>
            <option value="manual">Manual</option>
          </select>
        </label>
        <label>
          <span class="muted">最低可靠度</span>
          <select id="forumReliability">
            <option value="plausible">Plausible</option>
            <option value="contested">Contested</option>
            <option value="corroborated" selected>Corroborated</option>
          </select>
        </label>
        <label class="inline-toggle">
          <input id="showThreadLinks" type="checkbox" checked />
          <span>显示来源帖链接</span>
        </label>
      </section>

      <section class="card span-2 forum-shell">
        <div class="forum-heading">
          <div>
            <div class="muted">6. 天道降维互助论坛</div>
            <h2>老乡们真的留下过东西</h2>
          </div>
          <div class="forum-stats">${forumData.threads.length} 原帖 · ${forumData.replies.length} 回复 · ${forumData.curatedNotes.length} 遗言库条目</div>
        </div>
        <p class="muted">这里展示的是仓库中的真实 seed 数据，不是 AIRP 时由模型临场伪造的“历史帖子”。原帖可以有偏见、争吵和馊主意；只有右侧通过审核与适用性筛选的 curated notes 才有资格进入 Runtime。</p>
        <div class="forum-grid">
          <div>
            <div class="forum-subhead">当前身份可读原帖</div>
            <div id="forumThreads" class="forum-list"></div>
          </div>
          <div>
            <div class="forum-subhead">当前装配可检索的【老乡遗言库】</div>
            <div class="muted forum-help">这是检索候选预览，不代表没有事件触发时就自动塞进 Prompt。</div>
            <div id="forumCurated" class="forum-list"></div>
          </div>
        </div>
      </section>

      <section class="card span-2">
        <h2>7. 本局补丁</h2>
        <textarea id="sessionPatch" placeholder="例如：本局采用虚构王朝；宿主已知北疆战事；某项制度与常见历史默认不同……"></textarea>
        <p class="muted">这里暂存自由说明。结构化 facts / claims 编辑器会在后续 M1/M2 继续补齐。</p>
      </section>

      <section class="card span-2">
        <h2>8. Canonical 校验</h2>
        <div id="normalizationStatus" class="invariant-note"></div>
        <p class="muted">所有导出会先经过 Core normalizer：校验 world pack / identity / runtime 不变量，纠正 permission profile，去重并固定 capability / expert 顺序。能力选择本身不能扩张身份权限。</p>
      </section>
    </div>

    <div class="actions">
      <button class="primary" id="auto">按身份恢复推荐</button>
      <button id="oneLine">一句话版</button>
      <button id="compact">简版 Prompt</button>
      <button id="manifest">Canonical Manifest</button>
    </div>

    <section class="card">
      <h2>输出预览</h2>
      <div id="output" class="output"></div>
    </section>
  </div>
`;

const identitySelect = document.querySelector<HTMLSelectElement>("#identity")!;
const identitySummary = document.querySelector<HTMLParagraphElement>("#identitySummary")!;
const permissionPreview = document.querySelector<HTMLDivElement>("#permissionPreview")!;
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
const sessionPatch = document.querySelector<HTMLTextAreaElement>("#sessionPatch")!;
const normalizationStatus = document.querySelector<HTMLDivElement>("#normalizationStatus")!;
const output = document.querySelector<HTMLDivElement>("#output")!;

for (const identity of pack.identities) {
  const option = document.createElement("option");
  option.value = identity.id;
  option.textContent = identity.label;
  identitySelect.append(option);
}

for (const capability of pack.capabilities) {
  const row = document.createElement("div");
  row.className = "setting-row";

  const copy = document.createElement("div");
  copy.className = "setting-copy";
  copy.innerHTML = `<strong>${capability.label}</strong><code>${capability.id}</code><div class="muted">${capability.description}</div>`;

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

  const copy = document.createElement("div");
  copy.className = "setting-copy";
  copy.innerHTML = `<strong>${expert.label}</strong><code>${expert.id}</code><div class="muted">${expert.strengths.join(" · ")}${expert.caution ? `｜注意：${expert.caution}` : ""}</div>`;

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

function enabledCapabilityIds(): CoreCapabilityId[] {
  return capabilitySelects()
    .filter((select) => select.value !== "disabled")
    .map((select) => select.dataset.capability as CoreCapabilityId);
}

function applyRecommendations() {
  const identity = selectedIdentity();

  for (const select of capabilitySelects()) select.value = "disabled";
  for (const recommendation of identity.recommendedCapabilities) {
    const select = capabilitySelects().find((item) => item.dataset.capability === recommendation.id);
    if (select) select.value = recommendation.mode;
  }

  for (const select of expertSelects()) select.value = "off";
  for (const recommendation of identity.recommendedExperts) {
    const select = expertSelects().find((item) => item.dataset.expert === recommendation.id);
    if (select) select.value = recommendation.weight;
  }

  const risks = identity.permissionProfile.risks.join("、") || "按当前情境判断";
  identitySummary.textContent = `${identity.summary}｜权限档案：${identity.permissionProfile.id}｜主要风险：${risks}`;

  const access = identity.permissionProfile.access.length
    ? identity.permissionProfile.access.join("；")
    : "无普通访问权限";
  const command = identity.permissionProfile.command.length
    ? identity.permissionProfile.command.join("；")
    : "无普通命令权";
  permissionPreview.textContent = `权限门依据｜access：${access}｜command：${command}｜能力启用不会扩张这些边界。`;
}

function config(): CanonicalForgeConfig {
  const identity = selectedIdentity();
  const enabledForum = forumEnabled.checked;

  return {
    schemaVersion: 1,
    worldPack: { id: pack.id, version: pack.version },
    identity: {
      id: identity.id,
      permissionProfile: identity.permissionProfile.id
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
    normalizationStatus.textContent = `✕ Canonical 校验失败｜${result.errors.map((item) => `${item.path}: ${item.message}`).join("｜")}`;
    return null;
  }

  normalizationStatus.textContent = result.warnings.length
    ? `✓ 可规范化；${result.warnings.length} 条 warning｜${result.warnings.map((item) => item.message).join("｜")}`
    : "✓ Canonical config 已通过校验；world pack、identity、permission profile 与 runtime 不变量一致。";
  return result.config;
}

const postTypeLabels: Record<string, string> = {
  "verified-practice": "经验核验",
  "blood-and-tears": "血泪帖",
  "grudge-note": "记仇帖",
  "unverified-trick": "未核验偏方",
  question: "求助",
  correction: "勘误",
  "maintainer-argument": "维护组争论",
  "case-report": "案例回报"
};

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
              <span class="badge">${postTypeLabels[thread.postType] ?? thread.postType}</span>
              <span class="badge">${thread.reliability}</span>
              <span>${thread.author.travelerId}</span>
              <span>${thread.board}</span>
            </div>
            <h3>${thread.title}</h3>
            <p>${thread.body}</p>
            ${replies.length ? `<div class="reply-stack">${replies.map((reply) => `<div class="forum-reply"><strong>${reply.author.travelerId}</strong>：${reply.body}</div>`).join("")}</div>` : ""}
            <div class="forum-origin">${archived ? "已封存 · " : ""}provenance: ${thread.provenance.kind}</div>
          </article>
        `;
      }).join("")
    : `<div class="forum-empty">这个身份暂时没有匹配的原帖。</div>`;

  if (!forumEnabled.checked) {
    forumCurated.innerHTML = `<div class="forum-empty">Traveler Forum Runtime 已关闭。原帖仍可浏览，但不会产生 Runtime 检索候选。</div>`;
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
    ? retrieved.map((note) => `
        <article class="curated-note">
          <div class="forum-meta">
            <span class="badge">${note.reliability}</span>
            <span class="badge">approved-for-runtime</span>
            <span>${note.capability}</span>
          </div>
          <p>${note.lesson}</p>
          ${note.conflictWith.length ? `<div class="conflict-note">⚖ 与 ${note.conflictWith.join("、")} 存在已知冲突；Runtime 必须保留分歧。</div>` : ""}
          <div class="forum-origin">${note.reasonRetrieved}</div>
        </article>
      `).join("")
    : `<div class="forum-empty">当前身份、已启用能力与最低可靠度组合下，没有可自动检索的遗言库条目。可以切换能力或降低可靠度查看候选。</div>`;
}

function renderCompact() {
  const normalized = normalizedConfig();
  output.textContent = normalized
    ? generateCanonicalCompactPrompt(normalized, pack)
    : "当前装配未通过 Canonical 校验，已停止导出。";
}

function refreshForumAndPrompt() {
  renderForum();
  renderCompact();
}

identitySelect.addEventListener("change", () => {
  applyRecommendations();
  refreshForumAndPrompt();
});
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
    : "当前装配未通过 Canonical 校验，已停止导出。";
});
document.querySelector("#compact")!.addEventListener("click", renderCompact);
document.querySelector("#manifest")!.addEventListener("click", () => {
  const normalized = normalizedConfig();
  output.textContent = normalized
    ? generateCanonicalManifest(normalized)
    : "当前装配未通过 Canonical 校验，已停止导出。";
});

applyRecommendations();
renderForum();
renderCompact();
