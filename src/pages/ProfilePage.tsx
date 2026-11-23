import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../stores/useAppStore';
import { useProfileStore } from '../stores/useProfileStore';
import { validateProfileEditInput } from '../utils/validation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TextArea, TextField } from '../components/ui/FormControls';
import { Tooltip } from '../components/ui/Tooltip';

export default function ProfilePage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const pushNotification = useAppStore((s) => s.pushNotification);

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [favoriteTea, setFavoriteTea] = useState(profile.favoriteTea);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const startEditing = () => {
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setFavoriteTea(profile.favoriteTea);
    setErrors({});
    setEditing(true);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const result = validateProfileEditInput({ displayName, bio, favoriteTea }, language);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    const ok = await updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      favoriteTea: favoriteTea.trim(),
    });

    if (ok) {
      setEditing(false);
      pushNotification({
        tone: 'success',
        title: language === 'vi' ? 'Đã cập nhật hồ sơ mẫu' : 'Demo profile updated',
      });
    }
  };

  const initials = profile.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-linen pb-6 dark:border-ink-border">
        <h1 className="font-serif text-3xl font-medium text-dark-walnut dark:text-ink-text">
          {t.profile.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-walnut dark:text-ink-muted">
          {t.profile.subtitle}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card surface="paper" className="lg:col-span-7">
          {!editing ? (
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-sand bg-ivory font-serif text-lg font-medium text-dark-walnut dark:border-ink-border dark:bg-ink-bg dark:text-ink-text"
                  >
                    {initials || 'ZT'}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-medium text-dark-walnut dark:text-ink-text">
                      {profile.displayName}
                    </h2>
                    <p className="mt-1 text-xs tabular-nums text-walnut dark:text-ink-muted">
                      ID: {profile.uid}
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={startEditing}>
                  {t.profile.editProfile}
                </Button>
              </div>

              <dl className="mt-6 space-y-4 border-t border-linen pt-5 text-sm dark:border-ink-border">
                <div>
                  <dt className="text-xs text-walnut dark:text-ink-muted">
                    {t.profile.accountStatusTitle}
                  </dt>
                  <dd className="mt-1 font-medium text-moss dark:text-sage">
                    {t.profile.guestStatusValue}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-walnut dark:text-ink-muted">{t.profile.favoriteTea}</dt>
                  <dd className="mt-1 text-dark-walnut dark:text-ink-text">{profile.favoriteTea}</dd>
                </div>
                <div>
                  <dt className="text-xs text-walnut dark:text-ink-muted">{t.profile.bio}</dt>
                  <dd className="mt-1 leading-relaxed text-charcoal dark:text-ink-text">
                    {profile.bio}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <TextField
                label={t.profile.displayName}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setErrors((prev) => ({ ...prev, displayName: undefined }));
                }}
                error={errors.displayName}
                required
              />
              <TextField
                label={t.profile.favoriteTea}
                value={favoriteTea}
                onChange={(e) => {
                  setFavoriteTea(e.target.value);
                  setErrors((prev) => ({ ...prev, favoriteTea: undefined }));
                }}
                error={errors.favoriteTea}
              />
              <TextArea
                label={t.profile.bio}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setErrors((prev) => ({ ...prev, bio: undefined }));
                }}
                error={errors.bio}
              />
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  {t.profile.cancel}
                </Button>
                <Button type="submit">{t.profile.saveProfile}</Button>
              </div>
            </form>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-5">
          <Card>
            <h2 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
              {t.profile.authSectionTitle}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-walnut dark:text-ink-muted">
              {t.profile.authSectionNote}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Tooltip
                content={
                  language === 'vi'
                    ? 'Sẽ kích hoạt khi kết nối Firebase Auth ở Giai đoạn 04'
                    : 'Will be enabled with Firebase Auth in Phase 04'
                }
              >
                <Button variant="outline" fullWidth disabled>
                  {t.profile.googleProvider}
                </Button>
              </Tooltip>

              <Tooltip
                content={
                  language === 'vi'
                    ? 'Sẽ kích hoạt khi kết nối Firebase Auth ở Giai đoạn 04'
                    : 'Will be enabled with Firebase Auth in Phase 04'
                }
              >
                <Button variant="outline" fullWidth disabled>
                  {t.profile.facebookProvider}
                </Button>
              </Tooltip>
            </div>
          </Card>

          <Card>
            <h2 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
              {language === 'vi' ? 'Liên Kết Nhanh' : 'Quick Links'}
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              <Button variant="secondary" fullWidth onClick={() => navigate('/avatar')}>
                {t.profile.avatarCta}
              </Button>
              <Button variant="ghost" fullWidth onClick={() => navigate('/settings')}>
                {t.profile.settingsCta}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
