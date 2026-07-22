import { ACUTE_KIDNEY_INJURY_GUIDE } from "./acuteKidneyInjuryGuide";
import { ATRIAL_FIBRILLATION_GUIDE } from "./atrialFibrillationGuide";
import { BOWEL_OBSTRUCTION_GUIDE } from "./bowelObstructionGuide";
import type { ConditionGuide } from "./conditionGuideTypes";
import { DYSLIPIDEMIA_GUIDE } from "./dyslipidemiaGuide";
import { GASTROINTESTINAL_BLEEDING_GUIDE } from "./gastrointestinalBleedingGuide";
import { HYPERTENSION_GUIDE } from "./hypertensionGuide";
import { KIDNEY_FAILURE_GUIDE } from "./kidneyFailureGuide";

export const CONDITION_GUIDES = [
  ACUTE_KIDNEY_INJURY_GUIDE,
  ATRIAL_FIBRILLATION_GUIDE,
  GASTROINTESTINAL_BLEEDING_GUIDE,
  BOWEL_OBSTRUCTION_GUIDE,
  HYPERTENSION_GUIDE,
  DYSLIPIDEMIA_GUIDE,
  KIDNEY_FAILURE_GUIDE,
] as const satisfies readonly ConditionGuide[];

export const CONDITION_GUIDES_BY_SLUG = Object.fromEntries(
  CONDITION_GUIDES.map((guide) => [guide.slug, guide]),
) as Record<string, ConditionGuide>;

export const getConditionGuide = (slug?: string) => (slug ? CONDITION_GUIDES_BY_SLUG[slug] : undefined);
