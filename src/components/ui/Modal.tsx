import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { IconButton } from './IconButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  closeLabel?: string;
  maxWidthClass?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  closeLabel = 'Đóng hộp thoại',
  maxWidthClass = 'max-w-lg',
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-lg border border-linen bg-ivory p-6 text-charcoal shadow-lg dark:border-ink-border dark:bg-ink-surface dark:text-ink-text`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-linen/70 pb-4 dark:border-ink-border">
          <div>
            <h2 id="modal-heading" className="font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-walnut dark:text-ink-muted">{description}</p>
            )}
          </div>
          <IconButton label={closeLabel} onClick={onClose}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
}
