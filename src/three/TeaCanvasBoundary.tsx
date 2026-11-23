import { useEffect } from 'react';
import { useSceneStore } from '../stores/useSceneStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { TeaRoom } from '../types/domain';
import { SafeImage } from '../components/ui/SafeImage';

interface TeaCanvasBoundaryProps {
  room: TeaRoom;
}

/**
 * Architectural Boundary for Phase 02 (3D Tea House World).
 *
 * In Phase 02, React Three Fiber `<Canvas>`, lighting, PBR timber/tatami materials,
 * third-person camera rig, and GLTF asset loader will mount inside this container
 * without modifying routing, lobby, or application shell code.
 */
export function TeaCanvasBoundary({ room }: TeaCanvasBoundaryProps) {
  const language = useSettingsStore((s) => s.settings.language);
  const graphicsPreset = useSettingsStore((s) => s.settings.graphicsPreset);
  const webGLSupported = useSceneStore((s) => s.webGLSupported);
  const detectWebGLSupport = useSceneStore((s) => s.detectWebGLSupport);
  const enterTeaSpaceBoundary = useSceneStore((s) => s.enterTeaSpaceBoundary);
  const leaveTeaSpaceBoundary = useSceneStore((s) => s.leaveTeaSpaceBoundary);

  useEffect(() => {
    detectWebGLSupport();
    enterTeaSpaceBoundary(room.id);
    return () => leaveTeaSpaceBoundary();
  }, [room.id, detectWebGLSupport, enterTeaSpaceBoundary, leaveTeaSpaceBoundary]);

  return (
    <div
      data-testid="three-canvas-boundary"
      className="relative overflow-hidden rounded-lg border border-linen bg-charcoal text-ivory dark:border-ink-border"
    >
      <div className="aspect-[16/9] w-full max-h-[540px] relative">
        <SafeImage
          src={room.previewImage}
          alt={room.name}
          fallbackTitle={room.environmentLabel}
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/65 to-charcoal/35" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <p className="text-xs tracking-widest uppercase text-sand">
            {language === 'vi'
              ? 'Biên giới Tích hợp 3D · Chuẩn bị Giai đoạn 02'
              : '3D Integration Boundary · Prepared for Phase 02'}
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-ivory">
            {room.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory/85">
            {language === 'vi'
              ? 'Container này được thiết kế sẵn làm điểm gắn React Three Fiber Canvas, hệ thống ánh sáng vật lý, camera góc nhìn thứ ba và bộ nạp mô hình GLTF/GLB trong Giai đoạn 02.'
              : 'This container reserves the dedicated mount boundary for React Three Fiber Canvas, physical lighting, third-person camera controls, and GLTF/GLB asset loading in Phase 02.'}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ivory/20 pt-5 text-xs sm:grid-cols-4">
            <div>
              <dt className="text-ivory/65">{language === 'vi' ? 'Kiến trúc' : 'Environment'}</dt>
              <dd className="mt-1 font-medium text-ivory">{room.environmentLabel}</dd>
            </div>
            <div>
              <dt className="text-ivory/65">{language === 'vi' ? 'Cấu hình đồ họa' : 'Graphics Preset'}</dt>
              <dd className="mt-1 font-medium uppercase text-ivory">{graphicsPreset}</dd>
            </div>
            <div>
              <dt className="text-ivory/65">WebGL</dt>
              <dd className="mt-1 font-medium text-ivory">
                {webGLSupported === null
                  ? '...'
                  : webGLSupported
                    ? language === 'vi'
                      ? 'Trình duyệt hỗ trợ'
                      : 'Supported'
                    : language === 'vi'
                      ? 'Không khả dụng'
                      : 'Unavailable'}
              </dd>
            </div>
            <div>
              <dt className="text-ivory/65">{language === 'vi' ? 'Sức chứa chuẩn' : 'Max Capacity'}</dt>
              <dd className="mt-1 font-medium tabular-nums text-ivory">
                {room.occupancy} / {room.capacity}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
