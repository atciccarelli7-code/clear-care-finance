import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CalloutWarningProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const CalloutWarning = ({ title, children, className }: CalloutWarningProps) => (
  <div
    className={cn(
      "flex min-w-0 flex-col items-start gap-5 break-words rounded-2xl border border-destructive/30 bg-destructive/10 p-6 md:flex-row md:p-8",
      className,
    )}
  >
    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
      <AlertTriangle className="h-5 w-5" />
    </div>
    <div className="min-w-0 break-words">
      <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2 break-words">{title}</h3>
      <div className="text-sm md:text-base text-muted-foreground leading-relaxed space-y-3 break-words">{children}</div>
    </div>
  </div>
);
