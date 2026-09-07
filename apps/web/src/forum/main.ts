import "../theme.css";
import "./forum.css";
import type { TravelerForumCuratedNote, TravelerForumThread } from "@rpmf/core";
import { ancientChinaForumArchive, ancientChinaForumNodes } from "@rpmf/pack-ancient-china";
import { ancientChinaPackV01 } from "@rpmf/pack-ancient-china/canonical";
import { authorName, postTypeLabels, provenanceLabels, reliabilityLabels } from "../locales/zh-CN";
import { mountThemeSwitch } from "../theme";
import {
  applyOperation,
  browserLocks,
  catalogFromPack,
  commit,
  isProfileStoreKey,
  parseImport,
  readStore,
  type CommitResult,
  type ImportMode,
  type ImportPlan,
  type LocalRpProfile,
  type ProfileStore,
  type StoreOperation
} from "../profile/store";
import {
  bodyParagraphs,
  categories,
  discussionURL,
  forgeHref,
  highlightHtml,
  initialForumState,
  parseHashState,
  repliesOf,
  resolveTopicId,
  searchNotes,
  searchTopics,
  serializeHashState,
  sourceFileFor,
  type ForumLocation,
  type ForumRealm,
  type ForumState,
  type ForumTab,
  type SearchHit
} from "./model";
import { OPEN_PACK_ID, OPEN_REALM_ID, WORLD_LABEL, realms } from "./worlds";

const archive = ancientChinaForumArchive;
const pack = ancientChinaPackV01;
const BASE = import.meta.env.BASE_URL;

const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const $$ = <T extends HTMLElement = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)];
const esc = (value: unknown) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const nodeLabel = (id: string) => ancientChinaForumNodes.find((node) => node.id === id)?.label ?? id;
const identityLabel = (id: string) => pack.identities.find((item) => item.id === id)?.label ?? id;
const capabilityLabel = (id: string) => pack.capabilities.find((item) => item.id === id)?.label ?? id;
const expertLabel = (id: string) => pack.experts.find((item) => item.id === id)?.label ?? id;
const thread = (id: string) => archive.threads.find((item) => item.id === id);

const storage = { getItem: (key: string) => localStorage.getItem(key), setItem: (key: string, value: string) => localStorage.setItem(key, value) };
const catalog = catalogFromPack(pack, OPEN_REALM_ID);
const loaded = readStore(storage, catalog);
const locks = browserLocks();
let profileStore: ProfileStore = loaded.store;
const writable = loaded.writable;
let state: ForumState = { ...initialForumState };
let currentTopic: TravelerForumThread | undefined;
let replyShown = 4;
/** History entries pushed for open topics (list → A → B = 2); 0 when a topic was opened from a direct link. */
let topicDepth = 0;
/** Set when the dialog is being closed by history navigation rather than by the reader. */
let suppressCloseNav = false;
/** Element that opened the current topic; focus returns to it on close. */
let lastTrigger: HTMLElement | null = null;
let editingId = "";
/** Revision of the profile being edited when the dialog opened; null while creating. */
let editingBase: number | null = null;
let lastImportJson = "";
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function notify(message: string) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 4500);
}

function storageWarning(message: string) {
  const box = $("#storageWarning");
  box.textContent = message;
  box.hidden = !message;
}
storageWarning(loaded.warning);

const UNSAVED_WARNING = "本次修改仅在当前页面有效，尚未保存到浏览器。请在档案柜导出备份；刷新可能丢失本次修改。";

/**
 * The only write path for profiles. Every change is an operation committed
 * against the latest stored copy (serialized by a Web Lock when available),
 * so a stale tab cannot silently overwrite another tab's save.
 */
async function run(op: StoreOperation): Promise<CommitResult> {
  if (!writable) {
    // Read-only recovery mode: keep the change on this page only.
    const applied = applyOperation(profileStore, op, catalog);
    storageWarning(UNSAVED_WARNING);
    if (applied.status === "conflict") return { ...applied, atomic: false };
    profileStore = applied.store;
    return { status: "unwritable", store: applied.store, message: "只读恢复模式" };
  }
  const result = await commit(storage, catalog, op, { locks });
  profileStore = result.store;
  if (result.status === "saved") storageWarning(result.atomic ? "" : "本浏览器不支持写入锁：多个标签页请不要同时保存档案。");
  else if (result.status === "unwritable") storageWarning(UNSAVED_WARNING);
  return result;
}

/** Another tab changed the store: refresh this page's copy without touching an open draft. */
window.addEventListener("storage", (event) => {
  if (!isProfileStoreKey(event.key) || !writable) return;
  const latest = readStore(storage, catalog);
  if (!latest.writable) return;
  profileStore = latest.store;
  renderProfile();
  const dialog = $<HTMLDialogElement>("#profileDialog");
  if (dialog.open) {
    const box = $("#profileSync");
    box.hidden = false;
    box.textContent = "档案柜已在另一个标签页更新。你的草稿没有动；保存时会按最新修订核对。";
  } else {
    notify("档案柜已在另一个标签页更新。");
  }
});

