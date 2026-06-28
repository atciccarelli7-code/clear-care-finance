import { cn } from "@/lib/utils";

interface DisclaimerBoxProps {
  className?: string;
  short?: boolean;
}

export const DISCLAIMER_TEXT =
  "Community Acquired Finance provides educational information only. It is not financial, investment, tax, legal, insurance, billing, employment, benefits, medical, or fiduciary advice. Articles and tools are not recommendations to buy, sell, hold, enroll, decline coverage, change benefits, or choose any specific investment, account, plan, fund, insurer, provider, or employer action. Always verify details with official sources, your benefits department, plan documents, and qualified professionals before acting.";

export const DisclaimerBox = ({ className, short }: DisclaimerBoxProps) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-muted/30 p-5 text-xs md:text-sm text-muted-foreground leading-relaxed",
      className,
    )}
  >
    <strong className="text-foreground font-semibold">Educational only. </strong>
    {short
      ? "Not financial, investment, tax, legal, insurance, billing, employment, benefits, medical, or fiduciary advice."
      : DISCLAIMER_TEXT}
  </div>
);
