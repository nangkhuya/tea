import { create } from 'zustand';
import { DEMO_USER_PROFILE } from '../data/demoData';
import { services } from '../services/serviceRegistry';
import type { UserProfile } from '../types/domain';

interface ProfileState {
  profile: UserProfile;
  loading: boolean;
  error: string | null;
  hydrateProfile: (uid: string) => Promise<void>;
  updateProfile: (
    patch: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'favoriteTea'>>,
  ) => Promise<boolean>;
  resetDemoProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: DEMO_USER_PROFILE,
  loading: false,
  error: null,
  hydrateProfile: async (uid) => {
    set({ loading: true, error: null });
    try {
      const profile = await services.userProfileService.getProfile(uid);
      set({ profile, loading: false });
    } catch {
      set({ loading: false, error: 'Không thể tải hồ sơ người dùng.' });
    }
  },
  updateProfile: async (patch) => {
    set({ loading: true, error: null });
    try {
      const updated = await services.userProfileService.updateProfile(get().profile.uid, patch);
      set({ profile: updated, loading: false });
      return true;
    } catch {
      set({ loading: false, error: 'Không thể lưu thay đổi hồ sơ.' });
      return false;
    }
  },
  resetDemoProfile: async () => {
    const fresh = await services.userProfileService.resetDemoProfile();
    set({ profile: fresh, error: null });
  },
}));
