import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { IconButton } from './IconButton';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel?: string;
  children: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  closeLabel = 'Đóng ngăn điều hướng',
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-charcoal/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0" aria-hidden="true" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-xs flex-col border-l border-linen bg-ivory p-6 text-charcoal dark:border-ink-border dark:bg-ink-bg dark:text-ink-text">
        <div className="flex items-center justify-between border-b border-linen pb-4 dark:border-ink-border">
          <span className="font-serif text-base font-medium tracking-wide text-dark-walnut dark:text-ink-text">
            {title}
          </span>
          <IconButton label={closeLabel} onClick={onClose}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        <div className="mt-5 flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
