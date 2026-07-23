type ApiRequest = {
  method?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const products = [
  {
    productId: "healthcare_worker_career_benefits_decision_system",
    productStatus: "private_ready",
    standardPrice: 39,
    launchPrice: 29,
    checkoutEnabled: false,
    checkoutUrl: "",
    deliveryMode: "private_master_not_hosted",
    validationOffer: {
      productId: "healthcare_worker_benefits_decision_pack",
      route: "/products/healthcare-worker-benefits-decision-pack",
      price: 29,
      mode: "paid_pilot_interest_only",
    },
  },
  {
    productId: "medical_bill_response_resolution_system",
    productStatus: "private_ready",
    standardPrice: 29,
    launchPrice: 19,
    checkoutEnabled: false,
    checkoutUrl: "",
    deliveryMode: "private_master_not_hosted",
  },
] as const;

const bundle = {
  productId: "healthcare_money_decision_library",
  productStatus: "private_ready",
  standardPrice: 59,
  launchPrice: 39,
  checkoutEnabled: false,
  checkoutUrl: "",
  deliveryMode: "private_master_not_hosted",
} as const;

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    portfolioStatus: "private_ready",
    commerceEnabled: false,
    paymentProvider: "lemon_squeezy_planned",
    hostingPlanRequiredForLaunch: "vercel_pro",
    products,
    bundle,
    paymentDecision: "deferred_until_traffic_and_operational_gates",
    activationRequires: [
      "founder_approval",
      "vercel_pro",
      "lemon_squeezy_verified",
      "hosted_delivery_tested",
      "refund_and_support_ready",
      "privacy_safe_analytics_verified",
    ],
  });
}
