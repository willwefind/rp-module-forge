import type { ForumNode } from "@rpmf/core";

/** 架空王朝 forum sections plus the shared meta board (天道总坛). */
export const ancientChinaForumNodes: ForumNode[] = [
  { id: "emperor", label: "皇帝与中枢", realm: "world" },
  { id: "official", label: "官场与地方", realm: "world" },
  { id: "military", label: "军旅与边关", realm: "world" },
  { id: "merchant", label: "商贾与行旅", realm: "world" },
  { id: "arts", label: "士林与文艺", realm: "world" },
  { id: "ordinary", label: "普通人生", realm: "world" },
  { id: "survival", label: "低权限求生", realm: "world" },
  { id: "household", label: "宫廷与家宅", realm: "world" },
  { id: "meta", label: "天道总坛", realm: "meta" }
];
