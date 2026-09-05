import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("grudge-ledger", {
  node: "household",
  title: "记仇帖：管事扣了我三个月月钱，我把每一天都记下来了",
  postType: "grudge-note",
  author: member("0913", "在途"),
  body: `三月初二，说我打碎一只碗，扣半月。碗是隔壁打碎的，我没说，因为她比我更需要那半月。三月十九，说我误了送菜，扣十日。那天他自己睡到日上三竿。四月初一，不说理由，扣半月，说“上头的意思”。

我不能问他。我也不能问上头。我只能记。记在灶房第三口锅底下的墙缝里，用炭。这帖也算记。有一天要是能对账，我要一天一天跟他对。

别劝我放下。我什么都没有，只有这本账。`,
  appliesTo: { identities: ["servant"], capabilities: ["ledger-evidence-crosscheck"], situations: ["wage-deduction"] },
  reliability: "anecdotal",
  tags: ["家宅", "记仇", "月钱"],
  archiveTime: "王朝档案",
  reviewNote: "记仇帖 · 不提炼 · 原样保留"
}, [
  floor("verified-practice", "1960", "不劝你放下。只提醒一件事：炭写的东西会被刷掉，锅底下的墙缝也会被人看见。记在这里比记在那里安全，前提是你在这里别写真名。"),
  floor("correction", "0880", "从旁观者说一句你可能不爱听的：“上头的意思”那次，可能真是上头的意思，也可能不是。这本账现在只能证明扣了，证明不了为什么扣。留着它，别拿它当判词。"),
  floor("author-update", "0913", "我知道证明不了。我只是想有一天能问一句为什么。", "作者回复", "在途"),
  floor("archive-note", "0042", "记仇帖按规矩留在原帖，不进经验库，不改可靠度。留帖是因为它真，不是因为它对。", "归档注", "任务中")
]);
