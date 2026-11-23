import { create } from 'zustand';
import { DEMO_USER_PROFILE } from '../data/demoData';
import { services } from '../services/serviceRegistry';
import type { UserSession } from '../types/domain';

interface SessionState {
  session: UserSession;
  hydrated: boolean;
  hydrateSession: () => Promise<void>;
  enterGuestDemo: () => Promise<void>;
  resetSession: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: {
    mode: 'guest-demo',
    isAuthenticated: false,
    uid: DEMO_USER_PROFILE.uid,
    provider: 'guest-demo',
    hasEnteredSanctuary: false,
  },
  hydrated: false,
  hydrateSession: async () => {
    const session = await services.authService.getSession();
    set({ session, hydrated: true });
  },
  enterGuestDemo: async () => {
    const session = await services.authService.enterGuestDemo();
    set({ session });
  },
  resetSession: async () => {
    const session = await services.authService.signOutDemo();
    set({ session });
  },
}));
