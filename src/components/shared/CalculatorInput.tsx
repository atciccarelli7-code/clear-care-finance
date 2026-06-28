import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CalculatorInputProps {
  label: string;
  helper?: string;
  value: number | string;
  onChange: (v: string) => void;
  type?: "number" | "text";
  prefix?: string;
  suffix?: string;
  step?: string;
  className?: string;
}

export const CalculatorInput = ({
  label,
  helper,
  value,
  onChange,
  type = "number",
  prefix,
  suffix,
  step,
  className,
}: CalculatorInputProps) => (
  <div className={cn("min-w-0 space-y-2", className)}>
    <Label className="text-sm font-semibold leading-tight text-foreground break-words">{label}</Label>
    <div className="relative min-w-0">
      {prefix && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
          {prefix}
        </span>
      )}
      <Input
        type={type}
        min={type === "number" ? "0" : undefined}
        step={step ?? (type === "number" ? "any" : undefined)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 w-full min-w-0 rounded-2xl border-border bg-background/80 text-base font-semibold tabular-nums shadow-sm transition-smooth placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary/20",
          prefix && "pl-8",
          suffix && "pr-12",
        )}
        inputMode={type === "number" ? "decimal" : undefined}
        aria-label={label}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
    {helper && <p className="text-xs leading-relaxed text-muted-foreground break-words">{helper}</p>}
  </div>
);

interface CalculatorSelectProps {
  label: string;
  helper?: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}

export const CalculatorSelectField = ({ label, helper, children }: { label: string; helper?: string; children: ReactNode }) => (
  <div className="min-w-0 space-y-2">
    <Label className="text-sm font-semibold leading-tight text-foreground break-words">{label}</Label>
    <div className="min-w-0 [&_[role=combobox]]:h-12 [&_[role=combobox]]:rounded-2xl [&_[role=combobox]]:bg-background/80 [&_[role=combobox]]:font-semibold [&_[role=combobox]]:shadow-sm">
      {children}
    </div>
    {helper && <p className="text-xs leading-relaxed text-muted-foreground break-words">{helper}</p>}
  </div>
);
