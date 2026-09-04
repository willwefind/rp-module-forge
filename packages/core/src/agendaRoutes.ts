import {
  CORE_CAPABILITY_IDS,
  type AgendaDefinition,
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

export function resolveAgendaAssembly(
  pack: CanonicalWorldPack,
  identityId: string,
  routeId?: string
): ResolvedAgendaAssembly | null {
  const playbookResolution = resolveIdentityPlaybook(pack, identityId);
  if (!playbookResolution) return null;

  const { identity, playbook } = playbookResolution;
  const agenda = resolveAgenda(pack, routeId);

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
