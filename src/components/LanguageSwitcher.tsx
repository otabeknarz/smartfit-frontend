"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "en" : "ru");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full ${className}`}
      onClick={toggleLanguage}
      title={t("choose_language")}
      aria-label={t("choose_language")}
    >
      <Globe className="h-5 w-5" />
      <span className="ml-1 text-xs font-medium">{language.toUpperCase()}</span>
    </Button>
  );
}
