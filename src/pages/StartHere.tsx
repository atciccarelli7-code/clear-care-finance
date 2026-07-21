import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { FinancialNavigator } from "@/components/navigator/FinancialNavigator";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const FinancialFoundationCheckup = lazy(() => import("@/components/calculators/FinancialFoundationCheckup"));

const OPTIONAL_CHECKUP_HASH = "#financial-foundation-checkup";

const StartHere = () => {
  const location = useLocation();
  const [showOptionalCheckup, setShowOptionalCheckup] = useState(location.hash === OPTIONAL_CHECKUP_HASH);

  useEffect(() => {
    if (location.hash === OPTIONAL_CHECKUP_HASH) setShowOptionalCheckup(true);
  }, [location.hash]);

  useSeo({
    title: "Financial Navigator: Build Your Next Money Action Plan",
    description: "Build one private, prioritized action plan for cash, debt, retirement, workplace benefits, healthcare costs, Medicare, Medicaid, or a healthcare-career decision.",
    canonicalPath: "/start-here",
  });

  return (
    <>
      <FinancialNavigator />
      <section
        id="financial-foundation-checkup"
        className="scroll-mt-24 border-t border-border bg-card/35 py-14 print:hidden"
        aria-labelledby="optional-foundation-checkup-heading"
      >
        <div className="container max-w-4xl">
          <div className="rounded-3xl border border-border bg-background p-6 shadow-card md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">Optional follow-up</div>
                <h2 id="optional-foundation-checkup-heading" className="mt-2 font-display text-2xl font-bold tracking-tight">
                  Finish the Financial Navigator first.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Start Here has one primary job: produce your prioritized action plan. The broader Financial Foundation Checkup is available only as an optional second exercise after the plan is complete.
                </p>
              </div>
            </div>

            {!showOptionalCheckup ? (
              <Button type="button" variant="outline" className="mt-6" onClick={() => setShowOptionalCheckup(true)}>
                Open the optional foundation checkup <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="mt-8 border-t border-border pt-8">
                <Suspense
                  fallback={(
                    <div className="py-10 text-center text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">
                      Loading the optional Financial Foundation Checkup…
                    </div>
                  )}
                >
                  <FinancialFoundationCheckup />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default StartHere;
