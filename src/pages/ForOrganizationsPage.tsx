import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, FileCheck2, LockKeyhole, ShieldCheck, Stethoscope } from "lucide-react";
import { OrganizationProgramBuilder } from "@/components/organizations/OrganizationProgramBuilder";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { organizationProfiles, organizationPrograms } from "@/data/organizationOffering";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { useSeo } from "@/lib/seo";

const dueDiligencePages = [
  ["Patient Education Systems", "/for-organizations/patient-education-systems", "RN-designed discharge education, clinical governance, pilot scoping, and product boundaries."],
  ["Programs", "/for-organizations/programs", "Participant pathways and organization deliverables."],
  ["Implementation", "/for-organizations/implementation", "Owners, review, launch, support, and learning gates."],
  ["Measurement", "/for-organizations/measurement", "Decision-grade aggregate evidence and claims boundaries."],
  ["Trust & procurement", "/for-organizations/trust-procurement", "Available now, scoped review, and services not offered."],
  ["Buyer FAQ", "/for-organizations/faq", "Data, certifications, outcomes, pricing, and support questions."],
] as const;

const ForOrganizationsPage = () => {
  useSeo({
    title: "Healthcare Financial Education for Organizations",
    description: "Evaluate privacy-minimized Community Acquired Finance programs for workforce benefits, patient costs, Medicare and discharge, healthcare careers, and RN-designed patient education systems.",
    canonicalPath: "/for-organizations",
  });

  useEffect(() => {
    trackGrowthEvent("organization_page_viewed", { entry_surface: "organization" });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="For healthcare organizations, employers, schools, plans, and community programs"
        title="Healthcare education people can use without handing over their private information."
        description="Evaluate public financial-education programs or review the development-stage CAF Patient Education Systems product for hospital-to-home education, clinical governance, and controlled institutional pilots."
      >
        <Button asChild variant="hero" size="lg"><a href="#program-builder">Build a program brief <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><Link to="/for-organizations/patient-education-systems" onClick={() => trackGrowthEvent("organization_program_opened", { entry_surface: "organization", destination_id: "patient_education_systems" })}>Patient Education Systems</Link></Button>
        <Button asChild variant="ghost" size="lg"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "organization", action_id: "hero" })}>Contact CAF</Link></Button>
      </PageHero>

      <section className="container max-w-7xl py-12 md:py-16" aria-labelledby="institutional-product-title">
        <article className="overflow-hidden rounded-[2rem] border border-primary/25 bg-primary-soft/20 shadow-card">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Stethoscope className="h-4 w-4" /> New institutional product line</div>
              <h2 id="institutional-product-title" className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">CAF Patient Education Systems</h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">A proprietary, RN-designed hospital-to-home education system combining patient guides, personalized plans, teach-back, skill verification, operational troubleshooting, refill and supply continuity, clinical governance, and measurable implementation.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero"><Link to="/for-organizations/patient-education-systems">Review the product architecture <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link to="/for-organizations/patient-education-systems#pilot-builder">Build a pilot brief</Link></Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["5", "initial flagship modules"],
                ["15", "coordinated assets per topic"],
                ["6", "release gates"],
                ["0", "PHI required in the initial model"],
              ].map(([value, label]) => <div key={label} className="rounded-2xl border border-border bg-background/90 p-4"><div className="font-display text-3xl font-bold text-primary">{value}</div><div className="mt-1 text-sm font-semibold text-muted-foreground">{label}</div></div>)}
            </div>
          </div>
          <div className="border-t border-primary/15 bg-background/70 px-6 py-4 text-sm leading-relaxed md:px-8"><strong>Development boundary:</strong> the public page demonstrates the product system and pilot model. Deployable guides, evidence dossiers, reviewer records, and hospital customizations remain private and are not released as public clinical materials.</div>
        </article>
      </section>

      <section className="container max-w-7xl pb-12 md:pb-16" aria-labelledby="organization-fit-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Who CAF serves</div>
            <h2 id="organization-fit-title" className="mt-2 font-display text-3xl font-bold tracking-tight">Start with a decision problem, not a platform category.</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">CAF supports organizations that need a clear education and preparation layer before the participant speaks with benefits, billing, care, coverage, or government-program teams.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {organizationProfiles.map((profile) => <article key={profile.id} className="rounded-2xl border border-border bg-card p-4"><Building2 className="h-4 w-4 text-primary" aria-hidden="true" /><h3 className="mt-2 font-display text-base font-bold">{profile.label}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{profile.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/25 py-14 md:py-20" aria-labelledby="programs-title">
        <div className="container max-w-7xl">
          <div className="mx-auto max-w-3xl text-center"><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Five public program categories</div><h2 id="programs-title" className="mt-2 font-display text-3xl font-bold tracking-tight">Focused pathways built from products buyers can open today.</h2><p className="mt-3 leading-relaxed text-muted-foreground">These public financial-education programs remain distinct from the proprietary Patient Education Systems library. A program adds approved launch materials, accountable roles, support, review, and measurement.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {organizationPrograms.map((program) => <article key={program.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{program.eyebrow}</div><h3 className="mt-2 font-display text-xl font-bold">{program.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{program.summary}</p><Link to="/for-organizations/programs" onClick={() => trackGrowthEvent("organization_program_opened", { entry_surface: "organization", destination_id: program.id })} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Review program <ArrowRight className="h-4 w-4" /></Link></article>)}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl py-14 md:py-20" aria-labelledby="difference-title">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            [LockKeyhole, "Privacy-minimized by design", "No participant account, identity file, PHI, plan document, diagnosis, claim number, or case narrative is required for the current public offer or pilot scoping tools."],
            [FileCheck2, "Live evaluation first", "Buyers and reviewers can inspect the real responsive tools, source boundaries, result language, print behavior, and official-resource handoffs."],
            [ShieldCheck, "Scope stays visible", "CAF provides education and decision preparation—not benefits administration, enrollment, care, eligibility, coverage, legal advice, or case management."],
          ].map(([Icon, title, body]) => <article key={title as string} className="rounded-3xl border border-border bg-card p-6 shadow-card"><Icon className="h-6 w-6 text-primary" aria-hidden="true" /><h2 id={title === "Privacy-minimized by design" ? "difference-title" : undefined} className="mt-3 font-display text-xl font-bold">{title as string}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body as string}</p></article>)}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="grid md:grid-cols-3">
            {[
              ["1", "Evaluate", "Review live public products or the controlled institutional architecture, sources, privacy behavior, limitations, and buyer fit."],
              ["2", "Scope", "Choose one audience and decision moment; identify owners, reviewers, channels, support, and measurement."],
              ["3", "Launch and learn", "Use approved materials, aggregate evidence, correction routes, and a defined expand, revise, or stop decision."],
            ].map(([number, title, body]) => <article key={number} className="border-b border-border p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><div className="font-display text-3xl font-bold text-primary">{number}</div><h2 className="mt-3 font-display text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl pb-14 md:pb-20" aria-labelledby="limitations-title">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 text-amber-950 md:p-8"><h2 id="limitations-title" className="font-display text-2xl font-bold">Clear limitations before a sales conversation</h2><div className="mt-4 grid gap-3 text-sm leading-relaxed md:grid-cols-2"><p>CAF does not claim HIPAA, SOC 2, HITRUST, or BAA readiness; guaranteed savings; ROI; claims reduction; improved retention or elections; eligibility or coverage determinations; or clinical outcomes.</p><p>Organization-specific content, data flows, reporting, branding, security review, service levels, pricing, and legal terms require a documented scope. Development-stage clinical materials require evidence, qualified review, accessibility review, patient testing, and institutional approval before use.</p></div></div>
      </section>

      <section className="container max-w-7xl pb-16 md:pb-20"><OrganizationProgramBuilder /></section>

      <section className="border-t border-border bg-card/25 py-14 md:py-20" aria-labelledby="due-diligence-title">
        <div className="container max-w-7xl"><div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Supporting due diligence</div><h2 id="due-diligence-title" className="mt-2 font-display text-3xl font-bold">Go deeper only when the buyer question requires it.</h2></div><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{dueDiligencePages.map(([title, href, description]) => <Link key={href} to={href} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/35 hover:shadow-card"><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open <ArrowRight className="h-4 w-4" /></span></Link>)}</div><div className="mt-8 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-soft/20 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-3xl text-sm leading-relaxed"><strong>Contact without sensitive information.</strong> Share only the organization type, broad audience, decision moment, planning horizon, and accountable owner. Do not send PHI, employee or member records, plan documents, names, IDs, diagnoses, medications, claims, or case-specific details.</p><Button asChild className="shrink-0"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "organization", action_id: "overview_footer" })}>Contact CAF <ArrowRight className="h-4 w-4" /></Link></Button></div></div>
      </section>
    </>
  );
};

export default ForOrganizationsPage;
