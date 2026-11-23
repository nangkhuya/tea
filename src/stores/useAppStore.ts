import { create } from 'zustand';
import type { NotificationMessage } from '../types/domain';

interface AppState {
  notifications: NotificationMessage[];
  mobileMenuOpen: boolean;
  pushNotification: (message: Omit<NotificationMessage, 'id'>) => void;
  dismissNotification: (id: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  notifications: [],
  mobileMenuOpen: false,
  pushNotification: (message) => {
    const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      notifications: [...state.notifications.slice(-2), { ...message, id }],
    }));
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((item) => item.id !== id),
        }));
      }, 4200);
    }
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}));
