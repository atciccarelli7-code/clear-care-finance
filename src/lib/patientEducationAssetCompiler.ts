import {
  patientEducationContentDocumentSchema,
  type PatientEducationContentBlock,
  type PatientEducationContentDocument,
  type PatientEducationContentTarget,
} from "@/lib/patientEducationContentContract";

export type PatientEducationCompileMode = "controlled_preview" | "institutional_delivery" | "internal_governance";

export type CompiledPatientEducationAsset = {
  documentId: string;
  assetId: string;
  version: string;
  target: PatientEducationContentTarget;
  mimeType: string;
  fileExtension: string;
  content: string;
  checksum: string;
  includedBlockIds: string[];
  withheldBlockIds: string[];
  warnings: string[];
};

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const stableChecksum = (value: string) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
};

const targetMetadata: Record<PatientEducationContentTarget, { mimeType: string; fileExtension: string }> = {
  responsive_html: { mimeType: "text/html; charset=utf-8", fileExtension: "html" },
  print_html: { mimeType: "text/html; charset=utf-8", fileExtension: "print.html" },
  structured_text: { mimeType: "text/plain; charset=utf-8", fileExtension: "txt" },
  avs_text: { mimeType: "text/plain; charset=utf-8", fileExtension: "avs.txt" },
  patient_portal_json: { mimeType: "application/json; charset=utf-8", fileExtension: "portal.json" },
};

const sanitizeBlocks = (
  document: PatientEducationContentDocument,
  mode: PatientEducationCompileMode,
) => {
  const included: PatientEducationContentBlock[] = [];
  const withheld: PatientEducationContentBlock[] = [];

  for (const block of document.blocks) {
    const blockedFromPreview = mode === "controlled_preview" && (block.clinicalInstruction || !block.publicPreviewAllowed);
    if (blockedFromPreview) {
      withheld.push(block);
      continue;
    }

    if (block.type === "personalization" && mode !== "institutional_delivery") {
      const safeFields = block.fields.filter((field) => field.phiCapability === "none");
      if (safeFields.length === 0) {
        withheld.push(block);
        continue;
      }
      included.push({ ...block, fields: safeFields });
      continue;
    }

    if (block.type === "evidence_anchor" && mode !== "internal_governance") {
      withheld.push(block);
      continue;
    }

    included.push(block);
  }

  return { included, withheld };
};

