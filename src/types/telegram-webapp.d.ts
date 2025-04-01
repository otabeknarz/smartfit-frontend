interface TelegramWebApps {
  WebApp: {
    ready: () => void;
    openLink: (link: any) => void;
    openTelegramLink: (link: string) => void;
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
