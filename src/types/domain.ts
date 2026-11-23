export type GraphicsPreset = 'low' | 'medium' | 'high';
export type AppLanguage = 'vi' | 'en';
export type ThemeMode = 'light' | 'dark';
export type RoomVisibility = 'public' | 'private';
export type RoomStatus = 'open' | 'full' | 'preparing' | 'archived';
export type AuthMode = 'guest-demo' | 'firebase';

export interface UserPreferences {
  graphicsPreset: GraphicsPreset;
  soundEnabled: boolean;
  ambientVolume: number;
  language: AppLanguage;
  themeMode: ThemeMode;
  compactLayout: boolean;
  reducedMotion: boolean;
  showPresenceToOthers: boolean;
  allowRoomInvitations: boolean;
}

export type AvatarAttireStyle = 'hanfu-scholar' | 'zen-yukata' | 'natural-linen' | 'tea-robe' | 'modern-linen';
export type AvatarColorTone = 'warm-ivory' | 'moss-green' | 'muted-indigo' | 'walnut-earth';
export type AvatarHairStyle = 'low-bun' | 'shoulder-natural' | 'short-neat' | 'pinned-classic';
export type AvatarFacePreset = 'soft' | 'oval' | 'defined';
export type AvatarHairColor = 'espresso' | 'chestnut' | 'silver';
export type AvatarAccessory = 'wooden-hairpin' | 'tea-beads' | 'round-glasses';

export interface AvatarConfig {
  schemaVersion: 2;
  characterId: string;
  appearance: {
    presentation: 'feminine' | 'masculine' | 'neutral';
    skinTone: 'porcelain' | 'warm-beige' | 'amber-olive' | 'deep-bronze';
    facePreset: AvatarFacePreset;
  };
  body: {
    heightScale: number;
    posture: 'upright-calm' | 'relaxed-tea';
  };
  hairstyle: AvatarHairStyle;
  hairColor: AvatarHairColor;
  clothing: AvatarAttireStyle;
  accessories: AvatarAccessory[];
  colors: {
    primary: AvatarColorTone;
    accent: AvatarColorTone;
  };
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  bio: string;
  favoriteTea: string;
  photoURL: string | null;
  avatarConfig: AvatarConfig;
  preferences: UserPreferences;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  mode: AuthMode;
  isAuthenticated: boolean;
  uid: string | null;
  provider: 'guest-demo' | 'google' | 'facebook' | null;
  hasEnteredSanctuary: boolean;
}

export interface TeaRoom {
  id: string;
  name: string;
  description: string;
  capacity: number;
  occupancy: number;
  visibility: RoomVisibility;
  environmentId: 'bamboo-courtyard' | 'literati-lake' | 'twilight-lantern' | 'misty-pavilion';
  environmentLabel: string;
  previewImage: string;
  hostName: string;
  teaTradition: string;
  status: RoomStatus;
  isDemo: boolean;
  createdAt: string;
}

export interface CreateRoomInput {
  name: string;
  description: string;
  capacity: number;
  visibility: RoomVisibility;
  environmentId: TeaRoom['environmentId'];
  teaTradition: string;
}

export interface RoomFilterCriteria {
  query: string;
  visibility: 'all' | RoomVisibility;
  sortBy: 'featured' | 'occupancy-asc' | 'name-asc';
}

export interface NotificationMessage {
  id: string;
  tone: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
}

export interface SceneBoundaryState {
  activeRoomId: string | null;
  cameraMode: 'third-person' | 'seated-tea';
  assetPipelineStatus: 'phase-01-boundary' | 'ready';
  webGLSupported: boolean | null;
  is3DImplemented: boolean;
}

export interface RouteAccessDecision {
  allowed: boolean;
  reason?: 'requires-session' | 'future-auth-placeholder';
  redirectTo?: string;
}
