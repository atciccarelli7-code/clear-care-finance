import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, Copy, FileSearch, FileText, HelpCircle, Phone, Printer, Receipt, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type DocumentType = "provider-bill" | "eob" | "msn" | "collection" | "not-sure";
type Sender = "hospital" | "physician-group" | "lab" | "imaging" | "ambulance" | "facility-other" | "not-sure";
type MatchStatus = "yes" | "no" | "no-document" | "not-sure";
type Affordability = "yes" | "no" | "not-sure";
type Pressure = "yes" | "no" | "not-sure";

type Option<T extends string> = {
  value: T;
  label: string;
  helper: string;
};

const documentOptions: Option<DocumentType>[] = [
  { value: "provider-bill", label: "Provider bill", helper: "A hospital, doctor, lab, imaging center, ambulance, or facility says you owe money." },
  { value: "eob", label: "EOB", helper: "An Explanation of Benefits from an insurance plan shows how a claim processed." },
  { value: "msn", label: "Medicare Summary Notice", helper: "A Medicare notice summarizes what was billed, approved, denied, and what may be owed." },
  { value: "collection", label: "Collection notice", helper: "A collector or past-due notice is asking for payment on a healthcare balance." },
  { value: "not-sure", label: "Not sure", helper: "The first step is identifying whether the paper is a bill, EOB, MSN, notice, or collection letter." },
];

const senderOptions: Option<Sender>[] = [
  { value: "hospital", label: "Hospital", helper: "Hospital bills may involve facility fees, itemized charges, charity care, and multiple departments." },
  { value: "physician-group", label: "Physician group", helper: "Doctors, anesthesiology, radiology, pathology, or ER groups can bill separately from the hospital." },
  { value: "lab", label: "Lab", helper: "Lab bills often need date-of-service, ordering provider, network, and claim-match checks." },
  { value: "imaging", label: "Imaging center", helper: "Imaging can create separate facility, professional, or reading-fee bills." },
  { value: "ambulance", label: "Ambulance", helper: "Ambulance bills may involve emergency status, transport reason, network rules, and balance-billing protections." },
  { value: "facility-other", label: "Facility/other", helper: "Use this for surgery centers, rehab facilities, SNFs, urgent care, home health, or unclear providers." },
  { value: "not-sure", label: "Not sure", helper: "Ask who owns the bill, who rendered the service, and which tax ID/NPI billed the claim." },
];

const matchOptions: Option<MatchStatus>[] = [
  { value: "yes", label: "Yes", helper: "The patient responsibility on the bill appears to match the EOB or MSN." },
  { value: "no", label: "No", helper: "The bill amount does not match the insurer or Medicare document." },
  { value: "no-document", label: "I do not have one", helper: "You may need the EOB, MSN, or claim status before paying confidently." },
  { value: "not-sure", label: "Not sure", helper: "Compare dates, provider names, billed charges, allowed amount, adjustments, payments, and patient responsibility." },
];

const affordabilityOptions: Option<Affordability>[] = [
  { value: "yes", label: "Yes", helper: "Ask about financial assistance, charity care, discounts, and payment plans before draining savings." },
  { value: "no", label: "No", helper: "Still verify the claim story before paying, especially for large or surprising balances." },
  { value: "not-sure", label: "Not sure", helper: "If paying would strain the household, treat affordability as an active question." },
];

const pressureOptions: Option<Pressure>[] = [
  { value: "yes", label: "Yes", helper: "Pressure is a reason to slow down, document the call, and request the account status in writing." },
  { value: "no", label: "No", helper: "Use the time to compare documents and ask for corrections before payment." },
  { value: "not-sure", label: "Not sure", helper: "Ask whether the account is in billing review, payment-plan status, collections, or credit-reporting risk." },
];

const relatedLinks = [
  ["EOB-to-Bill Match Checker", "/tools/eob-to-bill-match-checker"],
  ["Medical Bill Review Toolkit", "/insurance/medical-bill-review-toolkit"],
  ["Hospital Discharge Medicare Checklist", "/tools/hospital-discharge-medicare-checklist"],
  ["How to Read an EOB", "/articles/how-to-read-an-eob"],
  ["Why One Hospital Visit Can Create Multiple Bills", "/articles/why-one-hospital-visit-can-create-multiple-bills"],
  ["Facility Fee vs. Professional Fee", "/articles/facility-fee-vs-professional-fee"],
  ["Check Hospital Financial Assistance Before Paying", "/articles/check-hospital-financial-assistance-before-paying"],
  ["Out-of-Pocket Max Estimator", "/tools/out-of-pocket-max-estimator"],
] as const;

