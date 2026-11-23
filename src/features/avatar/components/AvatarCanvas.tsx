import { useEffect, useRef, useState } from 'react';
import {
  AvatarViewportEngine,
  type ViewportAssetState,
} from '../../../three/AvatarViewportEngine';
import type { GraphicsPreset } from '../../../types/domain';
import type {
  AvatarAnimationId,
  AvatarConfigV3,
  AvatarModelCapabilities,
  CameraPresetId,
  PreviewEnvironmentId,
} from '../types/avatarTypes';

export interface AvatarCanvasProps {
  config: AvatarConfigV3;
  environment?: PreviewEnvironmentId;
  cameraPreset?: CameraPresetId;
  animationId?: AvatarAnimationId;
  quality?: GraphicsPreset;
  reducedMotion?: boolean;
  interactive?: boolean;
  resetViewKey?: number;
  language?: 'vi' | 'en';
  onStatusChange?: (status: ViewportAssetState, details?: string) => void;
  onCapabilitiesChange?: (capabilities: AvatarModelCapabilities) => void;
  className?: string;
}

export function AvatarCanvas({
  config,
  environment = 'neutral-studio',
  cameraPreset = 'full-body',
  animationId = 'idle-standing',
  quality = 'medium',
  reducedMotion = false,
  interactive = true,
  resetViewKey = 0,
  language = 'vi',
  onStatusChange,
  onCapabilitiesChange,
  className = '',
}: AvatarCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AvatarViewportEngine | null>(null);
  const callbacksRef = useRef({ onStatusChange, onCapabilitiesChange });
  callbacksRef.current = { onStatusChange, onCapabilitiesChange };
  const [webglError, setWebglError] = useState(false);

  const initialPropsRef = useRef({
    config,
    environment,
    cameraPreset,
    quality,
    reducedMotion,
    interactive,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let engine: AvatarViewportEngine;
    try {
      const init = initialPropsRef.current;
      engine = new AvatarViewportEngine(
        container,
        init.config,
        {
          quality: init.quality,
          reducedMotion: init.reducedMotion,
          environment: init.environment,
          cameraPreset: init.cameraPreset,
          interactive: init.interactive,
        },
        {
          onStatusChange: (s, d) => callbacksRef.current.onStatusChange?.(s, d),
          onCapabilitiesChange: (caps) => callbacksRef.current.onCapabilitiesChange?.(caps),
          onWebGLError: () => setWebglError(true),
        },
      );
      engineRef.current = engine;
    } catch {
      setWebglError(true);
      return;
    }

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.updateConfig(config);
  }, [config]);

  useEffect(() => {
    engineRef.current?.setEnvironment(environment);
  }, [environment]);

  useEffect(() => {
    engineRef.current?.setCameraPreset(cameraPreset);
  }, [cameraPreset, resetViewKey]);

  useEffect(() => {
    engineRef.current?.setAnimation(animationId);
  }, [animationId]);

  useEffect(() => {
    engineRef.current?.setQuality(quality);
  }, [quality]);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  return (
    <div
      data-testid="avatar-3d-viewport"
      data-webgl-error={webglError ? 'true' : 'false'}
      data-environment={environment}
      data-camera={cameraPreset}
      data-animation={animationId}
      className={`relative h-full w-full overflow-hidden bg-[#e7e0d3] ${className}`}
      aria-label={
        language === 'vi'
          ? 'Khung xem trước nhân vật 3D tương tác'
          : 'Interactive 3D character preview'
      }
    >
      <div ref={mountRef} className="h-full w-full" />
      {webglError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-rice-paper/95 p-6 text-center text-sm text-dark-walnut dark:bg-ink-surface/95 dark:text-ink-text">
          {language === 'vi'
            ? 'Trình duyệt hiện không hỗ trợ WebGL để hiển thị 3D trực tiếp. Bạn vẫn có thể tùy chỉnh và lưu cấu hình nhân vật.'
            : 'WebGL is unavailable in this browser. Your avatar configuration can still be edited and saved.'}
        </div>
      )}
    </div>
  );
}
