import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Circle,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  Menu,
  Plus,
  Printer,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trackSiteEvent } from "@/lib/analytics";
import {
  calculateAnnualCompensation,
  calculateBenefitValue,
  calculateHealthPlanScenarios,
  calculateProgress,
  calculateRetirementValue,
  calculateTransparentTradeoffScore,
  generateDecisionObservations,
} from "@/premium/calculations";
import {
  createWorkspace,
  getPremiumModule,
  getWorkspace,
  listWorkspaces,
  saveWorkspace,
} from "@/premium/apiClient";
import {
  PREMIUM_PRODUCT_KEY,
  emptyWorkspaceState,
  premiumModuleKeys,
  workspaceStateSchema,
  type PremiumModuleDefinition,
  type PremiumModuleKey,
  type WorkspaceRecord,
  type WorkspaceState,
} from "@/premium/contracts";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

const moduleMeta: Array<{ key: PremiumModuleKey; title: string }> = [
  { key: "define-decision", title: "Define the decision" },
  { key: "compare-compensation", title: "Compare compensation" },
  { key: "value-benefits", title: "Value workplace benefits" },
  { key: "health-plan-exposure", title: "Health-plan exposure" },
  { key: "retirement-benefits", title: "Retirement benefits" },
  { key: "schedule-career", title: "Schedule and career" },
  { key: "verification-list", title: "Verification list" },
  { key: "decision-brief", title: "Decision brief" },
];

const comparisonModules = new Set<PremiumModuleKey>([
  "compare-compensation",
  "value-benefits",
  "health-plan-exposure",
  "retirement-benefits",
  "schedule-career",
]);

const DEV_STORAGE_KEY = "caf-premium-development-demo-workspace";
const DEMO_WORKSPACE_ID = "10000000-0000-4000-8000-000000000001";

const now = () => new Date().toISOString();
const answerKey = (moduleKey: PremiumModuleKey, group: string, fieldId: string) => `${moduleKey}.${group}.${fieldId}`;
const numeric = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const benefitIds = [
  "health-contribution",
  "retirement-match",
  "retirement-contribution",
  "pto",
  "disability",
  "life",
  "education",
  "loan-repayment",
  "certification",
  "other-benefits",
] as const;
const tradeoffRatingIds = [
  "nights",
  "weekends",
  "holidays",
  "call-burden",
  "schedule-predictability",
  "physical-burden",
  "emotional-burden",
  "career-development",
  "advancement",
  "transferable-skills",
  "quality-of-life",
] as const;

const comparisonReader = (state: WorkspaceState, moduleKey: PremiumModuleKey, group: "optionA" | "optionB") =>
  (id: string) => state.answers[answerKey(moduleKey, group, id)];

const compensationResult = (read: (id: string) => unknown) => calculateAnnualCompensation({
  payType: read("pay-type") === "salary" ? "salary" : "hourly",
  basePay: numeric(read("base-pay")),
  annualHours: numeric(read("annual-hours")),
  overtimeHours: numeric(read("overtime-hours")),
  overtimeMultiplier: numeric(read("overtime-multiplier")) || 1.5,
  shiftDifferentialPerHour: numeric(read("shift-differential")),
  differentialHours: numeric(read("differential-hours")),
  bonus: numeric(read("bonus")),
  callPay: numeric(read("call-pay")),
  weekendHolidayPay: numeric(read("weekend-holiday")),
});

const benefitResult = (read: (id: string) => unknown) => calculateBenefitValue(
  benefitIds.map((id) => {
    const status = read(`${id}-status`);
    const valueType = status === "known" || status === "estimated" || status === "non-cash" ? status : "unknown";
    return {
      amount: numeric(read(`${id}-value`)),
      valueType,
      requiresVerification: valueType === "unknown",
    };
  }),
);

const healthPlanResult = (read: (id: string) => unknown) => calculateHealthPlanScenarios({
  annualEmployeePremium: numeric(read("annual-premium")),
  deductible: numeric(read("deductible")),
  coinsurancePercent: numeric(read("coinsurance")),
  copays: numeric(read("copays")),
  outOfPocketMaximum: numeric(read("oop-max")),
  employerAccountContribution: numeric(read("employer-account")),
  expectedAllowedCosts: numeric(read("expected-allowed-costs")),
});

const retirementResult = (read: (id: string) => unknown) => calculateRetirementValue({
  eligibleCompensation: numeric(read("eligible-compensation")),
  employeeContributionPercent: numeric(read("employee-contribution")),
  matchPercent: numeric(read("match-percent")),
  matchLimitPercent: numeric(read("match-limit")),
  nonelectivePercent: numeric(read("nonelective")),
  vestedPercent: numeric(read("vested-percent")),
  waitingPeriodMonths: numeric(read("waiting-period")),
});

const tradeoffResult = (read: (id: string) => unknown) =>
  calculateTransparentTradeoffScore(
    tradeoffRatingIds.map((id) => ({ id, importance: 1, optionA: numeric(read(id)), optionB: 0 })),
  ).optionA;

const isUnknown = (value: unknown) => value === "" || value === null || value === undefined || value === "unknown";