const officialReminder =
  "Educational only. This tool does not replace insurer documents, Medicare.gov, Medicaid.gov, HealthCare.gov, provider billing offices, plan documents, hospital financial assistance policies, licensed professionals, or official notices.";

const baseChecks = [
  "Confirm the patient name, date of service, provider, account number, and claim number match across documents.",
  "Compare the provider bill to the EOB, MSN, claim status, or plan explanation before paying.",
  "Ask whether the balance is final, corrected, under review, denied, appealed, adjusted, or still pending insurance processing.",
  "Write down the date, name, department, phone number, and reference number from every call.",
];

const baseBillingQuestions = [
  "Can you send an itemized bill and explain what each line is for?",
  "Has this claim been fully processed by insurance, Medicare, Medicaid, or the listed plan?",
  "Does your patient balance match the latest EOB, MSN, or payer response?",
  "Is the account on hold while I request review, correction, financial assistance, or appeal?",
];

const basePayerQuestions = [
  "What claim number, date of service, provider, and patient responsibility do you show?",
  "Was any part denied, adjusted, sent back, bundled, out-of-network, or still pending?",
  "What document explains the patient responsibility, denial reason, appeal deadline, or next step?",
  "Should the provider bill the plan again or correct coding, network, authorization, or coordination-of-benefits details?",
];

const getDocumentGuidance = (documentType: DocumentType) => {
  switch (documentType) {
    case "provider-bill":
      return {
        summary: "You have a provider bill, so the main question is whether that balance matches a processed payer document.",
        documents: ["Itemized provider bill", "EOB, MSN, or claim-status printout", "Any payment-plan, discount, or financial assistance paperwork"],
        checks: ["Do not assume the bill is final just because it has a due date."],
      };
    case "eob":
      return {
        summary: "You have an EOB, which is usually not a bill. Use it to compare against the provider bill.",
        documents: ["Provider bill for the same date of service", "Full EOB with claim number and patient responsibility", "Plan document if the denial or cost-sharing is unclear"],
        checks: ["Look for allowed amount, adjustment, plan payment, denial language, and patient responsibility."],
      };
    case "msn":
      return {
        summary: "You have a Medicare Summary Notice, which can help verify what Medicare processed and what may be owed.",
        documents: ["Provider bill for the same service", "Medicare Summary Notice", "Any supplemental, Medicare Advantage, or Medicaid explanation if another payer is involved"],
        checks: ["Use the MSN to verify what Medicare approved, denied, or listed as potentially owed."],
      };
    case "collection":
      return {
        summary: "A collection notice raises urgency, but it still needs verification before payment or dispute decisions.",
        documents: ["Collection notice", "Original provider bill", "EOB or MSN", "Payment history and any dispute or financial-assistance records"],
        checks: ["Ask for validation, original creditor details, dates of service, and whether the provider account is still open for review."],
      };
    case "not-sure":
      return {
        summary: "The first issue is document identification. Figure out whether you have a bill, EOB, MSN, denial, or collection notice.",
        documents: ["A photo or copy of each page", "Envelope or sender information", "Any account, claim, or reference numbers"],
        checks: ["Before paying, ask the sender what the document is and what action it requires."],
      };
  }
};

