"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  if (isAuthenticated) {
    router.push("/home");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t("logout")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {t("login_again")}?
          </p>
          <Button onClick={() => router.push("/login")}>{t("login")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
