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
      "rounded-2xl border border-destructive/30 bg-destructive/10 p-6 md:p-8 flex flex-col md:flex-row items-start gap-5",
      className,
    )}
  >
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/20 text-destructive shrink-0">
      <AlertTriangle className="h-5 w-5" />
    </div>
    <div>
      <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">{title}</h3>
      <div className="text-sm md:text-base text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </div>
  </div>
);