function activeProfile(): LocalRpProfile {
  return profileStore.profiles.find((profile) => profile.id === profileStore.activeId) ?? profileStore.profiles[0];
}

function openDialog(id: string) {
  const dialog = $<HTMLDialogElement>(`#${id}`);
  if (!dialog.open) dialog.showModal();
}

$$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog")?.close()));
$$<HTMLDialogElement>("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  })
);
// ---------- URL + history (U1): public reading state only ----------
function syncUrl(mode: "push" | "replace", topic: string | null, reply: number | null) {
  const url = `${location.pathname}${location.search}${serializeHashState({ ...state, topic, reply })}`;
  const entry = { forum: true, depth: topicDepth };
  if (mode === "push") history.pushState(entry, "", url);
  else history.replaceState(entry, "", url);
}

/** Applies a parsed location: filters first, then the topic (or closes the dialog when the location has none). */
function applyLocation(loc: ForumLocation, mode: "none" | "replace") {
  state = { realm: loc.realm, node: loc.node, tab: loc.tab, q: loc.q };
  $<HTMLInputElement>("#q").value = state.q;
  renderList();
  const dialog = $<HTMLDialogElement>("#topicDialog");
  if (loc.topic) {
    openTopic(loc.topic, { floor: loc.reply, mode });
    return;
  }
  if (dialog.open) {
    lastClosedTopic = currentTopic?.id ?? null;
    suppressCloseNav = true;
    dialog.close();
  }
  if (lastClosedTopic !== null) {
    focusListRow(lastClosedTopic);
    lastClosedTopic = null;
  }
}

window.addEventListener("popstate", (event) => {
  const parsed = parseHashState(location.hash);
  if (parsed.malformed) notify("链接里的参数无法完全解析，已按可用部分显示。");
  topicDepth = (event.state as { depth?: number } | null)?.depth ?? 0;
  applyLocation(parsed.location, "none");
});

/** Id of the topic that was just closed; the list row for it gets focus once the list is current again. */
let lastClosedTopic: string | null = null;

function focusListRow(topicId: string | null) {
  const row = topicId ? $("#topics").querySelector<HTMLElement>(`[data-topic="${CSS.escape(topicId)}"]`) : null;
  (row ?? $<HTMLInputElement>("#q")).focus({ preventScroll: true });
}

/**
 * Runs whenever the topic dialog stops being open (×, Escape, backdrop, or
 * history navigation). Detected through the `open` attribute rather than the
 * `close` event so it also works where animation frames are paused.
 */
function onTopicDialogClosed() {
  const closed = currentTopic?.id ?? null;
  lastTrigger = null;
  currentTopic = undefined;
  if (suppressCloseNav) {
    // Closed by popstate: applyLocation already rendered the list and restores focus.
    suppressCloseNav = false;
    return;
  }
  if (topicDepth > 0) {
    // List → A → B: closing pops every topic entry so Back/Forward stay coherent;
    // the popstate handler re-renders the list and focuses the closed topic's row.
    lastClosedTopic = closed;
    const back = topicDepth;
    topicDepth = 0;
    history.go(-back);
    return;
  }
  // Opened from a direct link: return to the in-site list without leaving the page.
  syncUrl("replace", null, null);
  focusListRow(closed);
}

{
  const dialog = $<HTMLDialogElement>("#topicDialog");
  let wasOpen = dialog.open;
  new MutationObserver(() => {
    if (wasOpen && !dialog.open) onTopicDialogClosed();
    wasOpen = dialog.open;
  }).observe(dialog, { attributes: true, attributeFilter: ["open"] });
}

mountThemeSwitch($("#themeSwitch"), () => notify("已切换配色；浏览器未允许保存偏好。"));

// ---------- profiles (canonical v5: identity / route ids; permission derived read-only) ----------
const identityOf = (profile: LocalRpProfile) => (profile.identityId ? pack.identities.find((item) => item.id === profile.identityId) ?? null : null);
const routeLabel = (profile: LocalRpProfile) => {
  const route = profile.agenda ? pack.agendas?.find((item) => item.id === profile.agenda!.routeId) : undefined;
  const label = route?.label ?? "未定路线";
  return profile.agenda?.customGoal ? `${label}：${profile.agenda.customGoal}` : label;
};
/** Read-only summary derived from the canonical identity; never stored, never editable. */
function permissionSummary(profile: LocalRpProfile): string {
  const identity = identityOf(profile);
  if (!identity) return "身份待核对，权限无法派生";
  const access = identity.permissionProfile.access[0] ?? "无普通接触权限";
  const command = identity.permissionProfile.command[0] ?? "无普通命令权";
  return `可接触：${access}｜可命令：${command}`;
}
function permissionDetail(identityId: string | null): string {
  const identity = identityId ? pack.identities.find((item) => item.id === identityId) : undefined;
  if (!identity) return "选择身份后，这里会显示该身份在世界包里的权限边界。权限不能手填，只能由身份派生。";
  const list = (items: string[], empty: string) => (items.length ? items.join("；") : empty);
  return `权限由「${identity.label}」派生，只读：可接触 ${list(identity.permissionProfile.access, "无普通接触权限")}｜可命令 ${list(identity.permissionProfile.command, "无普通命令权")}｜主要风险 ${identity.permissionProfile.risks.join("、")}。浏览任何分区都不会改变它。`;
}

