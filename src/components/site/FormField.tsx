import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-12 w-full rounded-xl border-2 border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:bg-muted disabled:text-muted-foreground";

export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-base font-bold text-navy">
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-destructive">
          {t(error)}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function ChoiceGroup<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  value: T | "";
  options: { value: T; label: string; lang?: string }[];
  onChange: (v: T) => void;
  error?: string;
}) {
  const { t } = useI18n();
  return (
    <fieldset className="space-y-1.5" aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1.5 text-base font-bold text-navy">{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-xl border-2 px-3 py-3 text-center font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
              value === o.value ? "border-primary bg-primary/10 text-primary" : "border-input bg-card text-foreground",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span lang={o.lang}>{o.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm font-semibold text-destructive">
          {t(error)}
        </p>
      )}
    </fieldset>
  );
}
