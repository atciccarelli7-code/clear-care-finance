import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { BENEFITS_COMMAND_CENTER_ENTRY_ROUTES } from "@/components/benefits/benefitsCommandCenterEntryConfig";
import { buildBenefitsActivationEventProperties } from "@/lib/benefitsCommandCenterActivation";

export const BenefitsCommandCenterEntry = () => {
  const location = useLocation();
  const config = BENEFITS_COMMAND_CENTER_ENTRY_ROUTES[location.pathname];
  if (!config) return null;

  const sampleActivation = location.pathname === "/healthcare-workers" || location.pathname === "/tools/healthcare-worker-total-compensation-comparison"
    ? "sample_comparison"
    : "sample_receipt";

  return (
    <section className="container mt-10 print:hidden" aria-label="Benefits Command Center next step">
      <div className="overflow-hidden rounded-xl border border-secondary/20 bg-card/80 p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-soft/70 text-secondary">
            <ReceiptText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">{config.eyebrow}</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{config.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{config.description}</p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Local-only package storage · no account or document upload
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:min-w-64 lg:flex-col">
            <Button asChild size="lg">
              <Link
                to="/tools/benefits-command-center?mode=build#benefits-command-center-workspace"
                state={{ activation: "start_own", entrySurface: config.entrySurface }}
                onClick={() => trackSiteEvent("benefits_command_center_entry_opened", {
                  event_category: "tools",
                  source_route: location.pathname,
                  destination_path: "/tools/benefits-command-center",
                  entry_id: "benefits_command_center",
                })}
              >
                {config.buttonLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {config.sampleButtonLabel && (
              <Button asChild size="lg" variant="outline">
                <Link
                  to={`/tools/benefits-command-center?mode=${sampleActivation === "sample_comparison" ? "compare-samples" : "sample-receipt"}#benefits-command-center-workspace`}
                  state={{ activation: sampleActivation, entrySurface: config.entrySurface }}
                  onClick={() => trackSiteEvent(
                    sampleActivation === "sample_comparison" ? "benefits_command_center_sample_comparison_open" : "benefits_command_center_sample_open",
                    buildBenefitsActivationEventProperties({
                      entrySurface: config.entrySurface,
                      activationPath: sampleActivation,
                      moduleId: sampleActivation === "sample_comparison" ? "comparison" : "receipt",
                      packageCount: sampleActivation === "sample_comparison" ? 2 : 1,
                    }),
                  )}
                >
                  {config.sampleButtonLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
