import { ArrowRight, CheckCircle2, Eye, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MEDICAL_BILL_PRODUCT } from "@/data/medicalBillProduct";
import { trackSiteEvent } from "@/lib/analytics";
import { MedicalBillInterestForm } from "@/components/medical-bill/MedicalBillInterestForm";

export function MedicalBillProductFoundation() {
  const openPreview = () => {
    trackSiteEvent("premium_product_preview", {
      event_category: "medical_bill_product",
      offer_id: MEDICAL_BILL_PRODUCT.id,
      product_status: MEDICAL_BILL_PRODUCT.status,
    });
  };

  return (
    <section id="medical-bill-workbook" className="container scroll-mt-24 py-12 md:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-primary/20 bg-card shadow-hover">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Product foundation in development
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
              {MEDICAL_BILL_PRODUCT.name}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {MEDICAL_BILL_PRODUCT.promise}
            </p>

            <div className="mt-6 rounded-3xl border border-border bg-muted/20 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-lg font-bold">The free guidance stays free.</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Document identification, basic rights, official-source links, the Medical Bill Response System, and the free Response Pack remain available without payment. The workbook adds deeper organization and execution tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {MEDICAL_BILL_PRODUCT.includedSections.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" onClick={openPreview}>
                <a href={MEDICAL_BILL_PRODUCT.previewPath} target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4" /> Preview sample pages
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to={MEDICAL_BILL_PRODUCT.freeSystemPath}>
                  Use the free response system <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={MEDICAL_BILL_PRODUCT.freePackPath} target="_blank" rel="noreferrer">
                  Open the free pack
                </a>
              </Button>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-primary/25 bg-primary-soft/20 p-4 text-sm leading-relaxed text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Checkout is intentionally disabled. Community Acquired Finance is validating usefulness, repeat readership, and audience demand before deciding whether this should become a paid product.
              </span>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              {MEDICAL_BILL_PRODUCT.limitations}
            </p>
          </div>

          <div className="border-t border-border bg-primary-soft/15 p-6 md:p-8 lg:border-l lg:border-t-0">
            <MedicalBillInterestForm source="newsletter-medical-bill-workbook" />
            <div className="mt-5 rounded-2xl border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Development status:</strong> the complete workbook source and print-ready master are built. The current work is audience validation, email delivery verification, accessibility, and consistent site traffic—not payment collection.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
