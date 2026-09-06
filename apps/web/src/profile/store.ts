/**
 * Canonical local 本局档案 store (version 5), shared by the forum and the
 * workshop through the same localStorage key.
 *
 * A profile stores *what the reader chose* (world pack, identity id, route),
 * never what they are allowed to do: permission is always derived from the
 * loaded world pack's canonical identity and shown read-only. Older stores
 * (V3 prototype v4 / v3) are migrated on read with a deterministic label
 * table; anything that cannot be canonicalized is flagged `requiresReview`
 * with the original wording kept, and the old copy is left untouched until
 * the new store is saved successfully.
 */
import type { CanonicalWorldPack } from "@rpmf/core";
import { LEGACY_IDENTITY_LABELS, LEGACY_ROUTE_LABELS, LEGACY_WORLD_LABELS } from "./legacyLabels.js";
import { ACTIVE_KEY_V3, PROFILE_KEY_V3, PROFILE_KEY_V4, normalizeStoreV4, type ProfileStoreV4, type ProfileV4 } from "./storeV4.js";

export const PROFILE_KEY_V5 = "td-profile-store-v5";
export const PROFILE_SCHEMA_VERSION = 5 as const;

export type StorageLike = { getItem(key: string): string | null; setItem(key: string, value: string): void };

export type ProfileReview = {
  reason: string;
  /** Original free-text values from the pre-canonical store. */
  legacy: { identity?: string; agenda?: string; world?: string; permission?: string };
};

export type LocalRpProfile = {
  version: typeof PROFILE_SCHEMA_VERSION;
  id: string;
  name: string;
  realmId: string;
  worldPackId: string;
  /** Canonical identity id from the loaded pack; null only while `requiresReview` is set. */
  identityId: string | null;
  agenda?: { routeId: string; customGoal?: string };
  notes?: string;
  requiresReview?: ProfileReview;
};

export type ProfileStore = { version: typeof PROFILE_SCHEMA_VERSION; profiles: LocalRpProfile[]; activeId: string };

/** What the store needs to know about the loaded world; built from the pack so nothing is duplicated. */
export type ProfileCatalog = {
  realmId: string;
  worldPackId: string;
  identityIds: readonly string[];
  routeIds: readonly string[];
};

export function catalogFromPack(pack: CanonicalWorldPack, realmId: string): ProfileCatalog {
  return {
    realmId,
    worldPackId: pack.id,
    identityIds: pack.identities.map((identity) => identity.id),
    routeIds: (pack.agendas ?? []).map((agenda) => agenda.id)
  };
}

const LIMITS = { id: 100, name: 40, customGoal: 200, notes: 1200 };

export function baseProfiles(catalog: ProfileCatalog): LocalRpProfile[] {
  const base = (id: string, name: string, identityId: string, routeId: string): LocalRpProfile => ({
    version: 5,
    id,
    name,
    realmId: catalog.realmId,
    worldPackId: catalog.worldPackId,
    identityId,
    agenda: { routeId },
    notes: ""
  });
  return [
    base("servant-leisure", "婢女小日子线", "servant", "pleasure-and-stability"),
    base("emperor-survival", "永宁帝线", "emperor", "benevolent-rule"),
    base("artist-road", "流浪画师线", "commoner", "arts-and-letters")
  ];
}

function text(value: unknown, max: number): string | null {
  return typeof value === "string" ? value.trim().slice(0, max) : null;
}

