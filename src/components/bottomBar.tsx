"use client";

import { Home, BookOpen, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const bottomBarItems = [
  {
    icon: Home,
    labelKey: "home",
    href: "/home",
  },
  {
    icon: BookOpen,
    labelKey: "courses",
    href: "/courses",
  },
  {
    icon: ShoppingBag,
    labelKey: "shop",
    href: "/shop",
  },
  {
    icon: User,
    labelKey: "profile",
    href: "/profile",
  },
];

interface BottomBarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

function BottomBarItem({ icon: Icon, label, href, isActive }: BottomBarItemProps) {
  return (
    <Link 
      href={href} 
      className={`
        flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl
        transition-all duration-200 relative
        ${isActive 
          ? 'text-primary' 
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/80'
        }
      `}
    >
      {/* Active Indicator */}
      {isActive && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
      
      {/* Icon with animation */}
      <div className={`
        relative transition-transform duration-200
        ${isActive ? 'scale-110' : 'scale-100'}
      `}>
        <Icon className={`
          w-5 h-5 transition-all duration-200
          ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}
        `} />
      </div>

      {/* Label */}
      <p className={`
        text-xs transition-all duration-200
        ${isActive ? 'font-medium' : 'font-normal'}
      `}>
        {label}
      </p>
    </Link>
  );
}

export default function BottomBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <section className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-t border-gray-200">
      <div className="container flex items-center justify-around mx-auto max-w-screen-sm py-2">
        {bottomBarItems.map((item) => (
          <BottomBarItem 
            key={item.labelKey} 
            icon={item.icon}
            label={t(item.labelKey)}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </div>

      {/* Safe Area Spacing for Mobile Devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </section>
  );
}
