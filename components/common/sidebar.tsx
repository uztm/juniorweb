"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FlaskConical,
  Gamepad2,
  Trophy,
  CalendarDays,
  ShieldCheck,
  Headphones,
  User,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils"; // optional utility for merging classNames
import { Button } from "../ui/button";
import { LogOutDialog } from "./logoutdialog";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/" },
  // { label: "Mening darslarim", icon: BookOpen, href: "/dashboard/#" },
  // { label: "Test va mashqlar", icon: FlaskConical, href: "/dashboard/#" },
  // {
  //   label: "O’yin va ball tizimi",
  //   icon: Gamepad2,
  //   href: "#",
  //   children: [
  //     { label: "Ballar", href: "/dashboard/games/points" },
  //     { label: "Mini o'yinlar", href: "/dashboard/games/mini" },
  //   ],
  // },
  { label: "Yutuqlar", icon: Trophy, href: "/dashboard/achievements" },
  // { label: "Kalendar", icon: CalendarDays, href: "/dashboard/#" },
  { label: "Xavfsizlik", icon: ShieldCheck, href: "/dashboard/security" },
  // { label: "Audio va hikoyalar", icon: Headphones, href: "/dashboard/#" },
  { label: "Market", icon: ShoppingCart, href: "/dashboard/market" },
  { label: "Profil", icon: User, href: "/dashboard/profile" },
];

type Props = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleMenu: (label: string) => void;
};

export default function Sidebar({
  isCollapsed,
  toggleMenu,
  setIsCollapsed,
}: Props) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const normalize = (path: string) => path.replace(/\/+$/, "");

  const isActive = (href: string) => {
    const current = normalize(pathname);
    const target = normalize(href);
    return current === target;
  };

  return (
    <div className="hidden md:flex">
      <aside
        className={cn(
          "relative h-screen border-r bg-white shadow-sm transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Floating Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute cursor-pointer top-4 -right-4 z-50 bg-white border rounded-full shadow w-8 h-8 flex items-center justify-center"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <ChevronsLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo */}
        <div className="px-4 py-6 flex items-center justify-center">
          {!isCollapsed && (
            <img src="/assets/logo.png" className="w-30" alt="" />
          )}
        </div>

        <nav className="px-2 ">
          <ul className="space-y-1 relative min-h-screen">
            {navLinks.map(({ label, icon: Icon, href }) => {
              const active = isActive(href);

              const isOpen = openMenus.includes(label);

              return (
                <li key={label}>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-lg cursor-pointer transition-colors px-3 py-2",
                      active
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50"
                    )}
                  >
                    <Link
                      href={href !== "#" ? href : pathname}
                      className="flex items-center gap-3 flex-1 truncate"
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{label}</span>
                      )}
                    </Link>
                  </div>
                </li>
              );
            })}

            <div className="w-full absolute bottom-0">
              <LogOutDialog />
            </div>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
