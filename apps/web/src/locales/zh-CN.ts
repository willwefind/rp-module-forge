import type {
  CanonicalConfigIssue,
  ForumAuthor,
  ForumInjectionPolicy,
  ForumPostType,
  ForumReliability,
  TokenMode
} from "@rpmf/core";

export const UI_LOCALE = "zh-CN" as const;

export const tokenModeLabels: Record<TokenMode, string> = {
  light: "轻量",
  standard: "标准",
  full: "完整"
};

export const forumPolicyLabels: Record<ForumInjectionPolicy, string> = {
  off: "关闭自动注入",
  "curated-only": "仅注入已审核条目",
  "curated-plus-links": "已审核条目 + 原帖链接",
  manual: "仅手动调用"
};

export const reliabilityLabels: Record<ForumReliability, string> = {
  unknown: "未知",
  anecdotal: "个案经验",
  plausible: "较可信",
  contested: "有争议",
  corroborated: "已交叉佐证",
  deprecated: "已废弃"
};

export const postTypeLabels: Record<ForumPostType, string> = {
  "verified-practice": "经验核验",
  "blood-and-tears": "血泪帖",
  "grudge-note": "记仇帖",
  "unverified-trick": "未核验偏方",
  question: "求助",
  correction: "勘误",
  "maintainer-argument": "维护组争论",
  "case-report": "实战回报",
  retrospective: "长篇复盘",
  serial: "连载",
  "good-news": "开心帖",
  chat: "闲谈",
  "module-release": "模块发布",
  "knowledge-card": "经验库",
  "community-gateway": "通信口",
  "maintenance-record": "维护记录",
  "revived-thread": "翻旧帖",
  "archive-note": "归档注",
  "author-update": "作者更新"
};

export const provenanceLabels: Record<string, string> = {
  "maintainer-seed": "维护组创世种子",
  "community-contribution": "社区贡献",
  "maintainer-import": "维护组整理导入"
};

export function localizeTravelerId(id: string): string {
  const anonymousMatch = /^anonymous-(.+)$/.exec(id);
  return anonymousMatch ? `匿名老乡 ${anonymousMatch[1]}` : id;
}

/** Forum signature: the archive display name, falling back to the stable member id. */
export function authorName(author: ForumAuthor): string {
  return author.displayName ?? localizeTravelerId(author.travelerId);
}

export function formatNormalizationIssue(issue: CanonicalConfigIssue): string {
  const labels: Record<CanonicalConfigIssue["code"], string> = {
    "schema-version": "配置版本不受支持",
    "world-pack": "配置与当前世界包不匹配",
    "world-pack-version": "世界包版本不匹配",
    identity: "当前身份无法识别",
    "unknown-agenda": "发展路线无法识别",
    "custom-agenda-empty": "自定义路线尚未填写具体目标",
    "permission-profile-corrected": "权限档案已按当前身份自动纠正",
    "unsupported-capability": "存在当前世界包不支持的能力",
    "invalid-capability-mode": "能力启用方式无效",
    "duplicate-capability": "重复能力已按最后一次明确选择处理",
    "unknown-expert": "存在无法识别的专家镜头",
    "invalid-expert-weight": "专家镜头权重无效",
    "duplicate-expert": "重复专家镜头已按最后一次明确选择处理",
    "invalid-forum-reliability": "老乡论坛可靠度设置无效",
    "forum-disabled-normalized": "论坛关闭时的自动注入与原帖链接已同步关闭",
    "invalid-token-mode": "信息密度模式无效",
    "runtime-invariant": "固定运行规则被削弱，已拒绝导出",
    "activation-policy": "当前版本只支持事件驱动激活"
  };

  return labels[issue.code];
}
