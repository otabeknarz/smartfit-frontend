'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function RootPage() {
  const { isAuthenticated, isLoading, hasRegistered } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!hasRegistered) {
        router.push('/onboarding');
      } else {
        router.push('/(protected)/profile');
      }
    }
  }, [isLoading, isAuthenticated, hasRegistered, router]);

  return <LoadingScreen />;
} 