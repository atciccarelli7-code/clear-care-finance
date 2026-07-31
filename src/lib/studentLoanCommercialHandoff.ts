import type { PrivateStudentLoanRecommendationState, StudentLoanType } from "@/lib/privateStudentLoanDecision";

export type StudentLoanCommercialPartnerConfig = {
  enabled: boolean;
  partnerId: string;
  partnerName: string;
  url: string;
  compensationDisclosure: string;
  relationshipVerified: boolean;
  globalDisclosureConfirmed: boolean;
  reviewedOn: string;
  expiresOn: string;
};

export type ActiveStudentLoanCommercialHandoff = StudentLoanCommercialPartnerConfig & {
  active: true;
};

const ELIGIBLE_STATES = new Set<PrivateStudentLoanRecommendationState>([
  "seek_compare_refinance_quotes",
  "quoted_refinance_may_reduce_total_cost",
]);

const SAFE_ID_PATTERN = /^[a-z][a-z0-9_]{1,63}$/;

export const resolveStudentLoanCommercialHandoff = (
  config: Partial<StudentLoanCommercialPartnerConfig> | null | undefined,
  context: { loanType: StudentLoanType; recommendationState: PrivateStudentLoanRecommendationState; now?: Date },
): ActiveStudentLoanCommercialHandoff | null => {
  if (!config || config.enabled !== true || context.loanType !== "private" || !ELIGIBLE_STATES.has(context.recommendationState)) return null;
  if (!config.relationshipVerified || !config.globalDisclosureConfirmed) return null;
  if (!config.partnerId || !SAFE_ID_PATTERN.test(config.partnerId) || !config.partnerName?.trim()) return null;
  if (!config.compensationDisclosure?.trim() || config.compensationDisclosure.trim().length < 20) return null;
  if (!config.reviewedOn || !config.expiresOn) return null;

  let url: URL;
  try {
    url = new URL(config.url ?? "");
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;

  const reviewedOn = new Date(`${config.reviewedOn}T00:00:00Z`);
  const expiresOn = new Date(`${config.expiresOn}T23:59:59Z`);
  const now = context.now ?? new Date();
  if (Number.isNaN(reviewedOn.getTime()) || Number.isNaN(expiresOn.getTime()) || reviewedOn > now || expiresOn < now) return null;

  return { ...(config as StudentLoanCommercialPartnerConfig), active: true };
};

export const readStudentLoanCommercialConfig = (): Partial<StudentLoanCommercialPartnerConfig> | null => {
  const env = import.meta.env;
  if (env.VITE_STUDENT_LOAN_PARTNER_ENABLED !== "true") return null;
  return {
    enabled: true,
    partnerId: env.VITE_STUDENT_LOAN_PARTNER_ID,
    partnerName: env.VITE_STUDENT_LOAN_PARTNER_NAME,
    url: env.VITE_STUDENT_LOAN_PARTNER_URL,
    compensationDisclosure: env.VITE_STUDENT_LOAN_PARTNER_DISCLOSURE,
    relationshipVerified: env.VITE_STUDENT_LOAN_PARTNER_VERIFIED === "true",
    globalDisclosureConfirmed: env.VITE_STUDENT_LOAN_DISCLOSURE_CONFIRMED === "true",
    reviewedOn: env.VITE_STUDENT_LOAN_PARTNER_REVIEWED_ON,
    expiresOn: env.VITE_STUDENT_LOAN_PARTNER_EXPIRES_ON,
  };
};