const getSenderGuidance = (sender: Sender) => {
  switch (sender) {
    case "hospital":
      return {
        summary: "Hospital bills often need itemized-bill, insurance-processing, and financial-assistance checks.",
        documents: ["Hospital itemized bill", "Financial assistance or charity care policy", "Facility and professional billing contacts"],
        billing: ["Can you screen this account for charity care or financial assistance before I pay?", "Are there separate physician, lab, imaging, anesthesia, or ER group bills I should expect?"],
      };
    case "physician-group":
      return {
        summary: "Physician-group bills may be separate from the hospital and need their own claim match.",
        documents: ["Physician group statement", "Provider name and specialty", "Matching EOB or claim number"],
        billing: ["Was this billed under the correct provider, place of service, and insurance information?", "Is this separate from the hospital facility bill?"],
      };
    case "lab":
      return {
        summary: "Lab bills should be matched to the ordering provider, date of service, and payer claim response.",
        documents: ["Lab bill", "Ordering provider information", "EOB or claim-status detail"],
        billing: ["Who ordered the lab, and was insurance information submitted correctly?", "Was the lab in-network or processed under a specific benefit rule?"],
      };
    case "imaging":
      return {
        summary: "Imaging can create separate technical, facility, and professional reading charges.",
        documents: ["Imaging center bill", "Radiology/professional bill if separate", "Authorization or referral record if required"],
        billing: ["Is this the facility charge, the professional reading charge, or both?", "Was prior authorization, referral, or network status part of the claim decision?"],
      };
    case "ambulance":
      return {
        summary: "Ambulance bills need careful review of emergency status, transport reason, payer processing, and any balance-billing protections.",
        documents: ["Ambulance bill", "Trip report or transport details if available", "EOB, MSN, or denial notice"],
        billing: ["What transport level, origin, destination, mileage, and emergency status were billed?", "Has the payer processed the claim or requested more information?"],
      };
    case "facility-other":
      return {
        summary: "Other facility bills should be matched to the exact setting, service, payer, and patient responsibility.",
        documents: ["Facility statement", "Admission, visit, or service paperwork", "EOB, MSN, or claim-status detail"],
        billing: ["What facility or service is this bill tied to?", "Is this bill related to a larger hospital, rehab, SNF, urgent care, surgery center, or home-health episode?"],
      };
    case "not-sure":
      return {
        summary: "If the sender is unclear, identify who owns the bill before paying.",
        documents: ["Sender name, address, phone number, tax ID/NPI if listed", "Account number", "Date of service and patient name"],
        billing: ["Who is the billing entity, who provided the service, and what provider or facility does this account belong to?", "Can you send a plain-language explanation of what this balance is for?"],
      };
  }
};

const getMatchGuidance = (matchStatus: MatchStatus) => {
  switch (matchStatus) {
    case "yes":
      return {
        summary: "If the amount matches, the next step is still to verify affordability, assistance, and whether any appeal or correction is pending.",
        checks: ["If the balance is large, ask whether discounts, prompt-pay options, or financial assistance are available before paying."],
        documents: ["Matching bill and EOB/MSN kept together"],
      };
    case "no":
      return {
        summary: "A mismatch is a pause signal. Do not pay until billing and the payer explain the difference.",
        checks: ["Flag mismatches in date of service, provider, patient responsibility, payments, adjustments, denial language, or claim number."],
        documents: ["Marked-up bill and EOB/MSN showing the mismatch"],
      };
    case "no-document":
      return {
        summary: "Without an EOB, MSN, or claim response, you may not have enough information to know whether the bill is final.",
        checks: ["Ask whether the claim has processed and request the payer explanation before paying a large balance."],
        documents: ["EOB, MSN, claim-status printout, or written payer explanation"],
      };
    case "not-sure":
      return {
        summary: "If you are not sure whether the amounts match, compare one line at a time before payment.",
        checks: ["Compare billed charge, allowed amount, adjustment, insurer payment, denial amount, and patient responsibility."],
        documents: ["Bill, EOB/MSN, and any plan or provider explanation for the same date of service"],
      };
  }
};

const getAffordabilityGuidance = (affordability: Affordability) => {
  switch (affordability) {
    case "yes":
      return {
        summary: "If the bill is unaffordable, financial assistance and payment-plan review should happen before major payment decisions.",
        assistance: "Yes — ask for financial assistance, charity care, discounts, payment plans, and whether the account can be paused during review.",
        billing: ["Can you screen me for hospital financial assistance, charity care, discounts, or a payment plan before I pay?", "Can the account be placed on hold while my application or review is pending?"],
      };
    case "no":
      return {
        summary: "If the bill is affordable, still verify that the balance is correct before paying.",
        assistance: "Maybe — assistance may still be worth checking for large hospital balances, but the first priority is bill accuracy.",
        billing: ["If this balance is correct, are there any discounts or no-interest payment-plan options?"],
      };
    case "not-sure":
      return {
        summary: "If affordability is unclear, treat it as a review item before payment.",
        assistance: "Yes — ask what assistance, discounts, charity care, or payment-plan options exist before using savings or credit.",
        billing: ["What financial assistance or discount options exist if this bill is difficult for the household to pay?", "What documents would you need for an assistance review?"],
      };
  }
};

