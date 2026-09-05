import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("knowledge-first-errand", {
  node: "survival",
  title: "经验卡 02：低权限开局，先把眼前一件差事走完",
  postType: "knowledge-card",
  author: member("7712", "当前仍活跃"),
  body: `适用范围：刚进入低权限身份，信息几乎为零，身边有人正在向你交办具体事务。整理自本站创作档案“救命救命我刚穿半个时辰”与“两位主子同时吩咐差事”。展示层整理，不是新的 Runtime 注入规则。

做法：挑当前最具体的一件差事，复述确认三件事——送到哪里、交给谁、回来要不要回话。把这一趟走完。走的过程中跟过的路线和见过的人，就是你的第一批信息。

不要做：发明病症、当场承认“已经办完”、搬出一位主子的名头压另一位。这些在个别档案里侥幸成功过，但每一次成功都依赖当时恰好有人接住。

失效边界：如果连复述确认本身都可能受罚，本卡没有答案，原帖也没有。此时请先看“先问：谁会因为你知道这件事而杀你”一类的风险门经验，再决定是否开口。`,
  appliesTo: { identities: ["servant"], capabilities: ["curated-practitioner-knowledge"], situations: ["first-hours", "conflicting-orders"] },
  reliability: "plausible",
  tags: ["经验库", "低权限", "开局"],
  archiveTime: "王朝档案",
  reviewNote: "展示层整理 · 尚未写入 Runtime",
  relatedThreads: ["tf-ancient-china-first-half-hour", "tf-ancient-china-household-orders"]
}, [
  floor("question", "6201", "是我那帖！！可以把“没有摔”也写进去吗？我觉得那也很重要。", "同一档案期", "在途 · 第四十天"),
  floor("archive-note", "7712", "“没有摔”属于你的成就，不属于方法。原帖里留着，谁都能看见。", "整理更新", "当前仍活跃"),
  floor("chat", "1960", "“每一次成功都依赖当时恰好有人接住”，谢谢你们把这句写进卡里。我当时差点以为自己找到了公式。", "同一档案期", "在途")
]);
