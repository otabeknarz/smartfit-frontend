'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/apiService';
import { TokenService } from '@/lib/tokenService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (telegramId: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    setIsAuthenticated(!!TokenService.getToken());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated && !user) {
        try {
          const userData = await AuthService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          setIsAuthenticated(false);
          TokenService.clearToken();
          router.push('/login');
        }
      }
    };

    loadUser();
  }, [isAuthenticated, router]);

  const login = async (telegramId: string) => {
    try {
      const response = await AuthService.login(telegramId);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Failed to login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user,
      setUser,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 