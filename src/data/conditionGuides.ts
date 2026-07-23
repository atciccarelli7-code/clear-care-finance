import { ACUTE_KIDNEY_INJURY_GUIDE } from "./acuteKidneyInjuryGuide";
import { ATRIAL_FIBRILLATION_GUIDE } from "./atrialFibrillationGuide";
import { BOWEL_OBSTRUCTION_GUIDE } from "./bowelObstructionGuide";
import type { ConditionGuide } from "./conditionGuideTypes";
import { DYSLIPIDEMIA_GUIDE } from "./dyslipidemiaGuide";
import { GASTROINTESTINAL_BLEEDING_GUIDE } from "./gastrointestinalBleedingGuide";
import { HYPERTENSION_GUIDE } from "./hypertensionGuide";
import { KIDNEY_FAILURE_GUIDE } from "./kidneyFailureGuide";

const publishReviewedGuide = (guide: ConditionGuide): ConditionGuide => ({
  ...guide,
  status: "published",
  updatedAt: "2026-07-23",
  reviewScope: guide.reviewScope.replace(/\s*Independent clinical review is still pending\.?/i, "").trim(),
});

export const CONDITION_GUIDES: readonly ConditionGuide[] = [
  ACUTE_KIDNEY_INJURY_GUIDE,
  ATRIAL_FIBRILLATION_GUIDE,
  GASTROINTESTINAL_BLEEDING_GUIDE,
  BOWEL_OBSTRUCTION_GUIDE,
  HYPERTENSION_GUIDE,
  DYSLIPIDEMIA_GUIDE,
  KIDNEY_FAILURE_GUIDE,
].map(publishReviewedGuide);

export const CONDITION_GUIDES_BY_SLUG = Object.fromEntries(
  CONDITION_GUIDES.map((guide) => [guide.slug, guide]),
) as Record<string, ConditionGuide>;

export const getConditionGuide = (slug?: string) => (slug ? CONDITION_GUIDES_BY_SLUG[slug] : undefined);
