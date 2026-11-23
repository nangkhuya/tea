import {
  Accessibility,
  Palette,
  Scissors,
  Shirt,
  Smile,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type { AvatarStudioCategoryId } from '../types/avatarTypes';

interface CategoryRailProps {
  activeCategory: AvatarStudioCategoryId;
  onSelect: (category: AvatarStudioCategoryId) => void;
  language: 'vi' | 'en';
  variant: 'desktop' | 'mobile';
}

const CATEGORIES: Array<{
  id: AvatarStudioCategoryId;
  labelVi: string;
  labelEn: string;
  hintVi: string;
  hintEn: string;
  icon: typeof Sparkles;
}> = [
  {
    id: 'presets',
    labelVi: 'Mẫu nhân vật',
    labelEn: 'Presets',
    hintVi: '8 tạo hình trà nhân sẵn có',
    hintEn: '8 curated tea presets',
    icon: Sparkles,
  },
  {
    id: 'identity-body',
    labelVi: 'Phong thái & Dáng vóc',
    labelEn: 'Presentation & Body',
    hintVi: 'Hình thể, chiều cao, vai & tư thế',
    hintEn: 'Presentation, height & build',
    icon: UserCheck,
  },
  {
    id: 'face-skin',
    labelVi: 'Khuôn mặt & Làn da',
    labelEn: 'Face & Skin',
    hintVi: 'Đường nét, biểu cảm & sắc da',
    hintEn: 'Facial planes, expression & skin',
    icon: Smile,
  },
  {
    id: 'hair',
    labelVi: 'Kiểu tóc & Màu tóc',
    labelEn: 'Hairstyle & Color',
    hintVi: 'Thư viện tóc & sắc độ tự nhiên',
    hintEn: 'Hairstyle library & tones',
    icon: Scissors,
  },
  {
    id: 'clothing',
    labelVi: 'Trang phục & Vải',
    labelEn: 'Clothing & Fabric',
    hintVi: 'Nhật Bản, Trung Hoa & Đương đại',
    hintEn: 'Japanese, Chinese & Contemporary',
    icon: Shirt,
  },
  {
    id: 'accessories',
    labelVi: 'Phụ kiện trà thất',
    labelEn: 'Accessories',
    hintVi: 'Trâm cài, vòng gỗ, đai & túi trà',
    hintEn: 'Hairpins, beads, sashes & pouch',
    icon: Palette,
  },
  {
    id: 'animations',
    labelVi: 'Cử chỉ & Tư thế',
    labelEn: 'Poses & Motion',
    hintVi: 'Đứng, đi, ngồi thiền & thưởng trà',
    hintEn: 'Standing, seated & tea rituals',
    icon: Accessibility,
  },
];

export function CategoryRail({
  activeCategory,
  onSelect,
  language,
  variant,
}: CategoryRailProps) {
  if (variant === 'mobile') {
    return (
      <div
        role="tablist"
        aria-label={language === 'vi' ? 'Danh mục tùy chỉnh nhân vật' : 'Customization categories'}
        className="flex gap-1.5 overflow-x-auto pb-1"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(cat.id)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-md border px-3.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                active
                  ? 'border-moss bg-moss text-ivory'
                  : 'border-linen bg-ivory text-walnut hover:bg-rice-paper dark:border-ink-border dark:bg-ink-surface dark:text-ink-muted'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{language === 'vi' ? cat.labelVi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav
      aria-label={language === 'vi' ? 'Danh mục tùy chỉnh nhân vật' : 'Customization categories'}
      className="flex flex-col gap-1.5"
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const active = cat.id === activeCategory;
        return (
          <button
            key={cat.id}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onSelect(cat.id)}
            className={`group flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
              active
                ? 'border-moss bg-moss/10 text-dark-walnut dark:border-sage dark:bg-moss/20 dark:text-ink-text'
                : 'border-transparent bg-transparent text-walnut hover:border-linen hover:bg-rice-paper/70 dark:text-ink-muted dark:hover:border-ink-border dark:hover:bg-ink-surface/70'
            }`}
          >
            <Icon
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                active ? 'text-moss dark:text-sage' : 'text-walnut/80 dark:text-ink-muted'
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <div className="text-sm font-medium leading-tight">
                {language === 'vi' ? cat.labelVi : cat.labelEn}
              </div>
              <div className="mt-0.5 text-xs text-walnut/85 dark:text-ink-muted">
                {language === 'vi' ? cat.hintVi : cat.hintEn}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
