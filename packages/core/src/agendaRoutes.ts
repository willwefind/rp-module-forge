import {
  CORE_CAPABILITY_IDS,
  type AgendaDefinition,
  type AgendaIdentityFacet,
  type CanonicalWorldPack,
  type CapabilitySelection,
  type ExpertSelection
} from "./types.js";
import { resolveIdentityPlaybook } from "./identityPlaybooks.js";

export type ResolvedAgendaAssembly = {
  agenda: AgendaDefinition | null;
  capabilities: CapabilitySelection[];
  experts: ExpertSelection[];
};

export function resolveAgenda(
  pack: CanonicalWorldPack,
  routeId?: string
): AgendaDefinition | null {
  if (!routeId || !pack.agendas?.length) return null;
  return pack.agendas.find((item) => item.id === routeId) ?? null;
}

function resolveIdentityFacet(
  agenda: AgendaDefinition,
  identityId: string
): AgendaIdentityFacet | null {
  const matches = (agenda.identityFacets ?? []).filter((facet) => facet.identities.includes(identityId));
  return matches.length === 1 ? matches[0] : null;
}

/**
 * Resolve a shared route into the current identity's scale of life.
 * The stable route ID is preserved and no permission data can be introduced here.
 */
export function resolveAgendaForIdentity(
  pack: CanonicalWorldPack,
  identityId: string,
  routeId?: string
): AgendaDefinition | null {
  const agenda = resolveAgenda(pack, routeId);
  if (!agenda) return null;

  const facet = resolveIdentityFacet(agenda, identityId);
  if (!facet) return agenda;

  return {
    ...agenda,
    label: facet.label ?? agenda.label,
    summary: facet.summary ?? agenda.summary,
    focusQuestions: facet.focusQuestions ?? agenda.focusQuestions,
    caution: facet.caution ?? agenda.caution,
    capabilityOverlay: facet.capabilityOverlay ?? agenda.capabilityOverlay,
    expertOverlay: facet.expertOverlay ?? agenda.expertOverlay
  };
}

export function resolveAgendaAssembly(
  pack: CanonicalWorldPack,
  identityId: string,
  routeId?: string
): ResolvedAgendaAssembly | null {
  const playbookResolution = resolveIdentityPlaybook(pack, identityId);
  if (!playbookResolution) return null;

  const { identity, playbook } = playbookResolution;
  const agenda = resolveAgendaForIdentity(pack, identityId, routeId);

  const baseCapabilities = playbook?.capabilityDefaults ?? identity.recommendedCapabilities;
  const capabilityById = new Map(baseCapabilities.map((item) => [item.id, { ...item }]));
  for (const overlay of agenda?.capabilityOverlay ?? []) {
    capabilityById.set(overlay.id, { ...overlay });
  }

  const routePrimaryIds = new Set(
    (agenda?.expertOverlay ?? [])
      .filter((item) => item.weight === "primary")
      .map((item) => item.id)
  );
  const baseExperts = playbook?.expertDefaults ?? identity.recommendedExperts;
  const expertById = new Map<string, ExpertSelection>();

  for (const item of baseExperts) {
    expertById.set(item.id, {
      ...item,
      weight: routePrimaryIds.size && item.weight === "primary" && !routePrimaryIds.has(item.id)
        ? "secondary"
        : item.weight
    });
  }
  for (const overlay of agenda?.expertOverlay ?? []) {
    expertById.set(overlay.id, { ...overlay });
  }

  return {
    agenda,
    capabilities: CORE_CAPABILITY_IDS
      .map((id) => capabilityById.get(id))
      .filter((item): item is CapabilitySelection => Boolean(item)),
    experts: pack.experts
      .map((expert) => expertById.get(expert.id))
      .filter((item): item is ExpertSelection => Boolean(item))
  };
}
