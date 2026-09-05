import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("border-day17", {
  node: "military",
  title: "边军小卒第17天：先把粮袋数对，再谈天下",
  postType: "serial",
  author: member("3306", "状态未知 · 应作者要求改挂"),
  body: `第十七天，脚上的泡终于不流血了。之前有人问我是不是准备造反。不是。至少现在不是。我能控制的东西只有一把不太趁手的刀、两个愿意一起练的同伍，以及因为会算数被粮官多看了一眼的机会。先别聊天下，先聊下个月会不会被调去填壕。

今天点粮发现少两袋。我差点当场说有人侵吞，幸亏旁边老卒拦了一下。雨湿以后换了袋，原来一袋拆成两袋，木牌没有重挂。我算袋数，他们算重量，双方都觉得对方不会算。现在记成两栏，袋数和复秤各写各的。

第二十一天补记：不要把上面的故事理解成军中没有贪墨。我只证明今天这一次少袋另有原因。上个月的饷为什么没到，我没有证据，也没有权限查。粮官说等，我把原话记下了，不替他解释。

更新暂缓。要换防了，去处不便写。哪天断更超过三个月，麻烦维护组挂“状态未知”，别直接替我办丧事，谢谢。`,
  appliesTo: { identities: ["commoner", "general"], capabilities: ["readiness-logistics", "ledger-evidence-crosscheck"], situations: ["supply-count", "military-camp"] },
  reliability: "anecdotal",
  tags: ["军旅", "识字", "上升路线"],
  archiveTime: "王朝档案",
  featured: true,
  reviewNote: "局部观察 · 不构成战术指南",
  archiveGap: { kind: "missing-continuation", note: "连载停在第二十一天；后续未收录。逾三个月无更新后，按作者要求改挂状态未知。" }
}, [
  floor("verified-practice", "0079", "脚泡别在这楼问，我也不是郎中。认旗号、认同伍、弄清口令比听网友教你上阵重要。"),
  floor("verified-practice", "0880", "“我只证明今天这一次”这句请所有账目帖抄一遍。结论范围别比证据跑得远。"),
  floor("chat", "1184", "原来不是每篇军旅连载第三楼就该招兵买马。祝换防平安。"),
  floor("archive-note", "7712", "后续尚未收到。保持“任务中 / 连载暂停”的作者自述，不推断死亡或成功晋升。", "归档注"),
  floor("archive-note", "0042", "距最后更新已逾三个月。按作者原帖要求，状态改挂“状态未知”。没有办丧事，也没有替他升官。", "归档校订", "任务中")
]);
