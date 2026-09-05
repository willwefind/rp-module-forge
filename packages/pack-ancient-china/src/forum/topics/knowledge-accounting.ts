import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("knowledge-accounting", {
  node: "merchant",
  title: "经验卡 01：看见差额，先核对口径",
  postType: "knowledge-card",
  author: member("7712", "当前仍活跃"),
  body: `适用范围：已经合法取得相关记录，需要比较同一业务在不同账册中的差异。此卡整理自本站创作档案“两本账不一定是假账”与县令交接帖，只用于演示可追溯的经验整理。它不是新导入 Runtime 的规则。

先确认记录对象、记账时点、计量单位和是否存在未结业务。口径不同，先分别保留原始数值及转换依据，再比较。转换依据缺失时，标记待核，不补造一个看起来合理的汇率或损耗。

失效边界：没有凭据、无法核实转换口径、或没有取得记录的权限时，不能得出舞弊结论。差异被解释也不证明所有记录真实。此卡不判断人的忠诚、品格或动机。

想反驳这张卡？欢迎带着条件和反例走“经验复现与勘误”。维护组会分别复核原帖、署名与授权，再决定是否改卡。热度和点赞不会让一条经验自动升级。`,
  appliesTo: { identities: ["merchant", "local-official"], capabilities: ["ledger-evidence-crosscheck"], situations: ["ledger-mismatch"] },
  reliability: "plausible",
  tags: ["经验库", "账目口径", "来源"],
  archiveTime: "王朝档案",
  featured: true,
  reviewNote: "展示层整理 · 尚未写入 Runtime",
  relatedThreads: ["tf-ancient-china-merchant-two-books", "tf-ancient-china-county-receipts"]
}, [
  floor("correction", "4051", "请保留我的原帖标题，后来的人才能看见我最初怎样弄错，而不是只看四句结论。"),
  floor("archive-note", "7712", "来源已关联，也保留反对意见。卡片不是原帖的替代品。", "整理更新")
]);
