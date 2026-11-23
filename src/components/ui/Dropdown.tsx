import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: Array<DropdownOption<T>>;
  onChange: (value: T) => void;
  className?: string;
}

export function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className = '',
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-[42px] items-center justify-between gap-3 rounded-md border border-linen bg-ivory px-3.5 py-2 text-sm text-charcoal transition-colors hover:border-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss dark:border-ink-border dark:bg-ink-surface dark:text-ink-text cursor-pointer"
      >
        <span className="whitespace-nowrap">{current?.label}</span>
        <ChevronDown className={`h-4 w-4 text-walnut transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-30 mt-1.5 min-w-full w-max rounded-md border border-linen bg-ivory py-1 shadow-md dark:border-ink-border dark:bg-ink-surface"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm whitespace-nowrap transition-colors cursor-pointer ${
                    selected
                      ? 'bg-rice-paper font-medium text-dark-walnut dark:bg-ink-bg dark:text-ink-text'
                      : 'text-charcoal hover:bg-rice-paper/60 dark:text-ink-muted dark:hover:bg-ink-bg/60'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
