import type {
  CanonicalForgeConfig,
  CoreCapabilityId,
  ForgeConfig,
  IdentityRef
} from "./types";

export type LegacyModuleMigrationRule =
  | {
      kind: "direct";
      capabilities: readonly CoreCapabilityId[];
      note: string;
    }
  | {
      kind: "split";
      capabilities: readonly CoreCapabilityId[];
      note: string;
    }
  | {
      kind: "absorbed";
      capabilities: readonly CoreCapabilityId[];
      note: string;
    }
  | {
      kind: "manual-review";
      capabilities: readonly CoreCapabilityId[];
      note: string;
    };

export const LEGACY_MODULE_MIGRATION: Readonly<Record<string, LegacyModuleMigrationRule>> = {
  administration: {
    kind: "direct",
    capabilities: ["accountability-execution"],
    note: "Birth-version 政务考成 maps directly to the generic accountability/execution contract."
  },
  fiscal: {
    kind: "direct",
    capabilities: ["ledger-evidence-crosscheck"],
    note: "Birth-version 财政穿透 maps directly to ledger/evidence cross-checking."
  },
  logistics: {
    kind: "direct",
    capabilities: ["readiness-logistics"],
    note: "Birth-version 兵站后勤 maps directly to readiness/logistics."
  },
  motives: {
    kind: "split",
    capabilities: ["claim-action-consistency", "multiplex-relationship-graph"],
    note: "Birth-version 人心博弈 bundled claim/action analysis with relationship mapping; V0.1 separates them."
  },
  intelligence: {
    kind: "absorbed",
    capabilities: [],
    note: "Birth-version 情报拼图 becomes the global evidence-state and non-omniscience runtime invariant, not a selectable capability."
  },
  survival: {
    kind: "absorbed",
    capabilities: [],
    note: "Birth-version 低权限生存 moves into identity permission/risk framing and pack guidance rather than a universal core capability."
  },
  status: {
    kind: "absorbed",
    capabilities: [],
    note: "Birth-version 礼法身份 moves into the explicit identity/permission profile."
  },
  resources: {
    kind: "manual-review",
    capabilities: [],
    note: "Birth-version 资源经营 spans money, goods, skills, relationships, and exchange value; V0.1 has no lossless one-to-one core capability."
  }
};

const ANCIENT_CHINA_IDENTITY_MIGRATION: Readonly<Record<string, IdentityRef>> = {
  emperor: { id: "emperor", permissionProfile: "ancient-china:emperor:v1" },
  general: { id: "general", permissionProfile: "ancient-china:general:v1" },
  servant: { id: "servant", permissionProfile: "ancient-china:servant:v1" },
  commoner: { id: "commoner", permissionProfile: "ancient-china:commoner:v1" }
};

export type LegacyMigrationWarning = {
  code:
    | "split-module"
    | "absorbed-module"
    | "manual-review-module"
    | "expert-weight-defaulted"
    | "forum-policy-tightened";
  legacyId?: string;
  message: string;
};

export type LegacyMigrationError = {
  code: "unsupported-world-pack" | "unknown-identity";
  legacyId: string;
  message: string;
};

export type LegacyMigrationResult = {
  config: CanonicalForgeConfig | null;
  warnings: LegacyMigrationWarning[];
  errors: LegacyMigrationError[];
  requiresReview: boolean;
};

function addCapability(
  output: CoreCapabilityId[],
  seen: Set<CoreCapabilityId>,
  capability: CoreCapabilityId
) {
  if (seen.has(capability)) return;
  seen.add(capability);
  output.push(capability);
}

export function migrateLegacyForgeConfig(legacy: ForgeConfig): LegacyMigrationResult {
  const warnings: LegacyMigrationWarning[] = [];
  const errors: LegacyMigrationError[] = [];

  if (legacy.worldPack !== "ancient-china") {
    errors.push({
      code: "unsupported-world-pack",
      legacyId: legacy.worldPack,
      message: `No V0.1 legacy migration is registered for world pack: ${legacy.worldPack}`
    });
  }

  const identity = ANCIENT_CHINA_IDENTITY_MIGRATION[legacy.role];
  if (!identity) {
    errors.push({
      code: "unknown-identity",
      legacyId: legacy.role,
      message: `No V0.1 permission profile is registered for legacy identity: ${legacy.role}`
    });
  }

  if (errors.length || !identity) {
    return { config: null, warnings, errors, requiresReview: true };
  }

  const capabilityIds: CoreCapabilityId[] = [];
  const seen = new Set<CoreCapabilityId>();

  for (const legacyModule of legacy.modules) {
    const rule = LEGACY_MODULE_MIGRATION[legacyModule];
    if (!rule) {
      warnings.push({
        code: "manual-review-module",
        legacyId: legacyModule,
        message: `Unknown legacy module ${legacyModule}; no automatic V0.1 capability mapping was applied.`
      });
      continue;
    }

    for (const capability of rule.capabilities) {
      addCapability(capabilityIds, seen, capability);
    }

    if (rule.kind === "split") {
      warnings.push({ code: "split-module", legacyId: legacyModule, message: rule.note });
    } else if (rule.kind === "absorbed") {
      warnings.push({ code: "absorbed-module", legacyId: legacyModule, message: rule.note });
    } else if (rule.kind === "manual-review") {
      warnings.push({ code: "manual-review-module", legacyId: legacyModule, message: rule.note });
    }
  }

  if (legacy.legacyNotes) {
    addCapability(capabilityIds, seen, "curated-practitioner-knowledge");
    warnings.push({
      code: "forum-policy-tightened",
      message: "Legacy notes are migrated to reviewed curated-only forum injection with a corroborated reliability floor."
    });
  }

  if (legacy.experts.length) {
    warnings.push({
      code: "expert-weight-defaulted",
      message: "The legacy schema stored no expert priority. Migrated experts default to secondary weight and require explicit reprioritization if desired."
    });
  }

  const config: CanonicalForgeConfig = {
    schemaVersion: 1,
    worldPack: { id: "ancient-china", version: "0.1" },
    identity,
    capabilities: capabilityIds.map((id) => ({
      id,
      mode: id === "curated-practitioner-knowledge" ? "on-demand" as const : "resident" as const
    })),
    experts: legacy.experts.map((id) => ({ id, weight: "secondary" as const })),
    travelerForum: {
      enabled: legacy.legacyNotes,
      autoInject: legacy.legacyNotes ? "curated-only" : "off",
      showThreadLinks: true,
      minimumReliability: "corroborated"
    },
    runtime: {
      tokenMode: "standard",
      activationPolicy: "event-driven",
      showEvidenceState: true,
      hostFinalDecision: true,
      omniscience: false
    },
    sessionPatch: {
      facts: [],
      claims: [],
      notes: legacy.sessionPatch ?? ""
    }
  };

  return {
    config,
    warnings,
    errors,
    requiresReview: warnings.some((warning) => warning.code !== "forum-policy-tightened")
  };
}
