declare global {
  interface TelegramWebApps {
    WebApp: {
      initData: string;
      ready: () => void;
      openLink: (link: string) => void;
      openTelegramLink: (link: string, options?: { tryInstantView?: boolean }) => void;
      initDataUnsafe: {
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
          is_premium?: boolean;
          photo_url?: string;
        };
      };
    };
  }

  interface Window {
    Telegram: TelegramWebApps;
  }
}

export {};