type VerificationQuestion = { audience: string; question: string };
const verificationAudience: Partial<Record<PremiumModuleKey, string>> = {
  "compare-compensation": "recruiter",
  "value-benefits": "benefits department",
  "health-plan-exposure": "insurance plan documents",
  "retirement-benefits": "retirement-plan administrator",
  "schedule-career": "hiring manager",
};

const buildVerificationQuestions = (
  definitions: Record<string, PremiumModuleDefinition>,
  state: WorkspaceState,
): VerificationQuestion[] => {
  const questions = new Map<string, VerificationQuestion>();
  Object.values(definitions).forEach((definition) => {
    if (definition.key === "verification-list") {
      definition.verificationTemplates.forEach((template) => {
        questions.set(template.question, {
          audience: template.audience.replace(/-/g, " "),
          question: template.question,
        });
      });
      return;
    }
    if (!comparisonModules.has(definition.key)) return;
    definition.fields.forEach((field) => {
      const groups = field.group === "shared" ? ["optionA", "optionB"] as const : [field.group] as const;
      groups.forEach((group) => {
        const value = state.answers[answerKey(definition.key, group, field.id)];
        if (!isUnknown(value)) return;
        const option = group === "optionA" ? "Option A" : group === "optionB" ? "Option B" : "the decision";
        const templates = definition.verificationTemplates.filter((template) => template.fieldId === field.id);
        if (templates.length) {
          templates.forEach((template) => {
            const question = `${template.question} (${option})`;
            questions.set(`${template.audience}:${question}`, {
              audience: template.audience.replace(/-/g, " "),
              question,
            });
          });
          return;
        }
        const audience = verificationAudience[definition.key];
        if (!audience) return;
        const question = `What is the confirmed ${field.label.toLowerCase()} for ${option}?`;
        questions.set(`${audience}:${question}`, { audience, question });
      });
    });
  });
  return [...questions.values()];
};

const makeDemoRecord = (): WorkspaceRecord => ({
  id: DEMO_WORKSPACE_ID,
  title: "Local development comparison",
  status: "active",
  progressPercent: 0,
  state: emptyWorkspaceState(),
  createdAt: now(),
  updatedAt: now(),
});

const readDemoRecord = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DEV_STORAGE_KEY) || "null");
    if (!parsed) return makeDemoRecord();
    return {
      ...parsed,
      state: workspaceStateSchema.parse(parsed.state),
    } as WorkspaceRecord;
  } catch {
    return makeDemoRecord();
  }
};

const writeDemoRecord = (record: WorkspaceRecord) => {
  window.localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(record));
};

