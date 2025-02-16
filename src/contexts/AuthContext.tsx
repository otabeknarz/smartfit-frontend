'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';
import { API_URLS } from '@/constants/api';

interface User {
  id: string;
  name: string;
  username: string;
  phone_number: string;
  gender: string;
  age: number;
  height: number;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initTelegram = async () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      const user = tg.initDataUnsafe?.user;
      if (user?.id) {
        try {
          // Auto-login with Telegram user ID
          await axios.post(API_URLS.LOGIN, { id: user.id.toString() });
          await checkAuth();
        } catch (error) {
          console.error('Failed to login:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(API_URLS.GET_ME);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get(API_URLS.LOGOUT);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 