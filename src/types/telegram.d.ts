declare global {
  interface TelegramWebApps {
    WebApp: {
      initData: string;
      initDataUnsafe: {
        user?: {
          id: number;
        };
      };
    };
  }
  
  interface Window {
    Telegram: TelegramWebApps;
  }
}

export {}; 