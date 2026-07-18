import type {
  PatientEducationContentBlock,
  PatientEducationContentDocument,
} from "@/lib/patientEducationContentContract";
import {
  patientEducationContentDocumentSchema,
} from "@/lib/patientEducationContentContract";
import {
  patientEducationQualityReportSchema,
  type PatientEducationQualityReport,
} from "@/lib/patientEducationQualityContract";

export type PatientEducationQualityThresholds = PatientEducationQualityReport["thresholds"];
export type PatientEducationHumanReviews = PatientEducationQualityReport["humanReviews"];

export type PatientEducationQualityEngineOptions = {
  generatedAt?: string;
  thresholds?: Partial<PatientEducationQualityThresholds>;
  humanReviews?: Partial<PatientEducationHumanReviews>;
  allowedAcronyms?: string[];
  maximumSentenceWords?: number;
};

const defaultThresholds: PatientEducationQualityThresholds = {
  maximumReadingGrade: 8,
  minimumReadingEase: 60,
  minimumActionabilityScore: 75,
  minimumNumeracyScore: 80,
  minimumAccessibilityScore: 90,
};

const defaultHumanReviews: PatientEducationHumanReviews = {
  healthLiteracy: "not_started",
  accessibility: "not_started",
  clinicalSafety: "not_started",
};

const defaultAllowedAcronyms = new Set([
  "AVS",
  "CAF",
  "CPR",
  "EMS",
  "ER",
  "ICU",
  "ID",
  "JSON",
  "PDF",
  "PHI",
  "RN",
]);

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const round = (value: number, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const blockTextParts = (block: PatientEducationContentBlock): string[] => {
  if (block.type === "heading") return [block.text];
  if (block.type === "paragraph") return [block.text];
  if (block.type === "callout") return [block.title, block.body, block.action ?? ""];
  if (block.type === "action_list") {
    return [
      block.title,
      ...block.items.flatMap((item) => [item.label, item.detail ?? "", item.action]),
      block.teachBackPrompt ?? "",
    ];
  }
  if (block.type === "procedure") {
    return [
      block.title,
      ...block.steps.flatMap((step) => [step.title, step.instruction, step.verification ?? ""]),
    ];
  }
  if (block.type === "personalization") {
    return [
      block.title,
      block.storageBoundary,
      ...block.fields.flatMap((field) => [field.label, field.placeholder ?? ""]),
    ];
  }
  if (block.type === "teach_back") {
    return [block.title, ...block.prompts, block.completionEvidence];
  }
  if (block.type === "troubleshooting") {
    return [
      block.title,
      ...block.scenarios.flatMap((scenario) => [scenario.trigger, scenario.action, scenario.escalation ?? ""]),
    ];
  }
  return [block.reviewerNote ?? ""];
};

export const extractPatientEducationPlainText = (document: PatientEducationContentDocument) =>
  document.blocks
    .flatMap(blockTextParts)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const splitSentences = (text: string) => {
  const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
};

const splitWords = (text: string) =>
  text
    .replace(/[’']/g, "'")
    .match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g) ?? [];

const countSyllables = (word: string) => {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!normalized) return 0;
  if (normalized.length <= 3) return 1;
  const withoutSilentEnding = normalized
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "")
    .replace(/^y/, "");
  return Math.max(1, (withoutSilentEnding.match(/[aeiouy]{1,2}/g) ?? []).length);
};

const passiveVoicePattern = /\b(?:am|are|is|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/i;
const vagueActionPattern = /\b(?:as needed|if appropriate|when possible|consider|may want to|try to)\b/i;
const placeholderPattern = /\b(?:TODO|TBD|FIXME|INSERT HERE|PLACEHOLDER)\b|\{\{[^}]+\}\}|\[\[[^\]]+\]\]/i;
const contextualNumberPattern = /\b(?:percent|%|day|days|hour|hours|minute|minutes|week|weeks|month|months|year|years|time|times|dose|doses|tablet|tablets|mg|mcg|g|ml|oz|lb|kg|°f|°c|am|pm|phone|extension|step|steps)\b/i;

