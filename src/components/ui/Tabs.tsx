export interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: Array<TabItem<T>>;
  value: T;
  onChange: (next: T) => void;
  ariaLabel: string;
}

export function Tabs<T extends string>({ items, value, onChange, ariaLabel }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-md border border-linen bg-rice-paper/70 p-1 dark:border-ink-border dark:bg-ink-bg"
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`min-h-[38px] rounded px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss cursor-pointer ${
              active
                ? 'bg-ivory text-dark-walnut shadow-xs dark:bg-ink-surface dark:text-ink-text'
                : 'text-walnut hover:text-charcoal dark:text-ink-muted dark:hover:text-ink-text'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
