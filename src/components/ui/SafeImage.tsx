import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SafeImage({ src, alt, className = '', fallbackTitle }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-rice-paper via-linen to-sand/70 p-6 text-center dark:from-ink-surface dark:via-ink-bg dark:to-dark-walnut/40 ${className}`}
      >
        <svg
          className="h-8 w-8 text-walnut/70 dark:text-ink-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M5 12h11a3 3 0 0 1 0 6H5z" />
          <path d="M16 13h2a2 2 0 0 1 0 4h-2" />
          <path d="M7 8c0-1.5 1-2.5 1-4" />
          <path d="M11 8c0-1.5 1-2.5 1-4" />
        </svg>
        <span className="mt-2 font-serif text-xs text-walnut dark:text-ink-muted">
          {fallbackTitle ?? alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
