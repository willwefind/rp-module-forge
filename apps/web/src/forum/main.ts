import "../theme.css";
import "./forum.css";
import type { TravelerForumCuratedNote, TravelerForumThread } from "@rpmf/core";
import { ancientChinaForumArchive, ancientChinaForumNodes } from "@rpmf/pack-ancient-china";
import { ancientChinaPackV01 } from "@rpmf/pack-ancient-china/canonical";
import { authorName, postTypeLabels, provenanceLabels, reliabilityLabels } from "../locales/zh-CN";
import { mountThemeSwitch } from "../theme";
import { deleteProfile, readStore, saveStore, upsertProfile, type Profile, type ProfileStore } from "../profile/store";
import {
  bodyParagraphs,
  categories,
  discussionURL,
  filterTopics,
  forgeHref,
  initialForumState,
  repliesOf,
  resolveTopicId,
  sourceFileFor,
  type ForumRealm,
  type ForumState,
  type ForumTab
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
const loaded = readStore(storage);
let profileStore: ProfileStore = loaded.store;
const writable = loaded.writable;
let state: ForumState = { ...initialForumState };
let currentTopic: TravelerForumThread | undefined;
let replyShown = 4;
let editingId = "";
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

function persist(next: ProfileStore): boolean {
  profileStore = next;
  try {
    if (!writable) throw new Error("只读恢复模式");
    saveStore(storage, next);
    storageWarning("");
    return true;
  } catch {
    storageWarning("本次修改仅在当前页面有效，尚未保存到浏览器。请在档案柜导出备份；刷新可能丢失本次修改。");
    return false;
  }
}

function activeProfile(): Profile {
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
$<HTMLDialogElement>("#topicDialog").addEventListener("close", () => {
  if (location.hash.startsWith("#topic=")) history.replaceState(null, "", location.pathname + location.search);
});

mountThemeSwitch($("#themeSwitch"), () => notify("已切换配色；浏览器未允许保存偏好。"));

// ---------- profiles (V3 schema; canonical profiles arrive in the next milestone) ----------
function renderProfile() {
  const profile = activeProfile();
  $<HTMLSelectElement>("#profileSelect").innerHTML = profileStore.profiles
    .map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`)
    .join("");
  $<HTMLSelectElement>("#profileSelect").value = profile.id;
  $("#profileIdentity").textContent = profile.identity;
  $("#profileWorld").textContent = profile.world;
  $("#profileName").textContent = profile.name;
  $("#profileAgenda").textContent = profile.agenda;
  $("#profilePermission").textContent = profile.permission;
  $("#profileAvatar").textContent = [...profile.identity][0] ?? "档";
  $("#profileBrief").textContent = `${profile.identity} · ${profile.agenda}`;
  renderAttachment();
}

function openProfile(isNew = false) {
  const profile: Profile = isNew
    ? { id: crypto.randomUUID(), name: "", world: WORLD_LABEL, identity: "待设置", agenda: "开放路线", permission: "待核对", notes: "" }
    : activeProfile();
  editingId = profile.id;
  $("#profileTitle").textContent = isNew ? "新建本局档案" : "本局档案柜 · 编辑 / 改名";
  const worldOptions = [WORLD_LABEL, ...(profile.world !== WORLD_LABEL ? [profile.world] : [])];
  $("#profileDialogBody").innerHTML = `
    <p class="caption">保存后才修改档案。这里的权限备注不授予任何世界内能力。</p>
    <form id="profileForm">
      <label>档案名<input name="name" required maxlength="40" value="${esc(profile.name)}"></label>
      <label>世界包<select name="world">${worldOptions.map((option) => `<option${option === profile.world ? " selected" : ""}>${esc(option)}</option>`).join("")}</select></label>
      <div class="field-pair">
        <label>当前身份<input name="identity" required maxlength="60" list="identities" value="${esc(profile.identity)}"></label>
        <label>路线 / 想过怎样的人生<input name="agenda" required maxlength="80" value="${esc(profile.agenda)}"></label>
      </div>
      <label>权限备注<input name="permission" required maxlength="80" value="${esc(profile.permission)}"></label>
      <label>私密备忘<textarea name="notes" rows="4" maxlength="1200" placeholder="只有本浏览器保存；不会跟着帖子链接外发。">${esc(profile.notes)}</textarea></label>
      <datalist id="identities">${pack.identities.map((item) => `<option value="${esc(item.label)}">`).join("")}</datalist>
      <p id="profileError" class="form-error" role="alert"></p>
      <div class="form-actions">
        <button class="primary" type="submit">保存档案</button>
        <button class="iconbtn" type="button" data-close>取消</button>
        <button class="danger" type="button" id="deleteProfile"${isNew ? " hidden" : ""}${profileStore.profiles.length <= 1 ? ' disabled title="至少保留一份档案"' : ""}>删除这份档案</button>
      </div>
    </form>
    <div class="backup"><button class="textbtn" type="button" id="exportProfiles">导出全部已保存档案</button><p class="caption">JSON 备份包含私密备忘，请自行妥善保管。清除浏览器数据会失去未备份档案。</p></div>`;
  $("#profileDialogBody [data-close]").addEventListener("click", () => $<HTMLDialogElement>("#profileDialog").close());
  $<HTMLFormElement>("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const next = upsertProfile(profileStore, { ...Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)), id: editingId });
      const saved = persist(next);
      renderProfile();
      $<HTMLDialogElement>("#profileDialog").close();
      notify(saved ? "档案已保存在本浏览器" : "档案仅在本次页面暂存，请导出备份");
    } catch (error) {
      $("#profileError").textContent = (error as Error).message;
    }
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
  openDialog("profileDialog");
  $<HTMLInputElement>("#profileForm [name=name]").focus();
}

$("#editProfile").addEventListener("click", () => openProfile());
$("#railEdit").addEventListener("click", () => openProfile());
$("#newProfile").addEventListener("click", () => openProfile(true));
$<HTMLSelectElement>("#profileSelect").addEventListener("change", (event) => {
  const saved = persist({ ...profileStore, activeId: (event.target as HTMLSelectElement).value });
  renderProfile();
  notify(saved ? "已切换并记住本局档案" : "已临时切换；请查看保存提示");
});
$("#confirmDelete").addEventListener("click", () => {
  try {
    const saved = persist(deleteProfile(profileStore, editingId));
    $<HTMLDialogElement>("#deleteDialog").close();
    $<HTMLDialogElement>("#profileDialog").close();
    renderProfile();
    notify(saved ? "已删除该档案" : "仅在本页删除，浏览器存储尚未更新");
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
    })
  );
  $("#openPack").addEventListener("click", () => {
    state = { ...state, realm: "eastern", node: "all", tab: "all" };
    renderList();
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

function renderCuratedNotes() {
  const box = $("#curatedNotes");
  if (state.tab !== "knowledge") {
    box.hidden = true;
    return;
  }
  const notes: TravelerForumCuratedNote[] = archive.curatedNotes;
  box.hidden = false;
  box.innerHTML =
    `<h3>已审核 · Runtime 可检索的老乡经验卡（${notes.length} 张，同一档案源）</h3>` +
    notes
      .map(
        (note) => `<article class="curated">
      <div class="badges"><span class="type good">${esc(reliabilityLabels[note.reliability])}</span><span class="type">${esc(capabilityLabel(note.capability))}</span>${note.conflictsWith?.length ? '<span class="type warn">保留冲突意见</span>' : ""}</div>
      <div class="lesson">${esc(note.lesson)}</div>
      <div class="caption">适用身份：${note.appliesTo.identities.map(identityLabel).map(esc).join("、") || "不限"}${note.failureModes.length ? ` · 失效方式：${esc(note.failureModes.join("；"))}` : ""}</div>
      <div class="sources">原帖：${note.sourceThreads
        .map((id) => `<button type="button" class="textbtn" data-topic="${esc(id)}">${esc(thread(id)?.title ?? id)}</button>`)
        .join("")}</div>
    </article>`
      )
      .join("");
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

  const list = filterTopics(archive, state);
  $("#resultCount").textContent = `${list.length} 篇主题 · 收录回复按实际楼层计数`;
  $("#crumb").textContent = `天道降维互助论坛 / ${{ all: "诸界首页", meta: "天道总坛", eastern: WORLD_LABEL }[state.realm]} / ${state.node === "all" ? "全部分区" : nodeLabel(state.node)}`;
  $("#topics").innerHTML = list.length
    ? list
        .map((item) => {
          const replies = repliesOf(archive, item.id);
          return `<article class="row"><div><div class="titleline"><span class="type ${typeClass(item)}">${esc(postTypeLabels[item.postType])}</span><a class="title" href="#topic=${esc(item.id)}" data-topic="${esc(item.id)}">${esc(item.title)}</a></div><div class="meta"><span>${esc(authorName(item.author))}</span>${(item.tags ?? []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}<span>${esc(item.reviewNote ?? reliabilityLabels[item.reliability])}</span></div></div><div class="metric"><strong>${replies.length} 条</strong>收录回复</div><div class="time"><strong>${esc(item.archiveTime ?? "王朝档案")}</strong>${item.archiveGap ? "有缺页标记" : "维护组创作"}</div></article>`;
        })
        .join("")
    : '<div class="empty">没有匹配主题。试试删掉关键词，或点「重置筛选」回到诸界首页。</div>';
  renderCuratedNotes();
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
  })
);
$<HTMLInputElement>("#q").addEventListener("input", (event) => {
  state = { ...state, q: (event.target as HTMLInputElement).value.trim() };
  renderList();
});
$("#resetFilters").addEventListener("click", () => {
  state = { ...initialForumState };
  $<HTMLInputElement>("#q").value = "";
  renderList();
});

// ---------- topic ----------
function renderAttachment() {
  if (!currentTopic) return;
  const attachment = currentTopic.moduleAttachment;
  $("#moduleAttachment").innerHTML = attachment
    ? `<section class="attachment"><h3>🧩 模块附件 · ${esc(attachment.label)}（第 ${esc(attachment.version)} 版）</h3>
      <div class="chips"><span>建议身份：${esc(identityLabel(attachment.suggestedIdentity))}</span>${attachment.capabilities.map((id) => `<span>${esc(capabilityLabel(id))}</span>`).join("")}${attachment.experts.map((id) => `<span>镜头：${esc(expertLabel(id))}</span>`).join("")}</div>
      <p>当前本局：${esc(activeProfile().identity)} · ${esc(activeProfile().agenda)}</p>
      <p>${esc(attachment.note)}</p>
      <a class="btn primarybtn" href="${esc(forgeHref(BASE, currentTopic.id))}">带着这篇帖子去模块工坊核对配置 ↗</a></section>`
    : "";
}

function openTopic(rawId: string) {
  const id = resolveTopicId(archive, rawId);
  const item = id ? thread(id) : undefined;
  if (!item) {
    notify("没有找到这篇档案");
    return;
  }
  currentTopic = item;
  replyShown = 4;
  $("#drawerKicker").textContent = `${nodeLabel(item.node)} · ${postTypeLabels[item.postType]}`;
  $("#drawerTitle").textContent = item.title;
  $("#drawerMeta").innerHTML = `<span>${esc(authorName(item.author))}</span><span>· ${esc(item.author.statusLabel ?? "")}</span><span>· ${esc(item.archiveTime ?? "王朝档案")}</span>`;
  $("#provenance").innerHTML = `<details><summary>来源：${esc(provenanceLabels[item.provenance.kind])} · ${esc(item.reviewNote ?? reliabilityLabels[item.reliability])} · 编号 ${esc(item.id)}</summary><p>本帖和下列楼层均来自仓库创作档案（${esc(item.provenance.reference)}），不是真人社区发言。作者状态为叙事设定，声望不代表可靠度；「身份已终止」不等于穿越者本人死亡。</p><a href="${esc(sourceFileFor(item))}" target="_blank" rel="noopener noreferrer">查看仓库来源 ↗</a>${item.postType === "community-gateway" ? "<p>当前没有已授权导入的真人帖子。真人发言、回复和互动数量请到原始 Discussions 查看。</p>" : ""}</details>`;
  $("#drawerPost").innerHTML = bodyParagraphs(item.body)
    .map((paragraph) => `<p>${esc(paragraph).replace(/\n/g, "<br>")}</p>`)
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
  dialog.scrollTop = 0;
  if (alreadyOpen) $("#topicDialog [data-close]").focus();
  history.replaceState(null, "", `#topic=${item.id}`);
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
          `<article class="reply"><div class="reply-author"><span class="avatar">${esc([...authorName(reply.author)][0])}</span><div><b>${esc(authorName(reply.author))}</b><div class="caption">${esc(reply.author.statusLabel ?? "")} · ${esc(reply.archiveTime ?? "")} · ${esc(postTypeLabels[reply.replyType])}</div></div><span class="floor">#${index + 1}</span></div><p>${esc(reply.body)}</p></article>`
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
  openTopic(link.dataset.topic!);
});
window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#topic=")) openTopic(decodeURIComponent(location.hash.slice(7)));
  else $<HTMLDialogElement>("#topicDialog").close();
});
$("#aboutCommunity").addEventListener("click", () => openTopic("tf-ancient-china-community-gateway"));

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
    await navigator.clipboard.writeText(new URL(`#topic=${currentTopic.id}`, location.href).href);
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
renderList();
if (location.hash.startsWith("#topic=")) openTopic(decodeURIComponent(location.hash.slice(7)));
