import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  min?: number;
  max?: number;
  required?: boolean;
  id?: string;
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
  min = 0,
  max,
  required = true,
  id,
}: CalculatorInputProps) => {
  const generatedId = useId();
  const inputId = id ?? `calculator-input-${generatedId}`;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = `${inputId}-error`;
  const parsedValue = typeof value === "number" ? value : Number.parseFloat(value);
  const hasValue = String(value).trim() !== "";
  let error: string | undefined;

  if (required && !hasValue) error = "Enter a value.";
  else if (type === "number" && hasValue && !Number.isFinite(parsedValue)) error = "Enter a valid number.";
  else if (type === "number" && min !== undefined && parsedValue < min) error = `Use ${min} or more.`;
  else if (type === "number" && max !== undefined && parsedValue > max) error = `Use ${max} or less.`;

  const describedBy = [helperId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId} className="text-sm font-semibold">{label}</Label>
      <div className="relative">
        {prefix ? (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {prefix}
          </span>
        ) : null}
        <Input
          id={inputId}
          type={type}
          step={step}
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-12 text-base",
            prefix && "pl-7",
            suffix && "pr-20",
            error && "border-destructive focus-visible:ring-destructive",
          )}
          inputMode={type === "number" ? "decimal" : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        {suffix ? (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        ) : null}
      </div>
      {helper ? <p id={helperId} className="text-xs leading-relaxed text-muted-foreground">{helper}</p> : null}
      {error ? <p id={errorId} className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
};

interface CalculatorSelectProps {
  label: string;
  helper?: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  id?: string;
}

export const CalculatorSelect = ({ label, helper, value, onChange, options, id }: CalculatorSelectProps) => {
  const generatedId = useId();
  const selectId = id ?? `calculator-select-${generatedId}`;
  const helperId = helper ? `${selectId}-helper` : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={selectId} className="text-sm font-semibold">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={selectId} className="h-12 text-base" aria-describedby={helperId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helper ? <p id={helperId} className="text-xs leading-relaxed text-muted-foreground">{helper}</p> : null}
    </div>
  );
};

export const CalculatorSelectField = ({ label, helper, children }: { label: string; helper?: string; children: ReactNode }) => (
  <div className="space-y-2">
    <span className="block text-sm font-semibold">{label}</span>
    {children}
    {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
  </div>
);
