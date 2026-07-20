import { Link } from "react-router-dom";
import { PauseCircle } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const ForOrganizationsPage = () => {
  useSeo({
    title: "Healthcare Financial Education for Organizations",
    description: "Public CAF financial-education programs and a clear notice that institutional patient-education sales are paused.",
    canonicalPath: "/for-organizations",
  });

  return (
    <>
      <PageHero
        eyebrow="For organizations"
        title="Healthcare financial education without private records."
        description="CAF currently focuses on public financial education and decision preparation."
      >
        <Button asChild variant="hero" size="lg"><Link to="/start-here">Review public resources</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/patients-families/hospital-guide">Open patient guides</Link></Button>
      </PageHero>
      <section className="container max-w-4xl py-12 md:py-16" aria-labelledby="paused-title">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/75 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-100 md:p-8">
          <PauseCircle className="h-7 w-7" aria-hidden="true" />
          <h2 id="paused-title" className="mt-4 font-display text-3xl font-bold">Institutional patient-education sales are paused.</h2>
          <p className="mt-3 leading-relaxed">CAF preserved the Hospital &amp; Patient Guide research, governance, architecture, and controlled clinical-development work as a future option. CAF is not currently offering a hospital pilot, institutional blood-thinner product, design-partner pathway, or patient-education license.</p>
          <p className="mt-3 text-sm leading-relaxed">The strongest public-safe work now supports the free consumer guide library. No hospital, reviewer, clinician, insurer, attorney, employer, or regulator has approved the private institutional package.</p>
          <Button asChild variant="outline" className="mt-5"><Link to="/patients-families/hospital-guide">Review the consumer guide library</Link></Button>
        </div>
      </section>
    </>
  );
};

export default ForOrganizationsPage;
