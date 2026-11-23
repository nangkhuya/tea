import { Plus, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useRoomStore } from '../stores/useRoomStore';
import type { RoomFilterCriteria, TeaRoom } from '../types/domain';
import { filterAndSortRooms } from '../utils/roomFilters';
import { Button } from '../components/ui/Button';
import { Dropdown } from '../components/ui/Dropdown';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/FeedbackStates';
import { Tabs } from '../components/ui/Tabs';
import { CreateRoomModal } from '../features/tea-house/CreateRoomModal';
import { RoomCard } from '../features/tea-house/RoomCard';

export default function RoomsPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const rooms = useRoomStore((s) => s.rooms);
  const filter = useRoomStore((s) => s.filter);
  const loading = useRoomStore((s) => s.loading);
  const error = useRoomStore((s) => s.error);
  const setFilter = useRoomStore((s) => s.setFilter);
  const resetFilter = useRoomStore((s) => s.resetFilter);
  const refreshRooms = useRoomStore((s) => s.refreshRooms);
  const selectRoom = useRoomStore((s) => s.selectRoom);

  const [createOpen, setCreateOpen] = useState(false);

  const visibleRooms = useMemo(() => filterAndSortRooms(rooms, filter), [rooms, filter]);

  const handleJoin = (room: TeaRoom) => {
    selectRoom(room.id);
    navigate(`/tea-space/${room.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-linen pb-8 lg:flex-row lg:items-end lg:justify-between dark:border-ink-border">
        <div>
          <h1 className="font-serif text-3xl font-medium text-dark-walnut dark:text-ink-text">
            {t.rooms.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-walnut dark:text-ink-muted">
            {t.rooms.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => void refreshRooms(false)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t.rooms.refresh}
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.rooms.createRoom}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="room-search-input" className="sr-only">
            {t.rooms.searchPlaceholder}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut dark:text-ink-muted"
          />
          <input
            id="room-search-input"
            type="search"
            value={filter.query}
            onChange={(e) => setFilter({ query: e.target.value })}
            placeholder={t.rooms.searchPlaceholder}
            className="min-h-[42px] w-full rounded-md border border-linen bg-ivory pl-10 pr-4 text-sm text-charcoal placeholder:text-walnut/60 focus:outline-none focus:ring-2 focus:ring-moss dark:border-ink-border dark:bg-ink-surface dark:text-ink-text dark:placeholder:text-ink-muted/60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            ariaLabel={language === 'vi' ? 'Lọc quyền riêng tư phòng' : 'Filter room visibility'}
            value={filter.visibility}
            onChange={(visibility) => setFilter({ visibility })}
            items={[
              { value: 'all', label: t.rooms.filterAll },
              { value: 'public', label: t.rooms.filterPublic },
              { value: 'private', label: t.rooms.filterPrivate },
            ]}
          />

          <Dropdown<RoomFilterCriteria['sortBy']>
            label={language === 'vi' ? 'Sắp xếp phòng trà' : 'Sort tea rooms'}
            value={filter.sortBy}
            onChange={(sortBy) => setFilter({ sortBy })}
            options={[
              { value: 'featured', label: t.rooms.sortFeatured },
              { value: 'occupancy-asc', label: t.rooms.sortOccupancy },
              { value: 'name-asc', label: t.rooms.sortName },
            ]}
          />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {error && (
          <ErrorState
            title={t.common.errorTitle}
            description={error}
            retryLabel={t.common.retry}
            onRetry={() => void refreshRooms(false)}
          />
        )}

        {loading ? (
          <LoadingState message={t.common.loading} />
        ) : visibleRooms.length === 0 ? (
          <EmptyState
            title={t.rooms.emptyTitle}
            description={t.rooms.emptyBody}
            actionLabel={t.rooms.resetFilters}
            onAction={resetFilter}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleRooms.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </div>

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
