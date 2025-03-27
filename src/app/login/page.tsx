"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleTelegramLogin = async () => {
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (true) {
        try {
          await login("7908233254");
          router.push("/home");
        } catch (error: any) {
          alert(error.response?.data?.error || "Login failed");
        }
      } else {
        alert("Please open this page from Telegram WebApp");
      }
    };

    if (!isAuthenticated) {
      handleTelegramLogin();
    }
  }, [isAuthenticated, login, router]);

  if (isAuthenticated) {
    router.push("/home");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Please wait while we authenticate you through Telegram
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
