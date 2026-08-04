import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  FileLock2,
  FileSearch2,
  LoaderCircle,
  ShieldAlert,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MAX_BENEFIT_DOCUMENT_BYTES,
  benefitDocumentKindLabels,
  benefitDocumentKindSchema,
  type BenefitDocumentKind,
  type BenefitDocumentRecord,
} from "@/premium/documentIntakeContracts";
import {
  deleteBenefitDocument,
  extractBenefitDocument,
  listBenefitDocuments,
  uploadBenefitDocument,
} from "@/premium/documentIntakeApi";
import { PremiumApiError } from "@/premium/apiClient";
import { scanSensitiveData } from "@/premium/sensitiveDataDetector";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const statusLabel: Record<BenefitDocumentRecord["status"], string> = {
  authorized: "Upload authorized",
  uploaded: "Uploaded",
  quarantined: "Quarantined — extraction unavailable",
  ready_for_extraction: "Ready for protected extraction",
  extracted: "Extracted and source deleted",
  rejected_sensitive_data: "Rejected and source deleted",
  extraction_unavailable: "Extraction provider unavailable",
  deleted: "Deleted",
  expired: "Expired and deleted",
};

const findingLabels: Record<string, string> = {
  social_security_number: "Social Security number",
  date_of_birth: "date of birth",
  email_address: "email address",
  phone_number: "phone number",
  street_address: "street address",
  employee_identifier: "employee identifier",
  member_or_policy_identifier: "member, policy, or group identifier",
  claim_or_eob_identifier: "claim or EOB identifier",
  financial_account_identifier: "financial account identifier",
  payment_card_identifier: "payment-card number",
  credential_or_password: "credential or password",
  medical_record_or_diagnosis: "medical record or diagnosis information",
  official_election_or_confirmation: "official election or confirmation record",
  individualized_pay_statement: "individualized pay statement",
  sensitive_filename: "sensitive filename",
};

type Confirmations = {
  noPersonalInformation: boolean;
  notElectionOrIndividualRecord: boolean;
  authorizedToUse: boolean;
  syntheticPublicOrRedacted: boolean;
};

const emptyConfirmations: Confirmations = {
  noPersonalInformation: false,
  notElectionOrIndividualRecord: false,
  authorizedToUse: false,
  syntheticPublicOrRedacted: false,
};

const readableError = (error: unknown) => error instanceof PremiumApiError
  ? error.message
  : error instanceof Error
    ? error.message
    : "The document request could not be completed.";

