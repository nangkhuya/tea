import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../stores/useAppStore';
import { useAvatarStore } from '../stores/useAvatarStore';
import { useProfileStore } from '../stores/useProfileStore';
import { useRoomStore } from '../stores/useRoomStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { AppLanguage, GraphicsPreset, ThemeMode } from '../types/domain';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/FeedbackStates';
import { ToggleSwitch } from '../components/ui/FormControls';
import { Tabs } from '../components/ui/Tabs';

export default function SettingsPage() {
  const { t, language } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const resetDemoProfile = useProfileStore((s) => s.resetDemoProfile);
  const avatarUid = useProfileStore((s) => s.profile.uid);
  const resetDemoRooms = useRoomStore((s) => s.resetDemoRooms);
  const resetDraft = useAvatarStore((s) => s.resetDraft);
  const pushNotification = useAppStore((s) => s.pushNotification);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleResetDemoData = async () => {
    await Promise.all([
      resetSettings(),
      resetDemoProfile(),
      resetDemoRooms(),
      resetDraft(avatarUid),
    ]);
    setConfirmResetOpen(false);
    pushNotification({
      tone: 'info',
      title: language === 'vi' ? 'Đã khôi phục toàn bộ dữ liệu mẫu' : 'Demo data restored to defaults',
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-linen pb-6 dark:border-ink-border">
        <h1 className="font-serif text-3xl font-medium text-dark-walnut dark:text-ink-text">
          {t.settings.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-walnut dark:text-ink-muted">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
            {t.settings.graphicsTitle}
          </h2>
          <p className="mt-1.5 text-sm text-walnut dark:text-ink-muted">
            {t.settings.graphicsDesc}
          </p>
          <div className="mt-4">
            <Tabs<GraphicsPreset>
              ariaLabel={t.settings.graphicsTitle}
              value={settings.graphicsPreset}
              onChange={(graphicsPreset) => void updateSettings({ graphicsPreset })}
              items={[
                { value: 'low', label: language === 'vi' ? 'Thấp (Tiết kiệm pin)' : 'Low (Battery)' },
                { value: 'medium', label: language === 'vi' ? 'Trung bình (Cân bằng)' : 'Medium (Balanced)' },
                { value: 'high', label: language === 'vi' ? 'Cao (Chi tiết tối đa)' : 'High (Maximum)' },
              ]}
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
            {t.settings.soundTitle}
          </h2>
          <div className="mt-4 divide-y divide-linen/70 dark:divide-ink-border">
            <ToggleSwitch
              label={language === 'vi' ? 'Âm thanh không gian trà thất' : 'Ambient tea house audio'}
              description={
                language === 'vi'
                  ? 'Tiếng nước chảy, gió trúc và âm thanh nghi thức nhẹ nhàng.'
                  : 'Subtle water, bamboo breeze, and tea ritual audio cues.'
              }
              checked={settings.soundEnabled}
              onChange={(soundEnabled) => void updateSettings({ soundEnabled })}
            />
            <div className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <label htmlFor="ambient-volume-slider" className="font-medium text-dark-walnut dark:text-ink-text">
                  {language === 'vi' ? 'Âm lượng nền' : 'Ambient volume'}
                </label>
                <span className="tabular-nums text-xs text-walnut dark:text-ink-muted">
                  {settings.ambientVolume}%
                </span>
              </div>
              <input
                id="ambient-volume-slider"
                type="range"
                min={0}
                max={100}
                disabled={!settings.soundEnabled}
                value={settings.ambientVolume}
                onChange={(e) => void updateSettings({ ambientVolume: Number(e.target.value) })}
                className="mt-2 w-full accent-moss disabled:opacity-45 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <h2 className="font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
              {t.settings.languageTitle}
            </h2>
            <p className="mt-1.5 text-sm text-walnut dark:text-ink-muted">
              {language === 'vi'
                ? 'Mặc định Tiếng Việt, hỗ trợ chuyển đổi sang Tiếng Anh.'
                : 'Vietnamese default with extensible English localization.'}
            </p>
            <div className="mt-4">
              <Tabs<AppLanguage>
                ariaLabel={t.settings.languageTitle}
                value={settings.language}
                onChange={(nextLang) => void updateSettings({ language: nextLang })}
                items={[
                  { value: 'vi', label: 'Tiếng Việt' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
              {t.settings.interfaceTitle}
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-xs text-walnut dark:text-ink-muted">
                  {language === 'vi' ? 'Sắc độ hiển thị' : 'Color appearance'}
                </p>
                <Tabs<ThemeMode>
                  ariaLabel={language === 'vi' ? 'Chọn sắc độ giao diện' : 'Theme mode'}
                  value={settings.themeMode}
                  onChange={(themeMode) => void updateSettings({ themeMode })}
                  items={[
                    { value: 'light', label: language === 'vi' ? 'Ngà Ấm (Sáng)' : 'Warm Ivory (Light)' },
                    { value: 'dark', label: language === 'vi' ? 'Mực Trầm (Tối)' : 'Deep Ink (Dark)' },
                  ]}
                />
              </div>
              <ToggleSwitch
                label={language === 'vi' ? 'Giảm chuyển động giao diện' : 'Reduce motion'}
                checked={settings.reducedMotion}
                onChange={(reducedMotion) => void updateSettings({ reducedMotion })}
              />
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="font-serif text-xl font-medium text-dark-walnut dark:text-ink-text">
            {t.settings.privacyTitle}
          </h2>
          <div className="mt-4 divide-y divide-linen/70 dark:divide-ink-border">
            <ToggleSwitch
              label={language === 'vi' ? 'Hiển thị trạng thái hiện diện trong phòng' : 'Show room presence to others'}
              description={
                language === 'vi'
                  ? 'Áp dụng khi hệ thống multiplayer Giai đoạn 05 hoạt động.'
                  : 'Applies once Phase 05 multiplayer presence is active.'
              }
              checked={settings.showPresenceToOthers}
              onChange={(showPresenceToOthers) => void updateSettings({ showPresenceToOthers })}
            />
            <ToggleSwitch
              label={language === 'vi' ? 'Cho phép nhận lời mời thưởng trà' : 'Allow tea ceremony invitations'}
              checked={settings.allowRoomInvitations}
              onChange={(allowRoomInvitations) => void updateSettings({ allowRoomInvitations })}
            />
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-linen pt-5 sm:flex-row sm:items-center dark:border-ink-border">
            <div>
              <p className="text-sm font-medium text-dark-walnut dark:text-ink-text">
                {t.settings.resetDemoTitle}
              </p>
              <p className="mt-0.5 text-xs text-walnut dark:text-ink-muted">
                {language === 'vi'
                  ? 'Đưa hồ sơ mẫu, phòng mẫu và cài đặt về trạng thái ban đầu.'
                  : 'Restore demo profile, sample rooms, and settings to defaults.'}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setConfirmResetOpen(true)}>
              {t.settings.resetDemoButton}
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmResetOpen}
        title={language === 'vi' ? 'Xác nhận đặt lại dữ liệu Demo?' : 'Reset Demo Data?'}
        description={
          language === 'vi'
            ? 'Mọi phòng trà mẫu bạn đã tạo và chỉnh sửa hồ sơ cục bộ sẽ trở về mặc định.'
            : 'All locally created demo rooms and profile edits will return to defaults.'
        }
        confirmLabel={t.common.confirm}
        cancelLabel={t.common.cancel}
        destructive
        onConfirm={() => void handleResetDemoData()}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}
