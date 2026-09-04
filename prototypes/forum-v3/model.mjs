export const DISCUSSIONS = 'https://github.com/willwefind/rp-module-forge/discussions';
export const categories = [
  ['rp-实战回报', '🎭 RP 实战回报', '开局、转折、翻车与后来才懂的事。'],
  ['模块投稿', '🧩 模块投稿', '分享模块组合、适用身份与使用边界。'],
  ['世界包提案', '🌌 世界包提案', '提出新世界；提案不代表世界包已开放。'],
  ['经验复现与勘误', '🧪 经验复现与勘误', '带着条件、反例或补充材料回来。'],
  ['求助与问答', '🙋 求助与问答', '使用、配置和贡献问题，向真人老乡请教。'],
  ['反馈与点子', '💡 反馈与点子', '哪里别扭、哪里想多走一步，告诉维护组。'],
  ['天道公告', '📣 天道公告', '维护组发布；普通成员请使用反馈或问答分类。'],
];
export function discussionURL(slug, title = '') {
  if (!categories.some(c => c[0] === slug)) throw new Error('未知分类');
  const url = new URL(`${DISCUSSIONS}/new`);
  url.searchParams.set('category', slug);
  if (title) url.searchParams.set('title', `【档案评议】${title}`);
  return url.href;
}
export const PROFILE_KEY = 'td-profile-store-v4';
export const WORLD = '东方古代 · 架空王朝';
export const baseProfiles = [
  {id:'servant-leisure',name:'婢女小日子线',identity:'奴婢 / 仆役',agenda:'偷得浮生 / 小日子',permission:'极低',world:WORLD,notes:''},
  {id:'emperor-survival',name:'永宁帝线',identity:'皇帝',agenda:'求存 / 治世',permission:'极高但信息受过滤',world:WORLD,notes:''},
  {id:'artist-road',name:'流浪画师线',identity:'普通人 / 游民画师',agenda:'诗画 / 自由生活',permission:'低',world:WORLD,notes:''},
];
const limits = {name:40,identity:60,agenda:80,permission:80,world:80,notes:1200};
export function cleanProfile(p) {
  if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !p.id || p.id.length > 100) return null;
  const result = {id:p.id};
  for (const [key,max] of Object.entries(limits)) {
    if (key !== 'notes' && (typeof p[key] !== 'string' || !p[key].trim())) return null;
    result[key] = typeof p[key] === 'string' ? p[key].trim().slice(0,max) : '';
  }
  return result;
}
export function normalizeStore(input) {
  if (!input || input.version !== 4 || !Array.isArray(input.profiles) || !input.profiles.length) throw new Error('档案文件格式不正确');
  const profiles = input.profiles.map(cleanProfile);
  if (profiles.some(p => !p) || new Set(profiles.map(p=>p.id)).size !== profiles.length) throw new Error('档案有缺失字段或重复编号');
  return {version:4,profiles,activeId:profiles.some(p=>p.id === input.activeId) ? input.activeId : profiles[0].id};
}
export function readStore(storage) {
  const fallback = {version:4,profiles:baseProfiles.map(p=>({...p})),activeId:baseProfiles[0].id};
  try {
    const raw = storage.getItem(PROFILE_KEY);
    if (raw) return {store:normalizeStore(JSON.parse(raw)),warning:'',writable:true};
    const legacy = storage.getItem('td-profiles-v3');
    if (legacy) return {store:normalizeStore({version:4,profiles:JSON.parse(legacy),activeId:storage.getItem('td-active-profile-v3')}),warning:'已读取旧版档案，下一次保存会升级；旧副本保留。',writable:true};
    return {store:fallback,warning:'',writable:true};
  } catch {
    return {store:fallback,warning:'无法读取本地档案。原始数据未覆盖；当前使用临时档案，请导出本次修改后再处理浏览器存储。',writable:false};
  }
}
export function saveStore(storage, store) { storage.setItem(PROFILE_KEY, JSON.stringify(normalizeStore(store))); }
export function upsertProfile(store, profile) {
  const p = cleanProfile(profile);
  if (!p) throw new Error('请完整填写档案字段');
  const profiles = store.profiles.some(x=>x.id===p.id) ? store.profiles.map(x=>x.id===p.id?p:x) : [...store.profiles,p];
  return normalizeStore({version:4,profiles,activeId:p.id});
}
export function deleteProfile(store, id) {
  if (store.profiles.length <= 1) throw new Error('至少保留一份档案');
  const profiles = store.profiles.filter(p=>p.id!==id);
  return normalizeStore({...store,profiles});
}
export function filterTopics(topics, state) {
  return topics.filter(t => (state.realm === 'all' || (state.realm === 'meta' ? t.node === 'meta' : t.node !== 'meta'))
    && (state.node === 'all' || state.node === t.node)
    && (state.tab === 'all' || (state.tab === 'featured' && t.featured) || (state.tab === 'modules' && t.module) || (state.tab === 'knowledge' && t.knowledge) || (state.tab === 'maintainer' && t.node === 'meta'))
    && (!state.q || [t.title,t.author,t.status,...t.tags,...t.body,...t.replies.flatMap(r=>[r.author,r.text])].join(' ').toLowerCase().includes(state.q.toLowerCase())));
}
