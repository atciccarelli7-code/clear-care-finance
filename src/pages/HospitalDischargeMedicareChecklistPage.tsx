import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardCheck, Copy, FileText, HelpCircle, Hospital, Phone, Printer, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type Destination = "home" | "rehab-snf" | "long-term-care" | "not-sure";
type Coverage = "original-medicare" | "medicare-advantage" | "medicaid" | "dual" | "not-sure";
type Concern = "bill" | "denial" | "observation" | "equipment" | "medication" | "home-health" | "long-term-care-cost";
type Notice = "yes" | "no" | "not-sure";

type Option<T extends string> = {
  value: T;
  label: string;
  helper: string;
};

const destinationOptions: Option<Destination>[] = [
  { value: "home", label: "Home", helper: "The main issues are instructions, follow-up, equipment, medications, and home support." },
  { value: "rehab-snf", label: "Rehab/SNF", helper: "The main issues are skilled need, facility placement, hospital status, and payer approval." },
  { value: "long-term-care", label: "Long-term care/nursing home", helper: "The main issues are custodial care, Medicaid, assets/income, and state rules." },
  { value: "not-sure", label: "Not sure", helper: "Start by asking the care team to name the recommended next setting in writing." },
];

const coverageOptions: Option<Coverage>[] = [
  { value: "original-medicare", label: "Original Medicare", helper: "Ask what Part A or Part B is expected to cover and what notice applies." },
  { value: "medicare-advantage", label: "Medicare Advantage", helper: "Ask whether authorization is approved, pending, denied, or ending." },
  { value: "medicaid", label: "Medicaid", helper: "Ask which state Medicaid rule, managed-care plan, or eligibility step applies." },
  { value: "dual", label: "Dual Medicare + Medicaid", helper: "Ask which program is responsible for the specific service or setting." },
  { value: "not-sure", label: "Not sure", helper: "Ask the hospital, plan, or billing office to identify every payer on file." },
];

const concernOptions: Option<Concern>[] = [
  { value: "bill", label: "Bill", helper: "Match the bill to the EOB, MSN, provider statement, and plan documents before paying." },
  { value: "denial", label: "Denial or pending authorization", helper: "Focus on the written reason, appeal deadline, and who can submit clinical documentation." },
  { value: "observation", label: "Observation vs inpatient status", helper: "Ask for the official hospital status and when it started." },
  { value: "equipment", label: "Equipment", helper: "Confirm orders, supplier, delivery timing, coverage, and backup plan." },
  { value: "medication", label: "Medication", helper: "Confirm the discharge medication list, pharmacy access, prior authorization, and affordability." },
  { value: "home-health", label: "Home health", helper: "Clarify which skilled services are ordered and what home health does not include." },
  { value: "long-term-care-cost", label: "Nursing home or long-term care cost", helper: "Separate skilled rehab coverage from custodial long-term care and Medicaid questions." },
];

const noticeOptions: Option<Notice>[] = [
  { value: "yes", label: "Yes", helper: "Use the document name, date, deadline, and reference number during calls." },
  { value: "no", label: "No", helper: "Ask for the decision, discharge plan, denial, bill, or notice in writing." },
  { value: "not-sure", label: "Not sure", helper: "Ask someone to identify what document you have before acting on it." },
];

const relatedLinks = [
  ["Hospital Discharge & Medicare guide", "/guides/hospital-discharge-medicare"],
  ["Open the printable PDF", "/guides/hospital-discharge-medicare-quick-guide.pdf"],
  ["Observation vs. inpatient status", "/articles/observation-vs-inpatient-status"],
  ["Medicare rehab after a hospital stay", "/articles/does-medicare-cover-rehab-after-hospital-stay"],
  ["Home health after discharge", "/articles/home-health-after-discharge"],
  ["Durable medical equipment after discharge", "/articles/durable-medical-equipment-after-discharge"],
  ["Medicare vs. Medicaid", "/articles/medicare-vs-medicaid-what-is-the-difference"],
  ["EOB-to-bill match checker", "/tools/eob-to-bill-match-checker"],
] as const;

const officialReminder =
  "Educational only. Verify your situation with Medicare.gov, Medicaid.gov, CMS, HealthCare.gov, your state Medicaid agency, SHIP, plan documents, hospital staff, licensed professionals, or the official written notice you received.";

const baseQuestions = [
  "What is the exact next setting or service being recommended?",
  "Who has approved payment for it, and is that approval written down?",
  "What needs to happen before discharge, transfer, or payment?",
  "What is the deadline for appeal, follow-up, delivery, pickup, or payment?",
];

