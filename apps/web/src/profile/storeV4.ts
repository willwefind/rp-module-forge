/**
 * Legacy local profile store (`td-profile-store-v4`) as shipped by the V3
 * prototype: free-text identity / agenda / permission per profile. Kept so the
 * canonical v5 store can migrate it and so nothing is lost before the
 * migration succeeds.
 */
export type ProfileV4 = {
  id: string;
  name: string;
  identity: string;
  agenda: string;
  permission: string;
  world: string;
  notes: string;
};

export type ProfileStoreV4 = { version: 4; profiles: ProfileV4[]; activeId: string };

export const PROFILE_KEY_V4 = "td-profile-store-v4";
export const PROFILE_KEY_V3 = "td-profiles-v3";
export const ACTIVE_KEY_V3 = "td-active-profile-v3";

const limits: Record<keyof Omit<ProfileV4, "id">, number> = { name: 40, identity: 60, agenda: 80, permission: 80, world: 80, notes: 1200 };

export function cleanProfileV4(input: unknown): ProfileV4 | null {
  if (!input || typeof input !== "object") return null;
  const record = input as Record<string, unknown>;
  if (typeof record.id !== "string" || !record.id || record.id.length > 100) return null;
  const result: Record<string, string> = { id: record.id };
  for (const [key, max] of Object.entries(limits)) {
    const value = record[key];
    if (key !== "notes" && (typeof value !== "string" || !value.trim())) return null;
    result[key] = typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  return result as ProfileV4;
}

export function normalizeStoreV4(input: unknown): ProfileStoreV4 {
  const record = (input ?? {}) as { version?: unknown; profiles?: unknown; activeId?: unknown };
  if (record.version !== 4 || !Array.isArray(record.profiles) || !record.profiles.length) throw new Error("档案文件格式不正确");
  const profiles = record.profiles.map(cleanProfileV4);
  if (profiles.some((profile) => !profile) || new Set(profiles.map((profile) => profile!.id)).size !== profiles.length) {
    throw new Error("档案有缺失字段或重复编号");
  }
  const cleaned = profiles as ProfileV4[];
  const activeId = cleaned.some((profile) => profile.id === record.activeId) ? (record.activeId as string) : cleaned[0].id;
  return { version: 4, profiles: cleaned, activeId };
}
