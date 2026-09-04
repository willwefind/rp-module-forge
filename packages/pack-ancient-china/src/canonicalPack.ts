import { ancientChinaPackV01 as basePack } from "./index.js";
import { ancientChinaPlaybooks } from "./playbooks.js";
import { ancientChinaAgendas } from "./agendas.js";
import { ancientChinaAgendaExperts } from "./agendaExperts.js";

export const ancientChinaPackV01 = {
  ...basePack,
  // Product presentation moved from the too-narrow “中国古代” label to
  // “架空王朝”. Stable machine ids remain unchanged until a dedicated
  // manifest/profile migration is specified and tested.
  label: "架空王朝适配包",
  capabilities: basePack.capabilities.map((capability) =>
    capability.id === "curated-practitioner-knowledge"
      ? { ...capability, label: "老乡经验库", description: "调用经过审校、适用边界明确的论坛经验档案；作者可能仍活跃、已返回、失联或仅结束某次穿越身份，不把经验档案写成‘遗言’。" }
      : capability
  ),
  experts: [...basePack.experts, ...ancientChinaAgendaExperts],
  playbooks: ancientChinaPlaybooks,
  agendas: ancientChinaAgendas
};

export { ancientChinaPlaybooks, ancientChinaAgendas, ancientChinaAgendaExperts };
