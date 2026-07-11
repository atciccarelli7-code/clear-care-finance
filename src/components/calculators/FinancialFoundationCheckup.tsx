import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  History,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import {
  DEFAULT_FOUNDATION_INPUTS,
  calculateFinancialFoundation,
  clearFinancialFoundationSnapshots,
  loadFinancialFoundationSnapshots,
  saveFinancialFoundationSnapshot,
  type FinancialFoundationInputs,
  type FinancialFoundationResult,
  type FinancialFoundationSnapshot,
  type FoundationDomainStatus,
} from "@/lib/financialFoundationCheckup";
import { addNavigatorAction, getNavigatorRecommendation } from "@/lib/financialNavigator";

const selectClass = "h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";
const inputClass = "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const debtOptions = [
  ["none", "No high-cost debt"],
  ["under_8", "Highest rate is below 8%"],
  ["eight_to_fifteen", "Highest rate is 8% to 15%"],
  ["over_15", "Highest rate is above 15%"],
  ["unsure", "I am not sure"],
] as const;

const matchOptions = [
  ["full", "Receiving the full employer match"],
  ["partial", "Contributing, but below the full match"],
  ["not_contributing", "Not contributing"],
  ["not_offered", "No workplace plan or employer match"],
  ["unsure", "I am not sure"],
] as const;

const automationOptions = [
  ["none", "No recurring saving or investing"],
  ["irregular", "Occasional or irregular transfers"],
  ["under_ten", "Usually below 10% of income"],
  ["ten_to_twenty", "Usually 10% to 20%"],
  ["over_twenty", "Usually above 20%"],
  ["unsure", "I am not sure"],
] as const;

const protectionOptions = [
  ["reviewed", "Reviewed within the last year or after a major life change"],
  ["partial", "Some items reviewed, but gaps remain"],
  ["due", "Review is overdue"],
  ["unsure", "I am not sure"],
] as const;

const plannedExpenseOptions = [
  ["none", "No major planned expense in the next 12 months"],
  ["funded", "A major expense is planned and funded"],
  ["partly_funded", "A major expense is only partly funded"],
  ["unfunded", "A major expense is not funded"],
  ["unsure", "I am not sure"],
] as const;

const statusStyles: Record<FoundationDomainStatus, string> = {
  strong: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
  building: "border-amber-200 bg-amber-50/70 text-amber-950",
  priority: "border-rose-200 bg-rose-50/70 text-rose-950",
};

const statusLabels: Record<FoundationDomainStatus, string> = {
  strong: "Strong",
  building: "Building",
  priority: "Priority",
};

const scoreBucketLabel = (score: number) => {
  if (score >= 85) return "Strong foundation";
  if (score >= 65) return "Building well";
  if (score >= 45) return "Focused attention";
  return "Stabilize first";
};

const formatDate = (iso: string) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(iso));

const formatMoney = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format(value);

const latestInputs = (snapshots: FinancialFoundationSnapshot[]) => snapshots[0]?.inputs ?? DEFAULT_FOUNDATION_INPUTS;

