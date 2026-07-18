import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileCheck2,
  FileJson2,
  HeartHandshake,
  Layers3,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from "lucide-react";
import { PatientEducationPilotBuilder } from "@/components/organizations/PatientEducationPilotBuilder";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  patientEducationClaimsBoundary,
  patientEducationContinuityLayers,
  patientEducationModules,
  patientEducationPackageAssets,
  patientEducationReleaseGates,
} from "@/data/patientEducationOffering";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { useSeo } from "@/lib/seo";

const architectureLayers = [
  { icon: BookOpenCheck, title: "Patient-facing education", description: "Plain-language instructions, personal plans, schedules, warnings, troubleshooting, and caregiver support." },
  { icon: Workflow, title: "Clinical workflow tools", description: "AVS summaries, teach-back, show-me competency, local contacts, documentation prompts, and handoff support." },
  { icon: ShieldCheck, title: "Clinical governance", description: "Evidence dossiers, qualified review, version control, update triggers, correction routes, and content recall." },
  { icon: Boxes, title: "Institutional delivery", description: "Print, accessible PDF, responsive web, patient portal, video, translation-ready masters, and EHR-ready structured content." },
  { icon: RefreshCcw, title: "Measurement and improvement", description: "Adoption, comprehension, workflow, continuity, usefulness, safety signals, and explicit limits on outcome claims." },
] as const;

const guideAnatomy = [
  ["1", "The most important thing", "One dominant action before background explanation."],
  ["2", "What to do today", "A short checklist for the immediate transition home."],
  ["3", "When to get help", "Emergency, call-today, and follow-up levels using words, icons, and color."],
  ["4", "Your personal plan", "Fields for actual orders, schedules, contacts, refills, suppliers, and follow-up."],
  ["5", "How to do it", "Numbered steps, accurate visuals, show-me checks, and topic-specific troubleshooting."],
  ["6", "When the plan breaks", "Practical instructions for failed refills, delayed supplies, missing home health, weekends, and conflicting instructions."],
] as const;

const technicalCapabilities = [
  {
    icon: Code2,
    title: "Typed content contract",
    description: "Every heading, action, warning, procedure, teach-back prompt, troubleshooting branch, and personalization field is validated before compilation.",
  },
  {
    icon: Layers3,
    title: "Release bundle compiler",
    description: "Package versions, source-dossier references, asset types, supported formats, output paths, checksums, and release states must reconcile.",
  },
  {
    icon: FileJson2,
    title: "Controlled proof registry",
    description: "Public schemas and a nonclinical preview demonstrate the platform while reviewer provenance, clinical payloads, PHI-capable fields, and client material remain withheld.",
  },
] as const;

