import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import documentIntakeHandler from "../../../api/document-intake/index";
import { getPremiumConfig } from "../../../api/_lib/premiumConfig";
import {
  MAX_BENEFIT_DOCUMENT_BYTES,
  documentUploadRequestSchema,
} from "../../premium/documentIntakeContracts";
import { extractSyntheticBenefitsFacts } from "../../premium/documentExtraction";
import { scanSensitiveData } from "../../premium/sensitiveDataDetector";

const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
});

const response = () => {
  const capture: { status?: number; body?: unknown; headers: Record<string, string> } = { headers: {} };
  const res = {
    status(code: number) { capture.status = code; return res; },
    json(body: unknown) { capture.body = body; },
    setHeader(name: string, value: string) { capture.headers[name] = value; },
  };
  return { res, capture };
};

const configureDocumentDependencies = () => {
  process.env.PREMIUM_AUTH_ENABLED = "true";
  process.env.PREMIUM_WORKSPACE_PERSISTENCE_ENABLED = "true";
  process.env.PREMIUM_ENTITLEMENTS_ENABLED = "true";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_ANON_KEY = "public-anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "server-service-role";
};

const validUpload = {
  workspaceId: "10000000-0000-4000-8000-000000000001",
  documentKind: "benefits_guide",
  clientFileName: "synthetic-benefits-guide.txt",
  mimeType: "text/plain",
  fileSize: 400,
  attestations: {
    noPersonalInformation: true,
    notElectionOrIndividualRecord: true,
    authorizedToUse: true,
    syntheticPublicOrRedacted: true,
  },
};

describe("document intake configuration", () => {
  it("keeps intake, extraction, and real-document authority disabled by default", () => {
    delete process.env.PREMIUM_DOCUMENT_INTAKE_ENABLED;
    delete process.env.PREMIUM_DOCUMENT_EXTRACTION_ENABLED;
    delete process.env.PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED;
    delete process.env.PREMIUM_DOCUMENT_INTAKE_MODE;
    const config = getPremiumConfig();
    expect(config.flags.documentIntake).toBe(false);
    expect(config.flags.documentExtraction).toBe(false);
    expect(config.flags.realDocumentProcessingAuthorized).toBe(false);
    expect(config.documents.mode).toBe("disabled");
    expect(config.safe).toBe(true);
  });

  it("allows only a fully configured synthetic preview and still denies real documents", () => {
    configureDocumentDependencies();
    process.env.VERCEL_ENV = "preview";
    process.env.PREMIUM_DOCUMENT_INTAKE_ENABLED = "true";
    process.env.PREMIUM_DOCUMENT_EXTRACTION_ENABLED = "true";
    process.env.PREMIUM_DOCUMENT_INTAKE_MODE = "synthetic_only";
    process.env.PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED = "false";
    const config = getPremiumConfig();
    expect(config.safe).toBe(true);
    expect(config.documents.mode).toBe("synthetic_only");
    expect(config.flags.realDocumentProcessingAuthorized).toBe(false);
  });

  it("rejects production processing without separate explicit authorization", () => {
    configureDocumentDependencies();
    process.env.VERCEL_ENV = "production";
    process.env.PREMIUM_DOCUMENT_INTAKE_ENABLED = "true";
    process.env.PREMIUM_DOCUMENT_EXTRACTION_ENABLED = "true";
    process.env.PREMIUM_DOCUMENT_INTAKE_MODE = "redacted_benefits_only";
    process.env.PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED = "false";
    const config = getPremiumConfig();
    expect(config.safe).toBe(false);
    expect(config.violations.join(" ")).toMatch(/production document|authorization/i);
  });

  it("returns a private fail-closed response while intake is disabled", async () => {
    delete process.env.PREMIUM_DOCUMENT_INTAKE_ENABLED;
    const { res, capture } = response();
    await documentIntakeHandler({ method: "GET", headers: {}, query: { workspaceId: validUpload.workspaceId } }, res);
    expect(capture.status).toBe(503);
    expect(capture.body).toMatchObject({ code: "document_intake_unavailable" });
    expect(capture.headers["Cache-Control"]).toContain("no-store");
  });
});

