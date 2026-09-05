import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("maintainer-reaction-debate", {
  node: "meta",
  title: "维护组争论：要不要给帖子加一个“我踩过这个坑”的计数",
  postType: "maintainer-argument",
  author: member("0042", "任务中"),
  body: `后勤处提案：给每篇帖子加四个按钮——有用、我复现过、适用性存疑、我踩过这个坑——并显示数字。理由很简单：老乡看帖时想知道别人踩过没有。一个数字比翻四十楼快。

档案处反对，理由在楼下。这帖把争论原样留着，没有谁说服谁，只有一个暂时的决定。`,
  appliesTo: { identities: [], capabilities: [], situations: ["forum-meta"] },
  reliability: "contested",
  tags: ["维护组", "争论", "计数"],
  archiveTime: "2026-09-04",
  featured: true,
  reviewNote: "争论保留 · 暂定不设站内计数"
}, [
  floor("maintainer-argument", "7712", "反对的不是按钮，是数字。“踩过这个坑”的数字会变成另一种点赞：一篇写得惊心动魄的帖子会得到很多“踩过”，哪怕它的方法是错的。数字一旦挂上去，后来的人就会把它读成可靠度。我们花了一百多次维护记录才把“好笑”和“可靠”拆开，别用一个按钮再焊回去。", "同一档案期", "当前仍活跃"),
  floor("maintainer-argument", "0042", "那不显示数字，只让人按，按了去表单填条件？", "作者回复", "任务中"),
  floor("maintainer-argument", "3108", "现在就是这么做的：按钮打开分类选择器，带上帖子标题，去勘误表单写条件和证据。不在站内记数。真人反应留在通信口那边，那边的数字也不回流成可靠度。", "同一档案期", "当前仍活跃"),
  floor("maintainer-argument", "0042", "行。暂时这样。但我保留意见：总有一天老乡会嫌填表麻烦。到那天再吵。", "作者回复 · 结论", "任务中"),
  floor("chat", "1184", "围观了全程。我是那个嫌填表麻烦的老乡。但我也是那个会把“踩过”数字当真的老乡。所以……先这样吧。", "同一档案期", "尚未穿越")
]);
