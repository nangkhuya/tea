import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useRoomStore } from '../stores/useRoomStore';
import { useSceneStore } from '../stores/useSceneStore';
import { TeaCanvasBoundary } from '../three/TeaCanvasBoundary';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/FeedbackStates';

export default function TeaSpaceBoundaryPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const rooms = useRoomStore((s) => s.rooms);
  const cameraMode = useSceneStore((s) => s.cameraMode);
  const setCameraMode = useSceneStore((s) => s.setCameraMode);

  const room = rooms.find((item) => item.id === roomId);

  if (!room) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          title={language === 'vi' ? 'Không tìm thấy phòng trà' : 'Tea room not found'}
          description={
            language === 'vi'
              ? 'Phòng trà này không tồn tại trong danh sách hiện tại hoặc đã được đặt lại.'
              : 'This tea room does not exist in the current list or was reset.'
          }
          actionLabel={t.common.backLobby}
          onAction={() => navigate('/lobby')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="h-4 w-4" />
          {language === 'vi' ? 'Rời không gian trà' : 'Leave tea space'}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={cameraMode === 'third-person' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setCameraMode('third-person')}
          >
            {language === 'vi' ? 'Góc nhìn dạo bước' : 'Third-person view'}
          </Button>
          <Button
            variant={cameraMode === 'seated-tea' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setCameraMode('seated-tea')}
          >
            {language === 'vi' ? 'Góc nhìn bàn trà' : 'Seated tea view'}
          </Button>
        </div>
      </div>

      <TeaCanvasBoundary room={room} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card surface="paper">
          <h2 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
            {language === 'vi' ? 'Thông Tin Không Gian' : 'Space Details'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-walnut dark:text-ink-muted">
            {room.description}
          </p>
          <p className="mt-3 text-xs text-walnut dark:text-ink-muted">
            {language === 'vi' ? 'Chủ phòng:' : 'Host:'} {room.hostName} · {room.teaTradition}
          </p>
        </Card>

        <Card>
          <h2 className="font-serif text-lg font-medium text-dark-walnut dark:text-ink-text">
            {language === 'vi' ? 'Trạng Thái Triển Khai' : 'Implementation Status'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-walnut dark:text-ink-muted">
            {language === 'vi'
              ? 'Lớp khung 3D đang ở trạng thái biên giới kiến trúc (Giai đoạn 01). Khung cảnh 3D Three.js sẽ được dựng tại Giai đoạn 02 và kết nối nhiều người dùng tại Giai đoạn 05.'
              : 'This 3D viewport is currently an architectural boundary (Phase 01). The Three.js environment will be built in Phase 02 and multiplayer synchronized in Phase 05.'}
          </p>
        </Card>
      </div>
    </div>
  );
}
