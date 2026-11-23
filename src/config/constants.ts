import type { AvatarConfig, TeaRoom } from '../types/domain';

export const APP_NAME = 'ZEN TEA HOUSE';
export const APP_TAGLINE = 'The Art of Tea. The Beauty of Stillness.';

export const MAX_ROOM_CAPACITY = 12;
export const RECOMMENDED_ROOM_CAPACITY_MIN = 8;

export const STORAGE_KEYS = {
  PROFILE: 'zen_tea_house_demo_profile_v1',
  ROOMS: 'zen_tea_house_demo_rooms_v1',
  SETTINGS: 'zen_tea_house_settings_v1',
  AVATAR: 'zen_tea_house_demo_avatar_v1',
  SESSION: 'zen_tea_house_demo_session_v1',
} as const;

export const IMAGE_ASSETS = {
  HERO_PAVILION: '/src/assets/images/hero_zen_pavilion_1795403373319.jpg',
  ROOM_BAMBOO: '/src/assets/images/room_bamboo_courtyard_1795403372716.jpg',
  ROOM_LITERATI: '/src/assets/images/room_literati_lake_1795403373214.jpg',
  ROOM_TWILIGHT: '/src/assets/images/room_twilight_lantern_1795403372564.jpg',
  AVATAR_ATTIRE: '/src/assets/images/avatar_attire_preview_1795403373270.jpg',
} as const;

export const ENVIRONMENT_OPTIONS: Array<{
  id: TeaRoom['environmentId'];
  labelVi: string;
  labelEn: string;
  previewImage: string;
}> = [
  {
    id: 'bamboo-courtyard',
    labelVi: 'Hiên Trúc Tĩnh Lặng',
    labelEn: 'Bamboo Courtyard Pavilion',
    previewImage: IMAGE_ASSETS.ROOM_BAMBOO,
  },
  {
    id: 'literati-lake',
    labelVi: 'Thư Phòng Hồ Sương',
    labelEn: 'Literati Misty Lake Study',
    previewImage: IMAGE_ASSETS.ROOM_LITERATI,
  },
  {
    id: 'twilight-lantern',
    labelVi: 'Trà Thất Đèn Giấy Mưa Chiều',
    labelEn: 'Rainy Twilight Lantern Room',
    previewImage: IMAGE_ASSETS.ROOM_TWILIGHT,
  },
  {
    id: 'misty-pavilion',
    labelVi: 'Đỉnh Mây Bình Minh',
    labelEn: 'Misty Mountain Dawn Pavilion',
    previewImage: IMAGE_ASSETS.HERO_PAVILION,
  },
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  schemaVersion: 3,
  characterId: 'zen-humanoid-neutral',
  genderPresentation: 'neutral',
  body: {
    heightScale: 1.0,
    buildPreset: 'average',
    shoulderWidth: 1.0,
    silhouetteBalance: 0.0,
    posture: 'upright-calm',
  },
  face: {
    faceShape: 'oval',
    jawline: 0.0,
    eyeShape: 'almond',
    eyebrowShape: 'natural',
    noseShape: 'balanced',
    lipShape: 'natural',
    expression: 'serene',
  },
  skin: {
    tone: 'warm-beige',
  },
  hairstyle: 'minimal-tied',
  hairColor: 'natural-black',
  clothing: {
    style: 'linen-samue',
    material: 'linen',
  },
  clothingColors: {
    primary: 'ivory',
    secondary: 'moss-green',
    sash: 'walnut',
  },
  accessories: ['wooden-bracelet'],
  animationPreferences: {
    defaultPose: 'idle-standing',
    idleBreathing: true,
  },
  updatedAt: '2026-11-22T00:00:00.000Z',
};
