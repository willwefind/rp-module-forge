import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("first-half-hour", {
  node: "survival",
  title: "救命救命我刚穿半个时辰！！主母姓什么我都不知道！！",
  postType: "question",
  author: member("6201", "在途 · 已报平安"),
  body: `如题啊啊啊啊。醒来有人叫我去送茶，我连房门往哪开都不知道。目前已知：身上没有钱，有人叫我“小杏”。最可怕的是刚才一个姐姐问我“你昨天答应二爷的事办了没有”，我完全不知道二爷是谁。我是不是应该先装病？？？

补充：别叫我直接问主母名字！我刚跟着别人往前走了两步，发现大家见到一个人全低头，我也低了。茶还在我手里，没有摔。另一个姐姐让我去西边，我分不清西边。现在躲在廊下打字。

回来报平安：照二楼说的，我问的是“姐姐，先前那件事我怕记岔了，您再交代一句？”她只让我把衣料送去针线房，不是什么惊天秘密。送茶的路也跟着她走了一趟。我没有假装突然失忆，也没有当场背现代诗。今晚先认床位。明天再认名字。`,
  appliesTo: { identities: ["servant"], capabilities: ["curated-practitioner-knowledge"], situations: ["first-hours", "unknown-household"] },
  reliability: "anecdotal",
  tags: ["奴婢", "刚穿", "低权限"],
  archiveTime: "王朝档案",
  featured: true,
  reviewNote: "个人案例 · 情境依赖"
}, [
  floor("verified-practice", "0187", "先别发明病症，也别乱承认已经办完。挑眼前具体的一件差事复述确认：送到哪里、交给谁、回来要不要回话。你只需要把这一趟走完。"),
  floor("case-report", "anon-512", "我当年装失忆，被当成偷懒。我的案例不能泛化，但“万能装病开局”真的别当按钮按。"),
  floor("author-update", "6201", "送到了！！！没有摔！！！我现在最大的野心是今天不再端第二壶。", "当日晚些时候", "在途"),
  floor("archive-note", "0042", "接到报平安。预备役转正没有考试，别给自己再加一个失败称号。帖子先留着，后来者可以看问题怎样一步步缩小。")
]);