function renderProfile() {
  const profile = activeProfile();
  const identity = identityOf(profile);
  $<HTMLSelectElement>("#profileSelect").innerHTML = profileStore.profiles
    .map((item) => `<option value="${esc(item.id)}">${esc(item.name)}${item.requiresReview ? "（待核对）" : ""}</option>`)
    .join("");
  $<HTMLSelectElement>("#profileSelect").value = profile.id;
  $("#profileIdentity").textContent = identity?.label ?? "身份待核对";
  $("#profileWorld").textContent = WORLD_LABEL;
  $("#profileName").textContent = profile.name;
  $("#profileAgenda").textContent = routeLabel(profile);
  $("#profilePermission").textContent = permissionSummary(profile);
  $("#profileAvatar").textContent = [...(identity?.label ?? "档")][0] ?? "档";
  $("#profileBrief").textContent = `${identity?.label ?? "身份待核对"} · ${routeLabel(profile)}`;
  renderAttachment();
}

function openProfile(isNew = false, source?: LocalRpProfile) {
  const profile: LocalRpProfile = isNew
    ? { version: 5, id: crypto.randomUUID(), name: "", realmId: catalog.realmId, worldPackId: catalog.worldPackId, identityId: null, agenda: { routeId: "open-road" }, notes: "" }
    : (source ?? activeProfile());
  editingId = profile.id;
  editingBase = isNew ? null : (profile.revision ?? 0);
  $("#profileTitle").textContent = isNew ? "新建本局档案" : "本局档案柜 · 编辑 / 改名";
  const review = profile.requiresReview;
  const legacyLines = review
    ? Object.entries({ 身份: review.legacy.identity, 路线: review.legacy.agenda, 世界: review.legacy.world, 权限备注: review.legacy.permission })
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}「${esc(value)}」`)
        .join("、")
    : "";
  $("#profileDialogBody").innerHTML = `
    <p class="caption">保存后才修改档案。身份与路线只能从当前世界包里选；权限由身份派生，不能手填。</p>
    <div id="profileSync" class="notice" role="status" hidden></div>
    ${review ? `<div class="notice"><b>待核对</b> · ${esc(review.reason)}${legacyLines ? `<br>旧档案原文：${legacyLines}` : ""}<br>核对并保存后，这条提醒会消失。</div>` : ""}
    <form id="profileForm">
      <label>档案名<input name="name" required maxlength="40" value="${esc(profile.name)}"></label>
      <label>世界包<select name="world" disabled><option>${esc(WORLD_LABEL)}</option></select></label>
      <div class="field-pair">
        <label>当前身份<select name="identityId" required>${profile.identityId ? "" : '<option value="" selected>请选择身份</option>'}${pack.identities.map((item) => `<option value="${esc(item.id)}"${item.id === profile.identityId ? " selected" : ""}>${esc(item.label)}</option>`).join("")}</select></label>
        <label>路线 / 想过怎样的人生<select name="routeId">${(pack.agendas ?? []).map((item) => `<option value="${esc(item.id)}"${item.id === profile.agenda?.routeId ? " selected" : ""}>${esc(item.label)}</option>`).join("")}</select></label>
      </div>
      <label>路线补充目标（可选）<input name="customGoal" maxlength="200" value="${esc(profile.agenda?.customGoal ?? "")}" placeholder="例如：攒够钱带妹妹离开主家"></label>
      <div class="derived" id="derivedPermission">${esc(permissionDetail(profile.identityId))}</div>
      <label>私密备忘<textarea name="notes" rows="4" maxlength="1200" placeholder="只有本浏览器保存；不会跟着帖子链接外发。">${esc(profile.notes ?? "")}</textarea></label>
      <p id="profileError" class="form-error" role="alert"></p>
      <div class="form-actions">
        <button class="primary" type="submit">保存档案</button>
        <button class="iconbtn" type="button" data-close>取消</button>
        <button class="danger" type="button" id="deleteProfile"${isNew ? " hidden" : ""}${profileStore.profiles.length <= 1 ? ' disabled title="至少保留一份档案"' : ""}>删除这份档案</button>
      </div>
    </form>
    <div class="backup">
      <button class="textbtn" type="button" id="exportProfiles">导出全部已保存档案</button>
      <p class="caption">JSON 备份包含私密备忘，请自行妥善保管。清除浏览器数据会失去未备份档案。</p>
      <label class="caption">导入备份（v4 / v5 JSON）<input type="file" id="importFile" accept="application/json,.json"></label>
      <div id="importPlan" hidden></div>
    </div>`;
  $("#profileDialogBody [data-close]").addEventListener("click", () => $<HTMLDialogElement>("#profileDialog").close());
  $<HTMLSelectElement>("#profileForm [name=identityId]").addEventListener("change", (event) => {
    $("#derivedPermission").textContent = permissionDetail((event.target as HTMLSelectElement).value || null);
  });
  $<HTMLFormElement>("#profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const customGoal = String(data.get("customGoal") ?? "").trim();
    const draft = {
      version: 5,
      id: editingId,
      name: data.get("name"),
      realmId: catalog.realmId,
      worldPackId: catalog.worldPackId,
      identityId: String(data.get("identityId") ?? ""),
      agenda: { routeId: data.get("routeId"), ...(customGoal ? { customGoal } : {}) },
      notes: data.get("notes")
    };
    const errorBox = $("#profileError");
    errorBox.textContent = "";
    let result: CommitResult;
    try {
      result = await run({ type: "upsert", profile: draft, baseRevision: editingBase });
    } catch (error) {
      errorBox.textContent = (error as Error).message;
      return;
    }
    if (result.status === "conflict") {
      renderConflict(result);
      return;
    }
    renderProfile();
    $<HTMLDialogElement>("#profileDialog").close();
    notify(result.status === "saved" ? "档案已保存在本浏览器" : "档案仅在本次页面暂存，请导出备份");
  });
  $("#deleteProfile").addEventListener("click", () => {
    $("#deleteText").textContent = `确定删除「${activeProfile().name}」？`;
    openDialog("deleteDialog");
  });
  $("#exportProfiles").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(profileStore, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "天道本局档案备份.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("已导出当前已保存到档案柜的数据；未提交的表单修改不包含在内。");
  });
  $<HTMLInputElement>("#importFile").addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    lastImportJson = await file.text();
    renderImportPlan("");
  });
  openDialog("profileDialog");
  $<HTMLInputElement>("#profileForm [name=name]").focus();
}

/** Shows a stale-save conflict inside the editor; the draft stays in the form until the reader chooses. */
function renderConflict(result: Extract<CommitResult, { status: "conflict" }>) {
  const box = $("#profileError");
  const latest = result.latestProfile;
  box.innerHTML = `<span>${esc(result.message)}</span><div class="form-actions">${
    latest
      ? `<button type="button" class="iconbtn" data-conflict="view">放弃草稿，查看最新内容</button><button type="button" class="iconbtn" data-conflict="keep">保留我的草稿，核对后重新保存</button>`
      : `<button type="button" class="iconbtn" data-conflict="recreate">把草稿作为新档案保存</button><button type="button" class="iconbtn" data-close>放弃草稿</button>`
  }</div>`;
  box.querySelector("[data-conflict=view]")?.addEventListener("click", () => {
    if (latest && window.confirm("放弃当前草稿，改为显示另一个页面保存的最新内容？")) openProfile(false, latest);
  });
  box.querySelector("[data-conflict=keep]")?.addEventListener("click", () => {
    editingBase = latest?.revision ?? 0;
    box.innerHTML = `<span>已按修订 ${editingBase} 核对。再点「保存档案」会用你的草稿覆盖另一个页面的那次修改。</span>`;
  });
  box.querySelector("[data-conflict=recreate]")?.addEventListener("click", () => {
    editingBase = null;
    box.innerHTML = "<span>将作为新档案保存；再点「保存档案」即可。</span>";
  });
  box.querySelector("[data-close]")?.addEventListener("click", () => $<HTMLDialogElement>("#profileDialog").close());
}

/** Parses the last chosen backup against the *current* store and offers the merge modes. */
function renderImportPlan(notice: string) {
  const box = $("#importPlan");
  let plan: ImportPlan;
  try {
    plan = parseImport(lastImportJson, catalog, profileStore);
  } catch (error) {
    box.hidden = false;
    box.innerHTML = `<p class="form-error">导入失败：${esc((error as Error).message)}。当前档案柜没有任何改动。</p>`;
    return;
  }
  box.hidden = false;
  box.innerHTML = `${notice ? `<div class="notice">${esc(notice)}</div>` : ""}<div class="notice">读到 ${plan.incoming.profiles.length} 份档案（v${plan.sourceVersion} 备份）${plan.duplicateIds.length ? `，其中 ${plan.duplicateIds.length} 份编号与现有档案重复` : ""}${plan.needsReview.length ? `；${plan.needsReview.length} 份需要核对身份或路线` : ""}。尚未写入，请选择怎样合并。</div>
    <div class="form-actions">
      <button type="button" class="primary" data-import="merge-skip">合并（跳过重复编号）</button>
      <button type="button" class="iconbtn" data-import="merge-overwrite"${plan.duplicateIds.length ? "" : " disabled"}>合并并覆盖重复编号</button>
      <button type="button" class="danger" data-import="replace">替换整个档案柜</button>
    </div>`;
  box.querySelectorAll<HTMLButtonElement>("[data-import]").forEach((button) =>
    button.addEventListener("click", async () => {
      const mode = button.dataset.import as ImportMode;
      if (mode === "replace" && !window.confirm(`确定用备份里的 ${plan.incoming.profiles.length} 份档案替换当前全部 ${profileStore.profiles.length} 份？此操作无法撤回。`)) return;
      if (mode === "merge-overwrite" && !window.confirm(`确定覆盖 ${plan.duplicateIds.length} 份编号重复的档案？`)) return;
      const result = await run({ type: "import", plan, mode });
      if (result.status === "conflict") {
        renderImportPlan(`${result.message} 下面是按最新档案柜重新核对的计划。`);
        return;
      }
      renderProfile();
      $<HTMLDialogElement>("#profileDialog").close();
      notify(result.status === "saved" ? "档案已导入并保存在本浏览器" : "档案已导入到本页，但浏览器存储未更新");
    })
  );
}

$("#editProfile").addEventListener("click", () => openProfile());
$("#railEdit").addEventListener("click", () => openProfile());
$("#newProfile").addEventListener("click", () => openProfile(true));
$<HTMLSelectElement>("#profileSelect").addEventListener("change", async (event) => {
  const result = await run({ type: "activate", id: (event.target as HTMLSelectElement).value });
  renderProfile();
  notify(result.status === "saved" ? "已切换并记住本局档案" : result.status === "conflict" ? result.message : "已临时切换；请查看保存提示");
});
$("#confirmDelete").addEventListener("click", async () => {
  try {
    const result = await run({ type: "delete", id: editingId });
    $<HTMLDialogElement>("#deleteDialog").close();
    $<HTMLDialogElement>("#profileDialog").close();
    renderProfile();
    notify(result.status === "saved" ? "已删除该档案" : "仅在本页删除，浏览器存储尚未更新");
  } catch (error) {
    notify((error as Error).message);
  }
});

// ---------- world navigation ----------
function renderWorldBars() {
  const realmButtons = [
    `<button type="button" class="pill" data-realm="all">诸界首页</button>`,
    `<button type="button" class="pill" data-realm="meta">天道总坛</button>`,
    ...realms.map((realm) =>
      realm.open
        ? `<button type="button" class="pill" data-realm="eastern" data-realm-id="${esc(realm.id)}">${esc(realm.label)}</button>`
        : `<button type="button" class="pill planned" data-planned="${esc(realm.label)}">${esc(realm.label)} · 未开放</button>`
    )
  ];
  $("#realmbar").innerHTML = realmButtons.join("");
  const openRealm = realms.find((realm) => realm.id === OPEN_REALM_ID)!;
  $("#packbar").innerHTML =
    `<span class="packlabel">${esc(openRealm.label)} · 世界包</span>` +
    openRealm.packs
      .map((item) =>
        item.open
          ? `<button type="button" class="pill" id="openPack" data-pack-id="${esc(item.id)}">${esc(item.label)}</button>`
          : `<button type="button" class="pill planned" data-planned="${esc(item.label)}">${esc(item.label)} · 未开放</button>`
      )
      .join("");
  $$("[data-realm]").forEach((button) =>
    button.addEventListener("click", () => {
      state = { ...state, realm: button.dataset.realm as ForumRealm, node: "all", tab: "all" };
      renderList();
      syncUrl("replace", null, null);
    })
  );
  $("#openPack").addEventListener("click", () => {
    state = { ...state, realm: "eastern", node: "all", tab: "all" };
    renderList();
    syncUrl("replace", null, null);
  });
  $$("[data-planned]").forEach((button) =>
    button.addEventListener("click", () => {
      $("#plannedText").textContent = `「${button.dataset.planned}」仍是规划中的世界，没有可安装的完整世界包。`;
      $<HTMLAnchorElement>("#proposeWorld").href = discussionURL("世界包提案");
      openDialog("plannedDialog");
    })
  );
}

// ---------- list ----------
function typeClass(item: TravelerForumThread) {
  if (item.postType === "module-release") return "module";
  if (item.postType === "knowledge-card") return "good";
  if (item.archiveGap) return "warn";
  return "";
}

function noteCard(note: TravelerForumCuratedNote, hits: SearchHit[] = []): string {
  return `<article class="curated">
      <div class="badges"><span class="type good">${esc(reliabilityLabels[note.reliability])}</span><span class="type">${esc(capabilityLabel(note.capability))}</span>${note.conflictsWith?.length ? '<span class="type warn">保留冲突意见</span>' : ""}</div>
      <div class="lesson">${highlightHtml(note.lesson, state.q)}</div>
      <div class="caption">适用身份：${note.appliesTo.identities.map(identityLabel).map(esc).join("、") || "不限"}${note.failureModes.length ? ` · 失效方式：${highlightHtml(note.failureModes.join("；"), state.q)}` : ""}</div>
      ${hits.length ? `<div class="hits"><b>经验卡命中</b>${hits.map((hit) => highlightHtml(hit.snippet, state.q)).join("｜")}</div>` : ""}
      <div class="sources">原帖：${note.sourceThreads
        .map((id) => `<button type="button" class="textbtn" data-topic="${esc(id)}">${esc(thread(id)?.title ?? id)}</button>`)
        .join("")}</div>
    </article>`;
}

/** Knowledge tab lists every note; a query shows the matching notes on any tab, with an exact count. */
function renderCuratedNotes(): number {
  const box = $("#curatedNotes");
  const q = state.q.trim();
  if (q) {
    const results = searchNotes(archive, q);
    box.hidden = false;
    box.innerHTML =
      `<h3>经验卡命中<span class="hitcount">${results.length} 张</span></h3>` +
      (results.length ? results.map(({ note, hits }) => noteCard(note, hits)).join("") : '<p class="caption">没有经验卡命中这个关键词。</p>');
    return results.length;
  }
  if (state.tab !== "knowledge") {
    box.hidden = true;
    return 0;
  }
  const notes: TravelerForumCuratedNote[] = archive.curatedNotes;
  box.hidden = false;
  box.innerHTML = `<h3>已审核 · Runtime 可检索的老乡经验卡（${notes.length} 张，同一档案源）</h3>` + notes.map((note) => noteCard(note)).join("");
  return notes.length;
}

const HIT_LABELS: Record<SearchHit["kind"], string> = { title: "标题命中", author: "作者命中", tag: "标签命中", body: "正文命中", reply: "楼层命中", note: "经验卡命中" };

/** One line per row: the most useful hit (a floor or the body) as a button that lands on it, plus a count. */
function hitLine(threadId: string, hits: SearchHit[]): string {
  if (!hits.length) return "";
  const first = hits.find((hit) => hit.kind === "reply" || hit.kind === "body") ?? hits[0];
  const label = first.kind === "reply" ? `第 ${first.floor} 楼命中` : HIT_LABELS[first.kind];
  const floorAttr = first.kind === "reply" ? ` data-floor="${first.floor}"` : "";
  const rest = hits.length - 1;
  return `<div class="hits"><button type="button" class="hitbtn" data-topic="${esc(threadId)}"${floorAttr}><b>${label}</b>${highlightHtml(first.snippet, state.q)}</button>${rest ? `<span class="more">+${rest} 处</span>` : ""}</div>`;
}

function renderList() {
  const realmTopics = archive.threads.filter((item) => state.realm === "all" || (state.realm === "meta" ? item.node === "meta" : item.node !== "meta"));
  const nodes = [{ id: "all", label: "全部分区" }, ...ancientChinaForumNodes].filter((node) => node.id === "all" || realmTopics.some((item) => item.node === node.id));
  $("#nodes").innerHTML =
    "<h3>论坛分区</h3>" +
    nodes
      .map(
        (node) =>
          `<button type="button" class="node ${state.node === node.id ? "on" : ""}" data-node="${node.id}" aria-pressed="${state.node === node.id}">${esc(node.label)}<span class="count">${node.id === "all" ? realmTopics.length : realmTopics.filter((item) => item.node === node.id).length}</span></button>`
      )
      .join("");
  $$("#nodes [data-node]").forEach((button) =>
    button.addEventListener("click", () => {
      state = { ...state, node: button.dataset.node! };
      renderList();
    })
  );

  const results = searchTopics(archive, state);
  const q = state.q.trim();
  $("#crumb").textContent = `天道降维互助论坛 / ${{ all: "诸界首页", meta: "天道总坛", eastern: WORLD_LABEL }[state.realm]} / ${state.node === "all" ? "全部分区" : nodeLabel(state.node)}`;
  $("#topics").innerHTML = results.length
    ? results
        .map(({ thread: item, hits }) => {
          const replies = repliesOf(archive, item.id);
          return `<article class="row"><div><div class="titleline"><span class="type ${typeClass(item)}">${esc(postTypeLabels[item.postType])}</span><a class="title" href="${esc(serializeHashState({ ...initialForumState, topic: item.id, reply: null }))}" data-topic="${esc(item.id)}">${highlightHtml(item.title, state.q)}</a></div><div class="meta"><span>${esc(authorName(item.author))}</span>${(item.tags ?? []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}<span>${esc(item.reviewNote ?? reliabilityLabels[item.reliability])}</span></div>${hitLine(item.id, hits)}</div><div class="metric"><strong>${replies.length} 条</strong>收录回复</div><div class="time"><strong>${esc(item.archiveTime ?? "王朝档案")}</strong>${item.archiveGap ? "有缺页标记" : "维护组创作"}</div></article>`;
        })
        .join("")
    : q
      ? `<div class="empty">没有主题命中「${esc(q)}」。试试更短的词，或点「重置筛选」回到诸界首页。</div>`
      : '<div class="empty">这个分区还没有主题。点「重置筛选」回到诸界首页。</div>';
  const noteCount = renderCuratedNotes();
  $("#resultCount").textContent = q ? `主题命中 ${results.length} 篇 · 经验卡命中 ${noteCount} 张` : `${results.length} 篇主题 · 收录回复按实际楼层计数`;
  $$("[data-realm]").forEach((button) => {
    const on = button.dataset.realm === state.realm;
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", String(on));
  });
  $$("[data-tab]").forEach((button) => {
    const on = button.dataset.tab === state.tab;
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", String(on));
  });
  $("#openPack").classList.toggle("active", state.realm === "eastern");
}

$$("[data-tab]").forEach((button) =>
  button.addEventListener("click", () => {
    const tab = button.dataset.tab as ForumTab;
    state = { ...state, tab, node: "all", realm: tab === "maintainer" ? "meta" : "all" };
    renderList();
    syncUrl("replace", null, null);
  })
);
$<HTMLInputElement>("#q").addEventListener("input", (event) => {
  state = { ...state, q: (event.target as HTMLInputElement).value.trim() };
  renderList();
  syncUrl("replace", null, null);
});
$("#resetFilters").addEventListener("click", () => {
  state = { ...initialForumState };
  $<HTMLInputElement>("#q").value = "";
  renderList();
  syncUrl("replace", null, null);
});

// ---------- topic ----------
function renderAttachment() {
  if (!currentTopic) return;
  const attachment = currentTopic.moduleAttachment;
  $("#moduleAttachment").innerHTML = attachment
    ? `<section class="attachment"><h3>🧩 模块附件 · ${esc(attachment.label)}（第 ${esc(attachment.version)} 版）</h3>
      <div class="chips"><span>建议身份：${esc(identityLabel(attachment.suggestedIdentity))}</span>${attachment.capabilities.map((id) => `<span>${esc(capabilityLabel(id))}</span>`).join("")}${attachment.experts.map((id) => `<span>镜头：${esc(expertLabel(id))}</span>`).join("")}</div>
      <p>当前本局：${esc(identityOf(activeProfile())?.label ?? "身份待核对")} · ${esc(routeLabel(activeProfile()))}</p>
      <p>${esc(attachment.note)}</p>
      <a class="btn primarybtn" href="${esc(forgeHref(BASE, currentTopic.id))}">带着这篇帖子去模块工坊核对配置 ↗</a></section>`
    : "";
}

type OpenOptions = { floor?: number | null; mode?: "push" | "replace" | "none"; trigger?: HTMLElement | null };

/** Scrolls a floor into view, marks it and moves keyboard focus there. */
function focusFloor(floor: number) {
  const target = $("#replies").querySelector<HTMLElement>(`[data-floor="${floor}"]`);
  if (!target) return;
  target.classList.add("hit");
  target.tabIndex = -1;
  target.scrollIntoView({ block: "center" });
  target.focus({ preventScroll: true });
}

function openTopic(rawId: string, options: OpenOptions = {}) {
  const mode = options.mode ?? "push";
  const id = resolveTopicId(archive, rawId);
  const item = id ? thread(id) : undefined;
  if (!item) {
    notify("没有找到这篇档案；链接里的编号可能已失效。");
    if (mode !== "none" && location.hash.includes("topic=")) syncUrl("replace", null, null);
    return;
  }
  const floor = options.floor && options.floor > 0 ? Math.min(options.floor, item.replies.length) : null;
  if (options.trigger) lastTrigger = options.trigger;
  currentTopic = item;
  replyShown = Math.max(4, floor ?? 0);
  $("#drawerKicker").textContent = `${nodeLabel(item.node)} · ${postTypeLabels[item.postType]}`;
  $("#drawerTitle").textContent = item.title;
  $("#drawerMeta").innerHTML = `<span>${esc(authorName(item.author))}</span><span>· ${esc(item.author.statusLabel ?? "")}</span><span>· ${esc(item.archiveTime ?? "王朝档案")}</span>`;
  $("#provenance").innerHTML = `<details><summary>来源：${esc(provenanceLabels[item.provenance.kind])} · ${esc(item.reviewNote ?? reliabilityLabels[item.reliability])} · 编号 ${esc(item.id)}</summary><p>本帖和下列楼层均来自仓库创作档案（${esc(item.provenance.reference)}），不是真人社区发言。作者状态为叙事设定，声望不代表可靠度；「身份已终止」不等于穿越者本人死亡。</p><a href="${esc(sourceFileFor(item))}" target="_blank" rel="noopener noreferrer">查看仓库来源 ↗</a>${item.postType === "community-gateway" ? "<p>当前没有已授权导入的真人帖子。真人发言、回复和互动数量请到原始 Discussions 查看。</p>" : ""}</details>`;
  $("#drawerPost").innerHTML = bodyParagraphs(item.body)
    .map((paragraph) => `<p>${highlightHtml(paragraph, state.q).replace(/\n/g, "<br>")}</p>`)
    .join("");
  $("#archiveNote").textContent = item.archiveGap
    ? item.archiveGap.note
    : `本帖收录 ${item.replies.length} 条创作档案回复。没有以真人流量或未收录楼层填充计数。`;
  $("#relatedTopics").innerHTML = item.relatedThreads?.length
    ? "<h3>关联原帖</h3>" + item.relatedThreads.map((related) => `<button type="button" class="reading-link" data-topic="${esc(related)}">${esc(thread(related)?.title ?? related)} →</button>`).join("")
    : "";
  renderAttachment();
  renderReplies();
  const dialog = $<HTMLDialogElement>("#topicDialog");
  const alreadyOpen = dialog.open;
  openDialog("topicDialog");
  if (mode === "push") topicDepth += 1;
  if (mode !== "none") syncUrl(mode, item.id, floor);
  if (floor) {
    focusFloor(floor);
  } else {
    dialog.scrollTop = 0;
    if (alreadyOpen) $("#topicDialog [data-close]").focus();
  }
}

function renderReplies() {
  if (!currentTopic) return;
  const replies = repliesOf(archive, currentTopic.id);
  const total = replies.length;
  const shown = Math.min(replyShown, total);
  $("#replySummary").textContent = `楼层 · 已读入 ${shown} / ${total} 条回复`;
  $("#replies").innerHTML =
    replies
      .slice(0, shown)
      .map(
        (reply, index) =>
          `<article class="reply" id="floor-${index + 1}" data-floor="${index + 1}" aria-label="第 ${index + 1} 楼"><div class="reply-author"><span class="avatar">${esc([...authorName(reply.author)][0])}</span><div><b>${highlightHtml(authorName(reply.author), state.q)}</b><div class="caption">${esc(reply.author.statusLabel ?? "")} · ${esc(reply.archiveTime ?? "")} · ${esc(postTypeLabels[reply.replyType])}</div></div><span class="floor">#${index + 1}</span></div><p>${highlightHtml(reply.body, state.q)}</p></article>`
      )
      .join("") ||
    (currentTopic.postType === "community-gateway"
      ? '<p class="caption">真人讨论请前往通信口查看。此处未同步外部回复。</p>'
      : '<p class="caption">暂无收录回复。</p>');
  $("#loadMore").hidden = shown >= total;
  $("#loadMore").textContent = `继续阅读（余 ${total - shown} 条）`;
}

