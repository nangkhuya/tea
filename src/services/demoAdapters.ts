import { DEFAULT_AVATAR_CONFIG, ENVIRONMENT_OPTIONS, STORAGE_KEYS } from '../config/constants';
import { DEFAULT_USER_PREFERENCES, DEMO_TEA_ROOMS, DEMO_USER_PROFILE } from '../data/demoData';
import {
  ACCESSORY_REGISTRY,
  ANIMATION_REGISTRY,
  BASE_CHARACTER_MODELS,
  CLOTHING_REGISTRY,
  HAIRSTYLE_REGISTRY,
} from '../features/avatar/assets/avatarRegistry';
import { AVATAR_PRESETS } from '../features/avatar/presets/avatarPresets';
import {
  migrateAvatarConfig,
  validateAvatarConfig,
} from '../features/avatar/services/avatarValidation';
import type {
  AvatarConfig,
  CreateRoomInput,
  TeaRoom,
  UserPreferences,
  UserProfile,
  UserSession,
} from '../types/domain';
import { clampRoomCapacity } from '../utils/roomFilters';
import type {
  AvailableAvatarAssetsSnapshot,
  IAuthService,
  IAvatarService,
  ISettingsService,
  ITeaRoomService,
  IUserProfileService,
} from './interfaces';

const memoryStorage = new Map<string, string>();

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw =
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(key)
        : memoryStorage.get(key) ?? null;
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  const serialized = JSON.stringify(value);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStorage.set(key, serialized);
    }
  } catch {
    memoryStorage.set(key, serialized);
  }
}

const DEFAULT_DEMO_SESSION: UserSession = {
  mode: 'guest-demo',
  isAuthenticated: false,
  uid: DEMO_USER_PROFILE.uid,
  provider: 'guest-demo',
  hasEnteredSanctuary: false,
};

export class DemoAuthService implements IAuthService {
  readonly mode = 'guest-demo' as const;

  async getSession(): Promise<UserSession> {
    return readStorage<UserSession>(STORAGE_KEYS.SESSION, DEFAULT_DEMO_SESSION);
  }

  async enterGuestDemo(): Promise<UserSession> {
    const next: UserSession = {
      ...DEFAULT_DEMO_SESSION,
      hasEnteredSanctuary: true,
    };
    writeStorage(STORAGE_KEYS.SESSION, next);
    return next;
  }

  async signOutDemo(): Promise<UserSession> {
    writeStorage(STORAGE_KEYS.SESSION, DEFAULT_DEMO_SESSION);
    return DEFAULT_DEMO_SESSION;
  }
}

export class DemoUserProfileService implements IUserProfileService {
  async getProfile(_uid: string): Promise<UserProfile> {
    return readStorage<UserProfile>(STORAGE_KEYS.PROFILE, DEMO_USER_PROFILE);
  }

