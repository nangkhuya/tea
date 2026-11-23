import { useEffect, type ReactNode } from 'react';
import { useAvatarStore } from '../../stores/useAvatarStore';
import { useProfileStore } from '../../stores/useProfileStore';
import { useRoomStore } from '../../stores/useRoomStore';
import { useSessionStore } from '../../stores/useSessionStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { ToastViewport } from '../ui/FeedbackStates';
import { Footer } from './Footer';
import { TopNav } from './TopNav';

export function AppLayout({ children }: { children: ReactNode }) {
  const hydrateSettings = useSettingsStore((s) => s.hydrateSettings);
  const hydrateSession = useSessionStore((s) => s.hydrateSession);
  const hydrateProfile = useProfileStore((s) => s.hydrateProfile);
  const hydrateRooms = useRoomStore((s) => s.hydrateRooms);
  const hydrateAvatar = useAvatarStore((s) => s.hydrateAvatar);
  const uid = useSessionStore((s) => s.session.uid);

  useEffect(() => {
    void hydrateSettings();
    void hydrateSession();
    void hydrateRooms();
  }, [hydrateSettings, hydrateSession, hydrateRooms]);

  useEffect(() => {
    if (uid) {
      void hydrateProfile(uid);
      void hydrateAvatar(uid);
    }
  }, [uid, hydrateProfile, hydrateAvatar]);

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-charcoal dark:bg-ink-bg dark:text-ink-text">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastViewport />
    </div>
  );
}
