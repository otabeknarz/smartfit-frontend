"use client";

import Navbar from "@/components/navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, CalendarClock } from "lucide-react";

export default function ShopPage() {
  const { t } = useLanguage();
  return (
    <>
      <Navbar title={t("shop")} />
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto text-center space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("shop_coming_soon")}
            </h1>
            <p className="text-gray-500 mb-8 max-w-sm">
              {t("shop_coming_soon_message")}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-1/2">
              <CalendarClock className="w-8 h-8 text-primary/80 mb-3 mx-auto" />
              <h3 className="font-medium text-gray-900 mb-1">
                {t("launch_date")}
              </h3>
              <p className="text-gray-500 text-sm">{t("summer_2025")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
