/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from 'react';
import { AuthProvider } from './authStore';
import { SidebarProvider } from './sidebarStore';
import { ThemeProvider } from './themeStore';
import { PostProvider } from './postStore';
import { CategoryProvider } from './categoryStore';
import { ProfileProvider } from './profileStore';
import { SettingsProvider } from './settingsStore';

export * from './authStore';
export * from './sidebarStore';
export * from './themeStore';
export * from './postStore';
export * from './categoryStore';
export * from './profileStore';
export * from './settingsStore';

export function GlobalStoreProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <ProfileProvider>
            <CategoryProvider>
              <PostProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </PostProvider>
            </CategoryProvider>
          </ProfileProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
