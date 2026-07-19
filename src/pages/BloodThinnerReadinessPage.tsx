import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BloodThinnerReadinessWorkflow } from "@/components/organizations/BloodThinnerReadinessWorkflow";
import { CareReadinessBuyerBrief } from "@/components/organizations/CareReadinessBuyerBrief";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const BloodThinnerReadinessPage = () => {
  useSeo({
    title: "Blood Thinner Discharge Readiness Pilot",
    description: "Review a clinically governed, staff-guided blood thinner discharge readiness workflow with exact medication branching, teach-back, barrier resolution, a controlled patient handout, and a no-PHI hospital review brief.",
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
    <section className="container pb-16 print:hidden"><CareReadinessBuyerBrief /></section>
  </>;
};

export default BloodThinnerReadinessPage;
