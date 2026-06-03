import { createContext, useContext, type ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants';
import { useLocalStorage } from '../hooks';
import { mockAdminProfile } from '../data/profileData';
import type { AdminProfile } from '../types';

interface ProfileContextType {
  profile: AdminProfile;
  updateProfile: (updates: Partial<AdminProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<AdminProfile>(STORAGE_KEYS.PROFILE, mockAdminProfile);

  const updateProfile = (updates: Partial<AdminProfile>) => {
    setProfile((prev: AdminProfile) => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileStore() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfileStore must be used within ProfileProvider');
  return context;
}
