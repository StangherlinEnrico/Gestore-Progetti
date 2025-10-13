import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import it from './locales/it/translation.json';
import en from './locales/en/translation.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      it: { translation: it },
      en: { translation: en }
    },
    lng: 'it',
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;