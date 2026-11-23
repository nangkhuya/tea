import { Rotate3D } from 'lucide-react';
import type { GraphicsPreset } from '../../../types/domain';
import {
  CAMERA_PRESETS,
  PREVIEW_ENVIRONMENTS,
} from '../assets/avatarRegistry';
import type {
  CameraPresetId,
  PreviewEnvironmentId,
} from '../types/avatarTypes';

interface PreviewToolbarProps {
  cameraPreset: CameraPresetId;
  onCameraPresetChange: (preset: CameraPresetId) => void;
  environment: PreviewEnvironmentId;
  onEnvironmentChange: (env: PreviewEnvironmentId) => void;
  quality: GraphicsPreset;
  onQualityChange: (quality: GraphicsPreset) => void;
  onResetView: () => void;
  language: 'vi' | 'en';
}

export function PreviewToolbar({
  cameraPreset,
  onCameraPresetChange,
  environment,
  onEnvironmentChange,
  quality,
  onQualityChange,
  onResetView,
  language,
}: PreviewToolbarProps) {
  return (
    <div className="space-y-2.5 border-b border-linen bg-ivory/95 px-4 py-3 dark:border-ink-border dark:bg-ink-surface/95">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label={language === 'vi' ? 'Góc máy xem trước' : 'Camera angle'}
          className="flex flex-wrap items-center gap-1"
        >
          {CAMERA_PRESETS.map((cam) => {
            const active = cam.id === cameraPreset;
            return (
              <button
                key={cam.id}
                type="button"
                aria-pressed={active}
                onClick={() => onCameraPresetChange(cam.id)}
                className={`min-h-[34px] rounded px-2.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                  active
                    ? 'bg-dark-walnut text-ivory dark:bg-sand dark:text-charcoal'
                    : 'bg-rice-paper/80 text-walnut hover:bg-rice-paper dark:bg-ink-bg dark:text-ink-muted dark:hover:text-ink-text'
                }`}
              >
                {language === 'vi' ? cam.labelVi : cam.labelEn}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onResetView}
          className="inline-flex min-h-[34px] items-center gap-1.5 rounded border border-linen bg-ivory px-2.5 text-xs font-medium text-dark-walnut whitespace-nowrap shrink-0 hover:bg-rice-paper cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss dark:border-ink-border dark:bg-ink-bg dark:text-ink-text"
        >
          <Rotate3D className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{language === 'vi' ? 'Đặt lại góc nhìn' : 'Reset view'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div
          role="group"
          aria-label={language === 'vi' ? 'Không gian xem trước' : 'Preview environment'}
          className="flex flex-wrap items-center gap-1.5"
        >
          <span className="text-walnut dark:text-ink-muted mr-1">
            {language === 'vi' ? 'Bối cảnh:' : 'Backdrop:'}
          </span>
          {PREVIEW_ENVIRONMENTS.map((env) => {
            const active = env.id === environment;
            return (
              <button
                key={env.id}
                type="button"
                aria-pressed={active}
                onClick={() => onEnvironmentChange(env.id)}
                className={`min-h-[32px] rounded border px-2.5 text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                  active
                    ? 'border-moss bg-moss/15 font-medium text-dark-walnut dark:border-sage dark:text-ink-text'
                    : 'border-linen bg-transparent text-walnut hover:border-sand dark:border-ink-border dark:text-ink-muted'
                }`}
              >
                {language === 'vi' ? env.labelVi : env.labelEn}
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label={language === 'vi' ? 'Chất lượng hiển thị 3D' : '3D render quality'}
          className="flex items-center gap-1"
        >
          <span className="text-walnut dark:text-ink-muted mr-1">
            {language === 'vi' ? 'Đồ họa:' : 'Quality:'}
          </span>
          {(['low', 'medium', 'high'] as GraphicsPreset[]).map((level) => {
            const active = level === quality;
            const label =
              language === 'vi'
                ? level === 'low'
                  ? 'Thấp'
                  : level === 'medium'
                    ? 'Vừa'
                    : 'Cao'
                : level === 'low'
                  ? 'Low'
                  : level === 'medium'
                    ? 'Med'
                    : 'High';
            return (
              <button
                key={level}
                type="button"
                aria-pressed={active}
                onClick={() => onQualityChange(level)}
                className={`min-h-[30px] rounded px-2 text-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss ${
                  active
                    ? 'bg-moss text-ivory font-medium'
                    : 'text-walnut hover:bg-rice-paper dark:text-ink-muted dark:hover:bg-ink-bg'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
