interface TelegramWebApps {
  WebApp: {
    ready: () => void;
    openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
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
