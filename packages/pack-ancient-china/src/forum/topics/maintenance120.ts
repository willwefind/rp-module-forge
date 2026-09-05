import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("maintenance120", {
  node: "meta",
  title: "第120次维护记录：户籍册收好，逛隔壁不算重新投胎",
  postType: "maintenance-record",
  author: member("3108", "维护中"),
  body: `后勤处接到投诉：老乡只是去隔壁皇帝区看看热闹，回来发现自己的户籍差点跟着换了。现已划清界线：你看哪个世界是你的自由，本局档案要经过你亲手保存才改。

档案柜支持多份档案，新建、改名、编辑身份与路线、删除和导出备份都在柜内办理。删除会再核对档案名，最后一份不删。浏览器写不进去时会明确提醒，不发假的“已保存”回执。

通信口挂上七块中文门牌。帖子旁的勘误入口会带上帖子标题；RP 身份、路线和笔记不会顺路带走。旧示意点赞数已撤下，楼层按实际收录数量显示，各帖的回复也各归各位。

西方幻想、未来科幻、武侠和修仙等仍未开放。想盖新世界请递提案，不能先把一块空地写成营业中。`,
  appliesTo: { identities: [], capabilities: [], situations: ["forum-meta"] },
  reliability: "corroborated",
  tags: ["档案", "分类表单", "维护记录"],
  archiveTime: "2026-09-04",
  reviewNote: "已实现交互记录"
}, [
  floor("maintainer-argument", "0042", "最后一份档案删不掉是有意的。想重新开始，改这份或先新建一份都行，别拿锤子敲柜门。"),
  floor("case-report", "1184", "确认，逛了皇帝区，回来还是预备役。松一口气，又有一点失落。")
]);
