"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeightPage() {
  const router = useRouter();
  const { setHeight } = useOnboarding();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleContinue = () => {
    const height = parseInt(value);
    if (height < 100 || height > 250) {
      setError(t("enter_valid_height"));
      return;
    }

    setHeight(height);
    router.push("/onboarding/question-1");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-2 bg-gray-100">
        <div className="h-full w-full bg-primary rounded-r-full" />
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Ruler className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("whats_your_height")}
            </h1>
            <p className="text-gray-500">
              {t("height_helps_calculate")}
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="relative">
              <Input
                type="number"
                placeholder={t("enter_your_height")}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                className="text-center text-lg h-14 pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {t("cm")}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full h-14 text-lg"
            disabled={!value}
            onClick={handleContinue}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
