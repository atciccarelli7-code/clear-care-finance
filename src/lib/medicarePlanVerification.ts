export type MedicareChecklistStatus = "unconfirmed" | "confirmed" | "not-applicable";
export type MedicareVerificationState = "not_started" | "in_progress" | "completed";

export const MEDICARE_COMPLETION_GROUPS = {
  provider_access: ["providers"],
  prescriptions: ["formulary", "pharmacy"],
  plan_rules: ["authorization"],
  cost_exposure: ["costs", "moop"],
  annual_enrollment: ["anoc", "enrollment"],
} as const;

const isResolved = (status: MedicareChecklistStatus | undefined) => status === "confirmed" || status === "not-applicable";

export const getMedicarePlanVerificationState = (
  statuses: Record<string, MedicareChecklistStatus>,
  total: number,
) => {
  const values = Object.values(statuses);
  const resolved = values.filter(isResolved).length;
  const confirmed = values.filter((status) => status === "confirmed").length;
  const completeGroups = Object.entries(MEDICARE_COMPLETION_GROUPS).filter(([, itemIds]) => (
    itemIds.every((itemId) => isResolved(statuses[itemId]))
  )).map(([groupId]) => groupId);
  const completionReady = completeGroups.length === Object.keys(MEDICARE_COMPLETION_GROUPS).length;
  const state: MedicareVerificationState = resolved === 0 ? "not_started" : completionReady ? "completed" : "in_progress";

  return {
    state,
    resolved,
    confirmed,
    total,
    completeGroups,
    requiredGroups: Object.keys(MEDICARE_COMPLETION_GROUPS),
  };
};
