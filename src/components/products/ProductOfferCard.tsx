import { ArrowRight, BookOpenCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  medicalBillWorkbook,
  type MedicalBillProductSource,
} from "@/data/productCatalog";
import { trackSiteEvent } from "@/lib/analytics";

type ProductOfferCardProps = {
  source: MedicalBillProductSource;
  compact?: boolean;
  className?: string;
};

export const ProductOfferCard = ({
  source,
  compact = false,
  className = "",
}: ProductOfferCardProps) => (
  <section
    className={`rounded-[2rem] border border-primary/20 bg-primary-soft/25 p-6 shadow-card md:p-8 ${className}`}
    aria-labelledby={`medical-bill-workbook-${source}`}
  >
    <div className={compact ? "grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center" : "space-y-6"}>
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <BookOpenCheck className="h-4 w-4" /> Optional organization upgrade
        </div>
        <h2
          id={`medical-bill-workbook-${source}`}
          className="mt-3 font-display text-2xl font-bold md:text-3xl"
        >
          Expanded Medical Bill Response Workbook
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          The free response system explains the next step. The 32-page workbook
          helps you document bills, EOBs, calls, deadlines, assistance records,
          written requests, and caregiver handoffs in one reusable system.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full border border-border bg-card px-3 py-1.5">
            {medicalBillWorkbook.priceLabel}
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1.5">
            Printable PDF + editable workbook
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1.5">
            No subscription
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <Button asChild variant="hero" size="lg">
          <Link
            to={medicalBillWorkbook.route}
            onClick={() =>
              trackSiteEvent("free_to_premium_click", {
                event_category: "medical_bill_product",
                source_surface: source,
                product_id: medicalBillWorkbook.id,
              })
            }
          >
            Preview the workbook <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="flex max-w-xs items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Essential billing guidance, official sources, and the free response pack remain free.
        </p>
      </div>
    </div>
  </section>
);
