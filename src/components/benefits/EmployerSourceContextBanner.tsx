import { useEffect, useState } from "react";
import { ExternalLink, FileCheck2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BENEFITS_COMMAND_CENTER_UPDATED_EVENT,
  loadBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  clearEmployerBenefitsSourceContext,
  EMPLOYER_BENEFITS_SOURCE_CONTEXT_UPDATED_EVENT,
  loadEmployerBenefitsSourceContext,
  type EmployerBenefitsSourceContext,
} from "@/lib/employerBenefitsSourceContext";

const sourceMetadata = (context: EmployerBenefitsSourceContext) => {
  const source = context.selectedSource;
  if (!source) return "No public source was attached. Enter and verify all figures manually.";
  return [source.planYearLabel, source.audience, source.stateRegion].filter(Boolean).join(" · ")
    || "Current official employer source";
};

const loadMatchingContext = () => {
  const context = loadEmployerBenefitsSourceContext();
  const workspace = loadBenefitsWorkspace();
  if (!context || !workspace) return null;
  const activePackage = workspace.packages.find((benefitsPackage) => benefitsPackage.id === workspace.activePackageId)
    ?? workspace.packages[0];
  return activePackage?.label.toLowerCase().includes(context.systemName.toLowerCase()) ? context : null;
};

const EmployerSourceContextBanner = () => {
  const [context, setContext] = useState<EmployerBenefitsSourceContext | null>(null);

  useEffect(() => {
    const syncContext = () => setContext(loadMatchingContext());
    syncContext();
    window.addEventListener(EMPLOYER_BENEFITS_SOURCE_CONTEXT_UPDATED_EVENT, syncContext);
    window.addEventListener(BENEFITS_COMMAND_CENTER_UPDATED_EVENT, syncContext);
    window.addEventListener("storage", syncContext);
    return () => {
      window.removeEventListener(EMPLOYER_BENEFITS_SOURCE_CONTEXT_UPDATED_EVENT, syncContext);
      window.removeEventListener(BENEFITS_COMMAND_CENTER_UPDATED_EVENT, syncContext);
      window.removeEventListener("storage", syncContext);
    };
  }, []);

  if (!context) return null;

  return (
    <div className="mb-5 rounded-3xl border border-primary/25 bg-primary-soft/20 p-5 shadow-card print:hidden" role="status" aria-live="polite">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <FileCheck2 className="h-4 w-4" aria-hidden="true" /> Employer source attached
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-foreground">{context.systemName}</h2>
          {context.selectedSource ? (
            <>
              <p className="mt-2 font-semibold text-foreground">{context.selectedSource.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{sourceMetadata(context)}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{sourceMetadata(context)}</p>
          )}
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The source is attached for reference only. CAF has not copied premiums, deductibles, retirement formulas, eligibility rules, or other figures into this workspace. Confirm that the source applies to your location and employee group before entering values.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {context.selectedSource && (
            <Button asChild size="sm" variant="outline">
              <a href={context.selectedSource.url} target="_blank" rel="noreferrer">
                Open official source <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              clearEmployerBenefitsSourceContext();
              setContext(null);
            }}
          >
            Remove source <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerSourceContextBanner;
