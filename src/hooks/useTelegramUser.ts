"use client";

import { useEffect, useState } from "react";
import { getTelegramUser } from "@/utils/telegram";

export interface TelegramUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
}

export function useTelegramUser(): TelegramUser {
  const [userData, setUserData] = useState<TelegramUser>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Call ready() to tell Telegram that our app is ready
      if (typeof window !== "undefined" && window.Telegram?.WebApp?.ready) {
        try {
          window.Telegram.WebApp.ready();
        } catch (readyError) {
          console.warn("Error calling Telegram WebApp ready():", readyError);
        }
      }

      // Get user data from Telegram
      const user = getTelegramUser();
      if (user) {
        setUserData(user);
      } else {
        console.log("No user data available in Telegram WebApp");
      }
    } catch (e) {
      console.error("Error in useTelegramUser hook:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  return userData;
}