const getPressureGuidance = (pressure: Pressure) => {
  switch (pressure) {
    case "yes":
      return {
        summary: "Payment pressure is a reason to document the account status and request time for review.",
        checks: ["Ask whether the account is in collections, pre-collections, active billing review, or eligible for a hold."],
        billing: ["What happens if I request a billing review, financial assistance review, or payer reprocessing before paying?", "Can you confirm in writing whether this account is on hold and for how long?"],
      };
    case "no":
      return {
        summary: "If there is no immediate pressure, use the time to verify the balance and request missing documents.",
        checks: ["Set a reminder to follow up before any due date, payment-plan deadline, appeal deadline, or collection transfer."],
        billing: ["What is the actual due date, and is this account still being reviewed or processed?"],
      };
    case "not-sure":
      return {
        summary: "If pressure is unclear, ask for the account status before deciding what to do next.",
        checks: ["Ask whether the account can affect collections, credit reporting, payment-plan eligibility, or financial assistance deadlines."],
        billing: ["Is this account at risk of collections or credit reporting, and what written options do I have before paying?"],
      };
  }
};

const unique = (items: string[]) => Array.from(new Set(items));

const MedicalBillReviewFlowPage = () => {
  const [documentType, setDocumentType] = useState<DocumentType>("provider-bill");
  const [sender, setSender] = useState<Sender>("hospital");
  const [matchStatus, setMatchStatus] = useState<MatchStatus>("no-document");
  const [affordability, setAffordability] = useState<Affordability>("not-sure");
  const [pressure, setPressure] = useState<Pressure>("not-sure");
  const [copied, setCopied] = useState(false);

  useSeo({
    title: "Medical Bill Review Flow",
    description:
      "A plain-English medical bill review flow for checking provider bills, EOBs, Medicare Summary Notices, collection notices, financial assistance, and what to ask before paying.",
    canonicalPath: "/tools/medical-bill-review-flow",
  });

  const result = useMemo(() => {
    const documentGuidance = getDocumentGuidance(documentType);
    const senderGuidance = getSenderGuidance(sender);
    const matchGuidance = getMatchGuidance(matchStatus);
    const affordabilityGuidance = getAffordabilityGuidance(affordability);
    const pressureGuidance = getPressureGuidance(pressure);

    const shouldPause = matchStatus === "no" || matchStatus === "no-document" || pressure === "yes" || documentType === "collection" || affordability !== "no";

    return {
      action: shouldPause ? "Pause before paying until the bill, payer document, and account status line up." : "Likely safe to verify final details, then pay through the official provider channel if everything still matches.",
      summary: unique([documentGuidance.summary, senderGuidance.summary, matchGuidance.summary, affordabilityGuidance.summary, pressureGuidance.summary]),
      checks: unique([...baseChecks, ...documentGuidance.checks, ...matchGuidance.checks, ...pressureGuidance.checks]),
      documents: unique([...documentGuidance.documents, ...senderGuidance.documents, ...matchGuidance.documents]),
      billingQuestions: unique([...baseBillingQuestions, ...senderGuidance.billing, ...affordabilityGuidance.billing, ...pressureGuidance.billing]),
      payerQuestions: unique(basePayerQuestions),
      assistance: affordabilityGuidance.assistance,
    };
  }, [affordability, documentType, matchStatus, pressure, sender]);

  const resultText = useMemo(() => {
    const lines = [
      "Medical Bill Review Flow",
      "",
      "Recommended next step:",
      `- ${result.action}`,
      "",
      "Key issue summary:",
      ...result.summary.map((item) => `- ${item}`),
      "",
      "What to check before paying:",
      ...result.checks.map((item) => `- ${item}`),
      "",
      "Documents to request or keep:",
      ...result.documents.map((item) => `- ${item}`),
      "",
      "What to ask the billing office:",
      ...result.billingQuestions.map((item) => `- ${item}`),
      "",
      "What to ask the insurer, Medicare, Medicaid, or plan:",
      ...result.payerQuestions.map((item) => `- ${item}`),
      "",
      "Financial assistance check:",
      `- ${result.assistance}`,
      "",
      officialReminder,
    ];

    return lines.join("\n");
  }, [result]);

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Medical bill decision tool"
        title="Medical Bill Review Flow"
        description="Answer a few plain-English questions and get a practical checklist for what to verify before paying a confusing healthcare bill, EOB, Medicare Summary Notice, or collection notice."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#review-flow">Start review flow</a></Button>
          <Button asChild variant="outline"><Link to="/tools/eob-to-bill-match-checker">Compare bill to EOB</Link></Button>
        </div>
      </PageHero>

      <main className="container space-y-14 py-12 md:py-16">
        <section id="review-flow" className="scroll-mt-24 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <FileSearch className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">Tell the tool what you have</CardTitle>
              <CardDescription>
                Pick the closest answer. This does not decide whether a bill is correct; it organizes what to check before money leaves the account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <QuestionGroup title="1. What do you have?" options={documentOptions} value={documentType} onChange={setDocumentType} />
              <QuestionGroup title="2. Who sent the bill?" options={senderOptions} value={sender} onChange={setSender} />
              <QuestionGroup title="3. Does the amount match the EOB/MSN?" options={matchOptions} value={matchStatus} onChange={setMatchStatus} />
              <QuestionGroup title="4. Is the bill unaffordable?" options={affordabilityOptions} value={affordability} onChange={setAffordability} />
              <QuestionGroup title="5. Are you being pressured to pay now?" options={pressureOptions} value={pressure} onChange={setPressure} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-card print:shadow-none">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Receipt className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">Your bill review checklist</CardTitle>
              <CardDescription>
                Copy or print this before calling billing, insurance, Medicare, Medicaid, a plan, or a collection agency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4 text-sm font-bold leading-relaxed text-primary">
                {result.action}
              </div>
              <ResultBlock title="Key issue summary" items={result.summary} />
              <ResultBlock title="What to check before paying" items={result.checks.slice(0, 9)} />
              <ResultBlock title="Document to request or keep" items={result.documents.slice(0, 8)} />
              <ResultBlock title="What to ask the billing office" items={result.billingQuestions.slice(0, 8)} />
              <ResultBlock title="What to ask the insurer, Medicare, Medicaid, or plan" items={result.payerQuestions.slice(0, 6)} />

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                <div className="mb-2 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" /> Financial assistance check</div>
                <p>{result.assistance}</p>
              </section>

              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                {officialReminder}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row print:hidden">
                <Button type="button" onClick={copyResults}>
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy review flow"}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                  Print review flow
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-label="Related resources">
          <SectionHeading
            eyebrow="Use next"
            title="Related bill review tools and articles"
            description="Use these when you need to match documents, understand separate bills, check facility fees, or ask about financial assistance."
            centered
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {relatedLinks.map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="group rounded-2xl border border-border bg-card p-4 text-sm font-semibold shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
              >
                <span>{label}</span>
                <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground transition-smooth group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3" aria-label="How to use this tool safely">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <ClipboardCheck className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle className="font-display text-xl">Do not match from memory</CardTitle>
              <CardDescription>Put the bill, EOB, MSN, claim status, and payment history side by side before deciding what to do.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <Phone className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle className="font-display text-xl">Document every call</CardTitle>
              <CardDescription>Write down names, dates, reference numbers, deadlines, account holds, and exactly what each office says.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <ShieldCheck className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle className="font-display text-xl">Use official documents</CardTitle>
              <CardDescription>The tool organizes questions. Final answers come from plan documents, payer records, provider billing offices, and official notices.</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><FileText className="h-6 w-6" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold">Need a stricter bill-to-EOB comparison?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Use this review flow to decide what to check, then use the EOB-to-Bill Match Checker when you have both documents in front of you.
              </p>
            </div>
            <Button asChild variant="soft"><Link to="/tools/eob-to-bill-match-checker">Open EOB checker</Link></Button>
          </div>
        </section>
      </main>
    </>
  );
};

const QuestionGroup = <T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <fieldset className="space-y-3">
    <legend className="text-sm font-bold text-foreground">{title}</legend>
    <div className="grid gap-3">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border p-4 text-left transition-smooth ${
              selected ? "border-primary bg-primary-soft text-foreground shadow-sm" : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
            }`}
            aria-pressed={selected}
          >
            <span className="block text-sm font-bold">{option.label}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.helper}</span>
          </button>
        );
      })}
    </div>
  </fieldset>
);

const ResultBlock = ({ title, items }: { title: string; items: string[] }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-primary">{title}</h2>
    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default MedicalBillReviewFlowPage;
