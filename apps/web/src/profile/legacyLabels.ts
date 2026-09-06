/**
 * Deterministic tables for migrating the V3 prototype's free-text profiles
 * into canonical ids. Anything not listed here is *not* guessed: the profile
 * is flagged `requiresReview` and the original wording is kept beside it.
 */
export const LEGACY_IDENTITY_LABELS: Readonly<Record<string, string>> = {
  "皇帝": "emperor",
  "储君 / 皇嗣": "heir",
  "摄政 / 权臣": "regent-powerful-minister",
  "将军": "general",
  "地方官": "local-official",
  "士人 / 读书人": "scholar",
  "商贾": "merchant",
  "普通人": "commoner",
  "普通人 / 游民画师": "commoner",
  "奴婢 / 仆役": "servant"
};

export const LEGACY_ROUTE_LABELS: Readonly<Record<string, string>> = {
  "偷得浮生 / 小日子": "pleasure-and-stability",
  "求存 / 治世": "benevolent-rule",
  "诗画 / 自由生活": "arts-and-letters",
  "开放路线": "open-road",
  "未定路线 / 先活着看看": "open-road",
  "明君 / 治世路线": "benevolent-rule",
  "铁腕统治 / 暴君叙事": "iron-rule",
  "享乐 / 富贵闲人路线": "pleasure-and-stability",
  "科举 / 入仕 / 官场上升": "official-ascent",
  "从军 / 掌兵 / 将领路线": "military-ascent",
  "夺权 / 称帝路线": "throne-seeking",
  "宫斗 / 宅斗 / 内廷权力": "court-household-struggle",
  "经商 / 致富 / 产业路线": "commerce-wealth",
  "诗人 / 画家 / 文艺路线": "arts-and-letters",
  "归隐 / 辞官 / 退场路线": "retreat-and-seclusion",
  "求生 / 保家 / 先别死": "survive-and-protect"
};

/** World labels the prototype could have stored for the one open pack. */
export const LEGACY_WORLD_LABELS: Readonly<Record<string, { realmId: string; worldPackId: string }>> = {
  "东方古代 · 架空王朝": { realmId: "eastern-ancient", worldPackId: "ancient-china" },
  "架空王朝": { realmId: "eastern-ancient", worldPackId: "ancient-china" }
};
