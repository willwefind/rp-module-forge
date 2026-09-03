import "./style.css";
import {
  generateCanonicalCompactPrompt,
  generateCanonicalManifest,
  generateCanonicalOneLiner,
  type CanonicalForgeConfig,
  type CapabilityMode,
  type ExpertWeight,
  type ForumInjectionPolicy,
  type ForumReliability,
  type TokenMode
} from "@rpmf/core";
import { ancientChinaPackV01 } from "@rpmf/pack-ancient-china";

const pack = ancientChinaPackV01;
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
        <h2>5. Traveler Forum</h2>
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

      <section class="card span-2">
        <h2>6. 本局补丁</h2>
        <textarea id="sessionPatch" placeholder="例如：本局采用虚构王朝；宿主已知北疆战事；某项制度与常见历史默认不同……"></textarea>
        <p class="muted">这里暂存自由说明。结构化 facts / claims 编辑器会在后续 M1/M2 继续补齐。</p>
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
const capabilitiesEl = document.querySelector<HTMLDivElement>("#capabilities")!;
const expertsEl = document.querySelector<HTMLDivElement>("#experts")!;
const tokenMode = document.querySelector<HTMLSelectElement>("#tokenMode")!;
const showEvidenceState = document.querySelector<HTMLInputElement>("#showEvidenceState")!;
const forumEnabled = document.querySelector<HTMLInputElement>("#forumEnabled")!;
const forumPolicy = document.querySelector<HTMLSelectElement>("#forumPolicy")!;
const forumReliability = document.querySelector<HTMLSelectElement>("#forumReliability")!;
const showThreadLinks = document.querySelector<HTMLInputElement>("#showThreadLinks")!;
const sessionPatch = document.querySelector<HTMLTextAreaElement>("#sessionPatch")!;
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

function renderCompact() {
  output.textContent = generateCanonicalCompactPrompt(config(), pack);
}

identitySelect.addEventListener("change", () => {
  applyRecommendations();
  renderCompact();
});
document.querySelector("#auto")!.addEventListener("click", () => {
  applyRecommendations();
  renderCompact();
});
document.querySelector("#oneLine")!.addEventListener("click", () => {
  output.textContent = generateCanonicalOneLiner(config(), pack);
});
document.querySelector("#compact")!.addEventListener("click", renderCompact);
document.querySelector("#manifest")!.addEventListener("click", () => {
  output.textContent = generateCanonicalManifest(config());
});

applyRecommendations();
renderCompact();
