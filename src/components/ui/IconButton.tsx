import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className = '', type = 'button', children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-walnut hover:text-charcoal hover:bg-rice-paper dark:text-ink-muted dark:hover:text-ink-text dark:hover:bg-ink-surface transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
