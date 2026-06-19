import { cn } from "@/lib/utils";

interface DisclaimerBoxProps {
  className?: string;
  short?: boolean;
}

export const DISCLAIMER_TEXT =
  "This content is for education only. It is not financial, tax, legal, insurance, or medical advice. Rules, plan details, and costs can change. Confirm important decisions with your employer, plan documents, Medicare.gov, IRS.gov, a licensed professional, or another appropriate source.";

export const DisclaimerBox = ({ className, short }: DisclaimerBoxProps) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-muted/30 p-5 text-xs md:text-sm text-muted-foreground leading-relaxed",
      className,
    )}
  >
    <strong className="text-foreground font-semibold">Educational only. </strong>
    {short
      ? "Not financial, tax, legal, insurance, or medical advice."
      : DISCLAIMER_TEXT}
  </div>
);
