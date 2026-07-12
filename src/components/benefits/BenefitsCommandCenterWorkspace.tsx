import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileQuestion,
  HeartPulse,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Trash2,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { addNavigatorAction, getNavigatorRecommendation } from "@/lib/financialNavigator";
import {
  BENEFITS_COMMAND_CENTER_STORAGE_KEY,
  HIDDEN_BENEFIT_LABELS,
  MAX_BENEFITS_PACKAGES,
  MAX_HEALTH_PLANS_PER_PACKAGE,
  calculateBenefitsReceipt,
  clearBenefitsWorkspace,
  compareBenefitsPackages,
  createBenefitsReceiptSummary,
  createDefaultBenefitsPackage,
  createDefaultBenefitsWorkspace,
  createDefaultHealthPlan,
  loadBenefitsWorkspace,
  saveBenefitsWorkspace,
  type BenefitStatus,
  type BenefitsPackage,
  type BenefitsWorkspaceMode,
  type BenefitsWorkspaceState,
  type CoverageTier,
  type HealthPlanOption,
  type HealthPlanType,
  type HiddenBenefitId,
  type ImportanceRating,
  type QualitativeRating,
  type RetirementPlanType,
  type VerificationStatus,
} from "@/lib/benefitsCommandCenter";

const TOOL_ID = "benefits_command_center";
const modules = [
  { id: "overview", label: "Overview", icon: ClipboardCheck },
  { id: "compensation", label: "Compensation", icon: BriefcaseBusiness },
  { id: "health", label: "Health plans", icon: HeartPulse },
  { id: "retirement", label: "Retirement", icon: WalletCards },
  { id: "benefits", label: "Benefits", icon: ShieldCheck },
  { id: "work", label: "Work & lifestyle", icon: BriefcaseBusiness },
  { id: "receipt", label: "Receipt", icon: ReceiptText },
  { id: "compare", label: "Compare", icon: FileQuestion },
] as const;

type ModuleId = (typeof modules)[number]["id"];

const modeOptions: Array<{ id: BenefitsWorkspaceMode; label: string; description: string }> = [
  { id: "current_package", label: "Review my current benefits", description: "Build a complete picture of what the package provides and what may be unused." },
  { id: "compare_offers", label: "Compare two job offers", description: "Compare cash, benefits, healthcare risk, commute, and unresolved assumptions." },
  { id: "open_enrollment", label: "Complete open enrollment", description: "Compare plan economics and organize election questions before the deadline." },
  { id: "new_offer", label: "Understand a new offer", description: "Turn the written offer and benefits summary into a decision-ready receipt." },
  { id: "benefits_review", label: "Find benefits I may be missing", description: "Review retirement, protection, family, education, and quality-of-life value." },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percentage = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const NumberField = ({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "1",
  help,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  help?: string;
}) => (
  <label htmlFor={id} className="block min-w-0 space-y-1.5">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <span className="flex min-w-0 items-center rounded-xl border border-border bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      {prefix && <span className="shrink-0 pl-3 text-sm font-semibold text-muted-foreground" aria-hidden="true">{prefix}</span>}
      <input
        id={id}
        type="number"
        min="0"
        step={step}
        inputMode="decimal"
        value={value || ""}
        onChange={(event) => onChange(numberValue(event.target.value))}
        className="h-11 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm font-medium text-foreground outline-none"
      />
      {suffix && <span className="shrink-0 pr-3 text-xs font-semibold text-muted-foreground">{suffix}</span>}
    </span>
    {help && <span className="block text-xs leading-relaxed text-muted-foreground">{help}</span>}
  </label>
);

const TextField = ({ id, label, value, onChange, help }: { id: string; label: string; value: string; onChange: (value: string) => void; help?: string }) => (
  <label htmlFor={id} className="block min-w-0 space-y-1.5">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <input
      id={id}
      type="text"
      maxLength={60}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/[<>]/g, "").slice(0, 60))}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
    {help && <span className="block text-xs leading-relaxed text-muted-foreground">{help}</span>}
  </label>
);

const SelectField = <T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  help,
}: {
  id: string;
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  help?: string;
}) => (
  <label htmlFor={id} className="block min-w-0 space-y-1.5">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {help && <span className="block text-xs leading-relaxed text-muted-foreground">{help}</span>}
  </label>
);

const PanelHeading = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <div className="max-w-3xl">
    <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">{eyebrow}</div>
    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
  </div>
);

const Metric = ({ label, value, detail, emphasis = false }: { label: string; value: string; detail?: string; emphasis?: boolean }) => (
  <div className={`rounded-2xl border p-4 ${emphasis ? "border-primary/30 bg-primary-soft/40" : "border-border bg-background"}`}>
    <div className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">{label}</div>
    <div className="mt-2 font-display text-2xl font-bold text-foreground">{value}</div>
    {detail && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</div>}
  </div>
);

