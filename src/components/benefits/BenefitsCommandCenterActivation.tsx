import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileText,
  LockKeyhole,
  PlayCircle,
  ReceiptText,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import {
  clearBenefitsWorkspace,
  HIDDEN_BENEFIT_LABELS,
  loadBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  activateSampleWorkspace,
  buildBenefitsActivationEventProperties,
  createFreshUserWorkspace,
  getSampleBenefitsComparison,
  getSampleBenefitsReceipt,
  isBenefitsWorkspacePristine,
  isSampleBenefitsPackage,
  readBenefitsTourStatus,
  saveBenefitsTourStatus,
  type BenefitsActivationEntrySurface,
  type BenefitsActivationPath,
  type BenefitsActivationTourStatus,
} from "@/lib/benefitsCommandCenterActivation";

const BenefitsCommandCenterWorkspace = lazy(() => import("@/components/benefits/BenefitsCommandCenterWorkspace"));
const BenefitsCommandCenterTour = lazy(() => import("@/components/benefits/BenefitsCommandCenterTour"));

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type PreviewMode = "sample_receipt" | "sample_comparison" | null;

type ActivationLocationState = {
  activation?: BenefitsActivationPath;
  entrySurface?: BenefitsActivationEntrySurface;
};

const safeEntrySurface = (value: unknown): BenefitsActivationEntrySurface => {
  const allowed: BenefitsActivationEntrySurface[] = [
    "command_center",
    "homepage",
    "start_here",
    "tools",
    "healthcare_workers",
    "insurance",
    "open_enrollment",
    "related_tool",
    "unknown",
  ];
  return typeof value === "string" && allowed.includes(value as BenefitsActivationEntrySurface)
    ? (value as BenefitsActivationEntrySurface)
    : "command_center";
};

const Metric = ({ label, value, detail, emphasis = false }: { label: string; value: string; detail?: string; emphasis?: boolean }) => (
  <div className={`rounded-2xl border p-4 ${emphasis ? "border-primary/30 bg-primary-soft/45" : "border-border bg-background"}`}>
    <div className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">{label}</div>
    <div className="mt-2 font-display text-2xl font-bold text-foreground">{value}</div>
    {detail && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</div>}
  </div>
);

const ActivationChoice = ({
  icon: Icon,
  title,
  description,
  action,
  primary = false,
  onClick,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  description: string;
  action: string;
  primary?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex min-h-64 flex-col rounded-3xl border p-6 text-left shadow-sm transition-smooth hover:-translate-y-1 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
      primary ? "border-primary/30 bg-primary-soft/45" : "border-border bg-background"
    }`}
  >
    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${primary ? "bg-primary text-primary-foreground" : "bg-secondary-soft text-secondary"}`}>
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
    <span className="mt-5 font-display text-xl font-bold text-foreground">{title}</span>
    <span className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</span>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
      {action} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </span>
  </button>
);

