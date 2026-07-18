import {
  patientEducationContentDocumentSchema,
  type PatientEducationContentDocument,
} from "@/lib/patientEducationContentContract";
import {
  patientEducationInstitutionOverlaySchema,
  type PatientEducationInstitutionOverlay,
} from "@/lib/patientEducationInstitutionOverlay";

export type PatientEducationPrivacyContext =
  | "caf_source_repository"
  | "controlled_preview"
  | "institutional_delivery";

export type PatientEducationPrivacyFinding = {
  code: string;
  severity: "warning" | "blocking";
  message: string;
  location?: string;
  remediation: string;
};

export type PatientEducationPrivacyScanResult = {
  context: PatientEducationPrivacyContext;
  passed: boolean;
  findings: PatientEducationPrivacyFinding[];
};

const obviousIdentifierPatterns: Array<{
  code: string;
  pattern: RegExp;
  message: string;
}> = [
  {
    code: "PRIVACY-SSN-DETECTED",
    pattern: /\b(?:SSN|social security(?: number)?)\s*[:#-]?\s*\d{3}-?\d{2}-?\d{4}\b/i,
    message: "A possible Social Security number is present.",
  },
  {
    code: "PRIVACY-DOB-DETECTED",
    pattern: /\b(?:DOB|date of birth)\s*[:#-]?\s*(?:\d{1,2}[/-]){2}\d{2,4}\b/i,
    message: "A possible date of birth is present.",
  },
  {
    code: "PRIVACY-MRN-DETECTED",
    pattern: /\b(?:MRN|medical record number)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i,
    message: "A possible medical record number is present.",
  },
  {
    code: "PRIVACY-PATIENT-NAME-DETECTED",
    pattern: /\bpatient(?:'s)?\s+name\s*[:#-]?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b/i,
    message: "A possible patient name is present.",
  },
  {
    code: "PRIVACY-MEMBER-ID-DETECTED",
    pattern: /\b(?:member|subscriber|account)\s*(?:id|number|#)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/i,
    message: "A possible member or account identifier is present.",
  },
];

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/;

const finding = (
  code: string,
  severity: "warning" | "blocking",
  message: string,
  remediation: string,
  location?: string,
): PatientEducationPrivacyFinding => ({
  code,
  severity,
  message,
  remediation,
  ...(location ? { location } : {}),
});

const scanText = (
  text: string,
  location: string,
  context: PatientEducationPrivacyContext,
  findings: PatientEducationPrivacyFinding[],
) => {
  for (const identifier of obviousIdentifierPatterns) {
    if (identifier.pattern.test(text)) {
      findings.push(finding(
        identifier.code,
        "blocking",
        identifier.message,
        "Remove the identifier and replace it with a schema-defined placeholder populated only inside the healthcare organization's approved clinical system.",
        location,
      ));
    }
  }

  if (context === "controlled_preview" && emailPattern.test(text)) {
    findings.push(finding(
      "PRIVACY-PUBLIC-EMAIL-REVIEW",
      "warning",
      "An email address appears in controlled-preview content.",
      "Confirm that the address is an approved public organizational contact and not a personal or patient address.",
      location,
    ));
  }
  if (context === "controlled_preview" && phonePattern.test(text)) {
    findings.push(finding(
      "PRIVACY-PUBLIC-PHONE-REVIEW",
      "warning",
      "A phone number appears in controlled-preview content.",
      "Confirm that the number is an approved public organizational contact and not patient-specific information.",
      location,
    ));
  }
};

const blockTextValues = (document: PatientEducationContentDocument) => {
  const values: Array<{ location: string; text: string }> = [];
  for (const block of document.blocks) {
    const add = (suffix: string, text: string | undefined) => {
      if (text?.trim()) values.push({ location: `block:${block.blockId}:${suffix}`, text });
    };
    if (block.type === "heading") add("text", block.text);
    if (block.type === "paragraph") add("text", block.text);
    if (block.type === "callout") {
      add("title", block.title);
      add("body", block.body);
      add("action", block.action);
    }
    if (block.type === "action_list") {
      add("title", block.title);
      block.items.forEach((item) => {
        add(`item:${item.itemId}:label`, item.label);
        add(`item:${item.itemId}:detail`, item.detail);
        add(`item:${item.itemId}:action`, item.action);
      });
      add("teach_back", block.teachBackPrompt);
    }
    if (block.type === "procedure") {
      add("title", block.title);
      block.steps.forEach((step) => {
        add(`step:${step.stepId}:title`, step.title);
        add(`step:${step.stepId}:instruction`, step.instruction);
        add(`step:${step.stepId}:verification`, step.verification);
      });
    }
    if (block.type === "personalization") {
      add("title", block.title);
      add("storage_boundary", block.storageBoundary);
      block.fields.forEach((field) => {
        add(`field:${field.fieldId}:label`, field.label);
        add(`field:${field.fieldId}:placeholder`, field.placeholder);
      });
    }
    if (block.type === "teach_back") {
      add("title", block.title);
      block.prompts.forEach((prompt, index) => add(`prompt:${index + 1}`, prompt));
      add("completion_evidence", block.completionEvidence);
    }
    if (block.type === "troubleshooting") {
      add("title", block.title);
      block.scenarios.forEach((scenario) => {
        add(`scenario:${scenario.scenarioId}:trigger`, scenario.trigger);
        add(`scenario:${scenario.scenarioId}:action`, scenario.action);
        add(`scenario:${scenario.scenarioId}:escalation`, scenario.escalation);
      });
    }
    if (block.type === "evidence_anchor") add("reviewer_note", block.reviewerNote);
  }
  return values;
};

export const scanPatientEducationDocumentPrivacy = (
  documentInput: unknown,
  context: PatientEducationPrivacyContext,
): PatientEducationPrivacyScanResult => {
  const document = patientEducationContentDocumentSchema.parse(documentInput);
  const findings: PatientEducationPrivacyFinding[] = [];

  for (const value of blockTextValues(document)) scanText(value.text, value.location, context, findings);

  for (const block of document.blocks) {
    if (block.type !== "personalization") continue;
    for (const field of block.fields) {
      if (context === "controlled_preview" && field.phiCapability !== "none") {
        findings.push(finding(
          "PRIVACY-PHI-CAPABLE-FIELD-IN-PREVIEW",
          "blocking",
          `PHI-capable field ${field.fieldId} remains in controlled-preview content.`,
          "Remove the field through the controlled-preview sanitizer before publication.",
          `block:${block.blockId}:field:${field.fieldId}`,
        ));
      }
      if (context === "caf_source_repository" && field.phiCapability !== "none" && field.placeholder?.trim()) {
        findings.push(finding(
          "PRIVACY-PHI-FIELD-POPULATED-IN-SOURCE",
          "blocking",
          `PHI-capable field ${field.fieldId} contains a placeholder or value in CAF-managed source content.`,
          "Remove the value. CAF source content may define the field but must not populate it.",
          `block:${block.blockId}:field:${field.fieldId}:placeholder`,
        ));
      }
    }
  }

  if (context === "controlled_preview" && document.distributionBoundary === "institutional") {
    const restricted = document.blocks.filter((block) => block.clinicalInstruction || !block.publicPreviewAllowed);
    if (restricted.length > 0) {
      findings.push(finding(
        "PRIVACY-CONTROLLED-PREVIEW-REQUIRES-SANITIZATION",
        "blocking",
        "The institutional document still contains blocks that are not approved for controlled preview.",
        "Compile the document through the controlled-preview sanitizer and scan the sanitized artifact instead.",
      ));
    }
  }

  return {
    context,
    passed: !findings.some((item) => item.severity === "blocking"),
    findings,
  };
};

export const scanPatientEducationOverlayPrivacy = (
  overlayInput: unknown,
  context: PatientEducationPrivacyContext,
): PatientEducationPrivacyScanResult => {
  const overlay: PatientEducationInstitutionOverlay = patientEducationInstitutionOverlaySchema.parse(overlayInput);
  const findings: PatientEducationPrivacyFinding[] = [];

  for (const field of overlay.fields) {
    scanText(field.value, `overlay:${overlay.overlayId}:field:${field.fieldId}`, context, findings);
    if (field.phiCapability !== "none") {
      findings.push(finding(
        "PRIVACY-OVERLAY-PHI-CAPABILITY",
        "blocking",
        `Institution overlay field ${field.fieldId} permits PHI.`,
        "Institution overlays must contain only approved non-PHI organizational values.",
        `overlay:${overlay.overlayId}:field:${field.fieldId}`,
      ));
    }
  }

  return {
    context,
    passed: !findings.some((item) => item.severity === "blocking"),
    findings,
  };
};

export const assertPatientEducationPrivacyBoundary = (result: PatientEducationPrivacyScanResult) => {
  if (!result.passed) {
    const codes = result.findings.filter((item) => item.severity === "blocking").map((item) => item.code).join(", ");
    throw new Error(`Patient education privacy boundary failed: ${codes}`);
  }
  return result;
};
