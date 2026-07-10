import { cn } from "@/lib/utils";

interface DisclaimerBoxProps {
  className?: string;
  short?: boolean;
}

export const DISCLAIMER_TEXT =
  "Community Acquired Finance provides general educational information only. It is not financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice, and its tools do not make official eligibility, coverage, authorization, or plan determinations. Verify important details with current official sources, plan documents, government agencies, insurers, employers, billing offices, and qualified professionals.";

export const DisclaimerBox = ({ className, short }: DisclaimerBoxProps) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-muted/30 p-5 text-xs md:text-sm text-muted-foreground leading-relaxed",
      className,
    )}
  >
    <strong className="text-foreground font-semibold">Educational only. </strong>
    {short
      ? "Not individualized financial, legal, insurance, medical, billing, employment, or benefits advice."
      : DISCLAIMER_TEXT}
  </div>
);