const SampleReceiptPreview = ({ onOpenWorkspace, onStartOwn, onBack }: { onOpenWorkspace: () => void; onStartOwn: () => void; onBack: () => void }) => {
  const receipt = useMemo(() => getSampleBenefitsReceipt(), []);
  const visibleBenefits = receipt.qualitativeBenefits.slice(0, 5);

  return (
    <div className="space-y-6" aria-labelledby="sample-receipt-heading">
      <div className="flex flex-col gap-4 rounded-3xl border border-secondary/25 bg-secondary-soft/30 p-5 md:flex-row md:items-start md:justify-between md:p-7">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Illustrative example—not an employer offer</div>
          <h2 id="sample-receipt-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">Sample Hospital RN Benefits Receipt</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This fictional package uses the same schema and calculation engine as a real package. It intentionally includes strong pay, meaningful employer money, healthcare exposure, unvested value, and unresolved questions.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onBack}>Back to choices</Button>
      </div>

      <article className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8" aria-label="Illustrative sample Benefits Receipt">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Expected cash" value={currency.format(receipt.compensation.annualCashCompensation)} />
          <Metric label="Employer benefit value" value={currency.format(receipt.estimatedQuantifiableEmployerBenefitValue)} />
          <Metric label="Employee costs" value={currency.format(receipt.annualEmployeeBenefitCosts)} />
          <Metric label="Value after selected costs" value={currency.format(receipt.estimatedValueAfterSelectedCosts)} emphasis />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-background p-5">
            <h3 className="font-display text-xl font-bold">What the Receipt separates</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt>Base compensation</dt><dd className="font-semibold">{currency.format(receipt.compensation.baseAnnualCash)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Expected overtime and differential</dt><dd className="font-semibold">{currency.format(receipt.compensation.overtimePay + receipt.compensation.differentialPay)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Employer retirement value</dt><dd className="font-semibold">{currency.format(receipt.retirement.totalEmployerRetirementContribution)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Unvested employer value</dt><dd className="font-semibold">{currency.format(receipt.unvestedValue)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Known hidden-benefit value</dt><dd className="font-semibold">{currency.format(receipt.knownHiddenBenefitValue)}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-background p-5">
            <h3 className="font-display text-xl font-bold">Healthcare exposure</h3>
            {receipt.selectedHealthPlan && (
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt>Low-use estimate</dt><dd className="font-semibold">{currency.format(receipt.selectedHealthPlan.lowUseNetAnnualCost)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Moderate-use estimate</dt><dd className="font-semibold">{currency.format(receipt.selectedHealthPlan.moderateUseNetAnnualCost)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Worst-case estimate</dt><dd className="font-semibold">{currency.format(receipt.selectedHealthPlan.highUseNetAnnualCost)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Employer HSA/HRA funding</dt><dd className="font-semibold">{currency.format(receipt.selectedHealthPlan.employerAccountContribution)}</dd></div>
              </dl>
            )}
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section>
            <h3 className="font-display text-xl font-bold">Qualitative and conditional value</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {visibleBenefits.map((benefit) => (
                <li key={benefit.id} className="rounded-xl bg-muted/40 px-3 py-2">
                  <strong className="text-foreground">{HIDDEN_BENEFIT_LABELS[benefit.id]}</strong> — {benefit.status === "available_unused" ? "available but unused" : "included"}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-display text-xl font-bold">Questions still requiring verification</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {receipt.verificationQuestions.slice(0, 5).map((question) => <li key={question}>{question}</li>)}
            </ol>
          </section>
        </div>

        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          The Receipt does not reduce a job to one score. It separates what is guaranteed, conditional, estimated, unvested, and qualitative so users can make a more informed decision.
        </p>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onStartOwn}>Start my own package instead</Button>
        <Button type="button" onClick={onOpenWorkspace}>Open the full sample workspace <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

const SampleComparisonPreview = ({ onOpenWorkspace, onStartOwn, onBack }: { onOpenWorkspace: () => void; onStartOwn: () => void; onBack: () => void }) => {
  const comparison = useMemo(() => getSampleBenefitsComparison(), []);

  return (
    <div className="space-y-6" aria-labelledby="sample-comparison-heading">
      <div className="flex flex-col gap-4 rounded-3xl border border-secondary/25 bg-secondary-soft/30 p-5 md:flex-row md:items-start md:justify-between md:p-7">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Two fictional healthcare roles</div>
          <h2 id="sample-comparison-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">Bedside RN versus Clinical Specialist</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            The comparison uses the production engine and deliberately avoids declaring a winner. It shows where higher cash, retirement value, healthcare risk, commute, vesting, and lifestyle factors pull in different directions.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onBack}>Back to choices</Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {[comparison.packageA, comparison.packageB].map((receipt) => (
          <article key={receipt.packageId} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Illustrative package</div>
            <h3 className="mt-2 font-display text-2xl font-bold">{receipt.packageLabel}</h3>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt>Expected cash</dt><dd className="font-semibold">{currency.format(receipt.compensation.annualCashCompensation)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Employer retirement</dt><dd className="font-semibold">{currency.format(receipt.retirement.totalEmployerRetirementContribution)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Unvested employer value</dt><dd className="font-semibold">{currency.format(receipt.unvestedValue)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Moderate-use healthcare cost</dt><dd className="font-semibold">{currency.format(receipt.selectedHealthPlan?.moderateUseNetAnnualCost ?? 0)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Worst-case healthcare cost</dt><dd className="font-semibold">{currency.format(receipt.selectedHealthPlan?.highUseNetAnnualCost ?? 0)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Verification questions</dt><dd className="font-semibold">{receipt.verificationQuestions.length}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-muted/25 p-6">
        <h3 className="font-display text-xl font-bold">Decision readout</h3>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {comparison.classifications.map((classification) => <li key={classification}>• {classification}</li>)}
        </ul>
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">{comparison.uncertaintySummary}</p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onStartOwn}>Start my own package instead</Button>
        <Button type="button" onClick={onOpenWorkspace}>Open the full comparison workspace <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

const BenefitsCommandCenterActivation = () => {
  const location = useLocation();
  const locationState = (location.state ?? null) as ActivationLocationState | null;
  const initialWorkspaceRef = useRef(loadBenefitsWorkspace());
  const [showWorkspace, setShowWorkspace] = useState(() => !isBenefitsWorkspacePristine(initialWorkspaceRef.current));
  const [previewMode, setPreviewMode] = useState<PreviewMode>(null);
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStatus, setTourStatus] = useState<BenefitsActivationTourStatus>(() => readBenefitsTourStatus());
  const viewedRef = useRef(false);
  const entrySurface = safeEntrySurface(locationState?.entrySurface);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackSiteEvent("benefits_command_center_view", buildBenefitsActivationEventProperties({ entrySurface, moduleId: "activation" }));
  }, [entrySurface]);

  const openSample = (path: Exclude<BenefitsActivationPath, "start_own">) => {
    const existing = loadBenefitsWorkspace();
    const canReplace = isBenefitsWorkspacePristine(existing) || Boolean(existing?.packages.every(isSampleBenefitsPackage));
    if (canReplace) {
      activateSampleWorkspace(path);
      setWorkspaceKey((current) => current + 1);
    }
    setPreviewMode(path);
    setShowWorkspace(false);
    trackSiteEvent(
      path === "sample_comparison" ? "benefits_command_center_sample_comparison_open" : "benefits_command_center_sample_open",
      buildBenefitsActivationEventProperties({ entrySurface, activationPath: path, moduleId: path === "sample_comparison" ? "comparison" : "receipt", packageCount: path === "sample_comparison" ? 2 : 1 }),
    );
  };

  useEffect(() => {
    if (locationState?.activation === "sample_receipt" || locationState?.activation === "sample_comparison") {
      openSample(locationState.activation);
    } else if (locationState?.activation === "start_own") {
      setShowWorkspace(true);
      setPreviewMode(null);
    }
    // React Router state changes are represented by a new location key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const startOwn = () => {
    const existing = loadBenefitsWorkspace();
    if (!existing || isBenefitsWorkspacePristine(existing) || existing.packages.every(isSampleBenefitsPackage)) {
      createFreshUserWorkspace();
      setWorkspaceKey((current) => current + 1);
    }
    setPreviewMode(null);
    setShowWorkspace(true);
    trackSiteEvent("benefits_command_center_start_own", buildBenefitsActivationEventProperties({ entrySurface, activationPath: "start_own", moduleId: "workspace", packageCount: 1 }));
  };

  const resetSampleAndStart = () => {
    clearBenefitsWorkspace();
    createFreshUserWorkspace();
    setWorkspaceKey((current) => current + 1);
    setPreviewMode(null);
    setShowWorkspace(true);
    trackSiteEvent("benefits_command_center_start_own", buildBenefitsActivationEventProperties({ entrySurface, activationPath: "start_own", moduleId: "workspace", packageCount: 1 }));
  };

  const openTour = () => {
    setTourOpen(true);
    trackSiteEvent("benefits_command_center_tour_start", buildBenefitsActivationEventProperties({ entrySurface, moduleId: "tour" }));
  };

  const skipTour = () => {
    setTourStatus(saveBenefitsTourStatus("skipped"));
    trackSiteEvent("benefits_command_center_tour_skip", buildBenefitsActivationEventProperties({ entrySurface, moduleId: "tour" }));
  };

  const completeTour = () => {
    setTourStatus(saveBenefitsTourStatus("completed"));
    trackSiteEvent("benefits_command_center_tour_complete", buildBenefitsActivationEventProperties({ entrySurface, moduleId: "tour" }));
  };

  const handleTourOpenChange = (open: boolean) => {
    if (!open && tourOpen && readBenefitsTourStatus() === "not_started") skipTour();
    setTourOpen(open);
  };

  const returnToExamples = () => {
    const existing = loadBenefitsWorkspace();
    const sampleIds = existing?.packages.filter(isSampleBenefitsPackage).length ?? 0;
    setPreviewMode(sampleIds >= 2 ? "sample_comparison" : sampleIds === 1 ? "sample_receipt" : null);
    setShowWorkspace(false);
  };

  return (
    <div className="space-y-6">
      {!showWorkspace && !previewMode && (
        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card" aria-labelledby="benefits-activation-heading">
          <div className="border-b border-border bg-gradient-to-br from-primary-soft/45 via-card to-secondary-soft/35 p-6 md:p-9">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Start with proof, not a blank form
              </div>
              <h2 id="benefits-activation-heading" className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">Understand what your job is actually worth—not just what it pays.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Build your own package or inspect a realistic example first. The workspace separates guaranteed pay, variable compensation, employer benefits, healthcare costs, unvested value, and qualitative tradeoffs.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-2"><LockKeyhole className="h-4 w-4 text-primary" aria-hidden="true" /> No account</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-2"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Local browser storage</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-2"><FileText className="h-4 w-4 text-primary" aria-hidden="true" /> No document upload</span>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-3 md:p-8">
            <ActivationChoice
              icon={BriefcaseBusiness}
              title="Build my own package"
              description="Start with a private local label and enter only the numbers needed for your compensation, health plans, retirement, leave, hidden benefits, and work structure."
              action="Start my package"
              primary
              onClick={startOwn}
            />
            <ActivationChoice
              icon={ReceiptText}
              title="Explore a sample package"
              description="Inspect a fictional hospital RN package and a completed Benefits Receipt generated by the production calculation engine."
              action="View sample Receipt"
              onClick={() => openSample("sample_receipt")}
            />
            <ActivationChoice
              icon={Scale}
              title="Compare two sample jobs"
              description="See how a fictional bedside RN and Clinical Specialist role trade off cash, healthcare exposure, retirement, vesting, commute, and lifestyle."
              action="View sample comparison"
              onClick={() => openSample("sample_comparison")}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <div className="text-sm text-muted-foreground">
              {tourStatus === "completed" ? "Product tour completed on this browser." : "Prefer a quick orientation before choosing?"}
            </div>
            <Button type="button" variant="outline" onClick={openTour}><PlayCircle className="h-4 w-4" /> Take the 60–90 second tour</Button>
          </div>
        </section>
      )}

      {!showWorkspace && previewMode === "sample_receipt" && (
        <SampleReceiptPreview onOpenWorkspace={() => setShowWorkspace(true)} onStartOwn={resetSampleAndStart} onBack={() => setPreviewMode(null)} />
      )}

      {!showWorkspace && previewMode === "sample_comparison" && (
        <SampleComparisonPreview onOpenWorkspace={() => setShowWorkspace(true)} onStartOwn={resetSampleAndStart} onBack={() => setPreviewMode(null)} />
      )}

      {showWorkspace && (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div>
              <div className="text-sm font-semibold text-foreground">Benefits Command Center workspace</div>
              <div className="mt-1 text-xs text-muted-foreground">Use the real workspace, return to the examples, or reopen the guided tour at any time.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={returnToExamples}><RotateCcw className="h-4 w-4" /> View examples</Button>
              <Button type="button" variant="outline" onClick={openTour}><Compass className="h-4 w-4" /> Product tour</Button>
            </div>
          </div>
          <Suspense fallback={<div className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-border bg-card text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">Loading private workspace…</div>}>
            <BenefitsCommandCenterWorkspace key={workspaceKey} />
          </Suspense>
        </>
      )}

      <Suspense fallback={null}>
        <BenefitsCommandCenterTour
          open={tourOpen}
          onOpenChange={handleTourOpenChange}
          onComplete={completeTour}
          onSkip={skipTour}
        />
      </Suspense>

      <div className="rounded-2xl border border-border bg-muted/25 p-4 text-xs leading-relaxed text-muted-foreground">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p>Sample packages are fictional and remain distinguishable from user-created packages. They use the same package schema, Receipt calculation, comparison engine, and local-storage controls as the real workspace.</p>
        </div>
      </div>
    </div>
  );
};

export default BenefitsCommandCenterActivation;
