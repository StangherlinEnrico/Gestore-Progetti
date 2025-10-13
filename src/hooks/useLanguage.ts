import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../db/database';

const DEBUG = import.meta.env.DEV;

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(async (language: string) => {
    if (DEBUG) console.log('[useLanguage] changeLanguage:', language);
    
    try {
      await db.updateSettings({
        preferences: { language }
      });
      
      await i18n.changeLanguage(language);
      
      if (DEBUG) console.log('[useLanguage] changeLanguage: success');
    } catch (error) {
      if (DEBUG) console.error('[useLanguage] changeLanguage: error', error);
      throw error;
    }
  }, [i18n]);

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    availableLanguages: Object.keys(i18n.options.resources || {})
  };
}