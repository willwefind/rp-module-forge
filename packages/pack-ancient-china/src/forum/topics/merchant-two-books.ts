import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("merchant-two-books", {
  node: "merchant",
  title: "两本账不一定是假账：我差点把合伙人送进去",
  postType: "correction",
  author: member("4051", "已返回"),
  body: `先认错。我在别的帖子里回复过“发现两本账就该警惕内鬼”，说得太满。上个月见到柜上两册数不相等，我把每一笔差额都圈了出来，准备拿去质问合伙人，觉得证据已经很充分。

结果一本按交货记，一本按收款记。未结清的货、寄卖的货、客人先付的定钱，自然对不上。同一个客人还在两册里用了不同称呼。我发现的不是不存在的数字，是我根本没读懂这些数字各自是什么意思。

后来对账先写四件事：这册记录什么、记账时点是什么、单位是否一致、哪些业务不入这册。把这些对齐之后，还剩一笔未解释。那一笔单列待核，不把整本账盖成清白，也不把整个人盖成有罪。

给模块投稿者一个请求：别拿“差异识别”包装成“舞弊识别”。我需要的是哪一笔需要问、去问谁、缺哪张原始凭据。没有接触凭据的权限时，请直接告诉我缺证据。不要因为界面漂亮，就替我把猜测写成判词。`,
  appliesTo: { identities: ["merchant", "local-official"], capabilities: ["ledger-evidence-crosscheck"], situations: ["suspect-ledgers", "ledger-mismatch"] },
  reliability: "plausible",
  tags: ["商贾", "账目", "反例"],
  archiveTime: "王朝档案",
  featured: true,
  reviewNote: "已补反例 · 范围收窄"
}, [
  floor("correction", "0880", "加一项：折色。银、钱、实物不统一，连抄写正确的数也可能看起来不相等。转换口径必须写来源。"),
  floor("correction", "2037", "赞同结论，但别反过来变成“两套账都有道理”。有解释只是一个候选解释，还要能落回业务与凭据。"),
  floor("author-update", "4051", "已补“剩一笔待核”。合伙人接受了道歉，茶钱算我的。", "作者更新", "已返回"),
  floor("archive-note", "7712", "经验卡只收录“比较前先统一记录口径”。不收录识别坏人的捷径；引用时保留原帖与这条反例。", "整理注")
]);
