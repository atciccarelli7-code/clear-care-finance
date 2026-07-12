import { useRef, useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import { DecisionResultPanel, DecisionToolIntro, SelectQuestion, decisionResultToText } from "@/components/shared/DecisionResultPanel";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  buildChildcareResult,
  buildDebtRetirementResult,
  buildRothTraditionalResult,
  DEFAULT_CHILDCARE_ANSWERS,
  DEFAULT_DEBT_RETIREMENT_ANSWERS,
  DEFAULT_ROTH_TRADITIONAL_ANSWERS,
  type ChildcareAnswers,
  type DebtRetirementAnswers,
  type DecisionResult,
  type RothTraditionalAnswers,
} from "@/lib/roadmapDecisionTools";
import { useSeo } from "@/lib/seo";

const YES_NO_NOT_SURE = [
  { value: "not-sure", label: "Not sure" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const OfficialSources = ({ sources }: { sources: Array<{ label: string; href: string; note: string }> }) => (
  <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
      <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" /> Official verification
    </h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {sources.map((source) => (
        <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-background px-4 py-3 hover:border-primary/30">
          <span className="flex items-start justify-between gap-2 text-sm font-bold text-primary">{source.label}<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{source.note}</span>
        </a>
      ))}
    </div>
  </section>
);

const useQualifiedResult = <T,>(initial: T, build: (answers: T) => DecisionResult, officialNote: string) => {
  const [answers, setAnswers] = useState(initial);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof T>(key: K, value: T[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setResult(null);
    setCopied(false);
  };
  const generate = () => {
    setResult(build(answers));
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };
  const reset = () => {
    setAnswers(initial);
    setResult(null);
    setCopied(false);
  };
  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(decisionResultToText(result, officialNote));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return { answers, result, copied, resultRef, update, generate, reset, copy };
};

export const ChildcareBenefitsDecisionGuidePage = () => {
  useSeo({
    title: "Dependent Care FSA and Childcare Benefits Decision Guide",
    description: "Coordinate a 2026 Dependent Care FSA, employer childcare help, predictable expenses, and federal tax-credit questions without calculating an official tax result.",
    canonicalPath: "/tools/childcare-benefits-decision-guide",
  });
  const tool = useQualifiedResult(
    DEFAULT_CHILDCARE_ANSWERS,
    buildChildcareResult,
    "Verify the final result with the employer plan, Form 2441, current IRS guidance, and a qualified tax professional when household facts are complex.",
  );

  return (
    <>
      <PageHero eyebrow="2026 workplace-benefits decision" title="Dependent Care FSA and Childcare Benefits Decision Guide" description="Coordinate a Dependent Care FSA, employer childcare support, predictable care expenses, and federal tax-credit questions before open enrollment." />
      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <DecisionToolIntro><strong className="text-foreground">Broad categories only.</strong> Do not enter dependent names, provider names, tax identifiers, exact income, or care records. The 2026 federal dependent-care assistance ceiling increased, but the employer plan may offer less and the final tax result depends on current IRS instructions.</DecisionToolIntro>

        <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); tool.generate(); }}>
          <SelectQuestion id="childcare-filing" label="Expected filing-status category" helper="Filing status affects federal coordination. Choose Not sure instead of guessing." value={tool.answers.filingStatus} onChange={(value) => tool.update("filingStatus", value as ChildcareAnswers["filingStatus"])} options={[
            { value: "not-sure", label: "Not sure" },
            { value: "single-joint-head", label: "Single, head of household, qualifying surviving spouse, or married filing jointly" },
            { value: "married-separate", label: "Married filing separately" },
          ]} />
          <SelectQuestion id="childcare-work" label="Work or student-spouse situation" helper="Federal rules generally connect eligible care to work or looking for work, with limited special rules." value={tool.answers.workStatus} onChange={(value) => tool.update("workStatus", value as ChildcareAnswers["workStatus"])} options={[
            { value: "not-sure", label: "Not sure" },
            { value: "both-working", label: "The filer and spouse, when applicable, work or look for work" },
            { value: "student-or-disabled-spouse", label: "A spouse is a full-time student or not able to care for themselves" },
            { value: "one-not-working", label: "One spouse is not working and no exception is known" },
          ]} />
          <SelectQuestion id="childcare-fsa" label="Does the employer offer a Dependent Care FSA?" helper="A federal statutory ceiling does not require an employer to offer the benefit or use the full ceiling." value={tool.answers.employerFsa} onChange={(value) => tool.update("employerFsa", value as ChildcareAnswers["employerFsa"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="childcare-predictable" label="Are the work-related care expenses predictable?" helper="Predictability matters because unused elections may be forfeited under the employer plan." value={tool.answers.predictableExpenses} onChange={(value) => tool.update("predictableExpenses", value as ChildcareAnswers["predictableExpenses"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="childcare-expenses" label="Broad expected annual care-expense band" helper="Use a range; this tool does not need exact costs." value={tool.answers.expenseBand} onChange={(value) => tool.update("expenseBand", value as ChildcareAnswers["expenseBand"])} options={[
            { value: "not-sure", label: "Not sure" },
            { value: "under-3000", label: "Under $3,000" },
            { value: "3000-6000", label: "$3,000–$6,000" },
            { value: "6000-7500", label: "$6,000–$7,500" },
            { value: "over-7500", label: "More than $7,500" },
          ]} />
          <SelectQuestion id="childcare-other" label="Is other employer childcare help available?" helper="Examples include backup care, direct subsidy, on-site care, or reimbursement." value={tool.answers.otherEmployerHelp} onChange={(value) => tool.update("otherEmployerHelp", value as ChildcareAnswers["otherEmployerHelp"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="childcare-change" label="Is a midyear care or employment change likely?" helper="The employer plan controls whether a qualifying event permits an election change." value={tool.answers.midyearChangeLikely} onChange={(value) => tool.update("midyearChangeLikely", value as ChildcareAnswers["midyearChangeLikely"])} options={YES_NO_NOT_SURE} />
          <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="submit" size="lg">Build coordination plan</Button><Button type="button" variant="outline" size="lg" onClick={tool.reset}>Start over</Button></div>
        </form>

        {tool.result && <div ref={tool.resultRef} tabIndex={-1} className="outline-none"><DecisionResultPanel result={tool.result} copied={tool.copied} onCopy={tool.copy} onPrint={() => window.print()} onReset={tool.reset}>
          <OfficialSources sources={[
            { label: "IRS Publication 503", href: "https://www.irs.gov/publications/p503", note: "Detailed child and dependent care rules; the currently published edition covers 2025 returns and points readers to future developments." },
            { label: "IRS Form 2441", href: "https://www.irs.gov/forms-pubs/about-form-2441", note: "The filing form used to coordinate dependent-care benefits and the Child and Dependent Care Credit." },
            { label: "Public Law 119-21", href: "https://www.govinfo.gov/content/pkg/PLAW-119publ21/pdf/PLAW-119publ21.pdf", note: "Federal statutory source for the 2026 dependent-care assistance limit change." },
          ]} />
          <SaveNavigatorAction recommendationId="benefits_action_plan" sourceRoute="/tools/childcare-benefits-decision-guide" title="Save the childcare-benefits review" description="Only the existing fixed benefits-review action is saved. Filing status, expense band, and answers remain outside My Plan." />
        </DecisionResultPanel></div>}
        <DisclaimerBox />
      </div>
    </>
  );
};

export const RothTraditionalDecisionHelperPage = () => {
  useSeo({ title: "Roth vs Traditional Retirement Contribution Decision Helper", description: "Compare Roth and traditional contribution factors for a 403(b), 401(k), 457(b), or IRA without declaring a universal winner.", canonicalPath: "/tools/roth-vs-traditional-decision-helper" });
  const tool = useQualifiedResult(DEFAULT_ROTH_TRADITIONAL_ANSWERS, buildRothTraditionalResult, "Verify current tax rules, contribution limits, and plan features with official IRS guidance and the controlling plan document.");

  return (
    <>
      <PageHero eyebrow="Retirement tax decision" title="Roth vs Traditional Decision Helper" description="Compare current deduction value, possible future tax rates, cash flow, pension income, account mix, and retirement-access planning—without pretending one answer fits everyone." />
      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <DecisionToolIntro><strong className="text-foreground">Use broad tax categories.</strong> This tool does not need exact income, balances, employer identity, or tax-return data. Contribution amount and contribution tax treatment are evaluated as separate decisions.</DecisionToolIntro>
        <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); tool.generate(); }}>
          <SelectQuestion id="roth-current" label="Current marginal tax-rate band" helper="Think about the next contribution dollar, not the average rate on the full return." value={tool.answers.currentRate} onChange={(value) => tool.update("currentRate", value as RothTraditionalAnswers["currentRate"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "low", label: "Relatively low" }, { value: "middle", label: "Middle" }, { value: "high", label: "Relatively high" }]} />
          <SelectQuestion id="roth-future" label="Expected future tax-rate direction" helper="Future law and retirement income are uncertain; Not sure is a valid answer." value={tool.answers.futureRate} onChange={(value) => tool.update("futureRate", value as RothTraditionalAnswers["futureRate"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "lower", label: "Likely lower than today" }, { value: "similar", label: "Likely similar" }, { value: "higher", label: "Likely higher than today" }]} />
          <SelectQuestion id="roth-years" label="Approximate years until retirement" helper="Use the broad time horizon rather than an exact target date." value={tool.answers.yearsToRetirement} onChange={(value) => tool.update("yearsToRetirement", value as RothTraditionalAnswers["yearsToRetirement"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "under-10", label: "Under 10 years" }, { value: "10-25", label: "10–25 years" }, { value: "over-25", label: "More than 25 years" }]} />
          <SelectQuestion id="roth-cash" label="Current cash-flow position" helper="A tax deduction is less valuable if the contribution itself becomes unsustainable." value={tool.answers.cashFlow} onChange={(value) => tool.update("cashFlow", value as RothTraditionalAnswers["cashFlow"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "tight", label: "Tight; current deduction would help" }, { value: "comfortable", label: "Comfortable enough to pay tax now" }]} />
          <SelectQuestion id="roth-pension" label="Is meaningful pension income expected?" helper="A pension can occupy future tax brackets before retirement-account withdrawals." value={tool.answers.pension} onChange={(value) => tool.update("pension", value as RothTraditionalAnswers["pension"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="roth-mix" label="Current retirement tax mix" helper="Use the closest broad category; no balance is needed." value={tool.answers.currentMix} onChange={(value) => tool.update("currentMix", value as RothTraditionalAnswers["currentMix"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "mostly-pretax", label: "Mostly pre-tax" }, { value: "balanced", label: "Roughly balanced" }, { value: "mostly-roth", label: "Mostly Roth" }]} />
          <SelectQuestion id="roth-early" label="Is early retirement or a long pre-Medicare period part of the plan?" helper="Account-access and conversion planning can matter alongside tax rates." value={tool.answers.earlyRetirement} onChange={(value) => tool.update("earlyRetirement", value as RothTraditionalAnswers["earlyRetirement"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="roth-confidence" label="Confidence in the assumptions" helper="Low confidence is a reason to preserve tax diversification." value={tool.answers.confidence} onChange={(value) => tool.update("confidence", value as RothTraditionalAnswers["confidence"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "low", label: "Low" }, { value: "high", label: "High" }]} />
          <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="submit" size="lg">Compare contribution factors</Button><Button type="button" variant="outline" size="lg" onClick={tool.reset}>Start over</Button></div>
        </form>
        {tool.result && <div ref={tool.resultRef} tabIndex={-1} className="outline-none"><DecisionResultPanel result={tool.result} copied={tool.copied} onCopy={tool.copy} onPrint={() => window.print()} onReset={tool.reset}>
          <OfficialSources sources={[
            { label: "IRS contribution guidance", href: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions", note: "Official contribution-limit and plan-participation information." },
            { label: "IRS Roth comparison chart", href: "https://www.irs.gov/retirement-plans/roth-comparison-chart", note: "Official comparison of Roth features across retirement-account types." },
            { label: "403(b) paycheck calculator", href: "/tools/403b-paycheck-calculator", note: "Use the same total contribution amount to compare paycheck impact separately from tax treatment." },
          ]} />
          <SaveNavigatorAction recommendationId="wealth_403b" sourceRoute="/tools/roth-vs-traditional-decision-helper" title="Save the retirement contribution review" description="Only the fixed contribution-review action is saved. Tax bands, pension expectations, and account mix are not stored in My Plan." />
        </DecisionResultPanel></div>}
        <DisclaimerBox />
      </div>
    </>
  );
};

export const DebtVsRetirementRouterPage = () => {
  useSeo({ title: "Debt vs Retirement Contribution Decision Router", description: "Order emergency savings, employer match, high-cost debt, federal loan protections, and sustainable retirement progress.", canonicalPath: "/tools/debt-vs-retirement-router" });
  const tool = useQualifiedResult(DEFAULT_DEBT_RETIREMENT_ANSWERS, buildDebtRetirementResult, "Verify loan type, employer plan rules, current federal student-loan programs, and tax effects before making an irreversible change.");

  return (
    <>
      <PageHero eyebrow="Financial foundation" title="Debt vs Retirement Decision Router" description="Order liquidity, required payments, employer match, debt protections, and retirement progress without using a universal interest-rate cutoff." />
      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <DecisionToolIntro><strong className="text-foreground">This is sequencing support, not a payoff command.</strong> Use broad categories only. The tool does not need balances, rates, account numbers, lender names, or employer identity.</DecisionToolIntro>
        <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); tool.generate(); }}>
          <SelectQuestion id="debt-match" label="Employer retirement match status" helper="The plan document controls the formula, eligible pay, and vesting." value={tool.answers.match} onChange={(value) => tool.update("match", value as DebtRetirementAnswers["match"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "below", label: "Below the full match" }, { value: "full", label: "Receiving the full match" }, { value: "none", label: "No match is offered" }]} />
          <SelectQuestion id="debt-emergency" label="Emergency-savings range" helper="Use months of essential expenses, not an exact balance." value={tool.answers.emergency} onChange={(value) => tool.update("emergency", value as DebtRetirementAnswers["emergency"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "none", label: "None" }, { value: "under-one", label: "Less than one month" }, { value: "one-three", label: "One to three months" }, { value: "three-plus", label: "More than three months" }]} />
          <SelectQuestion id="debt-type" label="Debt category that matters most" helper="Federal student loans and private debt require different decision paths." value={tool.answers.debt} onChange={(value) => tool.update("debt", value as DebtRetirementAnswers["debt"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "high-interest", label: "Credit card or similar high-cost debt" }, { value: "private-student", label: "Private student loans" }, { value: "federal-student", label: "Federal student loans" }, { value: "other", label: "Other debt" }, { value: "multiple", label: "Multiple debt types" }, { value: "none", label: "No major debt concern" }]} />
          <SelectQuestion id="debt-pslf" label="Could Public Service Loan Forgiveness apply?" helper="Use Not sure until the employer and loan records are verified." value={tool.answers.pslf} onChange={(value) => tool.update("pslf", value as DebtRetirementAnswers["pslf"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="debt-cash" label="Current cash-flow pressure" helper="A plan that cannot survive the next month is not optimized." value={tool.answers.cashFlow} onChange={(value) => tool.update("cashFlow", value as DebtRetirementAnswers["cashFlow"])} options={[{ value: "not-sure", label: "Not sure" }, { value: "stressed", label: "Stressed or frequently short" }, { value: "stable", label: "Stable" }]} />
          <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="submit" size="lg">Build priority order</Button><Button type="button" variant="outline" size="lg" onClick={tool.reset}>Start over</Button></div>
        </form>
        {tool.result && <div ref={tool.resultRef} tabIndex={-1} className="outline-none"><DecisionResultPanel result={tool.result} copied={tool.copied} onCopy={tool.copy} onPrint={() => window.print()} onReset={tool.reset}>
          <OfficialSources sources={[
            { label: "Federal Student Aid", href: "https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service", note: "Official PSLF eligibility, forms, and payment-count resources." },
            { label: "Consumer Financial Protection Bureau", href: "https://www.consumerfinance.gov/consumer-tools/student-loans/", note: "Federal consumer guidance for student-loan decisions and servicing problems." },
            { label: "Financial Foundation Checkup", href: "/start-here", note: "Connect this sequencing result to emergency savings and the broader My Plan workflow." },
          ]} />
          <SaveNavigatorAction recommendationId="wealth_high_interest_debt" sourceRoute="/tools/debt-vs-retirement-router" title="Save the stabilize-first review" description="Only the fixed debt-and-investing review action is saved. Debt type, liquidity range, and PSLF answer are not stored in My Plan." />
        </DecisionResultPanel></div>}
        <section className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground"><Link className="font-bold text-primary" to="/student-loans">Open the full student-loan section</Link> when federal or private student loans control the decision.</section>
        <DisclaimerBox />
      </div>
    </>
  );
};