const healthPlanTypeOptions: Array<{ value: HealthPlanType; label: string }> = [
  { value: "unsure", label: "Not sure" }, { value: "ppo", label: "PPO" }, { value: "hmo", label: "HMO" }, { value: "epo", label: "EPO" },
  { value: "pos", label: "POS" }, { value: "hdhp", label: "HDHP / HSA-eligible option" }, { value: "other", label: "Other" },
];
const coverageTierOptions: Array<{ value: CoverageTier; label: string }> = [
  { value: "employee", label: "Employee only" }, { value: "employee_spouse", label: "Employee + spouse" },
  { value: "employee_child", label: "Employee + child" }, { value: "family", label: "Family" }, { value: "other", label: "Other" },
];
const verificationOptions: Array<{ value: VerificationStatus; label: string }> = [
  { value: "not_verified", label: "Not verified" }, { value: "verified", label: "Verified" }, { value: "not_applicable", label: "Not applicable" },
];
const retirementTypeOptions: Array<{ value: RetirementPlanType; label: string }> = [
  { value: "unsure", label: "Not sure" }, { value: "401k", label: "401(k)" }, { value: "403b", label: "403(b)" },
  { value: "401a", label: "401(a)" }, { value: "pension", label: "Pension" }, { value: "simple_ira", label: "SIMPLE IRA" },
  { value: "sep_ira", label: "SEP IRA" }, { value: "multiple", label: "Multiple plans" }, { value: "none", label: "No workplace plan" },
];
const benefitStatusOptions: Array<{ value: BenefitStatus; label: string }> = [
  { value: "unsure", label: "Not sure" }, { value: "enrolled", label: "Enrolled / using" },
  { value: "available_unused", label: "Available but unused" }, { value: "not_offered", label: "Not offered" },
];
const qualitativeOptions: Array<{ value: QualitativeRating; label: string }> = [
  { value: "unsure", label: "Not sure" }, { value: "strong", label: "Strong" }, { value: "neutral", label: "Neutral" }, { value: "weak", label: "Weak" },
];
const importanceOptions: Array<{ value: ImportanceRating; label: string }> = [
  { value: "low", label: "Low importance" }, { value: "moderate", label: "Moderate importance" },
  { value: "high", label: "High importance" }, { value: "essential", label: "Essential" },
];

