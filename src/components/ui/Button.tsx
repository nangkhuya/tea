import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-dark-walnut text-ivory hover:bg-walnut dark:bg-sand dark:text-charcoal dark:hover:bg-linen border border-transparent',
  secondary:
    'bg-moss text-ivory hover:bg-moss/90 dark:bg-moss dark:text-ivory border border-transparent',
  outline:
    'bg-transparent text-dark-walnut border border-sand hover:bg-rice-paper dark:text-ink-text dark:border-ink-border dark:hover:bg-ink-surface',
  ghost:
    'bg-transparent text-walnut hover:bg-rice-paper/80 dark:text-ink-muted dark:hover:bg-ink-surface border border-transparent',
  danger:
    'bg-transparent text-[#8B3A2B] border border-[#8B3A2B]/35 hover:bg-[#8B3A2B]/10 dark:text-[#E28B79] dark:border-[#E28B79]/40',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-xs',
  md: 'min-h-[42px] px-5 py-2.5 text-sm',
  lg: 'min-h-[46px] px-7 py-3 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-ivory dark:focus-visible:ring-offset-ink-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
