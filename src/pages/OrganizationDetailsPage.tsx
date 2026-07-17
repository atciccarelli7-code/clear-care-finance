import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  organizationMeasurementFramework,
  organizationProcurementRows,
  organizationPrograms,
} from "@/data/organizationOffering";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { useSeo } from "@/lib/seo";

const organizationNav = [
  ["Overview", "/for-organizations"],
  ["Programs", "/for-organizations/programs"],
  ["Implementation", "/for-organizations/implementation"],
  ["Measurement", "/for-organizations/measurement"],
  ["Trust & procurement", "/for-organizations/trust-procurement"],
  ["FAQ", "/for-organizations/faq"],
] as const;

const implementationGates = [
  ["Define", "Name one audience, one decision moment, one accountable owner, approved channels, and stop conditions."],
  ["Review", "Review the live product, sources, data flow, privacy, security, accessibility, legal scope, communications, and support path."],
  ["Prepare", "Approve launch copy, participant privacy notice, facilitator guidance, baseline, feedback pulse, and correction contacts."],
  ["Launch", "Use approved channels without a participant file; monitor support questions, accessibility, incidents, and corrections."],
  ["Learn", "Review reach, consented aggregate engagement, usefulness, limitations, and the evidence for expanding, revising, or stopping."],
] as const;

const buyerFaq = [
  ["What can an organization evaluate today?", "Every participant module linked from the Programs page is a released public product. Reviewers can use sample or non-identifying information without a gated demo or participant launch."],
  ["Is CAF a benefits administrator, care navigator, or case-management platform?", "No. CAF is an education and decision-preparation layer. It does not enroll participants, administer benefits, make eligibility or coverage determinations, deliver care, pay claims, or replace licensed professionals."],
  ["Does CAF need employee, patient, member, or student data?", "The current public offer is designed not to. Participants use public experiences without an account, and guided answers stay in the browser tab. Any proposed change requires a separate written data-flow review."],
  ["Is CAF HIPAA compliant or ready to sign a BAA?", "CAF makes no blanket HIPAA or BAA-readiness claim. The current offer is designed not to receive PHI. Any future business-associate analysis depends on the actual service and data flow and must be completed in writing before protected information is involved."],
  ["Does CAF have SOC 2 or HITRUST certification?", "No certification is represented on this site unless independently completed and documented. A buyer may request a scoped security review of the current public capability and its actual data flow."],
  ["Can content be customized to our plans or policies?", "Only after accountable owners and the applicable legal, privacy, benefits, clinical, accessibility, security, and communications reviewers are identified. Public content remains independent and educational."],
  ["What reporting is available?", "Begin with organization-owned reach data, consented aggregate fixed-ID engagement where available, operational issues, and an optional privacy-safe usefulness pulse. Participant answers and individual journeys are not exposed."],
  ["Can CAF prove savings, retention, claims reduction, better elections, or ROI?", "Not from the current evidence, and the public offer does not make those claims. Any outcome study requires a defined question, baseline, lawful data access, limitations, and an agreed evaluation method."],
  ["How is pricing determined?", "Commercial terms require a documented scope covering audience, modules, launch support, review burden, custom materials, measurement, service levels, data handling, and legal terms. No public one-size-fits-all price is represented."],
  ["Does CAF provide emergency, clinical, legal, tax, investment, or individual case support?", "No. Urgent and case-specific needs must go to the appropriate emergency service, care team, insurer, employer, agency, attorney, tax professional, financial professional, or other qualified source."],
] as const;

const pageMeta = {
  programs: {
    title: "Healthcare Financial Education Programs for Organizations",
    description: "Evaluate five live Community Acquired Finance program pathways for workforce benefits, patient costs, Medicare and discharge, career decisions, and broad navigation.",
    eyebrow: "Live program portfolio",
    heading: "Five focused programs built from public participant experiences.",
  },
  implementation: {
    title: "Organization Program Implementation",
    description: "Review the accountable five-gate implementation model for a privacy-minimized Community Acquired Finance organization program.",
    eyebrow: "Implementation",
    heading: "Move from evaluation to evidence with five accountable gates.",
  },
  measurement: {
    title: "Organization Program Measurement",
    description: "Define reach, consented engagement, usefulness, operations, and honest outcome boundaries for a Community Acquired Finance program.",
    eyebrow: "Measurement",
    heading: "Measure only what can support a real decision.",
  },
  "trust-procurement": {
    title: "Organization Trust and Procurement",
    description: "Review current Community Acquired Finance capabilities, scoped-review items, services not offered, privacy boundaries, and procurement questions.",
    eyebrow: "Trust and procurement",
    heading: "Due diligence should describe the real product—not an imagined enterprise platform.",
  },
  faq: {
    title: "Organization Buyer FAQ",
    description: "Answers to common organization questions about product scope, privacy, data, measurement, certifications, outcomes, customization, pricing, and support.",
    eyebrow: "Buyer FAQ",
    heading: "Resolve scope and evidence questions before procurement.",
  },
} as const;

