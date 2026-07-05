import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning, CalculatorNextSteps } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { trackSiteEvent } from "@/lib/siteAnalytics";

type NextStep = {
  label: string;
  href: string;
  helper?: string;
};

const ChecklistTool = ({
  items,
  completeText,
  incompleteText,
  nextSteps,
  analyticsId,
  analyticsLabel,
}: {
  items: string[];
  completeText: string;
  incompleteText: string;
  nextSteps?: NextStep[];
  analyticsId?: string;
  analyticsLabel?: string;
}) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const hasTrackedStart = useRef(false);
  const hasTrackedComplete = useRef(false);
  const done = useMemo(() => items.filter((item) => checked[item]).length, [checked, items]);
  const percent = Math.round((done / items.length) * 100);

  useEffect(() => {
    if (!analyticsId || done === 0 || hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackSiteEvent("checklist_start", {
      event_category: "tools",
      tool_id: analyticsId,
      tool_label: analyticsLabel,
    });
  }, [analyticsId, analyticsLabel, done]);

  useEffect(() => {
    if (!analyticsId || done !== items.length || hasTrackedComplete.current) return;
    hasTrackedComplete.current = true;
    trackSiteEvent("checklist_complete", {
      event_category: "tools",
      tool_id: analyticsId,
      tool_label: analyticsLabel,
      item_count: items.length,
    });
  }, [analyticsId, analyticsLabel, done, items.length]);

  const handlePrint = () => {
    if (analyticsId) {
      trackSiteEvent("checklist_print", {
        event_category: "tools",
        tool_id: analyticsId,
        tool_label: analyticsLabel,
      });
    }
    window.print();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-3">
        {items.map((item, index) => (
          <label key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-border"
              checked={Boolean(checked[item])}
              onChange={(event) => setChecked((current) => ({ ...current, [item]: event.target.checked }))}
            />
            <span><strong className="text-foreground">{index + 1}.</strong> {item}</span>
          </label>
        ))}
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Checklist completion" value={`${percent}%`} emphasis="primary" />
        <CalculatorResult label="Items completed" value={`${done} of ${items.length}`} />
        <CalculatorMeaning>{done === items.length ? completeText : incompleteText}</CalculatorMeaning>
        {nextSteps && <CalculatorNextSteps steps={nextSteps} />}
        <button type="button" className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted" onClick={handlePrint}>
          Print this checklist
        </button>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export const HospitalBillChecklistTool = () => (
  <ChecklistTool
    analyticsId="hospital-bill-checklist"
    analyticsLabel="Hospital Bill Review Checklist"
    items={[
      "Wait for the insurer explanation when possible before paying a large balance.",
      "Match the bill to the same date of service, person, provider, and account or claim reference.",
      "Request an itemized bill if the balance is large, confusing, or unexpected.",
      "Compare billed charge, allowed amount, insurance payment, adjustments, and patient responsibility.",
      "Ask whether every related claim from the visit has been processed.",
      "Ask if financial assistance, charity care, or a payment plan is available before paying in full.",
      "Save dates, names, confirmation numbers, and screenshots from calls or portal messages.",
    ]}
    completeText="Good. This is the minimum paper trail before paying a confusing medical bill."
    incompleteText="Finish the checklist before treating the bill as final, especially if the balance is large or surprising."
    nextSteps={[
      { label: "Match the bill to the EOB", href: "/tools/eob-to-bill-match-checker", helper: "Use the EOB checker before deciding the balance is final." },
      { label: "Read the medical bill toolkit", href: "/insurance/medical-bill-review-toolkit", helper: "Use the full guide for billing calls and documentation." },
      { label: "Check financial assistance", href: "/tools#financial-assistance-checklist", helper: "Large hospital bills should be screened before paying in full." },
    ]}
  />
);

export const EobBillMatchChecker = () => (
  <ChecklistTool
    analyticsId="eob-bill-match"
    analyticsLabel="EOB-to-Bill Match Checker"
    items={[
      "The person listed on both documents matches.",
      "The date of service matches.",
      "The provider, facility, lab, imaging center, or clinician group matches.",
      "The billed charge can be tied to the claim shown by the insurer.",
      "The allowed amount or adjustment is reflected clearly.",
      "Insurance payment matches or the explanation clearly says why nothing was paid.",
      "The requested payment does not exceed the insurer-listed patient responsibility unless there is a clear explanation.",
      "Any denial, network issue, or authorization problem has been explained before payment.",
    ]}
    completeText="Good. The documents appear ready for a final payment decision or a focused billing call."
    incompleteText="Do not pay automatically yet. A mismatch is a reason to ask the provider billing office and insurer for clarification."
    nextSteps={[
      { label: "Read how to interpret an EOB", href: "/articles/how-to-read-an-eob", helper: "Use this when the insurer language is the confusing part." },
      { label: "Estimate remaining OOP max", href: "/tools/out-of-pocket-max-estimator", helper: "Check whether this claim changes your yearly cost ceiling." },
      { label: "Open the insurance hub", href: "/insurance", helper: "Find the next guide for bills, plans, prescriptions, or authorizations." },
    ]}
  />
);

export const FinancialAssistanceChecklist = () => (
  <ChecklistTool
    analyticsId="financial-assistance-checklist"
    analyticsLabel="Financial Assistance Checklist"
    items={[
      "Find the hospital financial assistance or charity care policy.",
      "Check whether the hospital has a written plain-language policy.",
      "Ask for application instructions before paying in full.",
      "Gather income, household size, insurance, and bill information requested by the application.",
      "Ask whether discounts can apply to current bills and recently paid bills.",
      "Ask what happens while an application is being reviewed.",
      "Save the submitted application, upload confirmation, mailed receipt, or case number.",
    ]}
    completeText="Good. This gives the household a better chance of checking assistance before money leaves the account."
    incompleteText="Financial assistance should be checked before a large hospital bill is paid in full."
    nextSteps={[
      { label: "Review the full bill toolkit", href: "/insurance/medical-bill-review-toolkit", helper: "Pair assistance screening with itemized bill and EOB checks." },
      { label: "Use the EOB-to-bill checker", href: "/tools/eob-to-bill-match-checker", helper: "Confirm the billed amount lines up before payment planning." },
    ]}
  />
);

export const OpenEnrollmentChecklistTool = () => (
  <ChecklistTool
    analyticsId="open-enrollment-checklist"
    analyticsLabel="Open Enrollment Final Checklist"
    items={[
      "Compare premiums over the full year, not only per paycheck.",
      "Compare expected-year cost and worst-case out-of-pocket exposure.",
      "Check every recurring medication, formulary tier, pharmacy rule, and authorization requirement.",
      "Verify doctors, hospitals, specialists, labs, imaging, urgent care, mental health, and pharmacies.",
      "Compare spouse, children, and family coverage across both employers when relevant.",
      "Decide HSA, FSA, HRA, and dependent care FSA elections using predictable expenses.",
      "Review disability, life insurance, and supplemental policy annual costs.",
      "Run paycheck impact before submitting elections.",
      "Update beneficiaries and save confirmation screenshots.",
    ]}
    completeText="Good. This is a complete open enrollment submission check."
    incompleteText="Open enrollment choices often lock in for a year. Finish the remaining checks before submitting."
    nextSteps={[
      { label: "Compare two plans by total cost", href: "/tools/open-enrollment-true-cost-calculator", helper: "Run the plan comparison before submitting elections." },
      { label: "Estimate paycheck impact", href: "/tools#paycheck-impact", helper: "Check the take-home pay effect before the first paycheck surprise." },
      { label: "Return to the open enrollment guide", href: "/open-enrollment", helper: "Use the full ordered path if anything is still unresolved." },
    ]}
  />
);
