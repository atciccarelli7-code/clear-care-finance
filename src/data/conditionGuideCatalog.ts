export const ADDITIONAL_DIAGNOSIS_GUIDES = [
  {
    slug: "acute-kidney-injury",
    diagnosis: "Acute kidney injury",
    shortTitle: "AKI, Explained",
    route: "/patients-families/diagnosis-explained/acute-kidney-injury",
    intendedAudience: "Adults who have been told they have acute kidney injury, plus family members and caregivers.",
    scope: "Meaning, common mechanisms, creatinine and urine-output evaluation, fluid and medication review, kidney-replacement therapy boundaries, discharge follow-up, warning signs, questions, and teach-back.",
  },
  {
    slug: "atrial-fibrillation",
    diagnosis: "Atrial fibrillation",
    shortTitle: "AFib, Explained",
    route: "/patients-families/diagnosis-explained/atrial-fibrillation",
    intendedAudience: "Adults who have received an atrial-fibrillation diagnosis, plus family members and caregivers.",
    scope: "Rhythm and rate concepts, AF stages and patterns, stroke-risk assessment, anticoagulant purpose and bleeding safety, cardioversion, ablation, daily management, warning signs, questions, and teach-back.",
  },
  {
    slug: "gastrointestinal-bleeding",
    diagnosis: "Gastrointestinal bleeding",
    shortTitle: "GI Bleeding, Explained",
    route: "/patients-families/diagnosis-explained/gastrointestinal-bleeding",
    intendedAudience: "Adults who have been evaluated or treated for gastrointestinal bleeding, plus family members and caregivers.",
    scope: "Upper, small-bowel, and lower sources; acute versus chronic bleeding; blood counts, endoscopy, imaging, transfusion and medication review; recurrence signs; questions; and teach-back.",
  },
  {
    slug: "bowel-obstruction",
    diagnosis: "Bowel obstruction",
    shortTitle: "Bowel Obstruction, Explained",
    route: "/patients-families/diagnosis-explained/bowel-obstruction",
    intendedAudience: "Adults who have received a bowel-obstruction or ileus diagnosis, plus family members and caregivers.",
    scope: "Mechanical obstruction versus ileus, partial versus complete blockage, imaging, bowel rest, decompression, surgery boundaries, discharge diet and bowel-function questions, recurrence signs, and teach-back.",
  },
  {
    slug: "hypertension",
    diagnosis: "Hypertension",
    shortTitle: "High Blood Pressure, Explained",
    route: "/patients-families/diagnosis-explained/hypertension",
    intendedAudience: "Adults who have received a hypertension diagnosis, plus family members and caregivers.",
    scope: "Accurate measurement, 2025 blood-pressure categories, home logs, cardiovascular risk, medication purposes, resistant and secondary hypertension, severe readings versus emergency organ damage, questions, and teach-back.",
  },
  {
    slug: "dyslipidemia",
    diagnosis: "Dyslipidemia or hyperlipidemia",
    shortTitle: "High Cholesterol, Explained",
    route: "/patients-families/diagnosis-explained/dyslipidemia",
    intendedAudience: "Adults who have been told they have high cholesterol, high triglycerides, dyslipidemia, or hyperlipidemia, plus family members and caregivers.",
    scope: "LDL, non-HDL, triglycerides, ApoB and lipoprotein(a), lifetime and PREVENT-ASCVD risk, statin and nonstatin purposes, laboratory follow-up, side-effect discussions, questions, and teach-back using the 2026 dyslipidemia guideline.",
  },
  {
    slug: "kidney-failure",
    diagnosis: "Kidney failure (ESKD/ESRD)",
    shortTitle: "ESRD, Explained",
    route: "/patients-families/diagnosis-explained/kidney-failure",
    intendedAudience: "Adults who have been told they have kidney failure, end-stage kidney disease, or end-stage renal disease, plus family members and caregivers.",
    scope: "Kidney-failure terminology, symptoms and laboratory problems, hemodialysis, peritoneal dialysis, transplant and conservative management, access and infection safety, medicines and nutrition boundaries, warning signs, questions, and teach-back.",
  },
] as const;

export const ADDITIONAL_DIAGNOSIS_GUIDE_ROUTES = ADDITIONAL_DIAGNOSIS_GUIDES.map((guide) => guide.route);

export const isAdditionalDiagnosisGuideRoute = (pathname: string) =>
  ADDITIONAL_DIAGNOSIS_GUIDE_ROUTES.includes(pathname as (typeof ADDITIONAL_DIAGNOSIS_GUIDE_ROUTES)[number]);
