import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Landmark,
  Layers3,
  LifeBuoy,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
  X,
} from "lucide-react";
import { OrganizationProgramBuilder } from "@/components/organizations/OrganizationProgramBuilder";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  organizationMeasurementFramework,
  organizationProcurementRows,
  organizationProfiles,
  organizationPrograms,
} from "@/data/organizationOffering";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { useSeo } from "@/lib/seo";

const anchorLinks = [
  ["Offering", "#offering"],
  ["Program planner", "#program-builder"],
  ["Implementation", "#implementation"],
  ["Measurement", "#measurement"],
  ["Trust and procurement", "#trust-procurement"],
  ["Buyer FAQ", "#buyer-faq"],
] as const;

const organizationIcons = [Hospital, Landmark, Stethoscope, HeartHandshake, GraduationCap, UsersRound, Building2];

const launchTemplates = [
  {
    id: "participant_invitation",
    title: "Participant invitation",
    purpose: "Email, intranet, learning portal, or QR landing-page introduction",
    copy: "Your organization is making Community Acquired Finance available as an independent educational resource. Use its public tools to prepare questions about healthcare costs, workplace benefits, medical bills, Medicare, Medicaid, or healthcare career decisions. You do not need to create an account. Do not enter names, member or employee IDs, diagnoses, medications, plan names, account numbers, documents, or other identifying information. The resource does not replace your plan documents, provider, insurer, benefits team, financial professional, attorney, tax professional, or government agency.",
  },
  {
    id: "facilitator_intro",
    title: "Facilitator introduction",
    purpose: "Manager, educator, counselor, navigator, or program-lead talking points",
    copy: "This session is about preparing for a decision, not choosing for you. Community Acquired Finance will help you organize assumptions, questions, and next steps. Use sample or non-identifying information. Your official plan documents, employer, provider, insurer, and government agencies control. If the tool raises a question, write it down and verify it with the appropriate source before acting.",
  },
  {
    id: "privacy_notice",
    title: "Participant privacy notice",
    purpose: "Place next to launch links and facilitator materials",
    copy: "Privacy reminder: Do not provide your name, contact information, employee or member ID, diagnosis, medication, provider or plan name, claim or account number, exact case details, documents, or free-text notes. Fixed-choice answers in guided tools stay in the current browser tab unless a tool clearly says otherwise. Copying, printing, or sharing a result creates a record under your control. Review the site Privacy Policy before use.",
  },
  {
    id: "feedback_pulse",
    title: "Three-question usefulness pulse",
    purpose: "Optional aggregate post-use feedback without case details",
    copy: "1. Was the experience clear? Yes / Partly / No\n2. Did you leave with a specific next step or verification question? Yes / Not yet\n3. Which broad pathway did you use? Benefits / Career / Healthcare cost / Medical bill / Medicare or Medicaid / Discharge / Other\n\nDo not ask participants to include names, diagnoses, plan details, dollar amounts, or a description of their case.",
  },
] as const;

