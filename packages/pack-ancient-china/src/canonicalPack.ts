import { ancientChinaPackV01 as basePack } from "./index.js";
import { ancientChinaPlaybooks } from "./playbooks.js";
import { ancientChinaAgendas } from "./agendas.js";
import { ancientChinaAgendaExperts } from "./agendaExperts.js";

export const ancientChinaPackV01 = {
  ...basePack,
  experts: [...basePack.experts, ...ancientChinaAgendaExperts],
  playbooks: ancientChinaPlaybooks,
  agendas: ancientChinaAgendas
};

export { ancientChinaPlaybooks, ancientChinaAgendas, ancientChinaAgendaExperts };
