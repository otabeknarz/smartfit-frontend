"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import BottomBar from "@/components/bottomBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return (
    <>
      <main className="pt-[64px] pb-[76px]">
        {children}
      </main>
      <BottomBar />
    </>
  );
} 