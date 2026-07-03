import { useState, type FormEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorInput, CalculatorSelectField } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning, CalculatorNextSteps } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

const num = (s: string, fallback = 0) => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : fallback;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Calc403bEmailEstimate = () => {
  const [hourly, setHourly] = useState("45");
  const [hoursWeek, setHoursWeek] = useState("36");
  const [freq, setFreq] = useState("26");
  const [pct, setPct] = useState("8");
  const [matchPct, setMatchPct] = useState("4");
  const [type, setType] = useState<"traditional" | "roth">("traditional");
  const [taxBracket, setTaxBracket] = useState("22");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const hourlyN = Math.max(0, num(hourly));
  const hoursWeekN = Math.max(0, num(hoursWeek));
  const freqN = Math.max(1, num(freq, 26));
  const pctN = Math.max(0, num(pct));
  const matchPctN = Math.max(0, num(matchPct));
  const grossPerCheck = hourlyN * hoursWeekN * (52 / freqN);
  const employeePerCheck = grossPerCheck * (pctN / 100);
  const annualEmployee = employeePerCheck * freqN;
  const annualEmployer = grossPerCheck * (Math.min(matchPctN, pctN) / 100) * freqN;
  const totalRetirement = annualEmployee + annualEmployer;
  const taxableReduction = type === "traditional" ? annualEmployee : 0;
  const estimatedTaxSavings = type === "traditional" ? annualEmployee * (Math.max(0, num(taxBracket)) / 100) : 0;
  const payFrequency = freq === "52" ? "Weekly" : freq === "26" ? "Bi-weekly" : freq === "24" ? "Semi-monthly" : "Monthly";

  const sendEstimate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    setMessage("");

    if (!emailPattern.test(cleanEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    if (!consent) {
      setStatus("error");
      setMessage("Check the consent box before sending.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "403b-estimate",
          source: "403b-calculator",
          email: cleanEmail,
          firstName: firstName.trim(),
          consent,
          website,
          estimate: {
            hourly: fmt(hourlyN),
            hoursWeek: `${hoursWeekN} hours/week`,
            payFrequency: `${payFrequency} (${freqN} paychecks/year)`,
            contributionPercent: `${pctN}%`,
            employerMatchPercent: `${matchPctN}%`,
            contributionType: type === "traditional" ? "Traditional" : "Roth",
            grossPerCheck: fmt(grossPerCheck),
            employeePerCheck: fmt(employeePerCheck),
            annualEmployee: fmt(annualEmployee),
            annualEmployer: fmt(annualEmployer),
            totalRetirement: fmt(totalRetirement),
            taxableReduction: fmt(taxableReduction),
            estimatedTaxSavings: type === "traditional" ? fmt(estimatedTaxSavings) : undefined,
          },
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "Email failed.");

      setStatus("success");
      setMessage("Sent. Check your inbox for the estimate.");
      setEmail("");
      setFirstName("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Email failed. Try again in a minute.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Hourly wage" prefix="$" value={hourly} onChange={setHourly} helper="Base hourly rate." />
          <CalculatorInput label="Hours per week" value={hoursWeek} onChange={setHoursWeek} helper="Typical scheduled hours." />
          <CalculatorSelectField label="Pay frequency" helper="Most hospitals pay biweekly.">
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="52">Weekly (52)</SelectItem>
                <SelectItem value="26">Bi-weekly (26)</SelectItem>
                <SelectItem value="24">Semi-monthly (24)</SelectItem>
                <SelectItem value="12">Monthly (12)</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorInput label="Your contribution %" suffix="%" value={pct} onChange={setPct} helper="Portion of each paycheck going to your 403(b)." />
          <CalculatorInput label="Employer match %" suffix="%" value={matchPct} onChange={setMatchPct} helper="Max percent of pay your employer matches." />
          <CalculatorSelectField label="Contribution type" helper="Traditional is pre-tax. Roth is after-tax.">
            <Select value={type} onValueChange={(v) => setType(v as "traditional" | "roth")}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="roth">Roth</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          {type === "traditional" && (
            <CalculatorInput label="Estimated tax bracket" suffix="%" value={taxBracket} onChange={setTaxBracket} helper="Rough federal marginal rate." />
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Estimated gross paycheck" value={fmt(grossPerCheck)} />
        <CalculatorResult label="Employee contribution / paycheck" value={fmt(employeePerCheck)} />
        <CalculatorResult label="Annual employee contribution" value={fmt(annualEmployee)} emphasis="primary" />
        <CalculatorResult label="Estimated employer match (yearly)" value={fmt(annualEmployer)} />
        <CalculatorResult label="Total retirement savings / year" value={fmt(totalRetirement)} emphasis="accent" />
        <CalculatorResult label="Estimated taxable income reduction" value={fmt(taxableReduction)} />
        {type === "traditional" && <CalculatorResult label="Estimated tax savings" value={fmt(estimatedTaxSavings)} helper="Rough estimate. Actual savings vary." />}
        <CalculatorMeaning>
          Contributing enough to get the full match is usually the single highest-return move available in a workplace plan.
        </CalculatorMeaning>
        <CalculatorNextSteps
          steps={[
            { label: "Read the Healthcare Worker Money Map", href: "/articles/healthcare-worker-money-map", helper: "Put the contribution into a full paycheck order of operations." },
            { label: "Compare Roth vs Traditional", href: "/articles/roth-vs-traditional-403b-healthcare-workers", helper: "Decide whether tax relief now or flexibility later fits better." },
            { label: "Open the Build Wealth hub", href: "/build-wealth", helper: "Connect 403(b), savings rate, investing, and career income." },
          ]}
        />

        <form onSubmit={sendEstimate} className="space-y-3 rounded-2xl border border-primary/20 bg-primary-soft/35 p-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Save this estimate</div>
            <h3 className="mt-1 font-display text-lg font-bold">Email me my 403(b) estimate</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc403b-first-name" className="text-xs font-semibold">First name</Label>
            <Input id="calc403b-first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Optional" autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc403b-email" className="text-xs font-semibold">Email</Label>
            <Input id="calc403b-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="calc403b-website">Website</Label>
            <Input id="calc403b-website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border bg-card/70 p-3 text-xs leading-relaxed text-muted-foreground">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-primary" />
            <span>I agree to receive this estimate and educational emails. I can unsubscribe anytime.</span>
          </label>
          <Button type="submit" variant="hero" className="w-full" disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Email my estimate"}</Button>
          {message && <p className={`text-sm font-medium ${status === "success" ? "text-primary" : "text-destructive"}`}>{message}</p>}
        </form>

        <DisclaimerBox short />
      </div>
    </div>
  );
};
