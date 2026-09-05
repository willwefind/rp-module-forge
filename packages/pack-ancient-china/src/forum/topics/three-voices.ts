import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("three-voices", {
  node: "emperor",
  title: "东宫提问：为什么我的民声池永远只有三种声音",
  postType: "question",
  author: member("1502", "当前仍活跃"),
  body: `我照装配台装了民声池，每次问“百姓如何看待新税”，回来的永远是三种：太傅说士林忧虑，母族说宗室不满，内侍说小民感恩。三种声音，三张嘴，三十年不变。我怀疑这不是民声，是我身边三个人的声音。

有没有办法让我听见第四种？我出不了东宫。`,
  appliesTo: { identities: ["heir"], capabilities: ["plural-stakeholder-signals"], situations: ["competing-advisers", "single-channel-consensus"] },
  reliability: "anecdotal",
  tags: ["储君", "民声", "采样"],
  archiveTime: "王朝档案",
  reviewNote: "方法澄清 · 已同步附件说明"
}, [
  floor("verified-practice", "7712", "你的判断是对的。民声池不生产声音，只整理你已经取得的声音。你只有三个渠道，它就只能给你三种。它能做的是在旁边标一句：“来源三，渠道互不独立，缺失群体：佃户、军户、商户、匠人……”。这句标注才是它的用处，不是替你凑第四种。", "同一档案期", "当前仍活跃"),
  floor("verified-practice", "3311", "东宫出不去，东宫的东西出得去。宫里采买的菜蔬布匹从哪里来、价格如何变动，本身就是一种声音。不是让你去查账，是让你留意那些不用嘴说的信号。"),
  floor("correction", "3108", "附件里“民声池”的说明已改。原来写的是“汇总各方民意”，容易让人以为它能自己去听。现在写的是“按来源、渠道、时间整理已取得的信号，并标出缺失群体”。", "附件修订", "当前仍活跃"),
  floor("author-update", "1502", "原来它不是耳朵，是一张记录我有几只耳朵的表。", "作者回复", "当前仍活跃")
]);