const PatientEducationSystemsPage = () => {
  useSeo({
    title: "Hospital Patient Education Systems and Discharge Guides",
    description:
      "Review CAF Patient Education Systems: an RN-designed, clinically governed hospital-to-home education product with patient guides, teach-back, operational continuity, institutional customization, and measurable pilots.",
    canonicalPath: "/for-organizations/patient-education-systems",
  });

  useEffect(() => {
    trackGrowthEvent("organization_program_opened", { entry_surface: "patient_education_systems", destination_id: "patient_education_systems" });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="CAF Patient Education Systems · Institutional product in development"
        title="Hospital-to-home education designed around what patients actually have to do next."
        description="A proprietary, RN-designed product system that combines clear patient instructions, personalized plans, teach-back, skill verification, operational troubleshooting, refill and supply continuity, clinical governance, and measurable implementation."
      >
        <Button asChild variant="hero" size="lg"><a href="#pilot-builder">Build a pilot brief <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><Link to="/for-organizations/trust-procurement">Review trust and procurement</Link></Button>
        <Button asChild variant="ghost" size="lg"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "patient_education_systems", action_id: "hero" })}>Contact CAF</Link></Button>
      </PageHero>

      <section className="container max-w-7xl py-12 md:py-16" aria-labelledby="product-status-title">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 shadow-card md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Stethoscope className="h-4 w-4" /> Product status</div>
            <h2 id="product-status-title" className="mt-4 font-display text-3xl font-bold tracking-tight">Building the clinical operating system before selling the library.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The full guides, evidence dossiers, reviewer records, hospital customizations, and clinician tools are private. The public site shows the architecture, governance, pilot model, and controlled product shape without releasing the deployable institutional library.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["5", "flagship modules"],
                ["15", "coordinated assets per topic"],
                ["6", "required release gates"],
              ].map(([value, label]) => <div key={label} className="rounded-2xl border border-border bg-background/85 p-4"><div className="font-display text-3xl font-bold text-primary">{value}</div><div className="mt-1 text-sm font-semibold text-muted-foreground">{label}</div></div>)}
            </div>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50/75 p-6 text-amber-950 md:p-8">
            <LockKeyhole className="h-7 w-7" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold">Controlled preview—not a clinical handout.</h2>
            <p className="mt-3 text-sm leading-relaxed">
              No public page should be used as a substitute for orders, discharge instructions, medical advice, or emergency care. No module is represented as hospital-approved, clinically validated, or pilot-ready until its documented release gates are complete.
            </p>
            <Link to="/for-organizations/faq" className="mt-5 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4">Review buyer FAQ <ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="difference-title">
        <div className="container max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">The product difference</div>
            <h2 id="difference-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Not a stack of handouts. A governed education workflow.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">The product connects the patient explanation, bedside teaching process, hospital-to-home handoff, institutional review, and improvement cycle.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {architectureLayers.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl py-14 md:py-20" aria-labelledby="guide-anatomy-title">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Recognizable guide anatomy</div>
            <h2 id="guide-anatomy-title" className="mt-2 font-display text-3xl font-bold tracking-tight">Patients should know where to look before they read every word.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Every module follows the same navigation and warning hierarchy while preserving topic-specific clinical review, equipment, medication, and local workflow requirements.</p>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Example visual hierarchy</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-950"><strong>Routine action:</strong> What the patient should do now.</div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><strong>Call today:</strong> A concern that should be reviewed promptly.</div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-950"><strong>Emergency:</strong> A clearly labeled action—not color alone.</div>
              </div>
            </div>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {guideAnatomy.map(([number, title, description]) => (
              <li key={number} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{number}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="flagship-title">
        <div className="container max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Initial flagship portfolio</div>
            <h2 id="flagship-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Five modules selected to prove the system across different discharge risks.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">The first module is in evidence development. The remaining modules are planned and will not bypass qualified review or patient testing.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {patientEducationModules.map((module, index) => (
              <article key={module.id} className={`rounded-3xl border bg-background p-6 shadow-sm ${index === 0 ? "border-primary/40 lg:col-span-2" : "border-border"}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-primary">{module.status}</span>
                  <span className="rounded-full border border-border px-3 py-1">{module.riskTier} risk</span>
                  {module.clinicalDomains.map((domain) => <span key={domain} className="rounded-full border border-border px-3 py-1 text-muted-foreground">{domain}</span>)}
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold">{module.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{module.purpose}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">What it proves</div>
                    <ul className="mt-3 space-y-2">{module.proves.map((item) => <li key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Required review disciplines</div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{module.requiredReviewers.join(" · ")}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl py-14 md:py-20" aria-labelledby="package-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">One topic becomes a coordinated package</div>
            <h2 id="package-title" className="mt-2 font-display text-3xl font-bold tracking-tight">A hospital licenses a workflow-ready module—not one PDF.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Each topic is designed to serve patients, caregivers, bedside staff, reviewers, informatics teams, and governance owners through coordinated assets.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patientEducationPackageAssets.map((asset, index) => (
              <div key={asset} className="flex gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-semibold">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>
                <span>{asset}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="continuity-title">
        <div className="container max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">The operational moat</div>
            <h2 id="continuity-title" className="mt-2 font-display text-3xl font-bold tracking-tight">The guide continues where ordinary discharge documents often stop.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {patientEducationContinuityLayers.map((layer, index) => (
              <article key={layer.title} className="rounded-3xl border border-border bg-background p-5">
                <div className="font-display text-3xl font-bold text-primary">0{index + 1}</div>
                <h3 className="mt-3 font-display text-xl font-bold">{layer.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl py-14 md:py-20" aria-labelledby="technical-platform-title">
        <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/15 p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Versioned technical platform</div>
              <h2 id="technical-platform-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">One governed source package, multiple controlled outputs.</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">The engine validates content structure, package metadata, versions, source-dossier references, release gates, distribution boundaries, and asset compatibility before producing any delivery bundle.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                {["Responsive HTML", "Print HTML", "Structured text", "AVS text", "Patient portal JSON"].map((target) => <span key={target} className="rounded-full border border-primary/20 bg-background px-3 py-1 text-primary">{target}</span>)}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {technicalCapabilities.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-3xl border border-border bg-background p-5">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-primary/15 pt-6 md:grid-cols-3">
            <a href="/patient-education/capability-manifest.json" className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40 hover:shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Capability registry</div>
              <div className="mt-2 font-display text-lg font-bold">Inspect current platform capabilities</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Public-safe delivery phases, release gates, formats, privacy posture, and flagship status.</p>
            </a>
            <a href="/patient-education/schemas/public-package-descriptor-v1.schema.json" className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40 hover:shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Versioned schema</div>
              <div className="mt-2 font-display text-lg font-bold">Review the public package contract</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A narrower contract that proves package and release semantics without exposing private governance records.</p>
            </a>
            <a href="/patient-education/demo/controlled-preview-bundle.json" className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40 hover:shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Nonclinical demonstration</div>
              <div className="mt-2 font-display text-lg font-bold">Inspect a controlled preview bundle</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Artifact metadata, paths, targets, checksums, release state, and withheld categories—without clinical payloads.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="container max-w-7xl pb-14 md:pb-20" aria-labelledby="governance-title">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Nonnegotiable release gates</div>
            <h2 id="governance-title" className="mt-2 font-display text-3xl font-bold tracking-tight">No guide is released because it looks polished.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Safety-critical content remains blocked until the evidence, qualified review, health-literacy, accessibility, patient-testing, and institutional-localization records are complete.</p>
          </div>
          <ol className="space-y-3">
            {patientEducationReleaseGates.map((item, index) => (
              <li key={item.gate} className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                <div><h3 className="font-display text-lg font-bold">{item.gate}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.requirement}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container max-w-7xl pb-14 md:pb-20"><PatientEducationPilotBuilder /></section>

      <section className="border-t border-border bg-card/30 py-14 md:py-20" aria-labelledby="boundaries-title">
        <div className="container max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Clear boundaries before procurement</div>
              <h2 id="boundaries-title" className="mt-2 font-display text-3xl font-bold tracking-tight">The product description stays narrower than the ambition.</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">CAF is building toward an institutional education product. It is not currently representing a deployed EHR platform, a certified security program, a clinical service, or proven outcomes.</p>
            </div>
            <ul className="space-y-3">
              {patientEducationClaimsBoundary.map((item) => <li key={item} className="flex gap-3 rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}
            </ul>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [FileCheck2, "Review the procurement boundary", "See current capabilities, scoped-review items, and services not represented."],
              [ClipboardCheck, "Build a pilot starting brief", "Use fixed choices without transmitting patient or case information."],
              [HeartHandshake, "Start a discovery conversation", "Identify the sponsor, care setting, module, reviewers, and evaluation question."],
            ].map(([Icon, title, body], index) => (
              <article key={title as string} className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body as string}</p>
                <Button asChild variant={index === 2 ? "hero" : "outline"} className="mt-5">
                  {index === 0 ? <Link to="/for-organizations/trust-procurement">Open due diligence</Link> : index === 1 ? <a href="#pilot-builder">Build brief</a> : <Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "patient_education_systems", action_id: "footer" })}>Contact CAF <ArrowRight className="h-4 w-4" /></Link>}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PatientEducationSystemsPage;