export default function BenefitsDocumentStagingPage() {
  const { workspaceId = "" } = useParams();
  const auth = usePremiumAuth();
  const enabled = import.meta.env.VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED === "true";
  const [documents, setDocuments] = useState<BenefitDocumentRecord[]>([]);
  const [mode, setMode] = useState<string>("disabled");
  const [documentKind, setDocumentKind] = useState<BenefitDocumentKind>("benefits_guide");
  const [file, setFile] = useState<File | null>(null);
  const [confirmations, setConfirmations] = useState<Confirmations>(emptyConfirmations);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string>("");

  const allConfirmed = useMemo(() => Object.values(confirmations).every(Boolean), [confirmations]);
  const canUseServer = enabled && auth.status === "signed_in" && Boolean(auth.accessToken) && !auth.isDevelopmentDemo && Boolean(workspaceId);

  const refresh = useCallback(async () => {
    if (!canUseServer || !auth.accessToken) return;
    try {
      const result = await listBenefitDocuments(auth.accessToken, workspaceId);
      setDocuments(result.documents);
      setMode(result.mode);
    } catch (nextError) {
      setError(readableError(nextError));
    }
  }, [auth.accessToken, canUseServer, workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");
    const next = event.target.files?.[0] || null;
    event.target.value = "";
    if (!next) return;
    if (!["application/pdf", "text/plain"].includes(next.type)) {
      setFile(null);
      setError("Use a PDF or plain-text fixture only.");
      return;
    }
    if (next.size <= 0 || next.size > MAX_BENEFIT_DOCUMENT_BYTES) {
      setFile(null);
      setError("The document must be larger than zero bytes and no more than 10 MB.");
      return;
    }
    const filenameScan = scanSensitiveData({ fileName: next.name });
    if (filenameScan.blocked) {
      setFile(null);
      setError("Rename or replace the file. Its filename suggests an individualized or sensitive record.");
      return;
    }
    if (next.type === "text/plain") {
      const text = await next.text();
      const scan = scanSensitiveData({ text });
      if (scan.blocked) {
        setFile(null);
        const findings = scan.findingCodes.map((code) => findingLabels[code] || code).join(", ");
        setError(`This file was blocked before upload because it appears to contain: ${findings}.`);
        return;
      }
    }
    setFile(next);
    setMessage(next.type === "application/pdf"
      ? "PDF content cannot yet be inspected before upload. Use only a synthetic, public, or deliberately redacted benefits document in the protected preview."
      : "The text fixture passed the browser-side sensitive-data screen. The server will scan it again before retaining extracted facts.");
  };

  const upload = async () => {
    if (!file || !auth.accessToken || !allConfirmed) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await uploadBenefitDocument({
        token: auth.accessToken,
        workspaceId,
        documentKind: benefitDocumentKindSchema.parse(documentKind),
        file,
      });
      setFile(null);
      setConfirmations(emptyConfirmations);
      setMessage("The file entered the private quarantine workflow. No original filename was retained.");
      await refresh();
    } catch (nextError) {
      setError(readableError(nextError));
    } finally {
      setLoading(false);
    }
  };

  const extract = async (uploadId: string) => {
    if (!auth.accessToken) return;
    setBusyId(uploadId);
    setError("");
    setMessage("");
    try {
      const result = await extractBenefitDocument(auth.accessToken, uploadId);
      setMessage(result.document.status === "rejected_sensitive_data"
        ? "The server detected prohibited information. The source file was deleted and no extracted facts were retained."
        : result.document.status === "extracted"
          ? "The protected extractor retained only structured benefits facts and deleted the source file."
          : "The source remains quarantined. Automated extraction is not available for this file type.");
      await refresh();
    } catch (nextError) {
      setError(readableError(nextError));
    } finally {
      setBusyId("");
    }
  };

  const remove = async (uploadId: string) => {
    if (!auth.accessToken) return;
    setBusyId(uploadId);
    setError("");
    try {
      await deleteBenefitDocument(auth.accessToken, uploadId);
      setMessage("The staged document and its metadata were deleted.");
      await refresh();
    } catch (nextError) {
      setError(readableError(nextError));
    } finally {
      setBusyId("");
    }
  };

  if (!enabled) {
    return (
      <main className="container min-h-[70vh] py-12" id="main-content">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-7 shadow-card md:p-10">
          <FileLock2 className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="mt-4 font-display text-3xl font-bold">Document staging is not enabled</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The secure document workflow is being built and tested with synthetic fixtures. Production cannot issue upload tokens or accept visitor documents.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to={workspaceId ? `/app/benefits-decision/${workspaceId}` : "/app/benefits-decision"}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Return to the workspace
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container min-h-screen py-8 md:py-12" id="main-content">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Protected prelaunch capability</div>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Benefits document staging</h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Use only synthetic, public, or deliberately redacted plan materials. Do not upload official elections, confirmation pages, pay statements, IDs, claims, medical records, credentials, or any document identifying a person.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to={`/app/benefits-decision/${workspaceId}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Workspace
            </Link>
          </Button>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">Not a liability waiver</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your confirmation helps prevent mistakes. CAF still enforces file restrictions, private quarantine, rejection, and deletion.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <FileLock2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">No original filename</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Storage paths use random identifiers. The original filename is screened but is not written to CAF’s database.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Trash2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">Delete the source</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Text fixtures are deleted after scanning and extraction. Other staged files expire automatically or can be deleted immediately.</p>
          </div>
        </div>

        {!canUseServer && (
          <div className="mt-7 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950" role="alert">
            <AlertTriangle className="mr-2 inline h-4 w-4" aria-hidden="true" />
            This environment is not authorized to process documents. A real authenticated test account, test entitlement, protected preview configuration, and server-side intake flags are required.
          </div>
        )}

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8" aria-labelledby="stage-document-title">
          <div className="flex items-center gap-3">
            <UploadCloud className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h2 id="stage-document-title" className="font-display text-2xl font-bold">Stage a test document</h2>
              <p className="text-sm text-muted-foreground">Current environment mode: <strong className="text-foreground">{mode.replaceAll("_", " ")}</strong></p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="document-kind" className="text-sm font-semibold">Document category</label>
              <select id="document-kind" className={inputClass} value={documentKind} onChange={(event) => setDocumentKind(benefitDocumentKindSchema.parse(event.target.value))}>
                {Object.entries(benefitDocumentKindLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="document-file" className="text-sm font-semibold">Synthetic or redacted PDF/TXT, maximum 10 MB</label>
              <input id="document-file" className={inputClass} type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(event) => void chooseFile(event)} />
            </div>
          </div>

          {file && (
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary-soft/25 p-4 text-sm">
              <FileCheck2 className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
              A local file is selected ({Math.ceil(file.size / 1024).toLocaleString()} KB). Its name will not be retained after authorization.
            </div>
          )}

          <fieldset className="mt-6 space-y-3">
            <legend className="font-display text-lg font-bold">Required confirmations</legend>
            {[
              ["noPersonalInformation", "I inspected the document and it contains no name, email, phone, address, birth date, employee ID, member ID, claim number, account number, or other personal information."],
              ["notElectionOrIndividualRecord", "This is a general plan document—not my completed elections, confirmation page, beneficiary designation, pay statement, EOB, claim, medical record, or other individualized record."],
              ["authorizedToUse", "I am authorized to use this document for this private test and it is not confidential material I am prohibited from sharing."],
              ["syntheticPublicOrRedacted", "This document is synthetic, already public, or deliberately redacted for testing."],
            ].map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0"
                  checked={confirmations[key as keyof Confirmations]}
                  onChange={(event) => setConfirmations((current) => ({ ...current, [key]: event.target.checked }))}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

          {(message || error) && (
            <div className={`mt-5 rounded-2xl border p-4 text-sm leading-relaxed ${error ? "border-red-300 bg-red-50 text-red-950" : "border-primary/20 bg-primary-soft/25 text-foreground"}`} role={error ? "alert" : "status"}>
              {error || message}
            </div>
          )}

          <Button className="mt-6" disabled={!canUseServer || !file || !allConfirmed || loading} onClick={() => void upload()}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <UploadCloud className="h-4 w-4" aria-hidden="true" />}
            Authorize and stage test document
          </Button>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8" aria-labelledby="staged-documents-title">
          <div className="flex items-center gap-3">
            <FileSearch2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 id="staged-documents-title" className="font-display text-2xl font-bold">Staged documents</h2>
          </div>
          {!documents.length ? (
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">No staged documents are retained for this workspace.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {documents.map((document) => (
                <article key={document.id} className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold">{benefitDocumentKindLabels[document.documentKind]}</h3>
                      <p className="mt-1 text-sm font-semibold text-primary">{statusLabel[document.status]}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Expires {new Date(document.expiresAt).toLocaleString()}</p>
                      {!!document.findingCodes.length && (
                        <p className="mt-3 text-sm text-red-800">Blocked categories: {document.findingCodes.map((code) => findingLabels[code] || code).join(", ")}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["ready_for_extraction", "quarantined", "extraction_unavailable"].includes(document.status) && (
                        <Button size="sm" variant="outline" disabled={busyId === document.id} onClick={() => void extract(document.id)}>
                          {busyId === document.id ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileSearch2 className="h-4 w-4" aria-hidden="true" />}
                          Run protected extraction
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" disabled={busyId === document.id} onClick={() => void remove(document.id)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                      </Button>
                    </div>
                  </div>
                  {!!document.extractedFacts.length && (
                    <div className="mt-5 border-t border-border pt-4">
                      <h4 className="text-sm font-bold">Structured candidates requiring user confirmation</h4>
                      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                        {document.extractedFacts.map((fact) => (
                          <li key={`${fact.key}-${fact.lineNumber || 0}`} className="rounded-xl border border-border bg-card p-3 text-sm">
                            <span className="font-semibold">{fact.label}</span>
                            <span className="mt-1 block text-muted-foreground">
                              {fact.unit === "usd" ? `$${fact.value.toLocaleString()}` : `${fact.value} ${fact.unit}`}
                              {fact.lineNumber ? ` · source line ${fact.lineNumber}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-5 text-xs leading-relaxed text-muted-foreground">
          <CheckCircle2 className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
          Extracted values are candidates, not controlling plan facts. The user must verify them against the current official plan document before CAF uses them in a decision.
        </div>
      </div>
    </main>
  );
}
