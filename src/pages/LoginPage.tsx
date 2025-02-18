import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
          };
        };
      };
    };
  }
}

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleTelegramLogin = async () => {
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      
      if (telegramUser?.id) {
        try {
          await login(telegramUser.id.toString());
          navigate('/dashboard');
        } catch (error: any) {
          alert(error.response?.data?.error || 'Login failed');
        }
      } else {
        alert('Please open this page from Telegram WebApp');
      }
    };

    if (!isAuthenticated) {
      handleTelegramLogin();
    }
  }, [isAuthenticated, login, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Loading...</h1>
        <p>Please wait while we authenticate you through Telegram</p>
      </div>
    </div>
  );
}; 