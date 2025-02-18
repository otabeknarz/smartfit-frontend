import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { Inter } from 'next/font/google';

const poppinsFont = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "SmartFit",
  description: "SmartFit is a Telegram Web App for managing your fitness goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
      </head>
      <body
        className={`${poppinsFont.variable} antialiased font-[family-name:var(--font-poppins)] ${inter.className}`}
      >
        <AuthProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
