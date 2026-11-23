import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Modal } from './Modal';

export function LoadingState({ message = 'Đang chuẩn bị không gian...' }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-lg border border-linen bg-rice-paper/45 px-6 py-14 text-center dark:border-ink-border dark:bg-ink-surface/60"
    >
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-linen border-t-walnut dark:border-ink-border dark:border-t-sand" />
      <p className="mt-4 font-serif text-base text-dark-walnut dark:text-ink-text">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-linen bg-rice-paper/40 px-6 py-14 text-center dark:border-ink-border dark:bg-ink-surface/50">
      <h3 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-walnut dark:text-ink-muted">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  retryLabel = 'Thử lại',
  onRetry,
}: {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-4 rounded-lg border border-[#8B3A2B]/35 bg-[#8B3A2B]/5 p-5 sm:flex-row sm:items-center dark:border-[#E28B79]/40 dark:bg-[#E28B79]/10"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#8B3A2B] dark:text-[#E28B79]" />
        <div>
          <h3 className="font-serif text-base font-medium text-dark-walnut dark:text-ink-text">{title}</h3>
          <p className="mt-1 text-sm text-walnut dark:text-ink-muted">{description}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidthClass="max-w-md">
      <p className="text-sm leading-relaxed text-walnut dark:text-ink-muted">{description}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function ToastViewport() {
  const notifications = useAppStore((s) => s.notifications);
  const dismissNotification = useAppStore((s) => s.dismissNotification);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
    >
      {notifications.map((note) => {
        const Icon =
          note.tone === 'success'
            ? CheckCircle2
            : note.tone === 'error'
              ? AlertCircle
              : Info;
        return (
          <div
            key={note.id}
            role="status"
            className="flex items-start justify-between gap-3 rounded-lg border border-linen bg-ivory p-4 shadow-md dark:border-ink-border dark:bg-ink-surface"
          >
            <div className="flex items-start gap-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-moss dark:text-sage" />
              <div>
                <p className="text-sm font-medium text-dark-walnut dark:text-ink-text">{note.title}</p>
                {note.description && (
                  <p className="mt-0.5 text-xs text-walnut dark:text-ink-muted">{note.description}</p>
                )}
              </div>
            </div>
            <IconButton label="Đóng thông báo" onClick={() => dismissNotification(note.id)} className="min-w-[32px] min-h-[32px]">
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        );
      })}
    </div>
  );
}
