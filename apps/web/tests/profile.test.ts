import test from "node:test";
import assert from "node:assert/strict";
import { ancientChinaPackV01 } from "@rpmf/pack-ancient-china/canonical";
import {
  PROFILE_KEY_V5,
  applyImport,
  baseProfiles,
  catalogFromPack,
  commit,
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

// ---------------------------------------------------------------------------
// R1 · multi-tab concurrency: operations, revisions, locks, conflicts
// ---------------------------------------------------------------------------

const fakeLocks = () => {
  let chain: Promise<unknown> = Promise.resolve();
  const api = {
    held: 0,
    max: 0,
    calls: 0,
    request<T>(_name: string, callback: () => Promise<T>): Promise<T> {
      api.calls += 1;
      const run = chain.then(async () => {
        api.held += 1;
        api.max = Math.max(api.max, api.held);
        try {
          return await callback();
        } finally {
          api.held -= 1;
        }
      });
      chain = run.then(
        () => undefined,
        () => undefined
      );
      return run;
    }
  };
  return api;
};
const tab = (storage: StorageLike) => readStore(storage, catalog).store;
const rename = (profile: LocalRpProfile, name: string) => ({ ...profile, name });

test("R1: two tabs editing different profiles both keep their changes", async () => {
  const storage = memory();
  const a = tab(storage);
  const b = tab(storage);
  const first = await commit(storage, catalog, { type: "upsert", profile: rename(a.profiles[0], "A 改的"), baseRevision: 0 });
  assert.equal(first.status, "saved");
  const second = await commit(storage, catalog, { type: "upsert", profile: rename(b.profiles[1], "B 改的"), baseRevision: 0 });
  assert.equal(second.status, "saved");
  const latest = tab(storage);
  assert.deepEqual(latest.profiles.slice(0, 2).map((profile) => [profile.name, profile.revision]), [["A 改的", 1], ["B 改的", 1]]);
  assert.equal(latest.revision, 2);
});

test("R1: a stale save of the same profile is reported as a conflict and the draft is not lost", async () => {
  const storage = memory();
  const a = tab(storage);
  const b = tab(storage);
  assert.equal((await commit(storage, catalog, { type: "upsert", profile: rename(a.profiles[0], "A 先存"), baseRevision: 0 })).status, "saved");
  const draft = { ...rename(b.profiles[0], "B 的草稿"), notes: "B 的私密备注" };
  const result = await commit(storage, catalog, { type: "upsert", profile: draft, baseRevision: 0 });
  assert.equal(result.status, "conflict");
  if (result.status !== "conflict") return;
  assert.equal(result.kind, "profile-changed");
  assert.equal(result.latestProfile?.name, "A 先存");
  assert.equal(tab(storage).profiles[0].name, "A 先存", "the stale write must not land");
  assert.equal(draft.name, "B 的草稿", "the caller still holds its draft");
  // The reader reviewed the latest copy and chose to keep the draft: rebase explicitly and save again.
  const retry = await commit(storage, catalog, { type: "upsert", profile: draft, baseRevision: result.latestProfile!.revision! });
  assert.equal(retry.status, "saved");
  assert.equal(tab(storage).profiles[0].name, "B 的草稿");
  assert.equal(tab(storage).profiles[0].revision, 2);
});

test("R1: simultaneous commits are serialized by the lock and both land; without a lock the result says so", async () => {
  const storage = memory();
  const locks = fakeLocks();
  const a = tab(storage);
  const b = tab(storage);
  const [first, second] = await Promise.all([
    commit(storage, catalog, { type: "upsert", profile: rename(a.profiles[0], "同时 A"), baseRevision: 0 }, { locks }),
    commit(storage, catalog, { type: "upsert", profile: rename(b.profiles[1], "同时 B"), baseRevision: 0 }, { locks })
  ]);
  assert.equal(first.status, "saved");
  assert.equal(second.status, "saved");
  assert.ok(first.status === "saved" && first.atomic);
  assert.equal(locks.calls, 2);
  assert.equal(locks.max, 1, "critical sections never overlap");
  const latest = tab(storage);
  assert.deepEqual(latest.profiles.slice(0, 2).map((profile) => profile.name), ["同时 A", "同时 B"]);
  assert.equal(latest.revision, 2);
  const plain = await commit(storage, catalog, { type: "activate", id: latest.profiles[1].id });
  assert.ok(plain.status === "saved" && plain.atomic === false, "no lock manager → honest non-atomic result");
});

test("R1: deleting, activating and creating across tabs neither resurrects nor loses profiles", async () => {
  const storage = memory();
  const a = tab(storage);
  const b = tab(storage);
  const doomed = a.profiles[2].id;
  assert.equal((await commit(storage, catalog, { type: "delete", id: doomed })).status, "saved");
  const stale = await commit(storage, catalog, { type: "activate", id: doomed });
  assert.equal(stale.status, "conflict");
  assert.ok(stale.status === "conflict" && stale.kind === "profile-deleted");
  assert.equal(tab(storage).profiles.length, 2, "a stale activate does not resurrect the deleted profile");
  assert.equal((await commit(storage, catalog, { type: "activate", id: b.profiles[1].id })).status, "saved");
  const created: LocalRpProfile = { ...baseProfiles(catalog)[0], id: "fresh", name: "A 新建" };
  assert.equal((await commit(storage, catalog, { type: "upsert", profile: created, baseRevision: null })).status, "saved");
  // B still holds a copy without "fresh"; its unrelated edit must not wipe it.
  assert.equal((await commit(storage, catalog, { type: "upsert", profile: rename(b.profiles[0], "B 改名"), baseRevision: 0 })).status, "saved");
  const latest = tab(storage);
  assert.deepEqual(latest.profiles.map((profile) => profile.id), ["servant-leisure", "emperor-survival", "fresh"]);
  assert.equal(latest.activeId, "servant-leisure", "an upsert makes the saved profile active, as before");
  assert.equal((await commit(storage, catalog, { type: "delete", id: doomed })).status, "saved", "deleting twice is a no-op, not an error");
  const ghost = await commit(storage, catalog, { type: "upsert", profile: rename(a.profiles[2], "改已删"), baseRevision: 0 });
  assert.ok(ghost.status === "conflict" && ghost.kind === "profile-deleted" && ghost.latestProfile === null);
  assert.equal((await commit(storage, catalog, { type: "upsert", profile: rename(a.profiles[2], "改已删"), baseRevision: null })).status, "saved", "the draft can be re-created explicitly");
});

test("R1: an import planned against an older store is re-checked, then applied with bumped revisions", async () => {
  const storage = memory();
  const b = tab(storage);
  const json = JSON.stringify({ version: 4, profiles: [v4Profile({ name: "导入版婢女" }), v4Profile({ id: "extra", name: "外来", identity: "商贾", agenda: "经商 / 致富 / 产业路线" })], activeId: "extra" });
  const plan = parseImport(json, catalog, b);
  assert.equal(plan.baseStoreRevision, 0);
  assert.equal((await commit(storage, catalog, { type: "upsert", profile: rename(tab(storage).profiles[0], "A 同时改了"), baseRevision: 0 })).status, "saved");
  const stale = await commit(storage, catalog, { type: "import", plan, mode: "merge-overwrite" });
  assert.ok(stale.status === "conflict" && stale.kind === "store-changed");
  assert.equal(tab(storage).profiles[0].name, "A 同时改了", "nothing imported on conflict");
  const fresh = parseImport(json, catalog, tab(storage));
  assert.equal(fresh.baseStoreRevision, 1);
  const applied = await commit(storage, catalog, { type: "import", plan: fresh, mode: "merge-overwrite" });
  assert.equal(applied.status, "saved");
  const latest = tab(storage);
  assert.equal(latest.profiles[0].name, "导入版婢女");
  assert.equal(latest.profiles[0].revision, 2, "overwriting an edited profile bumps its revision");
  assert.equal(latest.profiles.find((profile) => profile.id === "extra")?.revision, 0);
  assert.equal(latest.revision, 2);
});

test("R1: stores without revision fields read as revision 0 and migrated data survives a commit unchanged", async () => {
  const noRevision = memory({ [PROFILE_KEY_V5]: JSON.stringify({ version: 5, profiles: baseProfiles(catalog).map(({ revision: _r, ...rest }) => rest), activeId: "artist-road" }) });
  const read = readStore(noRevision, catalog).store;
  assert.equal(read.revision, 0);
  assert.ok(read.profiles.every((profile) => profile.revision === 0));
  const raw = JSON.stringify({ version: 4, profiles: [v4Profile({ identity: "军旅小卒", world: "修仙宗门", notes: "留着" })], activeId: "servant-leisure" });
  const legacy = memory({ [PROFILE_KEY_V4]: raw });
  const migrated = readStore(legacy, catalog).store;
  assert.equal(migrated.revision, 0);
  const result = await commit(legacy, catalog, { type: "activate", id: "servant-leisure" });
  assert.equal(result.status, "saved");
  const after = readStore(legacy, catalog).store;
  assert.equal(after.revision, 1);
  assert.equal(after.profiles[0].identityId, null);
  assert.equal(after.profiles[0].requiresReview?.legacy.identity, "军旅小卒");
  assert.equal(after.profiles[0].notes, "留着");
  assert.equal(legacy.data[PROFILE_KEY_V4], raw, "old copy kept");
});

test("R1: a failed write reports unwritable and never claims success", async () => {
  const data: Record<string, string> = {};
  const quota: StorageLike = {
    getItem: (key) => data[key] ?? null,
    setItem: () => {
      throw new Error("QuotaExceededError");
    }
  };
  const result = await commit(quota, catalog, { type: "activate", id: "emperor-survival" });
  assert.equal(result.status, "unwritable");
  assert.equal(Object.keys(data).length, 0);
  const blocked = await commit(
    {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined
    },
    catalog,
    { type: "activate", id: "emperor-survival" }
  );
  assert.equal(blocked.status, "unwritable");
});
