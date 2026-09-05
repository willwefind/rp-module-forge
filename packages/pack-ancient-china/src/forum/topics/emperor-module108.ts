import { archiveTopic, floor, member } from "../helpers.js";

export default archiveTopic("emperor-module108", {
  node: "emperor",
  title: "张居正和王阳明取长补短二合一皇帝身份开局专用辅助模块（第108次优化重置版）",
  postType: "module-release",
  author: member("anonymous-immortal", "仅有档案记录"),
  body: `致后来者：别问为什么把太岳相公的严苛考成法和阳明先生的心学心法揉在一起，问就是当年穿成亡国之君时被那帮老狐狸坑吐血了！拿去用吧，愿天下的皇帝都不用喝白水兑粟米。

第108版先改宣传：不送权力，不送忠臣，不送读心术。两位专家只是分析问题的认知镜头，不是把古人魂魄塞进你脑子里。考成台帮助拆目标、责任与核验点；知行镜追问你说要做的事和实际代价是否一致；鱼鳞算盘只检查你实际取得的账目。

皇帝开局也不能默认全知。有人报了一个数，附件只能标明“此人报告此数”，不能把它升级成国家真实库存。有冲突就列冲突，缺资料就写缺资料。如果你拿不出授权，所谓假账穿透到这里为止。

奴婢、商贾和普通人都可以读这帖。想借用其中的核验思路，请在装配台按自己的身份、路线和可接触资源重新设置。尤其不要照抄“调取六部账册”这种高权限动作。浏览皇帝区不会改变你的本局档案，也不会把本帖装进本局。

这一版只提供附件说明与现有模块工坊入口；从论坛一键安装仍未接通。去工坊后请手动核对身份与输出，确认宿主裁决、非全知约束和适用范围。谁再说点开帖子就算拥有皇权，我先收回他的木鱼。`,
  appliesTo: { identities: [], capabilities: ["accountability-execution", "claim-action-consistency", "ledger-evidence-crosscheck"], situations: ["module-adaptation"] },
  reliability: "plausible",
  tags: ["模块", "考成", "认知镜头"],
  archiveTime: "王朝档案",
  featured: true,
  reviewNote: "附件说明已整理 · 需在工坊手动配置",
  moduleAttachment: {
    label: "张居正 × 王阳明 二合一皇帝开局辅助模块",
    version: "108",
    worldPack: "ancient-china",
    suggestedIdentity: "emperor",
    capabilities: ["accountability-execution", "claim-action-consistency", "ledger-evidence-crosscheck"],
    experts: ["zhang-juzheng", "wang-yangming"],
    note: "原设计面向皇帝治理情境。附件只描述能力组合与专家镜头，不安装、不修改档案；其他身份请在模块工坊按自己的权限重新适配。"
  }
}, [
  floor("case-report", "0266", "我只借“同一件事问清交付时间”那部分，不借户部。谢谢，这次终于看得懂哪里不能用了。"),
  floor("question", "2037", "第107版的“防背刺雷达”是不是还在？这个名字很容易让新人以为能识别人心。"),
  floor("correction", "3108", "只保留风险提问，不给人贴必定背叛的标签。风险来自已知行为与信息冲突，不来自隐藏真相扫描。", "附件修订"),
  floor("author-update", "anonymous-immortal", "名字可以长，权限不能长。作者署名是论坛角色设定，不表示修仙世界包已开放。", "作者附记")
]);