type OrganizationDetailKey = keyof typeof pageMeta;

const OrganizationDetailsPage = () => {
  const { pathname } = useLocation();
  const key = pathname.split("/").filter(Boolean).at(-1) as OrganizationDetailKey;
  const meta = pageMeta[key] ?? pageMeta.programs;

  useSeo({ title: meta.title, description: meta.description, canonicalPath: `/for-organizations/${key}` });

  useEffect(() => {
    trackGrowthEvent("organization_program_opened", { entry_surface: "organization", destination_id: key.replaceAll("-", "_") });
    if (key === "trust-procurement") {
      trackGrowthEvent("organization_trust_page_opened", { entry_surface: "organization", action_id: "due_diligence" });
    }
  }, [key]);

  return (
    <>
      <PageHero eyebrow={meta.eyebrow} title={meta.heading} description={meta.description}>
        <Button asChild variant="hero" size="lg"><Link to="/for-organizations#program-builder">Build a program brief <ArrowRight className="h-4 w-4" /></Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "organization", action_id: "detail_page" })}>Contact CAF without sensitive information</Link></Button>
      </PageHero>

      <nav className="border-b border-border bg-background/95 print:hidden" aria-label="Organization information">
        <div className="container max-w-7xl overflow-x-auto py-3" tabIndex={0}>
          <div className="flex min-w-max gap-2">
            {organizationNav.map(([label, href]) => (
              <Link key={href} to={href} aria-current={pathname === href ? "page" : undefined} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${pathname === href ? "border-primary bg-primary-soft/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"}`}>{label}</Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="container max-w-7xl py-12 md:py-16">
        {key === "programs" && (
          <div className="space-y-6">
            {organizationPrograms.map((program) => (
              <article key={program.id} className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
                <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{program.eyebrow}</div>
                    <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">{program.title}</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{program.summary}</p>
                    <p className="mt-4 text-sm"><strong>Best for:</strong> {program.bestFor}</p>
                    <p className="mt-3 text-sm"><strong>Participant leaves with:</strong> {program.participantOutcome}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Live participant pathway</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {program.modules.map((module, index) => (
                        <Link key={module.href} to={module.href} className="rounded-2xl border border-border p-4 hover:border-primary/35 hover:bg-primary-soft/15">
                          <span className="text-xs font-bold text-primary">STEP {index + 1}</span>
                          <span className="mt-2 block font-display text-lg font-bold">{module.title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{module.description}</span>
                        </Link>
                      ))}
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold">Organization deliverables</h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">{program.organizationDeliverables.map((item) => <li key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {key === "implementation" && (
          <div className="space-y-10">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                ["Open evaluation", "Buyer and reviewers inspect the live product, sources, trust pages, and data boundaries. No participant launch."],
                ["Focused program", "One audience, one decision moment, approved modules, named support, and an aggregate learning plan."],
                ["Phased partnership", "A second program or recurring calendar only after the first phase produces useful evidence."],
              ].map(([title, body], index) => <article key={title} className="rounded-3xl border border-border bg-card p-6"><div className="font-display text-3xl font-bold text-primary">0{index + 1}</div><h2 className="mt-3 font-display text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}
            </section>
            <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <div className="border-b border-border p-6"><h2 className="font-display text-2xl font-bold">Standard five-gate sequence</h2></div>
              <ol className="grid md:grid-cols-5">{implementationGates.map(([title, body], index) => <li key={title} className="border-b border-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><h3 className="mt-4 font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></li>)}</ol>
            </section>
            <div className="rounded-2xl border border-primary/20 bg-primary-soft/20 p-5 text-sm leading-relaxed"><strong>Required before launch:</strong> sponsor, program owner, reviewers, participant support route, correction and incident contacts, accessibility owner, measurement owner, approved privacy notice, and written scope.</div>
          </div>
        )}

        {key === "measurement" && (
          <div className="space-y-8">
            <div className="overflow-x-auto rounded-3xl border border-border bg-card" role="region" aria-label="Organization measurement framework; scrollable table" tabIndex={0}>
              <table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-muted/45"><tr><th className="p-4">Stage</th><th className="p-4">Measure</th><th className="p-4">Owner</th><th className="p-4">Privacy and claims boundary</th></tr></thead><tbody>{organizationMeasurementFramework.map((row) => <tr key={row.stage} className="border-t border-border"><th className="p-4 font-display text-lg">{row.stage}</th><td className="p-4">{row.measures}</td><td className="p-4">{row.owner}</td><td className="p-4 text-muted-foreground">{row.boundary}</td></tr>)}</tbody></table>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Decision supported", "Continue, revise, expand, or stop the program."],
                ["Never transmitted", "Names, answers, amounts, diagnoses, plan names, IDs, free text, documents, or local-storage contents."],
                ["Not claimed", "Savings, ROI, retention, claims reduction, improved elections, eligibility, coverage, or clinical outcomes."],
              ].map(([title, body]) => <article key={title} className="rounded-2xl border border-border bg-card p-5"><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}
            </div>
          </div>
        )}

        {key === "trust-procurement" && (
          <div className="space-y-8">
            <div className="overflow-x-auto rounded-3xl border border-border bg-card" role="region" aria-label="Trust and procurement matrix; scrollable table" tabIndex={0}>
              <table className="min-w-[1050px] w-full text-left text-sm"><thead className="bg-muted/45"><tr><th className="p-4">Area</th><th className="p-4">Available now</th><th className="p-4">Requires scoped review</th><th className="p-4">Not offered</th></tr></thead><tbody>{organizationProcurementRows.map((row) => <tr key={row.area} className="border-t border-border align-top"><th className="p-4 font-display text-lg">{row.area}</th><td className="p-4"><span className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{row.current}</span></td><td className="p-4 text-muted-foreground">{row.review}</td><td className="p-4 text-muted-foreground"><span className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0" />{row.notOffered}</span></td></tr>)}</tbody></table>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-3xl border border-emerald-200 bg-emerald-50/65 p-6"><ShieldCheck className="h-6 w-6 text-emerald-800" /><h2 className="mt-3 font-display text-2xl font-bold text-emerald-950">Current public capability</h2><p className="mt-3 text-sm leading-relaxed text-emerald-950">Responsive public education, live calculators and guided tools, fixed-choice program planning, local-only participant workflows where stated, source and freshness controls, consent-gated fixed-ID analytics, and public correction and contact routes.</p></article>
              <article className="rounded-3xl border border-border bg-card p-6"><LockKeyhole className="h-6 w-6 text-primary" /><h2 className="mt-3 font-display text-2xl font-bold">No implied certification or enterprise readiness</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">CAF does not represent HIPAA, SOC 2, HITRUST, BAA, SSO, account provisioning, participant reporting, 24/7 support, or integration readiness unless separately completed, reviewed, and documented.</p></article>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-primary-soft/20 p-6"><FileCheck2 className="h-6 w-6 text-primary" /><h2 className="mt-3 font-display text-2xl font-bold">Review standards—not certification claims</h2><p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">Reviews are informed by organizational health literacy, plain language, accessibility, privacy risk management, and the actual HIPAA covered-entity or business-associate relationship. These references guide review and do not create a conformance or certification claim.</p><div className="mt-4 flex flex-wrap gap-2 text-sm font-bold"><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.cdc.gov/health-literacy/php/about/index.html" target="_blank" rel="noreferrer">CDC health literacy</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">WCAG 2.2</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.nist.gov/privacy-framework" target="_blank" rel="noreferrer">NIST Privacy Framework</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html" target="_blank" rel="noreferrer">HHS HIPAA roles</a></div></div>
          </div>
        )}

        {key === "faq" && (
          <div className="mx-auto max-w-5xl divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-card md:px-8">
            {buyerFaq.map(([question, answer], index) => <details key={question} className="group py-5" onToggle={(event) => { if (event.currentTarget.open) trackGrowthEvent("organization_program_opened", { entry_surface: "organization", action_id: `faq_${index + 1}` }); }}><summary className="cursor-pointer list-none pr-8 font-display text-lg font-bold marker:hidden">{question}<span className="float-right text-primary transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}
          </div>
        )}

        <div className="mt-12 rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Contact boundary:</strong> Do not send PHI, employee or member records, plan documents, names, IDs, diagnoses, medications, claims, case-specific details, or other sensitive information. Begin with organization type, broad audience, decision moment, timeline, and accountable owner.</div>
      </div>
    </>
  );
};

export default OrganizationDetailsPage;
