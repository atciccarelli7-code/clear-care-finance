import { getPremiumConfig } from "./premiumConfig";

export const PREMIUM_PRODUCT_KEY = "healthcare-worker-benefits-decision-system";

export const productRegistry = {
  [PREMIUM_PRODUCT_KEY]: {
    productKey: PREMIUM_PRODUCT_KEY,
    name: "Healthcare Worker Benefits Decision System",
    status: "private_build",
    accessType: "one_time",
    expectedPriceUsd: 29,
    publicRoute: "/products/healthcare-worker-benefits-decision-system",
    applicationRoute: "/app/benefits-decision",
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
} as const;

export type ProductKey = keyof typeof productRegistry;

export const getProduct = (productKey: string) =>
  Object.prototype.hasOwnProperty.call(productRegistry, productKey)
    ? productRegistry[productKey as ProductKey]
    : null;

export const getServerPrice = (productKey: string) => {
  if (productKey !== PREMIUM_PRODUCT_KEY) return "";
  return getPremiumConfig().stripe.price;
};
