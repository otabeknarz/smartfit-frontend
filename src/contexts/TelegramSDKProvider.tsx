"use client";

import { init } from "@telegram-apps/sdk-react";
import { ReactNode, useEffect, useState } from "react";

interface TelegramSDKProviderProps {
  children: ReactNode;
}

export function TelegramSDKProvider({ children }: TelegramSDKProviderProps) {
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if we're running in Telegram environment
    const isTelegramEnvironment = typeof window !== 'undefined' && window.Telegram?.WebApp;
    
    if (isTelegramEnvironment) {
      try {
        // Initialize the Telegram SDK only if we're in Telegram environment
        init();
      } catch (error) {
        console.error("Failed to initialize Telegram SDK:", error);
        setInitError(error instanceof Error ? error : new Error(String(error)));
      }
    } else {
      console.log("Not running in Telegram environment, skipping SDK initialization");
    }
  }, []);

  // If there was an error initializing the SDK, we still render the children
  // since we have our fallback mechanisms in place
  if (initError) {
    console.warn("Telegram SDK initialization error:", initError.message);
  }

  return <>{children}</>;
}
