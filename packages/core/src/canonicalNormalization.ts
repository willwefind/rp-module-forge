import {
  CORE_CAPABILITY_IDS,
  type CanonicalForgeConfig,
  type CanonicalWorldPack,
  type CapabilityMode,
  type ExpertWeight,
  type ForumReliability,
  type TokenMode
} from "./types.js";

export type CanonicalConfigIssue = {
  severity: "fatal" | "warning";
  code:
    | "schema-version"
    | "world-pack"
    | "world-pack-version"
    | "identity"
    | "unknown-agenda"
    | "custom-agenda-empty"
    | "permission-profile-corrected"
    | "unsupported-capability"
    | "invalid-capability-mode"
    | "duplicate-capability"
    | "unknown-expert"
    | "invalid-expert-weight"
    | "duplicate-expert"
    | "invalid-forum-reliability"
    | "forum-disabled-normalized"
    | "invalid-token-mode"
    | "runtime-invariant"
    | "activation-policy";
  path: string;
  message: string;
};

export type CanonicalNormalizationResult = {
  config: CanonicalForgeConfig | null;
  errors: CanonicalConfigIssue[];
  warnings: CanonicalConfigIssue[];
};

const CAPABILITY_MODES = new Set<CapabilityMode>(["resident", "on-demand", "disabled"]);
const EXPERT_WEIGHTS = new Set<ExpertWeight>(["primary", "secondary"]);
const TOKEN_MODES = new Set<TokenMode>(["light", "standard", "full"]);
const FORUM_RELIABILITIES = new Set<ForumReliability>([
  "unknown",
  "anecdotal",
  "plausible",
  "contested",
  "corroborated",
  "deprecated"
]);

function issue(
  severity: CanonicalConfigIssue["severity"],
  code: CanonicalConfigIssue["code"],
  path: string,
  message: string
): CanonicalConfigIssue {
  return { severity, code, path, message };
}

