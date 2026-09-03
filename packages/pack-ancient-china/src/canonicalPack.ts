import { ancientChinaPackV01 as basePack } from "./index.js";
import { ancientChinaPlaybooks } from "./playbooks.js";

export const ancientChinaPackV01 = {
  ...basePack,
  playbooks: ancientChinaPlaybooks
};

export { ancientChinaPlaybooks };
