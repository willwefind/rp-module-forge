import test from "node:test";
import assert from "node:assert/strict";
import { ancientChinaPackV01 } from "@rpmf/pack-ancient-china/canonical";
import {
  PROFILE_KEY_V5,
  applyImport,
  baseProfiles,
  catalogFromPack,
  deleteProfile,
  migrateProfileV4,
  normalizeStore,
  parseImport,
  readStore,
  saveStore,
  upsertProfile,
  type LocalRpProfile,
  type StorageLike
} from "../src/profile/store.ts";
import { PROFILE_KEY_V4, PROFILE_KEY_V3, ACTIVE_KEY_V3 } from "../src/profile/storeV4.ts";
import { discussionURL } from "../src/forum/model.ts";

const catalog = catalogFromPack(ancientChinaPackV01, "eastern-ancient");
const memory = (data: Record<string, string> = {}): StorageLike & { data: Record<string, string> } => ({
  data,
  getItem: (key) => data[key] ?? null,
  setItem: (key, value) => {
    data[key] = value;
  }
});
const v4Profile = (over: Partial<Record<string, string>> = {}) => ({
  id: "servant-leisure",
  name: "婢女小日子线",
  identity: "奴婢 / 仆役",
  agenda: "偷得浮生 / 小日子",
  permission: "极低",
  world: "东方古代 · 架空王朝",
  notes: "只留本地",
  ...over
});

test("create, rename, switch and delete survive a reload; permission is never stored", () => {
  const storage = memory();
  let { store } = readStore(storage, catalog);
  assert.equal(store.profiles.length, 3);
  store = upsertProfile(store, { version: 5, id: "new", name: "自己的路", realmId: "eastern-ancient", worldPackId: "ancient-china", identityId: "merchant", agenda: { routeId: "commerce-wealth" }, notes: "只留本地" }, catalog);
  store = upsertProfile(store, { ...store.profiles.at(-1)!, name: "重新起名" }, catalog);
  saveStore(storage, store, catalog);
  store = readStore(storage, catalog).store;
  assert.equal(store.activeId, "new");
  assert.equal(store.profiles.at(-1)!.name, "重新起名");
  assert.equal(store.profiles.at(-1)!.notes, "只留本地");
  assert.ok(!/permission/.test(storage.data[PROFILE_KEY_V5]), "permission must not be persisted");
  saveStore(storage, { ...store, activeId: "servant-leisure" }, catalog);
  assert.equal(readStore(storage, catalog).store.activeId, "servant-leisure");
  store = deleteProfile(store, "new", catalog);
  assert.equal(store.profiles.length, 3);
  assert.throws(() => deleteProfile({ ...store, profiles: [store.profiles[0]] }, store.profiles[0].id, catalog));
});

test("a profile cannot claim an identity or route the pack does not define", () => {
  const good = baseProfiles(catalog)[0];
  assert.throws(() => normalizeStore({ version: 5, profiles: [{ ...good, identityId: "god-emperor" }], activeId: good.id }, catalog));
  assert.throws(() => normalizeStore({ version: 5, profiles: [{ ...good, agenda: { routeId: "rule-the-world" } }], activeId: good.id }, catalog));
  assert.throws(() => normalizeStore({ version: 5, profiles: [{ ...good, worldPackId: "xianxia" }], activeId: good.id }, catalog));
  assert.throws(() => normalizeStore({ version: 5, profiles: [{ ...good, identityId: null }], activeId: good.id }, catalog), /未知身份/);
});

test("v4 -> v5 migration maps known labels deterministically and keeps the old copy until the first save", () => {
  const raw = JSON.stringify({ version: 4, profiles: [v4Profile(), v4Profile({ id: "e", name: "永宁帝线", identity: "皇帝", agenda: "求存 / 治世", permission: "极高但信息受过滤" })], activeId: "e" });
  const storage = memory({ [PROFILE_KEY_V4]: raw });
  const result = readStore(storage, catalog);
  assert.equal(result.migratedFrom, 4);
  assert.equal(result.store.activeId, "e");
  const [servant, emperor] = result.store.profiles;
  assert.equal(servant.identityId, "servant");
  assert.deepEqual(servant.agenda, { routeId: "pleasure-and-stability" });
  assert.equal(servant.notes, "只留本地");
  assert.equal(servant.requiresReview, undefined);
  assert.equal(emperor.identityId, "emperor");
  assert.deepEqual(emperor.agenda, { routeId: "benevolent-rule" });
  assert.equal(storage.data[PROFILE_KEY_V4], raw, "old store untouched before save");
  assert.equal(storage.data[PROFILE_KEY_V5], undefined);
  saveStore(storage, result.store, catalog);
  assert.equal(storage.data[PROFILE_KEY_V4], raw, "old copy still kept after save");
  assert.equal(readStore(storage, catalog).store.profiles[1].identityId, "emperor");
});

