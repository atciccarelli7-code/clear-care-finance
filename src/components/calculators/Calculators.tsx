import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const Calc403b = () => {
  const [hourly, setHourly] = useState(45);
  const [hours, setHours] = useState(72);
  const [pct, setPct] = useState(8);
  const [freq, setFreq] = useState("26");

  const grossPerCheck = hourly * hours;
  const contribPerCheck = grossPerCheck * (pct / 100);
  const annualContrib = contribPerCheck * Number(freq);
  const annualGross = grossPerCheck * Number(freq);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
        <Field label="Hourly pay" helper="Your base hourly rate (before differentials).">
          <Input type="number" value={hourly} onChange={(e) => setHourly(+e.target.value || 0)} prefix="$" />
        </Field>
        <Field label="Hours per pay period" helper="Typical hours you work in one paycheck cycle.">
          <Input type="number" value={hours} onChange={(e) => setHours(+e.target.value || 0)} />
        </Field>
        <Field label="403(b) contribution %" helper="The percent of each paycheck going into your 403(b).">
          <Input type="number" value={pct} onChange={(e) => setPct(+e.target.value || 0)} />
        </Field>
        <Field label="Pay frequency" helper="How often you get paid.">
          <Select value={freq} onValueChange={setFreq}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="52">Weekly (52)</SelectItem>
              <SelectItem value="26">Bi-weekly (26)</SelectItem>
              <SelectItem value="24">Semi-monthly (24)</SelectItem>
              <SelectItem value="12">Monthly (12)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard label="Per-paycheck contribution" value={formatUSD(contribPerCheck)} accent="green" />
        <ResultCard label="Estimated annual contribution" value={formatUSD(annualContrib)} accent="blue" />
        <ResultCard label="Estimated annual gross pay" value={formatUSD(annualGross)} muted />
        <p className="text-xs text-muted-foreground px-1">
          Placeholder estimate. Doesn't include employer match, taxes, differentials, or IRS limits.
        </p>
      </div>
    </div>
  );
};

export const CalcInsurance = () => {
  const [premium, setPremium] = useState(180);
  const [deductible, setDeductible] = useState(1500);
  const [copay, setCopay] = useState(30);
  const [coins, setCoins] = useState(20);
  const [visits, setVisits] = useState(6);
  const [services, setServices] = useState(2000);

  const annualPremium = premium * 12;
  const visitCosts = visits * copay;
  const afterDeductible = Math.max(services - deductible, 0);
  const coinsCost = afterDeductible * (coins / 100);
  const deductibleCost = Math.min(services, deductible);
  const totalOOP = annualPremium + visitCosts + deductibleCost + coinsCost;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Monthly premium" helper="What you pay each month for coverage.">
            <Input type="number" value={premium} onChange={(e) => setPremium(+e.target.value || 0)} />
          </Field>
          <Field label="Annual deductible" helper="You pay this before insurance covers most things.">
            <Input type="number" value={deductible} onChange={(e) => setDeductible(+e.target.value || 0)} />
          </Field>
          <Field label="Copay per visit" helper="Flat fee per doctor visit.">
            <Input type="number" value={copay} onChange={(e) => setCopay(+e.target.value || 0)} />
          </Field>
          <Field label="Coinsurance %" helper="Your share after meeting the deductible.">
            <Input type="number" value={coins} onChange={(e) => setCoins(+e.target.value || 0)} />
          </Field>
          <Field label="Doctor visits / year" helper="Estimated routine visits.">
            <Input type="number" value={visits} onChange={(e) => setVisits(+e.target.value || 0)} />
          </Field>
          <Field label="Other expected costs" helper="Labs, imaging, procedures, etc.">
            <Input type="number" value={services} onChange={(e) => setServices(+e.target.value || 0)} />
          </Field>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard label="Annual premium" value={formatUSD(annualPremium)} muted />
        <ResultCard label="Visit copays" value={formatUSD(visitCosts)} muted />
        <ResultCard label="Deductible + coinsurance" value={formatUSD(deductibleCost + coinsCost)} muted />
        <ResultCard label="Estimated total out-of-pocket" value={formatUSD(totalOOP)} accent="blue" />
        <p className="text-xs text-muted-foreground px-1">
          Simplified estimate. Real plans have out-of-pocket maximums, networks, and exclusions.
        </p>
      </div>
    </div>
  );
};

export const CalcMedicare = () => {
  const [partB, setPartB] = useState(185);
  const [partD, setPartD] = useState(35);
  const [supplement, setSupplement] = useState(150);
  const [deductible, setDeductible] = useState(257);
  const [visits, setVisits] = useState(10);
  const [coins, setCoins] = useState(20);

  const annualPremiums = (partB + partD + supplement) * 12;
  const visitShare = visits * 50 * (coins / 100);
  const total = annualPremiums + deductible + visitShare;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Part B premium / month" helper="Doctor visits and outpatient care.">
            <Input type="number" value={partB} onChange={(e) => setPartB(+e.target.value || 0)} />
          </Field>
          <Field label="Part D premium / month" helper="Prescription drug plan.">
            <Input type="number" value={partD} onChange={(e) => setPartD(+e.target.value || 0)} />
          </Field>
          <Field label="Supplement (Medigap) / month" helper="Optional plan to fill gaps. Use 0 if none.">
            <Input type="number" value={supplement} onChange={(e) => setSupplement(+e.target.value || 0)} />
          </Field>
          <Field label="Annual Part B deductible" helper="Yearly amount you pay before Part B kicks in.">
            <Input type="number" value={deductible} onChange={(e) => setDeductible(+e.target.value || 0)} />
          </Field>
          <Field label="Expected doctor visits" helper="Routine and specialist visits per year.">
            <Input type="number" value={visits} onChange={(e) => setVisits(+e.target.value || 0)} />
          </Field>
          <Field label="Coinsurance %" helper="Typically 20% for Part B services.">
            <Input type="number" value={coins} onChange={(e) => setCoins(+e.target.value || 0)} />
          </Field>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard label="Annual premiums" value={formatUSD(annualPremiums)} muted />
        <ResultCard label="Part B deductible" value={formatUSD(deductible)} muted />
        <ResultCard label="Visit coinsurance share" value={formatUSD(visitShare)} muted />
        <ResultCard label="Estimated yearly Medicare cost" value={formatUSD(total)} accent="green" />
        <p className="text-xs text-muted-foreground px-1">
          Educational placeholder. Real Medicare costs depend on income, plan choices, and coverage details.
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-semibold">{label}</Label>
    {children}
    {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
  </div>
);

const ResultCard = ({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: "blue" | "green";
  muted?: boolean;
}) => {
  const cls = muted
    ? "bg-muted/40 border-border"
    : accent === "green"
    ? "bg-gradient-accent text-secondary-foreground border-transparent"
    : "bg-gradient-primary text-primary-foreground border-transparent";
  return (
    <div className={`rounded-2xl border p-5 shadow-card ${cls}`}>
      <div className={`text-xs font-semibold uppercase tracking-wider ${muted ? "text-muted-foreground" : "opacity-90"}`}>
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
};
