import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useProfileStore } from '../stores/useProfileStore';
import { useRoomStore } from '../stores/useRoomStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { TeaRoom } from '../types/domain';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CreateRoomModal } from '../features/tea-house/CreateRoomModal';
import { RoomCard } from '../features/tea-house/RoomCard';

export default function LobbyPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);
  const rooms = useRoomStore((s) => s.rooms);
  const selectRoom = useRoomStore((s) => s.selectRoom);
  const graphicsPreset = useSettingsStore((s) => s.settings.graphicsPreset);

  const [createOpen, setCreateOpen] = useState(false);

  const featuredRooms = rooms.slice(0, 3);

  const handleJoinRoom = (room: TeaRoom) => {
    selectRoom(room.id);
    navigate(`/tea-space/${room.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 border-b border-linen pb-8 lg:flex-row lg:items-end lg:justify-between dark:border-ink-border">
        <div>
          <p className="text-xs tracking-wide text-moss dark:text-sage">
            {t.lobby.guestBadge}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-dark-walnut dark:text-ink-text">
            {t.lobby.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-walnut dark:text-ink-muted">
            {t.lobby.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/rooms')}>
            {t.lobby.exploreAllRooms}
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.lobby.createRoom}
          </Button>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card surface="paper" className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <p className="text-xs text-walnut dark:text-ink-muted">
              {t.lobby.welcomePrefix}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-medium text-dark-walnut dark:text-ink-text">
              {profile.displayName}
            </h2>
            <p className="mt-2 text-sm text-walnut dark:text-ink-muted">
              {profile.bio}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-1.5 border-t border-linen pt-4 text-xs text-walnut sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 dark:border-ink-border dark:text-ink-muted">
            <span>
              {language === 'vi' ? 'Trà yêu thích:' : 'Preferred tea:'}{' '}
              <strong className="font-medium text-dark-walnut dark:text-ink-text">
                {profile.favoriteTea}
              </strong>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>
              {language === 'vi' ? 'Đồ họa dự kiến:' : 'Graphics:'}{' '}
              <strong className="font-medium uppercase text-dark-walnut dark:text-ink-text">
                {graphicsPreset}
              </strong>
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
              {language === 'vi' ? 'Chuẩn Bị Trước Khi Vào Phòng' : 'Preparation'}
            </h3>
            <p className="mt-1.5 text-sm text-walnut dark:text-ink-muted">
              {language === 'vi'
                ? 'Kiểm tra hồ sơ cá nhân hoặc phác thảo trang phục trước Giai đoạn 03.'
                : 'Review your guest profile or draft character attire ahead of Phase 03.'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button variant="outline" fullWidth onClick={() => navigate('/profile')}>
              {t.lobby.quickProfile}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/avatar')}>
              {t.lobby.quickAvatar}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-dark-walnut dark:text-ink-text">
              {t.lobby.featuredTitle}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-walnut dark:text-ink-muted">
              {t.lobby.demoDataNotice}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/rooms')}>
            {t.lobby.exploreAllRooms}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
          ))}
        </div>
      </section>

      <CreateRoomModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(room) => {
          selectRoom(room.id);
          navigate(`/tea-space/${room.id}`);
        }}
      />
    </div>
  );
}