/** Validates one v5 profile against the catalog. Returns null when the record cannot be trusted. */
export function cleanProfile(input: unknown, catalog: ProfileCatalog): LocalRpProfile | null {
  if (!input || typeof input !== "object") return null;
  const record = input as Record<string, unknown>;
  const id = text(record.id, LIMITS.id);
  const name = text(record.name, LIMITS.name);
  if (!id || !name) return null;
  if (record.worldPackId !== catalog.worldPackId || record.realmId !== catalog.realmId) return null;

  const review = record.requiresReview;
  let requiresReview: ProfileReview | undefined;
  if (review && typeof review === "object") {
    const reason = text((review as ProfileReview).reason, 200);
    const legacyIn = ((review as ProfileReview).legacy ?? {}) as Record<string, unknown>;
    const legacy: ProfileReview["legacy"] = {};
    for (const key of ["identity", "agenda", "world", "permission"] as const) {
      const value = text(legacyIn[key], 80);
      if (value) legacy[key] = value;
    }
    if (!reason) return null;
    requiresReview = { reason, legacy };
  }

  let identityId: string | null;
  if (record.identityId === null) {
    if (!requiresReview) return null;
    identityId = null;
  } else if (typeof record.identityId === "string" && catalog.identityIds.includes(record.identityId)) {
    identityId = record.identityId;
  } else {
    return null;
  }

  let agenda: LocalRpProfile["agenda"];
  if (record.agenda !== undefined) {
    if (!record.agenda || typeof record.agenda !== "object") return null;
    const agendaIn = record.agenda as Record<string, unknown>;
    if (typeof agendaIn.routeId !== "string" || !catalog.routeIds.includes(agendaIn.routeId)) return null;
    const customGoal = text(agendaIn.customGoal, LIMITS.customGoal);
    agenda = customGoal ? { routeId: agendaIn.routeId, customGoal } : { routeId: agendaIn.routeId };
  }

  const notes = text(record.notes, LIMITS.notes) ?? "";
  const profile: LocalRpProfile = { version: 5, id, name, realmId: catalog.realmId, worldPackId: catalog.worldPackId, identityId, notes };
  if (agenda) profile.agenda = agenda;
  if (requiresReview) profile.requiresReview = requiresReview;
  return profile;
}

export function normalizeStore(input: unknown, catalog: ProfileCatalog): ProfileStore {
  const record = (input ?? {}) as { version?: unknown; profiles?: unknown; activeId?: unknown };
  if (record.version !== 5 || !Array.isArray(record.profiles) || !record.profiles.length) throw new Error("档案文件格式不正确");
  const profiles = record.profiles.map((item) => cleanProfile(item, catalog));
  if (profiles.some((profile) => !profile)) throw new Error("档案有缺失字段、未知身份或未知路线");
  const cleaned = profiles as LocalRpProfile[];
  if (new Set(cleaned.map((profile) => profile.id)).size !== cleaned.length) throw new Error("档案编号重复");
  const activeId = cleaned.some((profile) => profile.id === record.activeId) ? (record.activeId as string) : cleaned[0].id;
  return { version: 5, profiles: cleaned, activeId };
}

/**
 * v4 → v5. Known labels map deterministically; unknown identity / world /
 * route wording is kept verbatim under `requiresReview` instead of guessed.
 * The free-text permission field is dropped: it is derived from the identity.
 */
export function migrateProfileV4(profile: ProfileV4, catalog: ProfileCatalog): LocalRpProfile {
  const problems: string[] = [];
  const legacy: ProfileReview["legacy"] = {};

  const world = LEGACY_WORLD_LABELS[profile.world];
  if (!world || world.worldPackId !== catalog.worldPackId) {
    problems.push("世界包");
    legacy.world = profile.world;
  }

  const identityId = LEGACY_IDENTITY_LABELS[profile.identity] ?? null;
  if (!identityId || !catalog.identityIds.includes(identityId)) {
    problems.push("身份");
    legacy.identity = profile.identity;
  }

  let agenda: LocalRpProfile["agenda"];
  const routeId = LEGACY_ROUTE_LABELS[profile.agenda];
  if (routeId && catalog.routeIds.includes(routeId)) {
    agenda = { routeId };
  } else if (profile.agenda && catalog.routeIds.includes("custom")) {
    problems.push("路线");
    legacy.agenda = profile.agenda;
    agenda = { routeId: "custom", customGoal: profile.agenda.slice(0, LIMITS.customGoal) };
  }

  if (profile.permission) legacy.permission = profile.permission;

  const migrated: LocalRpProfile = {
    version: 5,
    id: profile.id,
    name: profile.name,
    realmId: catalog.realmId,
    worldPackId: catalog.worldPackId,
    identityId: problems.includes("身份") ? null : identityId,
    notes: profile.notes ?? ""
  };
  if (agenda) migrated.agenda = agenda;
  if (problems.length) {
    migrated.requiresReview = {
      reason: `旧档案中的${problems.join("、")}无法自动对应到当前世界包，请在档案柜核对后保存。`,
      legacy
    };
  }
  return migrated;
}

export function migrateStoreV4(store: ProfileStoreV4, catalog: ProfileCatalog): ProfileStore {
  return normalizeStore(
    { version: 5, profiles: store.profiles.map((profile) => migrateProfileV4(profile, catalog)), activeId: store.activeId },
    catalog
  );
}

export type ReadResult = { store: ProfileStore; warning: string; writable: boolean; migratedFrom?: 3 | 4 };

