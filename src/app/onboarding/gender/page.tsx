"use client";

import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GenderPage() {
  const router = useRouter();
  const { userData, setGender } = useOnboarding();
  const { t } = useLanguage();

  const handleSelect = (gender: string) => {
    setGender(gender);
    router.push("/onboarding/age");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Steps */}
      <div className="h-2 bg-gray-100">
        <div className="h-full w-2/4 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6 container mx-auto min-w-screen-lg">
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <UserCircle2 className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("whats_your_gender")}
            </h1>
            <p className="text-gray-500">{t("personalize_fitness_journey")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              variant={userData.gender === "MALE" ? "default" : "outline"}
              className="h-14 text-lg"
              onClick={() => handleSelect("MALE")}
            >
              {t("male")}
            </Button>
            <Button
              variant={userData.gender === "FEMALE" ? "default" : "outline"}
              className="h-14 text-lg"
              onClick={() => handleSelect("FEMALE")}
            >
              {t("female")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