const renderBlockAsHtml = (block: PatientEducationContentBlock) => {
  if (block.type === "heading") {
    const tag = block.level === "2" ? "h2" : "h3";
    return `<${tag} id="${escapeHtml(block.blockId)}">${escapeHtml(block.text)}</${tag}>`;
  }
  if (block.type === "paragraph") return `<p>${escapeHtml(block.text)}</p>`;
  if (block.type === "callout") {
    const action = block.action ? `<p class="caf-action"><strong>Action:</strong> ${escapeHtml(block.action)}</p>` : "";
    return `<aside class="caf-callout caf-callout--${escapeHtml(block.tone)}" aria-label="${escapeHtml(block.iconLabel)}"><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.body)}</p>${action}</aside>`;
  }
  if (block.type === "action_list") {
    const items = block.items.map((item) => `<li data-urgency="${escapeHtml(item.urgency)}"><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}<p><span class="caf-route">${escapeHtml(item.route.replaceAll("_", " "))}:</span> ${escapeHtml(item.action)}</p></li>`).join("");
    const teachBack = block.teachBackPrompt ? `<p class="caf-teach-back"><strong>Teach-back:</strong> ${escapeHtml(block.teachBackPrompt)}</p>` : "";
    return `<section aria-labelledby="${escapeHtml(block.blockId)}-title"><h3 id="${escapeHtml(block.blockId)}-title">${escapeHtml(block.title)}</h3><ul>${items}</ul>${teachBack}</section>`;
  }
  if (block.type === "procedure") {
    const steps = block.steps.map((step, index) => `<li><strong>${index + 1}. ${escapeHtml(step.title)}</strong><p>${escapeHtml(step.instruction)}</p>${step.verification ? `<p><strong>Check:</strong> ${escapeHtml(step.verification)}</p>` : ""}</li>`).join("");
    return `<section aria-labelledby="${escapeHtml(block.blockId)}-title"><h3 id="${escapeHtml(block.blockId)}-title">${escapeHtml(block.title)}</h3><ol>${steps}</ol>${block.showMeRequired ? `<p class="caf-show-me"><strong>Show-me verification is required.</strong></p>` : ""}</section>`;
  }
  if (block.type === "personalization") {
    const fields = block.fields.map((field) => `<div class="caf-field"><span>${escapeHtml(field.label)}</span><span aria-hidden="true">____________________________</span>${field.placeholder ? `<small>${escapeHtml(field.placeholder)}</small>` : ""}</div>`).join("");
    return `<section aria-labelledby="${escapeHtml(block.blockId)}-title"><h3 id="${escapeHtml(block.blockId)}-title">${escapeHtml(block.title)}</h3><p><strong>Storage boundary:</strong> ${escapeHtml(block.storageBoundary)}</p>${fields}</section>`;
  }
  if (block.type === "teach_back") {
    const prompts = block.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("");
    return `<section aria-labelledby="${escapeHtml(block.blockId)}-title"><h3 id="${escapeHtml(block.blockId)}-title">${escapeHtml(block.title)}</h3><ul>${prompts}</ul><p><strong>Completion evidence:</strong> ${escapeHtml(block.completionEvidence)}</p></section>`;
  }
  if (block.type === "troubleshooting") {
    const rows = block.scenarios.map((scenario) => `<tr><th scope="row">${escapeHtml(scenario.trigger)}</th><td>${escapeHtml(scenario.action)}</td><td>${escapeHtml(scenario.escalation ?? "Follow the local escalation plan.")}</td></tr>`).join("");
    return `<section aria-labelledby="${escapeHtml(block.blockId)}-title"><h3 id="${escapeHtml(block.blockId)}-title">${escapeHtml(block.title)}</h3><div role="region" aria-label="${escapeHtml(block.title)} scrollable table" tabindex="0"><table><thead><tr><th scope="col">When this happens</th><th scope="col">What to do</th><th scope="col">Escalation</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  return `<aside class="caf-evidence-anchor"><strong>Evidence anchors:</strong> ${block.claimIds.map(escapeHtml).join(", ")}</aside>`;
};

const renderHtmlDocument = (
  document: PatientEducationContentDocument,
  blocks: PatientEducationContentBlock[],
  target: "responsive_html" | "print_html",
  mode: PatientEducationCompileMode,
) => {
  const blockMarkup = blocks.map(renderBlockAsHtml).join("\n");
  const printStyles = target === "print_html" ? "@page{margin:0.6in} body{font-size:11pt} .caf-field{break-inside:avoid}" : "";
  return `<!doctype html>
<html lang="${escapeHtml(document.language)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>${escapeHtml(document.title)}</title>
<style>
:root{font-family:Arial,Helvetica,sans-serif;color:#17202a;background:#fff}body{max-width:760px;margin:0 auto;padding:24px;line-height:1.55}h1,h2,h3{line-height:1.2}section,aside{margin:1.25rem 0}.caf-boundary{border:2px solid #5b6573;padding:12px;margin-bottom:18px}.caf-callout{border-left:6px solid #5b6573;padding:12px 16px;background:#f5f7f9}.caf-callout--warning{border-color:#9a6700}.caf-callout--emergency{border-color:#b42318}.caf-callout--financial{border-color:#175cd3}.caf-field{display:grid;gap:4px;margin:12px 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #6b7280;padding:8px;text-align:left;vertical-align:top}[role=region]{overflow:auto}ul,ol{padding-left:1.5rem}${printStyles}
</style>
</head>
<body data-distribution-mode="${escapeHtml(mode)}" data-document-id="${escapeHtml(document.documentId)}">
<header><p class="caf-boundary"><strong>Distribution boundary:</strong> ${escapeHtml(mode.replaceAll("_", " "))}. This generated artifact does not replace patient-specific orders, local policy, clinical judgment, or emergency services.</p><h1>${escapeHtml(document.title)}</h1><p>Version ${escapeHtml(document.assetVersion)} · ${escapeHtml(document.language)} · ${escapeHtml(document.audiences.join(", "))}</p></header>
<main>${blockMarkup}</main>
<footer><p>Document ID: ${escapeHtml(document.documentId)} · Source dossier reference: ${escapeHtml(document.sourceDossierId)}</p></footer>
</body>
</html>`;
};

const blockToText = (block: PatientEducationContentBlock) => {
  if (block.type === "heading") return `\n${block.text.toUpperCase()}\n`;
  if (block.type === "paragraph") return block.text;
  if (block.type === "callout") return `${block.title}: ${block.body}${block.action ? ` Action: ${block.action}` : ""}`;
  if (block.type === "action_list") return [block.title, ...block.items.map((item) => `- ${item.label}: ${item.action}${item.detail ? ` (${item.detail})` : ""}`), ...(block.teachBackPrompt ? [`Teach-back: ${block.teachBackPrompt}`] : [])].join("\n");
  if (block.type === "procedure") return [block.title, ...block.steps.map((step, index) => `${index + 1}. ${step.title}: ${step.instruction}${step.verification ? ` Check: ${step.verification}` : ""}`)].join("\n");
  if (block.type === "personalization") return [block.title, ...block.fields.map((field) => `${field.label}: ____________________`), `Storage boundary: ${block.storageBoundary}`].join("\n");
  if (block.type === "teach_back") return [block.title, ...block.prompts.map((prompt) => `- ${prompt}`), `Completion evidence: ${block.completionEvidence}`].join("\n");
  if (block.type === "troubleshooting") return [block.title, ...block.scenarios.map((scenario) => `- If ${scenario.trigger}: ${scenario.action}${scenario.escalation ? ` Escalation: ${scenario.escalation}` : ""}`)].join("\n");
  return `Evidence anchors: ${block.claimIds.join(", ")}`;
};

const renderTextDocument = (
  document: PatientEducationContentDocument,
  blocks: PatientEducationContentBlock[],
  target: "structured_text" | "avs_text",
  mode: PatientEducationCompileMode,
) => {
  const prefix = target === "avs_text" ? "AFTER-VISIT SUMMARY CONTENT\n" : "STRUCTURED PATIENT EDUCATION CONTENT\n";
  return [
    prefix,
    document.title,
    `Version: ${document.assetVersion}`,
    `Distribution boundary: ${mode.replaceAll("_", " ")}`,
    "This content does not replace patient-specific orders, local policy, clinical judgment, or emergency services.",
    "",
    ...blocks.map(blockToText),
    "",
    `Document ID: ${document.documentId}`,
    `Source dossier reference: ${document.sourceDossierId}`,
  ].join("\n");
};

const renderPortalJson = (
  document: PatientEducationContentDocument,
  blocks: PatientEducationContentBlock[],
  mode: PatientEducationCompileMode,
) => JSON.stringify({
  schemaVersion: "1.0.0",
  documentId: document.documentId,
  packageId: document.packageId,
  assetId: document.assetId,
  version: document.assetVersion,
  title: document.title,
  language: document.language,
  audiences: document.audiences,
  distributionBoundary: mode,
  sourceDossierRef: document.sourceDossierId,
  disclaimer: "This content does not replace patient-specific orders, local policy, clinical judgment, or emergency services.",
  blocks,
}, null, 2);

export const compilePatientEducationAsset = (
  value: unknown,
  target: PatientEducationContentTarget,
  mode: PatientEducationCompileMode,
): CompiledPatientEducationAsset => {
  const document = patientEducationContentDocumentSchema.parse(value);
  if (!document.supportedTargets.includes(target)) {
    throw new Error(`Document ${document.documentId} does not support target: ${target}.`);
  }
  if (mode === "institutional_delivery" && document.distributionBoundary !== "institutional") {
    throw new Error(`Institutional delivery requires document ${document.documentId} to use the institutional boundary.`);
  }
  if (mode === "controlled_preview" && document.distributionBoundary === "internal_governance") {
    throw new Error(`Internal-governance document ${document.documentId} cannot be compiled as a controlled preview.`);
  }

  const { included, withheld } = sanitizeBlocks(document, mode);
  if (included.length === 0) throw new Error(`No distributable blocks remain for ${document.documentId} in ${mode} mode.`);

  let content: string;
  if (target === "responsive_html" || target === "print_html") content = renderHtmlDocument(document, included, target, mode);
  else if (target === "structured_text" || target === "avs_text") content = renderTextDocument(document, included, target, mode);
  else content = renderPortalJson(document, included, mode);

  const metadata = targetMetadata[target];
  const warnings = withheld.length > 0 ? [`${withheld.length} restricted block(s) were withheld from this export.`] : [];

  return {
    documentId: document.documentId,
    assetId: document.assetId,
    version: document.assetVersion,
    target,
    mimeType: metadata.mimeType,
    fileExtension: metadata.fileExtension,
    content,
    checksum: stableChecksum(content),
    includedBlockIds: included.map((block) => block.blockId),
    withheldBlockIds: withheld.map((block) => block.blockId),
    warnings,
  };
};
