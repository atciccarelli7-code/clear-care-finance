import { useMemo, useState } from "react";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const ChecklistTool = ({
  items,
  completeText,
  incompleteText,
}: {
  items: string[];
  completeText: string;
  incompleteText: string;
}) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = useMemo(() => items.filter((item) => checked[item]).length, [checked, items]);
  const percent = Math.round((done / items.length) * 100);

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
        <button type="button" className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted" onClick={() => window.print()}>
          Print this checklist
        </button>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export const HospitalBillChecklistTool = () => (
  <ChecklistTool
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
  />
);

export const EobBillMatchChecker = () => (
  <ChecklistTool
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
  />
);

export const FinancialAssistanceChecklist = () => (
  <ChecklistTool
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
  />
);

export const OpenEnrollmentChecklistTool = () => (
  <ChecklistTool
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
  />
);
