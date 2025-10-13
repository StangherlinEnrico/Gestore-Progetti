import { useState, useEffect, useCallback } from 'react';
import { db, type Settings } from '../db/database';

const DEBUG = import.meta.env.DEV;

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    if (DEBUG) console.log('[useSettings] fetchSettings: start');
    try {
      setLoading(true);
      setError(null);
      if (DEBUG) console.log('[useSettings] fetchSettings: calling db.getSettings()');
      const data = await db.getSettings();
      if (DEBUG) console.log('[useSettings] fetchSettings: data received', data);
      setSettings(data);
    } catch (err) {
      if (DEBUG) console.error('[useSettings] fetchSettings: error', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
    } finally {
      setLoading(false);
      if (DEBUG) console.log('[useSettings] fetchSettings: complete');
    }
  }, []);

  useEffect(() => {
    if (DEBUG) console.log('[useSettings] useEffect: mounting, fetching settings');
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (payload: Partial<Settings>) => {
    if (DEBUG) console.log('[useSettings] updateSettings: start', payload);
    try {
      if (DEBUG) console.log('[useSettings] updateSettings: calling db.updateSettings()');
      await db.updateSettings(payload);
      if (DEBUG) console.log('[useSettings] updateSettings: success, refetching');
      await fetchSettings();
    } catch (err) {
      if (DEBUG) console.error('[useSettings] updateSettings: error', err);
      throw err instanceof Error ? err : new Error('Failed to update settings');
    }
  }, [fetchSettings]);

  const refetch = useCallback(() => {
    if (DEBUG) console.log('[useSettings] refetch: manual refetch triggered');
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch
  };
}