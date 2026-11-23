import { create } from 'zustand';
import { DEFAULT_AVATAR_CONFIG } from '../config/constants';
import {
  characterIdForPresentation,
  randomizeAvatarConfig,
  sanitizeAvatarConfig,
} from '../features/avatar/services/avatarValidation';
import type { AvatarPreset, GenderPresentation } from '../features/avatar/types/avatarTypes';
import { services } from '../services/serviceRegistry';
import type { AvatarConfig } from '../types/domain';

interface AvatarState {
  config: AvatarConfig;
  lastSavedConfig: AvatarConfig;
  hydrated: boolean;
  saving: boolean;
  error: string | null;
  hydrateAvatar: (uid: string) => Promise<void>;
  updateDraft: (patch: Partial<AvatarConfig>) => void;
  setGenderPresentation: (presentation: GenderPresentation) => void;
  applyPreset: (preset: AvatarPreset) => void;
  randomizeDraft: () => void;
  saveDraft: (uid: string, actorUid?: string) => Promise<{ ok: boolean; error?: string }>;
  resetDraft: (uid?: string, actorUid?: string) => Promise<void>;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  config: DEFAULT_AVATAR_CONFIG,
  lastSavedConfig: DEFAULT_AVATAR_CONFIG,
  hydrated: false,
  saving: false,
  error: null,
  hydrateAvatar: async (uid) => {
    try {
      const loaded = await services.avatarService.getAvatar(uid);
      set({
        config: loaded,
        lastSavedConfig: loaded,
        hydrated: true,
        error: null,
      });
    } catch (error) {
      set({
        hydrated: true,
        error: error instanceof Error ? error.message : 'Không thể nạp cấu hình nhân vật.',
      });
    }
  },
  updateDraft: (patch) =>
    set((state) => ({
      config: sanitizeAvatarConfig({ ...state.config, ...patch }),
      error: null,
    })),
  setGenderPresentation: (presentation) =>
    set((state) => ({
      config: sanitizeAvatarConfig({
        ...state.config,
        genderPresentation: presentation,
        characterId: characterIdForPresentation(presentation),
      }),
      error: null,
    })),
  applyPreset: (preset) =>
    set({
      config: sanitizeAvatarConfig({
        ...preset.config,
        schemaVersion: 3,
        updatedAt: new Date().toISOString(),
      }),
      error: null,
    }),
  randomizeDraft: () =>
    set({
      config: randomizeAvatarConfig(),
      error: null,
    }),
  saveDraft: async (uid, actorUid) => {
    set({ saving: true, error: null });
    try {
      const saved = await services.avatarService.saveAvatar(uid, get().config, actorUid ?? uid);
      set({
        config: saved,
        lastSavedConfig: saved,
        saving: false,
        error: null,
      });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lưu cấu hình thất bại.';
      set({ saving: false, error: message });
      return { ok: false, error: message };
    }
  },
  resetDraft: async (uid, actorUid) => {
    const targetUid = uid ?? 'demo-guest-001';
    const fresh = await services.avatarService.resetAvatar(targetUid, actorUid ?? targetUid);
    set({
      config: fresh,
      lastSavedConfig: fresh,
      error: null,
    });
  },
}));
