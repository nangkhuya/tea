import { DEFAULT_AVATAR_CONFIG, ENVIRONMENT_OPTIONS, STORAGE_KEYS } from '../config/constants';
import { DEFAULT_USER_PREFERENCES, DEMO_TEA_ROOMS, DEMO_USER_PROFILE } from '../data/demoData';
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
  return `zen_tea_house_avatar_v2_${encodeURIComponent(uid || 'demo')}`;
}

function migrateAvatarConfig(input: Partial<AvatarConfig> | null | undefined): AvatarConfig {
  const value = input ?? {};
  return {
    ...DEFAULT_AVATAR_CONFIG,
    ...value,
    schemaVersion: 2,
    appearance: { ...DEFAULT_AVATAR_CONFIG.appearance, ...value.appearance },
    body: { ...DEFAULT_AVATAR_CONFIG.body, ...value.body },
    colors: { ...DEFAULT_AVATAR_CONFIG.colors, ...value.colors },
    accessories: Array.isArray(value.accessories) ? value.accessories : DEFAULT_AVATAR_CONFIG.accessories,
    updatedAt: value.updatedAt ?? DEFAULT_AVATAR_CONFIG.updatedAt,
  };
}

export class LocalAvatarService implements IAvatarService {
  async getAvatarConfig(uid: string): Promise<AvatarConfig> {
    const key = avatarStorageKey(uid);
    const stored = readStorage<Partial<AvatarConfig> | null>(key, null);
    if (stored) return migrateAvatarConfig(stored);
    // One-time migration from the Phase 01 shared demo key into this profile's own slot.
    const legacy = readStorage<Partial<AvatarConfig> | null>(STORAGE_KEYS.AVATAR, null);
    if (legacy) {
      const migrated = migrateAvatarConfig(legacy);
      writeStorage(key, migrated);
      return migrated;
    }
    return { ...DEFAULT_AVATAR_CONFIG };
  }

  async saveAvatarConfig(uid: string, config: AvatarConfig): Promise<AvatarConfig> {
    const next: AvatarConfig = {
      ...config,
      schemaVersion: 2,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(avatarStorageKey(uid), next);
    return next;
  }

  async resetDemoAvatar(uid = 'demo-visitor'): Promise<AvatarConfig> {
    const fresh: AvatarConfig = {
      ...DEFAULT_AVATAR_CONFIG,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(avatarStorageKey(uid), fresh);
    return fresh;
  }
}

/** Firebase can implement IAvatarService later without changing the Studio or store. */

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
