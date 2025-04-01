import { init } from "@telegram-apps/sdk-react";

/**
 * Opens a link in the Telegram browser
 * @param url The URL to open
 * @param options Optional configuration options
 */
export function openTelegramLink(url: string, options?: { tryInstantView?: boolean }): void {
  try {
    // Use window.Telegram for now as it's more reliable
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url, options);
      return;
    }
    
    // Fallback to regular window.open
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error opening Telegram link:", error);
    // Fallback to regular window.open
    window.open(url, "_blank");
  }
}

/**
 * Initializes the Telegram SDK
 */
export function initTelegramSDK(): void {
  try {
    init();
  } catch (error) {
    console.error("Error initializing Telegram SDK:", error);
  }
}

/**
 * Gets the Telegram user data
 */
export function getTelegramUser() {
  try {
    // Use window.Telegram for now as it's more reliable
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
        isPremium: user.is_premium,
        photoUrl: user.photo_url,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting Telegram user:", error);
    return null;
  }
}
