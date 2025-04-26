"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";
import { AuthService } from "@/lib/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { submitData } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      await submitData();
      await AuthService.getMe().then((user) => {
        setUser(user);
      });
      router.push("/home");
    } catch (error) {
      console.error("Failed to save data:", error);
      setError(t("something_went_wrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-full bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">{t("all_set")}</h1>
            <p className="text-gray-500">
              {t("profile_ready")}
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={isSubmitting}
            onClick={handleStart}
          >
            {isSubmitting ? t("saving") : t("lets_start")}
          </Button>
        </div>
      </div>
    </div>
  );
}
