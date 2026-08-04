import {
  extractedBenefitFactSchema,
  type ExtractedBenefitFact,
  type ExtractedBenefitFactKey,
} from "./documentIntakeContracts.js";
import { scanSensitiveData } from "./sensitiveDataDetector.js";

export type SyntheticExtractionResult = {
  blocked: boolean;
  findingCodes: ReturnType<typeof scanSensitiveData>["findingCodes"];
  facts: ExtractedBenefitFact[];
};

const amount = (value: string) => Number(value.replace(/[$,\s]/g, ""));
const percent = (value: string) => Number(value.replace(/[%,\s]/g, ""));

const cadenceForLine = (line: string): ExtractedBenefitFact["cadence"] => {
  if (/per\s+pay\s+period|per\s+paycheck|biweekly|bi-weekly/i.test(line)) return "per_pay_period";
  if (/monthly|per\s+month/i.test(line)) return "monthly";
  if (/annual|per\s+year|yearly/i.test(line)) return "annual";
  return "not_applicable";
};

const makeFact = (
  key: ExtractedBenefitFactKey,
  label: string,
  value: number,
  unit: ExtractedBenefitFact["unit"],
  lineNumber: number,
  cadence?: ExtractedBenefitFact["cadence"],
): ExtractedBenefitFact => extractedBenefitFactSchema.parse({
  key,
  label,
  value,
  unit,
  lineNumber,
  cadence,
  confidence: "high",
});

export const extractSyntheticBenefitsFacts = (text: string): SyntheticExtractionResult => {
  const scan = scanSensitiveData({ text });
  if (scan.blocked) return { blocked: true, findingCodes: scan.findingCodes, facts: [] };

  const facts = new Map<ExtractedBenefitFactKey, ExtractedBenefitFact>();
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const premium = line.match(/\b(?:employee\s+premium|employee\s+cost|medical\s+premium)\b[^$\d]{0,50}\$?([\d,]+(?:\.\d{1,2})?)/i);
    if (premium && !facts.has("employee_premium")) {
      facts.set("employee_premium", makeFact("employee_premium", "Employee medical premium", amount(premium[1]), "usd", lineNumber, cadenceForLine(line)));
    }

    const deductible = line.match(/\b(?:annual\s+)?deductible\b[^$\d]{0,50}\$?([\d,]+(?:\.\d{1,2})?)/i);
    if (deductible && !facts.has("deductible")) {
      facts.set("deductible", makeFact("deductible", "Medical plan deductible", amount(deductible[1]), "usd", lineNumber, "annual"));
    }

    const outOfPocket = line.match(/\b(?:out[- ]of[- ]pocket\s+(?:maximum|max)|oop\s+max)\b[^$\d]{0,50}\$?([\d,]+(?:\.\d{1,2})?)/i);
    if (outOfPocket && !facts.has("out_of_pocket_maximum")) {
      facts.set("out_of_pocket_maximum", makeFact("out_of_pocket_maximum", "Out-of-pocket maximum", amount(outOfPocket[1]), "usd", lineNumber, "annual"));
    }

    const employerAccount = line.match(/\b(?:employer\s+)?(?:hsa|hra)\s+(?:contribution|funding)\b[^$\d]{0,50}\$?([\d,]+(?:\.\d{1,2})?)/i);
    if (employerAccount && !facts.has("employer_hsa_or_hra_contribution")) {
      facts.set("employer_hsa_or_hra_contribution", makeFact("employer_hsa_or_hra_contribution", "Employer HSA or HRA contribution", amount(employerAccount[1]), "usd", lineNumber, cadenceForLine(line) === "not_applicable" ? "annual" : cadenceForLine(line)));
    }

    const match = line.match(/\b(?:employer\s+)?(?:retirement\s+)?match\b[^%\d]{0,50}([\d.]+)\s*%/i);
    if (match && !facts.has("retirement_match_percent")) {
      facts.set("retirement_match_percent", makeFact("retirement_match_percent", "Employer retirement match", percent(match[1]), "percent", lineNumber, "not_applicable"));
    }

    const vesting = line.match(/\bvesting\b[^\d]{0,50}([\d.]+)\s*(?:year|years|yr|yrs)\b/i);
    if (vesting && !facts.has("retirement_vesting_years")) {
      facts.set("retirement_vesting_years", makeFact("retirement_vesting_years", "Retirement vesting period", Number(vesting[1]), "years", lineNumber, "not_applicable"));
    }
  });

  return { blocked: false, findingCodes: [], facts: Array.from(facts.values()) };
};
