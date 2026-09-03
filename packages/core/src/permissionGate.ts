import type { CoreCapabilityId, PermissionProfile } from "./types";

export const PERMISSION_DIMENSIONS = [
  "observe",
  "access",
  "request",
  "command",
  "allocate",
  "publish",
  "conceal"
] as const;

export type PermissionDimension = (typeof PERMISSION_DIMENSIONS)[number];

export type PermissionBasis =
  | { kind: "none" }
  | { kind: "profile-scope"; scope: string }
  | { kind: "session-override"; reference: string };

export type PermissionRequest = {
  dimension: PermissionDimension;
  target: string;
  capability?: CoreCapabilityId;
  basis?: PermissionBasis;
};

export type PermissionDecision = {
  status: "permitted" | "denied" | "needs-context";
  dimension: PermissionDimension;
  target: string;
  capability?: CoreCapabilityId;
  source: "profile" | "session-override" | null;
  matchedScope?: string;
  reason: string;
  risks: string[];
};

export function checkPermission(
  profile: PermissionProfile,
  request: PermissionRequest
): PermissionDecision {
  const basis = request.basis ?? { kind: "none" as const };
  const scopes = profile[request.dimension];
  const common = {
    dimension: request.dimension,
    target: request.target,
    capability: request.capability,
    risks: [...profile.risks]
  };

  if (basis.kind === "session-override") {
    const reference = basis.reference.trim();
    if (!reference) {
      return {
        ...common,
        status: "needs-context",
        source: null,
        reason: "A session override was requested but no accepted RP-context reference was supplied."
      };
    }

    return {
      ...common,
      status: "permitted",
      source: "session-override",
      reason: `Permitted by explicit accepted session context: ${reference}. This does not mutate the base permission profile.`
    };
  }

  if (basis.kind === "profile-scope") {
    if (scopes.includes(basis.scope)) {
      return {
        ...common,
        status: "permitted",
        source: "profile",
        matchedScope: basis.scope,
        reason: `Target is supported by an explicit ${request.dimension} scope in permission profile ${profile.id}.`
      };
    }

    return {
      ...common,
      status: "denied",
      source: null,
      reason: `The claimed ${request.dimension} scope is not present in permission profile ${profile.id}.`
    };
  }

  if (scopes.length === 0) {
    return {
      ...common,
      status: "denied",
      source: null,
      reason: `Permission profile ${profile.id} declares no ordinary ${request.dimension} authority. A capability selection cannot create that authority.`
    };
  }

  return {
    ...common,
    status: "needs-context",
    source: null,
    reason: `Permission profile ${profile.id} has bounded ${request.dimension} scopes, but none has been matched to “${request.target}”. Supply an exact profile scope or an accepted session override before treating the action as permitted.`
  };
}
