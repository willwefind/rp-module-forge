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

/**
 * A user-selected narrative direction. It describes where the host wants to go,
 * never what authority the host already has.
 */
export type AgendaSelection = {
  routeId: string;
  /** Free-text intent for the custom route or a scenario-specific refinement. */
  customGoal?: string;
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
  /** Optional during the V0.1 migration window; new Web manifests persist it. */
  agenda?: AgendaSelection;
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

export type IdentityDefinition = {
  id: string;
  label: string;
  summary: string;
  permissionProfile: PermissionProfile;
  recommendedCapabilities: CapabilitySelection[];
  recommendedExperts: ExpertSelection[];
  /**
   * Optional world-pack presentation preset. This never changes permission.
   * Older packs may omit it during the V0.1 migration window.
   */
  defaultPlaybook?: string;
};

export type CapabilityPresentation = {
  id: CoreCapabilityId;
  label: string;
  description: string;
};

export type CapabilityFacet = {
  capability: CoreCapabilityId;
  /** User-facing label for this playbook/identity scale. */
  label: string;
  /** Identity-scale purpose. Must not imply authority the permission profile lacks. */
  description: string;
  /** Questions this facet should naturally ask before proposing action. */
  questions: string[];
  /** Small setting-facing examples; examples are not runtime facts. */
  examples: string[];
};

export type IdentityPlaybookDefinition = {
  id: string;
  label: string;
  summary: string;
  /** One playbook may support several identities, though V0.1 seeds one default per identity. */
  identities: string[];
  capabilityDefaults: CapabilitySelection[];
  expertDefaults: ExpertSelection[];
  facets: CapabilityFacet[];
};

export type AgendaKind =
  | "open-ended"
  | "governance"
  | "power"
  | "survival"
  | "career"
  | "wealth"
  | "creative"
  | "leisure"
  | "retirement"
  | "custom";

/**
 * Pack-owned route overlay. Routes are deliberately not identity-gated: a
 * low-permission host may aspire to a distant role without receiving its power.
 */
export type AgendaDefinition = {
  id: string;
  label: string;
  kind: AgendaKind;
  summary: string;
  /** Used only for recommendation ordering / UI hints, never as an eligibility gate. */
  suggestedStartingIdentities: string[];
  /** Applied over the current identity playbook when restoring recommendations. */
  capabilityOverlay: CapabilitySelection[];
  /** Route-specific expert lenses; these may differ for the same starting identity. */
  expertOverlay: ExpertSelection[];
  /** Questions that keep the route concrete without pretending the outcome is guaranteed. */
  focusQuestions: string[];
  caution?: string;
};

export type ExpertDefinition = {
  id: string;
  label: string;
  strengths: string[];
  caution?: string;
};

export type CanonicalWorldPack = {
  id: string;
  version: string;
  label: string;
  identities: IdentityDefinition[];
  capabilities: CapabilityPresentation[];
  experts: ExpertDefinition[];
  /** Pack-owned identity-scale assembly/presentation presets. */
  playbooks?: IdentityPlaybookDefinition[];
  /** Pack-owned narrative direction overlays. */
  agendas?: AgendaDefinition[];
};

/**
 * Birth-version configuration shape kept temporarily for migration and
 * compatibility. It is not the V0.1 canonical manifest contract.
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

/** @deprecated Birth-version pack shape retained during M1 migration. */
export type WorldPack = {
  id: string;
  label: string;
  roles: RoleDefinition[];
  modules: ModuleDefinition[];
  experts: ExpertDefinition[];
};