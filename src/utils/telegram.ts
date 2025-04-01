/**
 * Opens a link in the Telegram browser
 * @param url The URL to open
 * @param options Optional configuration options
 */
export function openTelegramLink(url: string, options?: { tryInstantView?: boolean }): void {
  try {
    // Try to use window.Telegram
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
