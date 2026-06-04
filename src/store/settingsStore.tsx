/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants';
import { useLocalStorage } from '../hooks';
import type { AdminSettings } from '../types/settings.types';
import { initialSettings } from '../data/settingsData';

interface SettingsContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AdminSettings>(
    STORAGE_KEYS.SETTINGS,
    initialSettings
  );

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(initialSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsStore() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettingsStore must be used within SettingsProvider');
  return context;
}
