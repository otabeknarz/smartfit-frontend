"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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

  return (
    <OnboardingProvider>
      <div className="relative container mx-auto max-w-screen-sm">
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>
        {children}
      </div>
    </OnboardingProvider>
  );
}