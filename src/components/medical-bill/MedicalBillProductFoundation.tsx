import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { MedicalBillInterestForm } from "@/components/medical-bill/MedicalBillInterestForm";

const freeResources = [
  "Identify whether you have an EOB, provider bill, denial, collection notice, or estimate",
  "Compare the insurer’s allowed amount and patient responsibility with the provider bill",
  "Prepare specific questions for the provider, insurer, or billing office",
  "Organize financial-assistance, appeal, and escalation steps",
  "Keep a written record of calls, documents, deadlines, and next actions",
] as const;

export function MedicalBillProductFoundation() {
  const openFreePack = () => {
    trackSiteEvent("free_pack_download", {
      event_category: "medical_bill_product",
      asset_id: "medical_bill_response_pack",
      source: "newsletter_medical_bill_resources",
    });
    window.open("/downloads/medical-bill-response-pack", "_blank", "noopener,noreferrer");
  };

  return (
    <section id="medical-bill-resources" className="container scroll-mt-24 py-12 md:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-primary/20 bg-card shadow-hover">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Free medical-bill resources
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Organize a confusing medical bill before you pay or escalate it.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Use the guided response system and printable pack to compare documents, prepare questions, track deadlines, and leave each billing call with a clear next action.
            </p>

            <div className="mt-6 rounded-3xl border border-border bg-muted/20 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-lg font-bold">No account or document upload required.</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Work locally with your own bills and EOBs. Community Acquired Finance does not ask you to upload account numbers, claim details, diagnoses, or medical records.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {freeResources.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero">
                <Link to="/insurance/medical-bill-review-toolkit">
                  Use the response system <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button type="button" variant="outline" onClick={openFreePack}>
                Open the printable response pack
              </Button>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              These resources organize a process. They do not determine what someone owes, review coding, provide legal conclusions, negotiate a bill, or guarantee savings or appeal success.
            </p>
          </div>

          <div className="border-t border-border bg-primary-soft/15 p-6 md:p-8 lg:border-l lg:border-t-0">
            <MedicalBillInterestForm source="newsletter-medical-bill-resources" />
          </div>
        </div>
      </div>
    </section>
  );
}
