/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface Admin {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (admin: Admin) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  isLoading: true,
  isAuthenticated: false,
  setAuth: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(API_BASE_URL + '/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setAdmin(json.data?.admin || null);
        } else {
          setAdmin(null);
        }
      } catch {
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    await fetch(API_BASE_URL + '/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setAdmin(null);
  };

  const setAuth = (adminData: Admin) => {
    setAdmin(adminData);
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
