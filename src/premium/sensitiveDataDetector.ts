import type { SensitiveFindingCode } from "./documentIntakeContracts.js";

export type SensitiveDataScan = {
  blocked: boolean;
  findingCodes: SensitiveFindingCode[];
};

type Pattern = {
  code: SensitiveFindingCode;
  pattern: RegExp;
};

const textPatterns: Pattern[] = [
  { code: "social_security_number", pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
  { code: "date_of_birth", pattern: /\b(?:date\s+of\s+birth|dob)\s*[:#-]?\s*\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/gi },
  { code: "email_address", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { code: "phone_number", pattern: /(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]\d{3}[\s.-]\d{4}\b/g },
  { code: "street_address", pattern: /\b\d{1,6}\s+[A-Z0-9.'-]+(?:\s+[A-Z0-9.'-]+){0,4}\s+(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr|court|ct|boulevard|blvd|way)\b/gi },
  { code: "employee_identifier", pattern: /\b(?:employee|associate|personnel)\s*(?:id|number|no\.?|#)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi },
  { code: "member_or_policy_identifier", pattern: /\b(?:member|subscriber|policy|group)\s*(?:id|number|no\.?|#)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi },
  { code: "claim_or_eob_identifier", pattern: /\b(?:claim|eob)\s*(?:id|number|no\.?|#)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi },
  { code: "financial_account_identifier", pattern: /\b(?:bank\s+account|account\s+number|routing\s+number)\s*[:#-]?\s*\d{4,17}\b/gi },
  { code: "credential_or_password", pattern: /\b(?:password|passcode|security\s+answer|login\s+id|username)\s*[:#-]?\s*\S{4,}\b/gi },
  { code: "medical_record_or_diagnosis", pattern: /\b(?:medical\s+record|mrn|patient\s+name|diagnosed\s+with|individual\s+diagnosis)\b/gi },
  { code: "official_election_or_confirmation", pattern: /\b(?:election\s+confirmation|enrollment\s+confirmation|confirmation\s+number|completed\s+election|current\s+elections|beneficiary\s+designation|signed\s+enrollment|coverage\s+elected)\b/gi },
  { code: "individualized_pay_statement", pattern: /\b(?:pay\s*stub|pay\s+statement|earnings\s+statement|individual\s+compensation\s+statement)\b/gi },
];

const sensitiveFilenamePattern = /(?:ssn|social[-_ ]?security|member[-_ ]?id|employee[-_ ]?id|claim|eob|confirmation|election|pay[-_ ]?stub|pay[-_ ]?statement|passport|driver[-_ ]?license|medical[-_ ]?record|patient)/i;

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const passesLuhn = (value: string) => {
  const digits = digitsOnly(value);
  if (digits.length < 13 || digits.length > 19 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
};

const hasPaymentCardNumber = (text: string) => {
  const candidates = text.match(/(?:\d[ -]?){13,19}/g) || [];
  return candidates.some(passesLuhn);
};

const unique = <T,>(values: T[]) => Array.from(new Set(values));

export const scanSensitiveData = ({ fileName = "", text = "" }: { fileName?: string; text?: string }): SensitiveDataScan => {
  const findings: SensitiveFindingCode[] = [];
  if (sensitiveFilenamePattern.test(fileName)) findings.push("sensitive_filename");
  for (const { code, pattern } of textPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) findings.push(code);
  }
  if (hasPaymentCardNumber(text)) findings.push("payment_card_identifier");
  const findingCodes = unique(findings);
  return { blocked: findingCodes.length > 0, findingCodes };
};

export const safeStorageExtension = (mimeType: string) => mimeType === "text/plain" ? "txt" : "pdf";
