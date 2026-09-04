import {categories,discussionURL,readStore,saveStore,upsertProfile,deleteProfile,WORLD,filterTopics} from './model.mjs';
import {topics,nodeNames} from './content.mjs';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage = {getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)};
const loaded = readStore(storage);
let profileStore = loaded.store;
let writable = loaded.writable;
let state = {realm:'all',node:'all',tab:'all',q:''};
let currentTopic, replyShown=4, editingId, toastTimer;
function notify(message) { $('#toast').textContent=message; $('#toast').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').hidden=true,4500); }
function storageWarning(message) { $('#storageWarning').textContent=message; $('#storageWarning').hidden=!message; }
storageWarning(loaded.warning);
function persist(next) {
  profileStore=next;
  try {
    if (!writable) throw new Error('只读恢复模式');
    saveStore(storage,next); storageWarning(''); return true;
  } catch {
    storageWarning('本次修改仅在当前页面有效，尚未保存到浏览器。请在档案柜导出备份；刷新可能丢失本次修改。'); return false;
  }
}
function activeProfile() { return profileStore.profiles.find(p=>p.id===profileStore.activeId); }
function renderProfile() {
  const p=activeProfile();
  $('#profileSelect').innerHTML=profileStore.profiles.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
  $('#profileSelect').value=p.id;
  for (const [id,key] of Object.entries({profileIdentity:'identity',profileWorld:'world',profileName:'name',profileAgenda:'agenda',profilePermission:'permission'})) $('#'+id).textContent=p[key];
  $('#profileAvatar').textContent=[...p.identity][0];
  $('#profileBrief').textContent=`${p.identity} · ${p.agenda}`;
  renderAttachment();
}
function openDialog(id) { const dialog=$('#'+id); if (!dialog.open) dialog.showModal(); }
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('#topicDialog').addEventListener('close',()=>{if(location.hash.startsWith('#topic='))history.replaceState(null,'',location.pathname+location.search);});
function openProfile(isNew=false) {
  const p=isNew ? {id:crypto.randomUUID(),name:'',world:WORLD,identity:'待设置',agenda:'开放路线',permission:'待核对',notes:''} : activeProfile();
  editingId=p.id; $('#profileTitle').textContent=isNew?'新建本局档案':'本局档案柜 · 编辑 / 改名';
  const form=$('#profileForm'); form.reset();
  // Preserve a legacy world's value as a labelled legacy record, without offering new unopened packs.
  form.elements.world.innerHTML=`<option>${esc(WORLD)}</option>`+(p.world!==WORLD?`<option>${esc(p.world)}</option>`:'');
  for(const key of ['name','world','identity','agenda','permission','notes'])form.elements[key].value=p[key];
  $('#profileError').textContent=''; $('#deleteProfile').hidden=isNew;
  $('#deleteProfile').disabled=profileStore.profiles.length<=1;
  $('#deleteProfile').title=profileStore.profiles.length<=1?'至少保留一份档案':'';
  openDialog('profileDialog'); form.elements.name.focus();
}
$('#editProfile').onclick=()=>openProfile(); $('#railEdit').onclick=()=>openProfile(); $('#newProfile').onclick=()=>openProfile(true);
$('#profileSelect').onchange=e=>{const saved=persist({...profileStore,activeId:e.target.value});renderProfile();notify(saved?'已切换并记住本局档案':'已临时切换；请查看保存提示');};
$('#profileForm').onsubmit=e=>{
  e.preventDefault();
  try {
    const next=upsertProfile(profileStore,{...Object.fromEntries(new FormData(e.currentTarget)),id:editingId});
    const saved=persist(next); renderProfile(); $('#profileDialog').close();notify(saved?'档案已保存在本浏览器':'档案仅在本次页面暂存，请导出备份');
  } catch(error) { $('#profileError').textContent=error.message; }
};
$('#deleteProfile').onclick=()=>{$('#deleteText').textContent=`确定删除「${activeProfile().name}」？`;openDialog('deleteDialog');};
$('#confirmDelete').onclick=()=>{
  try {const saved=persist(deleteProfile(profileStore,editingId));$('#deleteDialog').close();$('#profileDialog').close();renderProfile();notify(saved?'已删除该档案':'仅在本页删除，浏览器存储尚未更新');}
  catch(error){notify(error.message);}
};
$('#exportProfiles').onclick=()=>{
  const blob=new Blob([JSON.stringify(profileStore,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='天道本局档案备份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('已导出当前已保存到档案柜的数据；未提交的表单修改不包含在内。');
};
function renderList() {
  const realmTopics=topics.filter(t=>state.realm==='all'||(state.realm==='meta'?t.node==='meta':t.node!=='meta'));
  $('#nodes').innerHTML='<h3>论坛分区</h3>'+Object.entries(nodeNames).filter(([id])=>id==='all'||realmTopics.some(t=>t.node===id)).map(([id,name])=>`<button class="node ${state.node===id?'on':''}" data-node="${id}" aria-pressed="${state.node===id}">${name}<span class="count">${id==='all'?realmTopics.length:realmTopics.filter(t=>t.node===id).length}</span></button>`).join('');
  $$('#nodes [data-node]').forEach(b=>b.onclick=()=>{state.node=b.dataset.node;renderList();});
  const list=filterTopics(topics,state);
  $('#resultCount').textContent=`${list.length} 篇主题 · 收录回复按实际楼层计数`;
  $('#crumb').textContent=`天道降维互助论坛 / ${{all:'诸界首页',meta:'天道总坛',eastern:'东方古代 · 架空王朝'}[state.realm]} / ${nodeNames[state.node]}`;
  $('#topics').innerHTML=list.length?list.map(t=>`<article class="row"><div><div class="titleline"><span class="type ${t.module?'module':t.knowledge?'good':t.gap?'warn':''}">${t.type}</span><a class="title" href="#topic=${t.id}" data-topic="${t.id}">${esc(t.title)}</a></div><div class="meta"><span>${esc(t.author)}</span>${t.tags.map(tag=>`<span class="tag">${esc(tag)}</span>`).join('')}<span>${esc(t.review)}</span></div></div><div class="metric"><strong>${t.replies.length} 条</strong>收录回复</div><div class="time"><strong>${esc(t.time)}</strong>${t.gap?'有缺页标记':'维护组创作'}</div></article>`).join(''):'<div class="empty">没有匹配主题。试试删掉关键词，或点「重置筛选」回到诸界首页。</div>';
  $$('[data-realm]').forEach(b=>{b.classList.toggle('active',b.dataset.realm===state.realm);b.setAttribute('aria-pressed',b.dataset.realm===state.realm);});
  $$('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===state.tab);b.setAttribute('aria-pressed',b.dataset.tab===state.tab);});
  $('#ancientPack').classList.toggle('active',state.realm==='eastern');
}
$$('[data-realm]').forEach(b=>b.onclick=()=>{state.realm=b.dataset.realm;state.node='all';state.tab='all';renderList();});
$('#ancientPack').onclick=()=>{state.realm='eastern';state.node='all';state.tab='all';renderList();};
$$('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;state.node='all';state.realm=b.dataset.tab==='maintainer'?'meta':'all';renderList();});
$('#q').oninput=e=>{state.q=e.target.value.trim();renderList();};
$('#resetFilters').onclick=()=>{state={realm:'all',node:'all',tab:'all',q:''};$('#q').value='';renderList();};
$$('[data-planned]').forEach(b=>b.onclick=()=>{$('#plannedText').textContent=`「${b.dataset.planned}」仍是规划中的世界，没有可安装的完整世界包。`;$('#proposeWorld').href=discussionURL('世界包提案');openDialog('plannedDialog');});
function renderAttachment() {
  if(!currentTopic)return;
  $('#moduleAttachment').innerHTML=currentTopic.module?`<section class="attachment"><h3>🧩 模块附件 · 第108版说明</h3><p>当前本局：${esc(activeProfile().identity)} · ${esc(activeProfile().agenda)}</p><p>原设计面向皇帝治理情境。请按本局身份与可用信息手动适配；此处不会安装模块或修改档案。</p><a class="btn primarybtn" href="../">到模块工坊核对配置 ↗</a></section>`:'';
}
function openTopic(id) {
  const t=topics.find(t=>t.id===id);if(!t){notify('没有找到这篇档案');return;}
  currentTopic=t;replyShown=4;
  $('#drawerKicker').textContent=`${nodeNames[t.node]} · ${t.type}`;
  $('#drawerTitle').textContent=t.title;
  $('#drawerMeta').innerHTML=`<span>${esc(t.author)}</span><span>· ${esc(t.status)}</span><span>· ${esc(t.time)}</span>`;
  $('#provenance').innerHTML=`<details><summary>来源：维护组创作 / 档案角色 · ${esc(t.review)}</summary><p>本帖和下列楼层均来自仓库创作档案（maintainer-seed），不是真人社区发言。作者状态为叙事设定，声望不代表可靠度。</p><a href="https://github.com/willwefind/rp-module-forge/blob/main/prototypes/forum-v3/content.mjs" target="_blank" rel="noopener noreferrer">查看仓库来源 ↗</a>${t.community?'<p>当前没有已授权导入的真人帖子。真人发言、回复和互动数量请到原始 Discussions 查看。</p>':''}</details>`;
  $('#drawerPost').innerHTML=t.body.map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
  $('#archiveNote').textContent=t.gap||`本帖收录 ${t.replies.length} 条创作档案回复。没有以真人流量或未收录楼层填充计数。`;
  $('#relatedTopics').innerHTML=t.related?'<h3>关联原帖</h3>'+t.related.map(id=>`<button class="reading-link" data-topic="${id}">${esc(topics.find(t=>t.id===id).title)} →</button>`).join(''):'';
  renderAttachment();renderReplies();
  const alreadyOpen=$('#topicDialog').open;openDialog('topicDialog');$('#topicDialog').scrollTop=0;
  if(alreadyOpen)$('#topicDialog [data-close]').focus();
  history.replaceState(null,'',`#topic=${t.id}`);
}
function renderReplies() {
  const total=currentTopic.replies.length,shown=Math.min(replyShown,total);
  $('#replySummary').textContent=`楼层 · 已读入 ${shown} / ${total} 条回复`;
  $('#replies').innerHTML=currentTopic.replies.slice(0,shown).map((r,i)=>`<article class="reply"><div class="reply-author"><span class="avatar">${esc([...r.author][0])}</span><div><b>${esc(r.author)}</b><div class="caption">${esc(r.status)} · ${esc(r.time)} · 创作档案</div></div><span class="floor">#${i+1}</span></div><p>${esc(r.text)}</p></article>`).join('')||(currentTopic.community?'<p class="caption">真人讨论请前往通信口查看。此处未同步外部回复。</p>':'<p class="caption">暂无收录回复。</p>');
  $('#loadMore').hidden=shown>=total;
  $('#loadMore').textContent=`继续阅读（余 ${total-shown} 条）`;
}
$('#loadMore').onclick=()=>{replyShown+=4;renderReplies();};
document.addEventListener('click',e=>{const link=e.target.closest('[data-topic]');if(link){e.preventDefault();openTopic(link.dataset.topic);}});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#topic='))openTopic(location.hash.slice(7));else $('#topicDialog').close();});
$('#aboutCommunity').onclick=()=>openTopic('community-gateway');
function compose(topic=null,intent='') {
  $('#composeContext').hidden=!topic;
  $('#composeContext').textContent=topic?`关联档案：${topic.title}。${intent?`评议方向：${intent}。`:''}仅在勘误表单标题中携带此公开档案标题，请填写具体条件与证据。`:'';
  const sorted=topic?[...categories].sort((a,b)=>(b[0]==='经验复现与勘误')-(a[0]==='经验复现与勘误')):categories;
  $('#categories').innerHTML=sorted.map(([slug,title,desc])=>`<a class="category ${topic&&slug==='经验复现与勘误'?'recommended':''}" href="${esc(discussionURL(slug,topic&&slug==='经验复现与勘误'?`${topic.title}${intent?' · '+intent:''}`:''))}" target="_blank" rel="noopener noreferrer"><b>${title} ↗</b><span>${desc}</span>${slug==='天道公告'?'<small>仅维护者可发布公告</small>':''}</a>`).join('');
  openDialog('composeDialog');
}
$$('[data-compose]').forEach(b=>b.onclick=()=>compose());
$('#reviewTopic').onclick=()=>compose(currentTopic);
$$('[data-review]').forEach(b=>b.onclick=()=>compose(currentTopic,b.dataset.review));
$('#copyTopic').onclick=async()=>{try{await navigator.clipboard.writeText(new URL(`#topic=${currentTopic.id}`,location.href).href);notify('已复制公开档案链接');}catch{notify('浏览器未允许复制，请复制地址栏中的档案链接。');}};
function theme(value) {
  document.documentElement.dataset.theme=value;
  $$('.theme [data-theme]').forEach(b=>{b.classList.toggle('on',b.dataset.theme===value);b.setAttribute('aria-pressed',b.dataset.theme===value);});
}
try{const value=storage.getItem('td-theme-v3');theme(['day','night','eye'].includes(value)?value:'day');}catch{theme('day');}
$$('.theme [data-theme]').forEach(b=>b.onclick=()=>{theme(b.dataset.theme);try{storage.setItem('td-theme-v3',b.dataset.theme);}catch{notify('已切换配色；浏览器未允许保存偏好。');}});
renderProfile();renderList();
if(location.hash.startsWith('#topic='))openTopic(location.hash.slice(7));
