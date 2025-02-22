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
      } else if (user?.age === null || user?.gender === null || user?.height === null) {
        router.push('/onboarding');
      } else {
        router.push('/home');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return <LoadingScreen />;
} 