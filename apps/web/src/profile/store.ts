/**
 * Local 本局档案 store used by the forum shell. Phase 1 keeps the V3 schema
 * (version 4, free-text fields) so nothing a reader saved in the prototype is
 * lost; the canonical schema replaces it in the profile-sharing milestone.
 * Storage is abstracted so the logic is testable without a browser.
 */
import { ACTIVE_KEY_V3, PROFILE_KEY_V3, PROFILE_KEY_V4, cleanProfileV4, normalizeStoreV4, type ProfileStoreV4, type ProfileV4 } from "./storeV4.js";
import { WORLD_LABEL } from "../forum/worlds.js";

export type StorageLike = { getItem(key: string): string | null; setItem(key: string, value: string): void };

export const baseProfiles: ProfileV4[] = [
  { id: "servant-leisure", name: "婢女小日子线", identity: "奴婢 / 仆役", agenda: "偷得浮生 / 小日子", permission: "极低", world: WORLD_LABEL, notes: "" },
  { id: "emperor-survival", name: "永宁帝线", identity: "皇帝", agenda: "求存 / 治世", permission: "极高但信息受过滤", world: WORLD_LABEL, notes: "" },
  { id: "artist-road", name: "流浪画师线", identity: "普通人 / 游民画师", agenda: "诗画 / 自由生活", permission: "低", world: WORLD_LABEL, notes: "" }
];

export type ReadResult = { store: ProfileStoreV4; warning: string; writable: boolean };

export function readStore(storage: StorageLike): ReadResult {
  const fallback: ProfileStoreV4 = { version: 4, profiles: baseProfiles.map((profile) => ({ ...profile })), activeId: baseProfiles[0].id };
  try {
    const raw = storage.getItem(PROFILE_KEY_V4);
    if (raw) return { store: normalizeStoreV4(JSON.parse(raw)), warning: "", writable: true };
    const legacy = storage.getItem(PROFILE_KEY_V3);
    if (legacy) {
      return {
        store: normalizeStoreV4({ version: 4, profiles: JSON.parse(legacy), activeId: storage.getItem(ACTIVE_KEY_V3) }),
        warning: "已读取旧版档案，下一次保存会升级；旧副本保留。",
        writable: true
      };
    }
    return { store: fallback, warning: "", writable: true };
  } catch {
    return {
      store: fallback,
      warning: "无法读取本地档案。原始数据未覆盖；当前使用临时档案，请导出本次修改后再处理浏览器存储。",
      writable: false
    };
  }
}

export function saveStore(storage: StorageLike, store: ProfileStoreV4) {
  storage.setItem(PROFILE_KEY_V4, JSON.stringify(normalizeStoreV4(store)));
}

export function upsertProfile(store: ProfileStoreV4, profile: unknown): ProfileStoreV4 {
  const cleaned = cleanProfileV4(profile);
  if (!cleaned) throw new Error("请完整填写档案字段");
  const profiles = store.profiles.some((item) => item.id === cleaned.id)
    ? store.profiles.map((item) => (item.id === cleaned.id ? cleaned : item))
    : [...store.profiles, cleaned];
  return normalizeStoreV4({ version: 4, profiles, activeId: cleaned.id });
}

export function deleteProfile(store: ProfileStoreV4, id: string): ProfileStoreV4 {
  if (store.profiles.length <= 1) throw new Error("至少保留一份档案");
  return normalizeStoreV4({ ...store, profiles: store.profiles.filter((profile) => profile.id !== id) });
}

export type { ProfileStoreV4 as ProfileStore, ProfileV4 as Profile };
