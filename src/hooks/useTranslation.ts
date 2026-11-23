import { TRANSLATIONS } from '../config/i18n';
import { useSettingsStore } from '../stores/useSettingsStore';

export function useTranslation() {
  const language = useSettingsStore((state) => state.settings.language);
  return {
    language,
    t: TRANSLATIONS[language],
  };
}
