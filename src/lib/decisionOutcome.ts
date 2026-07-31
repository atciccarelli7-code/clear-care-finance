export type DecisionResource = {
  id: string;
  label: string;
  url: string;
  publisher: string;
  purpose: string;
};

export type DecisionProductDefinition<State extends string = string> = {
  decisionIdentifier: string;
  decisionBeingCompleted: string;
  eligibleAudience: string[];
  resultType: "calculation-and-recommendation" | "recommendation" | "action-plan";
  recommendationStates: ReadonlyArray<{ id: State; label: string }>;
  verificationRequirements: ReadonlyArray<{ id: string; label: string }>;
  requiredCautions: ReadonlyArray<{ id: string; label: string }>;
  officialResources: ReadonlyArray<DecisionResource>;
  portableOutputCapabilities: {
    copy: boolean;
    print: boolean;
    localSave: boolean;
    restart: boolean;
  };
  myPlanSupport: { enabled: boolean; recommendationId?: string };
  analyticsEvents: ReadonlyArray<string>;
  monetizationEligibility: {
    allowed: boolean;
    requiresVerifiedConfiguration: boolean;
    eligibleStateIds: ReadonlyArray<State>;
  };
  disclosureRequirements: ReadonlyArray<string>;
  noncommercialAlternatives: ReadonlyArray<DecisionResource>;
  sourceFreshnessRequirements: ReadonlyArray<{
    sourceId: string;
    reviewedOn: string;
    reviewBy: string;
  }>;
  releaseConstraints: ReadonlyArray<string>;
};

export type DecisionOutcomeMetric = {
  label: string;
  value: string;
  detail?: string;
  emphasis?: "primary" | "supporting" | "caution";
};

export type DecisionOutcomeMetricGroup = {
  title: string;
  metrics: DecisionOutcomeMetric[];
};

export type DecisionOutcomeView<State extends string = string> = {
  generatedAt: string;
  stateId: State;
  stateLabel: string;
  interpretation: string;
  primaryReason: string;
  changingAssumption: string;
  primaryCaution: string;
  additionalCautions: string[];
  firstAction: string;
  actionSequence: string[];
  verificationChecklist: string[];
  metricGroups: DecisionOutcomeMetricGroup[];
  portableSummary: string;
  educationalLimitation: string;
};

export const defineDecisionProduct = <State extends string>(
  definition: DecisionProductDefinition<State>,
) => definition;

export const validateDecisionProductDefinition = (definition: DecisionProductDefinition) => {
  const errors: string[] = [];
  const stateIds = new Set(definition.recommendationStates.map((state) => state.id));
  const resourceIds = new Set(definition.officialResources.map((resource) => resource.id));

  if (!definition.decisionIdentifier.trim()) errors.push("decisionIdentifier is required");
  if (!definition.decisionBeingCompleted.trim()) errors.push("decisionBeingCompleted is required");
  if (!definition.recommendationStates.length) errors.push("at least one recommendation state is required");
  if (stateIds.size !== definition.recommendationStates.length) errors.push("recommendation state IDs must be unique");
  if (!definition.verificationRequirements.length) errors.push("verification requirements are required");
  if (!definition.requiredCautions.length) errors.push("required cautions are required");
  if (!definition.officialResources.length) errors.push("official resources are required");
  if (resourceIds.size !== definition.officialResources.length) errors.push("official resource IDs must be unique");
  if (!definition.noncommercialAlternatives.length) errors.push("a noncommercial alternative is required");
  if (!definition.sourceFreshnessRequirements.length) errors.push("source freshness requirements are required");
  if (!definition.releaseConstraints.length) errors.push("release constraints are required");

  definition.officialResources.forEach((resource) => {
    if (!resource.url.startsWith("https://")) errors.push(`official resource ${resource.id} must use HTTPS`);
  });

  definition.monetizationEligibility.eligibleStateIds.forEach((stateId) => {
    if (!stateIds.has(stateId)) errors.push(`unknown monetization state: ${stateId}`);
  });

  if (definition.monetizationEligibility.allowed) {
    if (!definition.monetizationEligibility.requiresVerifiedConfiguration) {
      errors.push("monetization must require verified configuration");
    }
    if (!definition.disclosureRequirements.length) errors.push("monetization requires disclosure requirements");
  }

  return errors;
};
