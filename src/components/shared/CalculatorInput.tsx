import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId, type ReactNode } from "react";

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
}: CalculatorInputProps) => {
  const inputId = useId();
  const helperId = helper ? `${inputId}-helper` : undefined;

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <Label htmlFor={inputId} className="text-sm font-semibold break-words">{label}</Label>
      <div className="relative min-w-0">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {prefix}
          </span>
        )}
        <Input
          id={inputId}
          type={type}
          step={step}
          min={type === "number" ? "0" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("h-11 w-full min-w-0 text-base", prefix && "pl-7", suffix && "pr-10")}
          inputMode={type === "number" ? "decimal" : undefined}
          aria-describedby={helperId}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helper && <p id={helperId} className="text-xs text-muted-foreground break-words">{helper}</p>}
    </div>
  );
};

export const CalculatorSelectField = ({ label, helper, children }: { label: string; helper?: string; children: ReactNode }) => (
  <div className="min-w-0 space-y-2">
    <Label className="text-sm font-semibold break-words">{label}</Label>
    <div className="min-w-0">{children}</div>
    {helper && <p className="text-xs text-muted-foreground break-words">{helper}</p>}
  </div>
);
