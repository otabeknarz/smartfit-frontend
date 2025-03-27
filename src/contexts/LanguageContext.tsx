"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ru" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default translations to use before the dynamic imports are complete
const defaultTranslations = {
  ru: {},
  en: {}
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("ru");
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language preference from localStorage if available
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("smartfit-language");
      if (savedLanguage && (savedLanguage === "ru" || savedLanguage === "en")) {
        setLanguage(savedLanguage as Language);
      }
    }

    // Load translations
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Dynamic imports for translations
        const ruModule = await import('../translations/ru');
        const enModule = await import('../translations/en');
        
        setTranslations({
          ru: ruModule.default,
          en: enModule.default,
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("smartfit-language", language);
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (isLoading || !translations[language]) {
      return key;
    }
    
    return translations[language][key] || translations["ru"][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