const actionVerbPattern = /^(?:ask|bring|call|check|choose|confirm|contact|do|follow|get|keep|know|make|review|save|schedule|show|stop|take|tell|track|use|write)\b/i;

const findUnsupportedAcronyms = (text: string, allowedAcronyms: Set<string>) => {
  const matches = text.match(/\b[A-Z][A-Z0-9]{1,6}\b/g) ?? [];
  return [...new Set(matches)].filter((term) => !allowedAcronyms.has(term));
};

const hasActionableContent = (block: PatientEducationContentBlock) => {
  if (block.type === "action_list") return block.items.length > 0;
  if (block.type === "procedure") return block.steps.length > 0;
  if (block.type === "troubleshooting") return block.scenarios.length > 0;
  if (block.type === "callout") return Boolean(block.action);
  return false;
};

const countActionStatements = (block: PatientEducationContentBlock) => {
  if (block.type === "action_list") return block.items.map((item) => item.action);
  if (block.type === "procedure") return block.steps.map((step) => step.instruction);
  if (block.type === "troubleshooting") return block.scenarios.map((scenario) => scenario.action);
  if (block.type === "callout" && block.action) return [block.action];
  return [];
};

const calculateActionabilityScore = (document: PatientEducationContentDocument) => {
  const actionStatements = document.blocks.flatMap(countActionStatements);
  if (actionStatements.length === 0) return 0;
  const directActions = actionStatements.filter((statement) => actionVerbPattern.test(statement.trim())).length;
  const vagueActions = actionStatements.filter((statement) => vagueActionPattern.test(statement)).length;
  const teachBackBonus = document.blocks.some((block) =>
    block.type === "teach_back" || (block.type === "action_list" && Boolean(block.teachBackPrompt)),
  ) ? 10 : 0;
  return clamp(round((directActions / actionStatements.length) * 90 - vagueActions * 10 + teachBackBonus), 0, 100);
};

const calculateNumeracyScore = (sentences: string[]) => {
  const numericSentences = sentences.filter((sentence) => /\d/.test(sentence));
  if (numericSentences.length === 0) return 100;
  const contextualized = numericSentences.filter((sentence) => contextualNumberPattern.test(sentence)).length;
  return clamp(round((contextualized / numericSentences.length) * 100), 0, 100);
};

const calculateAccessibilityScore = (document: PatientEducationContentDocument) => {
  let score = 100;
  const headings = document.blocks.filter((block) => block.type === "heading");
  if (headings.length === 0) score -= 20;
  if (headings[0]?.type === "heading" && headings[0].level === "3") score -= 15;
  if (document.blocks.some((block) => block.type === "procedure" && block.steps.some((step) => !step.verification))) score -= 5;
  if (document.blocks.some((block) => block.type === "troubleshooting" && block.scenarios.some((scenario) => !scenario.escalation))) score -= 5;
  if (document.blocks.some((block) => block.type === "personalization" && block.fields.some((field) => !field.placeholder && field.phiCapability === "none"))) score -= 5;
  if (document.blocks.some((block) => block.type === "callout" && block.tone === "emergency" && !block.action)) score -= 50;
  return clamp(score, 0, 100);
};

const makeFinding = (
  code: string,
  severity: "info" | "warning" | "blocking",
  category: PatientEducationQualityReport["findings"][number]["category"],
  message: string,
  remediation: string,
  blockId?: string,
): PatientEducationQualityReport["findings"][number] => ({
  code,
  severity,
  category,
  message,
  remediation,
  ...(blockId ? { blockId } : {}),
});

