import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("revived-literate-servant", {
  node: "survival",
  title: "【翻旧帖】三百年前有人问过同样的问题：要不要让主家知道我识字",
  postType: "revived-thread",
  author: member("1184", "尚未穿越"),
  body: `在档案馆翻到一篇旧帖，标题就叫《要不要让主家知道我识字》。作者署名“某佚名婢”，叙事时间约三百年前。原帖只剩前半，我抄在下面，后半档案损坏。

【旧帖抄录】“昨日替少爷收拾书房，一本账落地，我下意识看了一眼，念出了上面的数。少爷回头看我。我说是猜的。他没说话。今夜睡不着。识字在这宅子里是好事还是坏事？若是好事，为何管事要我们别碰书。若是坏事，为何少爷看我的眼神不像要罚。有人经历过吗？我明日——”

抄到这里就没有了。我把它翻出来，是因为我还没穿，正在写自己的开局清单，“要不要露出会识字”这一条我填不出来。三百年前的人也填不出来。想问问现在在途的老乡，你们怎么填的。`,
  appliesTo: { identities: ["servant", "commoner"], capabilities: ["claim-action-consistency"], situations: ["literacy-disclosure"] },
  reliability: "anecdotal",
  tags: ["低权限", "识字", "旧帖复活"],
  archiveTime: "原帖约三百年前 · 翻帖于当前档案期",
  featured: true,
  reviewNote: "旧帖复活 · 原文残缺",
  archiveGap: { kind: "damaged-source", note: "所引旧帖仅存前半，后半档案损坏；原作者后续未知。" }
}, [
  floor("case-report", "6201", "我第四十天了。我的答案是：没有露，也没有藏。姐姐让我认布料的名字，我就慢慢认，认得比她们预期快一点点，不快很多。目前没事。不知道对不对。", "同一档案期", "在途 · 第四十天"),
  floor("correction", "1960", "旧帖里那句“少爷的眼神不像要罚”，我劝所有后来的人别太信。眼神不是证据。三百年前的她也许信了。"),
  floor("case-report", "0079", "军中相反。会算数的人粮官抢着要。同一件事，换个地方是活路。所以这条清单没有通用答案，只有“你在哪”。"),
  floor("archive-note", "7712", "原帖编号已失，此楼抄录以预备役老乡的手抄为准。后半部分确认损坏，未发现该作者的其他帖子。不推断其后续。", "归档校订", "当前仍活跃"),
  floor("author-update", "1184", "清单那一行我先填了“看地方，先不露，也不撒谎说不会”。写完发现这不是答案，是一个等着被推翻的答案。也行。", "作者更新", "尚未穿越")
]);
