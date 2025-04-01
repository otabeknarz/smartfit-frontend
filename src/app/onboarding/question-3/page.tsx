"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export default function ExperiencePage() {
  const router = useRouter();
  const { setExperienceLevel } = useOnboarding();
  const { t, language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(
    null
  );

  const experienceLevels = [
    {
      id: "beginner",
      label: t("never"),
    },
    {
      id: "intermediate",
      label: t("tried_irregularly"),
    },
    {
      id: "advanced",
      label: t("train_regularly"),
    },
  ];

  const handleContinue = () => {
    if (selectedLevel) {
      setExperienceLevel(selectedLevel);
      router.push("/onboarding/question-4");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-3/4 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("experience_and_fitness_level")}
            </h1>
            <p className="text-gray-500">{t("have_you_done_sports_before")}</p>
          </div>

          <div className="w-full space-y-3">
            {experienceLevels.map((level) => (
              <button
                key={level.id}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedLevel === level.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedLevel(level.id as ExperienceLevel)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedLevel === level.id
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedLevel === level.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium">{level.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedLevel}
            onClick={handleContinue}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
