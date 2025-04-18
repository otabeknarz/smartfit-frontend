"use client";

import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Steps */}
      <div className="h-2 bg-gray-100">
        <div className="h-full w-1/4 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("welcome_to_smartfit")}
            </h1>
            <p className="text-gray-500">
              {t("personal_fitness_journey")}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-auto">
          <Button 
            className="w-full h-14 text-lg"
            onClick={() => router.push('/onboarding/gender')}
          >
            {t("get_started")}
          </Button>
        </div>
      </div>
    </div>
  );
}