import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  surface?: 'ivory' | 'paper';
  padded?: boolean;
}

export function Card({ children, className = '', surface = 'ivory', padded = true }: CardProps) {
  const surfaceClass =
    surface === 'paper'
      ? 'bg-rice-paper/80 dark:bg-ink-surface'
      : 'bg-ivory dark:bg-ink-surface';

  return (
    <div
      className={`rounded-lg border border-linen dark:border-ink-border ${surfaceClass} ${
        padded ? 'p-5 sm:p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
