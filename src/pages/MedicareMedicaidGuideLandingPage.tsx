import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, FileText, HelpCircle, Hospital, ListChecks, ReceiptText, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const quickGuideHref = "/guides/hospital-discharge-medicare-quick-guide.pdf";

const whoThisGuideIsFor = [
  "A family member trying to understand discharge instructions before a patient leaves the hospital.",
  "A caregiver comparing rehab, SNF, home health, equipment, medication, or long-term care next steps.",
  "A patient or spouse facing a Medicare Advantage denial, pending authorization, or confusing plan notice.",
  "A healthcare worker who wants a plain-English handout for the money and paperwork side of discharge.",
  "Anyone reviewing a medical bill, MSN, EOB, or patient balance before paying.",
] as const;

const guideChecks = [
  ["Discharge plan", "What is being recommended, when is it supposed to happen, and who is arranging it?"],
  ["Hospital status", "Is the patient inpatient, outpatient, or observation, and when did that status start?"],
  ["Rehab or SNF", "Is skilled care documented, is the facility appropriate, and has payment been approved?"],
  ["Home health", "Which services are ordered, which agency is involved, and what is not included?"],
  ["Equipment and medications", "Are orders, suppliers, prescriptions, and timing confirmed before the patient goes home?"],
  ["Medicare vs. Medicaid", "Is the problem about skilled care, custodial help, long-term care, or state Medicaid rules?"],
  ["Plan decisions", "If a plan says no or delays care, what notice, reason, and appeal deadline apply?"],
  ["Medical bills", "Does the bill match the EOB, MSN, provider statement, and patient responsibility?"],
] as const;

const pageTopics = [
  "What should I do before discharge?",
  "Is the patient inpatient or observation?",
  "What should I ask before rehab or SNF transfer?",
  "What does home health actually include?",
  "What equipment and medications need to be ready?",
  "When does Medicare stop and Medicaid or long-term care become the question?",
  "What if a Medicare Advantage plan says no or authorization is pending?",
  "How do I check a medical bill before paying?",
  "What documents should I keep?",
  "Who should I call, and what should I say?",
] as const;

const internalLinks = [
  ["Interactive hospital discharge checklist", "/tools/hospital-discharge-medicare-checklist"],
  ["Hospital discharge coverage guide", "/articles/discharge-coverage-guide"],
  ["Observation vs. inpatient status", "/articles/observation-vs-inpatient-status"],
  ["Medicare rehab after a hospital stay", "/articles/does-medicare-cover-rehab-after-hospital-stay"],
  ["Home health after discharge", "/articles/home-health-after-discharge"],
  ["Durable medical equipment after discharge", "/articles/durable-medical-equipment-after-discharge"],
  ["Medicare vs. Medicaid", "/articles/medicare-vs-medicaid-what-is-the-difference"],
  ["Medical bill review toolkit", "/insurance/medical-bill-review-toolkit"],
  ["EOB-to-bill match checker", "/tools/eob-to-bill-match-checker"],
] as const;

const actionCards = [
  {
    icon: Hospital,
    title: "Before discharge",
    description: "Use the guide to slow the decision down: destination, payer, documents, supplies, prescriptions, and follow-up calls.",
  },
  {
    icon: ShieldCheck,
    title: "Before accepting a plan answer",
    description: "Separate what the care team recommends from what Original Medicare, Medicare Advantage, Medicaid, or another payer has approved.",
  },
  {
    icon: ReceiptText,
    title: "Before paying a bill",
    description: "Match the bill to the EOB, MSN, plan notice, provider statement, and written explanation of patient responsibility.",
  },
] as const;

