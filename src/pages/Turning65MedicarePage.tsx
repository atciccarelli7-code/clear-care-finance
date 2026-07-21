import { useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Copy, FileText, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContentFreshness } from "@/components/shared/ContentFreshness";
import { ActionPlanSection, ImmediateAnswer, OfficialVerificationPanel, SaveToMyPlanAction } from "@/components/shared/DecisionJourney";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TURNING_65_LAST_REVIEWED, TURNING_65_SOURCES } from "@/data/turning65MedicareSources";
import { buildTurning65Plan, type CoverageSource, type DrugCoverage, type EmployerSize, type MedicarePreference, type Turning65Answers, type YesNoUnknown } from "@/lib/turning65Medicare";
import { loadDecisionWorkspace, upsertDecisionRecord } from "@/lib/decisionWorkspace";
import { useSeo } from "@/lib/seo";

const initialAnswers: Turning65Answers = {
  birthMonth: null,
  birthYear: null,
  alreadyEnrolled: "unknown",
  coverageSource: "unknown",
  activeEmployment: "unknown",
  employerSize: "unknown",
  employmentEndingSoon: "unknown",
  hsaContributing: "unknown",
  spouseCoverageConcern: "unknown",
  drugCoverage: "unknown",
  preference: "undecided",
  limitedIncomeHelp: "unknown",
  stateCode: "",
};

const inputClass = "h-12 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const ynu = [["unknown", "Not sure"], ["yes", "Yes"], ["no", "No"]] as const;

const SelectField = ({ label, value, options, onChange, helper }: { label: string; value: string; options: readonly (readonly [string, string])[]; onChange: (value: string) => void; helper?: string }) => <label className="block space-y-2"><span className="text-sm font-bold">{label}</span><select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}</select>{helper && <span className="block text-xs leading-relaxed text-muted-foreground">{helper}</span>}</label>;

const ResultList = ({ title, items }: { title: string; items: string[] }) => <Card className="shadow-card"><CardHeader><CardTitle className="font-display text-xl">{title}</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">{items.map((item) => <li key={item} className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></CardContent></Card>;