export const FinancialFoundationCheckup = () => {
  const [snapshots, setSnapshots] = useState<FinancialFoundationSnapshot[]>(() => loadFinancialFoundationSnapshots());
  const [inputs, setInputs] = useState<FinancialFoundationInputs>(() => latestInputs(loadFinancialFoundationSnapshots()));
  const [result, setResult] = useState<FinancialFoundationResult | null>(null);
  const [comparisonSnapshot, setComparisonSnapshot] = useState<FinancialFoundationSnapshot | null>(null);
  const [addedActionIds, setAddedActionIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const recommendations = useMemo(
    () => result?.recommendedActionIds.flatMap((id) => {
      const recommendation = getNavigatorRecommendation(id);
      return recommendation ? [recommendation] : [];
    }) ?? [],
    [result],
  );

  useEffect(() => {
    if (!result) return;
    resultsHeadingRef.current?.focus({ preventScroll: true });
    resultsHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackSiteEvent("foundation_checkup_started", {
      event_category: "foundation_checkup",
      returning_visit: snapshots.length > 0,
    });
  };

  const updateNumber = (key: "monthlyEssentialExpenses" | "liquidSavings", value: string) => {
    markStarted();
    const parsed = Number(value);
    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
    }));
  };

  const updateChoice = <K extends Exclude<keyof FinancialFoundationInputs, "monthlyEssentialExpenses" | "liquidSavings">>(
    key: K,
    value: FinancialFoundationInputs[K],
  ) => {
    markStarted();
    setInputs((current) => ({ ...current, [key]: value }));
  };

  const submitCheckup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markStarted();
    if (inputs.monthlyEssentialExpenses <= 0) {
      setError("Enter monthly essential expenses so the checkup can calculate cash runway.");
      return;
    }

    const nextResult = calculateFinancialFoundation(inputs);
    const previousSnapshot = snapshots[0] ?? null;
    const snapshot = saveFinancialFoundationSnapshot(inputs, nextResult);
    setComparisonSnapshot(previousSnapshot);
    setSnapshots((current) => [snapshot, ...current].slice(0, 8));
    setResult(nextResult);
    setAddedActionIds([]);
    setError("");

    trackSiteEvent("foundation_checkup_completed", {
      event_category: "foundation_checkup",
      score_bucket: nextResult.scoreBucket,
      runway_bucket: nextResult.runwayBucket,
      recommendation_count: nextResult.recommendedActionIds.length,
      returning_visit: Boolean(previousSnapshot),
    });
  };

  const addAction = (recommendationId: string) => {
    const outcome = addNavigatorAction(recommendationId);
    setAddedActionIds((current) => current.includes(recommendationId) ? current : [...current, recommendationId]);
    trackSiteEvent("foundation_checkup_action_added", {
      event_category: "foundation_checkup",
      recommendation_id: recommendationId,
      action_state: outcome.added ? "added" : "already_saved",
    });
  };

  const addEveryAction = () => {
    recommendations.forEach((recommendation) => addAction(recommendation.id));
  };

  const resetForm = () => {
    setInputs(DEFAULT_FOUNDATION_INPUTS);
    setResult(null);
    setComparisonSnapshot(null);
    setAddedActionIds([]);
    setError("");
    setStarted(false);
    trackSiteEvent("foundation_checkup_restarted", { event_category: "foundation_checkup" });
  };

  const clearHistory = () => {
    if (!window.confirm("Clear every saved Financial Foundation Checkup from this browser?")) return;
    clearFinancialFoundationSnapshots();
    setSnapshots([]);
    setComparisonSnapshot(null);
    trackSiteEvent("foundation_checkup_history_cleared", { event_category: "foundation_checkup" });
  };

  const scoreDelta = result && comparisonSnapshot ? result.score - comparisonSnapshot.score : null;
  const runwayDelta = result?.runwayMonths !== null && result?.runwayMonths !== undefined && comparisonSnapshot?.runwayMonths !== null && comparisonSnapshot?.runwayMonths !== undefined
    ? Math.round((result.runwayMonths - comparisonSnapshot.runwayMonths) * 10) / 10
    : null;

  return (
    <section id="financial-foundation-checkup" className="scroll-mt-24 border-t border-border bg-card/35 py-14 md:py-20" aria-labelledby="foundation-checkup-heading">
      <div className="container min-w-0">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <TrendingUp className="h-3.5 w-3.5" /> Repeat every 90 days
              </div>
              <h2 id="foundation-checkup-heading" className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Measure the financial foundation beneath every other goal.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Get a transparent score across cash resilience, costly debt, employer retirement capture, savings consistency, and protection review. Return later to see whether the foundation is actually improving.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  [LockKeyhole, "Private local history", "Inputs and snapshots stay in this browser. No account or bank connection is required."],
                  [ClipboardCheck, "Actionable output", "Weak domains become specific next steps that can be saved into My Plan."],
                  [ShieldCheck, "No mystery score", "Every point is tied to a visible domain and a documented scoring range."],
                ].map(([Icon, title, body]) => {
                  const ItemIcon = Icon as typeof LockKeyhole;
                  return (
                    <div key={title as string} className="flex gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm">
                      <ItemIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-foreground">{title as string}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body as string}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={submitCheckup} className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8" noValidate>
              <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Financial Foundation Checkup</div>
                  <h3 className="mt-2 font-display text-2xl font-bold">Enter broad planning numbers</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use reasonable estimates. Do not enter account numbers, employer names, or identifying information.</p>
                </div>
                <Button type="button" variant="ghost" onClick={resetForm} className="shrink-0">
                  <RotateCcw className="h-4 w-4" /> Start fresh
                </Button>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Monthly essential expenses</span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">Housing, utilities, groceries, insurance, transportation, minimum debt payments, and other necessities.</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">$</span>
                    <input
                      className={`${inputClass} pl-8`}
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={inputs.monthlyEssentialExpenses || ""}
                      onChange={(event) => updateNumber("monthlyEssentialExpenses", event.target.value)}
                      aria-describedby="essential-expenses-help"
                    />
                  </div>
                  <span id="essential-expenses-help" className="sr-only">Required to calculate cash runway.</span>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Liquid savings available for emergencies</span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">Cash that could be accessed without selling long-term investments or using credit.</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">$</span>
                    <input
                      className={`${inputClass} pl-8`}
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={inputs.liquidSavings || ""}
                      onChange={(event) => updateNumber("liquidSavings", event.target.value)}
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Highest non-mortgage interest-rate band</span>
                  <select className={selectClass} value={inputs.debtAprBand} onChange={(event) => updateChoice("debtAprBand", event.target.value as FinancialFoundationInputs["debtAprBand"])}>
                    {debtOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Employer retirement match status</span>
                  <select className={selectClass} value={inputs.retirementMatchStatus} onChange={(event) => updateChoice("retirementMatchStatus", event.target.value as FinancialFoundationInputs["retirementMatchStatus"])}>
                    {matchOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Recurring savings and investing system</span>
                  <select className={selectClass} value={inputs.savingsAutomationBand} onChange={(event) => updateChoice("savingsAutomationBand", event.target.value as FinancialFoundationInputs["savingsAutomationBand"])}>
                    {automationOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Protection and beneficiary review</span>
                  <select className={selectClass} value={inputs.protectionReviewStatus} onChange={(event) => updateChoice("protectionReviewStatus", event.target.value as FinancialFoundationInputs["protectionReviewStatus"])}>
                    {protectionOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-foreground">Large planned expense within 12 months</span>
                  <select className={selectClass} value={inputs.plannedExpenseStatus} onChange={(event) => updateChoice("plannedExpenseStatus", event.target.value as FinancialFoundationInputs["plannedExpenseStatus"])}>
                    {plannedExpenseOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>

              {error && <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900" role="alert">{error}</p>}

              <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-muted-foreground">Educational planning tool. The score is not a credit score, fiduciary assessment, or individualized recommendation.</p>
                <Button type="submit" size="lg" className="shrink-0">
                  Run my checkup <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {result && (
            <section className="mt-12 scroll-mt-24" aria-labelledby="foundation-results-heading">
              <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-6 shadow-card md:p-9">
                <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                  <div className="rounded-3xl border border-primary/15 bg-card p-6 text-center shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Foundation score</div>
                    <div className="mt-3 font-display text-6xl font-extrabold tracking-tight text-foreground">{result.score}</div>
                    <div className="mt-1 text-sm font-semibold text-muted-foreground">out of 100</div>
                    <div className="mt-4 rounded-full bg-primary-soft px-4 py-2 text-sm font-bold text-primary">{result.statusLabel}</div>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                      <Sparkles className="h-4 w-4" /> Your current baseline
                    </div>
                    <h3 ref={resultsHeadingRef} id="foundation-results-heading" tabIndex={-1} className="mt-3 scroll-mt-24 font-display text-3xl font-bold tracking-tight outline-none md:text-4xl">
                      {scoreBucketLabel(result.score)}
                    </h3>
                    <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{result.summary}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Cash runway</div>
                        <div className="mt-2 font-display text-2xl font-bold">{result.runwayMonths === null ? "—" : `${result.runwayMonths.toFixed(1)} mo`}</div>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Monthly essentials</div>
                        <div className="mt-2 font-display text-2xl font-bold">{formatMoney(inputs.monthlyEssentialExpenses)}</div>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Next actions</div>
                        <div className="mt-2 font-display text-2xl font-bold">{recommendations.length}</div>
                      </div>
                    </div>
                    {scoreDelta !== null && (
                      <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                        <strong className="text-foreground">Compared with {formatDate(comparisonSnapshot!.savedAt)}:</strong>{" "}
                        score {scoreDelta >= 0 ? "rose" : "fell"} by {Math.abs(scoreDelta)} point{Math.abs(scoreDelta) === 1 ? "" : "s"}
                        {runwayDelta !== null ? ` and cash runway ${runwayDelta >= 0 ? "increased" : "decreased"} by ${Math.abs(runwayDelta).toFixed(1)} month${Math.abs(runwayDelta) === 1 ? "" : "s"}.` : "."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {result.domains.map((domain) => (
                  <article key={domain.id} className={`rounded-3xl border p-5 shadow-sm ${statusStyles[domain.status]}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.14em]">{statusLabels[domain.status]}</span>
                      <span className="text-sm font-bold">{domain.score}/{domain.maxScore}</span>
                    </div>
                    <h4 className="mt-4 font-display text-lg font-bold leading-tight">{domain.label}</h4>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70" role="progressbar" aria-label={`${domain.label} score`} aria-valuemin={0} aria-valuemax={domain.maxScore} aria-valuenow={domain.score}>
                      <div className="h-full rounded-full bg-current opacity-70" style={{ width: `${(domain.score / domain.maxScore) * 100}%` }} />
                    </div>
                    <p className="mt-4 text-xs leading-relaxed opacity-90">{domain.explanation}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
                <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Turn the score into action</div>
                    <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">Save the highest-leverage gaps into My Plan</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">These actions reuse the site’s existing deterministic Navigator recommendations. The checkup does not create a second competing plan system.</p>
                  </div>
                  <Button type="button" onClick={addEveryAction} disabled={!recommendations.length}>
                    <ClipboardCheck className="h-4 w-4" /> Add all to My Plan
                  </Button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {recommendations.map((recommendation) => {
                    const added = addedActionIds.includes(recommendation.id);
                    return (
                      <article key={recommendation.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{recommendation.priority.replaceAll("_", " ")}</div>
                        <h4 className="mt-2 font-display text-lg font-bold">{recommendation.title}</h4>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{recommendation.reason}</p>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <Button type="button" variant={added ? "outline" : "default"} onClick={() => addAction(recommendation.id)}>
                            {added ? <Check className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
                            {added ? "Saved to My Plan" : "Add to My Plan"}
                          </Button>
                          <Button asChild variant="ghost">
                            <Link to={recommendation.destinationPath}>{recommendation.actionText} <ArrowRight className="h-4 w-4" /></Link>
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-muted-foreground">My Plan remains local to this browser and can combine actions from other tools and guides.</p>
                  <Button asChild variant="outline">
                    <a href="#my-plan">Open My Plan</a>
                  </Button>
                </div>
              </div>
            </section>
          )}

          {snapshots.length > 0 && (
            <section className="mt-8 rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8" aria-labelledby="foundation-history-heading">
              <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                    <History className="h-4 w-4" /> Local progress history
                  </div>
                  <h3 id="foundation-history-heading" className="mt-2 font-display text-2xl font-bold">Your last {Math.min(snapshots.length, 8)} checkup{snapshots.length === 1 ? "" : "s"}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Up to eight snapshots are stored only in this browser. A future checkup can compare against the latest saved baseline.</p>
                </div>
                <Button type="button" variant="ghost" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4" /> Clear history
                </Button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="pb-3 pr-4 font-bold">Date</th>
                      <th className="pb-3 pr-4 font-bold">Score</th>
                      <th className="pb-3 pr-4 font-bold">Status</th>
                      <th className="pb-3 pr-4 font-bold">Cash runway</th>
                      <th className="pb-3 font-bold">Liquid savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {snapshots.map((snapshot) => (
                      <tr key={`${snapshot.savedAt}-${snapshot.score}`}>
                        <td className="py-4 pr-4 font-semibold text-foreground">{formatDate(snapshot.savedAt)}</td>
                        <td className="py-4 pr-4 font-display text-lg font-bold text-foreground">{snapshot.score}</td>
                        <td className="py-4 pr-4 text-muted-foreground">{scoreBucketLabel(snapshot.score)}</td>
                        <td className="py-4 pr-4 text-muted-foreground">{snapshot.runwayMonths === null ? "Not calculated" : `${snapshot.runwayMonths.toFixed(1)} months`}</td>
                        <td className="py-4 text-muted-foreground">{formatMoney(snapshot.inputs.liquidSavings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinancialFoundationCheckup;
