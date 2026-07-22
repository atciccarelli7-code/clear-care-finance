import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  HeartPulse,
  ListChecks,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { ContentFreshness } from "@/components/shared/ContentFreshness";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { ActionPlanCard, GuideSection, MedicationCard, TestCard } from "@/components/patients/DiagnosisGuideBlocks";
import { DIAGNOSIS_EXPLAINED_ROUTE } from "@/data/diagnosisGuideFramework";
import { HEART_FAILURE_GUIDE } from "@/data/heartFailureGuide";

const sectionLinks = [
  ["#meaning", "Meaning"], ["#types", "Types"], ["#causes", "Causes"], ["#tests", "Tests"],
  ["#treatment", "Treatment"], ["#medications", "Medications"], ["#daily-plan", "Daily plan"],
  ["#action-plan", "When to get help"], ["#questions", "Questions"], ["#sources", "Sources"],
] as const;

const HeartFailureGuidePage = () => {
  const guide = HEART_FAILURE_GUIDE;

  return (
    <>
      <nav className="container py-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/">Home</Link></li><li aria-hidden="true">/</li>
          <li><Link to="/patients-families">Patients &amp; Caregivers</Link></li><li aria-hidden="true">/</li>
          <li><Link to={DIAGNOSIS_EXPLAINED_ROUTE}>Diagnosis, Explained</Link></li><li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-foreground">Heart Failure</li>
        </ol>
      </nav>

      <PageHero eyebrow="Diagnosis, Explained · Clinical-review preview" title={guide.title} description={guide.subtitle}>
        <Button asChild variant="hero" size="lg"><a href="#meaning">Start with the explanation <ArrowRight className="h-4 w-4" /></a></Button>
        <Button type="button" variant="outline" size="lg" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print or save</Button>
      </PageHero>

      <section className="border-b border-warning/25 bg-warning-soft/45 py-4" aria-labelledby="clinical-review-status">
        <div className="container flex max-w-5xl items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" aria-hidden="true" />
          <div>
            <h2 id="clinical-review-status" className="font-display text-base font-bold">Independent clinical review is still pending</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">This is a complete source-checked product preview, not a finalized clinical handout. It remains noindex and ad-free until a qualified independent reviewer verifies the condition-specific medication, monitoring, and emergency language.</p>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <ContentFreshness lastReviewedAt={guide.updatedAt} nextReviewAt={guide.nextReviewAt} timeSensitive reviewScope={guide.reviewScope} />
          <aside className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground" aria-label="Guide boundary">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><div className="font-bold text-foreground">Education after diagnosis—not diagnosis by website</div><p className="mt-2">{guide.boundary}</p></div></div>
          </aside>
        </div>
      </section>

      <section className="container max-w-5xl pb-4 print:hidden">
        <nav aria-label="On this page" className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">On this page</div>
          <div className="flex flex-wrap gap-2">{sectionLinks.map(([href, label]) => <a key={href} href={href} className="rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary">{label}</a>)}</div>
        </nav>
      </section>

      <div className="container max-w-5xl space-y-20 py-12 md:py-16">
        <GuideSection id="meaning" eyebrow="Start here" title="What heart failure actually means" description="One usable mental model before the acronyms, tests, and medication names.">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary-soft/75 via-card to-card p-6 shadow-card md:p-8">
              <div className="flex items-center gap-3 text-primary"><HeartPulse className="h-6 w-6" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">{guide.quickExplanation.title}</h3></div>
              <p className="mt-5 text-lg leading-relaxed text-foreground/90">{guide.quickExplanation.body}</p>
              <div className="mt-6 rounded-2xl border border-primary/20 bg-background/80 p-5"><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A sentence you can repeat</div><p className="mt-2 font-medium leading-relaxed">{guide.quickExplanation.repeatBack}</p></div>
            </article>
            <aside className="rounded-3xl border border-border bg-card p-6 md:p-8"><h3 className="font-display text-xl font-bold">What it does not automatically mean</h3><ul className="mt-5 space-y-3">{guide.doesNotMean.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}</ul></aside>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{guide.terms.map((item) => <article key={item.term} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-display font-bold">{item.term}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.meaning}</p></article>)}</div>
        </GuideSection>

        <GuideSection id="types" eyebrow="Types" title="The same diagnosis can describe different heart problems" description="Treatment makes more sense after the patient knows which broad type the care team is treating.">
          <div className="grid gap-5 lg:grid-cols-3">{guide.types.map((item) => <article key={item.abbreviation} className="rounded-3xl border border-border bg-card p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">{item.abbreviation}</div><h3 className="mt-2 font-display text-xl font-bold">{item.name}</h3><p className="mt-4 font-medium leading-relaxed">{item.plainEnglish}</p><p className="mt-5 rounded-2xl bg-muted/35 p-4 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Why it matters: </strong>{item.whyItMatters}</p></article>)}</div>
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><BookOpen className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />{guide.typeNote}</div>
        </GuideSection>

        <GuideSection id="causes" eyebrow="Possible causes" title="What can cause or contribute to heart failure" description="These are cause categories—not an online conclusion about one person's heart.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{guide.causes.map((item) => <article key={item.title} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-display text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.examples}</p></article>)}</div>
          <div className="mt-6 rounded-2xl border border-warning/30 bg-warning-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Important boundary: </strong>{guide.causeBoundary}</div>
        </GuideSection>

        <GuideSection id="tests" eyebrow="Evaluation" title="What each common test is trying to answer" description="A test name is easier to remember when the patient understands the clinical question behind it.">
          <div className="space-y-4">{guide.tests.map((test) => <TestCard key={test.name} test={test} />)}</div>
        </GuideSection>

        <GuideSection id="treatment" eyebrow="Treatment goals" title="Start with what treatment is trying to accomplish" description="The medication and procedure list becomes easier to understand after the goals are clear.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{guide.treatmentGoals.map((goal) => <article key={goal.title} className="rounded-2xl border border-border bg-card p-5"><CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" /><h3 className="mt-3 font-display font-bold">{goal.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{goal.explanation}</p></article>)}</div>
          <div className="mt-6 rounded-2xl border border-secondary/20 bg-secondary-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Reduced-EF treatment framework: </strong>{guide.reducedEfFoundation}</div>
        </GuideSection>

        <GuideSection id="medications" eyebrow="Medication decoder" title="Understand the job before memorizing the drug name" description="Each card separates purpose, common examples, monitoring, questions, and the safety boundary.">
          <div className="space-y-4">{guide.medications.map((medication, index) => <MedicationCard key={medication.id} medication={medication} defaultOpen={index === 0} />)}</div>
        </GuideSection>

        <GuideSection eyebrow="Devices and procedures" title="Some treatments solve a specific structural, electrical, or advanced problem" description="Not every person needs a procedure or device.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{guide.procedures.map((item) => <article key={item.name} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-display font-bold">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.explanation}</p></article>)}</div>
        </GuideSection>

        <GuideSection id="daily-plan" eyebrow="Daily management" title="The practical work between appointments" description="A short operating plan is easier to use than a long lifestyle paragraph.">
          <div className="grid gap-4 md:grid-cols-2">{guide.dailyPlan.map((item, index) => <article key={item.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-extrabold text-primary">{index + 1}</div><div><h3 className="font-display font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.details}</p></div></article>)}</div>
        </GuideSection>

        <GuideSection id="action-plan" eyebrow="Action plan" title="Separate emergencies from changes that need a prompt call" description="The patient's own written action plan controls. These categories organize the conversation.">
          <div className="space-y-5">{guide.actionPlan.map((level) => <ActionPlanCard key={level.id} level={level} />)}</div>
        </GuideSection>

        <GuideSection id="questions" eyebrow="Prepare and confirm" title="Questions and teach-back">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-border bg-card p-6 md:p-8"><div className="flex items-center gap-3"><ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">Questions to take to the care team</h3></div><ol className="mt-6 space-y-3">{guide.questions.map((question, index) => <li key={question} className="flex gap-3 text-sm leading-relaxed text-muted-foreground"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{question}</li>)}</ol></article>
            <article className="rounded-3xl border border-primary/20 bg-primary-soft/35 p-6 md:p-8"><div className="flex items-center gap-3"><ListChecks className="h-6 w-6 text-primary" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">Teach-back check</h3></div><ul className="mt-6 space-y-3">{guide.teachBack.map((item) => <li key={item} className="flex items-start gap-3 rounded-xl border border-primary/15 bg-background/75 p-4 text-sm leading-relaxed text-muted-foreground"><span className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-primary/45" aria-hidden="true" />{item}</li>)}</ul></article>
          </div>
        </GuideSection>

        <GuideSection id="sources" eyebrow="Trust and verification" title="Sources used to build this guide" description="Professional guidelines and patient resources support the content; Mayo Clinic was used as the external coverage benchmark.">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><SourceList sources={guide.sources} /><div className="space-y-4"><aside className="rounded-2xl border border-warning/30 bg-warning-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><div className="font-bold text-foreground">Clinical-review gate</div><p className="mt-2">The product will not be marked clinically final or opened to search indexing until an independent qualified reviewer is named and the review scope is recorded.</p></aside><Button asChild variant="outline" className="w-full justify-between"><a href="https://www.mayoclinic.org/diseases-conditions/heart-failure/diagnosis-treatment/drc-20373148" target="_blank" rel="noopener noreferrer">View the Mayo benchmark <ExternalLink className="h-4 w-4" /></a></Button><Button asChild variant="soft" className="w-full justify-between"><Link to={DIAGNOSIS_EXPLAINED_ROUTE}>How this guide is governed <ArrowRight className="h-4 w-4" /></Link></Button></div></div>
          <div className="mt-8"><DisclaimerBox /></div>
        </GuideSection>
      </div>
    </>
  );
};

export default HeartFailureGuidePage;
