"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface UserData {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photo_url?: string;
}

export default function Navbar({ title }: { title: string }) {
  const [userData, setUserData] = useState<UserData>({});
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserData({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          languageCode: user.language_code,
          isPremium: user.is_premium,
          photo_url: user.photo_url,
        });
      }
    }
  }, []);

  return (
    <>
      <section className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="container mx-auto max-w-screen-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Section with Back Button and Title */}
            <div className="flex items-center gap-3">
              {!isHome && (
                <button 
                  onClick={() => router.back()}
                  className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                {userData.firstName && (
                  <p className="text-xs text-gray-500">
                    Welcome back, {userData.firstName}
                    {userData.isPremium && " ⭐️"}
                  </p>
                )}
              </div>
            </div>

            {/* Right Section Avatar */}
            <div className="flex items-center gap-3">              
              <Avatar className="h-9 w-9 ring-2 ring-gray-100 transition-transform hover:scale-105">
                <AvatarImage 
                  src={userData?.photo_url} 
                  alt={userData?.firstName || "User"} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {userData?.firstName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

