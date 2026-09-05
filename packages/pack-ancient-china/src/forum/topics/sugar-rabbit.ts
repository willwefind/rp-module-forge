import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("sugar-rabbit", {
  node: "ordinary",
  title: "哈哈哈哈我穿成卖糖人的了，今天赚了十三文！！",
  postType: "good-news",
  author: member("0914", "当前仍活跃"),
  body: `论坛里怎么全是亡国、抄家、断粮，我来污染一下首页。我！今天！卖出去十九个糖人！原先算刨掉糖和竹签大概赚十三文！十三文！！可以买一碗带肉的面了！！

唯一的问题是隔壁卖炊饼的大哥看我手艺看得眼神很复杂。我怀疑原主不会画这么好。明天先收敛一点。但那只兔子真的很好看，小姑娘拿着它站了半天，舍不得吃，最后先咬了耳朵。

编辑：楼下提醒得对，炭钱和摊位钱还没算，十三文是余钱，不是净赚。我留出明早进糖的钱以后，改吃了素面，加一颗蛋。开心没有撤回，账目撤回重算。`,
  appliesTo: { identities: ["commoner", "merchant"], capabilities: ["ledger-evidence-crosscheck"], situations: ["small-business"] },
  reliability: "anecdotal",
  tags: ["普通人生", "小生意", "开心"],
  archiveTime: "王朝档案",
  reviewNote: "生活记录 · 已补账目口径"
}, [
  floor("correction", "4051", "恭喜，但炭、摊位、坏掉的糖呢？别把手里剩下的钱全当利润。明天还得开张。"),
  floor("author-update", "0914", "收到，已改。可不可以允许我把“开心”留着！", "作者编辑", "当前仍活跃"),
  floor("chat", "7402", "批准。建议给兔子留个草稿，我只负责画，不负责偷吃。"),
  floor("case-report", "4470", "三年后翻到这帖。我照你补账的法子开了豆腐坊，“开心没有撤回，账目撤回重算”这句我抄在磨边上了。", "归档后第三年", "当前仍活跃")
]);
