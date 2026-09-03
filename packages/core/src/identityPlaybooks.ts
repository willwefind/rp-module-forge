import type {
  CanonicalWorldPack,
  CapabilityFacet,
  CoreCapabilityId,
  IdentityDefinition,
  IdentityPlaybookDefinition
} from "./types.js";

export type ResolvedIdentityPlaybook = {
  identity: IdentityDefinition;
  playbook: IdentityPlaybookDefinition | null;
};

export function resolveIdentityPlaybook(
  pack: CanonicalWorldPack,
  identityId: string
): ResolvedIdentityPlaybook | null {
  const identity = pack.identities.find((item) => item.id === identityId);
  if (!identity) return null;

  if (!pack.playbooks?.length) {
    return { identity, playbook: null };
  }

  const explicit = identity.defaultPlaybook
    ? pack.playbooks.find((item) => item.id === identity.defaultPlaybook) ?? null
    : null;

  if (explicit?.identities.includes(identity.id)) {
    return { identity, playbook: explicit };
  }

  const matching = pack.playbooks.filter((item) => item.identities.includes(identity.id));
  return { identity, playbook: matching.length === 1 ? matching[0] : null };
}

export function resolveCapabilityFacet(
  pack: CanonicalWorldPack,
  identityId: string,
  capability: CoreCapabilityId
): CapabilityFacet | null {
  const resolved = resolveIdentityPlaybook(pack, identityId);
  return resolved?.playbook?.facets.find((item) => item.capability === capability) ?? null;
}
