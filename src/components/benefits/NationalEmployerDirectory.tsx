import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Database,
  ExternalLink,
  FileCheck2,
  LoaderCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createDefaultBenefitsWorkspace,
  saveBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  saveEmployerBenefitsSourceContext,
  type EmployerBenefitsSourceContextSource,
} from "@/lib/employerBenefitsSourceContext";

type CoverageStatus =
  | "research_pending"
  | "verified_public_pdf"
  | "verified_public_webpage"
  | "private_employee_portal"
  | "outdated_only";

type DirectorySource = EmployerBenefitsSourceContextSource & {
  sourceStatus: "verified_public_pdf" | "verified_public_webpage";
  verificationStatus: "source_verified" | "extracted" | "reviewed" | "product_ready";
  useScope: "link_only" | "metadata_and_facts" | "permissioned_copy" | "blocked";
  rightsReviewStatus: "not_reviewed" | "linking_reviewed" | "fact_use_reviewed" | "permission_confirmed" | "blocked";
};

type DirectoryEntry = {
  systemId: string;
  name: string;
  city: string | null;
  state: string | null;
  registryVintage: number;
  hospitalCount: number | null;
  staffedBeds: number | null;
  matchedEmployerSlug: string | null;
  discoveredSourceCount: number;
  currentPublicSourceCount: number;
  bestPlanYear: number | null;
  coverageStatus: CoverageStatus;
  sources: DirectorySource[];
};

type DirectoryResponse = {
  entries?: DirectoryEntry[];
  message?: string;
};

const coverageCopy: Record<CoverageStatus, { label: string; body: string }> = {
  verified_public_pdf: {
    label: "Current public link located",
    body: "CAF has verified that at least one public document link corresponds to this system. Population matching, rights review, and fact-level review remain separate gates.",
  },
  verified_public_webpage: {
    label: "Current public link located",
    body: "CAF has verified a public employer webpage for reference. It can guide manual entry, but figures are not copied or auto-filled until separate review gates are complete.",
  },
  private_employee_portal: {
    label: "Employee source required",
    body: "The system is in the directory, but the best known guide requires employee access. CAF does not bypass portals or request employee credentials.",
  },
  outdated_only: {
    label: "Older source only",
    body: "CAF has historical material, but no current plan-year source that should be used for decisions.",
  },
  research_pending: {
    label: "Source research pending",
    body: "The employer is recognized nationally, but CAF has not yet matched a current public benefits source.",
  },
};

const documentTypeLabels: Record<string, string> = {
  full_guide: "Benefits guide",
  enrollment_summary: "Enrollment summary",
  spd: "Summary plan description",
  rate_sheet: "Premium or rate sheet",
  supplemental: "Supplemental benefit source",
  interactive: "Benefits webpage",
  other: "Official employer source",
};

const sourcePlanYear = (source: DirectorySource | null, fallback: number | null) =>
  source?.planYearEnd ?? source?.planYearStart ?? (fallback && fallback >= 2026 ? fallback : 2026);

const sourceMetadata = (source: DirectorySource) =>
  [source.planYearLabel, source.audience, source.stateRegion].filter(Boolean).join(" · ");

