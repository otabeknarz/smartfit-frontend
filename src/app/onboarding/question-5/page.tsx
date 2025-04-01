"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboarding } from "@/contexts/OnboardingContext";

type TrainerConsultation = "yes" | "no";

export default function TrainerConsultationPage() {
  const router = useRouter();
  const { setConsultation } = useOnboarding();
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] =
    useState<TrainerConsultation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [
    {
      id: "yes",
      label: t("yes"),
    },
    {
      id: "no",
      label: t("no"),
    },
  ];

  const handleContinue = async () => {
    setIsSubmitting(true);
    if (selectedOption) {
      setConsultation(selectedOption);
      router.push("/onboarding/done");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-full bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <UserCheck className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("trainer_consultation_question")}
            </h1>
            <p className="text-gray-500">
              {t("trainer_consultation_description")}
            </p>
          </div>

          <div className="w-full space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setSelectedOption(option.id as TrainerConsultation)
                }
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedOption === option.id
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedOption || isSubmitting}
            onClick={handleContinue}
          >
            {isSubmitting ? t("processing") : t("finish")}
          </Button>
        </div>
      </div>
    </div>
  );
}
