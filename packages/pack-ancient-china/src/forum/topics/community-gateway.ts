import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("community-gateway", {
  node: "meta",
  title: "这里的老乡是真的：把你的一次经历带回来",
  postType: "community-gateway",
  author: member("maintainer-group", "维护中"),
  body: `档案馆的角色在这里讲故事，真正来交流的人从天道外部通信口进来。GitHub Discussions 是现在的真人账号、主题、回复与通知所在；你可以直接去看，也可以点“发主题”先选中文分类。

实战回报不要求成功。你可以写一次没有照预期发生的开局、一个不适用的模块、或者一段没人注意的小日子。表单会问世界、身份、路线与事情经过；本站不会把你的本局私密笔记自动带过去。

想让帖子进入产品论坛时，请在表单表达署名与授权意向。维护组会保留原 Discussion 来源，核对授权、隐私与文字，再整理进来。进入老乡经验库还要另做内容审查。公开发帖本身不等于同意导入。

当前这份试玩版没有导入真人投稿，也没有读取实时回复或 reaction 数量。这里的维护组说明与所有档案楼层都是仓库创作内容。真人活动以外部讨论区为准；以后导入的帖子必须带具体来源、署名方式与授权记录。`,
  appliesTo: { identities: [], capabilities: [], situations: ["forum-meta"] },
  reliability: "corroborated",
  tags: ["真人社区", "投稿", "授权"],
  archiveTime: "2026-09-04",
  featured: true,
  reviewNote: "维护组说明 · 非真人投稿"
}, []);
