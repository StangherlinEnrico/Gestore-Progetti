import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import it from './locales/it/translation.json';

const DEBUG = import.meta.env.DEV;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it }
    },
    lng: 'it',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

if (DEBUG) console.log('[i18n] initialized with default language');

export default i18n;