const baseDocuments = [
  "Discharge instructions and medication list",
  "Written notices, denial letters, EOBs, MSNs, bills, or authorization decisions",
  "Names, dates, phone numbers, reference numbers, and deadlines from every call",
  "Provider orders for rehab, home health, equipment, supplies, medications, or follow-up care",
];

const baseContacts = [
  "Hospital case manager or discharge planner",
  "Hospital billing office or patient financial services, if there is a bill",
  "The insurance plan, Medicare Advantage plan, Medicaid office, or listed payer",
  "SHIP or another local counseling resource when Medicare decisions are unclear",
];

const getDestinationGuidance = (destination: Destination) => {
  switch (destination) {
    case "home":
      return {
        summary: "The next risk is an unsafe or incomplete home setup.",
        questions: ["What services, equipment, medications, and follow-up appointments must be ready before the patient leaves?", "Who should the family call if the plan fails at home?"],
        documents: ["Home health order, DME order, prescription list, discharge summary, and follow-up appointment list"],
        contacts: ["Home health agency, DME supplier, pharmacy, primary care office, and hospital discharge planner"],
      };
    case "rehab-snf":
      return {
        summary: "The next risk is assuming rehab placement and payer approval are the same thing.",
        questions: ["What skilled service is documented, and has the payer approved this facility and level of care?", "Is the hospital stay inpatient or observation, and how could that affect coverage?"],
        documents: ["Facility acceptance, therapy or skilled nursing notes, authorization status, and any Medicare or plan notice"],
        contacts: ["Hospital case manager, accepting facility admissions office, Medicare Advantage plan if applicable, and rehab/SNF billing office"],
      };
    case "long-term-care":
      return {
        summary: "The next risk is confusing skilled Medicare coverage with custodial long-term care.",
        questions: ["Is this skilled rehab, custodial daily-living help, or both?", "Has anyone explained the Medicaid application path and state-specific documentation needs?"],
        documents: ["Facility cost estimate, Medicaid application checklist, income/asset paperwork list, and any long-term care coverage documents"],
        contacts: ["Facility business office, state Medicaid agency, elder law or Medicaid planning professional, and hospital case manager"],
      };
    case "not-sure":
      return {
        summary: "The first issue is that the next setting has not been named clearly enough.",
        questions: ["Can you write down the recommended next setting and why it is being recommended?", "What decision must be made today, and what can wait until a written notice or plan document is reviewed?"],
        documents: ["Written discharge plan, active problem list, current orders, and any plan or payer communication"],
        contacts: ["Hospital case manager, attending clinician, bedside nurse, and payer listed on the chart"],
      };
  }
};

const getCoverageGuidance = (coverage: Coverage) => {
  switch (coverage) {
    case "original-medicare":
      return {
        summary: "For Original Medicare, identify whether the issue is Part A, Part B, or a formal Medicare notice.",
        questions: ["Is this being billed under Medicare Part A or Part B?", "What Medicare notice or MSN explains the decision?"],
        contacts: ["Medicare, the provider billing office, SHIP, and the facility business office"],
      };
    case "medicare-advantage":
      return {
        summary: "For Medicare Advantage, authorization status and appeal deadlines are often the first things to confirm.",
        questions: ["Is authorization approved, pending, denied, or ending?", "What is the written reason and appeal deadline?"],
        contacts: ["Medicare Advantage plan, hospital case manager, facility admissions office, and ordering clinician"],
      };
    case "medicaid":
      return {
        summary: "For Medicaid, state rules and managed-care details matter.",
        questions: ["Which Medicaid program or managed-care plan is involved?", "What proof, renewal, spend-down, or eligibility step is missing?"],
        contacts: ["State Medicaid agency, Medicaid managed-care plan, facility business office, and application assister if available"],
      };
    case "dual":
      return {
        summary: "For dual Medicare and Medicaid coverage, first identify which program controls the service in question.",
        questions: ["Is Medicare, Medicaid, or the Medicare Advantage/D-SNP plan responsible for this specific service?", "Is the issue coverage, cost-sharing, network, authorization, or eligibility?"],
        contacts: ["Medicare plan, Medicaid plan or agency, SHIP, and facility billing office"],
      };
    case "not-sure":
      return {
        summary: "Coverage is unclear, so the first task is identifying every payer before accepting an answer.",
        questions: ["What insurance, Medicare, Medicaid, or supplemental coverage is listed on the account?", "Which payer was contacted, and what did they say in writing?"],
        contacts: ["Hospital registration, billing office, plan member services, Medicare, Medicaid agency, and SHIP"],
      };
  }
};

