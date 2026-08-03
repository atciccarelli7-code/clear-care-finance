import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BenefitsOfferValidationPathway = () => (
  <section className="border-t border-border bg-primary-soft/20 py-12 md:py-16" aria-labelledby="benefits-offer-validation-handoff">
    <div className="container min-w-0">
      <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl border border-primary/20 bg-card p-6 shadow-card md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Optional early-access test</div>
          <h2 id="benefits-offer-validation-handoff" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Would you pay $29 to coordinate the complete open-enrollment decision?
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Review exactly what the proposed Benefits Decision System would add beyond CAF&apos;s free comparisons and tools. Joining the list is a price-qualified signal—not a purchase, reservation, or obligation.
          </p>
          <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>No card, checkout, benefit-plan data, employer documents, or medical information is requested.</span>
          </div>
        </div>
        <Button asChild variant="hero" size="lg" className="w-full whitespace-normal text-center lg:w-auto">
          <a href="/products/healthcare-worker-benefits-decision-system">
            Review the $29 offer <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  </section>
);
