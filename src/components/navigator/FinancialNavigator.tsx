import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ClipboardCheck,
  Copy,
  HeartPulse,
  PiggyBank,
  Printer,
  RotateCcw,
  ShieldCheck,
  Trash2,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import {
  NAVIGATOR_PATHS,
  NAVIGATOR_PLAN_UPDATED_EVENT,
  NAVIGATOR_QUESTIONS,
  clearNavigatorPlan,
  createNavigatorPlanSummary,
  generateNavigatorPlan,
  getStoredPlanRecommendations,
  loadStoredNavigatorPlan,
  removeNavigatorAction,
  saveNavigatorPlan,
  setNavigatorActionCompleted,
  type NavigatorPath,
  type NavigatorPlan,
  type NavigatorRecommendation,
  type PlanPriority,
  type StoredNavigatorPlan,
} from "@/lib/financialNavigator";

const pathwayIcons = {
  wealth: PiggyBank,
  workplace_benefits: WalletCards,
  healthcare_costs: HeartPulse,
  healthcare_career: BriefcaseBusiness,
} satisfies Record<NavigatorPath, typeof PiggyBank>;

const priorityContent: Record<PlanPriority, { label: string; description: string }> = {
  do_now: {
    label: "Do now",
    description: "Protect the deadline, stabilize the foundation, or clarify the decision first.",
  },
  do_next: {
    label: "Do next",
    description: "Use the right tool, comparison, or checklist to move the decision forward.",
  },
  learn_later: {
    label: "Learn later",
    description: "Build useful knowledge without distracting from today’s priority.",
  },
};

const priorityOrder: PlanPriority[] = ["do_now", "do_next", "learn_later"];

const recommendationCountBucket = (count: number) => {
  if (count <= 5) return "one_to_five";
  if (count <= 8) return "six_to_eight";
  return "nine_plus";
};

