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
  <div className={cn("space-y-2", className)}>
    <Label className="text-sm font-semibold">{label}</Label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          {prefix}
        </span>
      )}
      <Input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-11 text-base", prefix && "pl-7", suffix && "pr-10")}
        inputMode={type === "number" ? "decimal" : undefined}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
    {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
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
  <div className="space-y-2">
    <Label className="text-sm font-semibold">{label}</Label>
    {children}
    {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
  </div>
);