test("unknown legacy identity / route / world is flagged for review with the original wording, never guessed", () => {
  const migrated = migrateProfileV4(v4Profile({ identity: "军旅小卒", agenda: "混到粮官手下", world: "修仙宗门", permission: "天下兵马皆归我" }), catalog);
  assert.equal(migrated.identityId, null);
  assert.ok(migrated.requiresReview);
  assert.match(migrated.requiresReview!.reason, /世界包、身份、路线/);
  assert.deepEqual(migrated.requiresReview!.legacy, { world: "修仙宗门", identity: "军旅小卒", agenda: "混到粮官手下", permission: "天下兵马皆归我" });
  assert.deepEqual(migrated.agenda, { routeId: "custom", customGoal: "混到粮官手下" });
  const stored = normalizeStore({ version: 5, profiles: [migrated], activeId: migrated.id }, catalog);
  assert.equal(stored.profiles[0].identityId, null);
  assert.ok(!("permission" in stored.profiles[0]), "no top-level permission field: the legacy text stays inside requiresReview.legacy only");
  assert.equal(stored.profiles[0].requiresReview?.legacy.permission, "天下兵马皆归我");
});

test("the oldest prototype store (v3 keys) migrates too", () => {
  const storage = memory({ [PROFILE_KEY_V3]: JSON.stringify([v4Profile()]), [ACTIVE_KEY_V3]: "servant-leisure" });
  const result = readStore(storage, catalog);
  assert.equal(result.migratedFrom, 3);
  assert.equal(result.store.profiles[0].identityId, "servant");
});

test("malformed, empty or corrupt storage recovers without overwriting anything", () => {
  for (const raw of ["{", "null", "{}", JSON.stringify({ version: 5, profiles: [] }), JSON.stringify({ version: 5, profiles: [{ id: "bad" }] })]) {
    const storage = memory({ [PROFILE_KEY_V5]: raw });
    const result = readStore(storage, catalog);
    assert.equal(result.writable, false);
    assert.ok(result.warning);
    assert.equal(storage.data[PROFILE_KEY_V5], raw);
  }
  const blocked: StorageLike = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("quota");
    }
  };
  assert.equal(readStore(blocked, catalog).writable, false);
});

test("JSON import fails closed on malformed or unknown versions and never touches the current store by itself", () => {
  const current = readStore(memory(), catalog).store;
  assert.throws(() => parseImport("{", catalog, current), /JSON/);
  assert.throws(() => parseImport(JSON.stringify({ version: 9, profiles: [] }), catalog, current), /版本/);
  assert.throws(() => parseImport(JSON.stringify({ version: 5, profiles: [{ id: "x" }] }), catalog, current));
  const plan = parseImport(JSON.stringify({ version: 4, profiles: [v4Profile(), v4Profile({ id: "extra", name: "外来", identity: "商贾", agenda: "经商 / 致富 / 产业路线" })], activeId: "extra" }), catalog, current);
  assert.equal(plan.sourceVersion, 4);
  assert.deepEqual(plan.duplicateIds, ["servant-leisure"]);
  assert.deepEqual(plan.needsReview, []);
  assert.equal(current.profiles.length, 3, "parsing an import must not mutate the current store");
});

test("import modes: skip duplicates by default, overwrite only when asked, replace only when confirmed", () => {
  const current = readStore(memory(), catalog).store;
  const incoming: LocalRpProfile = { ...baseProfiles(catalog)[0], name: "导入版婢女", identityId: "scholar" };
  const extra: LocalRpProfile = { ...baseProfiles(catalog)[0], id: "extra", name: "外来" };
  const plan = parseImport(JSON.stringify({ version: 5, profiles: [incoming, extra], activeId: "extra" }), catalog, current);
  const skipped = applyImport(current, plan, "merge-skip", catalog);
  assert.equal(skipped.profiles.length, 4);
  assert.equal(skipped.profiles[0].name, "婢女小日子线");
  assert.equal(skipped.activeId, current.activeId);
  const overwritten = applyImport(current, plan, "merge-overwrite", catalog);
  assert.equal(overwritten.profiles[0].name, "导入版婢女");
  assert.equal(overwritten.profiles[0].identityId, "scholar");
  const replaced = applyImport(current, plan, "replace", catalog);
  assert.deepEqual(replaced.profiles.map((profile) => profile.id), ["servant-leisure", "extra"]);
  assert.equal(replaced.activeId, "extra");
});

test("private notes never travel into a Discussion URL", () => {
  const url = new URL(discussionURL("经验复现与勘误", "一篇公开档案"));
  assert.deepEqual([...url.searchParams.keys()], ["category", "title"]);
  assert.ok(!url.href.includes("notes"));
});
