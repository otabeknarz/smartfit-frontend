"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t("choose_language")}</h3>
      </div>
      <div className="flex gap-2">
        <Button
          variant={language === "ru" ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => setLanguage("ru")}
        >
          <Globe className="w-4 h-4 mr-2" />
          {t("russian")}
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => setLanguage("en")}
        >
          <Globe className="w-4 h-4 mr-2" />
          {t("english")}
        </Button>
      </div>
    </div>
  );
}
