import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {categories,discussionURL,PROFILE_KEY,baseProfiles,readStore,saveStore,upsertProfile,deleteProfile,normalizeStore,filterTopics} from '../forum-v3/model.mjs';
import {topics,nodeNames} from '../forum-v3/content.mjs';
const memory = (data={})=>({getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=v;}});
test('profile create, rename, edit, switch and delete survive reload',()=>{
  const storage=memory(); let {store}=readStore(storage);
  store=upsertProfile(store,{...baseProfiles[0],id:'new',name:'自己的路',notes:'只留本地'});
  store=upsertProfile(store,{...store.profiles.at(-1),name:'重新起名',identity:'商贾',agenda:'小生意',permission:'商铺内'});
  saveStore(storage,store);store=readStore(storage).store;
  assert.equal(store.activeId,'new');assert.equal(store.profiles.at(-1).notes,'只留本地');assert.equal(store.profiles.at(-1).name,'重新起名');
  saveStore(storage,{...store,activeId:store.profiles[0].id});assert.equal(readStore(storage).store.activeId,baseProfiles[0].id);
  store=deleteProfile(store,'new');saveStore(storage,store);assert.equal(readStore(storage).store.profiles.length,3);
  assert.equal(store.activeId,baseProfiles[0].id);
  assert.throws(()=>deleteProfile({...store,profiles:[store.profiles[0]]},store.activeId));
});
test('legacy migration preserves private data and leaves old storage untouched',()=>{
  const legacy=JSON.stringify([{...baseProfiles[0],notes:undefined,avatar:'婢'}]);
  const storage=memory({'td-profiles-v3':legacy,'td-active-profile-v3':'stale'});
  const {store}=readStore(storage);assert.equal(store.activeId,baseProfiles[0].id);assert.equal(store.profiles[0].notes,'');
  saveStore(storage,store);assert.equal(storage.getItem('td-profiles-v3'),legacy);
});
test('malformed, empty, duplicate and unavailable storage recover without overwriting',()=>{
  for(const raw of ['{','null','{}',JSON.stringify({version:4,profiles:[]}),JSON.stringify({version:4,profiles:[baseProfiles[0],baseProfiles[0]]})]) {
    const storage=memory({[PROFILE_KEY]:raw});const result=readStore(storage);
    assert.equal(result.writable,false);assert.ok(result.warning);assert.equal(storage.getItem(PROFILE_KEY),raw);
  }
  const blocked={getItem(){throw new Error('blocked');},setItem(){throw new Error('quota');}};
  assert.equal(readStore(blocked).writable,false);assert.throws(()=>saveStore(blocked,readStore(memory()).store));
  assert.throws(()=>normalizeStore({version:4,profiles:[{id:'bad'}]}));
});
test('all seven links use the actual Chinese form slugs and only public title context',()=>{
  assert.equal(categories.length,7);
  for(const [slug] of categories) {
    assert.ok(existsSync(new URL(`../../.github/DISCUSSION_TEMPLATE/${slug}.yml`,import.meta.url)));
    const url=new URL(discussionURL(slug,'一篇公开档案 & 勘误'));
    assert.equal(url.hostname,'github.com');assert.equal(url.pathname,'/willwefind/rp-module-forge/discussions/new');
    assert.equal(url.searchParams.get('category'),slug);assert.deepEqual([...url.searchParams.keys()],['category','title']);
  }
  assert.throws(()=>discussionURL('unknown'));
});
test('content identities, provenance, independent floors and full-text reply search',()=>{
  assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
  for(const t of topics){assert.ok(nodeNames[t.node]);assert.equal(t.provenance,'maintainer-seed');assert.ok(t.status&&t.review);assert.ok(t.body.length>=3);assert.equal(new Set(t.replies.map(r=>r.text)).size,t.replies.length);assert.ok(!('count' in t));assert.ok(!('real' in t));}
  assert.ok(topics[0].body.join('').length>1800);
  assert.equal(new Set(topics.map(t=>t.replies)).size,topics.length);
  const state={realm:'all',node:'all',tab:'all',q:'那盏灯后来还了'};
  assert.deepEqual(filterTopics(topics,state).map(t=>t.id),['yongning-first-year']);
  assert.ok(filterTopics(topics,{...state,q:'',tab:'modules'}).length);
  assert.ok(filterTopics(topics,{...state,q:'',tab:'knowledge'}).length);
  assert.ok(topics[0].gap.includes('未发现续篇'));
});
test('browsing realms never mutates the selected profile',()=>{
  const store=readStore(memory()).store;const before=JSON.stringify(store);
  for(const realm of ['all','meta','eastern'])filterTopics(topics,{realm,node:'all',tab:'all',q:''});
  assert.equal(JSON.stringify(store),before);
});
test('Pages includes module assets and prototype provides accessible native dialogs',()=>{
  const workflow=readFileSync(new URL('../../.github/workflows/pages.yml',import.meta.url),'utf8');
  assert.ok(workflow.includes('cp -R prototypes/.'));
  const html=readFileSync(new URL('../forum-first-concept-v3.html',import.meta.url),'utf8');
  assert.ok(html.includes('type="module" src="./forum-v3/app.mjs"'));assert.ok(html.includes('aria-labelledby="profileTitle"'));
  assert.ok(!html.includes('\u8001\u4e61\u9057\u8a00\u5e93'));
});
