import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("password-changed", {
  node: "military",
  title: "口令换了没人告诉我，差点被自己人射成刺猬",
  postType: "blood-and-tears",
  author: member("0079", "当前仍活跃"),
  body: `换防第一夜，口令改了，没人通知巡夜的。我报旧口令，对面弓已经拉满。命是同伍那个大嗓门救的，他认得我的咳嗽。

写在这不是求安慰。后来的：到一个新营，先弄清口令什么时候换、谁负责传、传不到你怎么办。别的都能明天再学。`,
  appliesTo: { identities: ["general", "commoner"], capabilities: ["accountability-execution"], situations: ["military-camp", "password-change"] },
  reliability: "anecdotal",
  tags: ["军旅", "口令", "一句话"],
  archiveTime: "王朝档案",
  reviewNote: "一句话经验 · 情境明确"
}, [
  floor("correction", "3306", "补一句：口令是最小的一条“执行链”。有人签发、有人转传、有人验收，任何一环没走到就是你挨箭。考成那套拆法，小到一句口令也能用。", "换防前一日", "任务中"),
  floor("case-report", "6201", "宅里也有这种。姐姐们私下改了传话的暗号，没告诉新来的，我照旧说，被当成外人。原来军营和后院一样。", "同一档案期", "在途"),
  floor("author-update", "0079", "别扯远。你们后院没有弓。", "作者回复", "当前仍活跃")
]);
