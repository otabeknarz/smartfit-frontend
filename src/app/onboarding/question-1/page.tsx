"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";
import { Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type FitnessGoal =
  | "weight_loss"
  | "muscle_gain"
  | "endurance"
  | "strength"
  | "maintenance";

export default function GoalsPage() {
  const router = useRouter();
  const { setGoal } = useOnboarding();
  const { language } = useLanguage();
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);

  const goals = [
    {
      id: "weight_loss",
      label: language === "ru" ? "Похудение" : "Weight Loss",
    },
    {
      id: "muscle_gain",
      label: language === "ru" ? "Набор мышечной массы" : "Muscle Gain",
    },
    {
      id: "endurance",
      label: language === "ru" ? "Улучшение выносливости" : "Improve Endurance",
    },
    {
      id: "strength",
      label: language === "ru" ? "Повышение силы" : "Increase Strength",
    },
    {
      id: "maintenance",
      label: language === "ru" ? "Поддержание формы" : "Maintain Fitness",
    },
  ];

  const handleContinue = () => {
    if (selectedGoal) {
      setGoal(selectedGoal);
      router.push("/onboarding/question-2");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-1/4 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {language === "ru"
                ? "Какая ваша основная цель?"
                : "What is your main goal?"}
            </h1>
            <p className="text-gray-500">
              {language === "ru"
                ? "Это поможет нам подобрать подходящие тренировки"
                : "This will help us select suitable workouts for you"}
            </p>
          </div>

          <div className="w-full space-y-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedGoal === goal.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedGoal(goal.id as FitnessGoal)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedGoal === goal.id
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedGoal === goal.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium">{goal.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedGoal}
            onClick={handleContinue}
          >
            {language === "ru" ? "Продолжить" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
