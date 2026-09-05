import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("contract-i-cannot-read", {
  node: "merchant",
  title: "合伙人递来一张契，让我今天画押。我认得字，看不懂契。",
  postType: "question",
  author: member("5530", "在途"),
  body: `不是不识字。每个字都认得，连起来就不知道自己在答应什么。“作保”“承揽”“折色”“如有亏空照数补足”——最后这句我隐约觉得不妙，但合伙人说是行里惯例，不签显得不信任人。

他今天就要。我能拖多久？拖了会不会真的坏了关系？有没有老乡遇到过，先给我一句能开口的话，我先把今天挡过去。

后补：用了二楼的话，说“契要请中人过目，这是规矩”。合伙人脸色变了一下，但没拦。中人看完说，那句“照数补足”意味着亏了我一个人兜底，赚了按股分。我没签。关系确实凉了一些。凉总比我一个人兜底强。`,
  appliesTo: { identities: ["merchant"], capabilities: ["ledger-evidence-crosscheck", "claim-action-consistency"], situations: ["contract-signing"] },
  reliability: "anecdotal",
  tags: ["商贾", "契约", "求助"],
  archiveTime: "王朝档案",
  reviewNote: "个案 · 契约措辞因地而异"
}, [
  floor("verified-practice", "4051", "第一件事：把“如有亏空照数补足”这句抄下来，问清楚是谁补、补给谁、按什么算。契上每一个“照”字后面都藏着一个你没看见的账本。"),
  floor("verified-practice", "0880", "能拖的说法有一个：“契要请中人过目，这是规矩。”行里真有这个规矩就更好；没有，你也只是在要一个惯例。对方如果连中人都不让请，那不签就是答案本身。"),
  floor("case-report", "anon-512", "我签过类似的。后来亏了，补了，人也跑了。不知道对你有没有用，就是想说有人踩过。", "归档后补记", "状态未知"),
  floor("author-update", "5530", "谢谢各位。今天没签。以后我发帖前先把契抄一遍，不再只写“看不懂”。", "作者更新", "在途")
]);