const focusAndScroll = (element: HTMLElement | null) => {
  if (!element) return;
  element.focus({ preventScroll: true });
  const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView?.({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
};

const RecommendationCard = ({
  recommendation,
  completed,
  onToggle,
  onRemove,
}: {
  recommendation: NavigatorRecommendation;
  completed: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) => (
  <article
    className={`break-inside-avoid rounded-3xl border p-5 shadow-card transition-smooth print:shadow-none md:p-6 ${
      completed ? "border-emerald-200 bg-emerald-50/70" : "border-border bg-card"
    }`}
  >
    <div className="flex items-start gap-4">
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 print:hidden ${
          completed
            ? "border-emerald-300 bg-emerald-600 text-white"
            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
        }`}
        aria-label={completed ? `Mark ${recommendation.title} incomplete` : `Mark ${recommendation.title} complete`}
        aria-pressed={completed}
      >
        <Check className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary">
            {recommendation.type.replace("_", " ")}
          </span>
          {completed && <span className="text-xs font-bold text-emerald-700">Completed</span>}
        </div>
        <h4 className="mt-3 font-display text-lg font-bold leading-tight text-foreground">{recommendation.title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{recommendation.reason}</p>
        {recommendation.caution && (
          <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
            <strong>Verify:</strong> {recommendation.caution}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center print:hidden">
          <Button asChild variant={completed ? "outline" : "default"}>
            <Link
              to={recommendation.destinationPath}
              onClick={() =>
                trackSiteEvent("navigator_recommendation_opened", {
                  event_category: "navigator",
                  recommendation_id: recommendation.fixedAnalyticsId,
                  recommendation_type: recommendation.type,
                  priority_group: recommendation.priority,
                  destination_path: recommendation.destinationPath,
                })
              }
            >
              {recommendation.actionText} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
        <p className="mt-4 hidden break-all text-xs text-muted-foreground print:block">
          communityacquiredfinance.com{recommendation.destinationPath}
        </p>
      </div>
    </div>
  </article>
);

export const FinancialNavigator = () => {
  const [pathway, setPathway] = useState<NavigatorPath | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<NavigatorPlan | null>(null);
  const [storedPlan, setStoredPlan] = useState<StoredNavigatorPlan | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  const pathwaysHeadingRef = useRef<HTMLHeadingElement>(null);
  const intakeHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const refresh = () => setStoredPlan(loadStoredNavigatorPlan());
    refresh();
    window.addEventListener(NAVIGATOR_PLAN_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(NAVIGATOR_PLAN_UPDATED_EVENT, refresh);
  }, []);

  useEffect(() => {
    trackSiteEvent("navigator_opened", { event_category: "navigator", source_route: "/start-here" });
  }, []);

  const questions = pathway ? NAVIGATOR_QUESTIONS[pathway] : [];
  const currentQuestion = questions[stepIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progress = questions.length ? Math.round(((stepIndex + 1) / questions.length) * 100) : 0;
  const storedRecommendations = useMemo(() => getStoredPlanRecommendations(storedPlan), [storedPlan]);
  const recommendationsByPriority = useMemo(() => {
    const grouped: Record<PlanPriority, NavigatorRecommendation[]> = {
      do_now: [],
      do_next: [],
      learn_later: [],
    };
    storedRecommendations.forEach((recommendation) => grouped[recommendation.priority].push(recommendation));
    return grouped;
  }, [storedRecommendations]);
  const completedCount = storedPlan?.completedActionIds.length ?? 0;
  const planProgress = storedPlan?.actionIds.length ? Math.round((completedCount / storedPlan.actionIds.length) * 100) : 0;

  useEffect(() => {
    if (pathway && currentQuestion && !generatedPlan) focusAndScroll(intakeHeadingRef.current);
  }, [currentQuestion, generatedPlan, pathway, stepIndex]);

  useEffect(() => {
    if (generatedPlan) focusAndScroll(resultsHeadingRef.current);
  }, [generatedPlan]);

  const returnToPathways = () => {
    setPathway(null);
    setAnswers({});
    setStepIndex(0);
    setGeneratedPlan(null);
    setCopyMessage("");
    window.requestAnimationFrame(() => focusAndScroll(pathwaysHeadingRef.current));
  };

  const selectPathway = (nextPathway: NavigatorPath) => {
    setPathway(nextPathway);
    setAnswers({});
    setStepIndex(0);
    setGeneratedPlan(null);
    setCopyMessage("");
    trackSiteEvent("navigator_path_selected", {
      event_category: "navigator",
      pathway_id: nextPathway,
      source_route: "/start-here",
    });
  };

  const restart = () => {
    trackSiteEvent("navigator_restarted", { event_category: "navigator" });
    returnToPathways();
  };

  const nextStep = () => {
    if (!pathway || !currentQuestion || !selectedAnswer) return;

    trackSiteEvent("navigator_step_completed", {
      event_category: "navigator",
      pathway_id: pathway,
      step_id: currentQuestion.id,
    });

    if (stepIndex < questions.length - 1) {
      setStepIndex((index) => index + 1);
      return;
    }

    const plan = generateNavigatorPlan(pathway, answers);
    const saved = saveNavigatorPlan(plan);
    setGeneratedPlan(plan);
    setStoredPlan(saved);
    trackSiteEvent("navigator_completed", { event_category: "navigator", pathway_id: pathway });
    trackSiteEvent("navigator_plan_generated", {
      event_category: "navigator",
      pathway_id: pathway,
      completion_bucket: recommendationCountBucket(plan.recommendations.length),
    });
  };

  const previousStep = () => {
    if (stepIndex === 0) {
      returnToPathways();
      return;
    }

    setStepIndex((index) => index - 1);
    trackSiteEvent("navigator_back_used", {
      event_category: "navigator",
      pathway_id: pathway ?? "unknown",
      step_id: currentQuestion?.id,
    });
  };

  const toggleAction = (recommendation: NavigatorRecommendation) => {
    const completed = storedPlan?.completedActionIds.includes(recommendation.id) ?? false;
    const updated = setNavigatorActionCompleted(recommendation.id, !completed);
    setStoredPlan(updated);
    trackSiteEvent(completed ? "my_plan_action_reopened" : "my_plan_action_completed", {
      event_category: "navigator",
      recommendation_id: recommendation.fixedAnalyticsId,
      pathway_id: recommendation.pathway,
    });
  };

  const removeAction = (recommendation: NavigatorRecommendation) => {
    const updated = removeNavigatorAction(recommendation.id);
    setStoredPlan(updated);
    trackSiteEvent("my_plan_action_removed", {
      event_category: "navigator",
      recommendation_id: recommendation.fixedAnalyticsId,
      pathway_id: recommendation.pathway,
    });
  };

  const copyPlan = async () => {
    if (!storedPlan) return;
    const summary = createNavigatorPlanSummary(storedPlan);
    try {
      await window.navigator.clipboard.writeText(summary);
      setCopyMessage("Plan copied to your clipboard.");
      trackSiteEvent("my_plan_copied", {
        event_category: "navigator",
        export_type: "text",
        export_result: "success",
      });
    } catch {
      setCopyMessage("Copy was blocked by the browser. Use Print to save the plan instead.");
      trackSiteEvent("my_plan_copied", {
        event_category: "navigator",
        export_type: "text",
        export_result: "blocked",
      });
    }
  };

  const printPlan = () => {
    trackSiteEvent("my_plan_printed", { event_category: "navigator", export_type: "browser_print" });
    window.print();
  };

  const clearPlan = () => {
    if (!window.confirm("Clear every saved Financial Navigator action from this browser?")) return;
    clearNavigatorPlan();
    setStoredPlan(null);
    trackSiteEvent("my_plan_cleared", { event_category: "navigator" });
    returnToPathways();
  };

  return (
    <>
      <div className="print:hidden">
        <PageHero
          eyebrow="CAF Financial Navigator"
          title="Build a practical plan for the financial decision in front of you."
          description="Answer a few plain-English questions. The Navigator organizes the most useful tools, guides, official verification steps, and next actions into one private plan."
        >
          <Button asChild variant="hero" size="lg">
            <a href="#navigator-paths">
              Build my plan <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#my-plan">Open My Plan</a>
          </Button>
        </PageHero>
      </div>

      <div className="container space-y-16 py-12 print:space-y-6 print:py-0 md:space-y-20 md:py-16">
        <section className="grid gap-4 print:hidden sm:grid-cols-3" aria-label="Navigator product standards">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-display text-lg font-bold">Private by design</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No account is required. Broad intake choices and saved actions remain on this device; typed financial or medical details are not requested.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-display text-lg font-bold">Consistent plan rules</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The same choices produce the same plan. Every recommendation follows a reviewable rule instead of a hidden or improvised answer.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <ArrowRight className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-display text-lg font-bold">Built for action</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Each plan separates what to do now, what tool to use next, what to learn later, and what must be verified officially.
            </p>
          </div>
        </section>

        <section id="navigator-paths" className="scroll-mt-24 print:hidden" aria-labelledby="navigator-paths-heading">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-foreground">Choose the decision</span>
            <h2
              ref={pathwaysHeadingRef}
              id="navigator-paths-heading"
              tabIndex={-1}
              className="mt-4 scroll-mt-24 font-display text-3xl font-bold tracking-tight outline-none md:text-4xl"
            >
              What are you trying to solve right now?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Start with the closest pathway. Most plans take about two minutes and use five or six questions.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {(Object.entries(NAVIGATOR_PATHS) as Array<[NavigatorPath, (typeof NAVIGATOR_PATHS)[NavigatorPath]]>).map(([id, content]) => {
              const Icon = pathwayIcons[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectPathway(id)}
                  className="group rounded-[2rem] border border-border bg-card p-6 text-left shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/35 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 md:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold leading-tight">{content.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{content.description}</p>
                  <p className="mt-4 text-xs font-semibold leading-relaxed text-muted-foreground">{content.examples}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                    Start this plan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {pathway && currentQuestion && !generatedPlan && (
          <section id="navigator-intake" className="scroll-mt-24 rounded-[2rem] border border-border bg-card p-5 shadow-card print:hidden md:p-8 lg:p-10" aria-labelledby="navigator-question-heading">
            <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{NAVIGATOR_PATHS[pathway].label}</span>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">Question {stepIndex + 1} of {questions.length}</p>
              </div>
              <button
                type="button"
                onClick={restart}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCcw className="h-4 w-4" /> Change pathway
              </button>
            </div>

            <div
              className="mt-6"
              role="progressbar"
              aria-label="Navigator question progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-valuetext={`Question ${stepIndex + 1} of ${questions.length}`}
            >
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <fieldset className="mt-8">
              <legend className="sr-only">{currentQuestion.prompt}</legend>
              <h2
                ref={intakeHeadingRef}
                id="navigator-question-heading"
                tabIndex={-1}
                className="scroll-mt-24 font-display text-2xl font-bold leading-tight outline-none md:text-3xl"
              >
                {currentQuestion.prompt}
              </h2>
              {currentQuestion.help && (
                <p id={`navigator-help-${currentQuestion.id}`} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {currentQuestion.help}
                </p>
              )}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option) => {
                  const selected = selectedAnswer === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-smooth focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                        selected
                          ? "border-primary bg-primary-soft text-foreground ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/35 hover:bg-muted/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option.id}
                        checked={selected}
                        onChange={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))}
                        aria-describedby={currentQuestion.help ? `navigator-help-${currentQuestion.id}` : undefined}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 bg-background"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold leading-snug">{option.label}</span>
                        {option.description && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.description}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={previousStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="button" disabled={!selectedAnswer} onClick={nextStep}>
                {stepIndex === questions.length - 1 ? "Build my plan" : "Continue"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {generatedPlan && (
          <section id="navigator-results" className="scroll-mt-24 print:hidden" aria-labelledby="navigator-results-heading">
            <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/35 p-6 shadow-card md:p-9">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Plan saved locally</span>
                  <h2
                    ref={resultsHeadingRef}
                    id="navigator-results-heading"
                    tabIndex={-1}
                    className="mt-3 scroll-mt-24 font-display text-3xl font-bold tracking-tight outline-none md:text-4xl"
                  >
                    Your plan is ready
                  </h2>
                  <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                    {generatedPlan.objectiveLabel} produced {generatedPlan.recommendations.length} prioritized actions. Review and manage them once in My Plan below.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button asChild>
                    <a href="#my-plan">View My Plan</a>
                  </Button>
                  <Button type="button" variant="outline" onClick={restart}>
                    <RotateCcw className="h-4 w-4" /> Build another plan
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="my-plan" className="scroll-mt-24 rounded-[2rem] border border-border bg-muted/25 p-5 shadow-card print:border-0 print:bg-white print:p-0 print:shadow-none md:p-8 lg:p-10" aria-labelledby="my-plan-heading">
          <div className="flex flex-col gap-6 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Saved on this device</span>
              <h2 id="my-plan-heading" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">My Plan</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                Saved actions remain in this browser. There is no account, cloud sync, or server-side plan storage.
              </p>
              {storedPlan && <p className="mt-2 text-sm font-semibold text-foreground">Current focus: {storedPlan.objectiveLabel}</p>}
            </div>
            {storedPlan && (
              <div className="min-w-[14rem] rounded-2xl border border-border bg-card p-4 shadow-sm print:shadow-none">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Plan progress</span>
                  <span>{planProgress}%</span>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label="My Plan completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={planProgress}
                  aria-valuetext={`${completedCount} of ${storedPlan.actionIds.length} actions completed`}
                >
                  <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${planProgress}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{completedCount} of {storedPlan.actionIds.length} actions completed</p>
              </div>
            )}
          </div>

          {!storedPlan ? (
            <div className="py-12 text-center print:hidden">
              <ClipboardCheck className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-5 font-display text-2xl font-bold">No saved actions yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Build a Navigator plan above or add a contextual action from a participating tool, guide, or hub.
              </p>
              <Button asChild className="mt-6">
                <a href="#navigator-paths">Choose a pathway</a>
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-10">
                {priorityOrder.map((priority) => {
                  const items = recommendationsByPriority[priority];
                  if (!items.length) return null;
                  return (
                    <section key={priority} aria-labelledby={`my-plan-${priority}`}>
                      <div className="mb-5 max-w-3xl">
                        <h3 id={`my-plan-${priority}`} className="font-display text-2xl font-bold">{priorityContent[priority].label}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{priorityContent[priority].description}</p>
                      </div>
                      <div className="grid gap-5 lg:grid-cols-2">
                        {items.map((recommendation) => (
                          <RecommendationCard
                            key={recommendation.id}
                            recommendation={recommendation}
                            completed={storedPlan.completedActionIds.includes(recommendation.id)}
                            onToggle={() => toggleAction(recommendation)}
                            onRemove={() => removeAction(recommendation)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 print:hidden sm:flex-row sm:flex-wrap">
                <Button type="button" variant="outline" onClick={copyPlan}>
                  <Copy className="h-4 w-4" /> Copy plan
                </Button>
                <Button type="button" variant="outline" onClick={printPlan}>
                  <Printer className="h-4 w-4" /> Print or save PDF
                </Button>
                <Button type="button" variant="ghost" onClick={clearPlan}>
                  <Trash2 className="h-4 w-4" /> Clear local plan
                </Button>
              </div>
              {copyMessage && (
                <p className="mt-4 text-sm font-semibold text-primary print:hidden" role="status" aria-live="polite">
                  {copyMessage}
                </p>
              )}
            </>
          )}
        </section>

        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950 print:hidden md:p-8">
          <h2 className="font-display text-2xl font-bold">The Navigator organizes decisions; it does not make official determinations.</h2>
          <p className="mt-3">
            Community Acquired Finance provides general educational information. It is not individualized financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice. Verify material decisions using current plan documents, official agencies, employers, insurers, billing offices, written notices, and qualified professionals.
          </p>
        </section>
      </div>
    </>
  );
};
