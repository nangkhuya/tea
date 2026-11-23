import { create } from 'zustand';
import { DEFAULT_AVATAR_CONFIG } from '../config/constants';
import { services } from '../services/serviceRegistry';
import type { AvatarConfig } from '../types/domain';

interface AvatarState {
  config: AvatarConfig;
  saving: boolean;
  hydrateAvatar: (uid: string) => Promise<void>;
  updateDraft: (patch: Partial<AvatarConfig>) => void;
  saveDraft: (uid: string) => Promise<boolean>;
  resetDraft: (uid?: string) => Promise<void>;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  config: DEFAULT_AVATAR_CONFIG,
  saving: false,
  hydrateAvatar: async (uid) => {
    const config = await services.avatarService.getAvatarConfig(uid);
    set({ config });
  },
  updateDraft: (patch) =>
    set((state) => ({
      config: { ...state.config, ...patch },
    })),
  saveDraft: async (uid) => {
    set({ saving: true });
    try {
      const saved = await services.avatarService.saveAvatarConfig(uid, get().config);
      set({ config: saved, saving: false });
      return true;
    } catch {
      set({ saving: false });
      return false;
    }
  },
  resetDraft: async (uid) => {
    const fresh = await services.avatarService.resetDemoAvatar(uid);
    set({ config: fresh });
  },
}));
