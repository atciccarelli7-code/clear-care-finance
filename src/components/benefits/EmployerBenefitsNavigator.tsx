import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  LoaderCircle,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createDefaultBenefitsWorkspace,
  saveBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  createEmployerBenefitsWorkspaceContext,
  employerBenefitsDocumentLabels,
  employerBenefitsRegistry,
  getEmployerPackageReadiness,
  saveEmployerBenefitsWorkspaceContext,
  searchEmployerBenefitsEmployers,
  type EmployerBenefitsPackage,
} from "@/lib/employerBenefitsRegistry";

const availabilityCopy = {
  source_collection_needed: "CAF still needs the core current-year documents before employer-specific fields can be prefilled.",
  partial_sources: "At least one official source is located, but the package is not yet complete or verified for automatic guidance.",
  ready_for_guided_entry: "The package has completed the source and review gates required for guided entry.",
} as const;

type SubmissionStatus = "idle" | "saving" | "saved" | "error";

const packageKey = (benefitsPackage: EmployerBenefitsPackage) => `${benefitsPackage.id}:${benefitsPackage.planYear}`;

const EmployerBenefitsNavigator = () => {
  const initialEmployer = employerBenefitsRegistry.employers[0];
  const [query, setQuery] = useState("");
  const [selectedEmployerSlug, setSelectedEmployerSlug] = useState(initialEmployer.slug);
  const [selectedPackageKey, setSelectedPackageKey] = useState(packageKey(initialEmployer.packages[0]));
  const [employeeClassId, setEmployeeClassId] = useState(initialEmployer.employeeClasses[0].id);
  const [employerName, setEmployerName] = useState(initialEmployer.name);
  const [sourceUrl, setSourceUrl] = useState("");
  const [employeePopulation, setEmployeePopulation] = useState("");
  const [planYear, setPlanYear] = useState(String(initialEmployer.defaultPlanYear));
  const [website, setWebsite] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const sessionIdRef = useRef(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "");

  const filteredEmployers = useMemo(() => searchEmployerBenefitsEmployers(query), [query]);
  const selectedEmployer = employerBenefitsRegistry.employers.find((employer) => employer.slug === selectedEmployerSlug) ?? initialEmployer;
  const selectedPackage = selectedEmployer.packages.find((benefitsPackage) => packageKey(benefitsPackage) === selectedPackageKey) ?? selectedEmployer.packages[0];
  const selectedEmployeeClass = selectedEmployer.employeeClasses.find((employeeClass) => employeeClass.id === employeeClassId) ?? selectedEmployer.employeeClasses[0];
  const readiness = getEmployerPackageReadiness(selectedPackage);
  const previousEmployerSlugRef = useRef(selectedEmployer.slug);

  useEffect(() => {
    if (previousEmployerSlugRef.current === selectedEmployer.slug) return;
    previousEmployerSlugRef.current = selectedEmployer.slug;
    setSelectedPackageKey(packageKey(selectedEmployer.packages[0]));
    setEmployeeClassId(selectedEmployer.employeeClasses[0].id);
    setEmployerName(selectedEmployer.name);
    setPlanYear(String(selectedEmployer.defaultPlanYear));
    setEmployeePopulation("");
    setSubmissionStatus("idle");
    setSubmissionMessage("");
  }, [selectedEmployer]);

  const startEmployerWorkspace = () => {
    const workspace = createDefaultBenefitsWorkspace();
    const benefitsPackage = workspace.packages[0];
    const label = `${selectedEmployer.name} ${selectedPackage.planYear} · ${selectedEmployeeClass.label}`;

    workspace.mode = "open_enrollment";
    workspace.savedAt = new Date().toISOString();
    benefitsPackage.label = label;
    benefitsPackage.isHealthcareWorker = true;
    benefitsPackage.compensation.name = label;
    benefitsPackage.lastUpdatedAt = workspace.savedAt;

    saveBenefitsWorkspace(workspace);
    saveEmployerBenefitsWorkspaceContext(createEmployerBenefitsWorkspaceContext({
      employer: selectedEmployer,
      benefitsPackage: selectedPackage,
      employeeClass: selectedEmployeeClass,
    }));

    window.location.assign(
      `/tools/benefits-command-center?mode=build&employer=${encodeURIComponent(selectedEmployer.slug)}&planYear=${selectedPackage.planYear}#benefits-command-center-workspace`,
    );
  };

  const submitSource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionStatus("saving");
    setSubmissionMessage("");

    try {
      const response = await fetch("/api/employer-benefits-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerName,
          sourceUrl,
          employeePopulation,
          planYear: Number(planYear),
          sessionId: sessionIdRef.current,
          website,
        }),
      });
      const payload = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "The source could not be saved.");
      setSubmissionStatus("saved");
      setSubmissionMessage("Saved for review. CAF will not treat it as verified until the employer, plan year, population, and source are checked.");
      setSourceUrl("");
      setEmployeePopulation("");
    } catch (error) {
      setSubmissionStatus("error");
      setSubmissionMessage(error instanceof Error ? error.message : "The source could not be saved.");
    }
  };

  return (
    <section className="container min-w-0 py-10 md:py-14" aria-labelledby="employer-benefits-navigator-title">
      <div className="rounded-[2rem] border border-primary/20 bg-card p-5 shadow-card md:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Building2 className="h-4 w-4" aria-hidden="true" /> Employer-aware pilot
            </div>
            <h2 id="employer-benefits-navigator-title" className="mt-4 font-display text-3xl font-bold tracking-tight">
              Start with the employer and plan year.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              CAF can now preserve an employer, employee group, plan year, source status, and missing-document list before opening the benefits workspace. It never inserts plan values until the source facts have completed review.
            </p>

            <label htmlFor="employer-benefits-search" className="mt-6 block text-sm font-bold text-foreground">Find a pilot employer</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="employer-benefits-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Novant, Atrium, UNC, ECU, Northwell…"
                className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {filteredEmployers.map((employer) => {
                const active = employer.slug === selectedEmployer.slug;
                return (
                  <button
                    key={employer.slug}
                    type="button"
                    onClick={() => setSelectedEmployerSlug(employer.slug)}
                    className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? "border-primary/40 bg-primary-soft/35" : "border-border bg-background hover:border-primary/25"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-lg font-bold text-foreground">{employer.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{employer.regions.join(" · ")}</div>
                      </div>
                      {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
                    </div>
                  </button>
                );
              })}
              {!filteredEmployers.length && (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No pilot employer matches that search. Use the source form to request one.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Selected employer</div>
                  <h3 className="mt-2 font-display text-2xl font-bold">{selectedEmployer.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{availabilityCopy[selectedEmployer.availability]}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/25 px-4 py-3 text-sm">
                  <div className="font-bold text-foreground">{readiness.locatedCoreDocumentCount} of {readiness.requiredCoreDocumentCount}</div>
                  <div className="text-xs text-muted-foreground">core source categories located</div>
                </div>
              </div>

              <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Employer source completeness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={readiness.completenessPercent}
                aria-valuetext={`${readiness.completenessPercent}% source completeness`}
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${readiness.completenessPercent}%` }} />
              </div>
              <div className="mt-2 text-xs font-semibold text-muted-foreground">{readiness.label}</div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="employer-package" className="text-sm font-bold">Plan package</label>
                  <select
                    id="employer-package"
                    value={selectedPackageKey}
                    onChange={(event) => setSelectedPackageKey(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    {selectedEmployer.packages.map((benefitsPackage) => (
                      <option key={benefitsPackage.id} value={packageKey(benefitsPackage)}>
                        {benefitsPackage.planYear} · {benefitsPackage.populationLabel}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="employee-class" className="text-sm font-bold">Your employee group</label>
                  <select
                    id="employee-class"
                    value={employeeClassId}
                    onChange={(event) => setEmployeeClassId(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    {selectedEmployer.employeeClasses.map((employeeClass) => (
                      <option key={employeeClass.id} value={employeeClass.id}>{employeeClass.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>
                    <strong>Source status is not a recommendation.</strong> Official documents may apply only to certain entities, locations, unions, or employee classes. CAF currently preserves the context and verification work; it does not silently prefill unreviewed figures.
                  </p>
                </div>
              </div>

              <Button type="button" className="mt-6 w-full sm:w-auto" onClick={startEmployerWorkspace}>
                Start this employer workspace <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background p-5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold">Located official sources</h3>
                </div>
                {selectedPackage.sources.length ? (
                  <ul className="mt-4 space-y-3">
                    {selectedPackage.sources.map((source) => (
                      <li key={source.id} className="rounded-2xl border border-border bg-card p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">{employerBenefitsDocumentLabels[source.documentType]}</div>
                        <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-start gap-2 font-semibold text-primary hover:underline">
                          <span>{source.title}</span><ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        </a>
                        <div className="mt-2 text-xs text-muted-foreground">Official-domain candidate · facts not yet verified for automatic entry</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">No public core source is registered yet. The workspace remains available for manual, locally saved entry.</p>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-background p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold">Still needed</h3>
                </div>
                {readiness.missingCoreDocumentTypes.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {readiness.missingCoreDocumentTypes.map((documentType) => (
                      <li key={documentType} className="rounded-xl bg-muted/35 px-3 py-2">{employerBenefitsDocumentLabels[documentType]}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">All core source categories are located. Fact extraction and human review may still be incomplete.</p>
                )}
              </div>
            </div>

            <form onSubmit={submitSource} className="rounded-3xl border border-border bg-background p-5 md:p-6" aria-labelledby="submit-employer-source-title">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 id="submit-employer-source-title" className="font-display text-xl font-bold">Request an employer or submit an official link</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Submit a public employer or insurer link. Do not provide portal credentials, member IDs, claim information, medical information, account numbers, or files containing personal information.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="source-employer-name" className="text-sm font-bold">Employer</label>
                  <input id="source-employer-name" required maxLength={160} value={employerName} onChange={(event) => setEmployerName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" />
                </div>
                <div>
                  <label htmlFor="source-plan-year" className="text-sm font-bold">Plan year</label>
                  <input id="source-plan-year" required inputMode="numeric" min="2024" max="2035" value={planYear} onChange={(event) => setPlanYear(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="source-url" className="text-sm font-bold">Public source URL <span className="font-normal text-muted-foreground">(optional for an employer request)</span></label>
                  <input id="source-url" type="url" maxLength={2048} placeholder="https://official-employer-domain.example/benefits-guide.pdf" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="source-population" className="text-sm font-bold">Employee population <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <input id="source-population" maxLength={160} placeholder="Example: non-union employees, Triangle region, benefits-eligible teammates" value={employeePopulation} onChange={(event) => setEmployeePopulation(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" />
                </div>
              </div>
              <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" disabled={submissionStatus === "saving"}>
                  {submissionStatus === "saving" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  Save for review
                </Button>
                <div className={`text-sm ${submissionStatus === "error" ? "text-destructive" : submissionStatus === "saved" ? "text-primary" : "text-muted-foreground"}`} role="status" aria-live="polite">
                  {submissionMessage}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerBenefitsNavigator;
