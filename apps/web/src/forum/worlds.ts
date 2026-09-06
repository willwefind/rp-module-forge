/**
 * Realm → World Pack navigation shown in the forum shell. Only one pack is
 * open; everything else is a planned direction and must render as unopened.
 * Machine ids stay as they are (the pack is still `ancient-china`).
 */
export type WorldPackEntry = { id: string; label: string; open: boolean };
export type RealmEntry = { id: string; label: string; open: boolean; packs: WorldPackEntry[] };

export const OPEN_REALM_ID = "eastern-ancient";
export const OPEN_PACK_ID = "ancient-china";

export const realms: RealmEntry[] = [
  {
    id: OPEN_REALM_ID,
    label: "东方古代",
    open: true,
    packs: [
      { id: OPEN_PACK_ID, label: "架空王朝", open: true },
      { id: "wuxia-jianghu", label: "武侠江湖", open: false },
      { id: "xianxia-sect", label: "修仙宗门", open: false },
      { id: "zhiguai-tales", label: "志怪异闻", open: false }
    ]
  },
  { id: "western-fantasy", label: "西方幻想", open: false, packs: [] },
  { id: "future-scifi", label: "未来科幻", open: false, packs: [] },
  { id: "industrial-fantasy", label: "工业幻想", open: false, packs: [] },
  { id: "primal-world", label: "原始世界", open: false, packs: [] }
];

export const openRealm = realms[0];
export const openPack = openRealm.packs[0];
export const WORLD_LABEL = `${openRealm.label} · ${openPack.label}`;
