import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorInput, CalculatorSelectField } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

const num = (value: string, fallback = 0) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const payoff = (balance: number, apr: number, payment: number, lump = 0) => {
  let remaining = Math.max(balance - lump, 0);
  const monthlyRate = Math.max(apr, 0) / 100 / 12;
  let months = 0;
  let interest = 0;

  if (remaining === 0) return { months: 0, interest: 0, works: true };
  if (payment <= 0) return { months: Infinity, interest: Infinity, works: false };

  while (remaining > 0 && months < 600) {
    const monthInterest = remaining * monthlyRate;
    if (monthlyRate > 0 && payment <= monthInterest) return { months: Infinity, interest: Infinity, works: false };
    interest += monthInterest;
    remaining = Math.max(remaining + monthInterest - payment, 0);
    months += 1;
  }

  return { months, interest, works: remaining === 0 };
};

const timeLabel = (months: number) => {
  if (!Number.isFinite(months)) return "Not payoff-safe";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} mo`;
  return rest ? `${years} yr ${rest} mo` : `${years} yr`;
};

const dateLabel = (months: number) => {
  if (!Number.isFinite(months)) return "Not available";
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
};

const BulletList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-2xl border border-border bg-muted/30 p-4">
    <div className="mb-3 text-sm font-bold text-foreground">{title}</div>
    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const StudentLoanPathFinder = () => {
  const [loanType, setLoanType] = useState("unknown");
  const [employer, setEmployer] = useState("nonprofit");
  const [role, setRole] = useState("rn");
  const [fullTime, setFullTime] = useState("yes");
  const [balance, setBalance] = useState("45000");
  const [rate, setRate] = useState("8.5");

  const balanceN = Math.max(0, num(balance));
  const rateN = Math.max(0, num(rate));
  const federalDirect = loanType === "direct";
  const privateLoan = loanType === "private";
  const eligibleEmployer = employer === "nonprofit" || employer === "government";
  const fullTimeWorker = fullTime === "yes";
  const advancedRole = role === "np" || role === "aprn" || role === "cnm";

  const paths = [
    federalDirect && eligibleEmployer && fullTimeWorker
      ? "PSLF may be worth verifying because the inputs point toward federal Direct Loans, qualifying employment, and full-time work."
      : "PSLF needs official verification of loan type, employer status, repayment plan, and qualifying payment count.",
    loanType === "ffel" || loanType === "perkins"
      ? "Older federal loans may need a Direct Consolidation check before PSLF can apply."
      : "Federal borrowers should compare income-driven repayment against standard payoff.",
    privateLoan || rateN >= 7
      ? "High-rate private debt usually needs a payoff, refinance, or cash-flow plan rather than a forgiveness-first plan."
      : "Lower-rate debt can be compared against emergency savings, retirement match, and other goals.",
    role === "rn" || role === "aprn" || role === "np" || role === "faculty"
      ? "Nurse Corps may be worth checking for eligible nurses or nurse faculty at qualifying facilities or schools."
      : "Healthcare worker programs vary by exact license, discipline, and work site.",
    advancedRole ? "NHSC may be relevant for certain advanced-practice clinicians at approved shortage-area sites." : "NHSC is more role- and site-specific than general bedside nursing.",
  ];

  const warnings = [
    privateLoan ? "Private loans generally do not use PSLF or federal income-driven repayment." : "Confirm whether every loan is federal Direct, older federal, or private.",
    !eligibleEmployer ? "For-profit healthcare employers usually do not qualify for PSLF based only on healthcare work." : "Use the employer EIN when checking PSLF eligibility.",
    !fullTimeWorker ? "Part-time status can create program eligibility problems." : "Keep employment certification records if pursuing PSLF.",
  ];

  const documents = [
    "Loan list from StudentAid.gov and any private lender portals.",
    "Current servicer statement showing balance, APR, payment, and repayment plan.",
    "Employer EIN and nonprofit/government status check.",
    "Certified PSLF payment count, if the borrower has already started the process.",
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorSelectField label="Loan type" helper="The first and most important filter.">
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">Unknown / need to check</SelectItem>
                <SelectItem value="direct">Federal Direct Loan</SelectItem>
                <SelectItem value="ffel">Older federal FFEL loan</SelectItem>
                <SelectItem value="perkins">Federal Perkins loan</SelectItem>
                <SelectItem value="private">Private student loan</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorSelectField label="Employer type" helper="For PSLF, employer status matters more than job title.">
            <Select value={employer} onValueChange={setEmployer}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nonprofit">501(c)(3) / nonprofit</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="forprofit">Private for-profit</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorSelectField label="Role" helper="Some programs are role-specific.">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rn">RN</SelectItem>
                <SelectItem value="aprn">APRN</SelectItem>
                <SelectItem value="np">Nurse practitioner</SelectItem>
                <SelectItem value="cnm">Certified nurse midwife</SelectItem>
                <SelectItem value="faculty">Nurse faculty</SelectItem>
                <SelectItem value="other">Other healthcare worker</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorSelectField label="Full-time status" helper="Hours and status can matter.">
            <Select value={fullTime} onValueChange={setFullTime}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No / part-time</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorInput label="Loan balance" prefix="$" value={balance} onChange={setBalance} helper="Approximate total balance." />
          <CalculatorInput label="Interest rate" suffix="%" value={rate} onChange={setRate} helper="Weighted average APR if needed." />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Balance to plan around" value={usd(balanceN)} emphasis="primary" />
        <CalculatorResult label="APR risk level" value={rateN >= 8 ? "High" : rateN >= 5 ? "Moderate" : "Lower"} />
        <BulletList title="Paths to research" items={paths} />
        <BulletList title="Warnings" items={warnings} />
        <BulletList title="Documents to gather" items={documents} />
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export const PrivateLoanPayoffCalculator = () => {
  const [balance, setBalance] = useState("45000");
  const [apr, setApr] = useState("9");
  const [minimum, setMinimum] = useState("525");
  const [extra, setExtra] = useState("250");
  const [lump, setLump] = useState("0");
  const [refiApr, setRefiApr] = useState("6.5");

  const balanceN = Math.max(0, num(balance));
  const aprN = Math.max(0, num(apr));
  const minimumN = Math.max(0, num(minimum));
  const extraN = Math.max(0, num(extra));
  const lumpN = Math.max(0, num(lump));
  const refiAprN = Math.max(0, num(refiApr));
  const planned = minimumN + extraN;
  const base = payoff(balanceN, aprN, minimumN);
  const accelerated = payoff(balanceN, aprN, planned, lumpN);
  const refi = payoff(balanceN, refiAprN, planned, lumpN);
  const saved = base.works && accelerated.works ? Math.max(base.interest - accelerated.interest, 0) : 0;
  const refiSaved = accelerated.works && refi.works ? Math.max(accelerated.interest - refi.interest, 0) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Private loan balance" prefix="$" value={balance} onChange={setBalance} helper="Total private loan balance." />
          <CalculatorInput label="Current APR" suffix="%" value={apr} onChange={setApr} helper="Weighted average if needed." />
          <CalculatorInput label="Minimum monthly payment" prefix="$" value={minimum} onChange={setMinimum} helper="Required monthly payment." />
          <CalculatorInput label="Extra monthly payment" prefix="$" value={extra} onChange={setExtra} helper="Amount above the minimum." />
          <CalculatorInput label="One-time lump sum" prefix="$" value={lump} onChange={setLump} helper="Optional cash applied now." />
          <CalculatorInput label="Possible refinance APR" suffix="%" value={refiApr} onChange={setRefiApr} helper="Use an actual quote when available." />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Planned monthly payment" value={usd(planned)} emphasis="primary" />
        <CalculatorResult label="Minimum-only payoff" value={timeLabel(base.months)} helper={base.works ? `${usd(base.interest)} estimated interest` : "Payment may not cover interest."} />
        <CalculatorResult label="Accelerated payoff" value={timeLabel(accelerated.months)} emphasis="accent" helper={accelerated.works ? `${usd(accelerated.interest)} estimated interest; around ${dateLabel(accelerated.months)}` : "Payment may not cover interest."} />
        <CalculatorResult label="Interest saved vs minimum" value={usd(saved)} />
        <CalculatorResult label="Possible refinance payoff" value={timeLabel(refi.months)} helper={refi.works ? `${usd(refiSaved)} extra interest saved; around ${dateLabel(refi.months)}` : "Check payment and APR inputs."} />
        <CalculatorMeaning>
          Private loans are usually a rate and cash-flow problem. Compare payoff speed, refinance APR, and emergency cash before overcommitting.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export const PSLFProgressEstimator = () => {
  const [loanType, setLoanType] = useState("direct");
  const [employer, setEmployer] = useState("nonprofit");
  const [payments, setPayments] = useState("24");
  const [monthly, setMonthly] = useState("350");
  const [balance, setBalance] = useState("52000");

  const paymentCount = Math.min(120, Math.max(0, Math.floor(num(payments))));
  const remaining = Math.max(120 - paymentCount, 0);
  const monthlyN = Math.max(0, num(monthly));
  const balanceN = Math.max(0, num(balance));
  const paidBefore120 = remaining * monthlyN;
  const balanceNotCoveredByScheduledPayments = Math.max(balanceN - paidBefore120, 0);
  const looksAligned = loanType === "direct" && (employer === "nonprofit" || employer === "government");

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorSelectField label="Loan type" helper="PSLF starts with eligible federal loans.">
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Federal Direct Loan</SelectItem>
                <SelectItem value="older">Older federal / unsure</SelectItem>
                <SelectItem value="private">Private student loan</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorSelectField label="Employer type" helper="Use the employer EIN when verifying.">
            <Select value={employer} onValueChange={setEmployer}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nonprofit">501(c)(3) / nonprofit</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="forprofit">Private for-profit</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorInput label="Certified qualifying payments" value={payments} onChange={setPayments} helper="Use certified count when possible." />
          <CalculatorInput label="Estimated monthly payment" prefix="$" value={monthly} onChange={setMonthly} helper="Expected qualifying payment." />
          <CalculatorInput label="Current balance" prefix="$" value={balance} onChange={setBalance} helper="Current federal loan balance." />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Input status" value={looksAligned ? "Looks PSLF-aligned" : "Verify before relying on PSLF"} emphasis={looksAligned ? "accent" : "primary"} />
        <CalculatorResult label="Payments remaining to 120" value={`${remaining}`} />
        <CalculatorResult label="Estimated time remaining" value={`${(remaining / 12).toFixed(1)} years`} />
        <CalculatorResult label="Estimated cash paid before 120" value={usd(paidBefore120)} />
        <CalculatorResult label="Balance not covered by those payments" value={usd(balanceNotCoveredByScheduledPayments)} helper="Not a forgiveness estimate. Actual PSLF forgiveness is the remaining eligible principal and accrued interest after all rules are met." />
        <BulletList title="Before trusting this number" items={["Confirm loan type in StudentAid.gov.", "Certify employer eligibility and payment count.", "Verify that the repayment plan qualifies.", "Do not treat this as a guaranteed forgiveness estimate."]} />
        <DisclaimerBox short />
      </div>
    </div>
  );
};
