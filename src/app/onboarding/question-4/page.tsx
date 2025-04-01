"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type TrainingFrequency = "twice" | "three_to_four" | "five_plus";

export default function TrainingFrequencyPage() {
  const router = useRouter();
  const { setTrainingFrequency } = useOnboarding();
  const { t } = useLanguage();
  const [selectedFrequency, setSelectedFrequency] =
    useState<TrainingFrequency | null>(null);

  const frequencies = [
    {
      id: "twice",
      label: t("twice_a_week"),
    },
    {
      id: "three_to_four",
      label: t("three_to_four_times"),
    },
    {
      id: "five_plus",
      label: t("five_or_more"),
    },
  ];

  const handleContinue = () => {
    if (selectedFrequency) {
      setTrainingFrequency(selectedFrequency);
      router.push("/onboarding/question-5");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-4/5 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("training_frequency_question")}
            </h1>
            <p className="text-gray-500">
              {t("training_frequency_description")}
            </p>
          </div>

          <div className="w-full space-y-3">
            {frequencies.map((frequency) => (
              <button
                key={frequency.id}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedFrequency === frequency.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setSelectedFrequency(frequency.id as TrainingFrequency)
                }
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedFrequency === frequency.id
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedFrequency === frequency.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium">{frequency.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedFrequency}
            onClick={handleContinue}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
