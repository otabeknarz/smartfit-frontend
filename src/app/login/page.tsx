"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const handleTelegramLogin = async () => {
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (telegramUser) {
        try {
          await login(telegramUser?.id.toString());
          router.push("/home");
        } catch (error: any) {
          alert(error.response?.data?.error || t("login_failed"));
        }
      } else {
        alert(t("open_from_telegram"));
      }
    };

    if (!isAuthenticated) {
      handleTelegramLogin();
    }
  }, [isAuthenticated, login, router, t]);

  if (isAuthenticated) {
    router.push("/home");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t("loading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {t("please_wait_telegram_auth")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
