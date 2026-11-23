import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({
  label,
  error,
  hint,
  className = '',
  id,
  ...rest
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-dark-walnut dark:text-ink-text">
        {label}
      </label>
      <input
        id={fieldId}
        className={`min-h-[42px] w-full rounded-md border bg-ivory px-3.5 py-2 text-sm text-charcoal placeholder:text-walnut/55 focus:outline-none focus:ring-2 focus:ring-moss dark:bg-ink-bg dark:text-ink-text dark:placeholder:text-ink-muted/60 ${
          error ? 'border-[#8B3A2B] dark:border-[#E28B79]' : 'border-linen dark:border-ink-border'
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <p className="text-xs text-[#8B3A2B] dark:text-[#E28B79]">{error}</p>}
      {!error && hint && <p className="text-xs text-walnut dark:text-ink-muted">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  className = '',
  id,
  rows = 3,
  ...rest
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-dark-walnut dark:text-ink-text">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        className={`w-full rounded-md border bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-walnut/55 focus:outline-none focus:ring-2 focus:ring-moss dark:bg-ink-bg dark:text-ink-text dark:placeholder:text-ink-muted/60 ${
          error ? 'border-[#8B3A2B] dark:border-[#E28B79]' : 'border-linen dark:border-ink-border'
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <p className="text-xs text-[#8B3A2B] dark:text-[#E28B79]">{error}</p>}
      {!error && hint && <p className="text-xs text-walnut dark:text-ink-muted">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className = '',
  id,
  children,
  ...rest
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-dark-walnut dark:text-ink-text">
        {label}
      </label>
      <select
        id={fieldId}
        className={`min-h-[42px] w-full rounded-md border bg-ivory px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-moss dark:bg-ink-bg dark:text-ink-text ${
          error ? 'border-[#8B3A2B] dark:border-[#E28B79]' : 'border-linen dark:border-ink-border'
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#8B3A2B] dark:text-[#E28B79]">{error}</p>}
      {!error && hint && <p className="text-xs text-walnut dark:text-ink-muted">{hint}</p>}
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-dark-walnut dark:text-ink-text cursor-pointer">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-walnut dark:text-ink-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss cursor-pointer ${
          checked
            ? 'border-moss bg-moss'
            : 'border-sand bg-rice-paper dark:border-ink-border dark:bg-ink-bg'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-ivory shadow-xs transition-transform duration-150 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