export default function Turning65MedicarePage() {
  useSeo({ title: "Turning 65 Medicare Enrollment Pathway", description: "Build a qualified Medicare enrollment timeline using age, current coverage, active employment, employer size, HSA, drug coverage, spouse coverage, and official verification steps.", canonicalPath: "/medicare-care-costs/turning-65" });
  const [answers, setAnswers] = useState<Turning65Answers>(initialAnswers);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const plan = useMemo(() => buildTurning65Plan(answers), [answers]);
  const set = <K extends keyof Turning65Answers>(key: K, value: Turning65Answers[K]) => setAnswers((current) => ({ ...current, [key]: value }));

  const resultText = useMemo(() => [plan.headline, "", plan.immediateAnswer, "", "DO NOW", ...plan.doNow.map((item) => `- ${item}`), "", "TIMELINE", ...plan.timeline.map((item) => `- ${item.timing}: ${item.action}`), "", "WARNINGS", ...plan.warnings.map((item) => `- ${item}`), "", "DOCUMENTS", ...plan.documents.map((item) => `- ${item}`), "", "OFFICIAL ACTIONS", ...plan.officialActions.map((item) => `- ${item}`), "", "Educational planning only. Medicare, Social Security, employer plan documents, state agencies, and written notices control."].join("\n"), [plan]);

  const buildPlan = () => { setShowResult(true); window.setTimeout(() => resultRef.current?.focus(), 0); };
  const copy = async () => { await navigator.clipboard.writeText(resultText); setCopied(true); window.setTimeout(() => setCopied(false), 2200); };
  const save = () => {
    const workspace = loadDecisionWorkspace();
    upsertDecisionRecord(workspace, {
      id: "turning-65-primary",
      journeyId: "turning-65-medicare",
      fixedCategory: "Turning 65 Medicare",
      destinationRoute: "/medicare-care-costs/turning-65",
      completedSteps: ["coverage-intake", "timeline-generated"],
      outstandingActions: plan.doNow.slice(0, 8).map((label, index) => ({ id: `turning65-${index}`, category: "medicare-enrollment", label, status: "open" as const })),
      verificationStatus: "in_progress",
    });
    setSaved(true);
  };
  const reset = () => { setAnswers(initialAnswers); setShowResult(false); setCopied(false); setSaved(false); };

  return <>
    <PageHero eyebrow="Turning 65 Medicare pathway" title="Know what to do, when to do it, and what still must be verified." description="Build a qualified enrollment timeline before choosing a plan. This pathway organizes current coverage, active employment, employer size, HSA timing, drug coverage, spouse coverage, and official next steps." />
    <div className="container max-w-6xl space-y-10 py-10 md:py-16">
      <ContentFreshness lastReviewedAt={TURNING_65_LAST_REVIEWED} rulesEffectiveAt="2026-07-12" nextReviewAt="2026-10-01" timeSensitive reviewScope="Official Medicare.gov enrollment timing, active-employment, HSA, creditable drug coverage, and Medigap timing resources." />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Important limitations">
        <Card><CardHeader><ShieldCheck className="h-6 w-6 text-primary" /><CardTitle className="text-lg">Qualified pathway</CardTitle><CardDescription>The result organizes questions and deadlines; it does not approve delaying Part A or Part B.</CardDescription></CardHeader></Card>
        <Card><CardHeader><FileText className="h-6 w-6 text-primary" /><CardTitle className="text-lg">Controlling documents</CardTitle><CardDescription>Medicare, Social Security, employer plan documents, and written creditable-coverage notices control.</CardDescription></CardHeader></Card>
        <Card><CardHeader><AlertTriangle className="h-6 w-6 text-primary" /><CardTitle className="text-lg">No sensitive data</CardTitle><CardDescription>Do not enter Social Security, Medicare, member, claim, medical-record, or account numbers.</CardDescription></CardHeader></Card>
      </section>

      {!showResult && <Card className="rounded-[2rem] shadow-card"><CardHeader><CardTitle className="font-display text-2xl md:text-3xl">Build the timeline</CardTitle><CardDescription>Use broad information. “Not sure” is better than guessing.</CardDescription></CardHeader><CardContent className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-bold">Birth month</span><input className={inputClass} type="number" min="1" max="12" inputMode="numeric" value={answers.birthMonth ?? ""} onChange={(event) => set("birthMonth", event.target.value ? Number(event.target.value) : null)} placeholder="1–12" /></label>
        <label className="space-y-2"><span className="text-sm font-bold">Birth year</span><input className={inputClass} type="number" min="1900" max="2100" inputMode="numeric" value={answers.birthYear ?? ""} onChange={(event) => set("birthYear", event.target.value ? Number(event.target.value) : null)} placeholder="Example: 1961" /></label>
        <SelectField label="Already enrolled in any part of Medicare?" value={answers.alreadyEnrolled} options={ynu} onChange={(value) => set("alreadyEnrolled", value as YesNoUnknown)} />
        <SelectField label="Current coverage source" value={answers.coverageSource} onChange={(value) => set("coverageSource", value as CoverageSource)} options={[["unknown", "Not sure"], ["active-employer", "My or my spouse's current active-employment plan"], ["marketplace", "Marketplace"], ["cobra", "COBRA"], ["retiree", "Retiree coverage"], ["medicaid", "Medicaid"], ["va-tricare", "VA, CHAMPVA, or TRICARE"], ["none", "No current coverage"], ["other", "Other"]]} />
        <SelectField label="Is the coverage based on current active employment?" value={answers.activeEmployment} options={ynu} onChange={(value) => set("activeEmployment", value as YesNoUnknown)} />
        <SelectField label="Approximate employer size" value={answers.employerSize} onChange={(value) => set("employerSize", value as EmployerSize)} options={[["unknown", "Not sure"], ["20-plus", "20 or more employees"], ["under-20", "Fewer than 20 employees"], ["not-applicable", "Not applicable"]]} helper="The employer or plan should confirm the controlling Medicare coordination count." />
        <SelectField label="Will active employment or coverage end soon?" value={answers.employmentEndingSoon} options={ynu} onChange={(value) => set("employmentEndingSoon", value as YesNoUnknown)} />
        <SelectField label="Are employee or employer HSA contributions continuing?" value={answers.hsaContributing} options={ynu} onChange={(value) => set("hsaContributing", value as YesNoUnknown)} />
        <SelectField label="Could spouse or dependent coverage be affected?" value={answers.spouseCoverageConcern} options={ynu} onChange={(value) => set("spouseCoverageConcern", value as YesNoUnknown)} />
        <SelectField label="Current prescription coverage status" value={answers.drugCoverage} onChange={(value) => set("drugCoverage", value as DrugCoverage)} options={[["unknown", "Not sure if it is creditable"], ["creditable", "Written notice says creditable"], ["not-creditable", "Written notice says not creditable"], ["none", "No drug coverage"]]} />
        <SelectField label="Current coverage preference" value={answers.preference} onChange={(value) => set("preference", value as MedicarePreference)} options={[["undecided", "Undecided"], ["original", "Original Medicare, possibly with Medigap and Part D"], ["advantage", "Medicare Advantage"]]} />
        <SelectField label="Should the result include limited-income help?" value={answers.limitedIncomeHelp} options={ynu} onChange={(value) => set("limitedIncomeHelp", value as YesNoUnknown)} />
        <label className="space-y-2"><span className="text-sm font-bold">State abbreviation</span><input className={inputClass} maxLength={2} value={answers.stateCode} onChange={(event) => set("stateCode", event.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2))} placeholder="NC" /></label>
        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row"><Button type="button" variant="hero" onClick={buildPlan}>Build qualified timeline <ArrowRight className="h-4 w-4" /></Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" />Reset</Button></div>
      </CardContent></Card>}

      {showResult && <section id="turning-65-print-result" ref={resultRef} tabIndex={-1} className="space-y-6 outline-none" aria-live="polite">
        <ImmediateAnswer title={plan.headline}>{plan.immediateAnswer}</ImmediateAnswer>
        <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="button" variant="hero" onClick={copy}><Copy className="h-4 w-4" />{copied ? "Copied" : "Copy plan"}</Button><Button type="button" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button><SaveToMyPlanAction onSave={save} saved={saved} /><Button type="button" variant="ghost" onClick={() => setShowResult(false)}>Review answers</Button></div>
        <ActionPlanSection items={plan.doNow} />
        <Card className="shadow-card"><CardHeader><CardTitle className="font-display text-2xl">Dated timeline</CardTitle></CardHeader><CardContent className="space-y-3">{plan.timeline.map((item) => <div key={`${item.timing}-${item.action}`} className="rounded-2xl border border-border p-4"><div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{item.timing}</div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.action}</p></div>)}</CardContent></Card>
        <div className="grid gap-5 lg:grid-cols-2"><ResultList title="What can wait" items={plan.canWait} /><ResultList title="Documents to gather" items={plan.documents} /><ResultList title="Questions for the employer or current plan" items={plan.employerQuestions} /><ResultList title="Official actions" items={plan.officialActions} /></div>
        <Card className="border-amber-200 bg-amber-50 shadow-card"><CardHeader><CardTitle className="font-display text-2xl text-amber-950">Warnings to resolve before acting</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-amber-950/85">{plan.warnings.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />{item}</li>)}</ul></CardContent></Card>
        <OfficialVerificationPanel links={TURNING_65_SOURCES.map((source) => ({ label: source.label, url: source.url, description: source.description }))} />
      </section>}
    </div>
  </>;
}
