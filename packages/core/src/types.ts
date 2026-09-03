export const CORE_CAPABILITY_IDS = [
  "accountability-execution",
  "claim-action-consistency",
  "ledger-evidence-crosscheck",
  "multiplex-relationship-graph",
  "readiness-logistics",
  "plural-stakeholder-signals",
  "red-team",
  "curated-practitioner-knowledge"
] as const;

export type CoreCapabilityId = (typeof CORE_CAPABILITY_IDS)[number];
export type CapabilityMode = "resident" | "on-demand" | "disabled";
export type ExpertWeight = "primary" | "secondary";
export type TokenMode = "light" | "standard" | "full";
export type ActivationPolicy = "event-driven";

export type ForumInjectionPolicy =
  | "off"
  | "curated-only"
  | "curated-plus-links"
  | "manual";

export type ForumReliability =
  | "unknown"
  | "anecdotal"
  | "plausible"
  | "contested"
  | "corroborated"
  | "deprecated";

export type WorldPackRef = {
  id: string;
  version: string;
};

export type IdentityRef = {
  id: string;
  permissionProfile: string;
};

export type CapabilitySelection = {
  id: CoreCapabilityId;
  mode: CapabilityMode;
};

export type ExpertSelection = {
  id: string;
  weight: ExpertWeight;
};

export type TravelerForumConfig = {
  enabled: boolean;
  autoInject: ForumInjectionPolicy;
  showThreadLinks: boolean;
  minimumReliability: ForumReliability;
};

export type RuntimeConfig = {
  tokenMode: TokenMode;
  activationPolicy: ActivationPolicy;
  showEvidenceState: boolean;
  hostFinalDecision: true;
  omniscience: false;
};

export type SessionPatch = {
  facts: string[];
  claims: string[];
  notes: string;
};

export type CanonicalForgeConfig = {
  schemaVersion: 1;
  worldPack: WorldPackRef;
  identity: IdentityRef;
  capabilities: CapabilitySelection[];
  experts: ExpertSelection[];
  travelerForum: TravelerForumConfig;
  runtime: RuntimeConfig;
  sessionPatch: SessionPatch;
};

export type PermissionProfile = {
  id: string;
  observe: string[];
  access: string[];
  request: string[];
  command: string[];
  allocate: string[];
  publish: string[];
  conceal: string[];
  risks: string[];
};

/**
 * Birth-version configuration shape kept temporarily for migration and the
 * current Web App. It is not the V0.1 canonical manifest contract.
 */
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