describe("attestation and file boundaries", () => {
  it("requires every attestation to be affirmative", () => {
    expect(documentUploadRequestSchema.safeParse(validUpload).success).toBe(true);
    expect(documentUploadRequestSchema.safeParse({
      ...validUpload,
      attestations: { ...validUpload.attestations, noPersonalInformation: false },
    }).success).toBe(false);
    expect(documentUploadRequestSchema.safeParse({
      ...validUpload,
      attestations: { ...validUpload.attestations, notElectionOrIndividualRecord: false },
    }).success).toBe(false);
  });

  it("rejects unsupported types and files over 10 MB", () => {
    expect(documentUploadRequestSchema.safeParse({ ...validUpload, mimeType: "image/png" }).success).toBe(false);
    expect(documentUploadRequestSchema.safeParse({ ...validUpload, fileSize: MAX_BENEFIT_DOCUMENT_BYTES + 1 }).success).toBe(false);
  });

  it("does not treat an attestation as permission to accept sensitive content", () => {
    const examples = [
      "Employee ID: ABCD-1234",
      "Member ID: XZY987654",
      "Election confirmation number: 778899",
      "Pay stub for employee",
      "Password: secret-value",
      "Patient name and medical record",
      "SSN 123-45-6789",
      "Payment card 4242 4242 4242 4242",
    ];
    for (const text of examples) expect(scanSensitiveData({ text }).blocked).toBe(true);
  });

  it("blocks sensitive filenames without retaining them", () => {
    expect(scanSensitiveData({ fileName: "john-smith-enrollment-confirmation.pdf" })).toMatchObject({
      blocked: true,
      findingCodes: expect.arrayContaining(["sensitive_filename"]),
    });
    expect(scanSensitiveData({ fileName: "public-2026-benefits-guide.pdf" }).blocked).toBe(false);
  });
});

describe("synthetic extraction", () => {
  it("extracts only bounded structured benefits candidates", () => {
    const result = extractSyntheticBenefitsFacts([
      "Employee premium $120 per pay period",
      "Annual deductible $1,500",
      "Out-of-pocket maximum $5,000",
      "Employer HSA contribution $750 annually",
      "Employer retirement match 6%",
      "Vesting 3 years",
    ].join("\n"));
    expect(result.blocked).toBe(false);
    expect(result.facts).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "employee_premium", value: 120, cadence: "per_pay_period" }),
      expect.objectContaining({ key: "deductible", value: 1500 }),
      expect.objectContaining({ key: "out_of_pocket_maximum", value: 5000 }),
      expect.objectContaining({ key: "employer_hsa_or_hra_contribution", value: 750 }),
      expect.objectContaining({ key: "retirement_match_percent", value: 6 }),
      expect.objectContaining({ key: "retirement_vesting_years", value: 3 }),
    ]));
    expect(JSON.stringify(result)).not.toContain("Employee premium $120");
  });

  it("returns no facts when prohibited content is detected", () => {
    const result = extractSyntheticBenefitsFacts("Employee premium $120\nMember ID: ABC12345");
    expect(result.blocked).toBe(true);
    expect(result.facts).toEqual([]);
    expect(result.findingCodes).toContain("member_or_policy_identifier");
  });
});

describe("repository quarantine boundaries", () => {
  it("creates a private restricted bucket and service-role-only metadata table", () => {
    const migration = readFileSync("supabase/migrations/20260804193729_prelaunch_secure_benefit_document_quarantine.sql", "utf8");
    expect(migration).toContain("'benefits-document-staging'");
    expect(migration).toContain("false,\n  10485760");
    expect(migration).toContain("array['application/pdf', 'text/plain']");
    expect(migration).toContain("alter table public.benefit_document_uploads force row level security");
    expect(migration).toContain("revoke all on public.benefit_document_uploads from public, anon, authenticated");
    expect(migration).not.toMatch(/create\s+policy/i);
    expect(migration).not.toMatch(/original_filename|client_file_name/i);
  });

  it("keeps the protected route out of the sitemap and production flags disabled", () => {
    const app = readFileSync("src/App.tsx", "utf8");
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const env = readFileSync(".env.example", "utf8");
    expect(app).toContain('path="/app/benefits-decision/:workspaceId/documents"');
    expect(sitemap).not.toContain("/documents");
    expect(env).toContain("VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED=false");
    expect(env).toContain("PREMIUM_DOCUMENT_INTAKE_ENABLED=false");
    expect(env).toContain("PREMIUM_DOCUMENT_EXTRACTION_ENABLED=false");
    expect(env).toContain("PREMIUM_DOCUMENT_INTAKE_MODE=disabled");
    expect(env).toContain("PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED=false");
  });
});
