"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return <div className="container mx-auto max-w-screen-sm">{children}</div>;
} 