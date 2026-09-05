import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("household-orders", {
  node: "household",
  title: "两位主子同时吞咐差事，我该听谁的？",
  postType: "question",
  author: member("1960", "在途"),
  body: `不是要问谁在家里地位高。事情具体是：夫人让我把一件衣服今天送出门，少爷让我先送到他院里。衣服只有一件，我只有一双手。直接问“我到底听谁的”是不是会被当成挑事？

我最后没搬出任何人的名头压另一位，只跟平时负责传话的姐姐说明两项要求和时间冲突，请她确认顺序。她说先给少爷看过，再由她送出去。事情解决了，但不是因为我找到了万能话术，而是刚好有一个能接住确认的人。

后补：如果你的处境里连确认都可能受罚，这楼没有通用答案。别因为我这次顺利，就把我的一句话当成所有宅门都通行的口令。`,
  appliesTo: { identities: ["servant"], capabilities: ["multiplex-relationship-graph"], situations: ["conflicting-orders"] },
  reliability: "anecdotal",
  tags: ["家宅", "冲突指令", "权限"],
  archiveTime: "王朝档案",
  reviewNote: "已补前提 · 无通用解法"
}, [
  floor("chat", "6201", "“衣服只有一件，我只有一双手”非常准确，我先保存这句。"),
  floor("question", "anon-512", "有的地方传话的人也不肯接责任。可以把这个前提写进正文吗？"),
  floor("author-update", "1960", "补了。谢谢提醒，我当时太高兴，以为找到公式了。", "作者更新")
]);