const MedicareMedicaidGuideLandingPage = () => {
  useSeo({
    title: "Hospital Discharge & Medicare Quick Guide",
    description:
      "A plain-English hospital discharge and Medicare guide for families checking discharge plans, rehab, SNF care, home health, equipment, Medicare Advantage decisions, Medicaid, long-term care, and confusing medical bills.",
    canonicalPath: "/guides/hospital-discharge-medicare",
  });

  return (
    <main>
      <PageHero
        eyebrow="Plain-English hospital finance guide"
        title="Hospital Discharge & Medicare Quick Guide"
        description="A calm, printable guide for families who need to ask better questions before discharge, rehab or SNF transfer, home health, equipment and medication setup, Medicare Advantage denials, Medicaid or long-term care decisions, and confusing medical bills."
      >
        <Button asChild size="lg">
          <Link to="/tools/hospital-discharge-medicare-checklist">
            <ClipboardCheck className="h-4 w-4" />
            Use the interactive checklist
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={quickGuideHref} target="_blank" rel="noopener noreferrer">
            <FileText className="h-4 w-4" />
            Open the PDF guide
          </a>
        </Button>
      </PageHero>

      <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14" aria-label="Who this guide is for">
        <Card className="rounded-3xl border-border/80 bg-card shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Who this guide is for</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The person searching is often not the patient. This page is built for the family member, caregiver, patient, or healthcare worker trying to translate a fast hospital conversation into practical next steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {whoThisGuideIsFor.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-background/70 p-4 text-sm font-semibold leading-relaxed text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="What this guide helps you check">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Use it before the decision moves too fast"
            title="What this guide helps you check"
            description="The guide does not try to make you an insurance expert. It helps you identify the right document, payer, deadline, and next call."
            centered
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guideChecks.map(([title, description]) => (
              <Card key={title} className="rounded-3xl border-border/80 bg-card shadow-card">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg leading-tight">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-label="Interactive checklist callout">
        <Card className="rounded-3xl border-border/80 bg-primary-soft/30 shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Want a checklist based on your situation?</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The interactive tool asks where the patient is going, what coverage is involved, what the biggest concern is, and whether there is a written notice or bill. Then it gives a copy-friendly list of questions, documents, and calls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link to="/tools/hospital-discharge-medicare-checklist">
                Open the checklist tool
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-label="Guide page topics">
        <SectionHeading
          eyebrow="Inside the PDF"
          title="The 10 questions covered in the guide"
          description="Each page is written around one practical question, a direct answer, what to ask, what to keep, and a short script."
          centered
        />
        <div className="grid gap-3 md:grid-cols-2">
          {pageTopics.map((topic, index) => (
            <Card key={topic} className="rounded-2xl border-border/80 bg-card shadow-sm">
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <p className="self-center text-sm font-semibold leading-relaxed text-foreground">{topic}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <a href={quickGuideHref} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" />
              Open the full PDF
            </a>
          </Button>
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="When to use the guide">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Practical use cases"
            title="Use the guide before three common moments"
            description="The safest time to ask better questions is before a discharge plan, plan decision, or bill becomes harder to unwind."
            centered
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {actionCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="rounded-3xl border-border/80 bg-card shadow-card">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="font-display text-xl leading-tight">{card.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed md:text-base">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-label="Related resources">
        <SectionHeading
          eyebrow="Go deeper after the PDF"
          title="Related articles and tools"
          description="Use these pages when one part of the discharge, coverage, Medicaid, or billing question needs more detail."
          centered
        />
        <div className="grid gap-4 md:grid-cols-2">
          {internalLinks.map(([title, href]) => (
            <Link
              key={href}
              to={href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold shadow-sm transition-smooth hover:border-primary/40 hover:shadow-card"
            >
              <span>{title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="Educational disclaimer">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="rounded-3xl border-border/80 bg-card shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <HelpCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">Educational only</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                This guide is educational only. It does not replace Medicare.gov, Medicaid.gov, CMS materials, HealthCare.gov, state Medicaid agencies, plan documents, hospital staff, SHIP counselors, licensed insurance professionals, attorneys, tax professionals, or official written notices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm leading-relaxed text-muted-foreground">
                Do not treat this page as a plan recommendation, insurer ranking, legal opinion, medical advice, Medicaid planning advice, or promise of coverage. Verify the situation with the official source or professional who controls the decision.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/tools/hospital-discharge-medicare-checklist">
                    <ClipboardCheck className="h-4 w-4" />
                    Use checklist tool
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/disclosures">
                    Read disclosures
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <Card className="rounded-3xl border-border/80 bg-primary-soft/30 shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
              <ListChecks className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Built to make the next call clearer</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The main job of the guide is simple: help someone pause, name the situation correctly, save the right paperwork, ask the right question, and avoid paying or agreeing before the answer is verified.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
};

export default MedicareMedicaidGuideLandingPage;
