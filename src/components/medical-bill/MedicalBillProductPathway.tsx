import { useEffect } from "react";
import { ArrowRight, Eye, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalBillInterestForm } from "@/components/medical-bill/MedicalBillInterestForm";
import { Button } from "@/components/ui/button";
import { MEDICAL_BILL_PRODUCT } from "@/data/medicalBillProduct";
import { trackSiteEvent } from "@/lib/analytics";
import { getMedicalBillProductPathway } from "./medicalBillProductPathwayConfig";

export function MedicalBillProductPathway({ pathname }: { pathname: string }) {
  const pathway = getMedicalBillProductPathway(pathname);

  useEffect(() => {
    if (!pathway) return;
    trackSiteEvent("medical_bill_product_pathway_view", {
      event_category: "medical_bill_product",
      offer_id: MEDICAL_BILL_PRODUCT.id,
      source: pathway.source,
      pathway_variant: pathway.variant,
    });
  }, [pathway, pathname]);

  if (!pathway) return null;

  const isHub = pathway.variant === "hub";

  const trackPreview = () => {
    trackSiteEvent("premium_product_preview", {
      event_category: "medical_bill_product",
      offer_id: MEDICAL_BILL_PRODUCT.id,
      product_status: MEDICAL_BILL_PRODUCT.status,
      source: pathway.source,
    });
  };

  const trackHandoff = (destination: string) => {
    trackSiteEvent("supporting_page_to_product", {
      event_category: "medical_bill_product",
      offer_id: MEDICAL_BILL_PRODUCT.id,
      source: pathway.source,
      destination,
    });
  };

  return (
    <section className="container min-w-0 py-8 md:py-12" aria-labelledby={`medical-bill-product-pathway-${pathway.source}`}>
      <div className="overflow-hidden rounded-[2rem] border border-primary/20 bg-primary-soft/20 shadow-card">
        <div className={`grid gap-0 ${isHub ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[1fr_auto] lg:items-center"}`}>
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {isHub ? "Free response sequence and workbook preview" : "Free medical-bill workbook preview"}
            </div>
            <h2 id={`medical-bill-product-pathway-${pathway.source}`} className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
              {isHub ? "Keep the next medical-bill call organized." : "Turn this explanation into a working medical-bill file."}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {MEDICAL_BILL_PRODUCT.promise} Preview representative pages now. The complete free response system, official sources, and printable Response Pack remain available without payment.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-3 py-1.5">No payment</span>
              <span className="rounded-full border border-border bg-background px-3 py-1.5">No bill upload</span>
              <span className="rounded-full border border-border bg-background px-3 py-1.5">Free system stays complete</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero">
                <a
                  href={MEDICAL_BILL_PRODUCT.previewPath}
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackPreview}
                >
                  <Eye className="h-4 w-4" /> Preview sample pages
                </a>
              </Button>
              {isHub ? (
                <Button asChild variant="outline">
                  <a
                    href={MEDICAL_BILL_PRODUCT.freePackPath}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackHandoff("free_response_pack")}
                  >
                    Open the free Response Pack <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link
                    to={MEDICAL_BILL_PRODUCT.freeSystemPath}
                    onClick={() => trackHandoff("medical_bill_response_system")}
                  >
                    Use the free response system <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{MEDICAL_BILL_PRODUCT.limitations}</span>
            </div>
            <div className="mt-3 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Checkout remains disabled while usefulness, email delivery, accessibility, and non-founder demand are validated.</span>
            </div>
          </div>

          {isHub && (
            <div className="border-t border-border bg-background/75 p-6 md:p-8 lg:border-l lg:border-t-0">
              <MedicalBillInterestForm source={pathway.source} mode="sequence" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
