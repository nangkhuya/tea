import { Eye, RotateCcw, Save, Shuffle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface StudioActionBarProps {
  isDirty: boolean;
  saving: boolean;
  language: 'vi' | 'en';
  onReset: () => void;
  onRandomize: () => void;
  onSave: () => void;
  onPreviewInTeaHouse: () => void;
}

export function StudioActionBar({
  isDirty,
  saving,
  language,
  onReset,
  onRandomize,
  onSave,
  onPreviewInTeaHouse,
}: StudioActionBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-linen bg-rice-paper/90 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-ink-border dark:bg-ink-surface">
      <div className="text-xs text-walnut dark:text-ink-muted">
        <span className={isDirty ? 'font-medium text-dark-walnut dark:text-ink-text' : 'text-moss dark:text-sage'}>
          {isDirty
            ? language === 'vi'
              ? 'Có thay đổi chưa lưu'
              : 'Unsaved changes'
            : language === 'vi'
              ? 'Đã đồng bộ bản lưu cục bộ'
              : 'Synced with local demo storage'}
        </span>
        <span className="mx-2" aria-hidden="true">·</span>
        <span>
          {language === 'vi'
            ? 'Lưu trữ demo cục bộ (Chưa kết nối Firebase)'
            : 'Local demo storage (Firebase auth in Phase 04)'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>{language === 'vi' ? 'Đặt lại' : 'Reset'}</span>
        </Button>

        <Button variant="outline" size="sm" onClick={onRandomize}>
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          <span>{language === 'vi' ? 'Ngẫu nhiên' : 'Randomize'}</span>
        </Button>

        <Button variant="secondary" size="sm" onClick={onSave} disabled={saving || !isDirty}>
          <Save className="h-4 w-4" aria-hidden="true" />
          <span>
            {saving
              ? language === 'vi'
                ? 'Đang lưu…'
                : 'Saving…'
              : language === 'vi'
                ? 'Lưu nhân vật'
                : 'Save Avatar'}
          </span>
        </Button>

        <Button variant="primary" size="sm" onClick={onPreviewInTeaHouse}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          <span>{language === 'vi' ? 'Xem trước trong Trà Thất' : 'Preview in Tea House'}</span>
        </Button>
      </div>
    </div>
  );
}
