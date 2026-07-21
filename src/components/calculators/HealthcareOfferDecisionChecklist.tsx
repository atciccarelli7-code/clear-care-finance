import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  Printer,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";

const STORAGE_KEY = "caf-healthcare-offer-verification-v1";
const TOOL_ID = "healthcare_worker_total_compensation";
const JOURNEY_KEY = "healthcare_offer_verification";

type VerificationItem = {
  id: string;
  title: string;
  detail: string;
  group: "Pay" | "Benefits" | "Schedule and risk";
};

const verificationItems: VerificationItem[] = [
  {
    id: "written-base-pay",
    title: "Base pay and pay frequency are in writing",
    detail: "Confirm the hourly rate or annual salary, pay periods, guaranteed hours, and effective date.",
    group: "Pay",
  },
  {
    id: "overtime-classification",
    title: "Overtime eligibility and calculation are clear",
    detail: "Verify exempt or non-exempt status, the overtime threshold, multiplier, and which hours or payments count.",
    group: "Pay",
  },
  {
    id: "differentials-and-bonuses",
    title: "Differentials, call pay, holiday pay, and bonuses are documented",
    detail: "Separate guaranteed compensation from discretionary, conditional, or shift-dependent amounts.",
    group: "Pay",
  },
  {
    id: "sign-on-terms",
    title: "Sign-on or retention payment terms are understood",
    detail: "Confirm payment dates, service commitment, repayment triggers, and whether repayment is prorated.",
    group: "Pay",
  },
  {
    id: "retirement-rules",
    title: "Retirement contribution and vesting rules are verified",
    detail: "Check the match or non-elective contribution, eligible compensation, waiting period, and vesting schedule.",
    group: "Benefits",
  },
  {
    id: "coverage-premiums",
    title: "Insurance premiums match the coverage tier you need",
    detail: "Use the employee-only, employee-plus-spouse, employee-plus-child, or family rate that actually applies.",
    group: "Benefits",
  },
  {
    id: "coverage-exposure",
    title: "Health-plan exposure and access are reviewed",
    detail: "Confirm deductible, out-of-pocket maximum, network, prescriptions, HSA eligibility, and employer HSA or HRA funding.",
    group: "Benefits",
  },
  {
    id: "pto-and-holidays",
    title: "PTO, holiday, and leave rules are documented",
    detail: "Check accrual, waiting periods, carryover, payout, holiday requirements, and any unpaid orientation or leave periods.",
    group: "Benefits",
  },
  {
    id: "schedule-and-call",
    title: "Schedule, weekends, holidays, call, floating, and travel are clear",
    detail: "Confirm what is required, how often it occurs, how schedules change, and whether travel time or callback time is paid.",
    group: "Schedule and risk",
  },
  {
    id: "start-and-contingencies",
    title: "Start date and employment contingencies are confirmed",
    detail: "Verify credentialing, background checks, occupational health requirements, orientation, probationary terms, and start-date dependencies.",
    group: "Schedule and risk",
  },
  {
    id: "work-costs",
    title: "Commute, parking, travel reimbursement, and required expenses are known",
    detail: "Account for recurring costs, mileage rules, licensing, certifications, uniforms, equipment, and unpaid travel or administrative time.",
    group: "Schedule and risk",
  },
  {
    id: "resignation-timing",
    title: "The written offer is final before notice is given",
    detail: "Confirm the accepted offer, contingencies, start date, and any required approvals before resigning from the current role.",
    group: "Schedule and risk",
  },
];

const itemIds = new Set(verificationItems.map((item) => item.id));

const readStoredPlan = () => {
  if (typeof window === "undefined") return [] as string[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { completed?: unknown } | null;
    if (!parsed || !Array.isArray(parsed.completed)) return [];
    return parsed.completed.filter((id): id is string => typeof id === "string" && itemIds.has(id));
  } catch {
    return [];
  }
};

const buildPlanText = (completedIds: string[]) => {
  const completed = new Set(completedIds);
  const lines = verificationItems.map((item) => `${completed.has(item.id) ? "[x]" : "[ ]"} ${item.title}\n    ${item.detail}`);

  return [
    "Healthcare Offer Verification Plan",
    `Generated ${new Date().toLocaleDateString()}`,
    "",
    `Progress: ${completedIds.length} of ${verificationItems.length} items verified`,
    "",
    ...lines,
    "",
    "Do not resign based only on a verbal offer or calculator result. Confirm the final written offer, unresolved contingencies, and start date before giving notice.",
    "Educational planning aid only. Employer documents and written terms control.",
  ].join("\n");
};

