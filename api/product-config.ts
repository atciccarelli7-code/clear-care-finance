type ApiRequest = {
  method?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const secureHostedUrl = (value: string | undefined) => {
  if (!value?.trim()) return "";
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
};

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const checkoutUrl = secureHostedUrl(process.env.MEDICAL_BILL_WORKBOOK_CHECKOUT_URL);

  return res.status(200).json({
    productId: "expanded_medical_bill_response_workbook",
    priceUsd: 24,
    checkoutEnabled: Boolean(checkoutUrl),
    checkoutUrl,
    deliveryMode: checkoutUrl ? "hosted_provider" : "interest_only",
  });
}
