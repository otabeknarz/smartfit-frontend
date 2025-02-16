'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';
import { API_URLS } from '@/constants/api';

interface LoginResponse {
  message: string;
  has_successfully_registered: boolean;
}

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
  login: (userId: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const login = async (userId: string) => {
    try {
      const response = await axios.post<LoginResponse>(
        API_URLS.LOGIN, 
        { id: userId }
      );
      
      await checkAuth();
      return response.data.has_successfully_registered;
    } catch (error) {
      throw error;
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
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
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