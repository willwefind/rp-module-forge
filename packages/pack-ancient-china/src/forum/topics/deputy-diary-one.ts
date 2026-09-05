import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("deputy-diary-one", {
  node: "official",
  title: "县丞日志（一）：到任第一天，师爷比我更像县令",
  postType: "serial",
  author: member("6083", "状态未知"),
  body: `到任。县令告病，说是等我来了再回。师爷把印信、册子、钥匙一样一样交到我手上，交的时候一边交一边替我决定：“这个大人不用看，这个大人明日再看，这个是惯例。”我点头点了一路，点到最后才想起来，我是来当县丞的，不是来点头的。晚上把“惯例”那册翻出来了。明天写（二）。`,
  appliesTo: { identities: ["local-official"], capabilities: ["accountability-execution"], situations: ["handover"] },
  reliability: "anecdotal",
  tags: ["官场", "县丞", "连载"],
  archiveTime: "王朝档案",
  reviewNote: "未完成连载 · 仅作档案",
  archiveGap: { kind: "missing-continuation", note: "仅存第一篇，未见续篇。作者状态未知。" }
}, [
  floor("question", "0880", "（二）呢？"),
  floor("question", "0880", "四年了。楼主，你的“惯例”那册看完了吗？", "归档后第四年", "当前仍活跃"),
  floor("archive-note", "7712", "仅收到（一）。作者未再发帖，状态未知。不推断其去向，也不代作续篇。", "归档注", "当前仍活跃")
]);