const AppHeader = ({ demo }: { demo: boolean }) => (
  <>
    {demo && (
      <div className="premium-no-print bg-sky-950 px-4 py-2 text-center text-xs font-bold text-white">
        Development-only demo · local browser state · no account, entitlement, payment, or cloud persistence
      </div>
    )}
    <header className="premium-no-print border-b border-border bg-white">
      <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/app/benefits-decision" className="flex items-center gap-3 font-display text-lg font-bold text-[#173b2d]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0b6b4f] text-white"><BriefcaseBusiness className="h-5 w-5" /></span>
          <span className="hidden sm:inline">Benefits Decision System</span>
        </Link>
        <nav aria-label="Account navigation" className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/products/healthcare-worker-benefits-decision-system">Product overview</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/account">Account</Link></Button>
        </nav>
      </div>
    </header>
  </>
);

const Dashboard = ({ demo, token }: { demo: boolean; token?: string }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceRecord[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    if (demo) {
      const record = readDemoRecord();
      setWorkspaces(record.state.completedModuleKeys.length || Object.keys(record.state.answers).length ? [record] : []);
      setState("ready");
      return undefined;
    }
    if (!token) return undefined;
    void listWorkspaces(token)
      .then((records) => {
        if (active) {
          setWorkspaces(records);
          setState("ready");
        }
      })
      .catch(() => active && setState("error"));
    return () => { active = false; };
  }, [demo, token]);

  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] bg-[#f3f7f4] px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Decision workspaces</div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Healthcare Worker Benefits Decision System</h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Create a structured comparison, save progress, resolve unknowns, and finish with a printable decision brief.</p>
          </div>
          <Button asChild size="lg"><Link to="/app/benefits-decision/new"><Plus className="h-4 w-4" /> New decision</Link></Button>
        </div>
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
          <strong>Privacy boundary:</strong> do not enter or upload Social Security numbers, financial account or card numbers, insurance member IDs, medical records, diagnoses, claims, EOBs, paystubs, full statements, protected health information, or confidential employer documents.
        </div>
        {state === "loading" && <div className="mt-8 flex items-center gap-3 rounded-3xl border border-border bg-white p-8" role="status"><LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" /> Loading workspaces…</div>}
        {state === "error" && <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8" role="alert"><h2 className="font-bold text-red-950">Workspaces could not be loaded</h2><p className="mt-2 text-sm text-red-900">Check the network connection and try again. No local browser fallback is used in production.</p></div>}
        {state === "ready" && workspaces.length === 0 && (
          <section className="mt-8 rounded-[2rem] border border-dashed border-[#b8cbbf] bg-white p-8 text-center md:p-12">
            <LayoutDashboard className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold">No decision workspace yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Start with two roles or offers. You can leave uncertain values unknown and convert them into a professional verification list.</p>
            <Button asChild className="mt-6"><Link to="/app/benefits-decision/new">Create a workspace</Link></Button>
          </section>
        )}
        {state === "ready" && workspaces.length > 0 && (
          <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Saved workspaces">
            {workspaces.map((workspace) => (
              <Link key={workspace.id} to={`/app/benefits-decision/${workspace.id}`} className="group rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
                <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-primary">{workspace.status}</div><h2 className="mt-2 font-display text-2xl font-bold">{workspace.title}</h2></div><ArrowRight className="h-5 w-5 text-primary transition group-hover:translate-x-1" /></div>
                <Progress className="mt-6 h-2" value={workspace.progressPercent} aria-label={`${workspace.progressPercent}% complete`} />
                <div className="mt-2 text-sm text-muted-foreground">{workspace.progressPercent}% complete · Updated {new Date(workspace.updatedAt).toLocaleDateString()}</div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

const NewWorkspace = ({ demo, token }: { demo: boolean; token?: string }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("My benefits decision");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      let record: WorkspaceRecord;
      if (demo) {
        record = { ...makeDemoRecord(), title: title.trim() || "My benefits decision" };
        writeDemoRecord(record);
      } else {
        if (!token) throw new Error("Missing secure session");
        record = await createWorkspace(token, title.trim());
      }
      trackSiteEvent("premium_workspace_created", { event_category: "premium_system", product_key: PREMIUM_PRODUCT_KEY });
      navigate(`/app/benefits-decision/${record.id}`, { replace: true });
    } catch {
      setError("The workspace could not be created. Check the connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id="main-content" className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f3f7f4] px-4 py-10">
      <section className="w-full max-w-xl rounded-[2rem] border border-border bg-white p-7 shadow-card md:p-10">
        <Button asChild variant="ghost" className="-ml-3"><Link to="/app/benefits-decision"><ArrowLeft className="h-4 w-4" /> Dashboard</Link></Button>
        <h1 className="mt-4 font-display text-4xl font-bold">Create a decision workspace</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Use a generic title. Do not put an employer name, medical detail, or sensitive identifier in the workspace title.</p>
        <label htmlFor="workspace-title" className="mt-7 block text-sm font-semibold">Workspace title</label>
        <input id="workspace-title" value={title} onChange={(event) => setTitle(event.target.value.slice(0, 120))} className="mt-2 h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
        <Button className="mt-6 min-h-12 w-full" onClick={() => void create()} disabled={busy || !title.trim()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create workspace</Button>
      </section>
    </main>
  );
};

type Field = PremiumModuleDefinition["fields"][number];

const FieldControl = ({
  field,
  value,
  onChange,
  id,
}: {
  field: Field;
  value: string | number | boolean | string[] | null | undefined;
  onChange: (value: string | number | boolean | string[]) => void;
  id: string;
}) => {
  const common = "mt-2 min-h-12 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  if (field.type === "textarea") return <textarea id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value.slice(0, 8000))} className={`${common} min-h-32 py-3`} />;
  if (field.type === "select") return (
    <select id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={common}>
      <option value="">Select or leave unknown</option>
      {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
  if (field.type === "checkbox") return <input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="mt-3 h-5 w-5 rounded border-border text-primary focus:ring-primary" />;
  if (field.type === "rating") return (
    <select id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : "")} className={common}>
      <option value="">Not rated</option>
      {[0, 1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} — {rating === 0 ? "Not acceptable" : rating === 5 ? "Excellent fit" : "User rating"}</option>)}
    </select>
  );
  const type = field.type === "date" ? "date" : field.type === "text" ? "text" : "number";
  return <input id={id} type={type} value={value === null || value === undefined ? "" : String(value)} min={field.min} max={field.max} step={field.step || (field.type === "currency" || field.type === "percent" ? "0.01" : "1")} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(type === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value)} className={common} />;
};

const ResultPanel = ({ moduleKey, state }: { moduleKey: PremiumModuleKey; state: WorkspaceState }) => {
  const a = comparisonReader(state, moduleKey, "optionA");
  const b = comparisonReader(state, moduleKey, "optionB");
  const rows: Array<{ label: string; a: string; b: string; note?: string }> = [];

  if (moduleKey === "compare-compensation") {
    const ca = compensationResult(a);
    const cb = compensationResult(b);
    rows.push({ label: "Estimated annual gross", a: money(ca.estimatedAnnualGross), b: money(cb.estimatedAnnualGross), note: "Planning estimate; compensation is not guaranteed." });
    rows.push({ label: "Base compensation", a: money(ca.base), b: money(cb.base) });
    rows.push({ label: "Conditional components", a: money(ca.conditional), b: money(cb.conditional) });
  }
  if (moduleKey === "value-benefits") {
    const ca = benefitResult(a);
    const cb = benefitResult(b);
    rows.push({ label: "Known annual value", a: money(ca.known), b: money(cb.known) });
    rows.push({ label: "Estimated annual value", a: money(ca.estimated), b: money(cb.estimated), note: "Unknown and non-cash benefits remain separate." });
    rows.push({ label: "Unknown / non-cash items", a: `${ca.unknownCount} / ${ca.nonCashCount}`, b: `${cb.unknownCount} / ${cb.nonCashCount}`, note: "Counts are shown instead of assigning unsupported dollar values." });
  }
  if (moduleKey === "health-plan-exposure") {
    const ca = healthPlanResult(a);
    const cb = healthPlanResult(b);
    rows.push({ label: "Low-use scenario", a: money(ca.lowUse), b: money(cb.lowUse) });
    rows.push({ label: "Expected-use scenario", a: money(ca.expectedUse), b: money(cb.expectedUse) });
    rows.push({ label: "High-use scenario", a: money(ca.highUse), b: money(cb.highUse), note: ca.warning });
  }
  if (moduleKey === "retirement-benefits") {
    const ca = retirementResult(a);
    const cb = retirementResult(b);
    rows.push({ label: "Annual employer value", a: money(ca.annualEmployerValue), b: money(cb.annualEmployerValue) });
    rows.push({ label: "Immediately vested", a: money(ca.immediatelyVestedValue), b: money(cb.immediatelyVestedValue) });
    rows.push({ label: "Conditional / unvested", a: money(ca.conditionalUnvestedValue), b: money(cb.conditionalUnvestedValue), note: "Conditional value may be forfeited." });
  }
  if (moduleKey === "schedule-career") {
    rows.push({ label: "Transparent average rating", a: tradeoffResult(a).toFixed(1), b: tradeoffResult(b).toFixed(1), note: "Unweighted mean of your visible 0–5 ratings; no objective recommendation is produced." });
  }
  if (!rows.length) return null;
  return (
    <section className="mt-8 rounded-3xl border border-[#c8dcd0] bg-[#eff6f1] p-5 md:p-6" aria-labelledby="calculation-heading">
      <h2 id="calculation-heading" className="font-display text-2xl font-bold">Current calculation</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead><tr className="border-b border-[#c8dcd0]"><th className="py-3 pr-4">Result</th><th className="px-4 py-3">Option A</th><th className="px-4 py-3">Option B</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.label} className="border-b border-[#dce8e0] last:border-0"><th className="py-4 pr-4 font-semibold">{row.label}{row.note && <span className="mt-1 block max-w-md text-xs font-normal text-muted-foreground">{row.note}</span>}</th><td className="px-4 py-4 font-bold">{row.a}</td><td className="px-4 py-4 font-bold">{row.b}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
};

const BriefTable = ({
  title,
  rows,
  note,
}: {
  title: string;
  rows: Array<{ label: string; a: string; b: string }>;
  note?: string;
}) => (
  <section className="mt-7 break-inside-avoid">
    <h3 className="font-display text-2xl font-bold">{title}</h3>
    <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-[#f3f7f4]"><tr><th className="px-4 py-3">Comparison</th><th className="px-4 py-3">Option A</th><th className="px-4 py-3">Option B</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.label} className="border-t border-border"><th className="px-4 py-3 font-semibold">{row.label}</th><td className="px-4 py-3">{row.a}</td><td className="px-4 py-3">{row.b}</td></tr>)}</tbody>
      </table>
    </div>
    {note && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>}
  </section>
);

const VerificationListPanel = ({
  definitions,
  state,
}: {
  definitions: Record<string, PremiumModuleDefinition>;
  state: WorkspaceState;
}) => {
  const questions = buildVerificationQuestions(definitions, state);
  return (
    <section className="mt-8 rounded-3xl border border-[#c8dcd0] bg-[#eff6f1] p-5 md:p-6" aria-labelledby="verification-questions-heading">
      <h2 id="verification-questions-heading" className="font-display text-2xl font-bold">Generated verification questions</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">These questions come from information that is blank, unknown, or marked for verification. Ask the listed source for a written answer and retain the controlling document.</p>
      {questions.length ? (
        <ol className="mt-5 space-y-3">
          {questions.map((item, index) => (
            <li key={`${item.audience}-${item.question}`} className="rounded-2xl border border-border bg-white p-4 text-sm">
              <span className="font-bold">{index + 1}. {item.audience}:</span> {item.question}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 rounded-2xl border border-border bg-white p-4 text-sm">No verification questions were generated from the currently loaded modules.</p>
      )}
    </section>
  );
};

const DecisionBrief = ({ record, definitions }: { record: WorkspaceRecord; definitions: Record<string, PremiumModuleDefinition> }) => {
  const state = record.state;
  const defineA = comparisonReader(state, "define-decision", "optionA");
  const defineB = comparisonReader(state, "define-decision", "optionB");
  const defineShared = (id: string) => state.answers[answerKey("define-decision", "shared", id)];
  const compA = compensationResult(comparisonReader(state, "compare-compensation", "optionA"));
  const compB = compensationResult(comparisonReader(state, "compare-compensation", "optionB"));
  const benefitsA = benefitResult(comparisonReader(state, "value-benefits", "optionA"));
  const benefitsB = benefitResult(comparisonReader(state, "value-benefits", "optionB"));
  const healthA = healthPlanResult(comparisonReader(state, "health-plan-exposure", "optionA"));
  const healthB = healthPlanResult(comparisonReader(state, "health-plan-exposure", "optionB"));
  const retirementA = retirementResult(comparisonReader(state, "retirement-benefits", "optionA"));
  const retirementB = retirementResult(comparisonReader(state, "retirement-benefits", "optionB"));
  const scheduleA = comparisonReader(state, "schedule-career", "optionA");
  const scheduleB = comparisonReader(state, "schedule-career", "optionB");
  const verificationQuestions = buildVerificationQuestions(definitions, state);
  const observations = [
    ...generateDecisionObservations(state),
    ...(verificationQuestions.length
      ? [{ level: "warning" as const, text: `${verificationQuestions.length} verification question${verificationQuestions.length === 1 ? "" : "s"} remain before the comparison is fully confirmed.` }]
      : []),
  ];
  const text = (value: unknown) => isUnknown(value) ? "Not recorded" : String(value);
  const decisionDate = text(state.answers[answerKey("decision-brief", "shared", "decision-date")]);
  const priorities = [
    ["Top priorities", defineShared("priorities")],
    ["Known constraints", defineShared("constraints")],
    ["Must-have requirements", defineShared("must-haves")],
    ["Reasons for considering the decision", defineShared("reasons")],
  ];
  return (
    <article className="premium-print-brief mt-8 rounded-[2rem] border border-border bg-white p-6 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Benefits Decision Brief</div><h2 className="mt-2 font-display text-4xl font-bold">{record.title}</h2><p className="mt-2 text-sm text-muted-foreground">Decision date: {decisionDate} · Brief generated {new Date().toLocaleDateString()} · User-provided information and planning estimates</p></div>
        <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <BriefTable
        title="Decision being considered"
        rows={[
          { label: "Role or offer", a: text(defineA("current-role")), b: text(defineB("alternative-role")) },
          { label: "Decision deadline", a: text(defineShared("decision-deadline")), b: text(defineShared("decision-deadline")) },
        ]}
      />
      <section className="mt-7 break-inside-avoid"><h3 className="font-display text-2xl font-bold">User priorities and constraints</h3><dl className="mt-3 grid gap-3 sm:grid-cols-2">{priorities.map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-border p-4"><dt className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">{String(label)}</dt><dd className="mt-2 whitespace-pre-wrap text-sm">{text(value)}</dd></div>)}</dl></section>
      <BriefTable
        title="Key financial comparison"
        rows={[
          { label: "Estimated annual gross compensation", a: money(compA.estimatedAnnualGross), b: money(compB.estimatedAnnualGross) },
          { label: "Base compensation", a: money(compA.base), b: money(compB.base) },
          { label: "Conditional compensation components", a: money(compA.conditional), b: money(compB.conditional) },
        ]}
        note="Compensation values are estimates based on the recorded hours and pay assumptions; they are not guaranteed."
      />
      <BriefTable
        title="Benefits comparison"
        rows={[
          { label: "Known annual value", a: money(benefitsA.known), b: money(benefitsB.known) },
          { label: "Estimated annual value", a: money(benefitsA.estimated), b: money(benefitsB.estimated) },
          { label: "Unknown value items", a: String(benefitsA.unknownCount), b: String(benefitsB.unknownCount) },
          { label: "Non-cash value items", a: String(benefitsA.nonCashCount), b: String(benefitsB.nonCashCount) },
        ]}
        note="Unknown and non-cash benefits are not assigned unsupported dollar values. Eligibility and use conditions still require verification."
      />
      <BriefTable
        title="Health-plan scenarios"
        rows={[
          { label: "Low-use planning scenario", a: money(healthA.lowUse), b: money(healthB.lowUse) },
          { label: "Expected-use planning scenario", a: money(healthA.expectedUse), b: money(healthB.expectedUse) },
          { label: "High-use planning scenario", a: money(healthA.highUse), b: money(healthB.highUse) },
        ]}
        note={healthA.warning}
      />
      <BriefTable
        title="Retirement findings"
        rows={[
          { label: "Annual employer value", a: money(retirementA.annualEmployerValue), b: money(retirementB.annualEmployerValue) },
          { label: "Immediately vested value", a: money(retirementA.immediatelyVestedValue), b: money(retirementB.immediatelyVestedValue) },
          { label: "Conditional / unvested value", a: money(retirementA.conditionalUnvestedValue), b: money(retirementB.conditionalUnvestedValue) },
          { label: "Potential forfeiture risk", a: retirementA.potentialForfeitureRisk ? "Yes — verify conditions" : "Not indicated", b: retirementB.potentialForfeitureRisk ? "Yes — verify conditions" : "Not indicated" },
        ]}
        note="Conditional or unvested employer value may be forfeited. Written plan terms control."
      />
      <BriefTable
        title="Schedule and career tradeoffs"
        rows={[
          { label: "Weekly hours", a: text(scheduleA("weekly-hours")), b: text(scheduleB("weekly-hours")) },
          { label: "Shift length", a: text(scheduleA("shift-length")), b: text(scheduleB("shift-length")) },
          { label: "Commute (minutes)", a: text(scheduleA("commute")), b: text(scheduleB("commute")) },
          { label: "Transparent average rating (0–5)", a: tradeoffResult(scheduleA).toFixed(1), b: tradeoffResult(scheduleB).toFixed(1) },
        ]}
        note="The rating is the unweighted mean of the visible 0–5 schedule, burden, career, and quality-of-life ratings. It organizes the user's inputs and is not an objective verdict."
      />
      <section className="mt-7 break-inside-avoid"><h3 className="font-display text-2xl font-bold">System-generated observations</h3>{observations.length ? <ul className="mt-3 space-y-2">{observations.map((observation) => <li key={observation.text} className="flex gap-2 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><span>{observation.text}</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No additional observations were generated.</p>}</section>
      <section className="mt-7 break-inside-avoid"><h3 className="font-display text-2xl font-bold">Important unknowns and verification questions</h3>{verificationQuestions.length ? <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">{verificationQuestions.map((item, index) => <li key={`${item.question}-${index}`}><span className="font-semibold">{item.audience}:</span> {item.question}</li>)}</ol> : <p className="mt-2 text-sm text-muted-foreground">No unresolved questions were generated from the completed workspace.</p>}</section>
      <section className="mt-7 break-inside-avoid"><h3 className="font-display text-2xl font-bold">Key assumptions</h3><p className="mt-2 text-sm">{record.progressPercent}% of the structured workflow is marked complete.</p>{state.assumptions.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{state.assumptions.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No explicit assumptions recorded.</p>}</section>
      <section className="mt-7 break-inside-avoid"><h3 className="font-display text-2xl font-bold">Final user-selected decision</h3><p className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#f3f7f4] p-5">{state.finalDecision || String(state.answers["decision-brief.shared.final-decision"] || "No final decision recorded.")}</p></section>
      <section className="mt-7 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        Educational planning output only. It does not determine compensation, official plan coverage, network status, medical necessity, legal rights, taxes, claim liability, or plan interpretation. Written employer and plan documents control.
      </section>
    </article>
  );
};

const Workspace = ({ demo, token, workspaceId }: { demo: boolean; token?: string; workspaceId: string }) => {
  const [record, setRecord] = useState<WorkspaceRecord | null>(null);
  const recordRef = useRef<WorkspaceRecord | null>(null);
  const [definitions, setDefinitions] = useState<Record<string, PremiumModuleDefinition>>({});
  const definitionsRef = useRef<Record<string, PremiumModuleDefinition>>({});
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error" | "deleted">("loading");
  const [saveState, setSaveState] = useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const [validation, setValidation] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const loadDefinition = useCallback(async (key: PremiumModuleKey) => {
    if (definitionsRef.current[key]) return definitionsRef.current[key];
    let definition: PremiumModuleDefinition | undefined;
    if (demo && import.meta.env.DEV && !import.meta.env.PROD) {
      const module = await import("@/premium/dev/demoModules");
      definition = module.getDevelopmentDemoModule(key);
    } else if (token) {
      definition = await getPremiumModule(key, token);
    }
    if (!definition) throw new Error("Module unavailable");
    definitionsRef.current = { ...definitionsRef.current, [key]: definition };
    setDefinitions(definitionsRef.current);
    return definition;
  }, [demo, token]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const loaded = demo ? readDemoRecord() : token ? await getWorkspace(token, workspaceId) : null;
        if (!active || !loaded) return;
        recordRef.current = loaded;
        setRecord(loaded);
        if (loaded.state.activeModuleKey === "verification-list" || loaded.state.activeModuleKey === "decision-brief") {
          await Promise.all(premiumModuleKeys.map(loadDefinition));
        } else {
          await loadDefinition(loaded.state.activeModuleKey);
        }
        if (active) setLoadState("ready");
      } catch (error) {
        if (!active) return;
        setLoadState(error instanceof Error && error.message.includes("deleted") ? "deleted" : "error");
      }
    };
    void load();
    return () => { active = false; };
  }, [demo, loadDefinition, token, workspaceId]);

  useEffect(() => {
    if (saveState !== "unsaved") return undefined;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saveState]);

  const updateState = (updater: (state: WorkspaceState) => WorkspaceState) => {
    setRecord((current) => {
      if (!current) return current;
      const state = workspaceStateSchema.parse(updater(current.state));
      const nextRecord = { ...current, state, progressPercent: calculateProgress(state.completedModuleKeys), updatedAt: now() };
      recordRef.current = nextRecord;
      return nextRecord;
    });
    setSaveState("unsaved");
    setValidation("");
  };

  const persist = async (recordToSave = recordRef.current) => {
    if (!recordToSave) return false;
    setSaveState("saving");
    try {
      const saved = demo
        ? (() => { writeDemoRecord(recordToSave); return recordToSave; })()
        : token
          ? await saveWorkspace(token, recordToSave.id, recordToSave.state)
          : null;
      if (!saved) throw new Error();
      recordRef.current = saved;
      setRecord(saved);
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  };

  const openModule = async (key: PremiumModuleKey) => {
    setLoadState("loading");
    try {
      if (key === "verification-list" || key === "decision-brief") {
        await Promise.all(premiumModuleKeys.map(loadDefinition));
      } else {
        await loadDefinition(key);
      }
      updateState((state) => ({ ...state, activeModuleKey: key }));
      setMenuOpen(false);
      setLoadState("ready");
      trackSiteEvent("premium_module_started", { event_category: "premium_system", module_key: key });
    } catch {
      setLoadState("error");
    }
  };

  const completeModule = async () => {
    if (!record) return;
    const definition = definitions[record.state.activeModuleKey];
    if (!definition) return;
    const missing = definition.fields.filter((field) => {
      if (!field.required) return false;
      const groups = comparisonModules.has(definition.key) && field.group === "shared" ? ["optionA", "optionB"] : [field.group];
      return groups.some((group) => {
        const value = record.state.answers[answerKey(definition.key, group, field.id)];
        return value === "" || value === null || value === undefined;
      });
    });
    if (missing.length) {
      setValidation(`Complete the required ${missing.length === 1 ? "field" : "fields"} before marking this module complete.`);
      return;
    }
    const completed = [...new Set([...record.state.completedModuleKeys, definition.key])];
    const nextKey = premiumModuleKeys[Math.min(premiumModuleKeys.indexOf(definition.key) + 1, premiumModuleKeys.length - 1)];
    const nextRecord = {
      ...record,
      state: { ...record.state, completedModuleKeys: completed, activeModuleKey: nextKey },
      progressPercent: calculateProgress(completed),
      updatedAt: now(),
    };
    recordRef.current = nextRecord;
    setRecord(nextRecord);
    setSaveState("unsaved");
    const saved = await persist(nextRecord);
    if (saved) {
      trackSiteEvent("premium_module_completed", { event_category: "premium_system", module_key: definition.key });
      if (nextKey !== definition.key) await openModule(nextKey);
    }
  };

  const loadBrief = async () => {
    try {
      await Promise.all(premiumModuleKeys.map(loadDefinition));
      await openModule("decision-brief");
      trackSiteEvent("premium_decision_brief_viewed", { event_category: "premium_system" });
    } catch {
      setLoadState("error");
    }
  };

  if (loadState === "deleted") return <main className="grid min-h-screen place-items-center"><div className="text-center"><h1 className="font-display text-3xl font-bold">Workspace not found</h1><Button asChild className="mt-5"><Link to="/app/benefits-decision">Return to dashboard</Link></Button></div></main>;
  if (!record || loadState === "loading") return <main className="grid min-h-[70vh] place-items-center" role="status"><div className="flex items-center gap-3"><LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" /> Loading secure workspace…</div></main>;
  if (loadState === "error") return <main className="grid min-h-[70vh] place-items-center px-4"><div className="max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8" role="alert"><h1 className="font-display text-3xl font-bold text-red-950">The workspace could not be opened</h1><p className="mt-3 text-red-900">The session may have expired, the network may be interrupted, or access may no longer be authorized.</p><Button asChild className="mt-5"><Link to="/app/benefits-decision">Return to dashboard</Link></Button></div></main>;

  const activeKey = record.state.activeModuleKey;
  const definition = definitions[activeKey];
  if (!definition) return null;
  const comparative = comparisonModules.has(activeKey);
  const sections = comparative ? [{ group: "optionA", label: "Option A" }, { group: "optionB", label: "Option B" }] : [{ group: "shared", label: "" }];

  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] bg-[#eef3ef]">
      <div className="premium-no-print sticky top-0 z-30 border-b border-border bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Button variant="outline" className="w-full justify-between" onClick={() => setMenuOpen((open) => !open)}><span className="flex items-center gap-2"><Menu className="h-4 w-4" /> Module {definition.number} of {premiumModuleKeys.length}</span>{menuOpen ? <X className="h-4 w-4" /> : null}</Button>
      </div>
      <div className="mx-auto grid max-w-[1500px] md:grid-cols-[290px_minmax(0,1fr)]">
        <aside className={`premium-no-print border-r border-border bg-white p-4 md:sticky md:top-0 md:block md:h-[calc(100vh-4rem)] md:overflow-y-auto md:p-5 ${menuOpen ? "block" : "hidden"}`} aria-label="Decision modules">
          <Link to="/app/benefits-decision" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> All workspaces</Link>
          <h1 className="mt-5 font-display text-xl font-bold">{record.title}</h1>
          <Progress className="mt-4 h-2" value={record.progressPercent} aria-label={`Workflow progress: ${record.progressPercent}% complete`} />
          <div className="mt-2 text-xs font-semibold text-muted-foreground" aria-live="polite">{record.progressPercent}% complete</div>
          <nav className="mt-6 space-y-1">
            {moduleMeta.map((module, index) => {
              const complete = record.state.completedModuleKeys.includes(module.key);
              const active = module.key === activeKey;
              return (
                <button key={module.key} onClick={() => void openModule(module.key)} className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm ${active ? "bg-[#e1efe7] text-[#07543d]" : "hover:bg-muted/50"}`} aria-current={active ? "step" : undefined}>
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${complete ? "bg-primary text-white" : "border border-border"}`}>{complete ? <Check className="h-3.5 w-3.5" /> : index + 1}</span>
                  <span className="font-semibold leading-tight">{module.title}</span>
                </button>
              );
            })}
          </nav>
          <Button className="mt-5 w-full" variant="outline" onClick={() => void loadBrief()}><FileText className="h-4 w-4" /> Review decision brief</Button>
        </aside>
        <section className="min-w-0 px-4 py-6 md:px-8 md:py-10 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="premium-no-print mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm">
              <span className="flex items-center gap-2">{saveState === "saved" ? <CheckCircle2 className="h-4 w-4 text-primary" /> : saveState === "saving" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : saveState === "error" ? <AlertTriangle className="h-4 w-4 text-red-700" /> : <Circle className="h-4 w-4 text-amber-700" />} {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : saveState === "error" ? "Save failed — changes remain in this page" : "Unsaved changes"}</span>
              <Button size="sm" variant="outline" onClick={() => void persist()} disabled={saveState === "saving" || saveState === "saved"}><Save className="h-4 w-4" /> Save</Button>
            </div>
            <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-9">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Module {definition.number} of {premiumModuleKeys.length}</div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{definition.title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{definition.summary}</p>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><strong>Data minimization:</strong> enter only decision assumptions and generic notes. Do not upload documents or enter identifying, account, medical, insurance-member, claim, or confidential employer information.</div>
              {definition.education.length > 0 && <section className="mt-7 rounded-3xl bg-[#f3f7f4] p-5"><h2 className="font-semibold">Before you enter values</h2><ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{definition.education.map((item) => <li key={item} className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></section>}
              <div className={`mt-8 grid gap-7 ${comparative ? "xl:grid-cols-2" : ""}`}>
                {sections.map((section) => (
                  <fieldset key={section.group} className="min-w-0 rounded-3xl border border-border p-5 md:p-6">
                    {section.label
                      ? <legend className="px-2 font-display text-2xl font-bold">{section.label}</legend>
                      : <legend className="sr-only">{definition.title} fields</legend>}
                    <div className="space-y-5">
                      {definition.fields.filter((field) =>
                        field.group === "shared"
                        || field.group === section.group
                        || (!comparative && activeKey === "define-decision"),
                      ).map((field) => {
                        const group = comparative && field.group === "shared" ? section.group : field.group;
                        const key = answerKey(definition.key, group, field.id);
                        const id = `${definition.key}-${group}-${field.id}`;
                        return (
                          <div key={key}>
                            <label htmlFor={id} className="text-sm font-semibold">{field.label}{field.required && <span className="ml-1 text-red-700" aria-hidden="true">*</span>}</label>
                            {field.help && <p id={`${id}-help`} className="mt-1 text-xs leading-relaxed text-muted-foreground">{field.help}</p>}
                            <FieldControl field={field} id={id} value={record.state.answers[key]} onChange={(value) => updateState((state) => {
                              const next = { ...state, answers: { ...state.answers, [key]: value } };
                              if (definition.key === "decision-brief" && field.id === "final-decision") next.finalDecision = String(value);
                              if (definition.key === "define-decision" && field.id === "assumptions") {
                                next.assumptions = String(value)
                                  .split("\n")
                                  .map((item) => item.trim())
                                  .filter(Boolean)
                                  .slice(0, 100);
                              }
                              return next;
                            })} />
                            {field.sensitiveReminder && <p className="mt-1 text-xs text-muted-foreground">Keep this generic; do not include sensitive or identifying details.</p>}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
              <ResultPanel moduleKey={activeKey} state={record.state} />
              {activeKey === "verification-list" && <VerificationListPanel definitions={definitions} state={record.state} />}
              {validation && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{validation}</p>}
              <div className="premium-no-print mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="outline" onClick={() => void persist()} disabled={saveState === "saving"}><Save className="h-4 w-4" /> Save progress</Button>
                <Button onClick={() => void completeModule()}>Mark module complete <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </article>
            {activeKey === "decision-brief" && <DecisionBrief record={record} definitions={definitions} />}
            {activeKey === "decision-brief" && <div className="premium-no-print mt-5 flex justify-end"><Button onClick={() => { trackSiteEvent("premium_print_selected", { event_category: "premium_system", output_type: "browser_print" }); window.print(); }}><Printer className="h-4 w-4" /> Print decision brief</Button></div>}
          </div>
        </section>
      </div>
    </main>
  );
};

export default function BenefitsDecisionAppPage() {
  const auth = usePremiumAuth();
  const { workspaceId } = useParams();
  return (
    <>
      <AppHeader demo={auth.isDevelopmentDemo} />
      {!workspaceId ? <Dashboard demo={auth.isDevelopmentDemo} token={auth.accessToken} /> : workspaceId === "new" ? <NewWorkspace demo={auth.isDevelopmentDemo} token={auth.accessToken} /> : <Workspace demo={auth.isDevelopmentDemo} token={auth.accessToken} workspaceId={workspaceId} />}
    </>
  );
}