const getConcernGuidance = (concern: Concern) => {
  switch (concern) {
    case "bill":
      return {
        summary: "Do not treat the bill as final until it matches the processed claim story.",
        questions: ["Does the bill match the EOB or MSN patient responsibility?", "Was financial assistance, charity care, or a payment-plan review offered before payment?"],
        documents: ["Itemized bill, EOB, MSN, provider statement, financial assistance application, and proof of payment if already paid"],
        contacts: ["Provider billing office, insurance plan, hospital financial assistance office, and EOB-to-bill match checker"],
      };
    case "denial":
      return {
        summary: "A denial or pending authorization should be handled from the written reason and deadline, not from a phone summary alone.",
        questions: ["What exact service was denied or delayed?", "Who can submit clinical documentation, and what is the appeal deadline?"],
        documents: ["Denial notice, authorization request, clinical notes, appeal instructions, and reference numbers"],
        contacts: ["Plan utilization management department, ordering clinician, hospital case manager, and facility admissions office"],
      };
    case "observation":
      return {
        summary: "Observation status can affect how the stay and next care are billed, so status must be confirmed in writing.",
        questions: ["What is the patient’s official status right now?", "When did that status start, and has a Medicare notice been given?"],
        documents: ["Status notice, admission or observation paperwork, discharge summary, and any Medicare notices"],
        contacts: ["Hospital case manager, utilization review department, attending clinician, and billing office"],
      };
    case "equipment":
      return {
        summary: "Equipment problems are usually order, supplier, timing, or coverage problems.",
        questions: ["Who ordered the equipment, who is supplying it, and when will it arrive?", "What is covered, rented, purchased, or not covered?"],
        documents: ["DME order, supplier contact, delivery confirmation, coverage estimate, and backup instructions"],
        contacts: ["DME supplier, ordering clinician, hospital discharge planner, and payer member services"],
      };
    case "medication":
      return {
        summary: "Medication problems need to be solved before the patient leaves without access to key drugs.",
        questions: ["Which new medications are required today?", "Does any drug need prior authorization, substitution, or cost review?"],
        documents: ["Discharge medication list, pharmacy claim issue, prior authorization request, and prescribing clinician contact"],
        contacts: ["Pharmacy, prescribing clinician, hospital discharge planner, and plan pharmacy benefit line"],
      };
    case "home-health":
      return {
        summary: "Home health is not the same as unlimited home care, so clarify what services are actually ordered.",
        questions: ["Which skilled services are ordered and how often will they come?", "What daily-living help is not included?"],
        documents: ["Home health order, agency acceptance, visit plan, and instructions for missed or delayed visits"],
        contacts: ["Home health agency, ordering clinician, discharge planner, and payer member services"],
      };
    case "long-term-care-cost":
      return {
        summary: "Long-term care cost questions usually require separating short-term skilled coverage from custodial care and Medicaid eligibility.",
        questions: ["Is this skilled rehab or custodial long-term care?", "What private-pay rate, Medicaid status, or application step applies?"],
        documents: ["Facility rate sheet, Medicaid application checklist, income/asset list, and any long-term care insurance documents"],
        contacts: ["Facility business office, state Medicaid agency, elder law professional, and hospital case manager"],
      };
  }
};

const getNoticeGuidance = (notice: Notice) => {
  switch (notice) {
    case "yes":
      return {
        summary: "Use the written notice as the anchor for every call.",
        questions: ["What is the document name, date, deadline, and reference number?", "Which sentence explains the decision or patient responsibility?"],
        documents: ["A copy or photo of the notice, bill, EOB, MSN, discharge paperwork, or authorization letter"],
      };
    case "no":
      return {
        summary: "Ask for the decision or plan in writing before relying on a verbal explanation.",
        questions: ["Can you send or print the written notice, discharge plan, denial reason, or bill detail?", "Who created the decision and where is it documented?"],
        documents: ["Written discharge plan, denial notice, bill, EOB, MSN, or plan message once provided"],
      };
    case "not-sure":
      return {
        summary: "First identify what document you have and what it is asking you to do.",
        questions: ["Is this a bill, EOB, MSN, denial, discharge instruction, plan notice, or facility document?", "Does it require payment, appeal, signature, or follow-up?"],
        documents: ["A labeled copy of each document with date received, sender, deadline, and action needed"],
      };
  }
};

const unique = (items: string[]) => Array.from(new Set(items));