export function readStore(storage: StorageLike, catalog: ProfileCatalog): ReadResult {
  const fallback: ProfileStore = { version: 5, profiles: baseProfiles(catalog), activeId: "servant-leisure" };
  try {
    const raw = storage.getItem(PROFILE_KEY_V5);
    if (raw) return { store: normalizeStore(JSON.parse(raw), catalog), warning: "", writable: true };

    const rawV4 = storage.getItem(PROFILE_KEY_V4);
    if (rawV4) {
      const store = migrateStoreV4(normalizeStoreV4(JSON.parse(rawV4)), catalog);
      return { store, warning: reviewWarning(store, "已从旧版档案（v4）迁移；旧副本保留，直到你第一次保存。"), writable: true, migratedFrom: 4 };
    }

    const rawV3 = storage.getItem(PROFILE_KEY_V3);
    if (rawV3) {
      const legacyStore = normalizeStoreV4({ version: 4, profiles: JSON.parse(rawV3), activeId: storage.getItem(ACTIVE_KEY_V3) });
      const store = migrateStoreV4(legacyStore, catalog);
      return { store, warning: reviewWarning(store, "已从更早的试玩版档案迁移；旧副本保留，直到你第一次保存。"), writable: true, migratedFrom: 3 };
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

function reviewWarning(store: ProfileStore, prefix: string) {
  const pending = store.profiles.filter((profile) => profile.requiresReview).length;
  return pending ? `${prefix} 有 ${pending} 份档案的身份或路线需要在档案柜核对。` : prefix;
}

export function saveStore(storage: StorageLike, store: ProfileStore, catalog: ProfileCatalog) {
  storage.setItem(PROFILE_KEY_V5, JSON.stringify(normalizeStore(store, catalog)));
}

export function upsertProfile(store: ProfileStore, profile: unknown, catalog: ProfileCatalog): ProfileStore {
  const cleaned = cleanProfile(profile, catalog);
  if (!cleaned) throw new Error("请完整填写档案：名称、身份与路线都要选择");
  const profiles = store.profiles.some((item) => item.id === cleaned.id)
    ? store.profiles.map((item) => (item.id === cleaned.id ? cleaned : item))
    : [...store.profiles, cleaned];
  return normalizeStore({ version: 5, profiles, activeId: cleaned.id }, catalog);
}

export function deleteProfile(store: ProfileStore, id: string, catalog: ProfileCatalog): ProfileStore {
  if (store.profiles.length <= 1) throw new Error("至少保留一份档案");
  return normalizeStore({ ...store, profiles: store.profiles.filter((profile) => profile.id !== id) }, catalog);
}

export type ImportMode = "merge-skip" | "merge-overwrite" | "replace";

export type ImportPlan = {
  incoming: ProfileStore;
  sourceVersion: 4 | 5;
  duplicateIds: string[];
  needsReview: string[];
};

/** Parses an exported JSON file. Malformed, unknown-version or unknown-id content fails closed. */
export function parseImport(json: string, catalog: ProfileCatalog, current: ProfileStore): ImportPlan {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("这不是有效的 JSON 档案文件");
  }
  const record = (parsed ?? {}) as { version?: unknown };
  let incoming: ProfileStore;
  let sourceVersion: 4 | 5;
  if (record.version === 5) {
    incoming = normalizeStore(parsed, catalog);
    sourceVersion = 5;
  } else if (record.version === 4) {
    incoming = migrateStoreV4(normalizeStoreV4(parsed), catalog);
    sourceVersion = 4;
  } else {
    throw new Error("不支持的档案版本；只接受本站导出的 v4 / v5 备份");
  }
  const currentIds = new Set(current.profiles.map((profile) => profile.id));
  return {
    incoming,
    sourceVersion,
    duplicateIds: incoming.profiles.filter((profile) => currentIds.has(profile.id)).map((profile) => profile.id),
    needsReview: incoming.profiles.filter((profile) => profile.requiresReview).map((profile) => profile.name)
  };
}

export function applyImport(current: ProfileStore, plan: ImportPlan, mode: ImportMode, catalog: ProfileCatalog): ProfileStore {
  if (mode === "replace") return normalizeStore(plan.incoming, catalog);
  const byId = new Map(current.profiles.map((profile) => [profile.id, profile]));
  for (const profile of plan.incoming.profiles) {
    if (byId.has(profile.id) && mode === "merge-skip") continue;
    byId.set(profile.id, profile);
  }
  return normalizeStore({ version: 5, profiles: [...byId.values()], activeId: current.activeId }, catalog);
}
