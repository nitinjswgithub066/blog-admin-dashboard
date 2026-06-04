import { createContext, useContext, ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants';
import { useLocalStorage } from '../hooks';
import { AdminNotification } from '../types/notification.types';
import { initialNotifications } from '../data/notificationsData';

interface NotificationsContextType {
  notifications: AdminNotification[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearHistory: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useLocalStorage<AdminNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    initialNotifications
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearHistory = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, markAllAsRead, markAsRead, clearHistory, unreadCount }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsStore() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotificationsStore must be used within NotificationsProvider');
  return context;
}
