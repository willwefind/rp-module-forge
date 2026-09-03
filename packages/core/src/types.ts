export type ForgeConfig = {
  schemaVersion: 1;
  worldPack: string;
  role: string;
  modules: string[];
  experts: string[];
  legacyNotes: boolean;
  omniscience: false;
  hostFinalDecision: true;
  sessionPatch?: string;
};

export type RoleDefinition = {
  id: string;
  label: string;
  permissionSummary: string;
  risks: string[];
  recommendedModules: string[];
  recommendedExperts: string[];
};

export type ModuleDefinition = {
  id: string;
  label: string;
  description: string;
};

export type ExpertDefinition = {
  id: string;
  label: string;
  strengths: string[];
  caution?: string;
};

export type WorldPack = {
  id: string;
  label: string;
  roles: RoleDefinition[];
  modules: ModuleDefinition[];
  experts: ExpertDefinition[];
};
