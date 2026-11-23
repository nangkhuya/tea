import type {
  AvatarConfig,
  CreateRoomInput,
  TeaRoom,
  UserPreferences,
  UserProfile,
  UserSession,
} from '../types/domain';

export interface IAuthService {
  readonly mode: 'guest-demo' | 'firebase';
  getSession(): Promise<UserSession>;
  enterGuestDemo(): Promise<UserSession>;
  signOutDemo(): Promise<UserSession>;
  /**
   * Future Phase 04 methods:
   * signInWithGoogle(): Promise<UserSession>;
   * signInWithFacebook(): Promise<UserSession>;
   */
}

export interface IUserProfileService {
  getProfile(uid: string): Promise<UserProfile>;
  updateProfile(
    uid: string,
    patch: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'favoriteTea'>>,
  ): Promise<UserProfile>;
  resetDemoProfile(): Promise<UserProfile>;
}

export interface ITeaRoomService {
  listRooms(): Promise<TeaRoom[]>;
  getRoomById(roomId: string): Promise<TeaRoom | null>;
  createRoom(input: CreateRoomInput, hostName: string): Promise<TeaRoom>;
  resetDemoRooms(): Promise<TeaRoom[]>;
}

export interface IAvatarService {
  getAvatarConfig(uid: string): Promise<AvatarConfig>;
  saveAvatarConfig(uid: string, config: AvatarConfig): Promise<AvatarConfig>;
  resetDemoAvatar(uid?: string): Promise<AvatarConfig>;
}

export interface ISettingsService {
  getSettings(): Promise<UserPreferences>;
  saveSettings(settings: UserPreferences): Promise<UserPreferences>;
  resetSettings(): Promise<UserPreferences>;
}
