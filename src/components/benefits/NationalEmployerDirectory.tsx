import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Building2, Database, LoaderCircle, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createDefaultBenefitsWorkspace,
  saveBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";

type CoverageStatus =
  | "research_pending"
  | "verified_public_pdf"
  | "verified_public_webpage"
  | "private_employee_portal"
  | "outdated_only";

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
};

type DirectoryResponse = {
  entries?: DirectoryEntry[];
  message?: string;
};

const coverageCopy: Record<CoverageStatus, { label: string; body: string }> = {
  verified_public_pdf: {
    label: "Current public source located",
    body: "CAF has located at least one current public document. Values still require population and fact-level review before automatic guidance.",
  },
  verified_public_webpage: {
    label: "Current public source located",
    body: "CAF has located a current public web source. It still requires structured extraction and review.",
  },
  private_employee_portal: {
    label: "Employee source required",
    body: "The system is in the directory, but the best known guide requires employee access. Start manually and verify against your own documents.",
  },
  outdated_only: {
    label: "Older source only",
    body: "CAF has historical material, but no current plan-year source that should be used for decisions.",
  },
  research_pending: {
    label: "Source research pending",
    body: "The employer is recognized nationally, but CAF has not yet matched a current benefits source.",
  },
};

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
        const response = await fetch(`/api/employer-benefits-directory?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const payload = await response.json().catch(() => ({})) as DirectoryResponse;
        if (!response.ok) throw new Error(payload.message || "The employer directory could not be searched.");
        setEntries(payload.entries ?? []);
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

  const startManualWorkspace = (entry: DirectoryEntry) => {
    const workspace = createDefaultBenefitsWorkspace();
    const benefitsPackage = workspace.packages[0];
    const planYear = entry.bestPlanYear && entry.bestPlanYear >= 2026 ? entry.bestPlanYear : 2026;
    const label = `${entry.name} ${planYear} benefits`;

    workspace.mode = "open_enrollment";
    workspace.savedAt = new Date().toISOString();
    benefitsPackage.label = label;
    benefitsPackage.isHealthcareWorker = true;
    benefitsPackage.compensation.name = label;
    benefitsPackage.lastUpdatedAt = workspace.savedAt;
    saveBenefitsWorkspace(workspace);

    window.location.assign("/tools/benefits-command-center?mode=build#benefits-command-center-workspace");
  };

  return (
    <section className="container min-w-0 py-10 md:py-14" aria-labelledby="national-employer-directory-title">
      <div className="rounded-[2rem] border border-primary/20 bg-card p-5 shadow-card md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Database className="h-4 w-4" aria-hidden="true" /> National employer directory
            </div>
            <h2 id="national-employer-directory-title" className="mt-4 font-display text-3xl font-bold tracking-tight">
              Find your healthcare system.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Search the 639-system AHRQ baseline. Every listed system can start a manual Benefits Receipt; employer-specific prefills remain gated behind current documents, employee-population matching, extraction, and review.
            </p>
            <div className="mt-5 rounded-2xl border border-border bg-muted/25 p-4 text-sm leading-relaxed text-muted-foreground">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p><strong className="text-foreground">Coverage is not verification.</strong> A found guide may apply only to a region, union, facility, physician group, trainee group, or other employee population.</p>
              </div>
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
                              <a href="#employer-benefits-navigator-title">Open supported pilot <ArrowRight className="h-4 w-4" /></a>
                            </Button>
                          ) : (
                            <Button type="button" size="sm" variant="outline" onClick={() => startManualWorkspace(entry)}>
                              Start manually <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
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
