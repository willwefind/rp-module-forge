import { ancientChinaPackV01 as basePack } from "./index.js";
import { ancientChinaPlaybooks } from "./playbooks.js";
import { ancientChinaAgendas } from "./agendas.js";
import { ancientChinaAgendaExperts } from "./agendaExperts.js";

export const ancientChinaPackV01 = {
  ...basePack,
  // Product presentation moved from the too-narrow “中国古代” label to
  // “架空王朝”. The stable machine id remains `ancient-china` until a
  // dedicated manifest/profile migration is specified and tested.
  label: "架空王朝适配包",
  experts: [...basePack.experts, ...ancientChinaAgendaExperts],
  playbooks: ancientChinaPlaybooks,
  agendas: ancientChinaAgendas
};

export { ancientChinaPlaybooks, ancientChinaAgendas, ancientChinaAgendaExperts };