const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const BenefitsCommandCenterWorkspace = () => {
  const [workspace, setWorkspace] = useState<BenefitsWorkspaceState>(() => loadBenefitsWorkspace() ?? createDefaultBenefitsWorkspace());
  const [activeModule, setActiveModule] = useState<ModuleId>("overview");
  const [feedback, setFeedback] = useState("Saved locally in this browser.");
  const moduleHeadingRef = useRef<HTMLHeadingElement>(null);
  const openedRef = useRef(false);

  const activePackage = workspace.packages.find((item) => item.id === workspace.activePackageId) ?? workspace.packages[0];
  const activeReceipt = useMemo(() => calculateBenefitsReceipt(activePackage), [activePackage]);
  const comparison = useMemo(() => {
    const selected = workspace.comparisonPackageIds.flatMap((id) => {
      const item = workspace.packages.find((candidate) => candidate.id === id);
      return item ? [item] : [];
    });
    return selected.length >= 2 ? compareBenefitsPackages(selected[0], selected[1]) : null;
  }, [workspace.comparisonPackageIds, workspace.packages]);

  useEffect(() => {
    const saved = saveBenefitsWorkspace(workspace);
    setFeedback(`Saved locally ${new Date(saved.savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`);
  }, [workspace]);

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    trackSiteEvent("benefits_command_center_opened", { event_category: "tools", tool_id: TOOL_ID });
  }, []);

  useEffect(() => {
    if (!moduleHeadingRef.current) return;
    moduleHeadingRef.current.focus({ preventScroll: true });
  }, [activeModule]);

  const updateActivePackage = (updater: (current: BenefitsPackage) => BenefitsPackage) => {
    setWorkspace((current) => ({
      ...current,
      packages: current.packages.map((item) => item.id === current.activePackageId ? { ...updater(item), lastUpdatedAt: new Date().toISOString() } : item),
    }));
  };

  const updateHealthPlan = (planId: string, patch: Partial<HealthPlanOption>) => {
    updateActivePackage((current) => ({
      ...current,
      healthPlans: current.healthPlans.map((plan) => plan.id === planId ? { ...plan, ...patch } : plan),
    }));
  };

  const setMode = (mode: BenefitsWorkspaceMode) => {
    setWorkspace((current) => ({ ...current, mode }));
    trackSiteEvent("benefits_workspace_mode_selected", { event_category: "tools", tool_id: TOOL_ID, workspace_mode: mode });
  };

  const addPackage = () => {
    if (workspace.packages.length >= MAX_BENEFITS_PACKAGES) return;
    const index = workspace.packages.length + 1;
    const next = createDefaultBenefitsPackage(createId("package"), index === 2 ? "Offer B" : `Package ${index}`, index === 2 ? "salary" : "hourly");
    setWorkspace((current) => ({
      ...current,
      packages: [...current.packages, next],
      activePackageId: next.id,
      comparisonPackageIds: [...new Set([...current.comparisonPackageIds, next.id])].slice(0, 2),
      mode: current.mode === "current_package" ? "compare_offers" : current.mode,
    }));
    setActiveModule("compensation");
    trackSiteEvent("benefits_package_started", { event_category: "tools", tool_id: TOOL_ID, package_count: workspace.packages.length + 1 });
  };

  const deleteActivePackage = () => {
    if (workspace.packages.length <= 1) return;
    const remaining = workspace.packages.filter((item) => item.id !== activePackage.id);
    setWorkspace((current) => ({
      ...current,
      packages: remaining,
      activePackageId: remaining[0].id,
      comparisonPackageIds: current.comparisonPackageIds.filter((id) => id !== activePackage.id).slice(0, 2),
    }));
    setFeedback("Package deleted from this browser.");
    trackSiteEvent("benefits_package_deleted", { event_category: "tools", tool_id: TOOL_ID, package_count: remaining.length });
  };

  const addHealthPlan = () => {
    if (activePackage.healthPlans.length >= MAX_HEALTH_PLANS_PER_PACKAGE) return;
    const id = createId("health-plan");
    const plan = createDefaultHealthPlan(id, `Health plan ${activePackage.healthPlans.length + 1}`);
    updateActivePackage((current) => ({ ...current, healthPlans: [...current.healthPlans, plan], selectedHealthPlanId: current.selectedHealthPlanId ?? id }));
    trackSiteEvent("benefits_health_plan_added", { event_category: "tools", tool_id: TOOL_ID, plan_count: activePackage.healthPlans.length + 1 });
  };

  const removeHealthPlan = (planId: string) => {
    if (activePackage.healthPlans.length <= 1) return;
    updateActivePackage((current) => {
      const plans = current.healthPlans.filter((plan) => plan.id !== planId);
      return { ...current, healthPlans: plans, selectedHealthPlanId: current.selectedHealthPlanId === planId ? plans[0].id : current.selectedHealthPlanId };
    });
  };

  const addReceiptActions = () => {
    let addedCount = 0;
    activeReceipt.recommendedActionIds.forEach((id) => {
      if (addNavigatorAction(id).added) addedCount += 1;
    });
    setFeedback(addedCount ? `${addedCount} action${addedCount === 1 ? "" : "s"} added to My Plan.` : "These actions are already in My Plan.");
    trackSiteEvent("benefits_all_actions_added", { event_category: "tools", tool_id: TOOL_ID, action_count: addedCount });
  };

  const copyReceipt = async () => {
    try {
      await navigator.clipboard.writeText(createBenefitsReceiptSummary(activeReceipt));
      setFeedback("Benefits Receipt copied.");
      trackSiteEvent("benefits_receipt_copied", { event_category: "tools", tool_id: TOOL_ID, output_type: "success" });
    } catch {
      setFeedback("Copy was blocked by the browser. Use print or select the receipt text manually.");
      trackSiteEvent("benefits_receipt_copied", { event_category: "tools", tool_id: TOOL_ID, output_type: "blocked" });
    }
  };

  const printReceipt = () => {
    setActiveModule("receipt");
    trackSiteEvent("benefits_receipt_printed", { event_category: "tools", tool_id: TOOL_ID, output_type: "browser_print" });
    window.setTimeout(() => window.print(), 50);
  };

  const resetAll = () => {
    clearBenefitsWorkspace();
    setWorkspace(createDefaultBenefitsWorkspace());
    setActiveModule("overview");
    setFeedback("All Command Center data was cleared from this browser.");
  };

  const activeIndex = modules.findIndex((module) => module.id === activeModule);
  const moveModule = (direction: -1 | 1) => {
    const next = modules[Math.min(modules.length - 1, Math.max(0, activeIndex + direction))];
    setActiveModule(next.id);
  };

  return (
    <section className="rounded-[2rem] border border-border bg-card shadow-card" aria-labelledby="command-center-workspace-heading">
      <div className="border-b border-border p-5 print:hidden md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Private local workspace</div>
            <h2 id="command-center-workspace-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">Build the package behind the paycheck.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Package values stay in this browser. Use broad planning estimates, verify controlling documents, and avoid entering names or identifiers.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">
            <div className="font-semibold text-foreground">{feedback}</div>
            <div className="mt-1 text-xs text-muted-foreground">Storage key: {BENEFITS_COMMAND_CENTER_STORAGE_KEY}</div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Workspace purpose">
          {modeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={workspace.mode === option.id}
              onClick={() => setMode(option.id)}
              className={`rounded-2xl border p-4 text-left transition-smooth ${workspace.mode === option.id ? "border-primary bg-primary-soft/50 shadow-sm" : "border-border bg-background hover:border-primary/30"}`}
            >
              <div className="font-display text-sm font-bold text-foreground">{option.label}</div>
              <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-muted/20 p-4 print:hidden lg:border-b-0 lg:border-r lg:p-5" aria-label="Command Center navigation">
          <div className="space-y-2">
            <div className="px-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Packages</div>
            {workspace.packages.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === activePackage.id}
                onClick={() => setWorkspace((current) => ({ ...current, activePackageId: item.id }))}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${item.id === activePackage.id ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted"}`}
              >
                {item.label}
              </button>
            ))}
            <Button type="button" variant="outline" className="w-full" onClick={addPackage} disabled={workspace.packages.length >= MAX_BENEFITS_PACKAGES}>
              <Plus className="h-4 w-4" /> Add package
            </Button>
          </div>

          <nav className="mt-7 space-y-1" aria-label="Workspace modules">
            {modules.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-current={activeModule === id ? "step" : undefined}
                onClick={() => setActiveModule(id)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${activeModule === id ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-background hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> {label}
              </button>
            ))}
          </nav>

          <div className="mt-7 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Package completeness</span><span>{activeReceipt.completenessPercent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Package completeness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={activeReceipt.completenessPercent}>
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${activeReceipt.completenessPercent}%` }} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 p-5 md:p-8 lg:p-10">
          <h2 ref={moduleHeadingRef} tabIndex={-1} className="sr-only outline-none">{modules.find((module) => module.id === activeModule)?.label}</h2>

          {activeModule === "overview" && (
            <div className="space-y-8 print:hidden">
              <PanelHeading eyebrow="Package setup" title="Start with the purpose, then build one package at a time." description="Use local labels such as Current job, Offer A, or Offer B. The label never needs to contain an employer name." />
              <div className="grid gap-5 md:grid-cols-2">
                <TextField id="package-label" label="Local package label" value={activePackage.label} onChange={(label) => updateActivePackage((current) => ({ ...current, label, compensation: { ...current.compensation, name: label } }))} help="Use a generic label if privacy matters." />
                <SelectField id="package-pay-type" label="Pay structure" value={activePackage.compensation.payType} options={[{ value: "hourly", label: "Hourly" }, { value: "salary", label: "Salary" }]} onChange={(payType) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, payType } }))} />
              </div>
              <label className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                <input type="checkbox" checked={activePackage.isHealthcareWorker} onChange={(event) => updateActivePackage((current) => ({ ...current, isHealthcareWorker: event.target.checked }))} className="mt-1 h-4 w-4 rounded border-border" />
                <span><span className="block font-semibold text-foreground">Include healthcare-worker context</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Use this for differentials, call, bedside burden, and schedule-specific interpretation. The core workspace remains useful for any occupation.</span></span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Expected cash" value={currency.format(activeReceipt.compensation.annualCashCompensation)} />
                <Metric label="Employer benefits" value={currency.format(activeReceipt.estimatedQuantifiableEmployerBenefitValue)} />
                <Metric label="Selected costs" value={currency.format(activeReceipt.annualEmployeeBenefitCosts)} />
                <Metric label="Estimated value after costs" value={currency.format(activeReceipt.estimatedValueAfterSelectedCosts)} emphasis />
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
                <strong>Do not use the headline total by itself.</strong> The receipt separates guaranteed cash, variable pay, employer contributions, employee costs, unvested retirement value, estimates, and qualitative benefits.
              </div>
            </div>
          )}

          {activeModule === "compensation" && (
            <div className="space-y-8 print:hidden">
              <PanelHeading eyebrow="Cash compensation" title="Separate guaranteed pay from variable and schedule-dependent income." description="Use realistic expectations rather than the maximum theoretically available overtime or bonus." />
              <div className="grid gap-5 sm:grid-cols-2">
                {activePackage.compensation.payType === "hourly" ? (
                  <NumberField id="hourly-rate" label="Hourly rate" value={activePackage.compensation.hourlyRate} onChange={(hourlyRate) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, hourlyRate } }))} prefix="$" step="0.01" />
                ) : (
                  <NumberField id="annual-salary" label="Annual salary" value={activePackage.compensation.annualSalary} onChange={(annualSalary) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, annualSalary } }))} prefix="$" />
                )}
                <NumberField id="scheduled-hours" label="Scheduled hours per week" value={activePackage.compensation.scheduledHoursPerWeek} onChange={(scheduledHoursPerWeek) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, scheduledHoursPerWeek } }))} suffix="hours" step="0.5" />
                <NumberField id="weeks-year" label="Paid work weeks per year" value={activePackage.compensation.weeksWorkedPerYear} onChange={(weeksWorkedPerYear) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, weeksWorkedPerYear } }))} suffix="weeks" />
                <NumberField id="annual-bonus" label="Expected annual bonus" value={activePackage.compensation.annualBonus} onChange={(annualBonus) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, annualBonus } }))} prefix="$" />
                {activePackage.compensation.payType === "hourly" && <>
                  <NumberField id="overtime-hours" label="Expected overtime hours per week" value={activePackage.compensation.overtimeHoursPerWeek} onChange={(overtimeHoursPerWeek) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, overtimeHoursPerWeek } }))} suffix="hours" step="0.5" />
                  <NumberField id="overtime-multiplier" label="Overtime multiplier" value={activePackage.compensation.overtimeMultiplier} onChange={(overtimeMultiplier) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, overtimeMultiplier } }))} suffix="× rate" step="0.1" />
                </>}
                <NumberField id="differential" label={activePackage.isHealthcareWorker ? "Shift, weekend, or specialty differential" : "Differential or additional hourly pay"} value={activePackage.compensation.differentialPerHour} onChange={(differentialPerHour) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, differentialPerHour } }))} prefix="$" suffix="per hour" step="0.01" />
                <NumberField id="differential-hours" label="Differential hours per week" value={activePackage.compensation.differentialHoursPerWeek} onChange={(differentialHoursPerWeek) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, differentialHoursPerWeek } }))} suffix="hours" step="0.5" />
                <NumberField id="specialty-pay" label={activePackage.isHealthcareWorker ? "Annual charge, call, holiday, or specialty pay" : "Other expected annual cash pay"} value={activePackage.compensation.holidayAndSpecialtyPay} onChange={(holidayAndSpecialtyPay) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, holidayAndSpecialtyPay } }))} prefix="$" />
                <NumberField id="sign-on" label="Annualized sign-on or retention bonus" value={activePackage.compensation.signOnBonusAnnualized} onChange={(signOnBonusAnnualized) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, signOnBonusAnnualized } }))} prefix="$" help="Spread one-time money across the period required to keep it." />
                <NumberField id="unpaid-hours" label="Unpaid work outside scheduled hours" value={activePackage.compensation.unpaidHoursPerWeek} onChange={(unpaidHoursPerWeek) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, unpaidHoursPerWeek } }))} suffix="hours/week" step="0.5" />
                <NumberField id="dental-vision" label="Annual dental and vision premiums" value={activePackage.compensation.annualDentalVisionPremium} onChange={(annualDentalVisionPremium) => updateActivePackage((current) => ({ ...current, compensation: { ...current.compensation, annualDentalVisionPremium } }))} prefix="$" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Base cash" value={currency.format(activeReceipt.compensation.baseAnnualCash)} />
                <Metric label="Overtime" value={currency.format(activeReceipt.compensation.overtimePay)} />
                <Metric label="Differential" value={currency.format(activeReceipt.compensation.differentialPay)} />
                <Metric label="Expected cash" value={currency.format(activeReceipt.compensation.annualCashCompensation)} emphasis />
              </div>
            </div>
          )}

          {activeModule === "health" && (
            <div className="space-y-8 print:hidden">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <PanelHeading eyebrow="Health-plan economics" title="Compare premiums, utilization scenarios, and worst-case exposure." description="The moderate-use scenario is a planning estimate. Networks, prescriptions, exclusions, and authorization rules still require document verification." />
                <Button type="button" variant="outline" onClick={addHealthPlan} disabled={activePackage.healthPlans.length >= MAX_HEALTH_PLANS_PER_PACKAGE}><Plus className="h-4 w-4" /> Add plan</Button>
              </div>
              <div className="space-y-6">
                {activePackage.healthPlans.map((plan, index) => {
                  const scenario = activeReceipt.healthPlanScenarios.find((item) => item.planId === plan.id);
                  return (
                    <fieldset key={plan.id} className="rounded-3xl border border-border bg-background p-5 md:p-7">
                      <legend className="px-2 font-display text-lg font-bold">Plan {index + 1}</legend>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <label className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm font-semibold"><input type="radio" name="selected-health-plan" checked={activePackage.selectedHealthPlanId === plan.id} onChange={() => updateActivePackage((current) => ({ ...current, selectedHealthPlanId: plan.id }))} /> Use in Benefits Receipt</label>
                        {activePackage.healthPlans.length > 1 && <Button type="button" variant="ghost" onClick={() => removeHealthPlan(plan.id)}><Trash2 className="h-4 w-4" /> Remove plan</Button>}
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <TextField id={`${plan.id}-label`} label="Local plan label" value={plan.label} onChange={(label) => updateHealthPlan(plan.id, { label })} />
                        <SelectField id={`${plan.id}-type`} label="Plan type" value={plan.planType} options={healthPlanTypeOptions} onChange={(planType) => updateHealthPlan(plan.id, { planType })} />
                        <SelectField id={`${plan.id}-tier`} label="Coverage tier" value={plan.coverageTier} options={coverageTierOptions} onChange={(coverageTier) => updateHealthPlan(plan.id, { coverageTier })} />
                        <NumberField id={`${plan.id}-premium`} label="Employee premium per paycheck" value={plan.employeePremiumPerPaycheck} onChange={(employeePremiumPerPaycheck) => updateHealthPlan(plan.id, { employeePremiumPerPaycheck })} prefix="$" />
                        <NumberField id={`${plan.id}-periods`} label="Paychecks per year" value={plan.payPeriodsPerYear} onChange={(payPeriodsPerYear) => updateHealthPlan(plan.id, { payPeriodsPerYear })} suffix="paychecks" />
                        <NumberField id={`${plan.id}-surcharges`} label="Annual surcharges" value={plan.annualSurcharges} onChange={(annualSurcharges) => updateHealthPlan(plan.id, { annualSurcharges })} prefix="$" />
                        <NumberField id={`${plan.id}-employer-premium`} label="Known employer premium contribution" value={plan.employerPremiumContributionAnnual} onChange={(employerPremiumContributionAnnual) => updateHealthPlan(plan.id, { employerPremiumContributionAnnual })} prefix="$" help="Leave zero when the employer share is unknown." />
                        <NumberField id={`${plan.id}-deductible`} label="Individual deductible" value={plan.individualDeductible} onChange={(individualDeductible) => updateHealthPlan(plan.id, { individualDeductible })} prefix="$" />
                        <NumberField id={`${plan.id}-family-deductible`} label="Family deductible" value={plan.familyDeductible} onChange={(familyDeductible) => updateHealthPlan(plan.id, { familyDeductible })} prefix="$" />
                        <NumberField id={`${plan.id}-coinsurance`} label="Coinsurance after deductible" value={plan.coinsurancePercent} onChange={(coinsurancePercent) => updateHealthPlan(plan.id, { coinsurancePercent })} suffix="%" />
                        <NumberField id={`${plan.id}-pcp`} label="Primary-care copay" value={plan.primaryCareCopay} onChange={(primaryCareCopay) => updateHealthPlan(plan.id, { primaryCareCopay })} prefix="$" />
                        <NumberField id={`${plan.id}-specialist`} label="Specialist copay" value={plan.specialistCopay} onChange={(specialistCopay) => updateHealthPlan(plan.id, { specialistCopay })} prefix="$" />
                        <NumberField id={`${plan.id}-urgent`} label="Urgent-care copay" value={plan.urgentCareCopay} onChange={(urgentCareCopay) => updateHealthPlan(plan.id, { urgentCareCopay })} prefix="$" />
                        <NumberField id={`${plan.id}-er`} label="Emergency-room copay" value={plan.emergencyRoomCopay} onChange={(emergencyRoomCopay) => updateHealthPlan(plan.id, { emergencyRoomCopay })} prefix="$" />
                        <NumberField id={`${plan.id}-oop`} label="Individual out-of-pocket maximum" value={plan.individualOutOfPocketMax} onChange={(individualOutOfPocketMax) => updateHealthPlan(plan.id, { individualOutOfPocketMax })} prefix="$" />
                        <NumberField id={`${plan.id}-family-oop`} label="Family out-of-pocket maximum" value={plan.familyOutOfPocketMax} onChange={(familyOutOfPocketMax) => updateHealthPlan(plan.id, { familyOutOfPocketMax })} prefix="$" />
                        <NumberField id={`${plan.id}-employer-account`} label="Employer HSA or HRA contribution" value={plan.employerHsaHraContribution} onChange={(employerHsaHraContribution) => updateHealthPlan(plan.id, { employerHsaHraContribution })} prefix="$" />
                        <SelectField id={`${plan.id}-network`} label="Network verified" value={plan.networkStatus} options={verificationOptions} onChange={(networkStatus) => updateHealthPlan(plan.id, { networkStatus })} />
                        <SelectField id={`${plan.id}-rx`} label="Prescription coverage verified" value={plan.prescriptionStatus} options={verificationOptions} onChange={(prescriptionStatus) => updateHealthPlan(plan.id, { prescriptionStatus })} />
                      </div>
                      {scenario && <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <Metric label="Low-use estimate" value={currency.format(scenario.lowUseNetAnnualCost)} detail="Premiums + limited cost sharing − employer HSA/HRA" />
                        <Metric label="Moderate-use estimate" value={currency.format(scenario.moderateUseNetAnnualCost)} detail="Transparent planning scenario, not a prediction" emphasis />
                        <Metric label="Worst-case estimate" value={currency.format(scenario.highUseNetAnnualCost)} detail="Premiums + selected out-of-pocket maximum − employer HSA/HRA" />
                      </div>}
                    </fieldset>
                  );
                })}
              </div>
            </div>
          )}

          {activeModule === "retirement" && (
            <div className="space-y-8 print:hidden">
              <PanelHeading eyebrow="Retirement value" title="Measure the employer contribution, match capture, and vesting risk." description="The model uses entered base compensation as eligible pay. Actual definitions, timing, true-ups, and vesting rules must be verified in the plan document." />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField id="retirement-type" label="Plan type" value={activePackage.retirement.planType} options={retirementTypeOptions} onChange={(planType) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, planType } }))} />
                <NumberField id="employee-rate" label="Employee contribution" value={activePackage.retirement.employeeContributionPercent} onChange={(employeeContributionPercent) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, employeeContributionPercent } }))} suffix="% of base pay" step="0.1" />
                <NumberField id="match-rate" label="Employer match rate" value={activePackage.retirement.employerMatchRatePercent} onChange={(employerMatchRatePercent) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, employerMatchRatePercent } }))} suffix="% matched" help="Use 100 for dollar-for-dollar matching." />
                <NumberField id="match-cap" label="Employer match cap" value={activePackage.retirement.employerMatchCapPercent} onChange={(employerMatchCapPercent) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, employerMatchCapPercent } }))} suffix="% of pay" step="0.1" />
                <NumberField id="non-elective" label="Employer non-elective contribution" value={activePackage.retirement.employerNonElectivePercent} onChange={(employerNonElectivePercent) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, employerNonElectivePercent } }))} suffix="% of base pay" step="0.1" />
                <NumberField id="fixed-contribution" label="Fixed employer contribution" value={activePackage.retirement.employerFixedContribution} onChange={(employerFixedContribution) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, employerFixedContribution } }))} prefix="$" />
                <NumberField id="vesting" label="Employer contribution vested" value={activePackage.retirement.vestingPercent} onChange={(vestingPercent) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, vestingPercent } }))} suffix="%" />
                <SelectField id="true-up" label="Year-end true-up" value={activePackage.retirement.trueUpStatus} options={[{ value: "unsure", label: "Not sure" }, { value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "not_applicable", label: "Not applicable" }]} onChange={(trueUpStatus) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, trueUpStatus } }))} />
                <SelectField id="match-timing" label="Match calculation timing" value={activePackage.retirement.matchTiming} options={[{ value: "unsure", label: "Not sure" }, { value: "per_paycheck", label: "Each paycheck" }, { value: "annual", label: "Annual eligible pay" }, { value: "not_applicable", label: "Not applicable" }]} onChange={(matchTiming) => updateActivePackage((current) => ({ ...current, retirement: { ...current.retirement, matchTiming } }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Employee contribution" value={currency.format(activeReceipt.retirement.employeeContribution)} />
                <Metric label="Employer retirement value" value={currency.format(activeReceipt.retirement.totalEmployerRetirementContribution)} emphasis />
                <Metric label="Uncaptured match" value={currency.format(activeReceipt.retirement.uncapturedEmployerMatch)} />
                <Metric label="Unvested employer value" value={currency.format(activeReceipt.retirement.unvestedEmployerRetirementValue)} />
              </div>
            </div>
          )}

          {activeModule === "benefits" && (
            <div className="space-y-8 print:hidden">
              <PanelHeading eyebrow="Paid leave and hidden benefits" title="Separate explicit financial value from protection, family, and career value." description="Only enter a dollar amount when the employer provides a clear value or you reasonably expect to use the benefit. Other benefits remain qualitative." />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <NumberField id="pto-hours" label="PTO or vacation hours" value={activePackage.paidLeave.paidTimeOffHours} onChange={(paidTimeOffHours) => updateActivePackage((current) => ({ ...current, paidLeave: { ...current.paidLeave, paidTimeOffHours } }))} suffix="hours" />
                <NumberField id="holiday-hours" label="Paid holiday hours" value={activePackage.paidLeave.paidHolidayHours} onChange={(paidHolidayHours) => updateActivePackage((current) => ({ ...current, paidLeave: { ...current.paidLeave, paidHolidayHours } }))} suffix="hours" />
                <NumberField id="parental-weeks" label="Paid parental leave" value={activePackage.paidLeave.parentalLeaveWeeks} onChange={(parentalLeaveWeeks) => updateActivePackage((current) => ({ ...current, paidLeave: { ...current.paidLeave, parentalLeaveWeeks } }))} suffix="weeks" />
                <SelectField id="carryover" label="Leave carryover verified" value={activePackage.paidLeave.carryoverStatus} options={verificationOptions} onChange={(carryoverStatus) => updateActivePackage((current) => ({ ...current, paidLeave: { ...current.paidLeave, carryoverStatus } }))} />
                <SelectField id="payout" label="Leave payout verified" value={activePackage.paidLeave.payoutStatus} options={verificationOptions} onChange={(payoutStatus) => updateActivePackage((current) => ({ ...current, paidLeave: { ...current.paidLeave, payoutStatus } }))} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activePackage.hiddenBenefits.map((benefit) => (
                  <fieldset key={benefit.id} className="rounded-2xl border border-border bg-background p-4">
                    <legend className="px-1 font-semibold text-foreground">{HIDDEN_BENEFIT_LABELS[benefit.id]}</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_150px]">
                      <SelectField id={`${benefit.id}-status`} label="Status" value={benefit.status} options={benefitStatusOptions} onChange={(status) => updateActivePackage((current) => ({ ...current, hiddenBenefits: current.hiddenBenefits.map((item) => item.id === benefit.id ? { ...item, status } : item) }))} />
                      <NumberField id={`${benefit.id}-value`} label="Known annual value" value={benefit.annualKnownValue} onChange={(annualKnownValue) => updateActivePackage((current) => ({ ...current, hiddenBenefits: current.hiddenBenefits.map((item) => item.id === benefit.id ? { ...item, annualKnownValue } : item) }))} prefix="$" />
                    </div>
                  </fieldset>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Metric label="Paid leave estimate" value={currency.format(activeReceipt.paidLeaveEstimatedValue)} detail={activePackage.compensation.payType === "salary" ? "Shown separately; not added again to salary." : "Included as estimated hourly economic value."} />
                <Metric label="Known hidden-benefit value" value={currency.format(activeReceipt.knownHiddenBenefitValue)} />
                <Metric label="Benefits requiring review" value={String(activePackage.hiddenBenefits.filter((item) => item.status === "available_unused" || item.status === "unsure").length)} />
              </div>
            </div>
          )}

          {activeModule === "work" && (
            <div className="space-y-8 print:hidden">
              <PanelHeading eyebrow="Work and lifestyle" title="Keep real tradeoffs visible without forcing fake dollar values." description="Schedule, commute, call, flexibility, physical demand, and trajectory can decide a job choice even when the financial difference is modest." />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <NumberField id="workdays" label="Workdays per week" value={activePackage.workStructure.workdaysPerWeek} onChange={(workdaysPerWeek) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, workdaysPerWeek } }))} suffix="days" step="0.5" />
                <NumberField id="commute-minutes" label="Commute minutes per workday" value={activePackage.workStructure.commuteMinutesPerWorkday} onChange={(commuteMinutesPerWorkday) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, commuteMinutesPerWorkday } }))} suffix="minutes" />
                <NumberField id="commute-cost" label="Annual commute cost" value={activePackage.workStructure.commuteCostAnnual} onChange={(commuteCostAnnual) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, commuteCostAnnual } }))} prefix="$" />
                <NumberField id="parking-cost" label="Annual parking or transit cost" value={activePackage.workStructure.parkingAndTransitAnnual} onChange={(parkingAndTransitAnnual) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, parkingAndTransitAnnual } }))} prefix="$" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {([
                  ["schedulePredictability", "scheduleImportance", "Schedule predictability"],
                  ["flexibility", "flexibilityImportance", "Flexibility and control"],
                  ["physicalDemand", "physicalDemandImportance", activePackage.isHealthcareWorker ? "Physical and bedside burden" : "Physical and workload burden"],
                  ["careerTrajectory", "careerTrajectoryImportance", "Career trajectory"],
                ] as const).map(([ratingKey, importanceKey, label]) => (
                  <div key={ratingKey} className="rounded-2xl border border-border bg-background p-4">
                    <div className="font-semibold text-foreground">{label}</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <SelectField id={`${ratingKey}-rating`} label="Package rating" value={activePackage.workStructure[ratingKey]} options={qualitativeOptions} onChange={(value) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, [ratingKey]: value } }))} />
                      <SelectField id={`${ratingKey}-importance`} label="Importance to me" value={activePackage.workStructure[importanceKey]} options={importanceOptions} onChange={(value) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, [importanceKey]: value } }))} />
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-border bg-background p-4">
                  <SelectField id="on-call" label="On-call burden" value={activePackage.workStructure.onCallRating} options={qualitativeOptions} onChange={(onCallRating) => updateActivePackage((current) => ({ ...current, workStructure: { ...current.workStructure, onCallRating } }))} />
                </div>
              </div>
            </div>
          )}

          {activeModule === "receipt" && (
            <div className="space-y-8" id="benefits-receipt">
              <div className="flex flex-col gap-5 print:hidden sm:flex-row sm:items-end sm:justify-between">
                <PanelHeading eyebrow="Your Benefits Receipt" title="See what the package pays, contributes, costs, and still leaves unknown." description="The receipt separates measurable value from assumptions and qualitative benefits." />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={copyReceipt}><Copy className="h-4 w-4" /> Copy</Button>
                  <Button type="button" variant="outline" onClick={printReceipt}><Printer className="h-4 w-4" /> Print / PDF</Button>
                  <Button type="button" onClick={addReceiptActions}><Check className="h-4 w-4" /> Add actions to My Plan</Button>
                </div>
              </div>

              <article className="rounded-[2rem] border border-border bg-white p-5 text-slate-950 shadow-card print:border-0 print:p-0 print:shadow-none md:p-8" aria-label={`Benefits Receipt for ${activeReceipt.packageLabel}`}>
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Community Acquired Finance</div><h3 className="mt-2 font-display text-3xl font-bold">Benefits Receipt</h3><p className="mt-2 text-sm text-slate-600">{activeReceipt.packageLabel} · {new Date(activeReceipt.generatedAt).toLocaleDateString()}</p></div>
                  <div className="text-sm font-semibold text-slate-600">Package completeness: {activeReceipt.completenessPercent}%</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Expected cash" value={currency.format(activeReceipt.compensation.annualCashCompensation)} />
                  <Metric label="Employer benefit value" value={currency.format(activeReceipt.estimatedQuantifiableEmployerBenefitValue)} />
                  <Metric label="Employee costs" value={currency.format(activeReceipt.annualEmployeeBenefitCosts)} />
                  <Metric label="Value after selected costs" value={currency.format(activeReceipt.estimatedValueAfterSelectedCosts)} emphasis />
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  <section><h4 className="font-display text-xl font-bold">Cash compensation</h4><dl className="mt-4 space-y-2 text-sm">
                    {[['Base compensation', activeReceipt.compensation.baseAnnualCash], ['Expected overtime', activeReceipt.compensation.overtimePay], ['Differential pay', activeReceipt.compensation.differentialPay], ['Expected total cash', activeReceipt.compensation.annualCashCompensation]].map(([label, value]) => <div key={String(label)} className="flex justify-between gap-4 border-b border-slate-100 py-2"><dt>{label}</dt><dd className="font-semibold">{currency.format(Number(value))}</dd></div>)}
                  </dl></section>
                  <section><h4 className="font-display text-xl font-bold">Retirement</h4><dl className="mt-4 space-y-2 text-sm">
                    {[['Employee contribution', activeReceipt.retirement.employeeContribution], ['Employer contribution', activeReceipt.retirement.totalEmployerRetirementContribution], ['Potential uncaptured match', activeReceipt.retirement.uncapturedEmployerMatch], ['Unvested employer value', activeReceipt.retirement.unvestedEmployerRetirementValue]].map(([label, value]) => <div key={String(label)} className="flex justify-between gap-4 border-b border-slate-100 py-2"><dt>{label}</dt><dd className="font-semibold">{currency.format(Number(value))}</dd></div>)}
                  </dl></section>
                </div>

                {activeReceipt.selectedHealthPlan && <section className="mt-8"><h4 className="font-display text-xl font-bold">Selected health-plan exposure</h4><div className="mt-4 grid gap-4 sm:grid-cols-3"><Metric label="Low-use year" value={currency.format(activeReceipt.selectedHealthPlan.lowUseNetAnnualCost)} /><Metric label="Moderate-use year" value={currency.format(activeReceipt.selectedHealthPlan.moderateUseNetAnnualCost)} emphasis /><Metric label="Worst-case year" value={currency.format(activeReceipt.selectedHealthPlan.highUseNetAnnualCost)} /></div></section>}

                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  <section><h4 className="font-display text-xl font-bold">Qualitative or conditional benefits</h4>{activeReceipt.qualitativeBenefits.length ? <ul className="mt-4 space-y-2 text-sm">{activeReceipt.qualitativeBenefits.map((benefit) => <li key={benefit.id} className="rounded-xl bg-slate-50 px-3 py-2"><strong>{HIDDEN_BENEFIT_LABELS[benefit.id]}</strong> — {benefit.status === "available_unused" ? "available but unused" : "included"}{benefit.annualKnownValue > 0 ? ` (${currency.format(benefit.annualKnownValue)} entered value)` : ""}</li>)}</ul> : <p className="mt-4 text-sm text-slate-600">No qualitative benefits have been classified yet.</p>}</section>
                  <section><h4 className="font-display text-xl font-bold">Questions to verify</h4>{activeReceipt.verificationQuestions.length ? <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">{activeReceipt.verificationQuestions.map((question) => <li key={question}>{question}</li>)}</ol> : <p className="mt-4 text-sm text-slate-600">No major verification questions were generated from the current entries.</p>}</section>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-600">Educational planning estimate only. Guaranteed cash, expected variable pay, employer contributions, employee costs, unvested value, estimates, and qualitative benefits are intentionally separated. Verify all material details using the written offer, Summary of Benefits and Coverage, retirement plan documents, employer materials, official sources, and qualified professionals.</div>
              </article>
            </div>
          )}

          {activeModule === "compare" && (
            <div className="space-y-8 print:hidden">
              <PanelHeading eyebrow="Side-by-side decision" title="Compare two packages without declaring a simplistic winner." description="The comparison highlights financial differences, healthcare exposure, retirement value, commute, and uncertainty. Personal priorities still control the decision." />
              {workspace.packages.length < 2 ? (
                <div className="rounded-3xl border border-dashed border-primary/35 bg-primary-soft/25 p-8 text-center"><BriefcaseBusiness className="mx-auto h-9 w-9 text-primary" /><h3 className="mt-4 font-display text-xl font-bold">Add a second package to compare</h3><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Create Offer B, enter its details, then return here for a structured comparison.</p><Button type="button" className="mt-5" onClick={addPackage}><Plus className="h-4 w-4" /> Add second package</Button></div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[0, 1].map((position) => <SelectField key={position} id={`compare-${position}`} label={position === 0 ? "Package A" : "Package B"} value={(workspace.comparisonPackageIds[position] ?? workspace.packages[position].id)} options={workspace.packages.map((item) => ({ value: item.id, label: item.label }))} onChange={(id) => setWorkspace((current) => ({ ...current, comparisonPackageIds: position === 0 ? [id, current.comparisonPackageIds[1] ?? current.packages[1].id] : [current.comparisonPackageIds[0] ?? current.packages[0].id, id] }))} />)}
                  </div>
                  {comparison && <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Metric label="Expected cash difference" value={currency.format(Math.abs(comparison.expectedCashDifference))} detail={`${comparison.expectedCashDifference >= 0 ? comparison.packageB.packageLabel : comparison.packageA.packageLabel} is higher`} />
                      <Metric label="Value-after-cost difference" value={currency.format(Math.abs(comparison.packageValueDifference))} detail={`${comparison.packageValueDifference >= 0 ? comparison.packageB.packageLabel : comparison.packageA.packageLabel} is higher`} emphasis />
                      <Metric label="Employer retirement difference" value={currency.format(Math.abs(comparison.employerRetirementDifference))} />
                      <Metric label="Commute difference" value={`${percentage.format(Math.abs(comparison.commuteMinutesDifference))} min/day`} />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                      {[comparison.packageA, comparison.packageB].map((receipt) => <div key={receipt.packageId} className="rounded-3xl border border-border bg-background p-6"><h3 className="font-display text-2xl font-bold">{receipt.packageLabel}</h3><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt>Expected cash</dt><dd className="font-semibold">{currency.format(receipt.compensation.annualCashCompensation)}</dd></div><div className="flex justify-between gap-3"><dt>Employer retirement</dt><dd className="font-semibold">{currency.format(receipt.retirement.totalEmployerRetirementContribution)}</dd></div><div className="flex justify-between gap-3"><dt>Employee costs</dt><dd className="font-semibold">{currency.format(receipt.annualEmployeeBenefitCosts)}</dd></div><div className="flex justify-between gap-3"><dt>Value after selected costs</dt><dd className="font-semibold">{currency.format(receipt.estimatedValueAfterSelectedCosts)}</dd></div><div className="flex justify-between gap-3"><dt>Verification questions</dt><dd className="font-semibold">{receipt.verificationQuestions.length}</dd></div></dl></div>)}
                    </div>
                    <div className="rounded-3xl border border-border bg-muted/25 p-6"><h3 className="font-display text-xl font-bold">Decision readout</h3><ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">{comparison.classifications.map((item) => <li key={item}>• {item}</li>)}</ul><p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">{comparison.uncertaintySummary}</p></div>
                  </>}
                </>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 print:hidden sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={() => moveModule(-1)} disabled={activeIndex === 0}><ChevronLeft className="h-4 w-4" /> Previous</Button>
            <div className="flex flex-wrap justify-center gap-2">
              {workspace.packages.length > 1 && <Button type="button" variant="ghost" onClick={deleteActivePackage}><Trash2 className="h-4 w-4" /> Delete package</Button>}
              <Button type="button" variant="ghost" onClick={resetAll}><RotateCcw className="h-4 w-4" /> Clear all local data</Button>
            </div>
            <Button type="button" onClick={() => moveModule(1)} disabled={activeIndex === modules.length - 1}>Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsCommandCenterWorkspace;
