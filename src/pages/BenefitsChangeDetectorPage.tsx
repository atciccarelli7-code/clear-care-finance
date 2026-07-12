import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarPlus, CheckCircle2, ClipboardCopy, Download, ExternalLink, FileCheck2, Printer, RotateCcw, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import {
  BENEFIT_CHANGE_STATES,
  BENEFIT_GROUP_LABELS,
  BENEFIT_TAXONOMY,
  BENEFITS_CHANGE_CANONICAL_PATH,
  buildBenefitsChangeReceipt,
  completeBenefitsReview,
  createBenefitsReceiptText,
  createBenefitsReview,
  createBenefitsReviewCalendar,
  deleteBenefitsReview,
  loadBenefitsReview,
  saveBenefitsReview,
  setBenefitsReminderDate,
  type BenefitChangeState,
  type BenefitGroup,
  type BenefitPriority,
  type BenefitsReview,
} from "@/lib/benefitsChangeDetector";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { useSeo } from "@/lib/seo";

const groups = Object.keys(BENEFIT_GROUP_LABELS) as BenefitGroup[];
const stateLabels: Record<BenefitChangeState, string> = {
  increased: "Increased",
  decreased: "Decreased",
  added: "Added",
  removed: "Removed",
  unchanged: "Unchanged",
  changed_unclear: "Changed, but effect unclear",
  not_reviewed: "Not reviewed",
  not_offered: "Not offered",
  not_sure: "Not sure",
};
const priorityLabels: Record<BenefitPriority, string> = {
  review_first: "Review first",
  verify_before_enrolling: "Verify before enrolling",
  lower_apparent_priority: "Lower apparent priority",
  still_incomplete: "Still incomplete",
};

const completionBand = (review: BenefitsReview) => {
  const count = Object.keys(review.selections).length;
  if (review.completedAt) return "complete" as const;
  return count ? "partial" as const : "started" as const;
};