$("#loadMore").addEventListener("click", () => {
  replyShown += 4;
  renderReplies();
});
document.addEventListener("click", (event) => {
  const link = (event.target as HTMLElement).closest<HTMLElement>("[data-topic]");
  if (!link) return;
  event.preventDefault();
  const floor = link.dataset.floor ? Number(link.dataset.floor) : null;
  openTopic(link.dataset.topic!, { floor, mode: "push", trigger: link });
});
$("#aboutCommunity").addEventListener("click", (event) => openTopic("tf-ancient-china-community-gateway", { mode: "push", trigger: event.currentTarget as HTMLElement }));

// ---------- compose / community gateway ----------
function compose(topic: TravelerForumThread | null = null, intent = "") {
  const context = $("#composeContext");
  context.hidden = !topic;
  context.textContent = topic
    ? `关联档案：${topic.title}。${intent ? `评议方向：${intent}。` : ""}仅在勘误表单标题中携带此公开档案标题，请填写具体条件与证据。`
    : "";
  const sorted = topic ? [...categories].sort((a, b) => Number(b[0] === "经验复现与勘误") - Number(a[0] === "经验复现与勘误")) : [...categories];
  $("#categories").innerHTML = sorted
    .map(
      ([slug, title, description]) =>
        `<a class="category ${topic && slug === "经验复现与勘误" ? "recommended" : ""}" href="${esc(discussionURL(slug, topic && slug === "经验复现与勘误" ? `${topic.title}${intent ? ` · ${intent}` : ""}` : ""))}" target="_blank" rel="noopener noreferrer"><b>${esc(title)} ↗</b><span>${esc(description)}</span>${slug === "天道公告" ? "<small>仅维护者可发布公告</small>" : ""}</a>`
    )
    .join("");
  openDialog("composeDialog");
}
$$("[data-compose]").forEach((button) => button.addEventListener("click", () => compose()));
$("#reviewTopic").addEventListener("click", () => compose(currentTopic ?? null));
$$("[data-review]").forEach((button) => button.addEventListener("click", () => compose(currentTopic ?? null, button.dataset.review)));
$("#copyTopic").addEventListener("click", async () => {
  if (!currentTopic) return;
  try {
    await navigator.clipboard.writeText(new URL(serializeHashState({ ...initialForumState, topic: currentTopic.id, reply: null }), location.href).href);
    notify("已复制公开档案链接");
  } catch {
    notify("浏览器未允许复制，请复制地址栏中的档案链接。");
  }
});

// ---------- reading links ----------
$("#readingLinks").innerHTML = [
  ["tf-ancient-china-yongning-first-year", "一位皇帝没写完的第一年", "长篇复盘"],
  ["tf-ancient-china-merchant-two-books", "两本账，与一顿道歉的茶", "反例与勘误"],
  ["tf-ancient-china-sugar-rabbit", "今天的十三文", "普通人生"]
]
  .map(([id, label, kind]) => `<button type="button" class="reading-link" data-topic="${id}">${label} <span>${kind} →</span></button>`)
  .join("");

renderWorldBars();
renderProfile();
{
  const initial = parseHashState(location.hash);
  if (initial.malformed) notify("链接里的参数无法完全解析，已按可用部分显示。");
  history.replaceState({ forum: true, depth: 0 }, "", location.href);
  applyLocation(initial.location, "replace");
}
