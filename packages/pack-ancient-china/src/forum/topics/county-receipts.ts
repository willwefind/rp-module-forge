import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("county-receipts", {
  node: "official",
  title: "第七次穿成县令，我终于学会不在堂上当场拆账",
  postType: "case-report",
  author: member("0880", "当前仍活跃"),
  body: `前六次的细节不说了，丢人。这次上任收到一堆交接册，我终于没像以前一样当堂翻到一个差额就拍桌。我的幕友问是不是改脾气了。我说没有，只是上一回拍完才发现看错了年份。

我现在把交接分成“已经收到”“尚未核验”“已核验仍有疑问”三列。签收只承认东西到了，不等于我替前任证明每一项都对。这个区别必须在文书上写清楚，也要确认当地规矩承不承认，不能只在脑子里想。

有效的一点是，负责的人终于能说“这一册缺附件”，不用先跟我争他是不是忠心。没解决的一点是，查证仍然慢，人手还是那几个人。如果上级明天就要一个漂亮总数，这套表不会替我扛住压力。我得自己解释为什么只能先报已知范围。`,
  appliesTo: { identities: ["local-official"], capabilities: ["accountability-execution", "ledger-evidence-crosscheck"], situations: ["handover", "suspect-ledgers"] },
  reliability: "plausible",
  tags: ["官场", "交接", "信息来源"],
  archiveTime: "王朝档案",
  reviewNote: "经验样本 · 须核当地文书规则"
}, [
  floor("question", "4051", "你的第七次给我的第二次省了一顿茶钱。能否贴不含真实人名的列名？"),
  floor("author-update", "0880", "正文三列就是全部，没有祖传模板。先看当地签收含义，别把我的表头当免罪牌。", "作者补充"),
  floor("chat", "anon-512", "终于有一个官场攻略承认“上级明天就要”的压力不会被表格解决。")
]);
