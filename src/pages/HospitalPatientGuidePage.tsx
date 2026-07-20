import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeDollarSign, BookOpenCheck, CheckCircle2, ClipboardList, HeartPulse, Home, Pill, ShieldCheck, Stethoscope, Wind } from "lucide-react";
import DischargeReadinessSystem from "@/components/patients/DischargeReadinessSystem";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { CONSUMER_PATIENT_GUIDE_CARDS } from "@/data/consumerPatientGuideArticles";
import { trackSiteEvent } from "@/lib/analytics";

const guideIcons = [ClipboardList, Pill, Wind, HeartPulse, Home] as const;

const finderOptions = [
  ["leaving", "I am preparing to leave the hospital", "safe-hospital-discharge-first-72-hours"],
  ["caregiver", "I am helping during the first three days at home", "safe-hospital-discharge-first-72-hours"],
  ["blood-thinner", "I have questions about a blood thinner", "blood-thinner-safety-before-going-home"],
  ["copd", "I am recovering after a COPD-related visit", "copd-recovery-after-hospital"],
  ["heart-failure", "I have a heart-failure discharge plan", "heart-failure-plan-after-discharge"],
  ["oxygen", "I am using new oxygen or a nebulizer", "new-home-oxygen-nebulizer-guide"],
] as const;

type FinderId = (typeof finderOptions)[number][0];

const relatedHelp = [
  [BadgeDollarSign, "Hospital discharge coverage", "Rehabilitation, home health, equipment, prescriptions, authorization, and backup care.", "/insurance/hospital-discharge-coverage"],
  [ShieldCheck, "Medicare discharge checklist", "Hospital status, skilled-care requirements, networks, authorization, costs, and notices.", "/tools/hospital-discharge-medicare-checklist"],
  [BookOpenCheck, "Medical bill review toolkit", "Compare the bill, EOB, allowed amount, insurer processing, network status, and assistance.", "/insurance/medical-bill-review-toolkit"],
  [Stethoscope, "Observation versus inpatient status", "Understand why hospital location does not determine admission status or coverage.", "/articles/observation-vs-inpatient-status"],
] as const;

const HospitalPatientGuidePage = () => {
  const [selectedId, setSelectedId] = useState<FinderId | null>(null);
  const selected = finderOptions.find(([id]) => id === selectedId);
  const selectedGuide = CONSUMER_PATIENT_GUIDE_CARDS.find((guide) => guide.id === selected?.[2]);

  const chooseGuide = (id: FinderId) => {
    setSelectedId(id);
    trackSiteEvent("patient_guide_finder_selected", { item_id: id, guide_id: id });
  };

  return (
    <>
      <nav className="container py-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/patients-families" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Patients &amp; Caregivers</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-foreground">Hospital &amp; Patient Guide</li>
        </ol>
      </nav>

      <PageHero
        eyebrow="Hospital & Patient Guide"
        title="Know what to verify, what to ask, and what needs an owner before you go home."
        description="RN-led, source-backed consumer guides for discharge, medicines, COPD recovery, heart failure, home oxygen, follow-up, insurance, and the first days at home."
      >
        <Button asChild variant="hero" size="lg" className="bg-foreground text-background hover:bg-foreground/90"><a href="#guide-finder">Find the right guide <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><a href="#guide-library">Browse all five guides</a></Button>
      </PageHero>

      <section className="border-b border-border bg-amber-50/70 py-6 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100" aria-labelledby="guide-boundary-title">
        <div className="container flex max-w-5xl items-start gap-4">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
          <div>
            <h2 id="guide-boundary-title" className="font-display text-lg font-bold">Education and preparation—not personalized medical instructions</h2>
            <p className="mt-1 text-sm leading-relaxed">The treating team’s written instructions control. These guides do not diagnose, change treatment, set oxygen flow, provide medication doses or missed-dose rules, or decide whether a symptom is an emergency.</p>
          </div>
        </div>
      </section>

      <section id="guide-finder" className="container max-w-6xl scroll-mt-24 py-12 md:py-16" aria-labelledby="finder-title">
        <SectionHeading centered eyebrow="Private guide finder" title="Which situation is closest to yours?" description="Choose one fixed option. Nothing is submitted, stored on a server, or used to make a medical recommendation." />
        <div className="mt-8 grid gap-3 md:grid-cols-2" role="group" aria-label="Choose a guide situation">
          {finderOptions.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={selectedId === id} onClick={() => chooseGuide(id)} className={`min-h-16 rounded-2xl border p-4 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selectedId === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40 hover:shadow-sm"}`}>
              {label}
            </button>
          ))}
        </div>
        {selectedGuide && (
          <div className="mt-6 rounded-3xl border border-primary/25 bg-primary-soft/25 p-6" aria-live="polite">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Suggested starting point</div>
            <h2 className="mt-2 font-display text-2xl font-bold">{selectedGuide.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedGuide.summary}</p>
            <Button asChild className="mt-5"><Link to={selectedGuide.route}>Open the guide <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        )}
      </section>

      <section id="guide-library" className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="guide-library-title">
        <div className="container max-w-7xl">
          <SectionHeading centered eyebrow="Five-guide consumer library" title="Structured help for the parts of discharge that commonly become confusing" description="Each guide uses the same anatomy: the most important thing, what to verify, questions to ask, when the plan breaks, sources, and visible review limits." />
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {CONSUMER_PATIENT_GUIDE_CARDS.map((guide, index) => {
              const Icon = guideIcons[index] ?? CheckCircle2;
              return (
                <article key={guide.id} className="flex flex-col rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary">Guide {index + 1}</div>
                  <h2 className="mt-2 font-display text-xl font-bold leading-tight">{guide.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{guide.reviewStatus}</p>
                  <Link to={guide.route} className="mt-5 inline-flex items-center gap-2 rounded text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Read the guide <ArrowRight className="h-4 w-4" /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <DischargeReadinessSystem />

      <section className="container max-w-7xl py-14 md:py-20" aria-labelledby="related-help-title">
        <SectionHeading centered eyebrow="Costs, coverage, and next steps" title="Connect the clinical handoff to the financial and insurance questions" description="A workable home plan also depends on coverage, pharmacy access, equipment, transportation, rehabilitation, and written notices." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {relatedHelp.map(([Icon, title, description, route]) => (
            <Link key={route} to={route} className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/35 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open resource <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container max-w-4xl pb-16 md:pb-20">
        <div className="rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">Trust markers on every guide</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <li>Author and accurate credentials</li><li>Published and reviewed dates</li><li>Review scope and limitations</li><li>Authoritative source links</li><li>No independent medical-review claim unless documented</li><li>Corrections and related resources</li>
          </ul>
        </div>
        <div className="mt-6"><DisclaimerBox /></div>
      </section>
    </>
  );
};

export default HospitalPatientGuidePage;