const HospitalDischargeMedicareChecklistPage = () => {
  const [destination, setDestination] = useState<Destination>("not-sure");
  const [coverage, setCoverage] = useState<Coverage>("not-sure");
  const [concern, setConcern] = useState<Concern>("denial");
  const [notice, setNotice] = useState<Notice>("not-sure");
  const [copied, setCopied] = useState(false);

  useSeo({
    title: "Hospital Discharge Medicare Checklist Tool",
    description:
      "A plain-English hospital discharge checklist tool for Medicare, Medicaid, rehab, SNF, home health, equipment, medication, authorization, and medical bill questions.",
    canonicalPath: "/tools/hospital-discharge-medicare-checklist",
  });

  const result = useMemo(() => {
    const destinationGuidance = getDestinationGuidance(destination);
    const coverageGuidance = getCoverageGuidance(coverage);
    const concernGuidance = getConcernGuidance(concern);
    const noticeGuidance = getNoticeGuidance(notice);

    return {
      summary: unique([destinationGuidance.summary, coverageGuidance.summary, concernGuidance.summary, noticeGuidance.summary]),
      questions: unique([...baseQuestions, ...destinationGuidance.questions, ...coverageGuidance.questions, ...concernGuidance.questions, ...noticeGuidance.questions]),
      documents: unique([...baseDocuments, ...destinationGuidance.documents, ...concernGuidance.documents, ...noticeGuidance.documents]),
      contacts: unique([...baseContacts, ...destinationGuidance.contacts, ...coverageGuidance.contacts, ...concernGuidance.contacts]),
    };
  }, [coverage, concern, destination, notice]);

  const resultText = useMemo(() => {
    const lines = [
      "Hospital Discharge & Medicare Checklist",
      "",
      "Key issue summary:",
      ...result.summary.map((item) => `- ${item}`),
      "",
      "Questions to ask:",
      ...result.questions.map((item) => `- ${item}`),
      "",
      "Documents to request or keep:",
      ...result.documents.map((item) => `- ${item}`),
      "",
      "Who to call:",
      ...result.contacts.map((item) => `- ${item}`),
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
        eyebrow="Interactive discharge checklist"
        title="Hospital Discharge Medicare Checklist Tool"
        description="Answer a few plain-English questions and get a focused checklist of what to ask, what to keep, who to call, and what to verify before discharge, transfer, home setup, plan appeal, or payment."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#checklist">Start checklist</a></Button>
          <Button asChild variant="outline"><Link to="/guides/hospital-discharge-medicare">Read the guide page</Link></Button>
        </div>
      </PageHero>

      <div className="container space-y-14 py-12 md:py-16">
        <section id="checklist" className="scroll-mt-24 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">Tell the tool what is happening</CardTitle>
              <CardDescription>
                Choose the closest answer. The result is not a coverage decision; it is a structured call checklist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <QuestionGroup title="1. Where is the patient going next?" options={destinationOptions} value={destination} onChange={setDestination} />
              <QuestionGroup title="2. What coverage is involved?" options={coverageOptions} value={coverage} onChange={setCoverage} />
              <QuestionGroup title="3. What is the biggest concern?" options={concernOptions} value={concern} onChange={setConcern} />
              <QuestionGroup title="4. Is there a written notice, EOB, MSN, discharge paperwork, or bill?" options={noticeOptions} value={notice} onChange={setNotice} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-card print:shadow-none">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">Your focused checklist</CardTitle>
              <CardDescription>
                Copy or print this before the next discharge, plan, facility, pharmacy, equipment, or billing call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResultBlock title="Key issue summary" items={result.summary} />
              <ResultBlock title="Questions to ask before discharge or payment" items={result.questions.slice(0, 9)} />
              <ResultBlock title="Documents to request or keep" items={result.documents.slice(0, 8)} />
              <ResultBlock title="Who to call" items={result.contacts.slice(0, 8)} />

              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                {officialReminder}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row print:hidden">
                <Button type="button" onClick={copyResults}>
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy checklist"}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                  Print checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-label="Related resources">
          <SectionHeading
            eyebrow="Use next"
            title="Related guide, tools, and articles"
            description="Use the result above to organize the next call. Use these pages if one part of the issue needs more detail."
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
              <Hospital className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle className="font-display text-xl">Use it before discharge</CardTitle>
              <CardDescription>Ask the questions before the patient leaves, transfers, or loses access to the hospital team.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <Phone className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle className="font-display text-xl">Use it during calls</CardTitle>
              <CardDescription>Write down names, dates, reference numbers, deadlines, and the exact wording from each answer.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <ShieldCheck className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle className="font-display text-xl">Verify with official sources</CardTitle>
              <CardDescription>Use the tool to organize the question. Use official documents and professionals to verify the answer.</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><FileText className="h-6 w-6" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold">Want the printable version too?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The interactive checklist is the best starting point. The printable guide is still available as a slower, page-by-page reference.
              </p>
            </div>
            <Button asChild variant="soft"><a href="/guides/hospital-discharge-medicare-quick-guide.pdf" target="_blank" rel="noopener noreferrer">Open PDF</a></Button>
          </div>
        </section>
      </div>
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

export default HospitalDischargeMedicareChecklistPage;
