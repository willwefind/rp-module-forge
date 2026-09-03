import "./style.css";
import { generateCompactPrompt, generateManifest, generateOneLiner, type ForgeConfig } from "@rpmf/core";
import { ancientChinaPack } from "@rpmf/pack-ancient-china";

const pack = ancientChinaPack;
const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="shell">
    <section class="hero">
      <div class="muted">Public V0 · Ancient China Pack</div>
      <h1>RP Module Forge</h1>
      <p>给 AIRP / 文本 RP 装配可移植的角色辅助系统。身份决定权限，能力模块决定能做什么，专家包决定用什么视角思考。</p>
    </section>
    <div class="grid">
      <section class="card">
        <h2>1. 宿主身份</h2>
        <select id="role"></select>
        <p id="roleSummary" class="muted"></p>
      </section>
      <section class="card">
        <h2>2. 能力模块</h2>
        <div id="modules" class="checks"></div>
      </section>
      <section class="card">
        <h2>3. 专家认知包</h2>
        <div id="experts" class="checks"></div>
      </section>
      <section class="card">
        <h2>4. 本局补丁</h2>
        <textarea id="sessionPatch" placeholder="例如：大晟末代皇帝；宿主现代法学与金融背景；北疆战事……"></textarea>
        <label class="check" style="margin-top:10px">
          <input id="legacyNotes" type="checkbox" checked />
          <span>启用历代穿越者血泪批注</span>
        </label>
      </section>
    </div>
    <div class="actions">
      <button class="primary" id="auto">按身份自动适配</button>
      <button id="oneLine">一句话版</button>
      <button id="compact">简版 Prompt</button>
      <button id="manifest">Manifest</button>
    </div>
    <section class="card">
      <h2>输出预览</h2>
      <div id="output" class="output"></div>
    </section>
  </div>
`;

const roleSelect = document.querySelector<HTMLSelectElement>("#role")!;
const roleSummary = document.querySelector<HTMLParagraphElement>("#roleSummary")!;
const modulesEl = document.querySelector<HTMLDivElement>("#modules")!;
const expertsEl = document.querySelector<HTMLDivElement>("#experts")!;
const sessionPatch = document.querySelector<HTMLTextAreaElement>("#sessionPatch")!;
const legacyNotes = document.querySelector<HTMLInputElement>("#legacyNotes")!;
const output = document.querySelector<HTMLDivElement>("#output")!;

for (const role of pack.roles) {
  const option = document.createElement("option");
  option.value = role.id;
  option.textContent = role.label;
  roleSelect.append(option);
}

function addCheck(container: HTMLElement, id: string, label: string, description?: string) {
  const wrapper = document.createElement("label");
  wrapper.className = "check";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.value = id;
  const text = document.createElement("span");
  text.innerHTML = `<strong>${label}</strong>${description ? `<div class="muted">${description}</div>` : ""}`;
  wrapper.append(input, text);
  container.append(wrapper);
}

for (const module of pack.modules) addCheck(modulesEl, module.id, module.label, module.description);
for (const expert of pack.experts) addCheck(expertsEl, expert.id, expert.label, expert.strengths.join(" · "));

function selected(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')].map(x => x.value);
}

function applyRecommendations() {
  const role = pack.roles.find(x => x.id === roleSelect.value)!;
  modulesEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(x => {
    x.checked = role.recommendedModules.includes(x.value);
  });
  expertsEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(x => {
    x.checked = role.recommendedExperts.includes(x.value);
  });
  roleSummary.textContent = `${role.permissionSummary}｜主要风险：${role.risks.join("、")}`;
}

function config(): ForgeConfig {
  return {
    schemaVersion: 1,
    worldPack: pack.id,
    role: roleSelect.value,
    modules: selected(modulesEl),
    experts: selected(expertsEl),
    legacyNotes: legacyNotes.checked,
    omniscience: false,
    hostFinalDecision: true,
    sessionPatch: sessionPatch.value.trim()
  };
}

roleSelect.addEventListener("change", applyRecommendations);
document.querySelector("#auto")!.addEventListener("click", applyRecommendations);
document.querySelector("#oneLine")!.addEventListener("click", () => output.textContent = generateOneLiner(config(), pack));
document.querySelector("#compact")!.addEventListener("click", () => output.textContent = generateCompactPrompt(config(), pack));
document.querySelector("#manifest")!.addEventListener("click", () => output.textContent = generateManifest(config()));

applyRecommendations();
output.textContent = generateCompactPrompt(config(), pack);