  async updateProfile(
    _uid: string,
    patch: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'favoriteTea'>>,
  ): Promise<UserProfile> {
    const current = await this.getProfile(_uid);
    const updated: UserProfile = {
      ...current,
      ...patch,
      isDemo: true,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  async resetDemoProfile(): Promise<UserProfile> {
    const fresh: UserProfile = {
      ...DEMO_USER_PROFILE,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.PROFILE, fresh);
    return fresh;
  }
}

export class DemoTeaRoomService implements ITeaRoomService {
  async listRooms(): Promise<TeaRoom[]> {
    return readStorage<TeaRoom[]>(STORAGE_KEYS.ROOMS, DEMO_TEA_ROOMS);
  }

  async getRoomById(roomId: string): Promise<TeaRoom | null> {
    const rooms = await this.listRooms();
    return rooms.find((room) => room.id === roomId) ?? null;
  }

  async createRoom(input: CreateRoomInput, hostName: string): Promise<TeaRoom> {
    const rooms = await this.listRooms();
    const env =
      ENVIRONMENT_OPTIONS.find((opt) => opt.id === input.environmentId) ?? ENVIRONMENT_OPTIONS[0];
    const newRoom: TeaRoom = {
      id: `demo-room-${Date.now()}`,
      name: input.name.trim(),
      description: input.description.trim(),
      capacity: clampRoomCapacity(input.capacity),
      occupancy: 1,
      visibility: input.visibility,
      environmentId: env.id,
      environmentLabel: env.labelVi,
      previewImage: env.previewImage,
      hostName: `${hostName} (Mẫu)`,
      teaTradition: input.teaTradition.trim(),
      status: 'open',
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    const next = [newRoom, ...rooms];
    writeStorage(STORAGE_KEYS.ROOMS, next);
    return newRoom;
  }

  async resetDemoRooms(): Promise<TeaRoom[]> {
    writeStorage(STORAGE_KEYS.ROOMS, DEMO_TEA_ROOMS);
    return DEMO_TEA_ROOMS;
  }
}

function avatarStorageKey(uid: string): string {
  return `zen_tea_house_avatar_v3_${encodeURIComponent(uid || 'demo-guest-001')}`;
}

function legacyV2AvatarStorageKey(uid: string): string {
  return `zen_tea_house_avatar_v2_${encodeURIComponent(uid || 'demo')}`;
}

export class LocalAvatarService implements IAvatarService {
  async getAvatar(uid: string): Promise<AvatarConfig> {
    const key = avatarStorageKey(uid);
    const stored = readStorage<unknown>(key, null);
    if (stored) {
      return migrateAvatarConfig(stored);
    }

    // One-time migration from v2 or Phase 01 shared demo slot.
    const legacyV2 = readStorage<unknown>(legacyV2AvatarStorageKey(uid), null);
    if (legacyV2) {
      const migrated = migrateAvatarConfig(legacyV2);
      writeStorage(key, migrated);
      return migrated;
    }

    const legacyV1 = readStorage<unknown>(STORAGE_KEYS.AVATAR, null);
    if (legacyV1) {
      const migrated = migrateAvatarConfig(legacyV1);
      writeStorage(key, migrated);
      return migrated;
    }

    return { ...DEFAULT_AVATAR_CONFIG };
  }

  async saveAvatar(uid: string, config: AvatarConfig, actorUid?: string): Promise<AvatarConfig> {
    const normalizedUid = uid.trim();
    if (!normalizedUid) {
      throw new Error('Missing user ID for avatar save.');
    }
    if (actorUid && actorUid.trim() !== normalizedUid) {
      throw new Error('Ownership verification failed: cannot overwrite another user avatar.');
    }

    const validation = validateAvatarConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid avatar configuration: ${validation.errors.join(' ')}`);
    }

    const next: AvatarConfig = {
      ...validation.sanitized,
      schemaVersion: 3,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(avatarStorageKey(normalizedUid), next);
    return next;
  }

  validateAvatar(config: unknown) {
    return validateAvatarConfig(config);
  }

  getAvailableAssets(): AvailableAvatarAssetsSnapshot {
    return {
      baseModels: BASE_CHARACTER_MODELS,
      hairstyles: HAIRSTYLE_REGISTRY,
      clothing: CLOTHING_REGISTRY,
      accessories: ACCESSORY_REGISTRY,
      animations: ANIMATION_REGISTRY,
    };
  }

  getAvatarPresets() {
    return AVATAR_PRESETS;
  }

  async resetAvatar(uid = 'demo-guest-001', actorUid?: string): Promise<AvatarConfig> {
    const normalizedUid = uid.trim() || 'demo-guest-001';
    if (actorUid && actorUid.trim() !== normalizedUid) {
      throw new Error('Ownership verification failed: cannot reset another user avatar.');
    }
    const fresh: AvatarConfig = {
      ...DEFAULT_AVATAR_CONFIG,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(avatarStorageKey(normalizedUid), fresh);
    return fresh;
  }

  async getAvatarConfig(uid: string): Promise<AvatarConfig> {
    return this.getAvatar(uid);
  }

  async saveAvatarConfig(uid: string, config: AvatarConfig): Promise<AvatarConfig> {
    return this.saveAvatar(uid, config, uid);
  }

  async resetDemoAvatar(uid = 'demo-guest-001'): Promise<AvatarConfig> {
    return this.resetAvatar(uid, uid);
  }
}

/** Firebase can implement IAvatarService in Phase 04 without changing the Studio or store. */

export class LocalSettingsService implements ISettingsService {
  async getSettings(): Promise<UserPreferences> {
    return readStorage<UserPreferences>(STORAGE_KEYS.SETTINGS, DEFAULT_USER_PREFERENCES);
  }

  async saveSettings(settings: UserPreferences): Promise<UserPreferences> {
    writeStorage(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }

  async resetSettings(): Promise<UserPreferences> {
    writeStorage(STORAGE_KEYS.SETTINGS, DEFAULT_USER_PREFERENCES);
    return DEFAULT_USER_PREFERENCES;
  }
}
