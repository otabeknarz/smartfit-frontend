'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function RootPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!user?.gender || !user?.age || !user?.height) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return <LoadingScreen />;
} 