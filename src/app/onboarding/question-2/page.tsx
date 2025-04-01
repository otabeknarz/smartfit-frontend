"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Timeline = 
  | "one_month" 
  | "two_three_months" 
  | "long_term";

export default function TimelinePage() {
  const router = useRouter();
  const { setTimeline } = useOnboarding();
  const { language } = useLanguage();
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);

  const timelines = [
    { 
      id: "one_month", 
      label: language === 'ru' ? "Через 1 месяц" : "In 1 month" 
    },
    { 
      id: "two_three_months", 
      label: language === 'ru' ? "Через 2–3 месяца" : "In 2-3 months" 
    },
    { 
      id: "long_term", 
      label: language === 'ru' 
        ? "Готов работать(а) в долгосрочной перспективе" 
        : "Ready to work in the long term" 
    },
  ];

  const handleContinue = () => {
    if (selectedTimeline) {
      setTimeline(selectedTimeline);
      router.push("/onboarding/question-3");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-2/4 bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {language === 'ru' 
                ? "Как скоро вы хотите увидеть первые результаты?" 
                : "How soon do you want to see first results?"}
            </h1>
            <p className="text-gray-500">
              {language === 'ru' 
                ? "Это поможет нам составить подходящий план" 
                : "This will help us create a suitable plan for you"}
            </p>
          </div>

          <div className="w-full space-y-3">
            {timelines.map((timeline) => (
              <button
                key={timeline.id}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedTimeline === timeline.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTimeline(timeline.id as Timeline)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedTimeline === timeline.id
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedTimeline === timeline.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium">{timeline.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedTimeline}
            onClick={handleContinue}
          >
            {language === 'ru' ? "Продолжить" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
