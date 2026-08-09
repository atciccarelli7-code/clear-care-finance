import { getPremiumConfig } from "./premiumConfig.js";

export const BENEFITS_PRODUCT_KEY = "healthcare-worker-benefits-decision-system";
export const MEDICARE_PRODUCT_KEY = "medicare-coverage-decision-system";
export const PREMIUM_PRODUCT_KEY = BENEFITS_PRODUCT_KEY;

export const productRegistry = {
  [BENEFITS_PRODUCT_KEY]: {
    productKey: BENEFITS_PRODUCT_KEY,
    name: "Healthcare Worker Benefits Decision System",
    status: "private_build",
    accessType: "one_time",
    expectedPriceUsd: 29,
    expectedPriceCents: 2900,
    currency: "usd",
    priceEnvironmentVariable: "STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM",
    publicRoute: "/products/healthcare-worker-benefits-decision-system",
    applicationRoute: "/app/benefits-decision",
    workspaceKind: "benefits",
    authorizedModules: [
      "define-decision",
      "compare-compensation",
      "value-benefits",
      "health-plan-exposure",
      "retirement-benefits",
      "schedule-career",
      "verification-list",
      "decision-brief",
    ],
  },
  [MEDICARE_PRODUCT_KEY]: {
    productKey: MEDICARE_PRODUCT_KEY,
    name: "Medicare Coverage Decision System",
    status: "private_build",
    accessType: "one_time",
    expectedPriceUsd: 29,
    expectedPriceCents: 2900,
    currency: "usd",
    priceEnvironmentVariable: "STRIPE_PRICE_MEDICARE_COVERAGE_DECISION_SYSTEM",
    publicRoute: "/products/medicare-coverage-decision-system",
    applicationRoute: "/app/medicare-coverage-decision",
    workspaceKind: "medicare",
    authorizedModules: [
      "situation-timing",
      "coverage-architecture",
      "providers-geography",
      "prescriptions-pharmacy",
      "cost-exposure",
      "managed-care",
      "candidate-verification",
      "decision-brief",
    ],
  },
} as const;

export type ProductKey = keyof typeof productRegistry;

export const getProduct = (productKey: string) =>
  Object.prototype.hasOwnProperty.call(productRegistry, productKey)
    ? productRegistry[productKey as ProductKey]
    : null;

export const getServerPrice = (productKey: string) => {
  const product = getProduct(productKey);
  if (!product) return "";
  return getPremiumConfig().stripe.prices[product.productKey];
};
