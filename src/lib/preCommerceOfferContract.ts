export const PRECOMMERCE_OFFERS = {
  benefits_decision_workspace_29_v2: {
    offerKey: "benefits_decision_workspace_29_v2",
    productId: "healthcare-worker-benefits-decision-system",
    offerVersion: "benefits_workspace_29_v2",
    priceCents: 2900,
    currency: "usd",
    source: "benefits_decision_result",
    statementVersion: "would_consider_benefits_workspace_29_v2",
  },
} as const;

export type PreCommerceOfferKey = keyof typeof PRECOMMERCE_OFFERS;
export type PreCommerceOffer = (typeof PRECOMMERCE_OFFERS)[PreCommerceOfferKey];
export type PreCommerceEvidenceClass = "observed" | "release_verification";

export const BENEFITS_WORKSPACE_OFFER = PRECOMMERCE_OFFERS.benefits_decision_workspace_29_v2;
export const PRECOMMERCE_OBSERVED_VARIANT = BENEFITS_WORKSPACE_OFFER.offerVersion;
export const PRECOMMERCE_VERIFICATION_VARIANT = `${BENEFITS_WORKSPACE_OFFER.offerVersion}_release_verification` as const;
export type PreCommerceVariant = typeof PRECOMMERCE_OBSERVED_VARIANT | typeof PRECOMMERCE_VERIFICATION_VARIANT;

export type PreCommerceCommitmentPayload = {
  offerKey: PreCommerceOfferKey;
  email: string;
  emailConsent: true;
  priceCommitment: true;
  sessionId: string;
  evidenceClass: PreCommerceEvidenceClass;
  website: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const resolvePreCommerceOffer = (value: unknown): PreCommerceOffer | null => {
  if (typeof value !== "string") return null;
  return PRECOMMERCE_OFFERS[value as PreCommerceOfferKey] ?? null;
};

export const parsePreCommerceCommitmentPayload = (value: unknown): PreCommerceCommitmentPayload | null => {
  if (!isRecord(value)) return null;
  const allowedKeys = new Set([
    "offerKey",
    "email",
    "emailConsent",
    "priceCommitment",
    "sessionId",
    "evidenceClass",
    "website",
  ]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return null;

  const offer = resolvePreCommerceOffer(value.offerKey);
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const website = typeof value.website === "string" ? value.website.trim() : "";
  const evidenceClass = value.evidenceClass;
  const sessionId = typeof value.sessionId === "string" ? value.sessionId : "";

  if (!offer || !EMAIL_PATTERN.test(email) || email.length > 320) return null;
  if (!UUID_PATTERN.test(sessionId)) return null;
  if (value.emailConsent !== true || value.priceCommitment !== true) return null;
  if (evidenceClass !== "observed" && evidenceClass !== "release_verification") return null;
  if (website.length > 200) return null;

  return {
    offerKey: offer.offerKey,
    email,
    emailConsent: true,
    priceCommitment: true,
    sessionId,
    evidenceClass,
    website,
  };
};