const BenefitsChangeDetectorPage = () => {
  const [initialReview] = useState(() => loadBenefitsReview());
  const [review, setReview] = useState<BenefitsReview>(() => initialReview ?? createBenefitsReview());
  const [groupIndex, setGroupIndex] = useState(0);
  const [showReceipt, setShowReceipt] = useState(() => Boolean(initialReview?.completedAt));
  const [statusMessage, setStatusMessage] = useState("");
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const resumedRef = useRef(false);
  const currentGroup = groups[groupIndex];
  const currentItems = BENEFIT_TAXONOMY.filter((item) => item.group === currentGroup);
  const receipt = useMemo(() => buildBenefitsChangeReceipt(review), [review]);
  const reviewedCount = Object.values(review.selections).filter((state) => state !== "not_reviewed").length;
  const canonicalUrl = `https://communityacquiredfinance.com${BENEFITS_CHANGE_CANONICAL_PATH}`;

  useSeo({
    title: "Benefits Change Detector: Review Open Enrollment Changes",
    description: "Find the workplace benefit changes that deserve attention, generate questions for HR, and create a private annual Benefits Change Receipt.",
    canonicalPath: BENEFITS_CHANGE_CANONICAL_PATH,
  });

  useEffect(() => {
    if (initialReview && Object.keys(initialReview.selections).length && !resumedRef.current) {
      resumedRef.current = true;
      trackGrowthEvent("benefits_review_resumed", { entry_surface: "detector", completion_band: completionBand(initialReview) });
    }
  }, [initialReview]);

  useEffect(() => {
    if (showReceipt) resultHeadingRef.current?.focus();
  }, [showReceipt]);

  const updateSelection = (id: string, state: BenefitChangeState) => {
    const firstSelection = Object.keys(review.selections).length === 0;
    const next = saveBenefitsReview({ ...review, selections: { ...review.selections, [id]: state }, completedAt: undefined });
    setReview(next);
    if (firstSelection) trackGrowthEvent("benefits_review_started", { entry_surface: "detector", completion_band: "started" });
  };

  const finish = () => {
    const next = completeBenefitsReview(review);
    setReview(next);
    setShowReceipt(true);
    trackGrowthEvent("benefits_review_completed", { entry_surface: "detector", completion_band: "complete" });
    trackGrowthEvent("benefits_receipt_viewed", { entry_surface: "receipt", completion_band: "complete", receipt_action: "view" });
  };

  const copyReceipt = async () => {
    await navigator.clipboard.writeText(createBenefitsReceiptText(receipt));
    setStatusMessage("Receipt copied. It includes only the review summary you chose to copy.");
    trackGrowthEvent("benefits_receipt_copied", { entry_surface: "receipt", receipt_action: "copy", completion_band: "complete" });
  };

  const printReceipt = () => {
    trackGrowthEvent("benefits_receipt_printed", { entry_surface: "receipt", receipt_action: "print", completion_band: "complete" });
    window.print();
  };

  const copyCanonicalLink = async () => {
    await navigator.clipboard.writeText(canonicalUrl);
    setStatusMessage("Canonical public tool link copied. No answers, dates, or local state are in the link.");
    trackGrowthEvent("benefits_canonical_link_shared", { entry_surface: "receipt", receipt_action: "share", completion_band: "complete" });
  };

  const downloadCalendar = () => {
    if (!review.reminderDate) {
      setStatusMessage("Choose a reminder date first. The date stays in this browser and the downloaded calendar file.");
      return;
    }
    const blob = new Blob([createBenefitsReviewCalendar(review.reminderDate)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "caf-annual-benefits-review.ics";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Calendar file created locally. The chosen date was not transmitted.");
    trackGrowthEvent("benefits_calendar_created", { entry_surface: "receipt", receipt_action: "calendar", completion_band: "complete" });
  };

  const resetReview = () => {
    const next = saveBenefitsReview(createBenefitsReview(review.reviewYear));
    setReview(next);
    setShowReceipt(false);
    setGroupIndex(0);
    setStatusMessage("Review reset. A blank local review remains available.");
    trackGrowthEvent("benefits_review_reset", { entry_surface: "detector", receipt_action: "reset", completion_band: "started" });
  };

  const permanentlyDelete = () => {
    deleteBenefitsReview();
    setReview(createBenefitsReview());
    setShowReceipt(false);
    setGroupIndex(0);
    setStatusMessage("The local benefits review and reminder date were permanently deleted from this browser.");
    trackGrowthEvent("benefits_local_review_deleted", { entry_surface: "detector", receipt_action: "delete", completion_band: "started" });
  };

  return (
    <>
      <PageHero eyebrow="Annual workplace-benefits review" title="Find the benefit changes that deserve your attention before you re-enroll." description="Mark only what changed. CAF prioritizes the review, prepares verification questions, and creates a practical local Benefits Change Receipt without asking for employer, plan, or personal information." />

      <section className="container max-w-5xl py-10 md:py-14">
        <div className="mb-6 grid gap-3 rounded-2xl border border-primary/20 bg-primary-soft/20 p-5 md:grid-cols-3">
          <div><div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Privacy</div><p className="mt-1 text-sm text-muted-foreground">Answers stay in this browser. Do not enter names, identifiers, medications, diagnoses, or unrestricted notes.</p></div>
          <div><div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Progress</div><p className="mt-1 text-sm text-muted-foreground">{reviewedCount} areas reviewed · section {groupIndex + 1} of {groups.length}</p></div>
          <label><span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Review year</span><select aria-label="Review year" value={review.reviewYear} onChange={(event) => setReview(saveBenefitsReview({ ...review, reviewYear: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">{[new Date().getFullYear(), new Date().getFullYear() + 1].map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
        </div>

        {!showReceipt ? (
          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Section {groupIndex + 1} of {groups.length}</div><h2 className="mt-1 font-display text-2xl font-bold">{BENEFIT_GROUP_LABELS[currentGroup]}</h2><p className="mt-2 text-sm text-muted-foreground">Select a controlled change state only. “Not reviewed” keeps the area visible as incomplete.</p></div>
              <div className="text-sm font-semibold text-muted-foreground">{currentItems.filter((item) => review.selections[item.id]).length} of {currentItems.length} marked</div>
            </div>
            <div className="mt-6 space-y-3">
              {currentItems.map((item) => (
                <label key={item.id} className="grid gap-3 rounded-2xl border border-border bg-background/70 p-4 md:grid-cols-[1fr_260px] md:items-center">
                  <span><span className="block font-semibold">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Compare the current enrollment materials with the prior year when available.</span></span>
                  <select aria-label={`${item.label} change`} value={review.selections[item.id] ?? ""} onChange={(event) => updateSelection(item.id, event.target.value as BenefitChangeState)} className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm">
                    <option value="" disabled>Select change state</option>
                    {BENEFIT_CHANGE_STATES.map((state) => <option key={state} value={state}>{stateLabels[state]}</option>)}
                  </select>
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setGroupIndex((index) => Math.max(index - 1, 0))} disabled={groupIndex === 0}><ArrowLeft className="h-4 w-4" /> Previous</Button>
              {groupIndex < groups.length - 1 ? <Button type="button" onClick={() => setGroupIndex((index) => Math.min(index + 1, groups.length - 1))}>Next section <ArrowRight className="h-4 w-4" /></Button> : <Button type="button" variant="hero" onClick={finish} disabled={!Object.keys(review.selections).length}>Create Benefits Change Receipt <FileCheck2 className="h-4 w-4" /></Button>}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <article className="rounded-[2rem] border border-primary/25 bg-card p-5 shadow-card md:p-8" aria-labelledby="benefits-receipt-heading">
              <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">CAF Decision Receipt</div><h2 id="benefits-receipt-heading" ref={resultHeadingRef} tabIndex={-1} className="mt-1 font-display text-3xl font-bold outline-none">Benefits Change Receipt</h2><p className="mt-2 text-sm text-muted-foreground">Effective year {receipt.reviewYear} · reviewed {receipt.reviewDate} · {receipt.reviewedCount} areas reviewed</p></div><div className="rounded-full border border-primary/20 bg-primary-soft/30 px-4 py-2 text-sm font-bold text-primary">Local to this browser</div></div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {(["review_first", "verify_before_enrolling", "lower_apparent_priority", "still_incomplete"] as BenefitPriority[]).map((priority) => (
                  <section key={priority} className="rounded-2xl border border-border p-5"><h3 className="font-display text-xl font-bold">{priorityLabels[priority]}</h3>{receipt.priorities[priority].length ? <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{receipt.priorities[priority].map((item) => <li key={item.id}><span className="font-semibold text-foreground">{item.label}:</span> {stateLabels[item.state]}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No reviewed item is in this group.</p>}</section>
                ))}
              </div>

              <section className="mt-6 rounded-2xl border border-border bg-muted/20 p-5"><h3 className="font-display text-xl font-bold">Questions for HR or the plan administrator</h3>{receipt.unresolvedQuestions.length ? <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{receipt.unresolvedQuestions.map((question) => <li key={question}>{question}</li>)}</ol> : <p className="mt-3 text-sm text-muted-foreground">No unresolved question was generated. Still confirm the final elections and controlling documents.</p>}</section>
              <div className="mt-6 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-border p-5"><h3 className="font-display text-lg font-bold">Documents and sections to verify</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{(receipt.documentsToVerify.length ? receipt.documentsToVerify : ["Current enrollment guide and controlling plan documents"]).map((item) => <li key={item}>• {item}</li>)}</ul></section><section className="rounded-2xl border border-border p-5"><h3 className="font-display text-lg font-bold">Final enrollment checklist</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{receipt.finalChecklist.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></section></div>

              <div className="mt-6 flex flex-col gap-2 print:hidden sm:flex-row sm:flex-wrap"><Button type="button" onClick={copyReceipt}><ClipboardCopy className="h-4 w-4" /> Copy Receipt</Button><Button type="button" variant="outline" onClick={printReceipt}><Printer className="h-4 w-4" /> Print</Button><Button type="button" variant="outline" onClick={copyCanonicalLink}><Share2 className="h-4 w-4" /> Copy safe public link</Button></div>
            </article>

            <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-7 print:hidden" aria-labelledby="calendar-return-heading"><div className="flex items-start gap-3"><CalendarPlus className="mt-1 h-5 w-5 text-primary" /><div><h2 id="calendar-return-heading" className="font-display text-2xl font-bold">Create a private calendar return</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Choose an annual review or enrollment reminder date. The calendar file is created locally; the date is not placed in analytics, the URL, or a server request.</p></div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1"><span className="text-sm font-bold">Local reminder date</span><input type="date" value={review.reminderDate ?? ""} onChange={(event) => setReview(setBenefitsReminderDate(review, event.target.value))} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label><Button type="button" onClick={downloadCalendar}><Download className="h-4 w-4" /> Download calendar file</Button>{review.reminderDate && <Button type="button" variant="ghost" onClick={() => setReview(setBenefitsReminderDate(review))}>Clear date</Button>}</div></section>

            <SaveNavigatorAction recommendationId="benefits_action_plan" sourceRoute={BENEFITS_CHANGE_CANONICAL_PATH} title="Keep the benefits review in My Plan" description="Only the existing fixed benefits-review action is saved. Change states, categories, dates, and Receipt contents stay outside My Plan." />

            <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-7 print:hidden"><h2 className="font-display text-2xl font-bold">Continue into the right CAF journey</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{[
              ["benefits_command_center", "Benefits Command Center", "/tools/benefits-command-center"],
              ["health_plan_cost", "Health Plan True Cost Calculator", "/tools/open-enrollment-true-cost-calculator"],
              ["benefits_blueprint", "Benefits Blueprint", "/tools/healthcare-worker-benefits-blueprint"],
              ["employer_action_plan", "Employer Benefits Action Plan", "/tools/employer-benefits-action-plan"],
              ["retirement_403b", "403(b) Paycheck Calculator", "/tools/403b-paycheck-calculator"],
              ["roth_traditional", "Roth vs Traditional Helper", "/tools/roth-vs-traditional-decision-helper"],
              ["childcare_benefits", "Childcare Benefits Guide", "/tools/childcare-benefits-decision-guide"],
              ["open_enrollment", "Open Enrollment Education", "/open-enrollment"],
            ].map(([id, label, href]) => <Link key={id} to={href} onClick={() => trackGrowthEvent("benefits_related_journey_opened", { entry_surface: "receipt", handoff_id: id })} className="flex min-h-12 items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-bold hover:border-primary/30">{label}<ExternalLink className="h-4 w-4 text-primary" /></Link>)}</div></section>

            <DisclaimerBox />
            <div className="flex flex-col gap-2 border-t border-border pt-5 print:hidden sm:flex-row"><Button type="button" variant="outline" onClick={() => setShowReceipt(false)}><ArrowLeft className="h-4 w-4" /> Continue review</Button><Button type="button" variant="ghost" onClick={resetReview}><RotateCcw className="h-4 w-4" /> Reset review</Button><Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={permanentlyDelete}><Trash2 className="h-4 w-4" /> Permanently delete local review</Button></div>
          </div>
        )}

        {statusMessage && <p className="mt-5 rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground" role="status" aria-live="polite">{statusMessage}</p>}
      </section>
    </>
  );
};

export default BenefitsChangeDetectorPage;