export function normalizeCanonicalConfig(
  input: CanonicalForgeConfig,
  pack: CanonicalWorldPack
): CanonicalNormalizationResult {
  const errors: CanonicalConfigIssue[] = [];
  const warnings: CanonicalConfigIssue[] = [];

  if (input.schemaVersion !== 1) {
    errors.push(issue("fatal", "schema-version", "schemaVersion", `Unsupported schemaVersion: ${String(input.schemaVersion)}`));
  }
  if (input.worldPack.id !== pack.id) {
    errors.push(issue("fatal", "world-pack", "worldPack.id", `Config targets ${input.worldPack.id}; loaded pack is ${pack.id}.`));
  }
  if (input.worldPack.version !== pack.version) {
    errors.push(issue("fatal", "world-pack-version", "worldPack.version", `Config targets ${input.worldPack.version}; loaded pack is ${pack.version}.`));
  }

  const identity = pack.identities.find((item) => item.id === input.identity.id);
  if (!identity) {
    errors.push(issue("fatal", "identity", "identity.id", `Unknown identity for ${pack.id}@${pack.version}: ${input.identity.id}`));
  }

  let normalizedAgenda = input.agenda ? { ...input.agenda } : undefined;
  if (normalizedAgenda) {
    const agenda = pack.agendas?.find((item) => item.id === normalizedAgenda!.routeId);
    if (!agenda) {
      errors.push(issue("fatal", "unknown-agenda", "agenda.routeId", `Unknown agenda route for ${pack.id}@${pack.version}: ${normalizedAgenda.routeId}`));
    } else {
      const trimmedGoal = normalizedAgenda.customGoal?.trim();
      normalizedAgenda = {
        routeId: agenda.id,
        ...(trimmedGoal ? { customGoal: trimmedGoal } : {})
      };
      if (agenda.kind === "custom" && !trimmedGoal) {
        warnings.push(issue("warning", "custom-agenda-empty", "agenda.customGoal", "Custom agenda has no goal text; runtime should treat the route as intentionally unspecified."));
      }
    }
  }

  if (input.runtime.hostFinalDecision !== true) {
    errors.push(issue("fatal", "runtime-invariant", "runtime.hostFinalDecision", "hostFinalDecision must remain true."));
  }
  if (input.runtime.omniscience !== false) {
    errors.push(issue("fatal", "runtime-invariant", "runtime.omniscience", "omniscience must remain false."));
  }
  if (input.runtime.activationPolicy !== "event-driven") {
    errors.push(issue("fatal", "activation-policy", "runtime.activationPolicy", "V0.1 only supports event-driven activation."));
  }
  if (!TOKEN_MODES.has(input.runtime.tokenMode)) {
    errors.push(issue("fatal", "invalid-token-mode", "runtime.tokenMode", `Unsupported token mode: ${String(input.runtime.tokenMode)}`));
  }
  if (!FORUM_RELIABILITIES.has(input.travelerForum.minimumReliability)) {
    errors.push(issue("fatal", "invalid-forum-reliability", "travelerForum.minimumReliability", `Unsupported forum reliability: ${String(input.travelerForum.minimumReliability)}`));
  }

  const supportedCapabilityIds = new Set(pack.capabilities.map((item) => item.id));
  const capabilityById = new Map<string, CanonicalForgeConfig["capabilities"][number]>();
  for (const selection of input.capabilities) {
    if (!CORE_CAPABILITY_IDS.includes(selection.id)) {
      errors.push(issue("fatal", "unsupported-capability", `capabilities.${selection.id}`, `Unknown Core capability: ${String(selection.id)}`));
      continue;
    }
    if (!supportedCapabilityIds.has(selection.id)) {
      errors.push(issue("fatal", "unsupported-capability", `capabilities.${selection.id}`, `Capability ${selection.id} is not provided by ${pack.id}@${pack.version}.`));
      continue;
    }
    if (!CAPABILITY_MODES.has(selection.mode)) {
      errors.push(issue("fatal", "invalid-capability-mode", `capabilities.${selection.id}.mode`, `Unsupported capability mode: ${String(selection.mode)}`));
      continue;
    }
    if (capabilityById.has(selection.id)) {
      warnings.push(issue("warning", "duplicate-capability", `capabilities.${selection.id}`, `Duplicate capability selection; the last explicit value is retained for ${selection.id}.`));
    }
    capabilityById.set(selection.id, { ...selection });
  }

  const expertIds = new Set(pack.experts.map((item) => item.id));
  const expertById = new Map<string, CanonicalForgeConfig["experts"][number]>();
  for (const selection of input.experts) {
    if (!expertIds.has(selection.id)) {
      errors.push(issue("fatal", "unknown-expert", `experts.${selection.id}`, `Unknown expert lens for ${pack.id}: ${selection.id}`));
      continue;
    }
    if (!EXPERT_WEIGHTS.has(selection.weight)) {
      errors.push(issue("fatal", "invalid-expert-weight", `experts.${selection.id}.weight`, `Unsupported expert weight: ${String(selection.weight)}`));
      continue;
    }
    if (expertById.has(selection.id)) {
      warnings.push(issue("warning", "duplicate-expert", `experts.${selection.id}`, `Duplicate expert selection; the last explicit value is retained for ${selection.id}.`));
    }
    expertById.set(selection.id, { ...selection });
  }

  if (errors.length || !identity) return { config: null, errors, warnings };

  const permissionProfile = identity.permissionProfile.id;
  if (input.identity.permissionProfile !== permissionProfile) {
    warnings.push(issue(
      "warning",
      "permission-profile-corrected",
      "identity.permissionProfile",
      `Permission profile ${input.identity.permissionProfile} does not match identity ${identity.id}; normalized to ${permissionProfile}.`
    ));
  }

  const normalizedForum = { ...input.travelerForum };
  if (!normalizedForum.enabled && (normalizedForum.autoInject !== "off" || normalizedForum.showThreadLinks)) {
    normalizedForum.autoInject = "off";
    normalizedForum.showThreadLinks = false;
    warnings.push(issue(
      "warning",
      "forum-disabled-normalized",
      "travelerForum",
      "Disabled Traveler Forum cannot auto-inject or expose runtime thread links; both were normalized off."
    ));
  }

  const config: CanonicalForgeConfig = {
    schemaVersion: 1,
    worldPack: { id: pack.id, version: pack.version },
    identity: { id: identity.id, permissionProfile },
    ...(normalizedAgenda ? { agenda: normalizedAgenda } : {}),
    capabilities: CORE_CAPABILITY_IDS
      .map((id) => capabilityById.get(id))
      .filter((item): item is CanonicalForgeConfig["capabilities"][number] => Boolean(item)),
    experts: pack.experts
      .map((expert) => expertById.get(expert.id))
      .filter((item): item is CanonicalForgeConfig["experts"][number] => Boolean(item)),
    travelerForum: normalizedForum,
    runtime: {
      tokenMode: input.runtime.tokenMode,
      activationPolicy: "event-driven",
      showEvidenceState: Boolean(input.runtime.showEvidenceState),
      hostFinalDecision: true,
      omniscience: false
    },
    sessionPatch: {
      facts: [...input.sessionPatch.facts],
      claims: [...input.sessionPatch.claims],
      notes: input.sessionPatch.notes
    }
  };

  return { config, errors, warnings };
}
