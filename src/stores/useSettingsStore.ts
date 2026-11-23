import { create } from 'zustand';
import { DEFAULT_USER_PREFERENCES } from '../data/demoData';
import { services } from '../services/serviceRegistry';
import type { UserPreferences } from '../types/domain';

function syncDocumentTheme(themeMode: UserPreferences['themeMode'], language: UserPreferences['language']) {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  if (themeMode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.lang = language;
}

interface SettingsState {
  settings: UserPreferences;
  hydrated: boolean;
  hydrateSettings: () => Promise<void>;
  updateSettings: (patch: Partial<UserPreferences>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_USER_PREFERENCES,
  hydrated: false,
  hydrateSettings: async () => {
    const settings = await services.settingsService.getSettings();
    syncDocumentTheme(settings.themeMode, settings.language);
    set({ settings, hydrated: true });
  },
  updateSettings: async (patch) => {
    const next = { ...get().settings, ...patch };
    syncDocumentTheme(next.themeMode, next.language);
    set({ settings: next });
    await services.settingsService.saveSettings(next);
  },
  resetSettings: async () => {
    const fresh = await services.settingsService.resetSettings();
    syncDocumentTheme(fresh.themeMode, fresh.language);
    set({ settings: fresh });
  },
}));
