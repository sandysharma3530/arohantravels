import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-semibold text-navy">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-text-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-text-main outline-none ring-teal focus:border-teal focus:ring-2";

export function TextInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string },
) {
  const { label, hint, className, ...rest } = props;
  return (
    <Field label={label} hint={hint} className={className}>
      <input {...rest} className={inputClass} />
    </Field>
  );
}

export function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string },
) {
  const { label, hint, className, ...rest } = props;
  return (
    <Field label={label} hint={hint} className={className}>
      <textarea {...rest} className={cn(inputClass, "min-h-28")} />
    </Field>
  );
}

export function CheckInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-navy">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-teal"
      />
      {label}
    </label>
  );
}
