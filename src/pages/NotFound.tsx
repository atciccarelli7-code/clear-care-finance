import { Link, Route, Routes, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpenText, Calculator, Compass, HeartPulse, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdditionalDiagnosisGuideRoute } from "@/data/conditionGuideCatalog";
import ConditionGuidePage from "@/pages/ConditionGuidePage";

type RecoveryLink = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const recoveryLinks: RecoveryLink[] = [
  { icon: Compass, title: "Start with the decision", description: "Build a private action plan when you are not sure which page or tool fits.", href: "/start-here" },
  { icon: Calculator, title: "Find a tool", description: "Browse calculators, checklists, screeners, and decision helpers by problem.", href: "/tools" },
  { icon: BookOpenText, title: "Browse topic guides", description: "Choose money, benefits, insurance, medical-cost, or healthcare-system context.", href: "/topics" },
  { icon: HeartPulse, title: "Medicare and Medicaid", description: "Go to the complete Medicare, Medicaid, and long-term-care cost hub.", href: "/medicare-care-costs" },
];

const NotFound = () => {
  const location = useLocation();

  if (isAdditionalDiagnosisGuideRoute(location.pathname)) {
    return (
      <Routes location={location}>
        <Route path="/patients-families/diagnosis-explained/:slug" element={<ConditionGuidePage />} />
      </Routes>
    );
  }

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-primary">404 · Page not found</div>
          <h1 className="mt-4 font-display text-4xl font-bold text-balance md:text-5xl">The link may be old. Your next step is still here.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Nothing was submitted or changed. Return home, or use the nearest destination below to continue without searching the entire site.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg"><Link to="/"><ArrowLeft className="h-4 w-4" /> Return home</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/articles">Browse articles</Link></Button>
          </div>
        </div>

        <nav className="mt-12 grid gap-4 md:grid-cols-2" aria-label="Page recovery options">
          {recoveryLinks.map(({ icon: Icon, title, description, href }) => (
            <Link key={href} to={href} className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover md:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0"><h2 className="font-display text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span></div>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default NotFound;
