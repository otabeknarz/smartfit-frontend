"use client";

import { useEffect, useState } from "react";

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
      // Check if we're running in Telegram environment
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Call ready() to tell Telegram that our app is ready
        try {
          tg.ready();
        } catch (readyError) {
          console.warn("Error calling Telegram WebApp ready():", readyError);
        }

        // Get user data from Telegram
        const user = tg.initDataUnsafe?.user;
        if (user) {
          setUserData({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            languageCode: user.language_code,
            isPremium: user.is_premium,
            photoUrl: user.photo_url,
          });
        } else {
          console.log("No user data available in Telegram WebApp");
        }
      } else {
        console.log("Not running in Telegram environment");
      }
    } catch (e) {
      console.error("Error in useTelegramUser hook:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  return userData;
}
