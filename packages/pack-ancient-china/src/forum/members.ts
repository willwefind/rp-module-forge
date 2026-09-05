import type { ForumAuthor } from "@rpmf/core";

export type ForumMemberRecord = Pick<ForumAuthor, "travelerId" | "displayName" | "memberKind" | "displayMode">;

/**
 * Forum member registry for the 架空王朝 archive. Keys are the numeric lore
 * suffix (小杏 · #6201 -> "6201"), `anon-NNN` for 匿名老乡 NNN, or a slug for
 * signatures without a number. Member kind is presentation only.
 */
export const forumMembers = {
  "0042": { travelerId: "member-0042", displayName: "时空总局·后勤员 · #0042", memberKind: "temporal-bureau-logistics", displayMode: "lore-signature" },
  "0079": { travelerId: "member-0079", displayName: "老行伍 · #0079", memberKind: "traveler", displayMode: "lore-signature" },
  "0187": { travelerId: "member-0187", displayName: "在途穿越者 · #0187", memberKind: "active-traveler", displayMode: "lore-signature" },
  "0266": { travelerId: "member-0266", displayName: "婢女小日子线 · #0266", memberKind: "traveler", displayMode: "lore-signature" },
  "0880": { travelerId: "member-0880", displayName: "第七次还是县令 · #0880", memberKind: "traveler", displayMode: "lore-signature" },
  "0913": { travelerId: "member-0913", displayName: "灶房第三口锅 · #0913", memberKind: "traveler", displayMode: "lore-signature" },
  "0914": { travelerId: "member-0914", displayName: "在途穿越者 · #0914", memberKind: "active-traveler", displayMode: "lore-signature" },
  "1184": { travelerId: "member-1184", displayName: "穿越者预备役 · #1184", memberKind: "traveler-reserve", displayMode: "lore-signature" },
  "1502": { travelerId: "member-1502", displayName: "东宫读书的 · #1502", memberKind: "traveler", displayMode: "lore-signature" },
  "1960": { travelerId: "member-1960", displayName: "廊下抱衣服的人 · #1960", memberKind: "traveler", displayMode: "lore-signature" },
  "2037": { travelerId: "member-2037", displayName: "职业穿越者 · #2037", memberKind: "professional-traveler", displayMode: "lore-signature" },
  "2048": { travelerId: "member-2048", displayName: "匿名老乡 · #2048", memberKind: "traveler", displayMode: "anonymous" },
  "3108": { travelerId: "member-3108", displayName: "模块维修工 · #3108", memberKind: "module-maintainer", displayMode: "lore-signature" },
  "3306": { travelerId: "member-3306", displayName: "职业穿越者 · #3306", memberKind: "professional-traveler", displayMode: "lore-signature" },
  "3311": { travelerId: "member-3311", displayName: "落第两次的举子 · #3311", memberKind: "traveler", displayMode: "lore-signature" },
  "4051": { travelerId: "member-4051", displayName: "算盘只打一半 · #4051", memberKind: "traveler", displayMode: "lore-signature" },
  "4470": { travelerId: "member-4470", displayName: "豆腐西施不是我 · #4470", memberKind: "traveler", displayMode: "lore-signature" },
  "5530": { travelerId: "member-5530", displayName: "生怕签错字 · #5530", memberKind: "traveler", displayMode: "lore-signature" },
  "6083": { travelerId: "member-6083", displayName: "不想当师爷的县丞 · #6083", memberKind: "traveler", displayMode: "lore-signature" },
  "6201": { travelerId: "member-6201", displayName: "小杏（暂定） · #6201", memberKind: "traveler", displayMode: "lore-signature" },
  "7402": { travelerId: "member-7402", displayName: "流浪画师 · #7402", memberKind: "traveler", displayMode: "lore-signature" },
  "7712": { travelerId: "member-7712", displayName: "时空总局·档案员 · #7712", memberKind: "temporal-bureau-archive", displayMode: "lore-signature" },
  "anon-061": { travelerId: "anonymous-061", displayName: "匿名老乡 061", memberKind: "traveler", displayMode: "anonymous" },
  "anon-512": { travelerId: "anonymous-512", displayName: "匿名老乡 512", memberKind: "traveler", displayMode: "anonymous" },
  "anonymous-immortal": { travelerId: "member-anonymous-immortal", displayName: "修仙界匿名化神期老乡", memberKind: "traveler", displayMode: "lore-signature" },
  "maintainer-group": { travelerId: "maintainer-group", displayName: "穿越者老乡维护组", memberKind: "module-maintainer", displayMode: "lore-signature" },
  "yongning-archive-clerk": { travelerId: "member-yongning-archive-clerk", displayName: "大虞·旧档房小吏", memberKind: "traveler", displayMode: "lore-signature" },
  "yongning-emperor": { travelerId: "member-yongning-emperor", displayName: "大虞·永宁帝", memberKind: "traveler", displayMode: "lore-signature" }
} as const satisfies Record<string, ForumMemberRecord>;

export type ForumMemberKey = keyof typeof forumMembers;