const NationalEmployerDirectory = () => {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setEntries([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/employer-benefits-source", {
          method: "POST",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "directory_search", query: normalizedQuery }),
        });
        const payload = await response.json().catch(() => ({})) as DirectoryResponse;
        if (!response.ok) throw new Error(payload.message || "The employer directory could not be searched.");
        setEntries((payload.entries ?? []).map((entry) => ({ ...entry, sources: entry.sources ?? [] })));
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setEntries([]);
        setError(requestError instanceof Error ? requestError.message : "The employer directory could not be searched.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  const startManualWorkspace = (entry: DirectoryEntry, selectedSource: DirectorySource | null = null) => {
    const workspace = createDefaultBenefitsWorkspace();
    const benefitsPackage = workspace.packages[0];
    const source = selectedSource ?? entry.sources[0] ?? null;
    const planYear = sourcePlanYear(source, entry.bestPlanYear);
    const label = `${entry.name} ${planYear} benefits`;

    workspace.mode = "open_enrollment";
    workspace.savedAt = new Date().toISOString();
    benefitsPackage.label = label;
    benefitsPackage.isHealthcareWorker = true;
    benefitsPackage.compensation.name = label;
    benefitsPackage.lastUpdatedAt = workspace.savedAt;
    saveBenefitsWorkspace(workspace);
    saveEmployerBenefitsSourceContext({
      schemaVersion: 1,
      systemId: entry.systemId,
      systemName: entry.name,
      city: entry.city,
      state: entry.state,
      selectedSource: source ? {
        sourceId: source.sourceId,
        title: source.title,
        url: source.url,
        audience: source.audience,
        planYearLabel: source.planYearLabel,
        planYearStart: source.planYearStart,
        planYearEnd: source.planYearEnd,
        stateRegion: source.stateRegion,
        documentType: source.documentType,
      } : null,
      savedAt: workspace.savedAt,
    });

    window.location.assign("/tools/benefits-command-center?mode=build#benefits-command-center-workspace");
  };

  return (
    <section className="container min-w-0 py-10 md:py-14" aria-labelledby="national-employer-directory-title">
      <div className="rounded-[2rem] border border-primary/20 bg-card p-5 shadow-card md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Database className="h-4 w-4" aria-hidden="true" /> Independent employer directory
            </div>
            <h2 id="national-employer-directory-title" className="mt-4 font-display text-3xl font-bold tracking-tight">
              Find your healthcare system.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Search the 639-system AHRQ 2023 baseline. When CAF has verified a public source link, you can open the source owner&apos;s page and attach the link to a local Benefits Receipt before entering figures manually.
            </p>
            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-muted/25 p-4 text-sm leading-relaxed text-muted-foreground">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p><strong className="text-foreground">Independent and unaffiliated.</strong> CAF is not affiliated with, sponsored by, or endorsed by the listed healthcare systems. Organization names and trademarks belong to their respective owners.</p>
              </div>
              <div className="flex gap-3">
                <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p><strong className="text-foreground">External links only.</strong> CAF does not host, reproduce, or claim ownership of linked employer documents. Public availability does not establish permission to republish or automatically reuse their contents.</p>
              </div>
              <p className="text-xs">
                Employer identification is based in part on the <a href="https://www.ahrq.gov/chsp/data-resources/compendium-2023.html" target="_blank" rel="noreferrer noopener external" className="font-semibold text-primary underline-offset-4 hover:underline">AHRQ Compendium of U.S. Health Systems, 2023</a>. AHRQ and HHS do not endorse CAF, this directory, or any listed organization. See CAF&apos;s <a href="/disclosures" className="font-semibold text-primary underline-offset-4 hover:underline">disclosures</a>.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="national-employer-search" className="block text-sm font-bold text-foreground">Healthcare system</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="national-employer-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Mayo Clinic, Duke, Ascension, Scripps…"
                autoComplete="organization"
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {loading && <LoaderCircle className="absolute right-3 top-3 h-5 w-5 animate-spin text-primary" aria-label="Searching" />}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">The search term is sent in a private request body rather than added to the page URL. Do not enter employee IDs, medical information, credentials, or confidential employer information.</p>

            <div className="mt-4" aria-live="polite">
              {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
              {!error && normalizedQuery.length < 2 && (
                <div className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
                  Enter at least two characters. The directory uses the AHRQ 2023 system universe as a stable baseline and keeps newer mergers and aliases in a separate reconciliation layer.
                </div>
              )}
              {!error && normalizedQuery.length >= 2 && !loading && entries.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
                  No AHRQ system name matched. Try the parent system name, a former name, or use the employer-source form below.
                </div>
              )}
              <div className="grid gap-3">
                {entries.map((entry) => {
                  const status = coverageCopy[entry.coverageStatus];
                  return (
                    <article key={entry.systemId} className="rounded-2xl border border-border bg-background p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-start gap-2">
                            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                            <div>
                              <h3 className="font-display text-lg font-bold text-foreground">{entry.name}</h3>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {[entry.city, entry.state].filter(Boolean).join(", ") || "Location not listed"}
                                {entry.hospitalCount ? ` · ${entry.hospitalCount} hospitals in AHRQ baseline` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-secondary">{status.label}</div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{status.body}</p>
                        </div>
                        <div className="shrink-0">
                          {entry.matchedEmployerSlug ? (
                            <Button asChild size="sm">
                              <a href="#employer-benefits-navigator-title">Open reviewed pilot <ArrowRight className="h-4 w-4" /></a>
                            </Button>
                          ) : entry.sources.length ? (
                            <Button type="button" size="sm" onClick={() => startManualWorkspace(entry, entry.sources[0])}>
                              Start manual workspace <ArrowRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button type="button" size="sm" variant="outline" onClick={() => startManualWorkspace(entry)}>
                              Start manually <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {entry.sources.length > 0 && (
                        <div className="mt-4 border-t border-border pt-4">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                            <FileCheck2 className="h-4 w-4" aria-hidden="true" /> Official-source links
                          </div>
                          <div className="mt-3 grid gap-3">
                            {entry.sources.map((source) => (
                              <div key={source.sourceId} className="rounded-xl border border-border bg-card p-3">
                                <div className="text-xs font-bold uppercase tracking-[0.1em] text-secondary">
                                  {documentTypeLabels[source.documentType] ?? "Official employer source"} · Link-only reference
                                </div>
                                <div className="mt-1 font-semibold text-foreground">{source.title}</div>
                                {sourceMetadata(source) && <div className="mt-1 text-xs text-muted-foreground">{sourceMetadata(source)}</div>}
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">External source-owner page. CAF does not reproduce the document, assert that it applies to you, or treat the link as permission to reuse its contents.</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Button asChild size="sm" variant="outline">
                                    <a href={source.url} target="_blank" rel="noreferrer noopener external">
                                      Open source-owner page <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                  </Button>
                                  {!entry.matchedEmployerSlug && (
                                    <Button type="button" size="sm" variant="ghost" onClick={() => startManualWorkspace(entry, source)}>
                                      Attach link to manual workspace <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            Link verification confirms only the source location and organization match. The controlling plan documents, employee population, effective dates, and written employer or plan-administrator answers govern actual benefits.
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NationalEmployerDirectory;
