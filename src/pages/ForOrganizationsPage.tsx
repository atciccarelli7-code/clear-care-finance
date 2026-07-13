import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Building2, CheckCircle2, EyeOff, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { useSeo } from "@/lib/seo";

const included = [
  "A defined employee or learner cohort and one clear decision moment, such as open enrollment or new-hire benefits.",
  "Access to CAF's public Decision Concierge, benefits review, source-backed education, and printable action Receipts.",
  "A short launch orientation and a structured feedback review with the organization.",
  "Only aggregate, privacy-safe engagement signals already permitted by CAF's consent controls.",
];

const excluded = [
  "No employee accounts, eligibility determinations, plan selection, enrollment, payroll connection, or HR-system integration.",
  "No employer, carrier, plan, diagnosis, medication, member, financial-account, or unrestricted employee data.",
  "No claim of HIPAA compliance, fiduciary status, insurance brokerage, legal representation, tax preparation, or benefits administration.",
  "No promised savings, participation rate, ROI, or employee outcome before a real pilot produces evidence.",
];

const ForOrganizationsPage = () => {
  useSeo({
    title: "Benefits Education Pilot for Healthcare Organizations",
    description: "Explore a small, privacy-minimized CAF educational pilot for healthcare employees, nursing programs, professional associations, and workforce organizations.",
    canonicalPath: "/for-organizations",
  });

  useEffect(() => {
    trackGrowthEvent("organization_page_viewed", { entry_surface: "organization" });
  }, []);

  const trackDemo = (destinationId: "benefits_change_detector" | "benefits_command_center") =>
    trackGrowthEvent("organization_demo_opened", { destination_id: destinationId });

  return (
    <>
      <PageHero
        eyebrow="For healthcare organizations"
        title="Test clearer benefits decisions with a small educational pilot."
        description="Community Acquired Finance is exploring limited pilots for hospitals, nursing programs, professional associations, staffing organizations, and healthcare employers. This is an early educational product—not a benefits-administration platform."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_selected", { cta_type: "pilot_inquiry" })}>
            Discuss a pilot <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools/benefits-change-detector" onClick={() => trackDemo("benefits_change_detector")}>Try the employee experience</Link>
        </Button>
      </PageHero>

      <div className="container max-w-6xl space-y-14 py-12 md:py-16">
        <section className="grid gap-5 md:grid-cols-3" aria-label="Pilot purpose">
          {[
            [UsersRound, "Employee problem", "Benefits materials are dense, deadlines are short, and people often repeat elections without noticing what changed."],
            [Building2, "Pilot question", "Can a focused, plain-English decision flow help one defined group reach better verification questions and next actions?"],
            [BarChart3, "Proof before scale", "Measure safe engagement and structured feedback before claiming demand, outcomes, savings, or enterprise readiness."],
          ].map(([Icon, title, body]) => (
            <article key={title as string} className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-xl font-bold">{title as string}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body as string}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-primary/20 bg-primary-soft/25 p-6 md:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Proposed pilot boundary</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">One cohort. One decision moment. Four to six weeks.</h2>
            <ul className="mt-6 space-y-3">
              {included.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{item}</span></li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Non-negotiable limits</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Education and preparation—not administration.</h2>
            <ul className="mt-6 space-y-3">
              {excluded.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground"><EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{item}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-primary" />
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Privacy-minimized demonstration</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Review the real public product before discussing a pilot.</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">The demonstrations below use the same public, browser-local experiences available to individuals. Do not enter employer, plan, carrier, employee, patient, or other identifying information.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero"><Link to="/tools/benefits-change-detector" onClick={() => trackDemo("benefits_change_detector")}>Open Benefits Change Detector</Link></Button>
                <Button asChild variant="outline"><Link to="/tools/benefits-command-center" onClick={() => trackDemo("benefits_command_center")}>Open Benefits Command Center</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <details
          className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8"
          onToggle={(event) => {
            if (event.currentTarget.open) trackGrowthEvent("organization_pilot_details_viewed", { cta_type: "pilot_scope" });
          }}
        >
          <summary className="cursor-pointer font-display text-xl font-bold">What must be proven before CAF charges an organization?</summary>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>A clearly defined buyer, participant group, and decision problem.</li>
            <li>Completed legal, privacy, security, accessibility, and professional-scope review for the agreed pilot.</li>
            <li>Evidence that participants can use the product and reach useful next actions without employer-specific data ingestion.</li>
            <li>A support, correction, incident, measurement, and data-retention plan the organization accepts in writing.</li>
            <li>No unsupported promise that the pilot reduces claims, increases enrollment quality, or creates financial ROI.</li>
          </ul>
        </details>

        <section className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Early conversation only</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Have a defined cohort and decision problem?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90 md:text-base">Use the existing contact channel. Do not include employee, patient, plan, carrier, medical, financial, or other sensitive details.</p>
            </div>
            <Button asChild size="lg" variant="secondary"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_selected", { cta_type: "pilot_inquiry" })}>Contact CAF</Link></Button>
          </div>
        </section>

        <DisclaimerBox />
      </div>
    </>
  );
};

export default ForOrganizationsPage;
