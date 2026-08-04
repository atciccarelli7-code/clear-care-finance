import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("document integrity contract", () => {
  it("recomputes and timing-safely compares SHA-256 on the server", () => {
    const service = read("api/_lib/documentIntake.ts");
    expect(service).toContain('createHash("sha256")');
    expect(service).toContain("timingSafeEqual(calculated, supplied)");
    expect(service).toContain("downloadStorageBytes(context.admin, storagePath)");
    expect(service).toContain('"upload_integrity_mismatch"');
    expect(service).toContain('"stored_integrity_mismatch"');
  });

  it("checks file signatures rather than trusting the extension", () => {
    const service = read("api/_lib/documentIntake.ts");
    expect(service).toContain('bytes.subarray(0, 5).toString("ascii") === "%PDF-"');
    expect(service).toContain('new TextDecoder("utf-8", { fatal: true }).decode(bytes)');
    expect(service).toContain("signatureMatches");
  });

  it("deletes the quarantined object and authorization record after integrity failure", () => {
    const service = read("api/_lib/documentIntake.ts");
    expect(service).toContain("deleteAuthorizationAndObject");
    expect(service).toContain("removeStoragePath(context.admin, path)");
    expect(service).toContain('.from("benefit_document_uploads")');
    expect(service).toContain(".delete()");
  });

  it("requires affirmative UI confirmation before the staging page invokes upload", () => {
    const page = read("src/pages/premium/BenefitsDocumentStagingPage.tsx");
    const client = read("src/premium/documentIntakeApi.ts");
    expect(page).toContain("Object.values(confirmations).every(Boolean)");
    expect(page).toContain("!allConfirmed");
    expect(client).toContain("attestations,");
    expect(client).toContain("attestations?: DocumentUploadRequest");
  });

  it("never persists the client filename or raw extracted source text", () => {
    const service = read("api/_lib/documentIntake.ts");
    const migration = read("supabase/migrations/20260804193729_prelaunch_secure_benefit_document_quarantine.sql");
    expect(service).toContain("clientFileName");
    expect(service).not.toMatch(/original_filename|client_file_name\s*:/i);
    expect(migration).not.toMatch(/original_filename|client_file_name/i);
    expect(migration).toContain("Never raw source text or excerpts");
  });
});
