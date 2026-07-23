import { Link, Navigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  ListChecks,
  Printer,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { ContentFreshness } from "@/components/shared/ContentFreshness";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { ActionPlanCard, GuideSection, MedicationCard, TestCard } from "@/components/patients/DiagnosisGuideBlocks";
import { DIAGNOSIS_EXPLAINED_ROUTE } from "@/data/diagnosisGuideFramework";
import { getConditionGuide } from "@/data/conditionGuides";

const sectionLinks = [
  ["#meaning", "Meaning"], ["#patterns", "Patterns"], ["#causes", "Causes"], ["#tests", "Tests"],
  ["#treatment", "Treatment"], ["#medications", "Medicines"], ["#procedures", "Procedures"],
  ["#daily-plan", "Daily plan"], ["#action-plan", "When to get help"], ["#questions", "Questions"], ["#sources", "Sources"],
] as const;

const ConditionGuidePage = () => {
  const { slug } = useParams();
  const guide = getConditionGuide(slug);
  if (!guide) return <Navigate to="/patients-families" replace />;

  const quickPaths = [
    { href: "#meaning", label: "Understand the diagnosis", detail: `Start with the 30-second explanation and the most useful ${guide.patternEyebrow.toLowerCase()}.`, icon: Stethoscope },
    { href: "#medications", label: "Understand the medicines", detail: "Learn the job of each treatment group before trying to memorize names.", icon: BookOpen },
    { href: "#daily-plan", label: "Know what to do each day", detail: "Turn the plan into specific monitoring, access, follow-up, and barrier checks.", icon: ListChecks },
    { href: "#action-plan", label: "Know when to get help", detail: "Separate emergency symptoms from changes that need a prompt care-team call.", icon: AlertTriangle },
  ] as const;

  return (
    <>
      <div className="print:hidden">
        <nav className="container py-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/">Home</Link></li><li aria-hidden="true">/</li>
            <li><Link to="/patients-families">Patients &amp; Caregivers</Link></li><li aria-hidden="true">/</li>
            <li><Link to={DIAGNOSIS_EXPLAINED_ROUTE}>Diagnosis, Explained</Link></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">{guide.shortTitle}</li>
          </ol>
        </nav>

        <PageHero eyebrow="Diagnosis, Explained · Published guide" title={guide.title} description={guide.subtitle}>
          <Button asChild variant="hero" size="lg"><a href="#quick-start">Choose what you need <ArrowRight className="h-4 w-4" /></a></Button>
          <Button type="button" variant="outline" size="lg" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print the concise handout</Button>
        </PageHero>

        <section className="border-b border-primary/20 bg-primary-soft/35 py-4" aria-labelledby="clinical-review-status">
          <div className="container flex max-w-5xl items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 id="clinical-review-status" className="font-display text-base font-bold">Nurse review complete</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">This source-checked educational guide completed clinical review before public release. It supports understanding and care-team questions; it does not replace individualized diagnosis, treatment, medication, or emergency instructions.</p>
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

        <section id="quick-start" className="container max-w-5xl pb-8" aria-labelledby="quick-start-title">
          <div className="rounded-3xl border border-primary/20 bg-primary-soft/25 p-6 shadow-card md:p-8">
            <div className="max-w-2xl"><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Three-minute entry point</div><h2 id="quick-start-title" className="mt-2 font-display text-2xl font-bold md:text-3xl">Choose what you need right now</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">The detailed guide remains below. These four paths move directly to the needs patients and caregivers most often have after diagnosis or discharge.</p></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {quickPaths.map(({ href, label, detail, icon: Icon }) => <a key={href} href={href} className="group rounded-2xl border border-primary/15 bg-background p-5 transition hover:border-primary/40 hover:shadow-card"><div className="flex items-start gap-4"><div className="rounded-xl bg-primary-soft p-2.5 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><div><h3 className="font-display font-bold group-hover:text-primary">{label}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p></div></div></a>)}
            </div>
          </div>
        </section>

        <section className="container max-w-5xl pb-4"><nav aria-label="On this page" className="rounded-2xl border border-border bg-card p-4 shadow-card"><div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">Complete guide</div><div className="flex flex-wrap gap-2">{sectionLinks.map(([href, label]) => <a key={href} href={href} className="rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary">{label}</a>)}</div></nav></section>

        <div className="container max-w-5xl space-y-20 py-12 md:py-16">
          <GuideSection id="meaning" eyebrow="Start here" title={`What ${guide.diagnosisName} actually means`} description="One usable mental model before the tests, medicine names, and procedures.">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary-soft/75 via-card to-card p-6 shadow-card md:p-8"><div className="flex items-center gap-3 text-primary"><Stethoscope className="h-6 w-6" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">{guide.quickExplanation.title}</h3></div><p className="mt-5 text-lg leading-relaxed text-foreground/90">{guide.quickExplanation.body}</p><div className="mt-6 rounded-2xl border border-primary/20 bg-background/80 p-5"><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A sentence you can repeat</div><p className="mt-2 font-medium leading-relaxed">{guide.quickExplanation.repeatBack}</p></div></article>
              <aside className="rounded-3xl border border-border bg-card p-6 md:p-8"><h3 className="font-display text-xl font-bold">What it does not automatically mean</h3><ul className="mt-5 space-y-3">{guide.doesNotMean.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}</ul></aside>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{guide.terms.map((item) => <article key={item.term} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-display font-bold">{item.term}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.meaning}</p></article>)}</div>
          </GuideSection>

          <GuideSection id="patterns" eyebrow={guide.patternEyebrow} title={guide.patternTitle} description={guide.patternDescription}>
            <div className="grid gap-5 lg:grid-cols-3">{guide.patterns.map((item) => <article key={item.name} className="rounded-3xl border border-border bg-card p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">{item.shortLabel}</div><h3 className="mt-2 font-display text-xl font-bold">{item.name}</h3><p className="mt-4 font-medium leading-relaxed">{item.plainEnglish}</p><p className="mt-5 rounded-2xl bg-muted/35 p-4 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Why it matters: </strong>{item.whyItMatters}</p></article>)}</div>
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><BookOpen className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />{guide.patternNote}</div>
          </GuideSection>

          <GuideSection id="causes" eyebrow="Possible causes and contributors" title="What can contribute to this diagnosis" description="These categories help organize questions; they do not identify one reader’s cause."><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{guide.causes.map((item) => <article key={item.title} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-display text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.examples}</p></article>)}</div><div className="mt-6 rounded-2xl border border-warning/30 bg-warning-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Important boundary: </strong>{guide.causeBoundary}</div></GuideSection>

          <GuideSection id="tests" eyebrow="Evaluation" title="What each common test is trying to answer" description="A test is easier to understand when the clinical question comes first."><div className="space-y-4">{guide.tests.map((test) => <TestCard key={test.name} test={test} />)}</div></GuideSection>

          <GuideSection id="treatment" eyebrow="Treatment goals" title="Start with what treatment is trying to accomplish" description="The medicine and procedure list makes more sense after the goals are clear."><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{guide.treatmentGoals.map((goal) => <article key={goal.title} className="rounded-2xl border border-border bg-card p-5"><CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" /><h3 className="mt-3 font-display font-bold">{goal.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{goal.explanation}</p></article>)}</div>{guide.treatmentNote && <div className="mt-6 rounded-2xl border border-secondary/20 bg-secondary-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Treatment framework: </strong>{guide.treatmentNote}</div>}</GuideSection>

          <GuideSection id="medications" eyebrow="Medication decoder" title="Understand the job before memorizing the name" description="Each card separates purpose, examples, monitoring, questions, and the medication boundary."><div className="space-y-4">{guide.medications.map((medication, index) => <MedicationCard key={medication.id} medication={medication} defaultOpen={index === 0} />)}</div></GuideSection>

          <GuideSection id="procedures" eyebrow="Procedures and supportive care" title="Some problems require a device, procedure, operation, or specialist pathway" description="The care team determines candidacy and timing."><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{guide.procedures.map((item) => <article key={item.name} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-display font-bold">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.explanation}</p></article>)}</div></GuideSection>

          <GuideSection id="daily-plan" eyebrow="Daily management" title="The practical work between appointments" description="A short operating plan is easier to use than a long lifestyle paragraph."><div className="grid gap-4 md:grid-cols-2">{guide.dailyPlan.map((item, index) => <article key={item.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-extrabold text-primary">{index + 1}</div><div><h3 className="font-display font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.details}</p></div></article>)}</div></GuideSection>

          <GuideSection id="action-plan" eyebrow="Action plan" title="Separate emergencies from changes that need a prompt call" description="The patient’s written plan controls; these categories organize the conversation."><div className="space-y-5">{guide.actionPlan.map((level) => <ActionPlanCard key={level.id} level={level} />)}</div></GuideSection>

          <GuideSection id="questions" eyebrow="Prepare and confirm" title="Questions and teach-back"><div className="grid gap-6 lg:grid-cols-2"><article className="rounded-3xl border border-border bg-card p-6 md:p-8"><div className="flex items-center gap-3"><ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">Questions to take to the care team</h3></div><ol className="mt-6 space-y-3">{guide.questions.map((question, index) => <li key={question} className="flex gap-3 text-sm leading-relaxed text-muted-foreground"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{question}</li>)}</ol></article><article className="rounded-3xl border border-primary/20 bg-primary-soft/35 p-6 md:p-8"><div className="flex items-center gap-3"><ListChecks className="h-6 w-6 text-primary" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">Teach-back check</h3></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">A useful introduction is: “I want to make sure I explained this clearly. Please show me or tell me what you will do when you are home.”</p><ul className="mt-6 space-y-3">{guide.teachBack.map((item) => <li key={item} className="flex items-start gap-3 rounded-xl border border-primary/15 bg-background/75 p-4 text-sm leading-relaxed text-muted-foreground"><span className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-primary/45" aria-hidden="true" />{item}</li>)}</ul></article></div></GuideSection>

          <GuideSection id="sources" eyebrow="Trust and verification" title="Sources used to build this guide" description="Professional guidance leads consequential claims; official patient resources support wording; major health sites are comparators."><div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><SourceList sources={guide.sources} /><div className="space-y-4"><aside className="rounded-2xl border border-primary/25 bg-primary-soft/35 p-5 text-sm leading-relaxed text-muted-foreground"><div className="font-bold text-foreground">Review status</div><p className="mt-2">This guide completed nurse review before publication. Source links, review dates, educational boundaries, and the next scheduled review remain visible for ongoing governance.</p></aside><Button asChild variant="outline" className="w-full justify-between"><a href={guide.benchmarkUrl} target="_blank" rel="noopener noreferrer">View the {guide.benchmarkName} <ExternalLink className="h-4 w-4" /></a></Button><Button asChild variant="soft" className="w-full justify-between"><Link to={DIAGNOSIS_EXPLAINED_ROUTE}>How this guide is governed <ArrowRight className="h-4 w-4" /></Link></Button></div></div><div className="mt-8"><DisclaimerBox /></div></GuideSection>
        </div>
      </div>

      <section className="hidden print:block print:p-0" aria-label={`Concise ${guide.diagnosisName} handout`}>
        <header className="border-b-2 border-black pb-3"><div className="text-xs font-bold uppercase tracking-wider">Community Acquired Finance · Published guide</div><h1 className="mt-2 text-3xl font-bold">{guide.shortTitle}: concise care handout</h1><p className="mt-2 text-sm">Source-checked, nurse-reviewed educational handout. The treating team’s written plan controls.</p></header>
        <div className="mt-5 grid grid-cols-2 gap-5 text-sm">
          <section className="col-span-2 rounded border border-black p-4"><h2 className="text-lg font-bold">Diagnosis in one sentence</h2><p className="mt-2">{guide.quickExplanation.repeatBack}</p></section>
          <section><h2 className="text-lg font-bold">Labels to confirm</h2><ul className="mt-2 space-y-2">{guide.patterns.map((item) => <li key={item.name}><strong>{item.name}:</strong> {item.shortLabel}</li>)}</ul></section>
          <section><h2 className="text-lg font-bold">Medicine jobs</h2><ul className="mt-2 space-y-2">{guide.medications.map((item) => <li key={item.id}><strong>{item.name}:</strong> {item.job}</li>)}</ul></section>
          <section><h2 className="text-lg font-bold">Daily operating plan</h2><ul className="mt-2 list-disc space-y-1 pl-5">{guide.dailyPlan.map((item) => <li key={item.title}><strong>{item.title}.</strong> {item.details}</li>)}</ul></section>
          <section><h2 className="text-lg font-bold">When to get help</h2><div className="mt-2"><strong>Call 911 now:</strong><ul className="mt-1 list-disc pl-5">{guide.actionPlan[0].signs.map((sign) => <li key={sign}>{sign}</li>)}</ul></div><div className="mt-3"><strong>Contact the care team promptly:</strong><ul className="mt-1 list-disc pl-5">{guide.actionPlan[1].signs.slice(0, 5).map((sign) => <li key={sign}>{sign}</li>)}</ul></div></section>
          <section className="col-span-2 border-t border-black pt-4"><h2 className="text-lg font-bold">Five questions to leave answered</h2><ol className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 list-decimal pl-5">{guide.questions.slice(0, 5).map((question) => <li key={question}>{question}</li>)}</ol><p className="mt-4 font-semibold">{guide.printBoundary}</p></section>
        </div>
      </section>
    </>
  );
};

export default ConditionGuidePage;