const buyerFaq = [
  ["What can an organization use today?", "Every participant module linked on this page is a released public product. An organization can evaluate the full experience immediately with sample, non-identifying information. A formal program adds agreed launch materials, owners, review, support, measurement, and terms; it does not require a private portal."],
  ["Is this a benefits platform, care navigator, or financial-wellness app?", "No. CAF is a healthcare-specific education and decision-preparation layer. It does not administer benefits, enroll participants, recommend plans, deliver care, make eligibility or coverage determinations, pay claims, manage cases, or replace licensed professionals."],
  ["Does CAF need employee, patient, member, or student data?", "The current offering is designed not to. Participants use public experiences without an account. Fixed-choice tool answers stay in the browser tab, and analytics are consent-gated and limited to approved fixed identifiers. Any proposed change to that data flow requires separate written review before launch."],
  ["Is CAF HIPAA compliant or willing to sign a BAA?", "CAF does not make a blanket HIPAA-compliance claim. The current public offering is intentionally designed not to receive PHI. Whether a future arrangement creates a business-associate relationship depends on the actual services and data flow; that question, any BAA, and related safeguards must be reviewed in writing before protected information is involved."],
  ["Can content be customized to our plans or policies?", "Organization-specific language, branding, plan references, or campaign materials can be evaluated only after the organization identifies an accountable content owner and completes legal, privacy, benefits, clinical, accessibility, and communications review as applicable. Public content remains educational, source-backed, and independent."],
  ["What does implementation require from us?", "At minimum: an executive sponsor, accountable program owner, defined audience and decision moment, approved launch channel, internal reviewers, participant support route, correction and incident contacts, and a measurement owner. The program planner creates a starting brief for this discussion."],
  ["What reporting do we receive?", "Reporting must begin with what is actually observable. The current framework can use organization-owned reach data plus consented aggregate CAF engagement and a privacy-safe usefulness pulse. It does not expose participant answers or individual journeys. Any additional report requires a lawful, technically supported, written measurement design."],
  ["Can CAF prove savings, ROI, retention, or better elections?", "Not yet, and this page does not claim those outcomes. A program can define a credible evaluation question, baseline, limitations, and decision rule. Claims about claims cost, debt, enrollment, retention, or ROI require real evidence and an agreed evaluation method."],
  ["How is pricing determined?", "Commercial terms are not presented as a one-size-fits-all public price. They depend on the selected program, audience, launch support, review requirements, custom materials, measurement, service levels, and legal terms. No organization should rely on an estimate until scope and responsibilities are documented in a written agreement."],
  ["What happens when guidance changes or an error is found?", "CAF maintains visible source, freshness, methodology, and correction practices. A formal launch should identify the organization and CAF correction owners, affected materials, response expectations, and how participants will be notified when a material update is required."],
  ["Does CAF provide emergency, clinical, legal, or individual case support?", "No. CAF is not an emergency service, clinical service, law firm, benefits administrator, insurance agency, or individual case-management channel. Urgent or emergency needs should go to the appropriate emergency service, care team, insurer, employer, agency, or qualified professional."],
];

