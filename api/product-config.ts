type ApiRequest = {
  method?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    productId: "expanded_medical_bill_response_workbook",
    productStatus: "audience_validation",
    checkoutEnabled: false,
    checkoutUrl: "",
    deliveryMode: "interest_only",
    paymentDecision: "deferred_until_traffic_and_operational_gates",
  });
}
