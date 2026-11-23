import { DEFAULT_AVATAR_CONFIG, IMAGE_ASSETS, MAX_ROOM_CAPACITY } from '../config/constants';
import type { TeaRoom, UserPreferences, UserProfile } from '../types/domain';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  graphicsPreset: 'medium',
  soundEnabled: true,
  ambientVolume: 45,
  language: 'vi',
  themeMode: 'light',
  compactLayout: false,
  reducedMotion: false,
  showPresenceToOthers: true,
  allowRoomInvitations: true,
};

export const DEMO_USER_PROFILE: UserProfile = {
  uid: 'demo-guest-001',
  displayName: 'Trà Khách Tĩnh Tâm',
  bio: 'Yêu thích trà Ô Long núi cao, kiến trúc gỗ mộc và những buổi trò chuyện chậm rãi.',
  favoriteTea: 'Ô Long Đông Đỉnh',
  photoURL: null,
  avatarConfig: DEFAULT_AVATAR_CONFIG,
  preferences: DEFAULT_USER_PREFERENCES,
  isDemo: true,
  createdAt: '2026-11-22T08:00:00.000Z',
  updatedAt: '2026-11-22T08:00:00.000Z',
};

export const DEMO_TEA_ROOMS: TeaRoom[] = [
  {
    id: 'demo-room-bamboo',
    name: 'Hiên Trúc Mai Viên',
    description:
      'Trà thất chiếu tatami mở ra vườn trúc xanh và đèn đá rêu phong, thích hợp cho buổi tọa đàm tĩnh lặng đầu ngày.',
    capacity: 10,
    occupancy: 4,
    visibility: 'public',
    environmentId: 'bamboo-courtyard',
    environmentLabel: 'Hiên Trúc Tĩnh Lặng',
    previewImage: IMAGE_ASSETS.ROOM_BAMBOO,
    hostName: 'Minh An (Mẫu)',
    teaTradition: 'Thiền Trà Nhật · Matcha & Sencha',
    status: 'open',
    isDemo: true,
    createdAt: '2026-11-22T07:30:00.000Z',
  },
  {
    id: 'demo-room-literati',
    name: 'Vân Hồ Trà Thư Phòng',
    description:
      'Thư phòng gỗ óc chó hướng mặt hồ sương sớm, ấm tử sa và tranh thủy mặc dành cho người yêu trà đạo văn nhân.',
    capacity: MAX_ROOM_CAPACITY,
    occupancy: 7,
    visibility: 'public',
    environmentId: 'literati-lake',
    environmentLabel: 'Thư Phòng Hồ Sương',
    previewImage: IMAGE_ASSETS.ROOM_LITERATI,
    hostName: 'Thanh Hiên (Mẫu)',
    teaTradition: 'Công Phu Trà · Ô Long & Phổ Nhĩ',
    status: 'open',
    isDemo: true,
    createdAt: '2026-11-22T06:45:00.000Z',
  },
  {
    id: 'demo-room-twilight',
    name: 'Dạ Vũ Đăng Trà Thất',
    description:
      'Không gian ấm áp ánh đèn giấy dó trong cơn mưa chiều, nệm vải lanh quanh bàn trà gỗ tuyết tùng.',
    capacity: 8,
    occupancy: 8,
    visibility: 'public',
    environmentId: 'twilight-lantern',
    environmentLabel: 'Trà Thất Đèn Giấy Mưa Chiều',
    previewImage: IMAGE_ASSETS.ROOM_TWILIGHT,
    hostName: 'Hương Thảo (Mẫu)',
    teaTradition: 'Bạch Trà Cổ Thụ',
    status: 'full',
    isDemo: true,
    createdAt: '2026-11-22T05:15:00.000Z',
  },
  {
    id: 'demo-room-sanctuary',
    name: 'Tĩnh Sơn Trà Quán (Riêng tư)',
    description:
      'Phòng trà riêng tư dành cho nhóm bạn đồng tu và thảo luận chuyên đề văn hóa trà Á Đông.',
    capacity: MAX_ROOM_CAPACITY,
    occupancy: 2,
    visibility: 'private',
    environmentId: 'misty-pavilion',
    environmentLabel: 'Đỉnh Mây Bình Minh',
    previewImage: IMAGE_ASSETS.HERO_PAVILION,
    hostName: 'Trà Khách Tĩnh Tâm (Mẫu)',
    teaTradition: 'Thiết Quan Âm & Trà Sen',
    status: 'open',
    isDemo: true,
    createdAt: '2026-11-22T04:00:00.000Z',
  },
];
