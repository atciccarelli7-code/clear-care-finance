import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { BloodThinnerReadinessWorkflow } from "@/components/organizations/BloodThinnerReadinessWorkflow";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const BloodThinnerReadinessPage = () => {
  useSeo({
    title: "Blood Thinner Discharge Readiness Pilot",
    description: "Review a clinically governed, staff-guided blood thinner discharge readiness workflow with exact medication branching, teach-back, barrier resolution, and a controlled patient handout.",
    canonicalPath: "/for-organizations/patient-education-systems/blood-thinner-readiness",
    noindex: true,
  });

  return <>
    <div className="print:hidden">
      <PageHero eyebrow="Care Readiness · Controlled institutional pilot" title="Turn blood thinner education into a verifiable discharge handoff." description="A working review experience that connects exact-medication teaching, teach-back, practical barrier ownership, safe-stop logic, a patient-facing action sheet, and claim-level evidence markers.">
        <Button asChild variant="outline" size="lg" className="text-foreground"><Link to="/for-organizations/patient-education-systems"><ArrowLeft className="h-4 w-4" /> Back to Hospital & Patient Guide</Link></Button>
        <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-4 text-sm font-bold text-slate-950"><ShieldCheck className="h-4 w-4" /> Clinical review required · not approved for patient use</div>
      </PageHero>
    </div>
    <section className="container pt-8 md:pt-12"><BloodThinnerReadinessWorkflow /></section>
    <section className="container pb-16 print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-3xl border border-primary/20 bg-primary-soft/45 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Controlled buyer review</div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">Evaluate the workflow without requesting patient use.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Hospital nursing, pharmacy, patient education, quality, and innovation leaders can request a bounded review of the product architecture, implementation model, evidence controls, and pilot requirements. Full medication instructions and private governance records are not distributed through this public demonstration.</p>
        </div>
        <Button asChild size="lg" className="shrink-0"><Link to="/contact"><Mail className="h-4 w-4" /> Request a controlled review</Link></Button>
      </div>
    </section>
  </>;
};

export default BloodThinnerReadinessPage;
