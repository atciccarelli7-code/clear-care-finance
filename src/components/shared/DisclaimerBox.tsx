import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DisclaimerBoxProps {
  className?: string;
  short?: boolean;
  children?: ReactNode;
}

export const DISCLAIMER_TEXT =
  "Community Acquired Finance provides educational information only. It is not financial, tax, legal, insurance, or medical advice. Always verify details with official sources, your benefits department, a qualified professional, or your plan documents.";

export const DisclaimerBox = ({ className, short, children }: DisclaimerBoxProps) => (
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
    {children && <p className="mt-2">{children}</p>}
  </div>
);
