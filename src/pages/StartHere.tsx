import { lazy, Suspense } from "react";
import { FinancialNavigator } from "@/components/navigator/FinancialNavigator";
import { DecisionConcierge } from "@/components/growth/DecisionConcierge";
import { useSeo } from "@/lib/seo";

const FinancialFoundationCheckup = lazy(() => import("@/components/calculators/FinancialFoundationCheckup"));

const StartHere = () => {
  useSeo({
    title: "Financial Navigator: Build Your Next Money Action Plan",
    description: "Build a private action plan and repeatable financial foundation checkup for cash, debt, retirement, savings, workplace benefits, healthcare costs, Medicare, Medicaid, or a healthcare-career decision.",
    canonicalPath: "/start-here",
  });

  return (
    <>
      <section className="container py-10 md:py-12">
        <DecisionConcierge entrySurface="start_here" compact />
      </section>
      <FinancialNavigator />
      <Suspense
        fallback={(
          <section className="border-t border-border bg-card/35 py-16" role="status" aria-live="polite">
            <div className="container text-center text-sm font-semibold text-muted-foreground">Loading Financial Foundation Checkup…</div>
          </section>
        )}
      >
        <FinancialFoundationCheckup />
      </Suspense>
    </>
  );
};

export default StartHere;
