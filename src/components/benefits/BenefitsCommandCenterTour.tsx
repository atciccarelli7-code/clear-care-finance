import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const steps = [
  {
    title: "Create or load a package",
    description: "Use a private local label such as Current job, Offer A, or Offer B. An employer name is never required.",
  },
  {
    title: "Separate guaranteed and variable compensation",
    description: "Enter base pay, realistic overtime, differentials, bonuses, and work-related costs without treating every possible dollar as guaranteed.",
  },
  {
    title: "Compare healthcare scenarios",
    description: "See annual premiums, low- and moderate-use estimates, worst-case exposure, and employer HSA or HRA funding together.",
  },
  {
    title: "Review employer retirement money",
    description: "Estimate matching, non-elective contributions, uncaptured match, and the portion of employer value that is not yet vested.",
  },
  {
    title: "Find hidden or unused benefits",
    description: "Classify disability, life insurance, tuition, childcare, certification, commuter, and other benefits without inventing a dollar value for everything.",
  },
  {
    title: "Generate the Benefits Receipt",
    description: "The Receipt separates cash, employer contributions, employee costs, healthcare exposure, unvested value, qualitative benefits, and unresolved questions.",
  },
  {
    title: "Compare another package",
    description: "Review two packages side by side. The Command Center highlights tradeoffs and uncertainty rather than declaring a universal winner.",
  },
  {
    title: "Save fixed actions to My Plan",
    description: "Move only non-sensitive, fixed next actions into My Plan so package values and labels never enter the shared planning workspace.",
  },
] as const;

interface BenefitsCommandCenterTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onSkip: () => void;
}

const BenefitsCommandCenterTour = ({ open, onOpenChange, onComplete, onSkip }: BenefitsCommandCenterTourProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  const complete = () => {
    onComplete();
    onOpenChange(false);
  };

  const skip = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-3xl motion-reduce:animate-none motion-reduce:duration-0">
        <DialogHeader>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Compass className="h-4 w-4" aria-hidden="true" /> 60–90 second product tour
          </div>
          <DialogTitle className="font-display text-2xl leading-tight">{step.title}</DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed md:text-base">{step.description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-border bg-muted/25 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Step {stepIndex + 1} of {steps.length}</span>
            <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Benefits Command Center tour progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={stepIndex + 1}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          The tour uses no financial inputs. Press Escape or use Skip tour to close it at any time.
        </p>

        <DialogFooter className="gap-2 sm:space-x-0">
          <Button type="button" variant="ghost" onClick={skip}>
            <X className="h-4 w-4" /> Skip tour
          </Button>
          <div className="flex flex-1 justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            {isLast ? (
              <Button type="button" onClick={complete}>
                <Check className="h-4 w-4" /> Finish tour
              </Button>
            ) : (
              <Button type="button" onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BenefitsCommandCenterTour;