const ForOrganizationsPage = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  useSeo({
    title: "Healthcare Financial Education Programs for Organizations",
    description: "Build a privacy-minimized healthcare financial education program for employees, patients, caregivers, members, or students using live decision tools, implementation plans, measurement boundaries, and procurement-ready safeguards.",
    canonicalPath: "/for-organizations",
  });

  useEffect(() => {
    trackGrowthEvent("organization_page_viewed", { entry_surface: "organization" });
  }, []);

  const copyTemplate = async (id: string, copy: string) => {
    try {
      await navigator.clipboard.writeText(copy);
      setCopiedTemplate(id);
      trackGrowthEvent("organization_launch_asset_action", { entry_surface: "organization", action_id: id });
    } catch {
      setCopiedTemplate(null);
    }
  };

  const trackContact = (ctaType: "program_review" | "procurement_inquiry") =>
    trackGrowthEvent("organization_contact_selected", { entry_surface: "organization", cta_type: ctaType });

  return (
    <>
      <PageHero
        eyebrow="For hospitals, health plans, healthcare employers, schools, and community organizations"
        title="Healthcare financial education people can use without handing over their private information."
        description="Community Acquired Finance turns complex benefits, healthcare-cost, coverage, billing, and career decisions into clear preparation plans. Evaluate the live product, build a scoped program brief, and review the full implementation and procurement boundary before making a commitment."
      >
        <Button asChild variant="hero" size="lg"><a href="#program-builder">Build a program brief <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><a href="#offering">Review the full offering</a></Button>
      </PageHero>

      <div className="border-b border-border bg-background/95 print:hidden">
        <nav className="container max-w-7xl overflow-x-auto py-3" aria-label="Organization offering sections" tabIndex={0}>
          <div className="flex min-w-max gap-2">
            {anchorLinks.map(([label, href]) => <a key={href} href={href} className="rounded-full border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary/30 hover:bg-primary-soft/30 hover:text-primary">{label}</a>)}
          </div>
        </nav>
      </div>

      <div className="container max-w-7xl space-y-20 py-12 md:py-16">
        <section aria-labelledby="offering-difference-title">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The offering in one minute</div>
            <h2 id="offering-difference-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">A transparent education layer between confusing information and the next real conversation.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">CAF does not need to become your benefits administrator, care platform, or system of record to be useful. It gives participants a calm place to understand the decision, test the math, prepare questions, and leave with a copyable or printable next-action plan.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              [Sparkles, "Live product first", "Buyers can open the same released tools participants will use. No concept deck, mock dashboard, or gated demo is required."],
              [LockKeyhole, "Private by design", "No participant account is required. Guided answers remain in the browser tab and stay out of URLs and answer-level analytics."],
              [BookOpenCheck, "Source and scope visible", "Official sources, reviewed dates, assumptions, limitations, and professional boundaries stay close to the decision."],
              [FileCheck2, "Implementation included", "The offering includes program design, launch materials, accountable roles, measurement boundaries, and a due-diligence path."],
            ].map(([Icon, title, body]) => (
              <article key={title as string} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-xl font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body as string}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="buyer-fit-title">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Built for healthcare's real decision points</div>
              <h2 id="buyer-fit-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">One product system, different accountable buyers.</h2>
            </div>
            <p className="leading-relaxed text-muted-foreground">Each organization starts with a defined audience and problem—not a generic “wellness” promise. The program planner adapts the released module sequence, roles, review, and evidence plan to the setting.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {organizationProfiles.map((profile, index) => {
              const Icon = organizationIcons[index];
              return <article key={profile.id} className="rounded-2xl border border-border bg-card p-5"><Icon className="h-5 w-5 text-primary" /><h3 className="mt-3 font-display text-lg font-bold">{profile.label}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.description}</p></article>;
            })}
          </div>
        </section>

        <section id="offering" className="scroll-mt-28" aria-labelledby="program-portfolio-title">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Complete program portfolio</div>
            <h2 id="program-portfolio-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Five offerings built from working participant experiences.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Every module below is available for direct evaluation. A formal launch adds the organization deliverables and agreed review—not a hidden product the buyer cannot inspect.</p>
          </div>
          <div className="mt-10 space-y-6">
            {organizationPrograms.map((program, programIndex) => (
              <article key={program.id} className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
                <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                  <div className="bg-primary-soft/30 p-6 md:p-8">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{program.eyebrow}</div>
                    <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">{program.title}</h3>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{program.summary}</p>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed">
                      <p><strong>Best for:</strong> {program.bestFor}</p>
                      <p><strong>Participant leaves with:</strong> {program.participantOutcome}</p>
                    </div>
                    <div className="mt-6 text-sm font-bold">Organization deliverables</div>
                    <ul className="mt-3 space-y-2">
                      {program.organizationDeliverables.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
                    </ul>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="text-sm font-bold">Live participant pathway</div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {program.modules.map((module, moduleIndex) => (
                        <Link key={module.href} to={module.href} className="group rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:bg-primary-soft/20" onClick={() => trackGrowthEvent("organization_resource_opened", { entry_surface: "organization", destination_id: program.id, action_id: `module_${moduleIndex + 1}` })}>
                          <div className="flex items-center justify-between gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">{moduleIndex + 1}</span><ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div>
                          <h4 className="mt-4 font-display text-lg font-bold group-hover:text-primary">{module.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{module.description}</p>
                        </Link>
                      ))}
                    </div>
                    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Program {programIndex + 1} of {organizationPrograms.length}. Open modules with sample or non-identifying information only. Official plan, provider, insurer, agency, employer, and signed program terms control.</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <OrganizationProgramBuilder />

        <section id="implementation" className="scroll-mt-28" aria-labelledby="implementation-title">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Delivery model</div>
              <h2 id="implementation-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Start with the least infrastructure that can answer the real question.</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">A serious program is not defined by a login screen. It is defined by a clear audience, accountable owners, safe data flow, useful participant experience, controlled launch, and honest evidence.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["01", "Open evaluation", "Buyer and reviewers use the live public product, source binder, trust pages, and procurement matrix. No participant launch."],
                ["02", "Focused program", "One audience and decision moment, approved modules, launch kit, named support, aggregate learning plan, and end review."],
                ["03", "Phased partnership", "A second program or recurring education calendar only after the first phase produces useful evidence and the operating burden is understood."],
              ].map(([number, title, body]) => <article key={number} className="rounded-3xl border border-border bg-card p-5"><div className="font-display text-3xl font-bold text-primary">{number}</div><h3 className="mt-4 font-display text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
            <div className="border-b border-border p-6 md:p-8"><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Standard implementation sequence</div><h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">Five gates from idea to evidence.</h3></div>
            <ol className="grid md:grid-cols-5">
              {[
                ["Define", "Audience, moment, owner, problem, channels, and stop conditions."],
                ["Review", "Product, sources, data flow, scope, legal, privacy, security, accessibility, and communications."],
                ["Prepare", "Launch copy, facilitator guide, participant notice, support, baseline, and test cohort."],
                ["Launch", "Approved channels, no participant file, operational monitoring, corrections, and escalation."],
                ["Learn", "Reach, safe engagement, usefulness, limitations, issues, and expand/revise/stop decision."],
              ].map(([title, body], index) => <li key={title} className="border-b border-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</div><h4 className="mt-4 font-display text-lg font-bold">{title}</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></li>)}
            </ol>
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ready-to-adapt launch kit</div><h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">Real copy for the first internal review.</h3></div><p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Templates are intentionally generic. Your organization must approve and adapt them; do not add claims or request private case details.</p></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {launchTemplates.map((template) => <article key={template.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h4 className="font-display text-xl font-bold">{template.title}</h4><p className="mt-1 text-xs font-semibold text-primary">{template.purpose}</p></div><Button type="button" size="sm" variant="outline" onClick={() => copyTemplate(template.id, template.copy)}><Copy className="h-4 w-4" /> {copiedTemplate === template.id ? "Copied" : "Copy"}</Button></div><p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{template.copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="measurement" className="scroll-mt-28" aria-labelledby="measurement-title">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Measurement without surveillance</div><h2 id="measurement-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Know what happened. Do not pretend engagement proves an outcome.</h2></div>
            <p className="leading-relaxed text-muted-foreground">CAF separates reach, engagement, usefulness, operations, and outcomes. Blank or unavailable evidence stays unverified—not zero, not success, and not a marketing claim.</p>
          </div>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-card shadow-card" tabIndex={0} aria-label="Organization measurement framework. Scroll horizontally on small screens.">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-primary-soft/35"><tr><th className="p-4 font-bold">Stage</th><th className="p-4 font-bold">What may be measured</th><th className="p-4 font-bold">Likely owner</th><th className="p-4 font-bold">Boundary</th></tr></thead>
              <tbody>{organizationMeasurementFramework.map((row) => <tr key={row.stage} className="border-t border-border align-top"><th scope="row" className="p-4 font-bold text-primary">{row.stage}</th><td className="p-4 leading-relaxed">{row.measures}</td><td className="p-4 leading-relaxed text-muted-foreground">{row.owner}</td><td className="p-4 leading-relaxed text-muted-foreground">{row.boundary}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [BarChart3, "Decision rule before launch", "Define what would support expanding, revising, pausing, or stopping before seeing the result."],
              [ClipboardCheck, "Limitations travel with results", "Audience, channel, consent, missing data, response bias, and time window stay attached to every finding."],
              [ShieldCheck, "Claims require separate proof", "No savings, claims, retention, election quality, debt, or ROI statement is inferred from views or completions."],
            ].map(([Icon, title, body]) => <article key={title as string} className="rounded-2xl border border-border bg-card p-5"><Icon className="h-5 w-5 text-primary" /><h3 className="mt-3 font-display text-lg font-bold">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body as string}</p></article>)}
          </div>
        </section>

        <section id="trust-procurement" className="scroll-mt-28" aria-labelledby="procurement-title">
          <div className="mx-auto max-w-3xl text-center"><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Trust and procurement</div><h2 id="procurement-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Current capability, required review, and non-offering—on one page.</h2><p className="mt-4 leading-relaxed text-muted-foreground">This is a buyer-facing boundary, not a certification statement. Final obligations come only from completed due diligence and signed terms.</p></div>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-card shadow-card" tabIndex={0} aria-label="Organization procurement boundary. Scroll horizontally on small screens.">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-primary-soft/35"><tr><th className="p-4 font-bold">Review area</th><th className="p-4 font-bold text-emerald-800">Current public capability</th><th className="p-4 font-bold text-amber-800">Requires scoped review</th><th className="p-4 font-bold text-muted-foreground">Not currently offered</th></tr></thead>
              <tbody>{organizationProcurementRows.map((row) => <tr key={row.area} className="border-t border-border align-top"><th scope="row" className="p-4 font-bold">{row.area}</th><td className="p-4 leading-relaxed"><span className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{row.current}</span></td><td className="p-4 leading-relaxed text-muted-foreground">{row.review}</td><td className="p-4 leading-relaxed text-muted-foreground"><span className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0" />{row.notOffered}</span></td></tr>)}</tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-emerald-200 bg-emerald-50/65 p-6 md:p-8"><Network className="h-7 w-7 text-emerald-800" /><h3 className="mt-4 font-display text-2xl font-bold text-emerald-950">Choose CAF when...</h3><ul className="mt-5 space-y-3 text-sm leading-relaxed text-emerald-950">{["You need healthcare-specific education and decision preparation rather than administration.", "You want buyers and participants to inspect the real product before committing.", "You want to launch without transferring an employee, patient, member, or student file.", "You value transparent math, official-source handoffs, plain language, and explicit uncertainty.", "You will measure evidence honestly and accept a focused first audience."].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" />{item}</li>)}</ul></article>
            <article className="rounded-[2rem] border border-border bg-card p-6 md:p-8"><LifeBuoy className="h-7 w-7 text-primary" /><h3 className="mt-4 font-display text-2xl font-bold">Choose another category of vendor when...</h3><ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">{["You require benefits enrollment, eligibility, payroll, EHR, claims, payment, or case-management integration.", "You need a 24/7 human concierge, licensed financial planning, clinical care, legal representation, brokerage, or individualized advice.", "You require a mature enterprise dashboard, SSO, account provisioning, or participant-level reporting today.", "You need independently completed certifications or contractual service levels that CAF has not documented.", "You expect guaranteed savings, claims reduction, enrollment, retention, or ROI before an evaluation."].map((item) => <li key={item} className="flex gap-3"><X className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}</ul></article>
          </div>

          <div className="mt-8 rounded-3xl border border-primary/20 bg-primary-soft/25 p-6 md:p-8">
            <div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-primary" /><div><h3 className="font-display text-2xl font-bold">Standards informing the review</h3><p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">Program design is informed by organizational health literacy, plain-language practice, WCAG 2.2, privacy risk management, and the actual HIPAA covered-entity and business-associate relationship. These references guide review; they do not create a conformance or certification claim.</p><div className="mt-5 flex flex-wrap gap-2 text-sm font-bold"><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.cdc.gov/health-literacy/php/about/index.html" target="_blank" rel="noreferrer">CDC health literacy</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html" target="_blank" rel="noreferrer">CDC plain language</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">WCAG 2.2</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.nist.gov/privacy-framework" target="_blank" rel="noreferrer">NIST Privacy Framework</a><a className="rounded-full border border-border bg-background px-3 py-2 hover:text-primary" href="https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html" target="_blank" rel="noreferrer">HHS HIPAA roles</a></div></div></div>
          </div>
        </section>

        <section id="buyer-faq" className="scroll-mt-28" aria-labelledby="faq-title">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Buyer FAQ</div><h2 id="faq-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Questions to resolve before procurement.</h2><p className="mt-4 leading-relaxed text-muted-foreground">If your question is not answered here, include it in a non-sensitive program review request. Do not send participant or case details.</p></div>
            <div className="divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-card md:px-7">
              {buyerFaq.map(([question, answer], index) => <details key={question} className="group py-5" onToggle={(event) => { if (event.currentTarget.open) trackGrowthEvent("organization_buyer_faq_opened", { entry_surface: "organization", action_id: `faq_${index + 1}` }); }}><summary className="cursor-pointer list-none pr-8 font-display text-lg font-bold marker:hidden">{question}<span className="float-right text-primary transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] bg-gradient-primary p-6 text-primary-foreground shadow-hover md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Begin with evidence</div><h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Bring one audience, one decision moment, and one accountable owner.</h2><p className="mt-4 max-w-3xl leading-relaxed opacity-90">Use the planner first. Then request a scoped review without employee, patient, member, plan, medical, financial, or other sensitive information. Commercial scope, pricing, legal terms, data handling, service levels, and claims are not final until documented in writing.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Button asChild size="lg" variant="outline" className="border-white bg-white text-primary hover:bg-white/90 hover:text-primary"><a href="#program-builder">Build the brief</a></Button><Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white"><Link to="/contact" onClick={() => trackContact("procurement_inquiry")}>Request a program review <ArrowRight className="h-4 w-4" /></Link></Button></div>
          </div>
        </section>

        <DisclaimerBox />
      </div>
    </>
  );
};

export default ForOrganizationsPage;
