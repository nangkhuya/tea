import { Check, Info, Sparkles, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Tabs } from '../../../components/ui/Tabs';
import {
  ACCESSORY_REGISTRY,
  ANIMATION_REGISTRY,
  BODY_BUILD_OPTIONS,
  CLOTHING_PALETTE_OPTIONS,
  CLOTHING_REGISTRY,
  EXPRESSION_OPTIONS,
  EYEBROW_SHAPE_OPTIONS,
  EYE_SHAPE_OPTIONS,
  FACE_SHAPE_OPTIONS,
  FABRIC_MATERIAL_OPTIONS,
  HAIR_COLOR_OPTIONS,
  SKIN_TONE_OPTIONS,
  getHairstylesForPresentation,
} from '../assets/avatarRegistry';
import { AVATAR_PRESETS } from '../presets/avatarPresets';
import type {
  AvatarAccessoryId,
  AvatarAnimationId,
  AvatarClothingTradition,
  AvatarConfigV3,
  AvatarModelCapabilities,
  AvatarPreset,
  AvatarStudioCategoryId,
  GenderPresentation,
} from '../types/avatarTypes';

interface CustomizationPanelProps {
  activeCategory: AvatarStudioCategoryId;
  config: AvatarConfigV3;
  capabilities: AvatarModelCapabilities | null;
  activeAnimation: AvatarAnimationId;
  language: 'vi' | 'en';
  onUpdate: (patch: Partial<AvatarConfigV3>) => void;
  onPresentationChange: (presentation: GenderPresentation) => void;
  onApplyPreset: (preset: AvatarPreset) => void;
  onSelectAnimation: (anim: AvatarAnimationId) => void;
}

function SectionBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-dark-walnut dark:text-ink-text">{title}</h3>
        {hint && <span className="text-xs tabular-nums text-walnut dark:text-ink-muted">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function UnsupportedNotice({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-linen bg-ivory/80 p-2.5 text-xs text-walnut dark:border-ink-border dark:bg-ink-bg/80 dark:text-ink-muted">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

export function CustomizationPanel({
  activeCategory,
  config,
  capabilities,
  activeAnimation,
  language,
  onUpdate,
  onPresentationChange,
  onApplyPreset,
  onSelectAnimation,
}: CustomizationPanelProps) {
  const [clothingTradition, setClothingTradition] = useState<AvatarClothingTradition>('japanese');

  const bodySupported = capabilities ? capabilities.supportsBodyScaling : true;
  const shoulderSupported = capabilities ? capabilities.supportsShoulderWidth : true;
  const facialSupported = capabilities ? capabilities.supportsFacialMorphs : true;
  const materialTintSupported = capabilities ? capabilities.supportsMaterialTinting : true;
  const availableAnimSet = new Set(
    capabilities ? capabilities.availableAnimations : ANIMATION_REGISTRY.map((a) => a.id),
  );

  if (activeCategory === 'presets') {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
            {language === 'vi' ? 'Bộ Mẫu Trà Nhân Sẵn Có' : 'Ready-to-Use Tea Personas'}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-walnut dark:text-ink-muted">
            {language === 'vi'
              ? 'Chọn một tạo hình hoàn chỉnh bên dưới làm điểm khởi đầu, sau đó bạn có thể tùy chỉnh từng chi tiết.'
              : 'Select any complete preset below as a starting point and refine every detail freely.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {AVATAR_PRESETS.map((preset) => {
            const isMatched =
              config.clothing.style === preset.config.clothing.style &&
              config.hairstyle === preset.config.hairstyle &&
              config.genderPresentation === preset.config.genderPresentation;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`flex items-start justify-between gap-3 rounded-lg border p-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                  isMatched
                    ? 'border-moss bg-moss/10 dark:border-sage dark:bg-moss/20'
                    : 'border-linen bg-ivory/80 hover:border-sand dark:border-ink-border dark:bg-ink-bg/70'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-moss dark:text-sage" aria-hidden="true" />
                    <span className="text-sm font-medium text-dark-walnut dark:text-ink-text">
                      {language === 'vi' ? preset.nameVi : preset.nameEn}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-walnut dark:text-ink-muted">
                    {language === 'vi' ? preset.subtitleVi : preset.subtitleEn}
                  </p>
                </div>
                {isMatched && <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeCategory === 'identity-body') {
    return (
      <div className="space-y-5">
        <SectionBlock title={language === 'vi' ? 'Phong thái hình thể' : 'Gender Presentation'}>
          <Tabs<GenderPresentation>
            ariaLabel={language === 'vi' ? 'Phong thái hình thể' : 'Gender presentation'}
            value={config.genderPresentation}
            onChange={onPresentationChange}
            items={[
              { value: 'feminine', label: language === 'vi' ? 'Nữ tính' : 'Feminine' },
              { value: 'neutral', label: language === 'vi' ? 'Trung tính' : 'Neutral' },
              { value: 'masculine', label: language === 'vi' ? 'Nam tính' : 'Masculine' },
            ]}
          />
          <p className="text-xs text-walnut dark:text-ink-muted">
            {language === 'vi'
              ? 'Tự do lựa chọn hình mẫu cơ sở và tỷ lệ phù hợp với phong thái bạn mong muốn.'
              : 'Freely choose the base body proportions that fit your preferred presentation.'}
          </p>
        </SectionBlock>

        <SectionBlock
          title={language === 'vi' ? 'Chiều cao tổng thể' : 'Height'}
          hint={`${Math.round(config.body.heightScale * 172)} cm (${config.body.heightScale.toFixed(2)}×)`}
        >
          <input
            aria-label={language === 'vi' ? 'Chiều cao nhân vật' : 'Character height'}
            type="range"
            min={0.9}
            max={1.1}
            step={0.01}
            disabled={!bodySupported}
            value={config.body.heightScale}
            onChange={(e) =>
              onUpdate({ body: { ...config.body, heightScale: Number(e.target.value) } })
            }
            className="w-full accent-moss disabled:opacity-45 cursor-pointer"
          />
        </SectionBlock>

        <SectionBlock title={language === 'vi' ? 'Vóc dáng cơ thể' : 'Body Build'}>
          <div className="grid grid-cols-2 gap-2">
            {BODY_BUILD_OPTIONS.map((item) => {
              const active = config.body.buildPreset === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!bodySupported}
                  aria-pressed={active}
                  onClick={() => onUpdate({ body: { ...config.body, buildPreset: item.id } })}
                  className={`min-h-[42px] rounded-md border px-3 text-left text-xs font-medium transition-colors cursor-pointer disabled:opacity-45 ${
                    active
                      ? 'border-moss bg-moss/12 text-dark-walnut dark:text-ink-text'
                      : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock
          title={language === 'vi' ? 'Độ rộng vai' : 'Shoulder Width'}
          hint={`${config.body.shoulderWidth.toFixed(2)}×`}
        >
          {!shoulderSupported && (
            <UnsupportedNotice
              text={
                language === 'vi'
                  ? 'Mô hình GLB ngoài hiện tại không hỗ trợ chỉnh độ rộng vai.'
                  : 'The loaded external GLB model does not expose shoulder width bones.'
              }
            />
          )}
          <input
            aria-label={language === 'vi' ? 'Độ rộng vai' : 'Shoulder width'}
            type="range"
            min={0.92}
            max={1.08}
            step={0.01}
            disabled={!shoulderSupported}
            value={config.body.shoulderWidth}
            onChange={(e) =>
              onUpdate({ body: { ...config.body, shoulderWidth: Number(e.target.value) } })
            }
            className="w-full accent-moss disabled:opacity-45 cursor-pointer"
          />
        </SectionBlock>

        <SectionBlock
          title={language === 'vi' ? 'Cân đối đường nét tổng thể' : 'Silhouette Balance'}
          hint={config.body.silhouetteBalance.toFixed(2)}
        >
          <input
            aria-label={language === 'vi' ? 'Cân đối đường nét tổng thể' : 'Silhouette balance'}
            type="range"
            min={-0.5}
            max={0.5}
            step={0.05}
            disabled={!bodySupported}
            value={config.body.silhouetteBalance}
            onChange={(e) =>
              onUpdate({ body: { ...config.body, silhouetteBalance: Number(e.target.value) } })
            }
            className="w-full accent-moss disabled:opacity-45 cursor-pointer"
          />
        </SectionBlock>

        <SectionBlock title={language === 'vi' ? 'Tư thế khí chất' : 'Posture'}>
          <Tabs
            ariaLabel={language === 'vi' ? 'Tư thế khí chất' : 'Posture'}
            value={config.body.posture}
            onChange={(posture) => onUpdate({ body: { ...config.body, posture } })}
            items={[
              { value: 'upright-calm', label: language === 'vi' ? 'Đĩnh đạc' : 'Upright' },
              { value: 'relaxed-tea', label: language === 'vi' ? 'Thư thái' : 'Relaxed Tea' },
            ]}
          />
        </SectionBlock>
      </div>
    );
  }

  if (activeCategory === 'face-skin') {
    return (
      <div className="space-y-5">
        <SectionBlock title={language === 'vi' ? 'Sắc da tự nhiên' : 'Skin Tone'}>
          <div className="flex flex-wrap items-center gap-2.5">
            {SKIN_TONE_OPTIONS.map((tone) => {
              const active = config.skin.tone === tone.id;
              return (
                <button
                  key={tone.id}
                  type="button"
                  aria-label={language === 'vi' ? tone.labelVi : tone.labelEn}
                  aria-pressed={active}
                  onClick={() => onUpdate({ skin: { tone: tone.id } })}
                  className={`h-10 w-10 rounded-full border-2 cursor-pointer transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                    active ? 'scale-105 border-moss ring-2 ring-moss/25' : 'border-white hover:border-sand'
                  }`}
                  style={{ backgroundColor: tone.hex }}
                />
              );
            })}
            <span className="text-xs text-walnut dark:text-ink-muted">
              {language === 'vi'
                ? SKIN_TONE_OPTIONS.find((s) => s.id === config.skin.tone)?.labelVi
                : SKIN_TONE_OPTIONS.find((s) => s.id === config.skin.tone)?.labelEn}
            </span>
          </div>
        </SectionBlock>

        {!facialSupported && (
          <UnsupportedNotice
            text={
              language === 'vi'
                ? 'Mô hình GLB ngoài không có blend shape khuôn mặt; các tùy chọn hình thái bên dưới đã được khóa để đảm bảo trung thực.'
                : 'Loaded external GLB lacks facial morph targets; facial shape controls are disabled.'
            }
          />
        )}

        <SectionBlock title={language === 'vi' ? 'Biểu cảm an nhiên' : 'Calm Expression'}>
          <div className="grid grid-cols-2 gap-2">
            {EXPRESSION_OPTIONS.map((item) => {
              const active = config.face.expression === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!facialSupported}
                  aria-pressed={active}
                  onClick={() => onUpdate({ face: { ...config.face, expression: item.id } })}
                  className={`min-h-[40px] rounded-md border px-3 text-left text-xs font-medium cursor-pointer disabled:opacity-45 ${
                    active
                      ? 'border-moss bg-moss/12 text-dark-walnut dark:text-ink-text'
                      : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock title={language === 'vi' ? 'Dáng khuôn mặt' : 'Face Shape'}>
          <div className="grid grid-cols-2 gap-2">
            {FACE_SHAPE_OPTIONS.map((item) => {
              const active = config.face.faceShape === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!facialSupported}
                  aria-pressed={active}
                  onClick={() => onUpdate({ face: { ...config.face, faceShape: item.id } })}
                  className={`min-h-[40px] rounded-md border px-3 text-left text-xs cursor-pointer disabled:opacity-45 ${
                    active
                      ? 'border-moss bg-moss/12 font-medium text-dark-walnut dark:text-ink-text'
                      : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock
          title={language === 'vi' ? 'Đường xương hàm' : 'Jawline'}
          hint={config.face.jawline.toFixed(2)}
        >
          <input
            aria-label={language === 'vi' ? 'Đường xương hàm' : 'Jawline'}
            type="range"
            min={-1}
            max={1}
            step={0.05}
            disabled={!facialSupported}
            value={config.face.jawline}
            onChange={(e) =>
              onUpdate({ face: { ...config.face, jawline: Number(e.target.value) } })
            }
            className="w-full accent-moss disabled:opacity-45 cursor-pointer"
          />
        </SectionBlock>

        <div className="grid grid-cols-2 gap-4">
          <SectionBlock title={language === 'vi' ? 'Dáng mắt' : 'Eyes'}>
            <div className="flex flex-col gap-1.5">
              {EYE_SHAPE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={!facialSupported}
                  aria-pressed={config.face.eyeShape === item.id}
                  onClick={() => onUpdate({ face: { ...config.face, eyeShape: item.id } })}
                  className={`min-h-[38px] rounded border px-2.5 text-left text-xs cursor-pointer disabled:opacity-45 ${
                    config.face.eyeShape === item.id
                      ? 'border-moss bg-moss/12 font-medium text-dark-walnut dark:text-ink-text'
                      : 'border-linen text-walnut dark:border-ink-border dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title={language === 'vi' ? 'Chân mày' : 'Eyebrows'}>
            <div className="flex flex-col gap-1.5">
              {EYEBROW_SHAPE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={!facialSupported}
                  aria-pressed={config.face.eyebrowShape === item.id}
                  onClick={() => onUpdate({ face: { ...config.face, eyebrowShape: item.id } })}
                  className={`min-h-[38px] rounded border px-2.5 text-left text-xs cursor-pointer disabled:opacity-45 ${
                    config.face.eyebrowShape === item.id
                      ? 'border-moss bg-moss/12 font-medium text-dark-walnut dark:text-ink-text'
                      : 'border-linen text-walnut dark:border-ink-border dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title={language === 'vi' ? 'Sống mũi' : 'Nose'}>
            <div className="flex flex-col gap-1.5">
              {NOSE_SHAPE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={!facialSupported}
                  aria-pressed={config.face.noseShape === item.id}
                  onClick={() => onUpdate({ face: { ...config.face, noseShape: item.id } })}
                  className={`min-h-[38px] rounded border px-2.5 text-left text-xs cursor-pointer disabled:opacity-45 ${
                    config.face.noseShape === item.id
                      ? 'border-moss bg-moss/12 font-medium text-dark-walnut dark:text-ink-text'
                      : 'border-linen text-walnut dark:border-ink-border dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title={language === 'vi' ? 'Dáng môi' : 'Lips'}>
            <div className="flex flex-col gap-1.5">
              {LIP_SHAPE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={!facialSupported}
                  aria-pressed={config.face.lipShape === item.id}
                  onClick={() => onUpdate({ face: { ...config.face, lipShape: item.id } })}
                  className={`min-h-[38px] rounded border px-2.5 text-left text-xs cursor-pointer disabled:opacity-45 ${
                    config.face.lipShape === item.id
                      ? 'border-moss bg-moss/12 font-medium text-dark-walnut dark:text-ink-text'
                      : 'border-linen text-walnut dark:border-ink-border dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              ))}
            </div>
          </SectionBlock>
        </div>
      </div>
    );
  }

  if (activeCategory === 'hair') {
    const hairstyles = getHairstylesForPresentation(config.genderPresentation);
    return (
      <div className="space-y-5">
        <SectionBlock
          title={language === 'vi' ? 'Kiểu tóc tương thích' : 'Compatible Hairstyles'}
          hint={`${hairstyles.length}`}
        >
          <div className="grid grid-cols-1 gap-2">
            {hairstyles.map((item) => {
              const active = config.hairstyle === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onUpdate({ hairstyle: item.id })}
                  className={`flex items-start justify-between gap-2 rounded-md border px-3 py-2.5 text-left cursor-pointer transition-colors ${
                    active
                      ? 'border-moss bg-moss/12 text-dark-walnut dark:text-ink-text'
                      : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium">
                      {language === 'vi' ? item.displayNameVi : item.displayNameEn}
                    </div>
                    <div className="mt-0.5 text-[11px] opacity-85">
                      {language === 'vi' ? item.descriptionVi : item.descriptionEn}
                    </div>
                  </div>
                  {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock title={language === 'vi' ? 'Màu tóc tự nhiên' : 'Natural Hair Colors'}>
          <div className="grid grid-cols-2 gap-2">
            {HAIR_COLOR_OPTIONS.map((color) => {
              const active = config.hairColor === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onUpdate({ hairColor: color.id })}
                  className={`flex min-h-[42px] items-center gap-2.5 rounded-md border px-3 text-left text-xs cursor-pointer ${
                    active
                      ? 'border-moss bg-ivory font-medium text-dark-walnut dark:bg-ink-bg dark:text-ink-text'
                      : 'border-linen text-walnut hover:border-sand dark:border-ink-border dark:text-ink-muted'
                  }`}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-black/15"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{language === 'vi' ? color.labelVi : color.labelEn}</span>
                </button>
              );
            })}
          </div>
        </SectionBlock>
      </div>
    );
  }

  if (activeCategory === 'clothing') {
    const filteredClothing = CLOTHING_REGISTRY.filter((c) => c.tradition === clothingTradition);
    return (
      <div className="space-y-5">
        <SectionBlock title={language === 'vi' ? 'Truyền thống trang phục' : 'Attire Tradition'}>
          <Tabs<AvatarClothingTradition>
            ariaLabel={language === 'vi' ? 'Truyền thống trang phục' : 'Attire tradition'}
            value={clothingTradition}
            onChange={setClothingTradition}
            items={[
              { value: 'japanese', label: language === 'vi' ? 'Nhật Bản' : 'Japanese' },
              { value: 'chinese', label: language === 'vi' ? 'Trung Hoa' : 'Chinese' },
              { value: 'contemporary', label: language === 'vi' ? 'Đương đại' : 'Contemporary' },
            ]}
          />
        </SectionBlock>

        <SectionBlock title={language === 'vi' ? 'Kiểu dáng trà phục' : 'Garment Style'}>
          <div className="grid grid-cols-1 gap-2">
            {filteredClothing.map((item) => {
              const active = config.clothing.style === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onUpdate({ clothing: { ...config.clothing, style: item.id } })
                  }
                  className={`flex items-start justify-between gap-2 rounded-md border px-3 py-2.5 text-left cursor-pointer ${
                    active
                      ? 'border-moss bg-moss/12 text-dark-walnut dark:text-ink-text'
                      : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium">
                      {language === 'vi' ? item.displayNameVi : item.displayNameEn}
                    </div>
                    <div className="mt-0.5 text-[11px] opacity-85">
                      {language === 'vi' ? item.descriptionVi : item.descriptionEn}
                    </div>
                  </div>
                  {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock title={language === 'vi' ? 'Chất liệu dệt tự nhiên' : 'Fabric Material'}>
          <div className="flex flex-wrap gap-1.5">
            {FABRIC_MATERIAL_OPTIONS.map((mat) => {
              const active = config.clothing.material === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  disabled={!materialTintSupported}
                  aria-pressed={active}
                  onClick={() =>
                    onUpdate({ clothing: { ...config.clothing, material: mat.id } })
                  }
                  className={`min-h-[38px] rounded-md border px-3 text-xs cursor-pointer disabled:opacity-45 ${
                    active
                      ? 'border-moss bg-moss/12 font-medium text-dark-walnut dark:text-ink-text'
                      : 'border-linen text-walnut hover:border-sand dark:border-ink-border dark:text-ink-muted'
                  }`}
                >
                  {language === 'vi' ? mat.labelVi : mat.labelEn}
                </button>
              );
            })}
          </div>
        </SectionBlock>

        {(
          [
            ['primary', language === 'vi' ? 'Màu áo / thân chính' : 'Primary Fabric Color'],
            ['secondary', language === 'vi' ? 'Màu viền cổ / lớp phụ' : 'Trim & Secondary Color'],
            ['sash', language === 'vi' ? 'Màu đai thắt lưng' : 'Sash / Obi Color'],
          ] as const
        ).map(([slotKey, slotLabel]) => (
          <SectionBlock
            key={slotKey}
            title={slotLabel}
            hint={
              language === 'vi'
                ? CLOTHING_PALETTE_OPTIONS.find((p) => p.id === config.clothingColors[slotKey])?.labelVi
                : CLOTHING_PALETTE_OPTIONS.find((p) => p.id === config.clothingColors[slotKey])?.labelEn
            }
          >
            <div className="flex flex-wrap gap-2">
              {CLOTHING_PALETTE_OPTIONS.map((swatch) => {
                const active = config.clothingColors[slotKey] === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    disabled={!materialTintSupported}
                    aria-label={`${slotLabel}: ${language === 'vi' ? swatch.labelVi : swatch.labelEn}`}
                    aria-pressed={active}
                    onClick={() =>
                      onUpdate({
                        clothingColors: { ...config.clothingColors, [slotKey]: swatch.id },
                      })
                    }
                    className={`h-8 w-8 rounded-full border-2 cursor-pointer transition-transform disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                      active
                        ? 'scale-110 border-dark-walnut ring-2 ring-moss/30 dark:border-ivory'
                        : 'border-white/90 hover:border-sand'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                );
              })}
            </div>
          </SectionBlock>
        ))}
      </div>
    );
  }

  if (activeCategory === 'accessories') {
    const toggleAccessory = (id: AvatarAccessoryId) => {
      const next = config.accessories.includes(id)
        ? config.accessories.filter((item) => item !== id)
        : [...config.accessories, id];
      onUpdate({ accessories: next });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
              {language === 'vi' ? 'Phụ Kiện Tối Giản' : 'Minimalist Accessories'}
            </h2>
            <p className="mt-0.5 text-xs text-walnut dark:text-ink-muted">
              {language === 'vi'
                ? 'Chọn tối đa vài điểm nhấn tinh tế cho trà phục.'
                : 'Select subtle ornaments that complement your tea attire.'}
            </p>
          </div>
          {config.accessories.length > 0 && (
            <button
              type="button"
              onClick={() => onUpdate({ accessories: [] })}
              className="inline-flex min-h-[36px] items-center gap-1 rounded border border-linen px-2.5 text-xs text-walnut hover:bg-rice-paper cursor-pointer dark:border-ink-border dark:text-ink-muted"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{language === 'vi' ? 'Gỡ hết' : 'Clear all'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {ACCESSORY_REGISTRY.map((item) => {
            const active = config.accessories.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleAccessory(item.id)}
                className={`flex items-start justify-between gap-2 rounded-md border px-3 py-2.5 text-left cursor-pointer ${
                  active
                    ? 'border-moss bg-moss/12 text-dark-walnut dark:text-ink-text'
                    : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                }`}
              >
                <div>
                  <div className="text-xs font-medium">
                    {language === 'vi' ? item.displayNameVi : item.displayNameEn}
                  </div>
                  <div className="mt-0.5 text-[11px] opacity-85">
                    {language === 'vi' ? item.descriptionVi : item.descriptionEn}
                  </div>
                </div>
                {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Animations category
  const basicAnimations = ANIMATION_REGISTRY.filter((a) => a.group === 'basic');
  const teaHouseAnimations = ANIMATION_REGISTRY.filter((a) => a.group === 'tea-house');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-md border border-linen bg-ivory/80 px-3 py-2.5 dark:border-ink-border dark:bg-ink-bg/70">
        <div>
          <div className="text-xs font-medium text-dark-walnut dark:text-ink-text">
            {language === 'vi' ? 'Nhịp thở tự nhiên' : 'Natural Idle Breathing'}
          </div>
          <div className="text-[11px] text-walnut dark:text-ink-muted">
            {language === 'vi' ? 'Chuyển động lồng ngực nhẹ nhàng khi tĩnh tại' : 'Subtle breathing movement at rest'}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={config.animationPreferences.idleBreathing}
          onClick={() =>
            onUpdate({
              animationPreferences: {
                ...config.animationPreferences,
                idleBreathing: !config.animationPreferences.idleBreathing,
              },
            })
          }
          className={`min-h-[34px] rounded-md border px-3 text-xs font-medium cursor-pointer ${
            config.animationPreferences.idleBreathing
              ? 'border-moss bg-moss text-ivory'
              : 'border-linen bg-ivory text-walnut dark:border-ink-border dark:bg-ink-surface dark:text-ink-muted'
          }`}
        >
          {config.animationPreferences.idleBreathing
            ? language === 'vi'
              ? 'Đang bật'
              : 'On'
            : language === 'vi'
              ? 'Đang tắt'
              : 'Off'}
        </button>
      </div>

      <SectionBlock title={language === 'vi' ? 'Chuyển động cơ bản' : 'Basic Movement'}>
        <div className="grid grid-cols-2 gap-2">
          {basicAnimations.map((anim) => {
            const supported = availableAnimSet.has(anim.id);
            const active = activeAnimation === anim.id;
            return (
              <button
                key={anim.id}
                type="button"
                disabled={!supported}
                aria-pressed={active}
                onClick={() => onSelectAnimation(anim.id)}
                className={`min-h-[42px] rounded-md border px-2.5 py-2 text-left text-xs cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                  active
                    ? 'border-moss bg-moss/15 font-medium text-dark-walnut dark:text-ink-text'
                    : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                }`}
              >
                <div>{language === 'vi' ? anim.displayNameVi : anim.displayNameEn}</div>
                {!supported && (
                  <div className="mt-0.5 text-[10px] opacity-75">
                    {language === 'vi' ? 'Cần clip GLB' : 'Requires GLB clip'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SectionBlock>

      <SectionBlock title={language === 'vi' ? 'Nghi thức Trà Thất' : 'Tea House Rituals'}>
        <div className="grid grid-cols-2 gap-2">
          {teaHouseAnimations.map((anim) => {
            const supported = availableAnimSet.has(anim.id);
            const active = activeAnimation === anim.id;
            return (
              <button
                key={anim.id}
                type="button"
                disabled={!supported}
                aria-pressed={active}
                onClick={() => onSelectAnimation(anim.id)}
                className={`min-h-[42px] rounded-md border px-2.5 py-2 text-left text-xs cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                  active
                    ? 'border-moss bg-moss/15 font-medium text-dark-walnut dark:text-ink-text'
                    : 'border-linen bg-ivory/80 text-walnut hover:border-sand dark:border-ink-border dark:bg-ink-bg dark:text-ink-muted'
                }`}
              >
                <div>{language === 'vi' ? anim.displayNameVi : anim.displayNameEn}</div>
                {!supported && (
                  <div className="mt-0.5 text-[10px] opacity-75">
                    {language === 'vi' ? 'Cần clip GLB' : 'Requires GLB clip'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SectionBlock>
    </div>
  );
}
