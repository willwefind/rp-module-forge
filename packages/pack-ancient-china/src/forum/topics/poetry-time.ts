import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("poetry-time", {
  node: "arts",
  title: "我是真的想写诗，还是只想有一点属于自己的时间？",
  postType: "chat",
  author: member("2048", "状态未知"),
  body: `以前我一直跟装配台说我要走诗画线。今天突然觉得，我可能根本不是特别想当诗人。我只是每天从早到晚都有人喊我，只有半夜大家睡了以后，那半个时辰是我的。那时候我能写两句东西，所以我把“写诗”误认成了“我想成为谁”。

如果有一天我真的自由了，也许我会什么都不写。我不知道。有人经历过这种吗？先别给我荐诗集，我的箱子放不下。也别劝我立刻赎身，钱不够。只是想在这里把这个念头说完，不想每个念头都变成明天必须完成的任务。

看完回复改了档案：路线从“成为名家”改成“保留自己的时间”。没有发生别的事，今天仍洗了两盆衣服。但我晚上不必为了证明自己想当诗人，硬写那两句了。`,
  appliesTo: { identities: ["servant", "commoner", "scholar"], capabilities: ["curated-practitioner-knowledge"], situations: ["life-route", "free-time"] },
  reliability: "anecdotal",
  tags: ["诗画", "低权限", "人生路线"],
  archiveTime: "王朝档案",
  reviewNote: "个人表达 · 不提炼为普遍建议"
}, [
  floor("case-report", "7402", "我自由以后整整半年没画。不是建议你也等半年，只想说：画笔放下以后，手还是你的。"),
  floor("chat", "6201", "我还没有半个时辰，先给未来的自己占个座。"),
  floor("correction", "3108", "已把“诗画”推荐里的成名目标做成可选项。你可以只保存一个偏好，系统不该把它升级成人生军令。"),
  floor("case-report", "3311", "我写了二十年，也没弄清楚自己是想写，还是只想有一张不被人叫走的桌子。不必急着分清。", "归档后补记", "当前仍活跃")
]);
