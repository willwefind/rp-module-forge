import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("tofu-widow", {
  node: "ordinary",
  title: "穿成寡妇，村里说我克夫。我打算开豆腐坊。",
  postType: "case-report",
  author: member("4470", "当前仍活跃"),
  body: `开局：丈夫去世第七天，我醒过来。婆家想把我送回娘家，娘家不肯收。村里已经有了说法，说我命硬。我没有辩，辩了也没人听。眼前的问题是：这个身子会做豆腐，家里有一盘石磨，还有半袋豆子。

我先算了一笔账。半袋豆子能做四天。四天豆腐卖掉，够再买一袋。做豆腐要柴要水，水自己挑，柴要钱。挑水路上会被人看，被人看就有人说。我决定卯时挑，那时没人。

第一旬：卖出去了，但只有两户人家买，都是外村路过的。本村没人来。第二旬：村东头的老太太来了，说她不信克夫这种话，她自己也守了三十年寡。她买了两块，第二天带了另一个人来。第三旬：本村来了五户。婆家的人还没来，我也没指望。

写这些是因为我在论坛看到卖糖人那位老乡的帖子，她后来补了账，我也照着补：豆子、柴、损耗、送人的两块、老太太赊的一块。第三旬余钱二十一文。不多，但这是我自己的。克夫这话我还在听见，只是听见的次数在变少。可能是人变忙了，没空说。也可能是豆腐好吃。我不去猜。`,
  appliesTo: { identities: ["commoner"], capabilities: ["ledger-evidence-crosscheck", "plural-stakeholder-signals"], situations: ["small-business", "widowhood"] },
  reliability: "anecdotal",
  tags: ["普通人生", "小生意", "寡居"],
  archiveTime: "王朝档案",
  featured: true,
  reviewNote: "生活案例 · 已补账目"
}, [
  floor("chat", "0914", "是我！！糖人那个！！我来买豆腐！！！开玩笑的，我们不在一个村。但“送人的两块也进账”这句你比我当时想得周到。", "归档后第三年", "当前仍活跃"),
  floor("correction", "4051", "两个提醒：石磨是你的还是婆家的，这个先弄清楚，不然生意好了他们可以来收磨。第二，老太太赊的一块记着，但别催。"),
  floor("author-update", "4470", "磨是嫁妆，我翻过嫁妆单。赊的那块我没打算要。", "作者回复", "当前仍活跃"),
  floor("chat", "2048", "我也想有一盘自己的磨。", "同一档案期", "状态未知")
]);