export const HealthcareOfferDecisionChecklist = () => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const startedRef = useRef(false);
  const completedTrackedRef = useRef(false);
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completionPercent = Math.round((completedIds.length / verificationItems.length) * 100);
  const allComplete = completedIds.length === verificationItems.length;

  useEffect(() => {
    trackJourneyEvent("journey_viewed", {
      journey_key: JOURNEY_KEY,
      surface: "destination",
      phase: "build_action_plan",
      variant: "fixed_verification_checklist",
    });

    const storedPlan = readStoredPlan();
    if (storedPlan.length > 0) {
      startedRef.current = true;
      setCompletedIds(storedPlan);
      trackJourneyEvent("journey_resume_clicked", {
        journey_key: JOURNEY_KEY,
        surface: "destination",
        phase: "build_action_plan",
        variant: "saved_on_device",
      });
    }
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completed: completedIds }));
    } catch {
      // The checklist remains usable when local storage is unavailable.
    }

    if (allComplete && !completedTrackedRef.current) {
      completedTrackedRef.current = true;
      trackJourneyEvent("journey_result_reached", {
        journey_key: JOURNEY_KEY,
        surface: "destination",
        phase: "result",
        variant: "verification_complete",
      });
    }

    if (!allComplete) completedTrackedRef.current = false;
  }, [allComplete, completedIds, storageLoaded]);

  const toggleItem = (item: VerificationItem, index: number) => {
    const willComplete = !completedSet.has(item.id);

    if (!startedRef.current) {
      startedRef.current = true;
      trackJourneyEvent("journey_started", {
        journey_key: JOURNEY_KEY,
        surface: "destination",
        phase: "build_action_plan",
        variant: "fixed_verification_checklist",
      });
    }

    setCompletedIds((current) => willComplete ? [...current, item.id] : current.filter((id) => id !== item.id));

    if (willComplete) {
      trackJourneyEvent("journey_step_completed", {
        journey_key: JOURNEY_KEY,
        surface: "destination",
        phase: item.group === "Schedule and risk" ? "verify_officially" : "build_action_plan",
        step_index: index,
        variant: item.group.toLowerCase().replace(/\s+/g, "_"),
      });
    }
  };

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(buildPlanText(completedIds));
      setCopied(true);
      trackJourneyEvent("journey_result_copied", {
        journey_key: JOURNEY_KEY,
        surface: "destination",
        phase: "result",
        variant: "verification_plan",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const downloadPlan = () => {
    const blob = new Blob([buildPlanText(completedIds)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "healthcare-offer-verification-plan.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    trackSiteEvent("tool_result_downloaded", {
      event_category: "tools",
      tool_id: TOOL_ID,
      artifact: "verification_plan",
    });
  };

  const printPlan = () => {
    trackJourneyEvent("journey_result_printed", {
      journey_key: JOURNEY_KEY,
      surface: "destination",
      phase: "result",
      variant: "verification_plan",
    });
    window.print();
  };

  const clearPlan = () => {
    if (completedIds.length > 0 && !window.confirm("Clear the healthcare offer verification plan saved on this device?")) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // State can still be cleared in memory.
    }
    startedRef.current = false;
    completedTrackedRef.current = false;
    setCompletedIds([]);
    trackJourneyEvent("journey_restarted", {
      journey_key: JOURNEY_KEY,
      surface: "destination",
      phase: "build_action_plan",
      variant: "clear_local_plan",
    });
  };

  const groups = ["Pay", "Benefits", "Schedule and risk"] as const;

  return (
    <section aria-labelledby="offer-verification-title" className="space-y-6 rounded-3xl border border-border bg-card p-5 shadow-card md:p-8 print:border-0 print:p-0 print:shadow-none">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Prepare before accepting</div>
          <h2 id="offer-verification-title" className="mt-2 font-display text-2xl font-bold md:text-3xl">Build the written verification plan before you resign</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">A compensation estimate is only as reliable as the written terms behind it. Check each item against the offer, plan documents, recruiter answers, or HR confirmation. Progress is stored only in this browser.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button type="button" variant="outline" onClick={copyPlan}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy plan"}</Button>
          <Button type="button" variant="outline" onClick={downloadPlan}><Download className="h-4 w-4" /> Download</Button>
          <Button type="button" variant="outline" onClick={printPlan}><Printer className="h-4 w-4" /> Print or PDF</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Verification progress</div>
            <div className="mt-1 font-display text-2xl font-bold">{completedIds.length} of {verificationItems.length} confirmed</div>
          </div>
          <div className="text-sm font-bold text-primary">{completionPercent}%</div>
        </div>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Healthcare offer verification progress"
          aria-valuemin={0}
          aria-valuemax={verificationItems.length}
          aria-valuenow={completedIds.length}
        >
          <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-5 dark:bg-amber-950/10">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <h3 className="font-display text-lg font-bold">Do not resign until the final written offer is verified</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A verbal offer, projected start date, recruiter estimate, or calculator result is not the final employment agreement. Confirm unresolved contingencies, the accepted written terms, and the start date before giving notice.</p>
          </div>
        </div>
      </div>

      <div className="space-y-7">
        {groups.map((group) => (
          <fieldset key={group} className="space-y-3">
            <legend className="font-display text-xl font-bold">{group}</legend>
            <div className="grid gap-3">
              {verificationItems.filter((item) => item.group === group).map((item) => {
                const index = verificationItems.findIndex((candidate) => candidate.id === item.id);
                const checked = completedSet.has(item.id);
                return (
                  <label key={item.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${checked ? "border-primary/30 bg-primary-soft/30" : "border-border bg-background hover:border-primary/25"}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item, index)}
                      className="mt-1 h-5 w-5 shrink-0 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.detail}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {allComplete ? (
        <div className="rounded-2xl border border-primary/30 bg-primary-soft/35 p-5" role="status">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-display text-lg font-bold">All verification items are marked complete</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Recheck the final documents if the offer, start date, schedule, coverage, or compensation changes. Keep a copy of the accepted offer and important plan materials.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-muted/25 p-5">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Next action:</strong> start with the written offer and benefits rate sheet. Mark an item only after the controlling document or responsible employer representative confirms it.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <Button type="button" variant="ghost" onClick={clearPlan}><RotateCcw className="h-4 w-4" /> Clear local plan</Button>
        <Button asChild variant="outline">
          <Link
            to="/tools/healthcare-worker-benefits-blueprint"
            onClick={() => trackJourneyEvent("journey_handoff_opened", {
              journey_key: JOURNEY_KEY,
              surface: "destination",
              phase: "handoff",
              variant: "benefits_blueprint",
            })}
          >
            Review the benefits package <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Privacy:</strong> this checklist stores only fixed completion markers on this device. It does not store employer names, compensation figures, health-plan selections, or notes, and those values are not sent through checklist analytics.</p>
    </section>
  );
};

export default HealthcareOfferDecisionChecklist;