export const analyzePatientEducationQuality = (
  input: unknown,
  options: PatientEducationQualityEngineOptions = {},
): PatientEducationQualityReport => {
  const document = patientEducationContentDocumentSchema.parse(input);
  const text = extractPatientEducationPlainText(document);
  const sentences = splitSentences(text);
  const words = splitWords(text);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = Math.max(1, words.length);
  const averageSentenceWords = wordCount / sentenceCount;
  const syllablesPerWord = syllables / wordCount;
  const readingGrade = clamp(round(0.39 * averageSentenceWords + 11.8 * syllablesPerWord - 15.59), 0, 20);
  const readingEase = clamp(round(206.835 - 1.015 * averageSentenceWords - 84.6 * syllablesPerWord), 0, 100);
  const passiveSentenceCount = sentences.filter((sentence) => passiveVoicePattern.test(sentence)).length;
  const passiveVoicePercent = round((passiveSentenceCount / sentenceCount) * 100);
  const actionabilityScore = calculateActionabilityScore(document);
  const numeracyScore = calculateNumeracyScore(sentences);
  const accessibilityScore = calculateAccessibilityScore(document);
  const maximumSentenceWords = options.maximumSentenceWords ?? 25;
  const thresholds = { ...defaultThresholds, ...options.thresholds };
  const humanReviews = { ...defaultHumanReviews, ...options.humanReviews };
  const findings: PatientEducationQualityReport["findings"] = [];

  for (const block of document.blocks) {
    const blockText = blockTextParts(block).join(" ");
    if (placeholderPattern.test(blockText)) {
      findings.push(makeFinding(
        "QA-UNRESOLVED-PLACEHOLDER",
        "blocking",
        "structure",
        "The document contains an unresolved authoring placeholder.",
        "Replace the placeholder with reviewed content or remove the affected block before release.",
        block.blockId,
      ));
    }
    const longSentence = splitSentences(blockText).find((sentence) => splitWords(sentence).length > maximumSentenceWords);
    if (longSentence) {
      findings.push(makeFinding(
        "QA-LONG-SENTENCE",
        "warning",
        "readability",
        `A sentence exceeds ${maximumSentenceWords} words.`,
        "Split the sentence into shorter, direct instructions while preserving clinical meaning.",
        block.blockId,
      ));
    }
    if (block.type === "callout" && block.tone === "emergency" && !block.action) {
      findings.push(makeFinding(
        "QA-EMERGENCY-ACTION-MISSING",
        "blocking",
        "clinical_safety",
        "An emergency callout does not contain an explicit action.",
        "Add a direct emergency action that uses the approved escalation pathway.",
        block.blockId,
      ));
    }
    if (block.type === "action_list" && block.items.some((item) => vagueActionPattern.test(item.action))) {
      findings.push(makeFinding(
        "QA-VAGUE-ACTION",
        "warning",
        "actionability",
        "An action item uses conditional or vague wording.",
        "Replace vague wording with a direct action, owner, and escalation route.",
        block.blockId,
      ));
    }
  }

  const allowedAcronyms = new Set([...defaultAllowedAcronyms, ...(options.allowedAcronyms ?? [])]);
  const unsupportedAcronyms = findUnsupportedAcronyms(text, allowedAcronyms);
  if (unsupportedAcronyms.length > 0) {
    findings.push(makeFinding(
      "QA-UNDEFINED-ACRONYM",
      "warning",
      "readability",
      `Potentially undefined acronym(s): ${unsupportedAcronyms.join(", ")}.`,
      "Spell out each term on first use or add it to the package-approved acronym registry.",
    ));
  }

  if (!document.blocks.some(hasActionableContent)) {
    findings.push(makeFinding(
      "QA-NO-ACTIONABLE-CONTENT",
      "blocking",
      "actionability",
      "The document contains no action list, procedure, troubleshooting action, or explicit callout action.",
      "Add at least one reviewed action pathway appropriate to the document type.",
    ));
  }

  if (document.documentKind === "full_guide" && !document.blocks.some((block) => block.type === "teach_back" || (block.type === "action_list" && block.teachBackPrompt))) {
    findings.push(makeFinding(
      "QA-TEACH-BACK-MISSING",
      "warning",
      "actionability",
      "The full guide does not contain a teach-back prompt.",
      "Add a reviewed teach-back prompt tied to the most important patient action.",
    ));
  }

  if (passiveVoicePercent > 25) {
    findings.push(makeFinding(
      "QA-PASSIVE-VOICE-HIGH",
      "warning",
      "readability",
      `Estimated passive voice is ${passiveVoicePercent}%.`,
      "Use direct subject-verb instructions where doing so does not change clinical meaning.",
    ));
  }

  if (readingGrade > thresholds.maximumReadingGrade) {
    findings.push(makeFinding(
      "QA-READING-GRADE-HIGH",
      "blocking",
      "readability",
      `Estimated reading grade ${readingGrade} exceeds the configured maximum ${thresholds.maximumReadingGrade}.`,
      "Revise sentence structure and vocabulary, then repeat clinical and health-literacy review.",
    ));
  }
  if (readingEase < thresholds.minimumReadingEase) {
    findings.push(makeFinding(
      "QA-READING-EASE-LOW",
      "warning",
      "readability",
      `Estimated reading ease ${readingEase} is below the configured minimum ${thresholds.minimumReadingEase}.`,
      "Use shorter sentences, familiar terms, and direct actions while preserving clinical accuracy.",
    ));
  }
  if (actionabilityScore < thresholds.minimumActionabilityScore) {
    findings.push(makeFinding(
      "QA-ACTIONABILITY-LOW",
      "blocking",
      "actionability",
      `Actionability score ${actionabilityScore} is below the configured minimum ${thresholds.minimumActionabilityScore}.`,
      "Add direct actions, responsible routes, and teach-back verification.",
    ));
  }
  if (numeracyScore < thresholds.minimumNumeracyScore) {
    findings.push(makeFinding(
      "QA-NUMERACY-LOW",
      "blocking",
      "numeracy",
      `Numeracy score ${numeracyScore} is below the configured minimum ${thresholds.minimumNumeracyScore}.`,
      "Add units, timeframes, frequencies, or plain-language context to every patient-facing number.",
    ));
  }
  if (accessibilityScore < thresholds.minimumAccessibilityScore) {
    findings.push(makeFinding(
      "QA-ACCESSIBILITY-LOW",
      "blocking",
      "accessibility",
      `Accessibility score ${accessibilityScore} is below the configured minimum ${thresholds.minimumAccessibilityScore}.`,
      "Correct structural accessibility findings and complete an accessibility review before release.",
    ));
  }

  const metricFailure = readingGrade > thresholds.maximumReadingGrade
    || readingEase < thresholds.minimumReadingEase
    || actionabilityScore < thresholds.minimumActionabilityScore
    || numeracyScore < thresholds.minimumNumeracyScore
    || accessibilityScore < thresholds.minimumAccessibilityScore;
  const blockingFinding = findings.some((finding) => finding.severity === "blocking");
  const reviewsApproved = Object.values(humanReviews).every((review) => review === "approved");
  const releaseDecision: PatientEducationQualityReport["releaseDecision"] = metricFailure || blockingFinding
    ? "blocked"
    : reviewsApproved
      ? "passed"
      : "conditional";

  const reportKey = `${document.documentId}-${document.assetVersion}-${document.language}`
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-");

  return patientEducationQualityReportSchema.parse({
    schemaVersion: "1.0.0",
    reportId: `CAF-PE-QA-${reportKey}`,
    packageId: document.packageId,
    packageVersion: document.assetVersion,
    documentId: document.documentId,
    documentVersion: document.assetVersion,
    locale: document.language,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    metrics: {
      readingGrade,
      readingEase,
      averageSentenceWords: round(averageSentenceWords),
      passiveVoicePercent,
      actionabilityScore,
      numeracyScore,
      accessibilityScore,
    },
    thresholds,
    findings,
    humanReviews,
    releaseDecision,
  });
};
