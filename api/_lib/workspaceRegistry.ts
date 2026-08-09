import { workspaceStateSchema, emptyWorkspaceState } from "../../src/premium/contracts.js";
import { calculateProgress } from "../../src/premium/calculations.js";
import { medicareCoverageStateSchema, emptyMedicareCoverageState } from "../../src/medicare/contracts.js";
import { medicareProgress } from "../../src/lib/medicareCoverageDecision.js";
import { BENEFITS_PRODUCT_KEY, MEDICARE_PRODUCT_KEY, getProduct, type ProductKey } from "./productRegistry.js";

const workspaceRegistry = {
  [BENEFITS_PRODUCT_KEY]: {
    schema: workspaceStateSchema,
    emptyState: emptyWorkspaceState,
    progress: (state: unknown) => calculateProgress(workspaceStateSchema.parse(state).completedModuleKeys),
  },
  [MEDICARE_PRODUCT_KEY]: {
    schema: medicareCoverageStateSchema,
    emptyState: emptyMedicareCoverageState,
    progress: (state: unknown) => medicareProgress(medicareCoverageStateSchema.parse(state).completedStages),
  },
} as const;

export const getWorkspaceContract = (productKey: string) => (
  getProduct(productKey) ? workspaceRegistry[productKey as ProductKey] : null
);

export const parseWorkspaceState = (productKey: string, state: unknown) => {
  const contract = getWorkspaceContract(productKey);
  if (!contract) throw new Error("unsupported_workspace_product");
  return contract.schema.parse(state);
};

export const emptyWorkspaceStateForProduct = (productKey: string) => {
  const contract = getWorkspaceContract(productKey);
  if (!contract) throw new Error("unsupported_workspace_product");
  return contract.emptyState();
};

export const workspaceProgressForProduct = (productKey: string, state: unknown) => {
  const contract = getWorkspaceContract(productKey);
  if (!contract) throw new Error("unsupported_workspace_product");
  return contract.progress(state);
};
