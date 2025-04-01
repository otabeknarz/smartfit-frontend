import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";

const poppinsFont = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "SmartFit",
  description:
    "SmartFit is a Telegram Web App for managing your fitness goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
      </head>
      <body
        className={`${poppinsFont.variable} antialiased font-[family-name:var(--font-open-sans)]`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
