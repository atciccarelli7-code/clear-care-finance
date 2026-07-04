import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardCheck, Home, Hospital, PhoneCall, Printer, Shield } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

const beforeDischargeQuestions = [
  "What level of care is being recommended: home, home health, SNF/STR, inpatient rehab, assisted living, or long-term care?",
  "What exactly has insurance approved, denied, or not decided yet?",
  "Is prior authorization required? If yes, what is the reference number and current status?",
  "Which facility, agency, supplier, pharmacy, or transport company is in network?",
  "What is the expected patient cost: deductible, copay, coinsurance, daily rate, private-pay price, or noncovered item?",
  "What is the backup plan if authorization, placement, equipment delivery, or home health acceptance fails?",
];

const serviceQuestions = [
  {
    title: "DME / equipment",
    icon: Shield,
    questions: [
      "Who is writing the order?",
      "Which supplier is covered or in network?",
      "Is the item rental or purchase?",
      "Can it be delivered before discharge?",
    ],
  },
  {
    title: "SNF / STR",
    icon: Hospital,
    questions: [
      "What skilled need supports the stay?",
      "How many days are approved right now?",
      "What is the daily copay?",
      "What happens if progress stalls?",
    ],
  },
  {
    title: "Home health",
    icon: Home,
    questions: [
      "Which agency accepted?",
      "When is the first visit expected?",
      "Which services are ordered?",
      "What help is not covered?",
    ],
  },
  {
    title: "Insurance / appeal",
    icon: PhoneCall,
    questions: [
      "What rule or criteria was not met?",
      "Can we get the denial in writing?",
      "Is expedited appeal available?",
      "What documentation could change the decision?",
    ],
  },
];

const noteRows = ["Name / role", "Phone number", "Reference number", "What they said", "Next step / deadline"];

const DischargePrintableChecklistPage = () => {
  useSeo({
    title: "Printable Hospital Discharge Coverage Checklist",
    description:
      "A print-friendly hospital discharge coverage checklist for families to ask about DME, short-term rehab, home health, authorization, network status, patient cost, and backup plans.",
    canonicalPath: "/insurance/hospital-discharge-coverage/printable",
  });

  const handlePrint = () => {
    trackSiteEvent("print_click", { page: "discharge_printable", item: "before_discharge_checklist" });
    window.print();
  };

  return (
    <>
      <PageHero
        eyebrow="Printable checklist"
        title="Before Discharge: What to Ask Today"
        description="A family-facing checklist for DME, STR/SNF, home health, authorization, network status, patient cost, and backup plans. Print it or save it as a PDF before calling the case manager or insurer."
      >
        <Button type="button" variant="hero" size="lg" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> Print / save as PDF
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/insurance/hospital-discharge-coverage" onClick={() => trackSiteEvent("pathway_click", { page: "discharge_printable", destination: "full_discharge_guide" })}>
            Full guide <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <main className="container space-y-12 py-12 md:py-16 print:space-y-6 print:py-4">
        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/25 p-5 shadow-card md:p-8 print:border print:bg-white print:p-4 print:shadow-none">
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Use this first</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight print:text-2xl">The six questions that prevent discharge confusion</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground print:text-black">
                The goal is not to argue. The goal is to identify the payer rule, missing step, patient cost, and backup option before the patient leaves.
              </p>
            </div>
            <ol className="grid gap-3 print:gap-2">
              {beforeDischargeQuestions.map((question, index) => (
                <li key={question} className="flex gap-3 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground print:bg-white print:p-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">{index + 1}</span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Service-specific questions"
            title="Ask the right question for the service being denied or delayed"
            description="Use the section that matches the discharge problem. Not every family needs every question."
          />
          <div className="grid gap-5 md:grid-cols-2 print:grid-cols-2 print:gap-3">
            {serviceQuestions.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="rounded-3xl border-border/80 shadow-card print:rounded-xl print:shadow-none">
                  <CardHeader className="print:p-3">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary print:h-8 print:w-8">
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="font-display text-xl leading-tight print:text-base">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="print:p-3 print:pt-0">
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground print:text-xs print:text-black">
                      {section.questions.map((question) => (
                        <li key={question} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 print:h-3 print:w-3" />
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8 print:rounded-xl print:bg-white print:p-4 print:shadow-none">
          <div className="mb-4 flex items-center gap-2 font-display text-2xl font-bold print:text-lg">
            <ClipboardCheck className="h-5 w-5 text-primary" /> Call notes
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm print:min-w-0 print:text-xs">
              <caption className="sr-only">Hospital discharge call notes table</caption>
              <thead>
                <tr className="border-b border-border bg-muted/40 print:bg-white">
                  {noteRows.map((row) => (
                    <th key={row} scope="col" className="p-3 font-bold print:p-2">{row}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3].map((row) => (
                  <tr key={row} className="border-b border-border/70 last:border-0">
                    {noteRows.map((cell) => (
                      <td key={cell} className="h-14 p-3 align-top print:h-10 print:p-2">&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 print:hidden">
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Need the full explanation?</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Open the full guide for the coverage translator, SNF/STR rules, discharge checklist builder, and denial explanations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="hero">
                <Link to="/insurance/hospital-discharge-coverage" onClick={() => trackSiteEvent("pathway_click", { page: "discharge_printable", destination: "hospital_discharge_coverage" })}>
                  Open full guide
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Coverage denied?</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Use the prior authorization guide when a plan says a medication, imaging test, procedure, rehab stay, DME, or service needs approval or was denied.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/insurance/prior-authorization-guide" onClick={() => trackSiteEvent("pathway_click", { page: "discharge_printable", destination: "prior_authorization" })}>
                  Prior authorization guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default DischargePrintableChecklistPage;
