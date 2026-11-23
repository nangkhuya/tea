import { useTranslation } from '../../hooks/useTranslation';
import type { TeaRoom } from '../../types/domain';
import { isRoomFull } from '../../utils/roomFilters';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SafeImage } from '../../components/ui/SafeImage';

interface RoomCardProps {
  room: TeaRoom;
  onJoin: (room: TeaRoom) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const { t } = useTranslation();
  const full = isRoomFull(room);

  return (
    <Card padded={false} className="flex flex-col overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden border-b border-linen/70 dark:border-ink-border">
        <SafeImage
          src={room.previewImage}
          alt={room.name}
          fallbackTitle={room.environmentLabel}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-walnut dark:text-ink-muted truncate">
            <span className="shrink-0">
              {room.visibility === 'public' ? t.rooms.publicLabel : t.rooms.privateLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{room.environmentLabel}</span>
            {room.isDemo && (
              <>
                <span aria-hidden="true" className="shrink-0">·</span>
                <span className="shrink-0">{t.rooms.demoSuffix}</span>
              </>
            )}
          </div>

          <h3 className="mt-2 font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
            {room.name}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-walnut dark:text-ink-muted line-clamp-2">
            {room.description}
          </p>
        </div>

        <div className="mt-5 border-t border-linen/70 pt-4 dark:border-ink-border">
          <div className="flex items-center justify-between gap-3 text-xs text-walnut dark:text-ink-muted">
            <span className="truncate">{room.teaTradition}</span>
            <span className="tabular-nums whitespace-nowrap font-medium text-dark-walnut dark:text-ink-text">
              {room.occupancy}/{room.capacity} {t.rooms.seatsUnit}
            </span>
          </div>

          <div className="mt-4">
            <Button
              variant={full ? 'outline' : 'primary'}
              fullWidth
              disabled={full}
              onClick={() => onJoin(room)}
            >
              {full ? `${t.rooms.fullRoom} (${room.occupancy}/${room.capacity})` : t.rooms.joinRoom}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
